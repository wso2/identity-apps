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

import { I18n } from "@wso2is/i18n";
import { createMemoryHistory } from "history";
import React from "react";
import * as getCORSOrigins from "../../../admin.core.v1/api/cors-configurations";
import * as useUIConfig from "../../../admin.core.v1/hooks/use-ui-configs";
import { render, screen, waitFor, within } from "../../../test-configs";
import * as api from "../../api/application";
import * as useGetApplication from "../../api/use-get-application";
import * as useGetApplicationTemplateMetadata from "../../api/use-get-application-template-metadata";
import * as useGetApplicationTemplates from "../../api/use-get-application-templates";
import ApplicationEditPage, { ApplicationEditPageInterface } from "../../pages/application-edit";
import ApplicationTemplatesProvider from "../../provider/application-templates-provider";
import { ApplicationManagementUtils } from "../../utils/application-management-utils";
import {
    applicationMockResponse,
    applicationSearchListMockResponse,
    applicationTemplateMetadataMockResponse,
    applicationTemplatesListMockResponse,
    spaApplicationMockResponse
} from "../__mocks__/application-template";
import "@testing-library/jest-dom";

describe("[Applications Management Feature] - ApplicationEditPage", () => {
    const useGetApplicationTemplatesMock: jest.SpyInstance = jest.spyOn(useGetApplicationTemplates, "default");

    useGetApplicationTemplatesMock.mockImplementation(() => ({
        data: applicationTemplatesListMockResponse,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn()
    }));

    const useGetApplicationMock: jest.SpyInstance = jest.spyOn(useGetApplication, "useGetApplication");

    useGetApplicationMock.mockImplementation(() => ({
        data: spaApplicationMockResponse,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn()
    }));

    const getApplicationListMock: jest.SpyInstance = jest.spyOn(api, "getApplicationList");

    getApplicationListMock.mockImplementation(() => Promise.resolve(applicationSearchListMockResponse));

    const useUIConfigMock: jest.SpyInstance = jest.spyOn(useUIConfig, "default");

    useUIConfigMock.mockImplementation(() => ({
        UIConfig: {
            legacyMode: {
                organizations: true
            }
        }
    }));

    const getInboundProtocolsMock: jest.SpyInstance = jest.spyOn(
        ApplicationManagementUtils, "getInboundProtocols");

    getInboundProtocolsMock.mockImplementation(() => Promise.resolve());

    const getInboundProtocolConfigMock: jest.SpyInstance = jest.spyOn(api, "getInboundProtocolConfig");

    getInboundProtocolConfigMock.mockImplementation(() => Promise.resolve({}));

    const getSAMLApplicationMetaMock: jest.SpyInstance = jest.spyOn(
        ApplicationManagementUtils, "getSAMLApplicationMeta");

    getSAMLApplicationMetaMock.mockImplementation(() => Promise.resolve());

    const getOIDCApplicationMetaMock: jest.SpyInstance = jest.spyOn(
        ApplicationManagementUtils, "getOIDCApplicationMeta");

    getOIDCApplicationMetaMock.mockImplementation(() => Promise.resolve());

    const getCORSOriginsMock: jest.SpyInstance = jest.spyOn(
        getCORSOrigins, "getCORSOrigins");

    getCORSOriginsMock.mockImplementation(() => Promise.resolve([]));

    const translateMock: jest.SpyInstance = jest.spyOn(I18n.instance, "t");

    translateMock.mockImplementation((key: string) => key);

    const props: ApplicationEditPageInterface = {
        history: createMemoryHistory(),
        location: {
            hash: "",
            pathname: "/t/carbon.super/console/applications/c3a3d3ce-4166-4e6a-963a-94e1c1c8de5f",
            search: "",
            state: null
        },
        match: {
            isExact: true,
            params: {
                id: "c3a3d3ce-4166-4e6a-963a-94e1c1c8de5f"
            },
            path: "/t/carbon.super/console/applications/c3a3d3ce-4166-4e6a-963a-94e1c1c8de5f",
            url: "https://localhost:9001/t/carbon.super/console/applications/c3a3d3ce-4166-4e6a-963a-94e1c1c8de5f"
        }
    };

    test("Test the rendering of the application edit page component for a SPA app", async () => {
        render(
            <ApplicationTemplatesProvider>
                <ApplicationEditPage { ...props } />
            </ApplicationTemplatesProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("application-edit-page-layout")).toBeInTheDocument();

            const tabs: string[] = [
                "applications:edit.sections.general.tabName",
                "applications:edit.sections.access.tabName",
                "applications:edit.sections.attributes.tabName",
                "applications:edit.sections.signOnMethod.tabName",
                "extensions:develop.applications.edit.sections.apiAuthorization.title",
                "extensions:develop.applications.edit.sections.roles.heading",
                "applications:edit.sections.provisioning.tabName",
                "applications:edit.sections.advanced.tabName",
                "applications:edit.sections.sharedAccess.tabName",
                "applications:edit.sections.info.tabName"
            ];

            tabs.forEach((tabName: string) => expect(
                within(screen.getByTestId("application-edit-resource-tabs")).getByText(tabName)).toBeInTheDocument());
        });
    });

    test("Test the rendering of the application edit page component for a SSO app", async () => {
        const useGetApplicationTemplateMetadataMock: jest.SpyInstance = jest.spyOn(
            useGetApplicationTemplateMetadata, "default");

        useGetApplicationTemplateMetadataMock.mockImplementation(() => ({
            data: applicationTemplateMetadataMockResponse,
            error: null,
            isLoading: false,
            isValidating: false,
            mutate: jest.fn()
        }));

        useGetApplicationMock.mockImplementation(() => ({
            data: applicationMockResponse,
            error: null,
            isLoading: false,
            isValidating: false,
            mutate: jest.fn()
        }));

        render(
            <ApplicationTemplatesProvider>
                <ApplicationEditPage { ...props } />
            </ApplicationTemplatesProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("application-edit-page-layout")).toBeInTheDocument();

            const tabs: string[] = [
                "Quick Start",
                "applications:edit.sections.general.tabName",
                "Application Roles",
                "Attributes",
                "Salesforce Settings"
            ];

            tabs.forEach((tabName: string) => expect(
                within(screen.getByTestId("application-edit-resource-tabs")).getByText(tabName)).toBeInTheDocument());
        });
    });
});
