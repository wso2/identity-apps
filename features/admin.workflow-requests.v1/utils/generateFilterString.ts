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
 * @param {string} requestType - Type of the request (e.g., "ALL_TASKS").
 * @param {string} status - Status of the workflow (e.g., "COMPLETED").
 * @param {string} operationType - Operation type of the workflow (e.g., "ALL", "CREATE").
 * @param {string} dateCategory - Category of the date (e.g., "CREATED", "UPDATED").
 * @param {string} startDate - Start date for filtering
 * @param {string} endDate - End date for filtering
 */

export const generateFilterString = (
    requestType: string,
    status: string,
    operationType: string,
    dateCategory: string,
    startDate: string,
    endDate: string
): string => {
    const filters: string[] = [];

    if (requestType !== "ALL_TASKS") {
        filters.push(`requestType+eq+${requestType}`);
    }

    if (status !== "ALL_TASKS" && status !== "") {
        filters.push(`status+eq+${status}`);
    }

    if (operationType !== "ALL" && operationType !== "") {
        filters.push(`operationType+eq+${operationType}`);
    }

    if (startDate && endDate) {
        filters.push(`beginDate+ge+${startDate}`);
        filters.push(`endDate+le+${endDate}`);
        filters.push(`dateCategory+eq+${dateCategory}`);
    }

    return filters.length > 0 ? filters.join('+and+') : "";
};
