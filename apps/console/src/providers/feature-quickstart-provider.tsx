/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { LoadableComponentInterface } from "@wso2is/core/models";
import React, { Fragment, FunctionComponent, PropsWithChildren, ReactElement } from "react";

interface FeatureQuickstartProviderPropsInterface extends LoadableComponentInterface {

    /**
     * Should the quickstart wrapper should be skipped.
     */
    bypass?: boolean;
    /**
     * Quickstart content.
     */
    quickstart: ReactElement;
}

export const FeatureQuickstartProvider: FunctionComponent<PropsWithChildren<
    FeatureQuickstartProviderPropsInterface>> = (
        prop: PropsWithChildren<FeatureQuickstartProviderPropsInterface>
): ReactElement => {
    
    const {
        bypass,
        children,
        isLoading,
        quickstart
    } = prop;
    
    return (
        <Fragment>
            {
                (isLoading && !bypass)
                    ? quickstart
                    : children
            }
        </Fragment>
    );
};

/**
 * Default props for the component.
 */
FeatureQuickstartProvider.defaultProps = {
    bypass: false
};
