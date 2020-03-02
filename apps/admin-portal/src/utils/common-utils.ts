/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * This function calculate the number of days since the last
 * modified date to the current date.
 *
 * @param modifiedDate - Data string that needs to be calculated.
 */

import moment from "moment"
/**
 * Class containing common utility methods used
 * throuought the application.
 * 
 */
export class CommonUtils {
    
    /**
     * A util method to humanize the last modified date.
     * 
     * @param date - Date string which needs to be humanize
     */
    static humanizeDateDifference = (date: string): string => {
        const now = moment(new Date());
        const recievedDate = moment(date);
        return "last modified " + moment.duration(now.diff(recievedDate)).humanize() + " ago";
    };
    
}
