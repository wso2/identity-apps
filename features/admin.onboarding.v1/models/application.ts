/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { FunctionComponent, SVGProps } from "react";

/**
 * Enum for high-level application types.
 */
export enum ApplicationType {
    BROWSER = "browser",
    MOBILE = "mobile",
    MACHINE = "machine"
}

/**
 * Framework/technology option for template selection.
 */
export interface FrameworkOptionInterface {
    id: string;
    displayName: string;
    logo?: FunctionComponent<SVGProps<SVGSVGElement>> | string;
    templateId?: string;
}

/**
 * Application type option for template selection.
 */
export interface ApplicationTypeOptionInterface {
    id: string;
    displayName: string;
    description: string;
    templateId: string;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}

/**
 * Test user credentials for testing the application.
 */
interface TestUserCredentialsInterface {
    username: string;
    password: string;
    email?: string;
}

/**
 * Result after application creation.
 */
export interface CreatedApplicationResultInterface {
    applicationId: string;
    clientId: string;
    clientSecret?: string;
    name: string;
    testUserCredentials?: TestUserCredentialsInterface;
    tryItUrl?: string;
}
