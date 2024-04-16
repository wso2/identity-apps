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

import { AuthProvider } from "@asgardeo/auth-react";
import { ThemeProvider } from "@oxygen-ui/react/theme";
import { AppConfigProvider } from "@wso2is/features/admin.core.v1/providers/app-config-provider";
import { ContextUtils } from "@wso2is/core/utils";
import * as React from "react";
import { ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AsgardeoTheme } from "./branding/theme";
import { AuthenticateUtils } from "@wso2is/features/admin.authentication.v1";
import { Config, PreLoader, store } from "@wso2is/features/admin.core.v1";
import { UserPreferencesInterface } from "@wso2is/features/admin.core.v1/models/user-preferences";
import AppSettingsProvider from "@wso2is/features/admin.core.v1/providers/app-settings-provider";
import UserPreferencesProvider from "@wso2is/features/admin.core.v1/providers/user-preferences-provider";
import OrganizationsProvider from "@wso2is/features/admin.organizations.v1/providers/organizations-provider";
import { ProtectedApp } from "./protected-app";

// Set the runtime config in the context.
ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

/**
 * Render root component with configs.
 *
 * @returns Root element with configs.
 */
const RootWithConfig = (): ReactElement => {

    const [ ready, setReady ] = React.useState(false);

    React.useEffect(() => {
        if (AuthenticateUtils.getInitializeConfig()?.baseUrl) {
            setReady(true);

            return;
        }

        setReady(false);
    }, [ AuthenticateUtils.getInitializeConfig()?.baseUrl ]);

    if (!ready) {
        return <PreLoader />;
    }

    return (
        <AppSettingsProvider>
            <ThemeProvider theme={ AsgardeoTheme } defaultMode="light" modeStorageKey="console-oxygen-mode">
                <Provider store={ store }>
                    <UserPreferencesProvider<UserPreferencesInterface>>
                        <BrowserRouter>
                            <AuthProvider
                                config={ AuthenticateUtils.getInitializeConfig() }
                                fallback={ <PreLoader /> }
                                getAuthParams={ AuthenticateUtils.getAuthParams }
                            >
                                <AppConfigProvider>
                                    <OrganizationsProvider>
                                        <ProtectedApp />
                                    </OrganizationsProvider>
                                </AppConfigProvider>
                            </AuthProvider>
                        </BrowserRouter>
                    </UserPreferencesProvider>
                </Provider>
            </ThemeProvider>
        </AppSettingsProvider>
    );
};

const rootElement: HTMLElement = document.getElementById("root");

// Moved back to the legacy mode due to unpredictable state update issue.
// Tracked here: https://github.com/wso2/product-is/issues/14912
ReactDOM.render(<RootWithConfig />, rootElement);
