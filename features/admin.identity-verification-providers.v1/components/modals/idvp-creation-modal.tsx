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

import { ResourceCreateWizard } from "@wso2is/admin.template-core.v1/components/resource-create-wizard";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ConnectionTemplateInterface } from "../../../admin.connections.v1";
import { createIdentityVerificationProvider } from "../../api/identity-verification-provider";
import { useGetIdVPMetadata } from "../../api/use-get-idvp-metadata";
import { useGetIdVPTemplate } from "../../api/use-get-idvp-template";
import useInitializeHandlers from "../../hooks/use-custom-initialize-handlers";
import useValidationHandlers from "../../hooks/use-custom-validation-handlers";
import { IDVPConfigPropertiesInterface, OldIdentityVerificationProviderInterface } from "../../models";
import { IdVPClaimsInterface, IdVPConfigPropertiesInterface } from "../../models/new-models";

interface IdVPCreationModalPropsInterface extends IdentifiableComponentInterface {
    selectedTemplate: ConnectionTemplateInterface
    selectedTemplateId: string;
    onClose: () => void;
}

export const IdVPCreationModal: FunctionComponent<IdVPCreationModalPropsInterface> = ({
    onClose,
    selectedTemplate,
    ["data-componentid"]: componentId = "idvp-create-modal"
}: IdVPCreationModalPropsInterface): ReactElement => {
    const { t } = useTranslation();

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
        const configProperties: IDVPConfigPropertiesInterface[] = [];

        for (const [ key, value ] of Object.entries(configPropertiesFormValues)) {
            configProperties.push({
                key,
                value
            });
        }

        const payload: OldIdentityVerificationProviderInterface = {
            Name: values.name as string,
            Type: values.templateId as string,
            claims: values.claims as IdVPClaimsInterface[],
            configProperties,
            description: values.description as string,
            isEnabled: true
        };

        createIdentityVerificationProvider(payload)
            .then(() => {
                console.log("Identity verification provider created successfully");
                callback(null, null);
            })
            .catch((error) => {
                console.log("Error occurred while creating identity verification provider", error);
                callback("Error", null);
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
