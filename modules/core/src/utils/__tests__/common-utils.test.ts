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

import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";

import { AnnouncementBannerInterface, ProductReleaseTypes } from "../../models";
import { CommonUtils } from "../common-utils";

dayjs.extend(duration);

describe("CommonUtils", () => {

    describe("humanizeDateDifference", () => {

        it("should return humanized date difference for recent date", () => {

            const recentDate: string = dayjs().subtract(2, "hours").toISOString();

            const result: string = CommonUtils.humanizeDateDifference(recentDate);

            expect(result).toContain("Last modified");

            expect(result).toContain("ago");

        });

        it("should return humanized date difference for old date", () => {

            const oldDate: string = dayjs().subtract(5, "days").toISOString();

            const result: string = CommonUtils.humanizeDateDifference(oldDate);

            expect(result).toContain("Last modified");

            expect(result).toContain("ago");

        });

    });

    describe("parseProductVersion", () => {

        it("should parse milestone version correctly", () => {

            const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0-m23-SNAPSHOT");

            expect(version).toBe("5.11.0");

            expect(release).toBe("m23");

            expect(type).toBe(ProductReleaseTypes.MILESTONE);

        });

        it("should parse alpha version correctly", () => {

            const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0-alpha1-SNAPSHOT");

            expect(version).toBe("5.11.0");

            expect(release).toBe("alpha1");

            expect(type).toBe(ProductReleaseTypes.ALPHA);

        });

        it("should parse beta version correctly", () => {

            const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0-beta2-SNAPSHOT");

            expect(version).toBe("5.11.0");

            expect(release).toBe("beta2");

            expect(type).toBe(ProductReleaseTypes.BETA);

        });

        it("should parse RC version correctly", () => {

            const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0-rc1-SNAPSHOT");

            expect(version).toBe("5.11.0");

            expect(release).toBe("rc1");

            expect(type).toBe(ProductReleaseTypes.RC);

        });

        it("should include SNAPSHOT when allowSnapshot is true", () => {

            const [ version, release, type ] = CommonUtils.parseProductVersion(

                "5.11.0-m23-SNAPSHOT",

                true

            );

            expect(version).toBe("5.11.0");

            expect(release).toBe("m23-SNAPSHOT");

            expect(type).toBe(ProductReleaseTypes.MILESTONE);

        });

        it("should handle version without release type", () => {

            const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0");

            expect(version).toBe("5.11.0");

            expect(release).toBeUndefined();

            expect(type).toBeUndefined();

        });

    });

    describe("getValidAnnouncement", () => {

        const mockAnnouncements: AnnouncementBannerInterface[] = [
            {
                color: "info",
                expire: String(dayjs().add(7, "days").unix()),
                id: "announcement-1",
                message: "Test Announcement 1",
                order: 1
            },
            {
                color: "warning",
                expire: String(dayjs().add(5, "days").unix()),
                id: "announcement-2",
                message: "Test Announcement 2",
                order: 2
            },
            {
                color: "danger",
                expire: String(dayjs().subtract(1, "day").unix()),
                id: "announcement-3",
                message: "Expired Announcement",
                order: 0
            }
        ];


        it("should return the first valid unseen announcement", () => {

            const result: AnnouncementBannerInterface = CommonUtils.getValidAnnouncement(mockAnnouncements, []);

            expect(result).toBeDefined();

            expect(result.id).toBe("announcement-1");

        });

        it("should skip seen announcements", () => {

            const result: AnnouncementBannerInterface = CommonUtils
                .getValidAnnouncement(mockAnnouncements, [ "announcement-1" ]);

            expect(result).toBeDefined();

            expect(result.id).toBe("announcement-2");

        });

        it("should skip expired announcements", () => {

            const result: AnnouncementBannerInterface = CommonUtils.getValidAnnouncement(

                [ mockAnnouncements[2] ],

                []

            );

            expect(result).toBeNull();

        });

        it("should return null when all announcements are seen", () => {

            const result: AnnouncementBannerInterface = CommonUtils.getValidAnnouncement(

                mockAnnouncements,

                [ "announcement-1", "announcement-2", "announcement-3" ]

            );

            expect(result).toBeNull();

        });

        it("should return announcements in correct order", () => {

            const unorderedAnnouncements: AnnouncementBannerInterface[] = [

                mockAnnouncements[1],

                mockAnnouncements[0]

            ];

            const result: AnnouncementBannerInterface = CommonUtils.getValidAnnouncement(unorderedAnnouncements, []);

            expect(result.order).toBe(1);

        });

    });

    describe("getGravatar", () => {

        it("should return gravatar URL for email", () => {

            const email: string = "test@example.com";

            const result: string = CommonUtils.getGravatar(email);

            expect(result).toContain("https://www.gravatar.com/avatar/");

            expect(result).toContain("?d=404");

        });

        it("should trim email before generating gravatar", () => {

            const emailWithSpaces: string = "  test@example.com  ";

            const emailTrimmed: string = "test@example.com";

            const result1: string = CommonUtils.getGravatar(emailWithSpaces);

            const result2: string = CommonUtils.getGravatar(emailTrimmed);

            expect(result1).toBe(result2);

        });

    });

    describe("copyTextToClipboard", () => {

        beforeEach(() => {

            Object.assign(navigator, {
                clipboard: {
                    writeText: jest.fn()
                }
            });

        });

        it("should copy text using clipboard API when available", async () => {

            const testText: string = "Test content to copy";

            (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);

            const result: boolean = await CommonUtils.copyTextToClipboard(testText);

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText);

            expect(result).toBe(true);

        });

        it("should return false when clipboard API fails", async () => {

            const testText: string = "Test content";

            (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error("Failed"));

            const result: boolean = await CommonUtils.copyTextToClipboard(testText);

            expect(result).toBe(false);

        });

    });

    describe("parseBoolean", () => {

        it("should return true for string 'true'", () => {

            expect(CommonUtils.parseBoolean("true")).toBe(true);

        });

        it("should return true for string 'True'", () => {

            expect(CommonUtils.parseBoolean("True")).toBe(true);

        });

        it("should return true for boolean true", () => {

            expect(CommonUtils.parseBoolean(true)).toBe(true);

        });

        it("should return false for string 'false'", () => {

            expect(CommonUtils.parseBoolean("false")).toBe(false);

        });

        it("should return false for boolean false", () => {

            expect(CommonUtils.parseBoolean(false)).toBe(false);

        });

        it("should return false for invalid strings", () => {

            expect(CommonUtils.parseBoolean("invalid")).toBe(false);

        });

        it("should return false for null", () => {

            expect(CommonUtils.parseBoolean(null)).toBe(false);

        });

        it("should return false for undefined", () => {

            expect(CommonUtils.parseBoolean(undefined)).toBe(false);

        });

    });

    describe("getCountryList", () => {

        it("should return array of country objects", () => {

            const countries: {
                flag: string;
                key: number;
                text: string;
                value: string;
            }[] = CommonUtils.getCountryList();

            expect(Array.isArray(countries)).toBe(true);

            expect(countries.length).toBeGreaterThan(0);

        });

        it("should have correct structure for country objects", () => {

            const countries: {
                flag: string;
                key: number;
                text: string;
                value: string;
            }[] = CommonUtils.getCountryList();

            const firstCountry: {
                flag: string;
                key: number;
                text: string;
                value: string;
            } = countries[0];

            expect(firstCountry).toHaveProperty("flag");

            expect(firstCountry).toHaveProperty("key");

            expect(firstCountry).toHaveProperty("text");

            expect(firstCountry).toHaveProperty("value");

        });

        it("should exclude specific country codes", () => {

            const countries: {
                flag: string;
                key: number;
                text: string;
                value: string;
            }[] = CommonUtils.getCountryList();

            const excludedCodes: string[] = [ "AQ", "BQ", "CW", "GG", "IM", "JE", "BL", "MF", "SX", "SS" ];

            countries.forEach((country:{
                flag: string;
                key: number;
                text: string;
                value: string;
            }) => {

                expect(excludedCodes).not.toContain(country.flag.toUpperCase());

            });

        });

    });

    describe("scrollToTarget", () => {

        let mockElement: Element;

        beforeEach(() => {

            mockElement = document.createElement("div");

            document.body.appendChild(mockElement);

            window.scrollTo = jest.fn();

        });

        afterEach(() => {

            document.body.removeChild(mockElement);

        });

        it("should call window.scrollTo with correct parameters", () => {

            CommonUtils.scrollToTarget(mockElement);

            expect(window.scrollTo).toHaveBeenCalledWith(

                expect.objectContaining({

                    behavior: "smooth"

                })

            );

        });

        it("should apply offset when provided", () => {

            const offset: number = 100;

            CommonUtils.scrollToTarget(mockElement, offset);

            expect(window.scrollTo).toHaveBeenCalled();

        });

    });

});
