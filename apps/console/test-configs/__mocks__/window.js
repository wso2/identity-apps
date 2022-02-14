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
 * @fileoverview Mocks needed for the UI tests.
 *
 * @remarks If you had to mock a certain window object or document object,
 * document the reason and any references clearly in this file.
 */

import DeploymentConfig from "../../src/public/deployment.config.json";

/**
 * `AppUtils` Mock.
 * @remarks The `deployment.config.json file is resolved and stored in the window object under `AppUtils`.
 * This has a method called `getConfig` that needs mocking.
 */
window.AppUtils = {
    getConfig: function () {
        return DeploymentConfig;
    }
};

/**
 * Worker class mock needed by the SDK since the storage strategy used in the apps is `webWorker`.
 * @see {@link https://github.com/asgardeo/asgardeo-auth-react-sdk#storage}
 * Mock Reference @see {@link https://github.com/facebook/jest/issues/3449#issuecomment-347337666}
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

window.Worker = Worker;

/**
 * Needed to avoid the JSDom exceptions due to Code Mirror.
 * @see {@link https://github.com/jsdom/jsdom/issues/3002}
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
