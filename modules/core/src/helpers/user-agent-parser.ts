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

import { UAParser } from "ua-parser-js";
import IBrowser = IUAParser.IBrowser;
import IDevice = IUAParser.IDevice;
import IOS = IUAParser.IOS;
import IEngine = IUAParser.IEngine;

/**
 * Helper class to parse user agent strings.
 */
export class UserAgentParser {

    private static parser: UAParser;

    /**
     * Constructor.
     */
    constructor() {
        UserAgentParser.parser = new UAParser();
    }

    /**
     * Set UA string to parse.
     *
     * @param {string} rawString - Raw user agent string.
     */
    public set uaString(rawString: string) {
        UserAgentParser.parser.setUA(rawString);
    }

    /**
     * Retrieves the browser information.
     *
     * @return {IUAParser.IBrowser}
     */
    public get browser(): IBrowser {
        return UserAgentParser.parser.getBrowser();
    }

    /**
     * Retrieves the device information.
     *
     * @remarks
     * `ua-parser-js` returns undefined for desktop device types. A workaround has been
     * implemented as a fallback. Refer [here]{@link https://github.com/faisalman/ua-parser-js/issues/16}
     * @return {IUAParser.IDevice | {vendor: string; model: string; type: string}}
     */
    public get device(): IDevice {

        if (UserAgentParser.parser.getDevice() && UserAgentParser.parser.getDevice().type) {
            return UserAgentParser.parser.getDevice();
        }

        const ua = UserAgentParser.parser.getUA();

        // tslint:disable:max-line-length
        const type = ua.match(/iPad/i) || ua.match(/tablet/i) && !ua.match(/RX-34/i) || ua.match(/FOLIO/i) ? "tablet"
            : ua.match(/Linux/i) && ua.match(/Android/i) && !ua.match(/Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945/i) ? "tablet"
                : ua.match(/Kindle/i) || ua.match(/Mac.OS/i) && ua.match(/Silk/i) ? "tablet"
                    // eslint-disable-next-line no-useless-escape
                    : ua.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|\_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || ua.match(/MB511/i) && ua.match(/RUTEM/i) ? "tablet"
                        : ua.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i) ? "mobile"
                            // eslint-disable-next-line no-useless-escape
                            : ua.match(/Opera/i) && ua.match(/Windows.NT.5/i) && ua.match(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i) ? "mobile"
                                : ua.match(/Windows.(NT|XP|ME|9)/) && !ua.match(/Phone/i) || ua.match(/Win(9|.9|NT)/i) ? "desktop"
                                    : ua.match(/Macintosh|PowerPC/i) && !ua.match(/Silk/i) ? "desktop"
                                        : ua.match(/Linux/i) && ua.match(/X11/i) ? "desktop"
                                            : ua.match(/Solaris|SunOS|BSD/i) ? "desktop"
                                                : ua.match(/Bot|Crawler|Spider|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|TinEye/i) && !ua.match(/Mobile/i) ? "desktop" : "mobile";
        // tslint:enable:max-line-length

        return { type, vendor: null, model: null };
    }

    /**
     * Retrieves the engine information.
     *
     * @return {IUAParser.IEngine}
     */
    public get engine(): IEngine {
        return UserAgentParser.parser.getEngine();
    }

    /**
     * Retrieves the operating system information.
     *
     * @return {IUAParser.IOS}
     */
    public get os(): IOS {
        return UserAgentParser.parser.getOS();
    }
}
