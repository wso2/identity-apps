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
import * as getCORSOrigins from "@wso2is/admin.core.v1/api/cors-configurations";
import React, { PropsWithChildren } from "react";
import { fireEvent, render, screen, waitFor, within } from "../../../test-configs";
import * as useGetApplicationTemplates from "../../api/use-get-application-templates";
import {
    ApplicationTemplateCardPropsInterface
} from "../../components/application-templates/application-template-card";
import * as OauthProtocolSettingsWizardForm from "../../components/wizard/oauth-protocol-settings-wizard-form";
import { CategorizedApplicationTemplatesInterface } from "../../models/application-templates";
import ApplicationTemplateSelectPage from "../../pages/application-template";
import ApplicationTemplatesProvider from "../../provider/application-templates-provider";
import { ApplicationManagementUtils } from "../../utils/application-management-utils";
import {
    applicationTemplatesListMockResponse,
    categorizedApplicationTemplatesListMockResponse
} from "../__mocks__/application-template";
import "@testing-library/jest-dom";

describe("[Applications Management Feature] - ApplicationTemplateSelectPage", () => {
    const useGetApplicationTemplatesMock: jest.SpyInstance = jest.spyOn(useGetApplicationTemplates, "default");

    useGetApplicationTemplatesMock.mockImplementation(() => ({
        data: applicationTemplatesListMockResponse,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn()
    }));

    const OauthProtocolSettingsWizardFormMock: jest.SpyInstance = jest.spyOn(
        OauthProtocolSettingsWizardForm, "OauthProtocolSettingsWizardForm");

    OauthProtocolSettingsWizardFormMock.mockImplementation(() => jest.fn());

    const getCustomInboundProtocolsMock: jest.SpyInstance = jest.spyOn(
        ApplicationManagementUtils, "getCustomInboundProtocols");

    getCustomInboundProtocolsMock.mockImplementation(() => []);

    const getCORSOriginsMock: jest.SpyInstance = jest.spyOn(
        getCORSOrigins, "getCORSOrigins");

    getCORSOriginsMock.mockImplementation(() => Promise.resolve([]));

    const cardComponent: jest.SpyInstance = jest.spyOn(Card, "default");

    cardComponent.mockImplementation((props: PropsWithChildren<ApplicationTemplateCardPropsInterface>) => {
        return (
            <div
                data-componentid={ props?.["data-componentid"] }
                onClick={ props?.onClick }
            >
                { props?.children }
            </div>
        );
    });

    test("Test the rendering of the application template selection page", async () => {
        render(
            <ApplicationTemplatesProvider>
                <ApplicationTemplateSelectPage />
            </ApplicationTemplatesProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("console:develop.pages.applicationTemplate.title")).toBeInTheDocument();
            expect(screen.getByText("console:develop.pages.applicationTemplate.subTitle")).toBeInTheDocument();
            expect(screen.getByTestId("application-template-card-single-page-application")).toBeInTheDocument();
            expect(screen.getByTestId("application-template-card-traditional-web-application")).toBeInTheDocument();
            expect(screen.getByTestId("application-template-card-custom-application")).toBeInTheDocument();
            expect(screen.getByTestId("application-template-card-salesforce")).toBeInTheDocument();
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

    test("Test the single page application create wizard", async () => {
        render(
            <ApplicationTemplatesProvider>
                <ApplicationTemplateSelectPage />
            </ApplicationTemplatesProvider>
        );

        fireEvent.click(screen.getByTestId("application-template-card-single-page-application"));

        await waitFor(() => {
            expect(screen.getByTestId("minimal-application-create-wizard-modal")).toBeInTheDocument();
            expect(
                within(screen.getByTestId("minimal-application-create-wizard-modal"))
                    .getByText("Single-Page Application")
            ).toBeInTheDocument();
            fireEvent.click(
                within(screen.getByTestId("minimal-application-create-wizard-modal")).getByTestId("link-button"));
        });
    });

    test("Test the salesforce application create wizard", async () => {
        render(
            <ApplicationTemplatesProvider>
                <ApplicationTemplateSelectPage />
            </ApplicationTemplatesProvider>
        );

        fireEvent.click(screen.getByTestId("application-template-card-salesforce"));

        await waitFor(() => {
            expect(screen.getByTestId("application-create-wizard")).toBeInTheDocument();
            expect(
                within(screen.getByTestId("application-create-wizard"))
                    .getByText("Salesforce")
            ).toBeInTheDocument();
        });
    });
});
