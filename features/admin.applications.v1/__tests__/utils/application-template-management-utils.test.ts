/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import "@testing-library/jest-dom";
import { ApplicationTemplateConstants } from "../../constants/application-templates";
import { ApplicationTemplateManagementUtils } from "../../utils/application-template-management-utils";

describe("[Applications Management Feature] - ApplicationTemplateManagementUtils", () => {

    describe("'resolveApplicationResourcePath' function", () => {

        test("Test the function with the console base url placeholder", async () => {
            const result: string = ApplicationTemplateManagementUtils.resolveApplicationResourcePath(
                `${ApplicationTemplateConstants.CONSOLE_BASE_URL_PLACEHOLDER}/test/app/template/logo.png`
            );

            expect(result).toBe("https://localhost:9001/console/test/app/template/logo.png");
        });

        test("Test the function with a http url", async () => {
            const result: string = ApplicationTemplateManagementUtils.resolveApplicationResourcePath(
                "http://example.com/test/app/template/logo.svg"
            );

            expect(result).toBe("http://example.com/test/app/template/logo.svg");
        });

        test("Test the function with a https url", async () => {
            const result: string = ApplicationTemplateManagementUtils.resolveApplicationResourcePath(
                "https://example.com/test/app/template/logo.jpeg"
            );

            expect(result).toBe("https://example.com/test/app/template/logo.jpeg");
        });

        test("Test the function with a data url", async () => {
            const result: string = ApplicationTemplateManagementUtils.resolveApplicationResourcePath(
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAATTTAAAC1HAwCA"
                + "AAAC0lEQVR42mP8/wcAAgAB/FRpWZkYYYASUVORK5CYII="
            );

            expect(result).toBe(
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAATTTAAAC1HAwCA"
                + "AAAC0lEQVR42mP8/wcAAgAB/FRpWZkYYYASUVORK5CYII="
            );
        });

        test("Test the function with a relative path", async () => {
            const result: string = ApplicationTemplateManagementUtils.resolveApplicationResourcePath(
                "test/app/template/logo.jpeg"
            );

            expect(result).toBe("https://localhost:9001/console/resources/applications/test/app/template/logo.jpeg");
        });
    });
});
