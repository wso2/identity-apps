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

import { Field, Forms } from "@wso2is/forms";
import { Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Divider, Grid } from "semantic-ui-react";
import {
    MetadataPropertyInterface,
    ProvisioningConfigurationInterface,
    SimpleUserStoreListItemInterface
} from "../../../models";

/**
 *  Provisioning Configurations for the Application.
 */
interface ProvisioningConfigurationFormPropsInterface {
    config: ProvisioningConfigurationInterface;
    onSubmit: (values: any) => void;
    useStoreList: SimpleUserStoreListItemInterface[];
}

/**
 * Provisioning configurations form component.
 *
 * @param {ProvisioningConfigurationFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const ProvisioningConfigurationsForm: FunctionComponent<ProvisioningConfigurationFormPropsInterface> = (
    props: ProvisioningConfigurationFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit,
        useStoreList
    } = props;

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
                    proxyMode: values.get("proxyMode").includes("modeOn"),
                    provisioningUserstoreDomain: values.get("provisioningUserstoreDomain")
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
                    text: userStore?.name,
                    value: userStore?.name,
                    key: useStoreList.indexOf(userStore)
                });
            });
        }

        return allowedOptions;
    };

    useEffect(() => {
        if (config?.inboundProvisioning?.proxyMode) {
            setIsProxyModeOn(config?.inboundProvisioning?.proxyMode)
        }
    }, [config]);

    return (
        <Forms onSubmit={ (values) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Heading as="h5">Inbound SCIM Provisioning</Heading>
                        <Divider hidden/>
                        <Field
                            name="proxyMode"
                            label=""
                            required={ false }
                            requiredErrorMessage=""
                            value={ config?.inboundProvisioning?.proxyMode ? ["modeOn"] : [] }
                            type="checkbox"
                            listen={
                                (values) => {
                                    setIsProxyModeOn(values.get("proxyMode").includes("modeOn"))
                                }
                            }
                            children={ [
                                {
                                    label: "Proxy mode",
                                    value: "modeOn"
                                }
                            ] }
                        />
                        <Hint>
                            Users/Groups are not provisioned to the user store. They are only outbound provisioned.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="provisioningUserstoreDomain"
                            label="Provisioning userstore domain"
                            required={ false }
                            requiredErrorMessage=""
                            type="dropdown"
                            default={ useStoreList && useStoreList.length > 0 && useStoreList[0].name }
                            value={ config?.inboundProvisioning?.provisioningUserstoreDomain }
                            children={ getUserStoreOption() }
                            disabled={ isProxyModeOn }
                        />
                        <Hint>
                            Select userstore domain name to provision users and groups.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Button primary type="submit" size="small" className="form-button">
                            Update
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
