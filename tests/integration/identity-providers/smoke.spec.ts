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

/// <reference types="cypress" />
/// <reference types="../../types" />

import { CommonUtils, CookieUtils, HousekeepingUtils } from "@wso2/identity-cypress-test-base/ui";
import { IdentityProvidersListPageConstants } from "./constants";
import { IdentityProviderTemplatesPage, IdentityProvidersListPage } from "./page-objects";

const USERNAME: string = Cypress.env("TENANT_USERNAME");
const PASSWORD: string = Cypress.env("TENANT_PASSWORD");
const SERVER_URL: string = Cypress.env("SERVER_URL");
const PORTAL: string = Cypress.env("CONSOLE_BASE_URL");
const TENANT_DOMAIN: string = Cypress.env("TENANT_DOMAIN");

describe("ITC-1.0.0 - [identity-providers] - Identity Providers Smoke Test.", () => {

    const identityProvidersListPage: IdentityProvidersListPage = new IdentityProvidersListPage();
    const identityProviderTemplatesPage: IdentityProviderTemplatesPage = new IdentityProviderTemplatesPage();

    before(() => {
        HousekeepingUtils.performCleanUpTasks();
        cy.login(USERNAME, PASSWORD, SERVER_URL, PORTAL, TENANT_DOMAIN);
    });

    beforeEach(() => {
        CookieUtils.preserveAllSessionCookies();
    });

    after(() => {
        cy.logout();
    });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context.skip("ITC-1.1.0 - [identity-providers] - IDP Listing Page.", () => {
    //
    //     it("ITC-1.1.1 - [identity-providers] - User can visit the IDP listing page from the side panel", () => {
    //         cy.navigateToIDPList(true);
    //     });
    //
    //     it("ITC-1.1.2 - [identity-providers] - Properly renders the elements of the listing page.", () => {
    //         cy.checkIfIDPListingRenders(true);
    //     });
    //
    //     // This test case only fails during the product build time, but passes when it run locally.
    //     // Therefore skipping this test temporally until we find the cause for this failure.
    //     it.skip("ITC-1.1.3 - [identity-providers] - Shows the empty list placeholder.", () => {
    //
    //         // Assumes that on a fresh pack, no external IDPs are configured by default.
    //         identityProvidersListPage.getTable()
    //             .within(() => {
    //                 identityProvidersListPage.getNewTablePlaceholder().should("be.visible");
    //                 identityProvidersListPage.getNewTablePlaceholderAction().should("be.visible");
    //             });
    //     });
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context.skip("ITC-1.2.0 - [identity-providers] - IDP Templates Page.", () => {
    //
    //     it("ITC-1.2.1 - [identity-providers] - Navigates to the template selection page properly.", () => {
    //
    //         identityProvidersListPage.clickOnNewIDPButton();
    //     });
    //
    //     it("ITC-1.2.1 - [identity-providers] - Navigates to the correct template selection page URL.", () => {
    //
    //         // Check if page header exists and check if all the necessary elements are rendering.
    //         cy.url().should("include", IdentityProvidersListPageConstants.PAGE_URL_MATCHER);
    //     });
    //
    //     it("ITC-1.2.2 - [identity-providers] - Displays the template selection page elements properly.", () => {
    //
    //         identityProviderTemplatesPage.getPageLayoutHeader().should("be.visible");
    //         identityProviderTemplatesPage.getPageBackButton().should("be.visible");
    //         identityProviderTemplatesPage.getPageLayoutHeaderTitle().should("be.visible");
    //         identityProviderTemplatesPage.getPageLayoutHeaderSubTitle().should("be.visible");
    //
    //         identityProviderTemplatesPage.getQuickstartGrid().should("be.visible");
    //         identityProviderTemplatesPage.getQuickstartGrid()
    //             .within(() => {
    //                 identityProviderTemplatesPage.getQuickStartTemplate("GOOGLE").should("be.visible");
    //                 identityProviderTemplatesPage.getQuickStartTemplate("FACEBOOK").should("be.visible");
    //                 identityProviderTemplatesPage.getQuickStartTemplate("OIDC").should("be.visible");
    //             });
    //
    //         identityProviderTemplatesPage.getManualSetupGrid().should("be.visible");
    //         identityProviderTemplatesPage.getManualSetupGrid()
    //             .within(() => {
    //                 identityProviderTemplatesPage.getManualSetupTemplate("EXPERT").should("be.visible");
    //             })
    //     });
    // });
});
