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
 */

/**
 * Helper class for commonly used helper functions.
 */
export class CommonHelpers {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
    }

    /**
     * The following helper method checks if the provided key exists in a given nested
     * json object and returns the value of the the key if it exists and returns null
     * if it doesn't exist.
     *
     * @param jsonObject - object
     * @param key - string
     */
    public static lookupKey(jsonObject: object, key: string) {
        for (const keyName in jsonObject) {

            const value = jsonObject[keyName];
            if (key == keyName) return [key, value];

            if (value instanceof Object) {
                const y = this.lookupKey(value, key);
                if (y && y[0] == key) return y;
            }
            if (value instanceof Array) {
                // for..in doesn't work the way you want on arrays in some browsers
                //
                for (let i = 0; i < value.length; ++i) {
                    const x = this.lookupKey(value[i], key);
                    if (x && x[0] == key) return x;
                }
            }
        }

        return null;
    }
}
