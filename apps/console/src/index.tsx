/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AuthParams, AuthProvider, SPAUtils } from "@asgardeo/auth-react";
import { ThemeProvider } from "@oxygen-ui/react/theme";
import { ContextUtils, StringUtils } from "@wso2is/core/utils";
import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AsgardeoTheme } from "./branding/theme";
import { AuthenticateUtils } from "./features/authentication";
import { Config, PreLoader, store } from "./features/core";
import { ProtectedApp } from "./protected-app";

// Set the runtime config in the context.
ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

const getAuthParams = (): Promise<AuthParams> => {
    if (!SPAUtils.hasAuthSearchParamsInURL() && process.env.NODE_ENV === "production") {

        const contextPath: string = window[ "AppUtils" ].getConfig().appBase
            ? `/${ StringUtils.removeSlashesFromPath(window[ "AppUtils" ].getConfig().appBase) }`
            : "";

        return axios.get(contextPath + "/auth").then((response: AxiosResponse ) => {
            return Promise.resolve({
                authorizationCode: response?.data?.authCode,
                sessionState: response?.data?.sessionState,
                state: response?.data?.state
            });
        });
    }

    return;
};

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
        <ThemeProvider theme={ AsgardeoTheme }>
            <Provider store={ store }>
                <BrowserRouter>
                    <AuthProvider
                        config={ AuthenticateUtils.getInitializeConfig() }
                        fallback={ <PreLoader /> }
                        getAuthParams={ getAuthParams }
                    >
                        <ProtectedApp />
                    </AuthProvider>
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    );
};

const rootElement: HTMLElement = document.getElementById("root");

// Moved back to the legacy mode due to unpredictable state update issue.
// Tracked here: https://github.com/wso2/product-is/issues/14912
ReactDOM.render(<RootWithConfig />, rootElement);
