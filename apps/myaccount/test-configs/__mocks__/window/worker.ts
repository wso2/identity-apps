/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
 * @fileoverview Worker API Mocks.
 *
 * @remarks If you had to mock a certain Worker API,
 * document the reason and any references clearly in this file.
 */

/* eslint-disable @typescript-eslint/ban-ts-comment,  @typescript-eslint/no-empty-function */

/**
 * Worker class mock needed by the SDK since the storage strategy used in the apps is `webWorker`.
 * @see {@link https://github.com/asgardeo/asgardeo-auth-react-sdk#storage}
 * Mock Reference @see {@link https://github.com/facebook/jest/issues/3449#issuecomment-347337666}
 */
class WorkerMock {
    constructor(stringUrl) {
        // @ts-ignore
        this.url = stringUrl;
        // @ts-ignore
        this.onmessage = () => { };
    }

    postMessage(msg) {
        // @ts-ignore
        this.onmessage(msg);
    }
}

// @ts-ignore
window.Worker = WorkerMock;

/* eslint-enable @typescript-eslint/ban-ts-comment,  @typescript-eslint/no-empty-function */
