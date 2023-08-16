/**
 * Copyright (c) 2019-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AuthParams, AuthProvider, SPAUtils } from "@asgardeo/auth-react";
import { ContextUtils, StringUtils } from "@wso2is/core/utils";
import axios, { AxiosResponse } from "axios";
import * as React from "react";
import "react-app-polyfill/ie11";
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import ReactDOM, { Root } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PreLoader } from "./components";
import { Config } from "./configs";
import { ProtectedApp } from "./protected-app";
import { store } from "./store";
import { getAuthInitializeConfig } from "./utils";

// Set the runtime config in the context.
ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

const getAuthParams = (): Promise<AuthParams> => {
    if (!SPAUtils.hasAuthSearchParamsInURL() && process.env.NODE_ENV === "production") {

        const contextPath: string = window[ "AppUtils" ].getConfig().appBase
            ? `/${ StringUtils.removeSlashesFromPath(window[ "AppUtils" ].getConfig().appBase) }`
            : "";

        return axios.get(contextPath + "/auth").then((response: AxiosResponse) => {
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
const RootWithConfig = () => {

    const [ ready, setReady ] = React.useState(false);

    React.useEffect(() => {
        if (window["AppUtils"]) {
            setReady(true);

            return;
        }

        setReady(false);
    }, [ window["AppUtils"] ]);

    if (!ready) {
        return <PreLoader />;
    }

    return (
        <Provider store={ store }>
            <BrowserRouter>
                <AuthProvider
                    config={
                        getAuthInitializeConfig()
                    }
                    fallback={ <PreLoader /> }
                    getAuthParams={ getAuthParams }
                >
                    <ProtectedApp />
                </AuthProvider>
            </BrowserRouter>
        </Provider>
    );
};

const root: Root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(<RootWithConfig />);
