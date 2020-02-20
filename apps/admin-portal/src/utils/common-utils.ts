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
 * @param modifiedDate
 */
export const handleLastModifiedDate = (modifiedDate: string): string => {
    if (modifiedDate) {
        const currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
        const modDate = modifiedDate.split("T");
        const modDateNew = modDate[0].replace(/-/g, "/");

        const dateX = new Date(modDateNew);
        const dateY = new Date(currentDate);

        if (dateY.getDate() - dateX.getDate() !== 0) {
            return "last modified" + " " + Math.abs(dateY.getDate() - dateX.getDate()) + " " + "days ago";
        } else {
            return " last modified today";
        }
    } else {
        return;
    }
};
