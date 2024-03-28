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

import { AppConstants } from "../../../../features/core";

/**
 * Class containing Groups constants.
 */
export class GroupsConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    public static readonly APPLICATION_RESOURCE_DIR: string = "applications";

    public static readonly DEBOUNCE_TIMEOUT: number = 1000;

    /**
     * Get the paths necessary for the groups page.
     *
     * @returns `Map<string, string>`
     */
    public static getPaths(): Map<string, string> {

        return new Map<string, string>()
            .set("APPLICATIONS", `${ AppConstants.getDeveloperViewBasePath() }/` + `${this.APPLICATION_RESOURCE_DIR}`);
    }
}
