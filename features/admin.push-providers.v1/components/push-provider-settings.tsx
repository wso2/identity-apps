/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { TemplateDynamicForm } from "@wso2is/admin.template-core.v1/components/template-dynamic-form";
import {
    DynamicFilePickerFieldInterface, DynamicFormInterface,
    DynamicInputFieldTypes
} from "@wso2is/admin.template-core.v1/models/dynamic-fields";
import { ExtensionTemplateCommonInterface } from "@wso2is/admin.template-core.v1/models/templates";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment, Hint } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, CheckboxProps, Divider } from "semantic-ui-react";
import { PushProviderAPIInterface, PushProviderPropertiesInterface } from "../models/push-providers";
import { PushProviderTemplateInterface, PushProviderTemplateMetadataInterface } from "../models/templates";

/**
 * Proptypes for the PushProviderSettings component.
 */
interface PushProviderSettingsPropsInterface extends IdentifiableComponentInterface {

    /**
     * Push Provider interface
     */
    pushProvider: PushProviderAPIInterface;

    /**
     * Push Provider template info
     */
    pushProviderTemplateInfo: ExtensionTemplateCommonInterface;

    /**
     * Push Provider template data for API requests
     */
    pushProviderTemplateData: PushProviderTemplateInterface;

    /**
     * Push Provider template metadata for form rendering
     */
    pushProviderTemplateMetadata: PushProviderTemplateMetadataInterface;

    /**
     * Default push provider name
     */
    defaultPushProvider: string | null;

    /**
     * Flag to determine if the data is still loading
     */
    isLoading?: boolean;

    /**
     * Callback to delete the push provider
     */
    handleDelete: () => void;

    /**
     * Callback to update the push provider
     */
    handleUpdate: (data: PushProviderAPIInterface, callback?: () => void) => void;

    /**
     * Callback to create the push provider
     */
    handleCreate: (data: PushProviderAPIInterface, callback?: () => void) => void;

    /**
     * Callback to update the default push provider
     */
    handleDefaultUpdate: (providerName: string | null) => void;
}

export const PushProviderSettings: FunctionComponent<PushProviderSettingsPropsInterface> = (
    {
        pushProvider,
        pushProviderTemplateInfo,
        pushProviderTemplateData,
        pushProviderTemplateMetadata,
        defaultPushProvider,
        isLoading,
        handleDelete,
        handleCreate,
        handleUpdate,
        handleDefaultUpdate,
        ["data-componentid"]: componentId = "push-provider-settings"
    }: PushProviderSettingsPropsInterface
): ReactElement => {

    const { t } = useTranslation();

    const initialFormValues: Record<string, unknown> = useMemo(() => {
        if (!pushProvider) {
            return {};
        }

        const configPropertiesInitialValues: Record<string, unknown> = pushProvider.properties
            .reduce((defaultValues: Record<string, unknown>, { key, value }: PushProviderPropertiesInterface) => {
                defaultValues[key] = value;

                return defaultValues;
            }, {} as Record<string, unknown>);

        return configPropertiesInitialValues;

    }, [ pushProvider ]);

    const renderFormMetadata: DynamicFormInterface = useMemo(() => {

        if (!pushProviderTemplateMetadata) {
            return null;
        }

        const templateMetadata: PushProviderTemplateMetadataInterface = cloneDeep(pushProviderTemplateMetadata);
        const { form: formMetadata } = templateMetadata?.edit;

        formMetadata.fields = formMetadata.fields.map((field: DynamicFilePickerFieldInterface) => {
            if (field.type === DynamicInputFieldTypes.FILE) {
                return {
                    ...field,
                    onDelete: handleDelete
                };
            }

            return field;
        });

        return formMetadata;
    }, [ pushProviderTemplateMetadata ]);

    const [ isDefaultProvider, setIsDefaultProvider ] = useState<boolean>( false );

    if (defaultPushProvider && pushProvider?.provider === defaultPushProvider && !isDefaultProvider) {
        setIsDefaultProvider(true);
    } else if (defaultPushProvider && pushProvider?.provider !== defaultPushProvider && isDefaultProvider) {
        setIsDefaultProvider(false);
    } else if (!defaultPushProvider && isDefaultProvider) {
        setIsDefaultProvider(false);
    }

    const handleToggleChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps): void => {
        setIsDefaultProvider(data.checked);
        handleDefaultUpdate(data.checked ? pushProvider?.provider : null);
    };

    const handleFormSubmission = (
        values: Record<string, unknown>,
        callback: () => void
    ): void => {

        const providerPropertiesFormValues: Record<string, string> = values as Record<string, string>;
        const providerProperties: PushProviderPropertiesInterface[] = [];

        // Convert the form values to the API format.
        for (const [ key, value ] of Object.entries(providerPropertiesFormValues)) {
            providerProperties.push({
                key,
                value
            });
        }


        if (pushProvider) {
            const payload: PushProviderAPIInterface = {
                properties: providerProperties,
                provider: pushProviderTemplateData.payload.provider
            };

            handleUpdate(payload, callback);
        } else {
            const payload: PushProviderAPIInterface = {
                properties: providerProperties,
                provider: pushProviderTemplateData.payload.provider
            };

            handleCreate(payload, callback);
        }
    };

    return (
        <EmphasizedSegment
            data-componentid={ `${componentId}-form` }
            padded="very"
        >
            <Checkbox
                label={ t("pushProviders:pushProviderSettings.defaultSender") }
                checked={ isDefaultProvider }
                onChange={ handleToggleChange }
                toggle
                disabled={ pushProvider == null } // Disable the toggle if push provider is not configured
                data-componentid={ `${componentId}-default-push-provider` }
            />
            <Hint data-componentid={ `${componentId}-default-push-provider-description` }>
                { t("pushProviders:pushProviderSettings.defaultSenderDescription") }
            </Hint>
            <Divider hidden />
            <TemplateDynamicForm
                key = { pushProviderTemplateInfo?.id }
                form={ renderFormMetadata }
                initialFormValues={ initialFormValues as unknown as Record<string, unknown> }
                templatePayload={ pushProviderTemplateData?.payload as unknown as Record<string, unknown> }
                buttonText={ t("common:update") }
                onFormSubmit={ handleFormSubmission }
                isLoading={ isLoading }
                readOnly={ false }
                data-componentid= { `${componentId}-form` }
            />
        </EmphasizedSegment>
    );

};
