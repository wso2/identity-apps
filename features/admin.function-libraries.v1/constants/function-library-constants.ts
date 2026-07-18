/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
 * Class containing function library management constants.
 */
export class FunctionLibraryConstants {

    private constructor() { }

    public static readonly NAME_MAX_LENGTH: number = 100;
    public static readonly NAME_MIN_LENGTH: number = 1;
    public static readonly DESCRIPTION_MAX_LENGTH: number = 300;
    public static readonly NAME_REGEX: RegExp = /^[\w-]+(\.[\w-]+)*$/;
}
