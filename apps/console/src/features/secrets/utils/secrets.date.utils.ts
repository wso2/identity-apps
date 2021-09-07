/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 * https://momentjs.com/docs/#/durations/humanize/
 * @param dateString {string}
 * @return {string}  ͌ "A day ago 👻"
 */
export const humanizeDateString = (dateString: string): string => {
    return moment(dateString)
        .utc(true)
        .fromNow();
};

/**
 * https://momentjs.com/docs/#/displaying/format/
 * @param dateString {string}
 * @return {string}  ͌ "Sunday, February 14th 2010, 3:25 pm"
 */
export const formatDateString = (dateString: string): string => {
    return moment(dateString)
        .utc(false)
        .format("dddd, MMMM Do YYYY");
};
