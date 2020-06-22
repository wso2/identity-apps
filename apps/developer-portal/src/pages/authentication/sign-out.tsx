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

import { FunctionComponent, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { handleSignOut } from "../../store/actions";

/**
 * Virtual component used to handle Sign in action.
 *
 * @return {React.ReactElement}
 */
const SignOut: FunctionComponent<{}> = (): ReactElement => {

    const dispatch = useDispatch();

    const logoutInit: boolean = useSelector((state: AppState) => state.auth.logoutInit);

    useEffect(() => {
        if (!logoutInit) {
            dispatch(handleSignOut());
        }
    }, [ logoutInit ]);

    return null;
};

export default SignOut;
