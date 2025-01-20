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

import { updateApplicationDetails, updateAuthProtocolConfig } from "@wso2is/admin.applications.v1/api/application";
import {
    ApplicationInterface,
    MainApplicationInterface
} from "@wso2is/admin.applications.v1/models/application";
import {
    OIDCDataInterface,
    PassiveStsConfigurationInterface,
    SAML2ConfigurationInterface,
    SAML2ServiceProviderInterface,
    SupportedAuthProtocolTypes,
    WSTrustConfigurationInterface
} from "@wso2is/admin.applications.v1/models/application-inbound";
import { TemplateDynamicForm } from "@wso2is/admin.template-core.v1/components/template-dynamic-form";
import { DynamicFieldInterface } from "@wso2is/admin.template-core.v1/models/dynamic-fields";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AxiosError } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";
import pick from "lodash-es/pick";
import unset from "lodash-es/unset";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AuthProtocolTypes } from "../../admin.connections.v1";
import { ApplicationTemplateConstants } from "../constants/templates";
import useApplicationTemplate from "../hooks/use-application-template";
import useInitializeHandlers from "../hooks/use-custom-initialize-handlers";
import useSubmissionHandlers from "../hooks/use-custom-submission-handlers";
import useValidationHandlers from "../hooks/use-custom-validation-handlers";
import { ApplicationEditTabMetadataInterface } from "../models/templates";

/**
 * Prop types of the `ApplicationEditForm` component.
 */
export interface ApplicationEditFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * The tab metadata to be used for the application edit form generation.
     */
    tab: ApplicationEditTabMetadataInterface;
    /**
     * Current editing application data.
     */
    application: ApplicationInterface;
    /**
     * Current application protocol name.
     */
    protocolName: string;
    /**
     * Current editing application inbound protocol data.
     */
    inboundProtocolConfigurations: OIDCDataInterface | SAML2ConfigurationInterface | WSTrustConfigurationInterface
        | PassiveStsConfigurationInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Callback to update the application protocol details.
     */
    onProtocolUpdate: () => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Dynamic application edit form component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ApplicationEditForm: FunctionComponent<ApplicationEditFormPropsInterface> = ({
    tab,
    application,
    protocolName,
    inboundProtocolConfigurations,
    isLoading,
    onUpdate,
    onProtocolUpdate,
    readOnly,
    ["data-componentid"]: componentId = "application-edit-form"
}: ApplicationEditFormPropsInterface): ReactElement => {

    const { customValidations } = useValidationHandlers();
    const { customInitializers } = useInitializeHandlers();
    const { customSubmissionHandlers } = useSubmissionHandlers();
    const {
        template: templateData,
        isTemplateRequestLoading: isTemplateDataFetchRequestLoading
    } = useApplicationTemplate();

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    /**
     * Prepare the initial value object for the application edit form.
     */
    const initialValues: MainApplicationInterface = useMemo(() => {
        if (!inboundProtocolConfigurations || !application || !protocolName) {
            return null;
        }

        const formInitialValues: MainApplicationInterface = cloneDeep(application);
        let protocolKeyName: string = protocolName;

        if (SupportedAuthProtocolTypes.WS_FEDERATION === protocolKeyName) {
            protocolKeyName = ApplicationTemplateConstants.APPLICATION_INBOUND_PROTOCOL_KEYS[
                AuthProtocolTypes.WS_FEDERATION ];
        } else if (SupportedAuthProtocolTypes.WS_TRUST === protocolKeyName) {
            protocolKeyName = ApplicationTemplateConstants.APPLICATION_INBOUND_PROTOCOL_KEYS[
                AuthProtocolTypes.WS_TRUST ];
        }

        if (SupportedAuthProtocolTypes.SAML === protocolKeyName) {
            formInitialValues.inboundProtocolConfiguration = {
                [ protocolKeyName ]: {
                    manualConfiguration: inboundProtocolConfigurations as SAML2ServiceProviderInterface
                }
            };
        } else {
            formInitialValues.inboundProtocolConfiguration = {
                [ protocolKeyName ]: inboundProtocolConfigurations
            };
        }

        return formInitialValues;
    }, [ inboundProtocolConfigurations, application ]);

    /**
     * Function to handle form submission.
     *
     * @param values - Submission values from the form fields.
     * @param callback - Callback function to execute after form submission is complete.
     */
    const handleFormSubmission = (values: Record<string, unknown>, callback: () => void): void => {
        let protocolKeyName: string = protocolName;

        if (SupportedAuthProtocolTypes.WS_FEDERATION === protocolKeyName) {
            protocolKeyName = ApplicationTemplateConstants.APPLICATION_INBOUND_PROTOCOL_KEYS[
                AuthProtocolTypes.WS_FEDERATION ];
        } else if (SupportedAuthProtocolTypes.WS_TRUST === protocolKeyName) {
            protocolKeyName = ApplicationTemplateConstants.APPLICATION_INBOUND_PROTOCOL_KEYS[
                AuthProtocolTypes.WS_TRUST ];
        }

        const editPaths: string[] = tab?.form?.fields?.map((field: DynamicFieldInterface) => field?.name);
        let protocolConfigurations: Record<string, unknown>;
        let applicationConfigurations: Record<string, unknown>;

        if (values?.inboundProtocolConfiguration?.[protocolKeyName]) {
            if (SupportedAuthProtocolTypes.SAML === protocolKeyName) {
                if (values?.inboundProtocolConfiguration?.[protocolKeyName]?.manualConfiguration) {
                    if (!isEqual(values?.inboundProtocolConfiguration?.[protocolKeyName]?.manualConfiguration,
                        inboundProtocolConfigurations)) {
                        protocolConfigurations = values?.inboundProtocolConfiguration?.[protocolKeyName];
                    }
                } else {
                    protocolConfigurations = values?.inboundProtocolConfiguration?.[protocolKeyName];
                }
            } else {
                if (!isEqual(values?.inboundProtocolConfiguration?.[protocolKeyName], inboundProtocolConfigurations)) {
                    protocolConfigurations = values?.inboundProtocolConfiguration?.[protocolKeyName];
                }
            }
            unset(values, "inboundProtocolConfiguration");
        }

        values.id = application?.id;
        if (!isEqual(values, application)) {
            editPaths.push("id");
            applicationConfigurations = pick(values, editPaths);
        }

        const updateProtocolConfigurations = () => {
            updateAuthProtocolConfig(
                application?.id,
                protocolConfigurations,
                protocolName
            ).then(() => {
                onProtocolUpdate();

                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.updateApplication.success.message")
                }));
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
            }).finally(() => callback());
        };

        if (applicationConfigurations && Object.keys(applicationConfigurations)?.length > 0) {
            updateApplicationDetails(applicationConfigurations as unknown as ApplicationInterface)
                .then(() => {
                    onUpdate(application?.id);

                    if (protocolConfigurations) {
                        updateProtocolConfigurations();
                    } else {
                        callback();

                        dispatch(addAlert({
                            description: t("applications:notifications.updateApplication.success" +
                                ".description"),
                            level: AlertLevels.SUCCESS,
                            message: t("applications:notifications.updateApplication.success.message")
                        }));
                    }
                })
                .catch((error: AxiosError) => {
                    callback();

                    if (error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("applications:notifications.updateApplication.error" +
                                ".message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("applications:notifications.updateApplication" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.updateApplication.genericError" +
                            ".message")
                    }));
                });
        } else if (protocolConfigurations) {
            updateProtocolConfigurations();
        }
    };

    return (
        <TemplateDynamicForm
            customValidations={ customValidations }
            customInitializers={ customInitializers }
            customSubmissionHandlers={ customSubmissionHandlers }
            form={ tab?.form }
            initialFormValues={ initialValues as unknown as Record<string, unknown> }
            templatePayload={ templateData?.payload as unknown as Record<string, unknown> }
            buttonText={ t("common:update") }
            onFormSubmit={ handleFormSubmission }
            isLoading={ isLoading || isTemplateDataFetchRequestLoading }
            readOnly={ readOnly }
            data-componentid={ componentId }
        />
    );
};
