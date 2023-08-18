/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { getAuthenticatorIcons, getConnectorIcons } from "../../configs/ui";

export const OutboundConnectors: {
    connectorId: string;
    displayName: string;
    icon: any;
    name: string;
    self: string;
}[] = [
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
