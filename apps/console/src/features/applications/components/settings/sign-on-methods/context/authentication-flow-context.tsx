/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Context, createContext } from "react";

/**
 * Props interface for the AuthenticationFlowContext.
 */
export type AuthenticationFlowContextProps = {
    isConditionalAuthenticationEnabled: boolean;
    onConditionalAuthenticationToggle: (enabled: boolean) => void;
};

/**
 * Context object for managing authentication flow status.
 */
const AuthenticationFlowContext: Context<AuthenticationFlowContextProps> = 
    createContext<null | AuthenticationFlowContextProps>(null);

/**
 * Display name for the AuthenticationFlowContext.
 */
AuthenticationFlowContext.displayName = "AuthenticationFlowContext";

export default AuthenticationFlowContext;
