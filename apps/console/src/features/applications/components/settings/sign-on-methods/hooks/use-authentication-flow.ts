/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useContext } from "react";
import AuthenticationFlowContext, { AuthenticationFlowContextProps } from "./../context/authentication-flow-context";

/**
 * Interface for the return type of the UseAuthenticationFlow hook.
 */
export type UseAuthenticationFlowInterface = AuthenticationFlowContextProps;

/**
 * Hook that provides access to the authentication flow context.
 * @returns An object containing authentication flow context.
 */
const UseAuthenticationFlow = (): UseAuthenticationFlowInterface => {
    
    const context: AuthenticationFlowContextProps = useContext(AuthenticationFlowContext);

    if (!context) {
        throw new Error("UseAuthenticationFlow must be used within a AuthenticationFlowProvider");
    }

    return context;
};

export default UseAuthenticationFlow;
