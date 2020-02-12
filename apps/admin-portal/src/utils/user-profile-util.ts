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
 *
 */

import { ProfileSchema } from "../models";

/**
 * This function extracts the sub attributes from the schemas and appends them to the main schema iterable.
 * The returned iterable will have all the schema attributes in a flat structure so that
 * you can just iterate through them to display them.
 *
 * @param {ProfileSchema[]} schemas - Array of Profile schemas
 * @param {string} parentSchemaName - Name of the parent attribute.
 * @return {ProfileSchema[]}
 */
export const flattenSchemas = (schemas: ProfileSchema[], parentSchemaName?: string): ProfileSchema[] => {

    const tempSchemas: ProfileSchema[] = [];

    schemas.forEach((schema: ProfileSchema) => {
        if (schema.subAttributes && schema.subAttributes.length > 0) {

            /**
             * If the schema has sub attributes, then this function will be recursively called.
             * The returned attributes are pushed into the `tempSchemas` array.
             */
            tempSchemas.push(...flattenSchemas(schema.subAttributes, schema.name));
        } else {
            const tempSchema = { ...schema };

            if (parentSchemaName) {
                tempSchema.name = parentSchemaName + "." + schema.name;
            }

            tempSchemas.push(tempSchema);
        }
    });

    return tempSchemas;
};
