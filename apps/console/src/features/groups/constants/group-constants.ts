/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Class containing groups constants.
 */
export class GroupConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */

    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Group edit view path.
     */
    public static readonly GROUP_VIEW_PATH: string = "/groups/";

    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("GROUP_CREATE", "groups.create")
        .set("GROUP_UPDATE", "groups.update")
        .set("GROUP_DELETE", "groups.delete")
        .set("GROUP_READ", "groups.read")

    /**
     * Set all groups option
     */
    public static ALL_GROUPS: string = "All user stores";

    public static ALL_USER_STORES_OPTION_VALUE: string = "all";

    public static readonly PRIMARY_USER_STORE_OPTION_VALUE: string = "primary";
}
