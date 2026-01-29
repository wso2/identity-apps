/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

/**
 * @see https://day.js.org/docs/en/durations/humanize
 *
 * @param dateString - The date string to humanize.
 * @returns A human-readable relative time string, or "N/A" if input is invalid.
 */
export const humanizeDateString = (dateString: string): string => {
    if (!dateString) return "N/A";

    return dayjs(dateString)
        .utc(true)
        .fromNow();
};

/**
 * @see https://day.js.org/docs/en/durations/format
 *
 * @param dateString - The date string to format.
 * @returns A formatted date string, or "N/A" if input is invalid.
 */
export const formatDateString = (dateString: string): string => {
    if (!dateString) return "N/A";

    return dayjs(dateString).format("dddd, MMMM Do YYYY");
};
