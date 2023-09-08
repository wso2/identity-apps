/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import moment from "moment";

/**
 * Returns a date-time string in human readable format
 *
 * @param dateString - (string)
 * @returns formatted date time string i.e., "16 Sep, 2022 | 15:19:16"
 */
const formatTimestampToDateTime = (dateString: string): string => {
    if (!dateString) return "N/A";

    return moment(dateString).format("DD MMM, YYYY | kk:mm:ss");
};

/**
 * Returns a date string in human readable format
 *
 * @param dateString - (string)
 * @returns formatted date time string i.e., "16 Sep, 2022"
 */
const getDateFromTimestamp = (dateString: string): string => {
    if (!dateString) return "N/A";

    return moment(dateString).format("DD MMM, YYYY");
};

/**
 * Returns a time string in human readable format
 *
 * @param dateString - (string)
 * @returns formatted date time string i.e., "15:19:16"
 */
const getTimeFromTimestamp = (dateString: string): string => {
    if (!dateString) return "N/A";

    return moment(dateString).format("kk:mm:ss");
};


/**
 * Returns converted date-time UNIX epoch value using time zone offset
 */
const getDateTimeWithOffset = (timeZone: string): number => {
    const currentLocalTime: Date = new Date();
    const convertedTime: string = `${currentLocalTime.toLocaleString("en-US", { timeZone: timeZone.split(" ")[1] })}` +
        ` ${timeZone.split(" ")[0]}`;
    const UTCValue: number = Date.parse(convertedTime);

    return UTCValue;
};

export { formatTimestampToDateTime, getDateFromTimestamp, getTimeFromTimestamp, getDateTimeWithOffset };
