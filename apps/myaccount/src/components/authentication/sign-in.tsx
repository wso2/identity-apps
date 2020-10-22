/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AppConstants as AppConstantsCore } from "@wso2is/core/constants";
import { AuthenticateUtils } from "@wso2is/core/utils";
import { FunctionComponent, ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { AppConstants } from "../../constants";
import { history } from "../../helpers";
import { AppState } from "../../store";
import { handleSignIn } from "../../store/actions";

/**
 * Virtual component used to handle Sign in action.
 *
 * @param props - Props injected to the component.
 * @return {React.ReactElement}
 */
const SignIn: FunctionComponent<RouteComponentProps> = (
    props: RouteComponentProps
): ReactElement => {

    const { location } = props;

    const isAuthenticated: boolean = useSelector((state: AppState) => state.authenticationInformation.isAuth);
    const isInitialized: boolean = useSelector((state: AppState) => state.authenticationInformation.initialized);

    const error = new URLSearchParams(location.search).get("error_description");

    const loginSuccessRedirect = () => {

        const AuthenticationCallbackUrl = AuthenticateUtils.getAuthenticationCallbackUrl(
            AppConstantsCore.MY_ACCOUNT_APP);

        const location = !AuthenticationCallbackUrl
            || AuthenticationCallbackUrl === AppConstants.getAppLoginPath()
                ? AppConstants.getAppHomePath()
                : AuthenticationCallbackUrl;

        history.push(location);
    };

    useEffect(() => {

        if (!isAuthenticated && !error) {
            isInitialized && handleSignIn();

            return;
        }

        if (error === AppConstants.USER_DENIED_CONSENT) {
            // dispatch(handleSignIn());
            // TODO: Send it to an error page
        } else {
            // TODO: Use authentication SDK to access the session.
            if (sessionStorage.getItem("request_params") &&
                JSON.parse(sessionStorage.getItem("request_params")).clientId &&
                JSON.parse(sessionStorage.getItem("request_params")).clientId !== AppConstants.getClientID()) {

                sessionStorage.clear();
                isInitialized && handleSignIn();
            } else {
                loginSuccessRedirect();
            }
        }
    }, [ isAuthenticated, isInitialized ]);

    return null;
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SignIn;
