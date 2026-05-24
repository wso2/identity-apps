/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import * as translations from "../translations";
import { NL_NL } from "../translations/nl-NL";
import { LocaleBundle } from "../models";

describe("Dutch (Netherlands) locale - registration, metadata validation, and barrel export", () => {
    it("NL_NL export exists and has correct meta", () => {
        expect(NL_NL).toBeDefined();
        expect(NL_NL.meta.code).toBe("nl-NL");
        expect(NL_NL.meta.flag).toBe("nl");
        expect(NL_NL.meta.direction).toBe("ltr");
        expect(NL_NL.meta.name).toBe("Nederlands (Nederland)");
    });

    it("nl-NL is re-exported from the translation barrel", () => {
        const codes: (string | undefined)[] = Object.values(translations).map(
            (bundle: LocaleBundle) => bundle.meta?.code
        );
        expect(codes).toContain("nl-NL");
    });
});
