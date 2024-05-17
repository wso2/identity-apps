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

import * as Card from "@oxygen-ui/react/Card";
import React, { PropsWithChildren } from "react";
import { fireEvent, render, screen, waitFor, within } from "../../../../test-configs";
import * as useGetApplicationTemplates from "../../../api/use-get-application-templates";
import ApplicationTemplateGrid, {
    ApplicationTemplateGridPropsInterface
} from "../../../components/application-templates/application-templates-grid";
import { CategorizedApplicationTemplatesInterface } from "../../../models/application-templates";
import ApplicationTemplatesProvider from "../../../provider/application-templates-provider";
import { ApplicationManagementUtils } from "../../../utils/application-management-utils";
import {
    applicationTemplatesListMockResponse, categorizedApplicationTemplatesListMockResponse
} from "../../__mocks__/application-template";
import "@testing-library/jest-dom";

jest.mock("../../../../admin.core.v1", () => {
    const adminCore: Record<string, any> = jest.requireActual("../../../../admin.core.v1");

    return {
        ...adminCore,
        getEmptyPlaceholderIllustrations: jest.fn().mockReturnValue({})
    };
});

describe("[Applications Management Feature] - ApplicationTemplateGrid", () => {
    const props: ApplicationTemplateGridPropsInterface = {
        onTemplateSelect: jest.fn()
    };

    const useGetApplicationTemplatesMock: jest.SpyInstance = jest.spyOn(useGetApplicationTemplates, "default");

    useGetApplicationTemplatesMock.mockImplementation(() => ({
        data: applicationTemplatesListMockResponse,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn()
    }));

    const getCustomInboundProtocolsMock: jest.SpyInstance = jest.spyOn(
        ApplicationManagementUtils, "getCustomInboundProtocols");

    getCustomInboundProtocolsMock.mockImplementation(() => []);

    const cardComponent: jest.SpyInstance = jest.spyOn(Card, "default");

    cardComponent.mockImplementation((props: PropsWithChildren) => <div>{ props?.children }</div>);

    /**
     * Perform the assertion to ensure that the correct application template
     * cards are being displayed.
     *
     * @param empty - Whether the expected search result is empty or not.
     */
    const assert = async (empty: boolean = false): Promise<void> => {
        await waitFor(() => {
            if (empty) {
                expect(screen.queryByText("Salesforce")).not.toBeInTheDocument();
            } else {
                expect(screen.getByText("Salesforce")).toBeInTheDocument();
            }
            expect(screen.queryByText("Single-Page Application")).not.toBeInTheDocument();
            expect(screen.queryByText("Traditional Web Application")).not.toBeInTheDocument();
            expect(screen.queryByText("Standard-Based Application")).not.toBeInTheDocument();
            categorizedApplicationTemplatesListMockResponse.forEach(
                (category: CategorizedApplicationTemplatesInterface) => {
                    expect(screen.queryByText(category.displayName)).not.toBeInTheDocument();
                    expect(screen.queryByText(category?.description ?? "")).not.toBeInTheDocument();
                }
            );
        });
    };

    test("Test the rendering of the application template grid component", async () => {
        render(
            <ApplicationTemplatesProvider>
                <ApplicationTemplateGrid { ...props } />
            </ApplicationTemplatesProvider>
        );

        await waitFor(() => {
            categorizedApplicationTemplatesListMockResponse.forEach(
                (category: CategorizedApplicationTemplatesInterface) => {
                    if (category?.templates?.length > 0) {
                        expect(screen.getByText(category.displayName)).toBeInTheDocument();
                        expect(screen.getByText(category?.description ?? "")).toBeInTheDocument();
                    }
                }
            );
        });
    });

    test("Test the search functionality of the template grid component", async () => {
        render(
            <ApplicationTemplatesProvider>
                <ApplicationTemplateGrid { ...props } />
            </ApplicationTemplatesProvider>
        );

        fireEvent.change(
            within(screen.getByTestId("search-with-filters")).getByRole("textbox"),
            { target: { value: "Salesforce" } }
        );

        await assert();

        fireEvent.change(
            within(screen.getByTestId("search-with-filters")).getByRole("textbox"),
            { target: { value: "salesforce" } }
        );

        await assert();

        fireEvent.change(
            within(screen.getByTestId("search-with-filters")).getByRole("textbox"),
            { target: { value: "sa" } }
        );
        fireEvent.click(
            within(screen.getByTestId("search-with-filters")).getByText("SSO")
        );

        await assert();

        fireEvent.click(
            within(screen.getByTestId("search-with-filters")).getByText("SSO")
        );
        fireEvent.change(
            within(screen.getByTestId("search-with-filters")).getByRole("textbox"),
            { target: { value: "this is a query to get the empty search result" } }
        );

        await assert(true);
        await waitFor(() => {
            expect(screen.getByTestId("application-template-grid-empty-search-placeholder")).toBeInTheDocument();
        });
    });

    test("Test the empty placeholder when the application template list is empty", async () => {
        useGetApplicationTemplatesMock.mockImplementation(() => ({
            data: [],
            error: null,
            isLoading: false,
            isValidating: false,
            mutate: jest.fn()
        }));

        render(
            <ApplicationTemplatesProvider>
                <ApplicationTemplateGrid { ...props } />
            </ApplicationTemplatesProvider>
        );

        await assert(true);
        await waitFor(() => {
            expect(screen.getByTestId("application-template-grid-empty-placeholder")).toBeInTheDocument();
        });
    });
});
