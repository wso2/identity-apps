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
 *
 */

import { resolveAppLogoFilePath, shouldResolveAppLogoFilePath } from "../../helpers";
import DeploymentConfigMock from "../__mocks__/deployment.config.json";

describe("App logo path resolving necessity checker helper function", () => {

    test("Should return true for relative paths", () => {
        expect(shouldResolveAppLogoFilePath(DeploymentConfigMock.ui.appLogoPath)).toBe(true);
    });

    test("Should return false for HTTP urls", () => {
        const path = "http://builtwithreact.io/img/logo.svg";

        expect(shouldResolveAppLogoFilePath(path)).toBe(false);
    });

    test("Should return false for HTTPS urls", () => {
        const path = "https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png";

        expect(shouldResolveAppLogoFilePath(path)).toBe(false);
    });

    test("Should return false for data urls", () => {
        const path = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

        expect(shouldResolveAppLogoFilePath(path)).toBe(false);
    });
});

describe("App logo path resolver helper function", () => {

    test("Should properly resolve relative paths", () => {
        const path = DeploymentConfigMock.ui.appLogoPath;
        const prefix = "https://localhost:9443/sample-portal/";

        expect(resolveAppLogoFilePath(path, prefix))
            .toEqual("https://localhost:9443/sample-portal/assets/images/branding/logo.svg");
    });

    test("Should return the same path for hosted URLs", () => {
        const path = "http://builtwithreact.io/img/logo.svg";
        const prefix = "https://localhost:9443/sample-portal/";

        expect(resolveAppLogoFilePath(path, prefix)).toEqual(path);
    });

    test("Should return the same url for data URLs", () => {
        const path = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
        const prefix = "https://localhost:9443/sample-portal/";

        expect(resolveAppLogoFilePath(path, prefix)).toEqual(path);
    });
});
