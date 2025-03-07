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

import generateResourceId from "./generate-resource-id";

const updateTemplatePlaceholderReferences = (obj: any, replacers: any[]): any => {
    if (Array.isArray(obj)) {
        return obj.map(value => updateTemplatePlaceholderReferences(value, replacers));
    } else if (typeof obj === "object" && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => {
                if (key === "id" && typeof value === "string") {
                    // Check if this ID is a placeholder (e.g. {{GOOGLE_REDIRECTION_STEP_ID}})
                    const replacer = replacers.find(r => r.key === value.replace(/[{}]/g, ""));

                    if (replacer && replacer.type === "ID") {
                        // If replacer type is "ID", generate a new ID
                        return [key, generateResourceId(replacer.type)];
                    }
                }
                return [key, updateTemplatePlaceholderReferences(value, replacers)];
            })
        );
    }

    return obj;
};

export default updateTemplatePlaceholderReferences;

