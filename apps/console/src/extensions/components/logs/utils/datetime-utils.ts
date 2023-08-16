/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
