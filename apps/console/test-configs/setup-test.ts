/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { configure } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "./__mocks__/global";
import "./__mocks__/module";
import "./__mocks__/window";
import "./__mocks__/server/hooks";
import "../src/extensions/test-configs/setup-test";
import "../jest.config";
import "babel-polyfill";

// Needed for React 18.
// The purpose of the flag is to tell React that it’s running in a unit test-like environment.
// React will log helpful warnings if you forget to wrap an update with act.
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

configure({
    testIdAttribute: "data-componentid"
});
