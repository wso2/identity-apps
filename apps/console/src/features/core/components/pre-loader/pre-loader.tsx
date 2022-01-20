/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import "./pre-loader.css";

/**
 * Pre loader component props interface.
 */
type PreLoaderPropsInterface = IdentifiableComponentInterface;

/**
 * Pre-Loader for the application.
 *
 * @param {PreLoaderPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const PreLoader: FunctionComponent<PreLoaderPropsInterface> = (
    props: PreLoaderPropsInterface
): ReactElement => {

    const {
        ["data-componentid"]: testId
    } = props;

    return(
        <div className="pre-loader-wrapper">
            <ContentLoader dimmer data-testid={ testId }/>
        </div>
    );
};

/**
 * Default props for the component.
 */
PreLoader.defaultProps = {
    "data-componentid": "pre-loader"
};
