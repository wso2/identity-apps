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
import { Field, Forms } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { ProvisioningConfigurationInterface, SimpleUserStoreListItemInterface } from "../../models";

/**
 *  Provisioning Configurations for the Application.
 */
interface ProvisioningConfigurationFormPropsInterface extends TestableComponentInterface {
    config: ProvisioningConfigurationInterface;
    onSubmit: (values: any) => void;
    useStoreList: SimpleUserStoreListItemInterface[];
    readOnly?: boolean;
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
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [isProxyModeOn, setIsProxyModeOn] = useState<boolean>(false);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        return {
            provisioningConfigurations: {
                inboundProvisioning: {
                    provisioningUserstoreDomain: values.get("provisioningUserstoreDomain"),
                    proxyMode: values.get("proxyMode").includes("modeOn")
                }
            }
        };
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
    }, [config]);

    return (
        <Forms onSubmit={ (values) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="proxyMode"
                            label=""
                            required={ false }
                            requiredErrorMessage=""
                            value={ config?.inboundProvisioning?.proxyMode ? ["modeOn"] : [] }
                            type="checkbox"
                            listen={
                                (values) => {
                                    setIsProxyModeOn(values.get("proxyMode").includes("modeOn"));
                                }
                            }
                            children={ [
                                {
                                    label: t("console:develop.features.applications.forms.provisioningConfig.fields" +
                                        ".proxyMode.label"),
                                    value: "modeOn"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-proxy-mode-checkbox` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.provisioningConfig.fields.proxyMode" +
                                ".hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="provisioningUserstoreDomain"
                            label={
                                t("console:develop.features.applications.forms.provisioningConfig.fields" +
                                    ".userstoreDomain.label")
                            }
                            required={ false }
                            requiredErrorMessage=""
                            type="dropdown"
                            default={ useStoreList && useStoreList.length > 0 && useStoreList[0].name }
                            value={ config?.inboundProvisioning?.provisioningUserstoreDomain }
                            children={ getUserStoreOption() }
                            disabled={ isProxyModeOn }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-provisioning-userstore-domain-dropdown` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.provisioningConfig.fields" +
                                ".userstoreDomain.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                {
                    !readOnly && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Button
                                    primary
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                    data-testid={ `${ testId }-submit-button` }
                                >
                                    { t("common:update") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the application provisioning configurations form component.
 */
ProvisioningConfigurationsForm.defaultProps = {
    "data-testid": "application-inbound-provisioning-configurations-form"
};
