/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps, MutableState, Tools } from "@wso2is/form";
import {
    Heading,
    LinkButton,
    PrimaryButton
} from "@wso2is/react-components";
import Ajv, { ErrorObject, ValidateFunction } from "ajv";
import { AxiosError } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import merge from "lodash-es/merge";
import omit from "lodash-es/omit";
import set from "lodash-es/set";
import unset from "lodash-es/unset";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, ModalProps } from "semantic-ui-react";
import { ApplicationFormDynamicField } from "./application-form-dynamic-field";
import { updateApplicationDetails, updateAuthProtocolConfig } from "../../api";
import { useGetApplication } from "../../api/use-get-application";
import useGetApplicationInboundConfigs from "../../api/use-get-application-inbound-configs";
import useGetApplicationTemplate from "../../api/use-get-application-template";
import useGetApplicationTemplateMetadata from "../../api/use-get-application-template-metadata";
import useDynamicFieldValidations from "../../hooks/use-dynamic-field-validation";
import {
    ApplicationInterface,
    MainApplicationInterface,
    SAML2ConfigurationInterface,
    SAML2ServiceProviderInterface,
    SupportedAuthProtocolTypes
} from "../../models";
import { DynamicFieldInterface } from "../../models/dynamic-fields";
import buildCallBackUrlsWithRegExp from "../../utils/build-callback-urls-with-regexp";
import "./application-sync-wizard.scss";

/**
 * Prop types of the `ApplicationSyncWizard` component.
 */
export interface ApplicationSyncWizardPropsInterface extends ModalProps, IdentifiableComponentInterface {
    /**
     * Application id.
     */
    applicationId: string;
    /**
     * Application template id.
     */
    applicationTemplateId: string;
    /**
     * Callback triggered when changing the application outdate status.
     */
    onApplicationOutdateStatusChange: (isApplicationOutdated: boolean) => void;
    /**
     * Flag to determine whether the sync wizard should be opened.
     */
    showWizard: boolean;
    /**
     * Callback triggered when closing the application creation wizard.
     */
    onClose: () => void;
}

/**
 * Dynamic application sync wizard component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ApplicationSyncWizard: FunctionComponent<ApplicationSyncWizardPropsInterface> = (
    props: ApplicationSyncWizardPropsInterface
): ReactElement => {
    const {
        applicationId,
        applicationTemplateId,
        onApplicationOutdateStatusChange,
        showWizard,
        onClose,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const { validate } = useDynamicFieldValidations();

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        data: templateData,
        error: templateDataFetchRequestError
    } = useGetApplicationTemplate(applicationTemplateId, !!applicationTemplateId);
    const {
        data: templateMetadata,
        error: templateMetadataFetchRequestError
    } = useGetApplicationTemplateMetadata(applicationTemplateId, !!applicationTemplateId);
    const {
        data: application,
        mutate: mutateApplicationGetRequest,
        error: applicationGetRequestError
    } = useGetApplication(applicationId, !!applicationId);
    const {
        data: SAML2Configurations,
        mutate: mutateSAML2ConfigData,
        error: SAML2ConfigurationFetchError
    } = useGetApplicationInboundConfigs(applicationId, SupportedAuthProtocolTypes.SAML, !!applicationId);

    const [ isSyncing, setIsSyncing ] = useState(false);

    /**
     * Handle errors that occur during the application template data fetch request.
     */
    useEffect(() => {
        if (!templateDataFetchRequestError) {
            return;
        }

        if (templateDataFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: templateDataFetchRequestError?.response?.data?.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.fetchTemplate.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchTemplate" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications." +
                "fetchTemplate.genericError.message")
        }));
    }, [ templateDataFetchRequestError ]);

    /**
     * Handle errors that occur during the application template meta data fetch request.
     */
    useEffect(() => {
        if (!templateMetadataFetchRequestError) {
            return;
        }

        if (templateMetadataFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: templateMetadataFetchRequestError?.response?.data?.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.fetchTemplateMetadata.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchTemplateMetadata" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications." +
                "fetchTemplateMetadata.genericError.message")
        }));
    }, [ templateMetadataFetchRequestError ]);

    /**
     * Handles the application get request error.
     */
    useEffect(() => {
        if (!applicationGetRequestError) {
            return;
        }

        if (applicationGetRequestError.response?.data?.description) {
            dispatch(addAlert({
                description: applicationGetRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.fetchApplication.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchApplication" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.fetchApplication.genericError." +
                "message")
        }));
    }, [ applicationGetRequestError ]);

    /**
     * Handle errors that occur during the application inbound protocol data fetch request.
     */
    useEffect(() => {
        if (!SAML2ConfigurationFetchError) {
            return;
        }

        if (SAML2ConfigurationFetchError?.response?.data?.description) {
            dispatch(addAlert({
                description: SAML2ConfigurationFetchError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.getInboundProtocolConfig.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.getInboundProtocolConfig" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.getInboundProtocolConfig" +
                ".genericError.message")
        }));
    }, [ SAML2ConfigurationFetchError ]);

    const validateSchema: ValidateFunction<boolean> = useMemo(() => {
        if (!templateData?.schema) {
            return null;
        }

        return new Ajv().compile<boolean>(templateData?.schema);
    }, [ templateData ]);

    const initialValues: MainApplicationInterface = useMemo(() => {
        if (!application || !SAML2Configurations) {
            return null;
        }

        const applicationData: MainApplicationInterface = cloneDeep(application);

        applicationData.inboundProtocolConfiguration = {
            saml: {
                manualConfiguration: cloneDeep(SAML2Configurations) as SAML2ServiceProviderInterface
            }
        };

        return applicationData;
    }, [ application, SAML2Configurations ]);

    const applicationOutdateStatus: boolean = useMemo(() => {
        let status: boolean = true;

        if (initialValues && validateSchema) {
            status = validateSchema(initialValues);
        }

        onApplicationOutdateStatusChange(!status);

        return !status;
    }, [ initialValues, validateSchema ]);

    const handelSyncResult = (isError: boolean, error?: AxiosError) => {
        if (!isError) {
            dispatch(addAlert({
                description: t("applications:notifications.syncApplication.success" +
                    ".description"),
                level: AlertLevels.SUCCESS,
                message: t("applications:notifications.syncApplication.success.message")
            }));

            return;
        }

        if (error?.response?.data?.description) {
            dispatch(addAlert({
                description: error.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.syncApplication.error" +
                    ".message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.syncApplication" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.syncApplication.genericError" +
                ".message")
        }));
    };

    const syncOutdatedApplication = (data: Partial<MainApplicationInterface>) => {
        const updateMainApplicationData = (
            data: Partial<ApplicationInterface>
        ): Promise<void | ApplicationInterface> => {
            if (Object.keys(data).length === 0) {
                return Promise.resolve();
            }

            return updateApplicationDetails(data);
        };

        if (!data) {
            return;
        }

        setIsSyncing(true);

        // Moderate Values to match API restrictions.
        if (data?.inboundProtocolConfiguration?.oidc?.callbackURLs) {
            data.inboundProtocolConfiguration.oidc.callbackURLs = buildCallBackUrlsWithRegExp(
                data.inboundProtocolConfiguration.oidc.callbackURLs
            );
        }

        const applicationData: Partial<ApplicationInterface> = omit(data, [ "inboundProtocolConfiguration" ]);
        const applicationInboundProtocolData: SAML2ServiceProviderInterface = merge(
            initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration,
            data?.inboundProtocolConfiguration?.saml?.manualConfiguration
        );

        updateMainApplicationData(applicationData)
            .then((response: ApplicationInterface) => {
                const shouldUpdateInboundProtocol: boolean =
                    applicationInboundProtocolData && Object.keys(applicationInboundProtocolData).length > 0;

                if (response) {
                    mutateApplicationGetRequest();

                    if (!shouldUpdateInboundProtocol) {
                        handelSyncResult(false);
                    }
                }

                if (shouldUpdateInboundProtocol) {
                    updateAuthProtocolConfig<SAML2ConfigurationInterface>(
                        applicationId,
                        {
                            manualConfiguration: applicationInboundProtocolData
                        },
                        SupportedAuthProtocolTypes.SAML
                    ).then(() => {
                        handelSyncResult(false);
                        mutateSAML2ConfigData();
                    }).catch((error: AxiosError) => {
                        handelSyncResult(true, error);
                    });
                }
            })
            .catch((error: AxiosError) => {
                handelSyncResult(true, error);
            })
            .finally(() => {
                setIsSyncing(false);
                onClose();
            });
    };

    const formData: {
        fields: DynamicFieldInterface[],
        formInitialData: Partial<MainApplicationInterface>
    } = useMemo(() => {
        if (!showWizard
            || !applicationOutdateStatus
            || !validateSchema?.errors
            || !Array.isArray(validateSchema?.errors)
            || validateSchema?.errors?.length == 0
            || !templateData?.payload) {
            return {
                fields: [],
                formInitialData: null
            };
        }

        const formInitialData: Partial<MainApplicationInterface> = {};
        const fields: Set<string> = new Set<string>([]);

        validateSchema?.errors?.forEach((error: ErrorObject) => {
            let lodashPath: string = "";
            const instancePath: string = error?.instancePath?.substring(1);
            const pathKeys: string[] = instancePath?.split("/");
            const value: unknown = pathKeys?.reduce(
                (obj: unknown, key: string) => {
                    let modifiedKey: string = key;

                    if (!isNaN(Number(key))) {
                        modifiedKey = `[${key}]`;
                    }

                    if (lodashPath === "") {
                        lodashPath += modifiedKey;
                    } else {
                        lodashPath += `.${modifiedKey}`;
                    }

                    return obj[key];
                },
                templateData?.payload
            );

            if (value) {
                if (typeof value === "string") {
                    const placeholderRegex: RegExp = /\${[^}]+}/g;

                    const matches: string[] = value.match(placeholderRegex) || [];

                    matches.forEach((match: string) => fields.add(match.substring(2, match.length - 1)));
                }

                set(formInitialData, lodashPath, value);
            }
        });

        if (fields?.size == 0) {
            syncOutdatedApplication(formInitialData);

            return {
                fields: [],
                formInitialData: null
            };
        }

        return {
            fields: templateMetadata?.create?.form?.fields?.filter(
                (field: DynamicFieldInterface) => fields.has(field?.name)),
            formInitialData
        };
    }, [ showWizard ]);

    /**
     * Callback function triggered when clicking the form sync button.
     *
     * @param values - Submission values from the form fields.
     */
    const onSubmit = (values: Partial<MainApplicationInterface>): void => {
        const formValues: Partial<MainApplicationInterface> = cloneDeep(values);

        /**
         * Make sure that cleared text fields are set to an empty string.
         * Additionally, include the auto-submit properties in the form submission.
         */
        formData?.fields?.forEach((field: DynamicFieldInterface) => {
            if (field?.meta?.dependentProperties
                && Array.isArray(field?.meta?.dependentProperties)
                && field?.meta?.dependentProperties?.length > 0) {
                const fieldValue: string = get(formValues, field?.name);

                if (typeof fieldValue === "string") {
                    field.meta.dependentProperties.forEach(
                        (property: string) => {
                            const propertyValue: string = get(formValues, property);

                            if (propertyValue && typeof propertyValue === "string") {
                                set(formValues, property, propertyValue.replace(`\${${field?.name}}`, fieldValue));
                            }
                        }
                    );
                }
            }

            if (field?.disable) {
                unset(formValues, field?.name);
            }
        });

        syncOutdatedApplication(formValues);
    };

    let formSubmit: (e: MouseEvent<HTMLButtonElement>) => void;

    return (
        <ModalWithSidePanel
            open={ showWizard && formData?.fields?.length > 0 && !!formData?.formInitialData }
            className="wizard application-sync-wizard"
            dimmer="blurring"
            closeOnDimmerClick={ false }
            closeOnEscape
            onClose={ onClose }
            data-componentid={ componentId }
            { ...rest }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header className="wizard-header">
                    { templateData?.name }
                    <Heading as="h6">{ templateData?.description }</Heading>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    {
                        <FinalForm
                            initialValues={ formData?.formInitialData }
                            onSubmit={ onSubmit }
                            mutators={ {
                                setFormAttribute: (
                                    [ fieldName, fieldVal ]: [ fieldName: string, fieldVal: any ],
                                    state: MutableState<
                                        Partial<MainApplicationInterface>,
                                        Partial<MainApplicationInterface>
                                    >,
                                    { changeValue }: Tools<
                                        Partial<MainApplicationInterface>,
                                        Partial<MainApplicationInterface>
                                    >
                                ) => {
                                    changeValue(state, fieldName, () => fieldVal);
                                }
                            } }
                            validate={
                                (formValues: MainApplicationInterface) =>
                                    validate(formValues, formData?.fields)
                            }
                            render={ ({ form, handleSubmit }: FormRenderProps) => {
                                formSubmit = handleSubmit;

                                return (
                                    <form id={ `${templateData?.id}-sync-form` } onSubmit={ handleSubmit }>
                                        <Grid>
                                            { formData?.fields?.map(
                                                (field: DynamicFieldInterface) => {
                                                    return (
                                                        <Grid.Row
                                                            key={ field?.id }
                                                            columns={ 1 }
                                                            className=
                                                                "application-sync-wizard-dynamic-fields"
                                                        >
                                                            <Grid.Column
                                                                mobile={ 16 }
                                                                tablet={ 16 }
                                                                computer={ 14 }
                                                            >
                                                                <ApplicationFormDynamicField
                                                                    field={ field }
                                                                    form={ form }
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    );
                                                })
                                            }
                                        </Grid>
                                    </form>
                                );
                            } }
                        />
                    }
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ onClose }>
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    onClick={ (e: MouseEvent<HTMLButtonElement>) => formSubmit(e) }
                                    floated="right"
                                    data-componentid={ `${componentId}-sync-button` }
                                    loading={ isSyncing }
                                    disabled={ isSyncing }
                                >
                                    { t("common:sync") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
        </ModalWithSidePanel>
    );
};

/**
 * Default props for the application sync wizard.
 */
ApplicationSyncWizard.defaultProps = {
    "data-componentid": "application-sync-wizard"
};
