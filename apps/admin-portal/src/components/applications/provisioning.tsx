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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Divider } from "semantic-ui-react";
import { getUserStoreList, updateApplicationConfigurations } from "../../api";
import {
    ApplicationInterface,
    FeatureConfigInterface,
    ProvisioningConfigurationInterface,
    SimpleUserStoreListItemInterface
} from "../../models";
import { OutboundProvisioningConfigurations } from "./outbound-provisioning-configuration";
import { InboundProvisioningConfigurations } from "./inbound-provisioning-configuration";
import { SBACInterface } from "@wso2is/core/models";

/**
 * Proptypes for the provision settings component.
 */
interface ProvisioningSettingsPropsInterface extends SBACInterface<FeatureConfigInterface> {
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
}

/**
 *  Provisioning component.
 *
 * @param {ProvisioningSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const ProvisioningSettings: FunctionComponent<ProvisioningSettingsPropsInterface> = (
    props: ProvisioningSettingsPropsInterface
): ReactElement => {

    const {
        application,
        featureConfig,
        provisioningConfigurations,
        onUpdate
    } = props;

    return (
        <>
            <InboundProvisioningConfigurations
                appId={ application.id }
                provisioningConfigurations={ provisioningConfigurations }
                onUpdate={ onUpdate }
                readOnly={
                    !hasRequiredScopes(featureConfig?.applications, featureConfig?.applications?.scopes?.update)
                }
            />
            <Divider hidden/>
            <Divider/>
            <Divider hidden/>
            <OutboundProvisioningConfigurations
                application={ application }
                provisioningConfigurations={ provisioningConfigurations }
                onUpdate={ onUpdate }
            />
        </>
    );
};
