/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { SignOnMethods } from "../../../admin-applications-v1/components/settings/sign-on-methods/components/sign-on-methods";
import { AppState } from "../../../admin-core-v1/store";
import { IdentityProviderManagementConstants } from "../../../admin-identity-providers-v1/constants";
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
        IdentityProviderManagementConstants.ORGANIZATION_AUTHENTICATOR
    ];

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.applications;
    });

    const {
        consoleConfigurations,
        isConsoleConfigurationsFetchRequestLoading,
        mutateConsoleConfigurations
    } = useConsoleSettings();

    const isReadOnly: boolean = useMemo(() => {
        return !hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes);
    }, [ featureConfig ]);

    return (
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
    );
};

ConsoleLoginFlow.defaultProps = {
    "data-componentid": "console-login-flow"
};

export default ConsoleLoginFlow;
