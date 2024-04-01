/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import { InboundProvisioningConfigurations } from "./inbound-provisioning-configuration";
import { OutboundProvisioningConfiguration } from "./outbound-provisioning-configuration";
import { AppState, FeatureConfigInterface } from "../../../../admin-core-v1";
import { ApplicationInterface, ProvisioningConfigurationInterface } from "../../../models";

/**
 * Proptypes for the provision settings component.
 */
interface ProvisioningSettingsPropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {

    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Current advanced configurations.
     */
    provisioningConfigurations: ProvisioningConfigurationInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 *  Provisioning component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Provisioning Settings component.
 */
export const ProvisioningSettings: FunctionComponent<ProvisioningSettingsPropsInterface> = (
    props: ProvisioningSettingsPropsInterface
): ReactElement => {

    const {
        application,
        featureConfig,
        provisioningConfigurations,
        onUpdate,
        readOnly,
        [ "data-componentid" ]: componentId
    } = props;

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const shouldShowOutboundProvisioningConfigurations: boolean = useMemo(() => {
        return application?.provisioningConfigurations?.outboundProvisioningIdps?.length > 0;
    }, [ application ]);

    return (
        <EmphasizedSegment padded="very">
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <InboundProvisioningConfigurations
                            appId={ application.id }
                            provisioningConfigurations={ provisioningConfigurations }
                            onUpdate={ onUpdate }
                            readOnly={
                                readOnly
                                || !hasRequiredScopes(featureConfig?.applications,
                                    featureConfig?.applications?.scopes?.update,
                                    allowedScopes)
                            }
                            data-testid={ `${ componentId }-inbound-configuration` }
                        />
                    </Grid.Column>
                </Grid.Row>
                { shouldShowOutboundProvisioningConfigurations &&  (
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                            <OutboundProvisioningConfiguration
                                application={ application }
                                provisioningConfigurations={ provisioningConfigurations }
                                onUpdate={ onUpdate }
                                readOnly={
                                    readOnly
                                    || !hasRequiredScopes(featureConfig?.applications,
                                        featureConfig?.applications?.scopes?.update,
                                        allowedScopes)
                                }
                                data-testid={ `${ componentId }-outbound-configuration` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) }
            </Grid>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the application provisioning settings component.
 */
ProvisioningSettings.defaultProps = {
    "data-componentid": "provisioning-settings"
};
