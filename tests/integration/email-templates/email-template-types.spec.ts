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
import { EmailTemplatesListPage, EmailTemplateTypesListPage } from "./page-objects";
import { CommonUtils } from "@wso2is/cypress-base/utils";
import { EmailTemplateTypesListPageConstants } from "./constants";
import { v4 as uuidv4 } from "uuid";

const USERNAME: string = Cypress.env("TENANT_USERNAME");
const PASSWORD: string = Cypress.env("TENANT_PASSWORD");
const SERVER_URL: string = Cypress.env("SERVER_URL");
const PORTAL: string = Cypress.env("CONSOLE_BASE_URL");
const TENANT_DOMAIN: string = Cypress.env("TENANT_DOMAIN");

describe("ITC-1.0.0-[email-templates] - Email Template Types Integration.", () => {

    const header: Header = new Header();
    const emailTemplateTypesListPage: EmailTemplateTypesListPage = new EmailTemplateTypesListPage();
    const emailTemplatesListPage: EmailTemplatesListPage = new EmailTemplatesListPage();

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

    context("ITC-1.1.0-[email-templates] - Email Template Types Listing Page.", () => {

        it("ITC-1.1.1-[email-templates]-User can visit email templates page from the side panel", () => {
            header.clickOnManagePortalSwitch();
            emailTemplateTypesListPage.clickOnSidePanelItem();
        });

        it("ITC-1.1.2-[email-templates]- Properly renders the elements of the listing page", () => {

            // Check if page header exists and check if all the necessary elements are rendering.
            emailTemplateTypesListPage.getPageLayoutHeader().should("be.visible");
            emailTemplateTypesListPage.getPageLayoutHeaderTitle().should("be.visible");
            emailTemplateTypesListPage.getPageLayoutHeaderSubTitle().should("be.visible");

            // Check if page header has an action.
            emailTemplateTypesListPage.getPageLayoutHeaderAction().should("be.visible");
            emailTemplateTypesListPage.getPageLayoutHeader()
                .find("button")
                .should("exist");

            // Check if the email templates page exists.
            emailTemplateTypesListPage.getTable().should("be.visible");
        });

        it("ITC-1.1.3-[email-templates]-There exists at-least one email template on the list", () => {

            // Check if at-least one row is present. Assumes that the email templates are always present in a new pack.
            emailTemplateTypesListPage.getTable()
                .find(CommonUtils.resolveDataTestId(EmailTemplateTypesListPageConstants.TABLE_ROW_DATA_ATTR))
                .should("exist");
        });

        it("ITC-1.1.4-[email-templates]-Table rows renders properly", () => {

            // Check if the table row heading & image is displayed properly.
            emailTemplateTypesListPage.getTableBody()
                .children()
                .each((row) => {
                    // Check if image exist.
                    cy.wrap(row)
                        .find(CommonUtils.resolveDataTestId(
                            EmailTemplateTypesListPageConstants.TABLE_ROW_IMAGE_DATA_ATTR))
                        .should("exist");

                    // Check if heading exist.
                    cy.wrap(row)
                        .find(CommonUtils.resolveDataTestId(
                            EmailTemplateTypesListPageConstants.TABLE_ROW_HEADING_DATA_ATTR))
                        .should("exist");

                    // Check if edit button exist.
                    cy.wrap(row)
                        .find(CommonUtils.resolveDataTestId(
                            EmailTemplateTypesListPageConstants.TABLE_ROW_EDIT_BUTTON_DATA_ATTR))
                        .should("exist");

                    // Check if delete button exist.
                    cy.wrap(row)
                        .find(CommonUtils.resolveDataTestId(
                            EmailTemplateTypesListPageConstants.TABLE_ROW_DELETE_BUTTON_DATA_ATTR))
                        .should("exist");
                });
        });
    });

    context("ITC-1.2.0-[email-templates] - Add an Email Template Type.", () => {

        const templateTypeName: string = "Sample " + uuidv4();

        it("ITC-1.2.1-[email-templates] - Add wizard is visible", () => {

            emailTemplateTypesListPage.clickOnNewTemplateTypeButton();

            cy.wait(2000);

            emailTemplateTypesListPage.getAddTemplateTypeWizard().should("be.visible");
        });

        it("ITC-1.2.2-[email-templates] - Can add a new template type using the wizard.", () => {

            emailTemplateTypesListPage.getTemplateTypeNameInputInWizard().should("exist");

            emailTemplateTypesListPage.getTemplateTypeNameInputInWizard()
                .find("input")
                .type(templateTypeName);

            emailTemplateTypesListPage.getTemplateTypeCreateButtonInWizard().click();
        });

        it("ITC-1.2.3-[email-templates] - Properly navigates to the  newly created type's listing page", () => {

            emailTemplatesListPage.getPageLayoutHeaderTitle().should("contain", templateTypeName);
        });

        it("ITC-1.2.4-[email-templates] - Shows the new list placeholder.", () => {

            emailTemplatesListPage.getNewTablePlaceholder().should("be.visible");
            emailTemplatesListPage.getNewTablePlaceholderAction().should("be.visible");
        });
    });
});
