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

import { AxiosError } from "axios";
import { ChildOrganizationsMode, PolicyFormMode } from "../models/organization-management";

/**
 * Returns the form mode of a stored policy mode. No stored mode means no policy.
 *
 * @param mode - The mode of the stored policy.
 * @returns The form mode.
 */
export const toPolicyFormMode = (mode?: ChildOrganizationsMode): PolicyFormMode => {
    switch (mode) {
        case ChildOrganizationsMode.ALL:
            return PolicyFormMode.ALL;
        case ChildOrganizationsMode.SELECTED:
            return PolicyFormMode.SELECTED;
        default:
            return PolicyFormMode.NONE;
    }
};

/**
 * Returns the error of a CDS response as "[code] description", or the fallback when the response
 * has no description.
 *
 * @param error - The error of the request.
 * @param fallback - The text to use when the response has no description.
 * @returns The error text.
 */
export const getErrorDetail = (error: unknown, fallback: string): string => {
    const data: { code?: string; description?: string } =
        (error as AxiosError<{ code?: string; description?: string }>)?.response?.data;

    if (!data?.description) {
        return fallback;
    }

    return `${ data.code ? `[${ data.code }] ` : "" }${ data.description }`;
};
