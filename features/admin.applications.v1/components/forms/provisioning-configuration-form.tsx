/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppState } from "@wso2is/admin.core.v1/store";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreItem, UserStoreListItem } from "@wso2is/admin.userstores.v1/models/user-stores";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
    InboundProvisioningFormValuesInterface,
    ProvisioningConfigurationInterface,
    ProvisioningFormDataInterface
} from "../../models/application";

/**
 *  Provisioning Configurations for the Application.
 */
interface ProvisioningConfigurationFormPropsInterface extends TestableComponentInterface {
    config: ProvisioningConfigurationInterface;
    onSubmit: (values: any) => void;
    readOnly?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

const FORM_ID: string = "application-provisioning-configuration-form";

/**
 * Provisioning configurations form component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const ProvisioningConfigurationsForm: FunctionComponent<ProvisioningConfigurationFormPropsInterface> = (
    props: ProvisioningConfigurationFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName ?? userstoresConfig.primaryUserstoreName);

    const { t } = useTranslation();
    const { isSuperOrganization } = useGetCurrentOrganizationType();

    const {
        isLoading: isUserStoreListFetchRequestLoading,
        isUserStoreReadOnly,
        userStoresList
    } = useUserStores();

    const [ isProxyModeOn, setIsProxyModeOn ] = useState<boolean>(false);
    const [ userStoreOptions, setUserStoreOptions ] = useState<UserStoreItem[]>([]);

    useEffect(() => {
        if (readOnly) return;

        const storeOptions: UserStoreItem[] = [
            {
                key: -1,
                text: primaryUserStoreDomainName,
                value: primaryUserStoreDomainName
            }
        ];

        if (isSuperOrganization() && !isUserStoreListFetchRequestLoading && userStoresList?.length > 0) {
            userStoresList.map((store: UserStoreListItem, index: number) => {
                const isReadOnly: boolean = isUserStoreReadOnly(store.name);
                const isEnabled: boolean = store.enabled;

                if (store.name.toUpperCase() !== userstoresConfig.primaryUserstoreName && !isReadOnly && isEnabled) {
                    const storeOption: UserStoreItem = {
                        key: index,
                        text: store.name,
                        value: store.name
                    };

                    storeOptions.push(storeOption);
                }
            });
        }

        setUserStoreOptions(storeOptions);
    }, [ isUserStoreListFetchRequestLoading, userStoresList ]);

    useEffect(() => {
        if (config?.inboundProvisioning?.proxyMode) {
            setIsProxyModeOn(config?.inboundProvisioning?.proxyMode);
        }
    }, [ config ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const updateConfiguration = (values: InboundProvisioningFormValuesInterface): void => {
        const formData: ProvisioningFormDataInterface = {
            provisioningConfigurations: {
                inboundProvisioning: {
                    provisioningUserstoreDomain: values.provisioningUserstoreDomain,
                    proxyMode: !!values.proxyMode
                }
            }
        };

        onSubmit(formData);
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: InboundProvisioningFormValuesInterface) => {
                updateConfiguration(values);
            } }
        >
            <Field.CheckboxLegacy
                ariaLabel="Proxy mode"
                name="proxyMode"
                label={ t("applications:forms.provisioningConfig.fields.proxyMode.label") }
                required={ false }
                value={ config?.inboundProvisioning?.proxyMode ? [ "modeOn" ] : [] }
                listen={ (value: boolean) => setIsProxyModeOn(value) }
                readOnly={ readOnly }
                data-testid={ `${ testId }-proxy-mode-checkbox` }
                hint={ t("applications:forms.provisioningConfig.fields.proxyMode.hint") }
            />
            {
                readOnly ? (
                    <Field.Input
                        ariaLabel="Provisioning userstore domain"
                        name="provisioningUserstoreDomain"
                        inputType="text"
                        minLength={ null }
                        maxLength={ null }
                        label={
                            t("applications:forms.provisioningConfig.fields" +
                                ".userstoreDomain.label")
                        }
                        required={ false }
                        default={ userStoreOptions?.length > 0 && userStoreOptions[0]?.value }
                        value={ config?.inboundProvisioning?.provisioningUserstoreDomain ?? userStoreOptions[0]?.value }
                        disabled={ isProxyModeOn }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-provisioning-userstore-domain-input` }
                        hint={ t("applications:forms.provisioningConfig.fields." +
                            "userstoreDomain.hint") }
                    />
                ) : (
                    <Field.Dropdown
                        ariaLabel="Provisioning userstore domain"
                        name="provisioningUserstoreDomain"
                        label={
                            t("applications:forms.provisioningConfig.fields" +
                                ".userstoreDomain.label")
                        }
                        required={ false }
                        default={ userStoreOptions?.length > 0 && userStoreOptions[0]?.value }
                        value={ config?.inboundProvisioning?.provisioningUserstoreDomain ?? userStoreOptions[0]?.value }
                        options={ userStoreOptions }
                        disabled={ isProxyModeOn }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-provisioning-userstore-domain-dropdown` }
                        hint={ t("applications:forms.provisioningConfig.fields." +
                            "userstoreDomain.hint") }
                    />
                )
            }
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={ readOnly }
            />
        </Form>
    );
};

/**
 * Default props for the application provisioning configurations form component.
 */
ProvisioningConfigurationsForm.defaultProps = {
    "data-testid": "application-inbound-provisioning-configurations-form"
};
