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
 * Utility function to format date and time for backend requests.
 * Converts milliseconds to a specific string format.
 *
 * @param ms - The time in milliseconds as a string.
 * @param _isStart - Indicates if the time is a start time (unused).
 * @returns Formatted date and time string for backend.
 */
export const formatMsToBackend = (ms: string, _isStart: boolean): string => {
    if (!ms) return "";
    const date: Date = new Date(Number(ms));
    const yyyy: number = date.getFullYear();
    const MM: string = String(date.getMonth() + 1).padStart(2, "0");
    const dd: string = String(date.getDate()).padStart(2, "0");
    const HH: string = String(date.getHours()).padStart(2, "0");
    const mm: string = String(date.getMinutes()).padStart(2, "0");
    const ss: string = String(date.getSeconds()).padStart(2, "0");
    const SSS: string = String(date.getMilliseconds()).padStart(3, "0");

    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}.${SSS}`;
};
