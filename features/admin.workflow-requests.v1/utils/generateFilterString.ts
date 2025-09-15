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
 * Utility function to generate a filter string.
 * @param status - Status of the workflow (e.g., "COMPLETED").
 * @param operationType - Operation type of the workflow (e.g., "ALL", "CREATE").
 * @param createdFromTime - Created start date for filtering
 * @param createdToTime - Created end date for filtering
 * @param updatedFromTime - Updated start date for filtering
 * @param updatedToTime - Updated end date for filtering
 */

export const generateFilterString = (
    status: string,
    operationType: string,
    createdFromTime: string,
    createdToTime: string,
    updatedFromTime: string,
    updatedToTime: string
): string => {
    const filters: string[] = [];

    if (status !== "ALL_TASKS" && status !== "") {
        filters.push(`status+eq+${status}`);
    }

    if (operationType !== "ALL" && operationType !== "") {
        filters.push(`operationType+eq+${operationType}`);
    }

    if (createdFromTime) {
        filters.push(`createdAt+ge+${createdFromTime}`);
    }

    if (createdToTime) {
        filters.push(`createdAt+le+${createdToTime}`);
    }

    if (updatedFromTime) {
        filters.push(`updatedAt+ge+${updatedFromTime}`);
    }

    if (updatedToTime) {
        filters.push(`updatedAt+le+${updatedToTime}`);
    }

    return filters.length > 0 ? filters.join("+and+") : "";
};
