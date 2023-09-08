/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import React, { ReactElement } from "react";
import { Placeholder } from "semantic-ui-react";

const PlaceholderLine = (): ReactElement => (
    <div className="log-row">
        <div className="log-time-container">
            <Placeholder fluid>
                <Placeholder.Line />
            </Placeholder>
        </div>
        <div className="log-description-container">
            <div className="log-desc-loader">
                <Placeholder fluid>
                    <Placeholder.Line />
                </Placeholder>
            </div>
        </div>
    </div>
);

/**
 * Loading component for diagnostic logs
 * @returns React functional component
 */
const LoaderPlaceholder = (): ReactElement => (
    <>
        <PlaceholderLine />
        <PlaceholderLine />
    </>
);

export default LoaderPlaceholder;
