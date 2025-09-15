/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

    return moment(dateString).format("DD MMM, YYYY | HH:mm:ss");
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

    return moment(dateString).format("HH:mm:ss");
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

/**
 * Get the current time zone using local time.
 */
const getCurrentTimeZone = (): string => {
    // Create a new Date object
    const date: Date = new Date();

    // Get the timezone offset in minutes
    const offset: number = date.getTimezoneOffset();

    // Convert the offset to hours and minutes
    const absOffset: number = Math.abs(offset);
    const hours: number = Math.floor(absOffset / 60);
    const minutes: number = absOffset % 60;

    // Determine if the offset is positive or negative
    const sign: string = offset <= 0 ? "+" : "-";

    // Format hours and minutes to always have two digits
    const formattedHours: string = String(hours).padStart(2, "0");
    const formattedMinutes: string = String(minutes).padStart(2, "0");

    // Return the formatted timezone offset
    return `${sign}${formattedHours}${formattedMinutes}`;
};

/**
 * Resolve the maximum time that can be set for the From param based on the given conditions.
 *
 * @param startDate - The start date in YYYY-MM-DD format.
 * @param endDate - The end date in YYYY-MM-DD format.
 * @param timezoneOffset - The timezone offset in the format +HHMM or -HHMM.
 * @param endTime - The end time as a string in HH:mm format, or null if not defined.
 * @returns The maximum from time as a string in HH:mm format.
 */
const resolveMaxFromTime = (
    startDate: string,
    endDate: string,
    timezoneOffset: string,
    endTime: string | null
): string => {
    const date: Date = new Date();

    // Parse the timezone offset
    const sign: string = timezoneOffset[0];
    const hoursOffset: number = parseInt(timezoneOffset.slice(1, 3), 10);
    const minutesOffset: number = parseInt(timezoneOffset.slice(3, 5), 10);
    const totalOffsetMinutes: number = (hoursOffset * 60 + minutesOffset) * (sign === "+" ? 1 : -1);

    // Get the current time in UTC
    const utcHours: number = date.getUTCHours();
    const utcMinutes: number = date.getUTCMinutes();

    // Calculate the local time in the specified timezone
    const localMinutes: number = utcMinutes + totalOffsetMinutes;
    const localHours: number = utcHours + Math.floor(localMinutes / 60);
    const localMinutesRemainder: number = localMinutes % 60;

    // Adjust hours and minutes to fit into 24-hour format
    const adjustedHours: number = (localHours + 24) % 24;
    const adjustedMinutes: number = (localMinutesRemainder + 60) % 60;

    // Format the time as HH:mm
    const formattedHours: string = adjustedHours.toString().padStart(2, "0");
    const formattedMinutes: string = adjustedMinutes.toString().padStart(2, "0");
    const currentTime: string = `${formattedHours}:${formattedMinutes}`;

    const today: string = date.toISOString().split("T")[0];

    // If from date is current date OR if its same as to date,
    // it should be less than the end time IF end time is defined.
    // Otherwise it should be less than the current time based on the timezone
    if (startDate === endDate || startDate === today) {

        return endTime ?? currentTime;
    }

    // Default case: no restriction
    return "23:59";
};

/**
 * Resolve the maximum time that can be set for the To param based on the given conditions.
 *
 * @param startDate - The start date in YYYY-MM-DD format.
 * @param endDate - The end date in YYYY-MM-DD format.
 * @param timezoneOffset - The timezone offset in the format +HHMM or -HHMM.
 * @param startTime - The start time as a string in HH:mm format.
 * @returns The maximum to time as a string in HH:mm format.
 */
const resolveMaxToTime = (endDate: string, timezoneOffset: string): string => {
    const date: Date= new Date();

    // Parse the timezone offset
    const sign: string = timezoneOffset[0];
    const hoursOffset: number = parseInt(timezoneOffset.slice(1, 3), 10);
    const minutesOffset: number = parseInt(timezoneOffset.slice(3, 5), 10);
    const totalOffsetMinutes: number = (hoursOffset * 60 + minutesOffset) * (sign === "+" ? 1 : -1);

    // Get the current time in UTC
    const utcHours: number = date.getUTCHours();
    const utcMinutes: number = date.getUTCMinutes();

    // Calculate the local time in the specified timezone
    const localMinutes: number = utcMinutes + totalOffsetMinutes;
    const localHours: number = utcHours + Math.floor(localMinutes / 60);
    const localMinutesRemainder: number = localMinutes % 60;

    // Adjust hours and minutes to fit into 24-hour format
    const adjustedHours: number = (localHours + 24) % 24;
    const adjustedMinutes: number = (localMinutesRemainder + 60) % 60;

    // Format the time as HH:mm
    const formattedHours: string = adjustedHours.toString().padStart(2, "0");
    const formattedMinutes: string = adjustedMinutes.toString().padStart(2, "0");
    const currentTime: string = `${formattedHours}:${formattedMinutes}`;

    const today: string = date.toISOString().split("T")[0];

    // If to date is current date, it should be less than the current time based on the timezone
    if (endDate === today) {
        return currentTime;
    }

    // Default case: no restriction
    return "23:59";
};

export {
    formatTimestampToDateTime,
    getCurrentTimeZone,
    getDateFromTimestamp,
    getTimeFromTimestamp,
    getDateTimeWithOffset,
    resolveMaxFromTime,
    resolveMaxToTime
};
