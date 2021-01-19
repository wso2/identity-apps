/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { getAuthenticatorIcons, getConnectorIcons } from "../../configs";

export const OutboundConnectors = [
    {
        connectorId: "Z29vZ2xlYXBwcw",
        displayName: "Google",
        icon: getAuthenticatorIcons().google,
        name: "googleapps",
        self: "/t/carbon.super/api/server/v1/identity-providers/meta/outbound-provisioning-connectors/Z29vZ2xlYXBwcw"
    },
    {
        connectorId: "c2FsZXNmb3JjZQ",
        displayName: "Salesforce",
        icon: getConnectorIcons().salesforce,
        name: "salesforce",
        self: "/t/carbon.super/api/server/v1/identity-providers/meta/outbound-provisioning-connectors/c2FsZXNmb3JjZQ"
    },
   {
        connectorId: "c2NpbQ",
        displayName: "SCIM",
        icon: getConnectorIcons().scim,
        name: "scim",
        self: "/t/carbon.super/api/server/v1/identity-providers/meta/outbound-provisioning-connectors/c2NpbQ"
    }
];
