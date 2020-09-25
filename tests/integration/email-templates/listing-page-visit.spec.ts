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
/// <reference types="../../support" />

import { CookieUtils, HousekeepingUtils } from "@wso2is/cypress-base/utils";
import { Header } from "@wso2is/cypress-base/page-objects";
import { EmailTemplatesListPage } from "./page-objects";
import { CommonUtils } from "@wso2is/cypress-base/utils";
import { EmailTemplatesListPageDomConstants } from "./constants";

const USERNAME = Cypress.env("TENANT_USERNAME");
const PASSWORD = Cypress.env("TENANT_PASSWORD");
const SERVER_URL = Cypress.env("SERVER_URL");
const PORTAL = Cypress.env("CONSOLE_BASE_URL");

describe("ITC-1.0.0-[email-templates]-User can visit the email templates page.", () => {

    before(() => {
        HousekeepingUtils.performCleanUpTasks();
        cy.login(USERNAME, PASSWORD, SERVER_URL, PORTAL);
        CookieUtils.preserveAllSessionCookies();
    });
    
    after(() => {
        // cy.logout();
    });

    it("ITC-1.0.1-[email-templates]-User can visit email templates page from the side panel", () => {
        const header: Header = new Header();
        const emailTemplatesPage: EmailTemplatesListPage = new EmailTemplatesListPage();

        header.clickOnManagePortalSwitch();
        emailTemplatesPage.clickOnSidePanelItem();
    });

    it("ITC-1.0.2-[email-templates]-Properly renders the elements of the listing page", () => {
        const emailTemplatesPage: EmailTemplatesListPage = new EmailTemplatesListPage();

        // Check if page header exists and check if all the necessary elements are rendering.
        emailTemplatesPage.getEmailTemplatesPageLayoutHeader().should("be.visible");
        emailTemplatesPage.getEmailTemplatesPageLayoutHeaderTitle().should("be.visible");
        emailTemplatesPage.getEmailTemplatesPageLayoutHeaderSubTitle().should("be.visible");

        // Check if page header has an action.
        emailTemplatesPage.getEmailTemplatesPageLayoutHeaderAction().should("be.visible");
        emailTemplatesPage.getEmailTemplatesPageLayoutHeader()
            .find("button")
            .should("exist");

        // Check if the email templates page exists.
        emailTemplatesPage.getEmailTemplatesTable().should("be.visible");
    });

    it("ITC-1.0.3-[email-templates]-There exists at-least one email template on the list", () => {
        const emailTemplatesPage: EmailTemplatesListPage = new EmailTemplatesListPage();

        // Check if at-least one row is present. Assumes that the email templates are always present in a new pack.
        emailTemplatesPage.getEmailTemplatesTable()
            .find(CommonUtils.resolveDataTestId(EmailTemplatesListPageDomConstants.TABLE_ROW_DATA_ATTR))
            .should("exist");
    });

    it("ITC-1.0.4-[email-templates]-Table rows renders properly", () => {
        const emailTemplatesPage: EmailTemplatesListPage = new EmailTemplatesListPage();
        
        // Check if the table row heading & image is displayed properly.
        emailTemplatesPage.getEmailTemplatesTableBody()
            .children()
            .each((row) => {
                // Check if image exist.
                cy.wrap(row)
                    .find(CommonUtils.resolveDataTestId(
                        EmailTemplatesListPageDomConstants.TABLE_ROW_IMAGE_DATA_ATTR))
                    .should("exist");

                // Check if heading exist.
                cy.wrap(row)
                    .find(CommonUtils.resolveDataTestId(
                        EmailTemplatesListPageDomConstants.TABLE_ROW_HEADING_DATA_ATTR))
                    .should("exist");

                // Check if edit button exist.
                cy.wrap(row)
                    .find(CommonUtils.resolveDataTestId(
                        EmailTemplatesListPageDomConstants.TABLE_ROW_EDIT_BUTTON_DATA_ATTR))
                    .should("exist");

                // Check if delete button exist.
                cy.wrap(row)
                    .find(CommonUtils.resolveDataTestId(
                        EmailTemplatesListPageDomConstants.TABLE_ROW_DELETE_BUTTON_DATA_ATTR))
                    .should("exist");
            });
    });
});
