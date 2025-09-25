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


import Box from "@oxygen-ui/react/Box";
import Stack from "@oxygen-ui/react/Stack";
import {
    CommonResourcePropertiesPropsInterface 
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import {
    GovernanceConnectorInterface,
    ServerConfigurationsConstants 
} from "@wso2is/admin.server-configurations.v1";
import { getConnectorDetails } from "@wso2is/admin.server-configurations.v1/api/governance-connectors";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AskPasswordConfigurations } from "./ask-password-configurations";
import useAskPasswordFlowBuilder from "../../../../hooks/use-ask-password-flow-builder";
import { Divider } from "@mui/material";

/**
 * Props interface of {@link FlowCompletionProperties}
 */
export type ConfirmationCodePropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;
/**
 * Confirmation code step properties component.
 *
 * @param props - Props injected to the component.
 * @returns ConfirmationCodeProperties component.
 */
const ConfirmationCodeProperties: FunctionComponent<ConfirmationCodePropertiesPropsInterface> = ({
    ["data-componentid"]: componentId = "confirmation-code-properties-component"
}: ConfirmationCodePropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();

    // Get from context
    const {
        connector,
        setConnector
    } = useAskPasswordFlowBuilder();

    // Fallback to API if context is null
    useEffect(() => {
        if (!connector) {
            getConnectorDetails(
                ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID
            ).then((response: GovernanceConnectorInterface) => {
                setConnector(response);
            }).catch(() => {
                setConnector(undefined);
            });
        }
    }, [ connector, setConnector ]);

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Box
                sx={ {
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    height: "100%",
                    width: "200%"
                } }
            >
                <br/>
                <Divider />
                <br/>
                <AskPasswordConfigurations
                    initialValues={ connector }
                    readOnly={ false }
                    isConnectorEnabled={ true }
                    isSubmitting={ false }
                    data-componentid="confirmation-code-properties-ask-password-form"
                />
            </Box>
        </Stack>
    );
};

export default ConfirmationCodeProperties;
