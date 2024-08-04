/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { useRequiredScopes } from "@wso2is/access-control";
import { SignOnMethods } from "@wso2is/admin.applications.v1/components/settings/sign-on-methods/sign-on-methods";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { AppState } from "@wso2is/admin.core.v1/store";
import AILoginFlowProvider from "@wso2is/admin.login-flow.ai.v1/providers/ai-login-flow-provider";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";
import { AuthenticatorManagementConstants } from "../../../admin.connections.v1";
import useConsoleSettings from "../../hooks/use-console-settings";
import "./console-login-flow.scss";

/**
 * Props interface of {@link ConsoleLoginFlow}
 */
type ConsoleLoginFlowPropsInterface = IdentifiableComponentInterface;

/**
 * Component to render the login and security settings.
 *
 * @param props - Props injected to the component.
 * @returns Console login and security component.
 */
const ConsoleLoginFlow: FunctionComponent<ConsoleLoginFlowPropsInterface> = (
    props: ConsoleLoginFlowPropsInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;
    const { UIConfig } = useUIConfig();

    // In Console login flow, Organization authenticator should not be shown.
    const hiddenAuthenticators: string[] = [
        ...(UIConfig?.hiddenAuthenticators ?? []),
        AuthenticatorManagementConstants.ORGANIZATION_AUTHENTICATOR
    ];

    const applicationsFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.applications;
    });

    const {
        consoleConfigurations,
        isConsoleConfigurationsFetchRequestLoading,
        mutateConsoleConfigurations
    } = useConsoleSettings();

    const isReadOnly: boolean = !(useRequiredScopes(applicationsFeatureConfig?.scopes?.update));

    return (
        <AILoginFlowProvider>
            <div className="console-login-flow" data-componentid={ componentId }>
                <SignOnMethods
                    application={ consoleConfigurations }
                    appId={ consoleConfigurations?.id }
                    authenticationSequence={ consoleConfigurations?.authenticationSequence }
                    clientId={ consoleConfigurations?.clientId }
                    isLoading={ isConsoleConfigurationsFetchRequestLoading }
                    onUpdate={ () => {
                        mutateConsoleConfigurations();
                    } }
                    readOnly={ isReadOnly }
                    isSystemApplication={ true }
                    hiddenAuthenticators={ hiddenAuthenticators }
                    data-componentid={ `${componentId}-sign-on-methods` }
                />
            </div>
        </AILoginFlowProvider>
    );
};

ConsoleLoginFlow.defaultProps = {
    "data-componentid": "console-login-flow"
};

export default ConsoleLoginFlow;
