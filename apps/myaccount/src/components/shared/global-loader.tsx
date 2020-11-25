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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { AppState } from "../../store";

/**
 * Global loader component Prop types.
 * Also see {@link GlobalLoader.defaultProps}
 */
interface GlobalLoaderProps extends TestableComponentInterface {
    height: number;
}

/**
 * Global loader component.
 *
 * @param {GlobalLoaderProps} props - Props injected to the global loader component.
 * @return {JSX.Element}
 */
export const GlobalLoader: FunctionComponent<GlobalLoaderProps> = (props: GlobalLoaderProps): JSX.Element => {

    const { height, ["data-testid"]: testId } = props;
    const visibility = useSelector((state: AppState) => state.global.isGlobalLoaderVisible);
    const [ loaderRef, setLoaderRef ] = useState(null);

    useEffect(() => {
        if (!loaderRef) {
            return;
        }
        if (visibility) {
            loaderRef.continuousStart();
            return;
        }
        loaderRef.complete();
    }, [ visibility ]);

    return (
        <LoadingBar
            data-testid={ testId }
            className="app-top-loading-bar"
            onRef={ (ref) => setLoaderRef(ref) }
            height={ height }
        />
    );
};

/**
 * Default props of {@link GlobalLoader}
 * See type definitions in {@link GlobalLoaderProps}
 */
GlobalLoader.defaultProps = {
  "data-testid": "global-loader"
};
