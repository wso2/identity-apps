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

import * as Country from "country-language";
import { MD5 } from "crypto-js";
import sortBy from "lodash-es/sortBy";
import moment from "moment";
import { AnnouncementBannerInterface, ProductReleaseTypes } from "../models";

/**
 * Class containing common utility methods used across application.
 */
export class CommonUtils {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
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
        const receivedDate = moment(date);

        return "Last modified " + moment.duration(now.diff(receivedDate)).humanize() + " ago";
    };

    /**
     * Parses the product version.
     * @example
     * // returns [ version = "5.11.0", release = "m23", type = "milestone" ]
     * const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0-m23-SNAPSHOT");
     *
     * @param version- Raw version in the form of `5.11.0-m23-SNAPSHOT`.
     * @param allowSnapshot - Show the SNAPSHOT label.
     * @returns Parsed product version.
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

    /**
     * Iterates through the announcements array and gets the valid announcement to be displayed.
     *
     * @param announcements - Array of announcements.
     * @param seen - Set of seen announcements.
     * @returns Valid announcement.
     */
    public static getValidAnnouncement(announcements: AnnouncementBannerInterface[],
        seen: string[]): AnnouncementBannerInterface {

        const sorted: AnnouncementBannerInterface[] = sortBy(announcements, [ "order" ]);
        let selected: AnnouncementBannerInterface = null;

        for (const item of sorted) {
            const isExpired = moment.duration(moment.unix(parseInt(item.expire, 10)).diff(moment()))
                .asMilliseconds() < 0;
            const isSeen = seen.includes(item.id);

            if (!isExpired && !isSeen) {
                selected = item;

                break;
            }
        }

        return selected;
    }

    /**
     * Get user image from gravatar.com.
     *
     * @param emailAddress - email address received authenticated user.
     * @returns Gravatar image path.
     */
    public static getGravatar(emailAddress: string): string {
        return "https://www.gravatar.com/avatar/" + MD5(emailAddress.trim()) + "?d=404";
    }

    /**
     * Reloads the current document.
     */
    public static refreshPage(): void {

        window.location.reload();
    }

    /**
     * Scroll page to a specific target element.
     *
     * @param element - target element.
     * @param offset - scroll stop offset value.
     */
    public static scrollToTarget (element: Element, offset?: number): void {
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = offset ? elementPosition - offset : elementPosition;

        window.scrollTo({
            behavior: "smooth",
            top: offsetPosition
        });
    }

    /**
     * Copy to clipboard with fallback.
     *
     * @param text - Text to copy.
     * @returns A promise of type boolean.
     */
    public static copyTextToClipboard(text: string): Promise<boolean> {

        const fallbackCopyTextToClipboard = (copyingText: string): Promise<boolean> => {
            const dummyTextArea: HTMLTextAreaElement = document.createElement("textarea");

            dummyTextArea.value = copyingText;

            // Avoid scrolling to bottom
            dummyTextArea.style.top = "0";
            dummyTextArea.style.left = "0";
            dummyTextArea.style.position = "fixed";

            document.body.appendChild(dummyTextArea);
            dummyTextArea.focus();
            dummyTextArea.select();

            try {
                const copyStatus: boolean = document.execCommand("copy");

                dummyTextArea.remove();
                document.body.removeChild(dummyTextArea);

                return Promise.resolve<boolean>(copyStatus);
            } catch (e) {
                return Promise.resolve(false);
            }
        };

        if (!navigator.clipboard) {
            return fallbackCopyTextToClipboard(text);
        }

        return navigator.clipboard.writeText(text).then(() => true, () => false);
    }

    /**
     * Get the list of countries to be added to the country dropdown input field.
     *
     * @returns List of country objects.
     */
    public static getCountryList(): {
        flag: string;
        key: number;
        text: string;
        value: string;
    }[] {
        const countryCodesToSkip = [ "AQ", "BQ", "CW", "GG", "IM", "JE", "BL", "MF", "SX", "SS" ];
        const countries: any[] = Country.getCountries();
        const countryDropDown: {
            flag: string;
            key: number;
            text: string;
            value: string;
        }[] = [];

        countries.forEach((country, index) => {
            if (!countryCodesToSkip.includes(country.code_2)) {
                countryDropDown.push({
                    flag: country.code_2.toLowerCase(),
                    key: index,
                    text: country.name,
                    value: country.name
                });
            }
        });

        return countryDropDown;
    }

    /**
     * Returns boolean value for both boolean strings and primitive boolean value.
     *
     * @param booleanResult - Result that needs to be converted to boolean.
     * Can be a string or a boolean value.
     * @returns Parsed boolean value.
     */
    public static parseBoolean(booleanResult: string | unknown): boolean {
        return (String(booleanResult).toLowerCase() === "true");
    }
}
