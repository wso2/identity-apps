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

import { ConnectionTemplateInterface } from "@wso2is/admin.connections.v1/models/connection";
import { AppConstants, history } from "@wso2is/admin.core.v1";
import { ResourceCreateWizard } from "@wso2is/admin.template-core.v1/components/resource-create-wizard";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { createIdentityVerificationProvider } from "../../api/identity-verification-provider";
import { useGetIdVPMetadata } from "../../api/use-get-idvp-metadata";
import { useGetIdVPTemplate } from "../../api/use-get-idvp-template";
import { IdentityVerificationProviderConstants } from "../../constants/identity-verification-provider-constants";
import useInitializeHandlers from "../../hooks/use-custom-initialize-handlers";
import useValidationHandlers from "../../hooks/use-custom-validation-handlers";
import {
    IdVPClaimsInterface,
    IdVPConfigPropertiesInterface,
    IdVPEditTabIDs,
    IdentityVerificationProviderInterface
} from "../../models/identity-verification-providers";

interface IdVPCreationModalPropsInterface extends IdentifiableComponentInterface {
    /**
     * Selected IdVP template.
     */
    selectedTemplate: ConnectionTemplateInterface;
    /**
     * Callback to close the modal.
     */
    onClose: () => void;
}

const IdVPCreationModal: FunctionComponent<IdVPCreationModalPropsInterface> = ({
    onClose,
    selectedTemplate,
    ["data-componentid"]: componentId = "idvp-create-modal"
}: IdVPCreationModalPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        data: fetchedTemplateData,
        isLoading: isTemplateDataFetchRequestLoading,
        error: templateDataFetchRequestError
    } = useGetIdVPTemplate(selectedTemplate?.id);

    const {
        data: fetchedMetadata,
        isLoading: isMetadataFetchRequestLoading,
        error: metadataFetchRequestError
    } = useGetIdVPMetadata(selectedTemplate?.id);

    /**
     * Handles the template data fetch error and metadata fetch error.
     */
    useEffect(() => {
        if (templateDataFetchRequestError || metadataFetchRequestError) {
            dispatch(addAlert({
                description: templateDataFetchRequestError.response?.data?.description
                    ?? metadataFetchRequestError.response?.data?.description
                    ?? t("idvp:fetch.notifications.metadata.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("idvp:fetch.notifications.metadata.genericError.message")
            }));
        }
    }, [ templateDataFetchRequestError, metadataFetchRequestError ]);

    const { customInitializers } = useInitializeHandlers();
    const { customValidations } = useValidationHandlers();

    const initialFormValues: Record<string, unknown> = useMemo(() => {
        if (!fetchedTemplateData) {
            return {};
        }

        const configPropertiesInitialValues: Record<string, unknown> = fetchedTemplateData.payload.configProperties
            .reduce((defaultValues: Record<string, unknown>, { key, value }: IdVPConfigPropertiesInterface) => {
                defaultValues[key] = value;

                return defaultValues;
            }, {} as Record<string, unknown>);

        return {
            claims: fetchedTemplateData.payload.claims,
            configProperties: configPropertiesInitialValues,
            description: fetchedTemplateData.payload.description,
            image: fetchedTemplateData.payload.image,
            isEnabled: true,
            templateId: selectedTemplate?.id,
            templateVersion: selectedTemplate?.version
        };

    }, [ fetchedTemplateData ]);

    const handleFormSubmission = (
        values: Record<string, unknown>,
        callback: (errorMsg: string, errorDescription: string) => void
    ): void => {
        const configPropertiesFormValues: Record<string, string | boolean> = values
            .configProperties as Record<string, string | boolean>;
        const configProperties: IdVPConfigPropertiesInterface[] = [];

        // Convert the form values to the API format.
        for (const [ key, value ] of Object.entries(configPropertiesFormValues)) {
            configProperties.push({
                key,
                value
            });
        }

        const payload: IdentityVerificationProviderInterface = {
            claims: values.claims as IdVPClaimsInterface[],
            configProperties,
            description: values.description as string,
            image: values.image as string,
            isEnabled: true,
            name: values.name as string,
            type: values.templateId as string
        };

        createIdentityVerificationProvider(payload)
            .then((createdIdVP: IdentityVerificationProviderInterface) => {
                callback(null, null);

                dispatch(addAlert({
                    description: t("idvp:create.notifications.create.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("idvp:create.notifications.create.success.message")
                }));

                const { id } = createdIdVP;

                history.push({
                    pathname: `${AppConstants.getPaths()
                        .get(IdentityVerificationProviderConstants.IDVP_EDIT_PATH)
                        .replace(":id", id)}#tab=${IdVPEditTabIDs.GUIDE}`
                });
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description: t("idvp:create.notifications.create.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("idvp:create.notifications.create.genericError.message")
                }));
                callback(
                    t("idvp:create.notifications.create.genericError.message"),
                    error?.response?.data?.description
                        ?? t("idvp:create.notifications.create.genericError.description")
                );
            });
    };

    return (
        <ResourceCreateWizard
            showWizard={ true }
            onClose={ onClose }
            form={ fetchedMetadata?.create?.form }
            customInitializers={ customInitializers }
            customValidations={ customValidations }
            guide={ fetchedMetadata?.create?.guide }
            initialFormValues={ initialFormValues }
            templateId={ selectedTemplate?.id }
            templateName={ fetchedTemplateData?.payload?.name }
            templateDescription={ fetchedTemplateData?.payload?.description }
            templatePayload={ fetchedTemplateData?.payload as unknown as Record<string, unknown> }
            buttonText={ t("common:create") }
            onFormSubmit={ handleFormSubmission }
            isLoading={ isTemplateDataFetchRequestLoading || isMetadataFetchRequestLoading }
            data-componentid={ componentId }
        />
    );
};

export default IdVPCreationModal;
