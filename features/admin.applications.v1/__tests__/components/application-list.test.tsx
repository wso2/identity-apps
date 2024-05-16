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

import * as Grid from "@oxygen-ui/react/Grid";
import React, { PropsWithChildren } from "react";
import { render, screen, waitFor } from "../../../test-configs";
import * as useGetApplicationTemplates from "../../api/use-get-application-templates";
import { ApplicationList, ApplicationListPropsInterface } from "../../components/application-list";
import ApplicationTemplatesProvider from "../../provider/application-templates-provider";
import {
    TEMPLATE_NAMES,
    applicationListMockResponse,
    applicationTemplatesListMockResponse
} from "../__mocks__/application-template";
import "@testing-library/jest-dom";

describe("[Applications Management Feature] - ApplicationList", () => {
    const useGetApplicationTemplatesMock: jest.SpyInstance = jest.spyOn(useGetApplicationTemplates, "default");

    useGetApplicationTemplatesMock.mockImplementation(() => ({
        data: applicationTemplatesListMockResponse,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn()
    }));

    const gridComponent: jest.SpyInstance = jest.spyOn(Grid, "default");

    gridComponent.mockImplementation((props: PropsWithChildren) => <div>{ props?.children }</div>);

    const props: ApplicationListPropsInterface = {
        list: applicationListMockResponse
    };

    test("Test whether the application list correctly identifies the created app template", async () => {
        render(
            <ApplicationTemplatesProvider>
                <ApplicationList { ...props } />
            </ApplicationTemplatesProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(TEMPLATE_NAMES.salesforce)).toBeInTheDocument();
            expect(screen.getByText(TEMPLATE_NAMES.spa)).toBeInTheDocument();
        });
    });
});
