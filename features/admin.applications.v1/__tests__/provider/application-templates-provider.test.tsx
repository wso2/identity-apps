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

import React from "react";
import { render, screen } from "../../../test-configs";
import * as useGetApplicationTemplates from "../../api/use-get-application-templates";
import { CategorizedApplicationTemplatesInterface } from "../../models/application-templates";
import ApplicationTemplatesProvider from "../../provider/application-templates-provider";
import {
    applicationTemplatesListMockResponse, categorizedApplicationTemplatesListMockResponse
} from "../__mocks__/application-template";
import "@testing-library/jest-dom";
import MockApplicationTemplatesComponent from "../__mocks__/mock-application-templates-component";

describe("[Applications Management Feature] - Application Templates Provider", () => {
    const useGetApplicationTemplatesMock: jest.SpyInstance = jest.spyOn(useGetApplicationTemplates, "default");

    useGetApplicationTemplatesMock.mockImplementation(() => ({
        data: applicationTemplatesListMockResponse,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn()
    }));

    test("Test whether the application templates provider provides the application templates list correctly.", () => {
        render(
            <ApplicationTemplatesProvider>
                <MockApplicationTemplatesComponent />
            </ApplicationTemplatesProvider>
        );

        expect(screen.getByTestId("mock-application-templates-component-loading-status")).toBeInTheDocument();
        expect(screen.getByTestId("mock-application-templates-component-templates").innerHTML)
            .toContain(`Number of templates-${applicationTemplatesListMockResponse.length}`);
        categorizedApplicationTemplatesListMockResponse.forEach((item: CategorizedApplicationTemplatesInterface) => {
            expect(screen.getByTestId(`mock-application-templates-component-${item.id}`).innerHTML)
                .toContain(`Number of templates-${item.templates.length}`);
        });
    });
});
