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

import React, { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

/**
 * Global loader component Prop types.
 */
export interface GlobalLoaderProps {
    /**
     * Height of the loading bar.
     */
    height?: number;
    /**
     * If the loader is visible or not.
     */
    visibility?: boolean;
}

/**
 * Global loader component.
 *
 * @param {GlobalLoaderProps} props - Props injected to the global loader component.
 * @return {JSX.Element}
 */
export const GlobalLoader = (props: GlobalLoaderProps): JSX.Element => {

    const {
        height,
        visibility
    } = props;

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
            className="app-top-loading-bar"
            onRef={ (ref) => setLoaderRef(ref) }
            height={ height }
        />
    );
};

/**
 * Global loader component default props.
 */
GlobalLoader.defaultProps = {
    height: 3,
    visibility: true,
};
