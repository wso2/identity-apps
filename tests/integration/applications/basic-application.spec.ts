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

import { CookieUtils, HousekeepingUtils } from "@wso2/identity-cypress-test-base/ui";
import { v4 as uuidv4 } from "uuid";
import { ApplicationEditPageConstants, ApplicationsListPageConstants } from "./constants";
import { ApplicationEditPage, ApplicationTemplatesPage, ApplicationsListPage } from "./page-objects";

const USERNAME: string = Cypress.env("TENANT_USERNAME");
const PASSWORD: string = Cypress.env("TENANT_PASSWORD");
const SERVER_URL: string = Cypress.env("SERVER_URL");
const PORTAL: string = Cypress.env("CONSOLE_BASE_URL");
const TENANT_DOMAIN: string = Cypress.env("TENANT_DOMAIN");

describe("ITC-2.0.0 - [applications] - Basic Applications Integration.", () => {

    const applicationsListPage: ApplicationsListPage = new ApplicationsListPage();
    const applicationTemplatesPage: ApplicationTemplatesPage = new ApplicationTemplatesPage();
    const applicationEditPage: ApplicationEditPage = new ApplicationEditPage();

    const appName: string = "App - " + uuidv4();
    const redirectURL: string = "https://localhost:9000/sample-app/login";
    const accessURL: string = "https://localhost:9000/sample-app";
    const appImage: string = "https://seeklogo.com/images/O/openid-logo-8AD782234D-seeklogo.com.png";
    const jwksURL: string = "https://localhost:9443/oauth2/jwks";

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

    context("ITC-2.1.0 - [applications] - Create an Application using the wizard.", () => {

        it("ITC-2.1.1 - [applications] - Register the Application.", () => {
            cy.navigateToApplicationsList(true, false);
            applicationsListPage.clickOnNewApplicationButton();
            applicationTemplatesPage.getQuickStartTemplate("WEB_APP").click();
            cy.wait(1000);
            
            applicationTemplatesPage.getMinimalCreationWizard().should("be.visible");
            applicationTemplatesPage.getMinimalCreationWizardAppNameInput().should("be.visible");
            applicationTemplatesPage.getMinimalCreationWizardOIDCCard().should("be.visible");
            applicationTemplatesPage.getMinimalCreationWizardSAMLCard().should("be.visible");
            applicationTemplatesPage.getMinimalCreationWizardRedirectURLInput().should("be.visible");

            applicationTemplatesPage.getMinimalCreationWizardAppNameInput().type(appName);
            applicationTemplatesPage.getMinimalCreationWizardOIDCCard().click();
            applicationTemplatesPage.getMinimalCreationWizardRedirectURLInput().type(redirectURL);
            applicationTemplatesPage.getMinimalCreationWizardRedirectURLAddButton().click();
            applicationTemplatesPage.clickOnMinimalCreationWizardSubmitButton();
        });

        it("ITC-2.1.2 - [applications] - Correctly navigates to the edit page.", () => {
            cy.url().should("include", ApplicationEditPageConstants.PAGE_URL_MATCHER);
        });
    });

    context("ITC-2.2.0 - [applications] - Application edit page works as expected.", () => {

        it("ITC-2.2.1 - [applications] - Correctly renders the required elements of the edit page.", () => {
            applicationEditPage.getPageLayoutHeader().should("be.visible");
            applicationEditPage.getPageLayoutHeaderTitle().should("be.visible");
            applicationEditPage.getPageLayoutHeaderSubTitle().should("be.visible");
            applicationEditPage.getPageBackButton().should("be.visible");
            applicationEditPage.getTabs().should("be.visible");
        });

        it("ITC-2.2.2 - [applications] - Can navigate to all the tabs.", () => {
            applicationEditPage.selectTab("GENERAL");
            applicationEditPage.selectTab("ACCESS");
            applicationEditPage.selectTab("ATTRIBUTES");
            applicationEditPage.selectTab("SIGN_ON");
            applicationEditPage.selectTab("PROVISIONING");
            applicationEditPage.selectTab("ADVANCED");
        });
    });

    context("ITC-2.3.0 - [applications] - Application General Settings.", () => {
        
        before(() => {
            applicationEditPage.selectTab("GENERAL");
        });

        it("ITC-2.3.1 - [applications] - Can edit basic settings.", () => {
            applicationEditPage.getAppNameInput().clear().type("Edited " + appName);
            applicationEditPage.getAppDescriptionInput().type("Edited Description");
            applicationEditPage.getAppImageInput().type(appImage);
            applicationEditPage.getAppDiscoverableCheckbox().click();
            applicationEditPage.getAppAccessURLInput().type(accessURL);
            applicationEditPage.getAppCertJWKSURLInput().type(jwksURL);
            applicationEditPage.clickOnGeneralSettingsFormSubmitButton();
        });

        // This test case only fails during the product build time, but passes when it run locally.
        // Therefore skipping this test temporally until we find the cause for this failure.
        it.skip("ITC-2.3.2 - [applications] - Should not show certificate preview when an invalid PEM is entered.",
            () => {
            applicationEditPage.getCustomCertRadio().click({ force: true, multiple: true });
            cy.fixture(ApplicationEditPageConstants.SAMPLE_INVALID_PEM_FILE_PATH)
                .then((value: string) => {
                    applicationEditPage.getPEMCertInput()
                        .type(value, { parseSpecialCharSequences: false });
                });
            applicationEditPage.getPEMCertPreviewButton().click();
            applicationEditPage.getPEMCertPreviewModal().should("not.be.visible");
        });

        // This test case only fails during the product build time, but passes when it run locally.
        // Therefore skipping this test temporally until we find the cause for this failure.
        it.skip("ITC-2.3.3 - [applications] - Can provide a valid certificate file and preview it.", () => {
            applicationEditPage.getCustomCertRadio().click({ force: true, multiple: true });
            cy.fixture(ApplicationEditPageConstants.SAMPLE_VALID_PEM_FILE_PATH)
                .then((value: string) => {
                    applicationEditPage.getPEMCertInput()
                        .type(value, { parseSpecialCharSequences: false });
                });
            applicationEditPage.getPEMCertPreviewButton().click();
            applicationEditPage.getPEMCertPreviewModal().should("be.visible");
            applicationEditPage.getPEMCertPreviewModalDimmer().click({ force: true });
        });
    });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore skipping this test temporally until we find the cause for this failure.
    context.skip("ITC-2.4.0 - [applications] - Application Access Settings.", () => {

        before(() => {
            applicationEditPage.selectTab("ACCESS");
        });

        it("ITC-2.4.1 - [applications] - Content renders properly.", () => {
            applicationEditPage.getProtocolAccordion().should("be.visible");
            applicationEditPage.getProtocolAddButton().should("be.visible");

            applicationEditPage.getProtocolAddButton().click();
            cy.wait(1000);
            applicationEditPage.getProtocolAddWizard().should("be.visible");
            applicationEditPage.getProtocolAddWizardCancelButton().click();
            
            // Since we created an OIDC webapp in the previous test case, OIDC access config should be visible.
            applicationEditPage.getProtocolAccordionOIDCItem().should("be.visible");
            
            // Can open an close accordion item by clicking on it.
            applicationEditPage.getProtocolAccordionOIDCItem().click();
            cy.wait(1000);
            applicationEditPage.getProtocolAccordionOIDCItem().click();

            // Can open an close accordion item by clicking on the chevron.
            applicationEditPage.getProtocolAccordionOIDCItemChevron().click();
            cy.wait(1000);
            applicationEditPage.getProtocolAccordionOIDCItemChevron().click();
        });
    });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore skipping this test temporally until we find the cause for this failure.
    context.skip("ITC-2.5.0 - [applications] - Application Attributes Configurations.", () => {

        before(() => {
            applicationEditPage.selectTab("ATTRIBUTES");
        });

        it("ITC-2.5.1 - [applications] - Content renders properly.", () => {
            applicationEditPage.getAttributeSelectionList().should("be.visible");
            applicationEditPage.getSubjectAttributeDropdown().should("be.visible");
            applicationEditPage.getIncludeUserstoreCheckbox().should("be.visible");
            applicationEditPage.getIncludeTenantDomainCheckbox().should("be.visible");
            applicationEditPage.getUseMappedLocalSubjectCheckbox().should("be.visible");
            applicationEditPage.getRoleAttributeDropdown().should("be.visible");
        });
    });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore skipping this test temporally until we find the cause for this failure.
    context.skip("ITC-2.6.0 - [applications] - Delete Application using Danger Zone.", () => {

        before(() => {
            applicationEditPage.selectTab("GENERAL");
        });

        // This test case only fails during the product build time, but passes when it run locally.
        // Therefore skipping this test temporally until we find the cause for this failure.
        it.skip("ITC-2.6.1 - [applications] - Delete button is disabled when the assertion input is empty.",
            () => {
            applicationEditPage.getDangerZoneDeleteButton().click();
            applicationEditPage.getDeleteConfirmButton().should("be.disabled");

            cy.wait(3000);

            applicationEditPage.getDeleteConfirmModalCloseButton().click();
        });

        it("ITC-2.6.2 - [applications] - Delete button is disabled when a wrong assertion is entered.", () => {
            applicationEditPage.getDangerZoneDeleteButton().click();
            applicationEditPage.getDeleteAssertionInput().type("Wrong Assertion");
            applicationEditPage.getDeleteConfirmButton().should("be.disabled");

            cy.wait(3000);

            applicationEditPage.getDeleteConfirmModalCloseButton().click();
        });

        // This test case only fails during the product build time, but passes when it run locally.
        // Therefore skipping this test temporally until we find the cause for this failure.
        it.skip("ITC-2.6.3 - [applications] - Can delete the application using the correct assertion is entered.",
            () => {
            applicationEditPage.getDangerZoneDeleteButton().click();
            applicationEditPage.getDeleteAssertion()
                .then((element) => {
                    applicationEditPage.getDeleteAssertionInput().type(element.text());
                    applicationEditPage.getDeleteConfirmButton().click();
                });

            cy.wait(3000);

            // Checks if directed to the listing page after successful deletion.
            cy.url().should("include", ApplicationsListPageConstants.PAGE_URL_MATCHER);
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
