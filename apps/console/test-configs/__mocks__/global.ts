/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * @fileoverview Mocks of Global objects.
 *
 * @remarks If you had to mock a certain global object,
 * document the reason and any references clearly in this file.
 */

import { TextDecoder, TextEncoder } from "util";

// jsdom Doesn't seem to have TextEncoder defined in global for the DOM.
// Hence adding the node.js one. See https://github.com/jsdom/jsdom/issues/2524.
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
