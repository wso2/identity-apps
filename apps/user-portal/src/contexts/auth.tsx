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

import React, { createContext, useEffect, useReducer } from "react";
import { AuthContextInterface } from "../models";
import { handleSignIn, handleSignOut } from "../store/middleware";
import { authenticateInitialState, authenticateReducer } from "../store/reducers";

export const AuthContext = createContext<AuthContextInterface>({
    dispatch: (() => 0) as React.Dispatch<any>,
    signIn: () => { return; },
    signOut: () => { return; },
    state: authenticateInitialState
});

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authenticateReducer, authenticateInitialState);

    const signIn = () => { handleSignIn(state, dispatch); };
    const signOut = () => { handleSignOut(state, dispatch); };

    /**
     * Update authentication state on app load
     */
    useEffect(() => {
        signIn();
    }, []);

    /**
     * Render state, dispatch and special case actions
     */
    return (
        <AuthContext.Provider value={{ state, dispatch, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
