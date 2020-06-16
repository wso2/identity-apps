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

import moment from "moment";
import { ProductReleaseTypes } from "../models";

/**
 * Class containing common utility methods used across application.
 */
export class CommonUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * A util method to humanize the last modified date.
     *
     * @param date - Date string which needs to be humanize
     */
    static humanizeDateDifference = (date: string): string => {
        const now = moment(new Date());
        const recievedDate = moment(date);
        return "Last modified " + moment.duration(now.diff(recievedDate)).humanize() + " ago";
    };

    /**
     * Parses the product version.
     * @example
     * // returns [ version = "5.11.0", release = "m23", type = "milestone" ]
     * const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0-m23-SNAPSHOT");
     *
     * @param {string} version- Raw version in the form of `5.11.0-m23-SNAPSHOT`.
     * @param {boolean} allowSnapshot - Show the SNAPSHOT label.
     * @return {[string, string, ProductReleaseTypes]}
     */
    public static parseProductVersion(version: string,
                                      allowSnapshot: boolean = false): [ string, string, ProductReleaseTypes ]  {

        const tokens: string[] = version.split("-");
        const versionNo: string = tokens[0];
        const release: string = tokens[1];
        let releaseType: ProductReleaseTypes = undefined;

        if (release) {
            if(release.startsWith("m")) {
                releaseType = ProductReleaseTypes.MILESTONE;
            } else if (release.startsWith("alpha")) {
                releaseType = ProductReleaseTypes.ALPHA;
            } else if (release.startsWith("beta")) {
                releaseType = ProductReleaseTypes.BETA;
            } else if (release.startsWith("rc")) {
                releaseType = ProductReleaseTypes.RC;
            }
        }

        if (allowSnapshot && tokens[2] === "SNAPSHOT") {
            return [ versionNo, `${ release }-SNAPSHOT`, releaseType ];
        }

        return [ versionNo, release, releaseType ];
    }
}
