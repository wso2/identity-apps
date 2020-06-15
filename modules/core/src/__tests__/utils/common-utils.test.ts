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

import { ProductReleaseTypes } from "../../models";
import { CommonUtils } from "../../utils";

describe("Product version parser util function", () => {
    test("Should return the correct version number and release", () => {
        const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0-alpha2");
        expect(version).toBe("5.11.0");
        expect(release).toBe("alpha2");
        expect(type).toBe(ProductReleaseTypes.ALPHA);
    });

    test("Should parse the version for a GA release", () => {
        const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0");
        expect(version).toBe("5.11.0");
        expect(release).toBe(undefined);
        expect(type).toBe(undefined);
    });

    test("Should return the correct version number, release &n type with snapshot", () => {
        const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0-m24-SNAPSHOT", true);
        expect(version).toBe("5.11.0");
        expect(release).toBe("m24-SNAPSHOT");
        expect(type).toBe(ProductReleaseTypes.MILESTONE);
    });

    test("Should parse the version correctly", () => {
        const [ version, release, type ] = CommonUtils.parseProductVersion("5.11.0-beta", true);
        expect(version).toBe("5.11.0");
        expect(release).not.toBe("alpha-SNAPSHOT");
        expect(type).toBe(ProductReleaseTypes.BETA);
    });
});
