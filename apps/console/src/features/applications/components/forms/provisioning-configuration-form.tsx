/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProvisioningConfigurationInterface, SimpleUserStoreListItemInterface } from "../../models";

/**
 *  Provisioning Configurations for the Application.
 */
interface ProvisioningConfigurationFormPropsInterface extends TestableComponentInterface {
    config: ProvisioningConfigurationInterface;
    onSubmit: (values: any) => void;
    useStoreList: SimpleUserStoreListItemInterface[];
    readOnly?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Provisioning configurations form component.
 *
 * @param {ProvisioningConfigurationFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ProvisioningConfigurationsForm: FunctionComponent<ProvisioningConfigurationFormPropsInterface> = (
    props: ProvisioningConfigurationFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit,
        readOnly,
        useStoreList,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isProxyModeOn, setIsProxyModeOn ] = useState<boolean>(false);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): void => {
        const formData = {
            provisioningConfigurations: {
                inboundProvisioning: {
                    provisioningUserstoreDomain: values.provisioningUserstoreDomain,
                    proxyMode: !!values.proxyMode
                }
            }
        };

        onSubmit(formData);
    };

    /**
     * Create user store options.
     *
     */
    const getUserStoreOption = () => {
        const allowedOptions = [];

        if (useStoreList) {
            useStoreList?.map((userStore) => {
                allowedOptions.push({
                    key: useStoreList.indexOf(userStore),
                    text: userStore?.name,
                    value: userStore?.name
                });
            });
        }

        return allowedOptions;
    };

    useEffect(() => {
        if (config?.inboundProvisioning?.proxyMode) {
            setIsProxyModeOn(config?.inboundProvisioning?.proxyMode);
        }
    }, [ config ]);

    return (
        <Form
            uncontrolledForm={ false }
            onSubmit={ (values) => {
                updateConfiguration(values);
            } }
        >
            <Field.CheckboxLegacy
                ariaLabel="Proxy mode"
                name="proxyMode"
                label={ t("console:develop.features.applications.forms.provisioningConfig.fields.proxyMode.label") }
                required={ false }
                value={ config?.inboundProvisioning?.proxyMode ? [ "modeOn" ] : [] }
                listen={ (value) => setIsProxyModeOn(value) }
                readOnly={ readOnly }
                data-testid={ `${ testId }-proxy-mode-checkbox` }
                hint={ t("console:develop.features.applications.forms.provisioningConfig.fields.proxyMode.hint") }
            />
            <Field.Dropdown
                ariaLabel="Provisioning userstore domain"
                name="provisioningUserstoreDomain"
                label={
                    t("console:develop.features.applications.forms.provisioningConfig.fields" +
                        ".userstoreDomain.label")
                }
                required={ false }
                default={ useStoreList && useStoreList.length > 0 && useStoreList[0].name }
                value={ config?.inboundProvisioning?.provisioningUserstoreDomain }
                children={ getUserStoreOption() }
                disabled={ isProxyModeOn }
                readOnly={ readOnly }
                data-testid={ `${ testId }-provisioning-userstore-domain-dropdown` }
                hint={ t("console:develop.features.applications.forms.provisioningConfig.fields." +
                    "userstoreDomain.hint") }
            />
            <Field.Button
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
