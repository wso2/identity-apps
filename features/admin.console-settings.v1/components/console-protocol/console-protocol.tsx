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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { AccessConfiguration } from "../../../admin.applications.v1/components/settings/access-configuration";
import { ApplicationManagementConstants } from "../../../admin.applications.v1/constants/application-management";
import { SupportedAuthProtocolTypes } from "../../../admin.applications.v1/models/application-inbound";
import { AppState } from "../../../admin.core.v1/store";
import useConsoleSettings from "../../hooks/use-console-settings";

/**
 * Props interface of {@link ConsoleProtocol}
 */
type ConsoleProtocolInterface = IdentifiableComponentInterface;

/**
 * Component to render the login and security settings.
 *
 * @param props - Props injected to the component.
 * @returns Console login and security component.
 */
const ConsoleProtocol: FunctionComponent<ConsoleProtocolInterface> = (
    props: ConsoleProtocolInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.applications;
    });

    const {
        consoleConfigurations,
        isConsoleApplicationInboundConfigsFetchRequestLoading,
        mutateConsoleApplicationInboundConfigs,
        consoleInboundConfigurations
    } = useConsoleSettings();

    const isReadOnly: boolean = useMemo(() => {
        return !hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes);
    }, [ featureConfig ]);

    return (
        <div className="console-login-flow" data-componentid={ componentId }>
            <AccessConfiguration
                isSystemApplication
                application={ consoleConfigurations }
                appId={ consoleConfigurations?.id }
                appName={ consoleConfigurations?.name }
                applicationTemplateId={ consoleConfigurations?.templateId }
                isLoading={ isConsoleApplicationInboundConfigsFetchRequestLoading }
                setIsLoading={ () => null }
                readOnly={ isReadOnly }
                data-componentid={ `${componentId}-protocol-settings` }
                certificate={ undefined }
                extendedAccessConfig={ false }
                inboundProtocolConfig={ {
                    oidc: consoleInboundConfigurations
                } }
                inboundProtocols={ [
                    SupportedAuthProtocolTypes.OIDC
                ] }
                onUpdate={ () => mutateConsoleApplicationInboundConfigs() }
                isInboundProtocolConfigRequestLoading={ false }
                template={ {
                    id: ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC,
                    name: "Custom",
                    templateId: ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
                } }
            />
        </div>
    );
};

ConsoleProtocol.defaultProps = {
    "data-componentid": "console-protocol"
};

export default ConsoleProtocol;
