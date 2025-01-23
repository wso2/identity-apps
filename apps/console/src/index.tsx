/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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
import { loader } from "@monaco-editor/react";
import { ThemeProvider } from "@oxygen-ui/react/theme";
import { AuthenticateUtils } from "@wso2is/admin.authentication.v1";
import { PreLoader } from "@wso2is/admin.core.v1/components/pre-loader";
import { Config } from "@wso2is/admin.core.v1/configs/app";
import { UserPreferencesInterface } from "@wso2is/admin.core.v1/models/user-preferences";
import { AppConfigProvider } from "@wso2is/admin.core.v1/providers/app-config-provider";
import AppSettingsProvider from "@wso2is/admin.core.v1/providers/app-settings-provider";
import GlobalVariablesProvider from "@wso2is/admin.core.v1/providers/global-variables-provider";
import UserPreferencesProvider from "@wso2is/admin.core.v1/providers/user-preferences-provider";
import { store } from "@wso2is/admin.core.v1/store";
import OrganizationsProvider from "@wso2is/admin.organizations.v1/providers/organizations-provider";
import { ContextUtils } from "@wso2is/core/utils";
import React, { ReactElement, useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ProtectedApp } from "./protected-app";
import Theme from "./theme";

// Set the runtime config in the context.
ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

/**
 * TODO: Use Monaco with the webpack plugin.
 * {@link https://github.com/wso2-enterprise/asgardeo-product/issues/23937}
 *
 * Function to check the status of the Monaco CDN.
 * If the CDN is not available, the default CDN will be used.
 */
const checkCDNStatus = async () => {
    try {
        const response: Response = await fetch("https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs/loader.js");

        if (response.ok) {
            loader.config({
                paths: {
                    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs"
                }
            });
        } else {
            loader.config({
                paths: {
                    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs"
                }
            });
        }
    } catch (error) {
        // Use default CDN.
    }
};

checkCDNStatus();

/**
 * Render root component with configs.
 *
 * @returns Root element with configs.
 */
const RootWithConfig = (): ReactElement => {

    const [ ready, setReady ] = useState(false);

    useEffect(() => {
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
        <GlobalVariablesProvider
            value={ {
                isAdaptiveAuthenticationAvailable: isAdaptiveAuthenticationAvailable,
                isOrganizationManagementEnabled: isOrganizationManagementEnabled
            } }
        >
            <AppSettingsProvider>
                <ThemeProvider theme={ Theme } defaultMode="light" modeStorageKey="console-oxygen-mode">
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
        </GlobalVariablesProvider>
    );
};

const rootElement: HTMLElement = document.getElementById("root");

// Moved back to the legacy mode due to unpredictable state update issue.
// Tracked here: https://github.com/wso2/product-is/issues/14912
// eslint-disable-next-line react/no-deprecated
ReactDOM.render(<RootWithConfig />, rootElement);
