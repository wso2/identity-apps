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

import { Header } from "@wso2/identity-cypress-test-base/page-objects";
import { EmailTemplateTypesListPage } from "../../integration/email-templates";

/**
 * Custom command to navigate to the email template types page.
 * @example cy.navigateToEmailTemplateTypes()
 *
 * @param {boolean} switchPortalTab - If needed to switch to manage portal.
 * @param {boolean} assertIfRenders - Check iof the elements of the page renders properly after navigation.
 * @returns {Cypress.CanReturnChainable}
 */
Cypress.Commands.add("navigateToEmailTemplateTypes", (switchPortalTab: boolean = true,
                                                      assertIfRenders: boolean = true): Cypress.CanReturnChainable => {

    if (switchPortalTab) {
        const header: Header = new Header();
        header.clickOnManagePortalSwitch();
    }

    const emailTemplateTypesListPage: EmailTemplateTypesListPage = new EmailTemplateTypesListPage();

    emailTemplateTypesListPage.clickOnSidePanelItem();
    
    if (assertIfRenders) {
        cy.checkIfEmailTemplateTypeListingRenders();
    }
});

/**
 * Custom command to check if the email template types page renders properly.
 * @example cy.checkIfEmailTemplateTypeListingRenders()
 *
 * @returns {Cypress.CanReturnChainable}
 */
Cypress.Commands.add("checkIfEmailTemplateTypeListingRenders", (): Cypress.CanReturnChainable => {

    const emailTemplateTypesListPage: EmailTemplateTypesListPage = new EmailTemplateTypesListPage();

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
