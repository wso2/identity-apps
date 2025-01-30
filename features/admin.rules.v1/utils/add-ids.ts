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

import { v4 as uuidv4 } from "uuid";

export const addIds = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(addIds);
    } else if (typeof obj === "object" && obj !== null) {
        const updatedObj: Record<string, any> = Object.fromEntries(Object.entries(obj).map(
            ([ key, value ]: [string, any]) => [ key, addIds(value) ])
        );

        // Add an `id` property if it doesn't exist
        if (!("id" in updatedObj)) {
            updatedObj.id = uuidv4();
        }

        return updatedObj;
    }

    return obj;
};

export default addIds;
