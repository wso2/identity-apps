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

/**
 * User sessions model.
 */
export interface UserSessions {
    /**
     * User ID.
     */
    userId: string;
    /**
     * List of active sessions.
     */
    sessions: UserSession[];
}

/**
 * Model to represent a single login session.
 */
export interface UserSession {
    /**
     * List of applications in the session.
     */
    applications: Application[];
    /**
     * User agent of the session.
     */
    userAgent: string;
    /**
     * IP address of the session.
     */
    ip: string;
    /**
     * Login time of the session.
     */
    loginTime: string;
    /**
     * Last access time of the session.
     */
    lastAccessTime: string;
    /**
     * ID of the session.
     */
    id: string;
}

/**
 * Model to represent logged in application details.
 */
interface Application {
    /**
     * Username of the logged in user for the application.
     */
    subject: string;
    /**
     * Name of the application.
     */
    appName: string;
    /**
     * ID of the application.
     */
    appId: string;
}

/**
 * Returns an empty user sessions object.
 *
 * @return {UserSessions} An empty user sessions object
 */
export const emptyUserSessions = (): UserSessions => ({
    sessions: [],
    userId: ""
});

/**
 * Returns an empty user session object.
 *
 * @return {UserSession} An empty user session object
 */
export const emptyUserSession = (): UserSession => ({
    applications: [],
    id: "",
    ip: "",
    lastAccessTime: "",
    loginTime: "",
    userAgent: ""
});
