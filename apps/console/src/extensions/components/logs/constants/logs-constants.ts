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

import { I18n } from "@wso2is/i18n";

/*
 * Logs constants.
 */
export class LogsConstants {

    /**
     * Log entries fetched per a single request.
     */
    public static readonly LOG_FETCH_COUNT: number = 100;

    /**
     * Height of a single log row in collapsed state.
     */
    public static readonly LOG_ROW_HEIGHT: number = 48;

    /**
     * Time out for the delay message.
     */
    public static readonly DELAY_MESSEGE_TIMEOUT: number = 15000;

    /**
     * Time out to show the logs refresh button
     */
    public static readonly REFRESH_BUTTON_TIMEOUT: number = 120000;

    /**
     * Time zone related data array
     */
    public static readonly TIME_ZONE_DATA: Array<{key: number, text: string, value: string}> = [
        { key: 0, text: "(GMT+00:00) UTC", value: "+0000"  },
        { key: 1, text: "(GMT+01:00) ECT", value: "+0100"  },
        { key: 2, text: "(GMT+02:00) EET", value: "+0200"  },
        { key: 3, text: "(GMT+02:00) ART", value: "+0200"  },
        { key: 4, text: "(GMT+03:00) EAT", value: "+0300"  },
        { key: 5, text: "(GMT+03:30) MET", value: "+0330"  },
        { key: 6, text: "(GMT+04:00) NET", value: "+0400"  },
        { key: 7, text: "(GMT+05:00) PLT", value: "+0500"  },
        { key: 8, text: "(GMT+05:30) IST", value: "+0530"  },
        { key: 9, text: "(GMT+06:00) BST", value: "+0600"  },
        { key: 10, text: "(GMT+07:00) VST", value: "+0700"  },
        { key: 11, text: "(GMT+08:00) CTT", value: "+0800"  },
        { key: 12, text: "(GMT+09:00) JST", value: "+0900"  },
        { key: 13, text: "(GMT+09:30) ACT", value: "+0930"  },
        { key: 14, text: "(GMT+10:00) AET", value: "+1000"  },
        { key: 15, text: "(GMT+11:00) SST", value: "+1100"  },
        { key: 16, text: "(GMT+12:00) NST", value: "+1200"  },
        { key: 17, text: "(GMT-11:00) MIT", value: "-1100"  },
        { key: 18, text: "(GMT-10:00) HST", value: "-1000"  },
        { key: 19, text: "(GMT-09:00) AST", value: "-0900"  },
        { key: 20, text: "(GMT-08:00) PST", value: "-0800"  },
        { key: 21, text: "(GMT-07:00) PNT", value: "-0700"  },
        { key: 22, text: "(GMT-07:00) MST", value: "-0700"  },
        { key: 23, text: "(GMT-06:00) CST", value: "-0600"  },
        { key: 24, text: "(GMT-05:00) EST", value: "-0500"  },
        { key: 25, text: "(GMT-05:00) IET", value: "-0500"  },
        { key: 26, text: "(GMT-04:00) PRT", value: "-0400"  },
        { key: 27, text: "(GMT-03:30) CNT", value: "-0330"  },
        { key: 28, text: "(GMT-03:00) AGT", value: "-0300"  },
        { key: 29, text: "(GMT-03:00) BET", value: "-0300"  },
        { key: 30, text: "(GMT-01:00) CAT", value: "-0100"  }
    ];

    /**
     * Time range dropdown options
     */
    public static readonly TIMERANGE_DROPDOWN_OPTIONS: Array<{ key: number; text: string; value: number; }> = [
        {
            key: 0,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.0"),
            value: 0.25
        },
        {
            key: 1,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.1"),
            value: 0.5
        },
        {
            key: 2,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.2"),
            value: 1
        },
        {
            key: 3,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.3"),
            value: 4
        },
        {
            key: 4,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.4"),
            value: 12
        },
        {
            key: 5,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.5"),
            value: 24
        },
        {
            key: 6,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.6"),
            value: 48
        },
        {
            key: 7,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.7"),
            value: 72
        },
        {
            key: 8,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.8"),
            value: 168
        },
        {
            key: 9,
            text: I18n.instance.t("extensions:develop.monitor.filter.dropdowns" +
                ".timeRange.texts.9"),
            value: -1
        }
    ];
}
