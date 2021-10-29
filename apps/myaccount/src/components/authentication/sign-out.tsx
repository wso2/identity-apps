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

import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { useSignOut } from "../../store/actions";

/**
 * This component handles the sign-out function
 */
const SignOut = (): ReactElement => {
    const dispatch = useDispatch();
    const logoutInit = useSelector((state: AppState) => state.authenticationInformation.logoutInit);
    const signOut = useSignOut();

    useEffect(() => {
        if (!logoutInit) {
            dispatch(signOut());
        }
    }, [ logoutInit]);

    return null;
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SignOut;
