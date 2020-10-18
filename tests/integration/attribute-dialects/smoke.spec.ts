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

import { CookieUtils, HousekeepingUtils } from "@wso2/identity-cypress-test-base/utils";
import { AttributeDialectsListPageConstants } from "./constants";
import { AttributeDialectsListPage } from "./page-objects";

const USERNAME: string = Cypress.env("TENANT_USERNAME");
const PASSWORD: string = Cypress.env("TENANT_PASSWORD");
const SERVER_URL: string = Cypress.env("SERVER_URL");
const PORTAL: string = Cypress.env("CONSOLE_BASE_URL");
const TENANT_DOMAIN: string = Cypress.env("TENANT_DOMAIN");

describe("ITC-1.0.0 - [attribute dialects] - Attribute Dialect Management Smoke Test.", () => {

    const attributeDialectsListPage: AttributeDialectsListPage = new AttributeDialectsListPage();

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

    context("ITC-1.1.0 - [attribute dialects] - Claim Listing Page.", () => {

        it("ITC-1.1.1 - [attribute dialects] - User can visit the IDP listing page from the side panel", () => {
            cy.navigateToAttributeDialectsList(true);
        });

        it("ITC-1.1.2 - [attribute dialects] - Properly renders the elements of the listing page.", () => {
            cy.checkIfAttributeDialectsListingRenders(false);
        });
    });

    context("ITC-1.2.0 - [attribute dialects] - IDP Templates Page.", () => {

        it("ITC-1.2.1 - [attribute dialects] - Navigates to the template selection page properly.", () => {

            attributeDialectsListPage.clickOnNewClaimButton();
        });

        it("ITC-1.2.1 - [attribute dialects] - Navigates to the correct template selection page URL.", () => {

            // Check if page header exists and check if all the necessary elements are rendering.
            cy.url().should("include", AttributeDialectsListPageConstants.PAGE_URL_MATCHER);
        });
    });
});
