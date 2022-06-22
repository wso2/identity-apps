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
import { ApplicationTemplatesPageConstants, ApplicationsListPageConstants } from "./constants";
import { ApplicationTemplatesPage, ApplicationsListPage } from "./page-objects";

const USERNAME: string = Cypress.env("TENANT_USERNAME");
const PASSWORD: string = Cypress.env("TENANT_PASSWORD");
const SERVER_URL: string = Cypress.env("SERVER_URL");
const PORTAL: string = Cypress.env("CONSOLE_BASE_URL");
const TENANT_DOMAIN: string = Cypress.env("TENANT_DOMAIN");

describe("ITC-1.0.0 - [applications] - Applications Smoke Test.", () => {

    const applicationsListPage: ApplicationsListPage = new ApplicationsListPage();
    const applicationTemplatesPage: ApplicationTemplatesPage = new ApplicationTemplatesPage();

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

    context("ITC-1.1.0 - [applications] - Applications Listing Page.", () => {

        it("ITC-1.1.1 - [applications] - User can visit applications listing page from the side panel", () => {
            cy.navigateToApplicationsList(true, false);
        });

        it("ITC-1.1.2 - [applications] - Properly renders the elements of the listing page.", () => {
            cy.checkIfApplicationsListingRenders();
        });

        it("ITC-1.1.3 - [applications] - There exists at-least one application on the list.", () => {

            // Check if at-least one row is present.
            // Assumes that at-least one application is always present in a new pack.
            applicationsListPage.getTable()
                .find(CommonUtils.resolveDataTestId(ApplicationsListPageConstants.TABLE_ROW_DATA_ATTR))
                .should("exist");
        });

        it("ITC-1.1.4 - [applications] - Table rows renders properly.", () => {

            // Check if the table row heading & image is displayed properly.
            applicationsListPage.getTableBody()
                .children()
                .each((row) => {
                    // Check if image exist.
                    cy.wrap(row)
                        .find(CommonUtils.resolveDataTestId(
                            ApplicationsListPageConstants.TABLE_ROW_IMAGE_DATA_ATTR))
                        .should("exist");

                    // Check if heading exist.
                    cy.wrap(row)
                        .find(CommonUtils.resolveDataTestId(
                            ApplicationsListPageConstants.TABLE_ROW_HEADING_DATA_ATTR))
                        .should("exist");

                    // Check if edit button exist.
                    cy.wrap(row)
                        .find(CommonUtils.resolveDataTestId(
                            ApplicationsListPageConstants.TABLE_ROW_EDIT_BUTTON_DATA_ATTR))
                        .should("exist");
                });
        });
    });

    context("ITC-1.2.0 - [applications] - Application Templates Page.", () => {

        it("ITC-1.2.1 - [applications] - Navigates to the template selection page properly.", () => {

            applicationsListPage.clickOnNewApplicationButton();

            cy.wait(2000);

            // Check if page header exists and check if all the necessary elements are rendering.
            cy.url().should("include", ApplicationTemplatesPageConstants.PAGE_URL_MATCHER);
        });

        // This test case only fails during the product build time, but passes when it run locally.
        // Therefore skipping this test temporally until we find the cause for this failure.
        it.skip("ITC-1.2.2 - [applications] - Displays the template selection page elements properly.", () => {

            applicationTemplatesPage.getPageLayoutHeader().should("be.visible");
            applicationTemplatesPage.getPageBackButton().should("be.visible");
            applicationTemplatesPage.getPageLayoutHeaderTitle().should("be.visible");
            applicationTemplatesPage.getPageLayoutHeaderSubTitle().should("be.visible");
            
            applicationTemplatesPage.getSearchInput().should("be.visible");
            applicationTemplatesPage.getSortDropdown().should("be.visible");
            
            applicationTemplatesPage.getQuickstartGrid().should("be.visible");
            applicationTemplatesPage.getQuickstartGrid()
                .within(() => {
                    applicationTemplatesPage.getQuickStartTemplate("WEB_APP").should("be.visible");
                    applicationTemplatesPage.getQuickStartTemplate("SPA").should("be.visible");
                    applicationTemplatesPage.getQuickStartTemplate("DESKTOP_APP").should("be.visible");
                    applicationTemplatesPage.getQuickStartTemplate("MOBILE_APP").should("be.visible");
                });
        });
    });
});

/**
 * Return false here prevents Cypress from failing the test
 * expect(err.message).to.include('Ignoring error for now');
 */
Cypress.on("uncaught:exception", (err, runnable) => {

    cy.log("Cypress detected uncaught exception", err);
    return false;
});
