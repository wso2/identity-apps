/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { CircleInfoIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import "./hint.scss";

/**
 * Props interface of {@link Hint}
 */
export interface HintPropsInterface extends IdentifiableComponentInterface {
    /**
     * Hint text to be displayed.
     */
    hint: string;
}

/**
 * Hint component to display additional information for input fields.
 *
 * @param props - Props injected to the component.
 * @returns The Hint component.
 */
export const Hint: FunctionComponent<HintPropsInterface> = ({
    hint
}: HintPropsInterface): ReactElement => (
    <div className="composer-input-field-hint-container">
        <CircleInfoIcon />
        <span>{ hint }</span>
    </div>
);

export default Hint;
