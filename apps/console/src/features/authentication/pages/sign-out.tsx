/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { Hooks, useAuthContext } from "@asgardeo/auth-react";
import { AppConstants } from "@wso2is/core/constants";
import { setSignOut } from "@wso2is/core/store";
import { AuthenticateUtils } from "@wso2is/core/utils";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState, PreLoader, history } from "../../core";
import useOrganizations from "../../organizations/hooks/use-organizations";

/**
 * Virtual component used to handle Sign in action.
 *
 * @returns Sign Out component.
 */
const SignOut: FunctionComponent<Record<string, unknown>> = (): ReactElement => {
    const dispatch: Dispatch = useDispatch();

    const { signOut, on } = useAuthContext();

    const {
        removeOrgIdInLocalStorage,
        removeUserOrgInLocalStorage
    } = useOrganizations();

    const logoutInit: boolean = useSelector((state: AppState) => state.auth.logoutInit);

    useEffect(() => {
        on(Hooks.SignOut, () => {
            AuthenticateUtils.removeAuthenticationCallbackUrl(AppConstants.CONSOLE_APP);
            dispatch(setSignOut());
        });
    }, []);

    useEffect(() => {
        if (!logoutInit) {
            removeOrgIdInLocalStorage();
            removeUserOrgInLocalStorage();

            signOut()
                .catch(() => {
                    history.push(window[ "AppUtils" ].getConfig().routes.home);
                });
        }
    }, [ logoutInit ]);

    return <PreLoader />;
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SignOut;
