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

import { CookieUtils, HousekeepingUtils } from "@wso2is/cypress-base/utils";
import { ApplicationEditPageConstants } from "./constants";
import { ApplicationEditPage, ApplicationsListPage, ApplicationTemplatesPage } from "./page-objects";
import { v4 as uuidv4 } from "uuid";

const USERNAME: string = Cypress.env("TENANT_USERNAME");
const PASSWORD: string = Cypress.env("TENANT_PASSWORD");
const SERVER_URL: string = Cypress.env("SERVER_URL");
const PORTAL: string = Cypress.env("CONSOLE_BASE_URL");
const TENANT_DOMAIN: string = Cypress.env("TENANT_DOMAIN");

describe("ITC-2.0.0 - [applications] - OIDC Web Applications Integration.", () => {

    const applicationsListPage: ApplicationsListPage = new ApplicationsListPage();
    const applicationTemplatesPage: ApplicationTemplatesPage = new ApplicationTemplatesPage();
    const applicationEditPage: ApplicationEditPage = new ApplicationEditPage();

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

    context("ITC-2.0.0 - [applications] - Create an OIDC Web Application using the wizard.", () => {

        const oidcAppName: string = "OIDC - " + uuidv4();
        const redirectURL: string = "https://localhost:9000/oidc-sample/login";
        const accessURL: string = "https://localhost:9000/oidc-sample";
        const appImage: string = "https://i.pinimg.com/originals/1e/a8/90/1ea890593919e1784cc00f394abe561e.jpg";

        it("ITC-2.1.1 - [applications] - Register the Application.", () => {
            cy.navigateToApplicationsList(true, false);
            applicationsListPage.clickOnNewApplicationButton();
            applicationTemplatesPage.getQuickStartTemplate("WEB_APP").click();
            
            applicationTemplatesPage.getMinimalCreationWizard().should("be.visible");
            applicationTemplatesPage.getMinimalCreationWizardAppNameInput().should("be.visible");
            applicationTemplatesPage.getMinimalCreationWizardOIDCCard().should("be.visible");
            applicationTemplatesPage.getMinimalCreationWizardSAMLCard().should("be.visible");
            applicationTemplatesPage.getMinimalCreationWizardRedirectURLInput().should("be.visible");

            applicationTemplatesPage.getMinimalCreationWizardAppNameInput().type(oidcAppName);
            applicationTemplatesPage.getMinimalCreationWizardOIDCCard().click();
            applicationTemplatesPage.getMinimalCreationWizardRedirectURLInput().type(redirectURL);
            applicationTemplatesPage.getMinimalCreationWizardRedirectURLAddButton().click();
            applicationTemplatesPage.clickOnMinimalCreationWizardSubmitButton();
        });

        it("ITC-2.1.2 - [applications] - Correctly navigates to the edit page.", () => {
            cy.url().should("include", ApplicationEditPageConstants.PAGE_URL_MATCHER);
        });

        it("ITC-2.1.3 - [applications] - Can edit general settings.", () => {
            applicationEditPage.getAppNameInput().clear().type("Edited " + oidcAppName);
            applicationEditPage.getAppDescriptionInput().type("Edited Description");
            applicationEditPage.getAppImageInput().type(appImage);
            applicationEditPage.getAppDiscoverableCheckbox().click();
            applicationEditPage.getAppAccessURLInput().type(accessURL);
            applicationEditPage.clickOnGeneralSettingsFormSubmitButton();
        });
    });
});
