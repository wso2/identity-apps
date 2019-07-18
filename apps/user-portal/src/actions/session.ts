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

import { SessionInterface } from "../models/session";

export const getLoginSession = (key) => {
    return sessionStorage.getItem(key);
};

export const getLoginAllSessions = () => {
    const session = {};

    session[`access_token`] = sessionStorage.getItem("access_token");
    session[`authenticated_user`] = sessionStorage.getItem("authenticated_user");
    session[`id_token`] = sessionStorage.getItem("id_token");
    session[`login_status`] = sessionStorage.getItem("login_status");
    session[`refresh_token`] = sessionStorage.getItem("refresh_token");

    return session;
};

export const updateLoginSession = (data: SessionInterface) => {
    sessionStorage.setItem("access_token", data.access_token);
    sessionStorage.setItem("authenticated_user", data.authenticated_user);
    sessionStorage.setItem("id_token", data.id_token);
    sessionStorage.setItem("login_status", data.login_status);
    sessionStorage.setItem("refresh_token", data.refresh_token);
};

export const clearLoginSession = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("authenticated_user");
    sessionStorage.removeItem("id_token");
    sessionStorage.removeItem("login_status");
    sessionStorage.removeItem("refresh_token");
};

export const isLoggedSession = () => {
    const status = sessionStorage.getItem("login_status");

    if (status && status === "valid") {
        return true;
    }

    return false;
};
