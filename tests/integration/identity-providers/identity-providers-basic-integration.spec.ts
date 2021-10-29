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
import { v4 as uuidv4 } from "uuid";
import { IdentityProviderEditPageConstants, IdentityProvidersListPageConstants } from "./constants";
import { IdentityProviderEditPage, IdentityProviderTemplatesPage, IdentityProvidersListPage } from "./page-objects";

const USERNAME: string = Cypress.env("TENANT_USERNAME");
const PASSWORD: string = Cypress.env("TENANT_PASSWORD");
const SERVER_URL: string = Cypress.env("SERVER_URL");
const PORTAL: string = Cypress.env("CONSOLE_BASE_URL");
const TENANT_DOMAIN: string = Cypress.env("TENANT_DOMAIN");

describe("ITC-2.0.0 - [identity-providers] - Identity Providers Listing Integration Tests.", () => {

    const identityProvidersListPage: IdentityProvidersListPage = new IdentityProvidersListPage();
    const identityProviderTemplatesPage: IdentityProviderTemplatesPage = new IdentityProviderTemplatesPage();
    const identityProviderEditPage: IdentityProviderEditPage = new IdentityProviderEditPage();

    const idpName: string = "Expert IDP - " + uuidv4();
    const idpDescription: string = "Automation IDP created with Cypress.";
    const idpImage: string = "https://seeklogo.com/images/G/google-2015-logo-65BBD07B01-seeklogo.com.png";

    const JWKS_ENDPOINT: string = "https://localhost:9443/oauth2/jwks";

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
    // context.skip("ITC-2.1.0 - [identity-providers] - IDP Listing.", () => {
    //
    //     it("ITC-2.1.1 - [identity-providers] - User can visit the IDP listing page from the side panel", () => {
    //         cy.navigateToIDPList(true);
    //     });
    //
    //     it("ITC-2.1.2 - [identity-providers] - Properly renders the elements of the listing page.", () => {
    //         cy.checkIfIDPListingRenders(true);
    //     });
    //
    //     it("ITC-2.1.3 - [identity-providers] - Check if the new list placeholder is shown in fresh tables.", () => {
    //
    //         identityProvidersListPage.getTable()
    //             .within(($table: Element & JQuery) => {
    //                 // If the table is fresh, new list placeholder should be visible and the
    //                 // action on the page header should npt be visble.
    //                 if ($table.find(CommonUtils.resolveDataTestId(
    //                     IdentityProvidersListPageConstants.NEW_LIST_PLACEHOLDER)).length > 0) {
    //
    //                     identityProvidersListPage.getNewTablePlaceholder().should("be.visible");
    //                     identityProvidersListPage.getNewTablePlaceholderAction().should("be.visible");
    //                     identityProvidersListPage.getPageLayoutHeaderAction().should("not.be.visible");
    //                 } else {
    //                     cy.log("IDP list is not a fresh list. It already contains resources.");
    //                 }
    //             });
    //     });
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context("ITC-2.2.0 - [identity-providers] - Create an IDP using the wizard.", () => {
    //
    //     it("ITC-2.2.1 - [identity-providers] - Register the IDP.", () => {
    //
    //         identityProvidersListPage.clickOnNewIDPButton();
    //
    //         identityProviderTemplatesPage.getManualSetupTemplate("EXPERT").click();
    //
    //         cy.wait(2000);
    //
    //         identityProviderTemplatesPage.getCreationWizard().should("be.visible");
    //
    //         identityProviderTemplatesPage.getCreationWizardIDPNameInput().type(idpName);
    //         identityProviderTemplatesPage.getCreationWizardIDPDescriptionInput().type(idpDescription);
    //         identityProviderTemplatesPage.getCreationWizardIDPImageInput().type(idpImage);
    //
    //         cy.wait(1000);
    //
    //         identityProviderTemplatesPage.clickOnCreationWizardFinishButton();
    //     });
    //
    //     it("ITC-2.2.2 - [identity-providers] - Correctly navigates to the edit page.", () => {
    //         cy.url().should("include", IdentityProviderEditPageConstants.PAGE_URL_MATCHER);
    //     });
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context.skip("ITC-2.3.0 - [identity-providers] - IDP edit page works as expected.", () => {
    //
    //     it("ITC-2.3.1 - [identity-providers] - Correctly renders the required elements of the edit page.", () => {
    //         identityProviderEditPage.getPageLayoutHeader().should("be.visible");
    //         identityProviderEditPage.getPageLayoutHeaderTitle().should("be.visible");
    //         identityProviderEditPage.getPageLayoutHeaderSubTitle().should("be.visible");
    //         identityProviderEditPage.getPageBackButton().should("be.visible");
    //         identityProviderEditPage.getTabs().should("be.visible");
    //     });
    //
    //     it("ITC-2.3.2 - [identity-providers] - Displays info about the newly created IDP.", () => {
    //         identityProviderEditPage.getPageLayoutHeaderTitle().should("contain", idpName);
    //         identityProviderEditPage.getPageLayoutHeaderSubTitle().should("contain", idpDescription);
    //         identityProviderEditPage.getPageLayoutImage().should("have.attr", "src", idpImage);
    //     });
    //
    //     it("ITC-2.3.3 - [identity-providers] - Can navigate to all the tabs.", () => {
    //         identityProviderEditPage.selectTab("GENERAL");
    //         identityProviderEditPage.selectTab("ATTRIBUTES");
    //         identityProviderEditPage.selectTab("AUTHENTICATION");
    //         identityProviderEditPage.selectTab("OUTBOUND_PROVISIONING");
    //         identityProviderEditPage.selectTab("JIT_PROVISIONING");
    //         identityProviderEditPage.selectTab("ADVANCED");
    //     });
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context("ITC-2.4.0 - [identity-providers] - IDP General Settings.", () => {
    //
    //     before(() => {
    //         identityProviderEditPage.selectTab("GENERAL");
    //     });
    //
    //     // This test case only fails during the product build time, but passes when it run locally.
    //     // Therefore skipping this test temporally until we find the cause for this failure.
    //     it.skip("ITC-2.4.1 - [identity-providers] - Can edit basic settings.", () => {
    //
    //         idpName = "Edited " + idpName;
    //         idpDescription = "Edited " + idpDescription;
    //         idpImage = "https://seeklogo.com/images/G/google-play-logo-C0F8C12322-seeklogo.com.png";
    //
    //         identityProviderEditPage.getIDPNameInput().clear().type(idpName);
    //         identityProviderEditPage.getIDPDescriptionInput().clear().type(idpDescription);
    //         identityProviderEditPage.getIDPImageInput().clear().type(idpImage);
    //         identityProviderEditPage.clickOnGeneralSettingsFormSubmitButton();
    //
    //         cy.wait(3000);
    //
    //         identityProviderEditPage.getPageLayoutHeaderTitle().should("contain", idpName);
    //         identityProviderEditPage.getPageLayoutHeaderSubTitle().should("contain", idpDescription);
    //         identityProviderEditPage.getPageLayoutImage().should("have.attr", "src", idpImage);
    //     });
    //
    //     // This test case only fails during the product build time, but passes when it run locally.
    //     // Therefore skipping this test temporally until we find the cause for this failure.
    //     it.skip("ITC-2.4.2 - [identity-providers] - Can add a JWKS endpoint.", () => {
    //         identityProviderEditPage.getJWKSCertRadio().click({ force: true });
    //         identityProviderEditPage.getIDPCertJWKSURLInput().type(JWKS_ENDPOINT);
    //     });
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context("ITC-2.5.0 - [identity-providers] - IDP Attributes Settings.", () => {
    //
    //     before(() => {
    //         identityProviderEditPage.selectTab("ATTRIBUTES");
    //     });
    //
    //     // This test case only fails during the product build time, but passes when it run locally.
    //     // Therefore skipping this test temporally until we find the cause for this failure.
    //     it.skip("ITC-2.5.1 - [identity-providers] - Can add claim mappings.", () => {
    //         identityProviderEditPage.clickOnUpdateClaimAttributeMapping();
    //
    //         cy.wait(2000);
    //
    //         identityProviderEditPage.getClaimAttributeSelectionWizard().should("be.visible");
    //         identityProviderEditPage.getClaimAttributeSelectionWizardUnselectedList()
    //             .within(() => {
    //                 cy.get("tbody")
    //                     .within(() => {
    //                         cy.get("tr").eq(0)
    //                             .within(() => {
    //                                 cy.get("input[type=\"checkbox\"]").click({ force: true });
    //                             });
    //                         cy.get("tr").eq(1)
    //                             .within(() => {
    //                                 cy.get("input[type=\"checkbox\"]").click({ force: true });
    //                             })
    //                     });
    //             });
    //         identityProviderEditPage.getClaimAttributeSelectionWizardListAddButton().click();
    //         identityProviderEditPage.getClaimAttributeSelectionWizardListSaveButton().click();
    //     });
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context.skip("ITC-2.6.0 - [identity-providers] - Delete IDP using Danger Zone.", () => {
    //
    //     before(() => {
    //         identityProviderEditPage.selectTab("GENERAL");
    //     });
    //
    //     it("ITC-2.6.1 - [identity-providers] - Delete button is disabled when the assertion input is empty.", () => {
    //         identityProviderEditPage.getDangerZoneDeleteButton().click();
    //         identityProviderEditPage.getDeleteConfirmButton().should("be.disabled");
    //
    //         cy.wait(3000);
    //
    //         identityProviderEditPage.getDeleteConfirmModalCloseButton().click();
    //     });
    //
    //     it("ITC-2.6.2 - [identity-providers] - Delete button is disabled when a wrong assertion is entered.", () => {
    //         identityProviderEditPage.getDangerZoneDeleteButton().click();
    //         identityProviderEditPage.getDeleteAssertionInput().type("Wrong Assertion");
    //         identityProviderEditPage.getDeleteConfirmButton().should("be.disabled");
    //
    //         cy.wait(3000);
    //
    //         identityProviderEditPage.getDeleteConfirmModalCloseButton().click();
    //     });
    //
    //     it("ITC-2.6.3 - [identity-providers] - Can delete the application using the correct assertion is entered.",
    //         () => {
    //
    //         identityProviderEditPage.getDangerZoneDeleteButton().click();
    //         identityProviderEditPage.getDeleteAssertion()
    //             .then((element) => {
    //                 identityProviderEditPage.getDeleteAssertionInput().type(element.text());
    //                 identityProviderEditPage.getDeleteConfirmButton().click();
    //             });
    //
    //         cy.wait(3000);
    //
    //         // Checks if directed to the listing page after successful deletion.
    //         cy.url().should("include", IdentityProvidersListPageConstants.PAGE_URL_MATCHER);
    //     });
    // });
});
