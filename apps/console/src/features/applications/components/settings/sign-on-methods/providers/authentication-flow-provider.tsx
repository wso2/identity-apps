/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { PropsWithChildren, ReactElement, useState } from "react";
import AuthenticationFlowContext from "../context/authentication-flow-context";

export type AuthenticationFlowProviderProps = Record<string, unknown>;

export const AuthenticationFlowProvider = (props: PropsWithChildren<AuthenticationFlowProviderProps>): 
    ReactElement => {

    const { children } = props;
    const [ isConditionalAuthenticationEnabled, setIsConditionalAuthenticationEnabled ] = useState<boolean>(false);
    
    return (
        <AuthenticationFlowContext.Provider
            value={ {
                isConditionalAuthenticationEnabled,
                onConditionalAuthenticationToggle: (enabled: boolean) => setIsConditionalAuthenticationEnabled(enabled)
            } }
        >
            { children }
        </AuthenticationFlowContext.Provider>
    );
};
