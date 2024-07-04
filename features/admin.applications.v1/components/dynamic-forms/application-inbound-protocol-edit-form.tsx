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

import { AppState } from "@wso2is/admin.core.v1";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormApi, FormRenderProps, MutableState, Tools } from "@wso2is/form";
import {
    ContentLoader,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import has from "lodash-es/has";
import set from "lodash-es/set";
import unset from "lodash-es/unset";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { ApplicationFormDynamicField } from "./application-form-dynamic-field";
import { updateAuthProtocolConfig } from "../../api";
import useGetApplicationInboundConfigs from "../../api/use-get-application-inbound-configs";
import useGetApplicationTemplate from "../../api/use-get-application-template";
import {
    ApplicationInterface,
    SAML2ConfigurationInterface,
    SAML2ServiceProviderInterface,
    SupportedAuthProtocolTypes
} from "../../models";
import { DynamicFieldInterface, DynamicFormInterface } from "../../models/dynamic-fields";

/**
 * Prop types of the `ApplicationEditForm` component.
 */
export interface ApplicationEditFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * The tab metadata to be used for the application edit form generation.
     */
    formMetadata: DynamicFormInterface
    /**
     * Current editing application data.
     */
    application: ApplicationInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Exposing the function to trigger form submission.
     */
    formSubmission?: (submissionFunction: (e: MouseEvent<HTMLButtonElement>) => void) => void;
    /**
     * Flag to check whether the internal submit button should be hidden.
     */
    hideSubmitBtn?: boolean;
}

/**
 * Dynamic application edit form component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ApplicationEditForm: FunctionComponent<ApplicationEditFormPropsInterface> = (
    props: ApplicationEditFormPropsInterface
): ReactElement => {
    const {
        formMetadata,
        application,
        isLoading,
        onUpdate,
        readOnly,
        formSubmission,
        hideSubmitBtn,
        ["data-componentid"]: componentId
    } = props;

    const {
        data: templateData,
        isLoading: isTemplateDataFetchRequestLoading,
        error: templateDataFetchRequestError
    } = useGetApplicationTemplate("salesforce");
    const {
        data: SAML2Configurations,
        error: SAML2ConfigurationFetchError,
        isLoading: isLoadingSAML2Configuration
    } = useGetApplicationInboundConfigs(application?.id, SupportedAuthProtocolTypes.SAML);

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    /**
     * Prepare the initial values before assigning them to the form fields.
     *
     * @param application - application data.
     * @returns Moderated initial values.
     */
    const moderateInitialValues = (samlConfig: SAML2ServiceProviderInterface): SAML2ServiceProviderInterface => {
        const templateToRegex = (template: string): RegExp => {
            // Escape special regex characters in the template
            const escapedTemplate: string = template.replace(/[-\\^$*+?.,()|[\]{}]/g, "\\$&");

            // Replace ${variable} with a named capturing group pattern
            const regexString: string = escapedTemplate.replace(/\\\$\\\{([^}]+)\\\}/g, "(?<$1>.+)");

            // Create and return the regular expression object
            return new RegExp("^" + regexString + "$");
        };

        formMetadata?.fields?.forEach((field: DynamicFieldInterface) => {
            if (field?.meta?.dependentProperties
                && Array.isArray(field?.meta?.dependentProperties)
                && field?.meta?.dependentProperties?.length > 0
            ) {
                for(const path of field.meta.dependentProperties) {
                    const dependentPropertyValue: string = get(samlConfig, path);
                    const templateValue: string = get(
                        templateData?.payload?.inboundProtocolConfiguration?.saml?.manualConfiguration, path);

                    if (typeof dependentPropertyValue === "string"
                        && templateValue && typeof templateValue === "string") {
                        const regex: RegExp = templateToRegex(templateValue);

                        const match: RegExpMatchArray = dependentPropertyValue.match(regex);

                        if (match?.groups?.[field?.name]) {
                            if (samlConfig[field?.name]) {
                                if (samlConfig[field?.name] === match?.groups?.[field?.name]) {
                                    continue;
                                }
                            } else {
                                samlConfig[field?.name] = match?.groups?.[field?.name];

                                continue;
                            }

                            samlConfig[field?.name] = "";

                            break;
                        }
                    }
                }
            }
        });

        return samlConfig;
    };

    const initialValues: SAML2ServiceProviderInterface = useMemo(
        () => {
            if (!SAML2Configurations && !templateData) {
                return null;
            }

            return moderateInitialValues(cloneDeep(SAML2Configurations) as SAML2ServiceProviderInterface);
        },
        [ SAML2Configurations, templateData ]
    );

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
     * TODO: Need to change the error message.
     */
    useEffect(() => {
        if (!SAML2ConfigurationFetchError) {
            return;
        }

        if (SAML2ConfigurationFetchError?.response?.data?.description) {
            dispatch(addAlert({
                description: SAML2ConfigurationFetchError.response.data.description,
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
    }, [ SAML2ConfigurationFetchError ]);

    /**
     * Callback function triggered when clicking the form submit button.
     *
     * @param values - Submission values from the form fields.
     */
    const onSubmit = (values: SAML2ServiceProviderInterface, form: FormApi): void => {
        if (!form?.getState()?.dirty) {
            return;
        }

        setIsSubmitting(true);
        const formValues: SAML2ServiceProviderInterface = cloneDeep(values);

        /**
         * Make sure that cleared text fields are set to an empty string.
         * Additionally, include the auto-submit properties in the form submission.
         */
        formMetadata?.fields?.forEach((field: DynamicFieldInterface) => {
            if (!has(formValues, field?.name)) {
                const initialValue: any = get(initialValues, field?.name);

                if (initialValue && typeof initialValue === "string") {
                    set(formValues, field?.name, "");
                }
            }

            if (field?.meta?.dependentProperties
                && Array.isArray(field?.meta?.dependentProperties)
                && field?.meta?.dependentProperties?.length > 0) {
                const fieldValue: string = get(formValues, field?.name);

                if (typeof fieldValue === "string") {
                    field.meta.dependentProperties.forEach(
                        (property: string) => {
                            if (!get(formValues, property).includes(`\${${ field?.name }}`)) {
                                set(formValues, property, get(
                                    templateData?.payload?.inboundProtocolConfiguration?.saml?.manualConfiguration,
                                    property));
                            }
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

        updateAuthProtocolConfig<SAML2ConfigurationInterface>(
            application?.id,
            {
                manualConfiguration: formValues
            },
            SupportedAuthProtocolTypes.SAML
        ).then(() => {
            dispatch(addAlert({
                description: t("applications:notifications.updateInboundProtocolConfig" +
                    ".success.description"),
                level: AlertLevels.SUCCESS,
                message: t("applications:notifications.updateInboundProtocolConfig" +
                    ".success.message")
            }));

            onUpdate(application?.id);
        }).catch((error: AxiosError) => {
            if (error?.response?.data?.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateInboundProtocolConfig" +
                        ".error.message")
                }));

                return;
            }

            dispatch(addAlert({
                description: t("applications:notifications.updateInboundProtocolConfig" +
                    ".genericError.description"),
                level: AlertLevels.ERROR,
                message: t("applications:notifications.updateInboundProtocolConfig" +
                    ".genericError.message")
            }));
        }).finally(() => setIsSubmitting(false));
    };

    return isLoading || isLoadingSAML2Configuration || isTemplateDataFetchRequestLoading
        ? <ContentLoader inline="centered" active/>
        : (
            <FinalForm
                initialValues={ initialValues }
                keepDirtyOnReinitialize
                onSubmit={ onSubmit }
                mutators={ {
                    setFormAttribute: (
                        [ fieldName, fieldVal ]: [ fieldName: string, fieldVal: any ],
                        state: MutableState<
                            Partial<SAML2ServiceProviderInterface>,
                            Partial<SAML2ServiceProviderInterface>
                        >,
                        { changeValue }: Tools<
                            Partial<SAML2ServiceProviderInterface>,
                            Partial<SAML2ServiceProviderInterface>
                        >
                    ) => {
                        changeValue(state, fieldName, () => fieldVal);
                    }
                } }
                render={ ({ form, handleSubmit }: FormRenderProps) => {
                    formSubmission(handleSubmit);

                    return (
                        <form id={ `${formMetadata?.api}-form` } onSubmit={ handleSubmit }>
                            <Grid>
                                { formMetadata?.fields?.map(
                                    (field: DynamicFieldInterface) => {
                                        if (field?.hidden) {
                                            return null;
                                        }

                                        return (
                                            <Grid.Row
                                                key={ field?.id }
                                                columns={ 1 }
                                                className=
                                                    "application-edit-form-dynamic-fields"
                                            >
                                                <Grid.Column
                                                    mobile={ 16 }
                                                    tablet={ 14 }
                                                    computer={ 12 }
                                                >
                                                    <ApplicationFormDynamicField
                                                        field={ field }
                                                        form={ form }
                                                        readOnly={ readOnly
                                                            || !hasRequiredScopes(
                                                                UIConfig?.features?.applications,
                                                                UIConfig?.features
                                                                    ?.applications?.scopes?.update,
                                                                allowedScopes
                                                            )
                                                        }
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        );
                                    })
                                }
                                {
                                    !hideSubmitBtn && (
                                        <Grid.Row column={ 1 }>
                                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                                <PrimaryButton
                                                    type="submit"
                                                    data-componentid={ `${componentId}-update-button` }
                                                    loading={ isSubmitting }
                                                    disabled={ isSubmitting }
                                                >
                                                    { t("common:update") }
                                                </PrimaryButton>
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                }
                            </Grid>
                        </form>
                    );
                } }
            />
        );
};

/**
 * Default props for the application edit form component.
 */
ApplicationEditForm.defaultProps = {
    "data-componentid": "application-edit-form"
};
