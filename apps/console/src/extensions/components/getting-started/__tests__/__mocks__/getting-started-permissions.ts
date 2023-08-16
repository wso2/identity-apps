/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

export const fullPermissions: string = [
    "internal_login",
    ...window[ "AppUtils" ].getConfig().ui.features.applications.scopes.create,
    ...window[ "AppUtils" ].getConfig().ui.features.applications.scopes.read,
    ...window[ "AppUtils" ].getConfig().ui.features.identityProviders.scopes.create,
    ...window[ "AppUtils" ].getConfig().ui.features.identityProviders.scopes.read,
    ...window[ "AppUtils" ].getConfig().ui.features.users.scopes.create,
    ...window[ "AppUtils" ].getConfig().ui.features.users.scopes.read
].join(" ");
