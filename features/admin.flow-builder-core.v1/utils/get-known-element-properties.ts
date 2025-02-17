/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { Element, ElementTypes } from "../models/elements";

/**
 * Returns a mapping of known properties for a given element.
 *
 * @param element - The element for which to get the known properties.
 * @returns An object with known element properties.
 */
const getKnownElementProperties = (element: Element): Record<string, string[]> => {
    if (element.type === ElementTypes.Button) {
        return {
            color: [ "primary", "secondary", "success", "error", "info", "warning" ],
            variant: [ "contained", "outlined", "text" ]
        };
    }

    return {};
};

export default getKnownElementProperties;
