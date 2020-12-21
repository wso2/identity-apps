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
 */

/// <reference types="cypress" />
/// <reference types="../../types" />

import { CookieUtils, HousekeepingUtils } from "@wso2/identity-cypress-test-base/utils";
import { v4 as uuidv4 } from "uuid";
import { AttributeDialectsListPage } from "./page-objects";

const USERNAME: string = Cypress.env("TENANT_USERNAME");
const PASSWORD: string = Cypress.env("TENANT_PASSWORD");
const SERVER_URL: string = Cypress.env("SERVER_URL");
const PORTAL: string = Cypress.env("CONSOLE_BASE_URL");
const TENANT_DOMAIN: string = Cypress.env("TENANT_DOMAIN");

describe("ITC-2.0.0 - [attribute dialects] - Attribute Dialect Management Integration Tests.", () => {

    const attributeDialectsListPage: AttributeDialectsListPage = new AttributeDialectsListPage();

    const dialectURI: string = "https://" + uuidv4();
    const attributeURI: string = uuidv4();

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
    // context.skip("ITC-2.1.0 - [attribute dialects] - Attribute Dialect Listing.", () => {
    //
    //     it("ITC-1.1.1 - [attribute dialects] - Can visit the listing page from the side panel", () => {
    //         cy.navigateToAttributeDialectsList(true);
    //     });
    //
    //     it("ITC-1.1.2 - [attribute dialects] - Properly renders the elements of the listing page.", () => {
    //         cy.wait(1000);
    //
    //         cy.checkIfAttributeDialectsListingRenders(false);
    //     });
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context.skip("ITC-2.2.0 - [attribute dialects] - Create an Attribute Dialect using the wizard.", () => {
    //
    //     it("ITC-2.2.1 - [attribute dialects] - Open up the add dialect wizard.", () => {
    //         attributeDialectsListPage.clickOnNewAttributeDialectButton();
    //
    //         cy.wait(2000);
    //     });
    //
    //     it("ITC-2.2.2 - [attribute dialects] - Enter dialect URI", () => {
    //         attributeDialectsListPage.getAddDialectWizardDialectURIInput().type(dialectURI);
    //         attributeDialectsListPage.getAddDialectWizardNextButton().click();
    //
    //         cy.wait(2000);
    //     });
    //
    //     it("ITC-2.2.3 - [attribute dialects] - Configure external attributes.", () => {
    //         attributeDialectsListPage.getAddDialectWizardAttributeURIInput().type(attributeURI);
    //         attributeDialectsListPage.openAddDialectWizardLocalAttributesDropdown();
    //
    //         cy.wait(1000);
    //
    //         attributeDialectsListPage.getAddDialectWizardLocalAttributesDropdownOptions().eq(0).click(
    //             { force: true });
    //
    //         cy.wait(1000);
    //
    //         attributeDialectsListPage.getAddDialectWizardAddExternalAttributeButton().click();
    //
    //         cy.wait(1000);
    //
    //         attributeDialectsListPage.getAddDialectWizardNextButton().click();
    //
    //         cy.wait(2000);
    //     });
    //
    //     it("ITC-2.2.4 - [attribute dialects] - Submit add dialect wizard.", () => {
    //         attributeDialectsListPage.getAddDialectWizardFinishButton().click();
    //
    //         cy.wait(2000);
    //     });
    // });
});
