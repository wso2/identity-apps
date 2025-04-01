/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { ReactNode } from "react";

/**
 * Authentication flow builder modes interface.
 */
export interface AuthenticationFlowBuilderModesInterface {
    /**
     * Id of the flow.
     */
    id: number;
    /**
     * Label of the flow.
     */
    label: ReactNode;
    /**
     * Extra content for the mode.
     */
    extra?: ReactNode;
    /**
     * Mode of the flow.
     */
    mode?: AuthenticationFlowBuilderModes;
}

/**
 * Enum for authentication flow builder modes.
 */
export enum AuthenticationFlowBuilderModes {
    /**
     * Classic mode for the authentication flow builder.
     */
    Classic = "classic",

    /**
     * Visual mode for the authentication flow builder.
     */
    Visual = "visual",
}
