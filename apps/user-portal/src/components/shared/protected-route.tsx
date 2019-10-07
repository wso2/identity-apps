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

import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { history } from "../../helpers";
import { updateAuthenticationCallbackUrl } from "../../store/middleware";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { state } = useContext(AuthContext);

    /**
     * Update existing location path in the state to recall upon page refresh or authentication callback.
     */
    if (history.location.pathname !== APP_LOGIN_PATH) {
        updateAuthenticationCallbackUrl(history.location.pathname);
    }

    return (
        <Route
            render={(props) =>
                state.isAuth ?
                    <Component {...props} /> :
                    <Redirect to={APP_LOGIN_PATH} />
            }
            {...rest}
        />
    );
};
