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

/**
 * Constants related to policy administration.
 */
export default class PolicyAdministrationConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    public static readonly DENY_OVERRIDES: string = "deny-overrides";

    public static readonly PERMIT_OVERRIDES: string = "permit-overrides";

    public static readonly FIRST_APPLICABLE: string = "first-applicable";

    public static readonly PERMIT_UNLESS_DENY: string = "permit-unless-deny";

    public static readonly DENY_UNLESS_PERMIT: string = "deny-unless-permit";

    public static readonly ORDERED_PERMIT_OVERRIDES: string = "ordered-permit-overrides";

    public static readonly ORDERED_DENY_OVERRIDES: string = "ordered-deny-overrides";

    public static readonly ONLY_ONE_APPLICABLE: string = "only-one-applicable";
}
