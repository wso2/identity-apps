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

import { TextDecoder, TextEncoder } from "util";
require("../jest.config");
require("@testing-library/jest-dom/extend-expect");
require("babel-polyfill");

var configObject = require("./__mocks__/mock.deployment.config.json");

/**
 * Mock worker class
 */
class Worker {
    constructor(stringUrl) {
        this.url = stringUrl;
        this.onmessage = () => { };
    }

    postMessage(msg) {
        this.onmessage(msg);
    }
}

/**
 * Suggested fix for i18next warnings
 * See also {@link https://github.com/i18next/react-i18next/issues/876}
 */
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: key => key
    })
}));

/**
 * Suggested fix for jsdom issue
 * See also {@link https://github.com/jsdom/jsdom/issues/3002}
 */
document.createRange = () => {
    const range = new Range();

    range.getBoundingClientRect = jest.fn();

    range.getClientRects = jest.fn(() => ({
        item: () => null,
        length: 0
    }));

    return range;
};

/**
 * Mock configurations
 */
window.AppUtils = {
    getConfig: function () {
        return configObject;
    }
};

window.Worker = Worker;

// jsdom Doesn't seem to have TextEncoder defined in global for the DOM.
// Hence adding the node.js one. See https://github.com/jsdom/jsdom/issues/2524.
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
