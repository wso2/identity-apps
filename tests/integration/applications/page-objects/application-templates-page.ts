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

import { ApplicationTemplatesPageConstants } from "../constants";

/**
 * Class containing Applications Templates Page objects.
 */
export class ApplicationTemplatesPage {

    /**
     * Generates a Login Page objects instance.
     * @constructor
     */
    constructor() { }

    /**
     * Get the application templates page layout header element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeader(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.PAGE_LAYOUT_HEADER_DATA_ATTR);
    }

    /**
     * Get the application templates page layout header title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    }

    /**
     * Get the application templates page layout header sub title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderSubTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR);
    }

    /**
     * Get the application templates page back button.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageBackButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR);
    }

    /**
     * Get the application templates search input.
     * @return {Cypress.Chainable<Element>}
     */
    public getSearchInput(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.SEARCH_INPUT_DATA_ATTR);
    }

    /**
     * Get the application templates sort dropdown.
     * @return {Cypress.Chainable<Element>}
     */
    public getSortDropdown(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.SORT_DROPDOWN_DATA_ATTR);
    }

    /**
     * Get the quick-start application templates grid.
     * @return {Cypress.Chainable<Element>}
     */
    public getQuickstartGrid(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.QUICK_START_TEMPLATE_GRID);
    }

    /**
     * Get the vendor application templates grid.
     * @return {Cypress.Chainable<Element>}
     */
    public getVendorGrid(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.VENDOR_TEMPLATE_GRID);
    }

    /**
     * Get quick-start application template.
     * @return {Cypress.Chainable<Element>}
     */
    public getQuickStartTemplate(type: "WEB_APP" | "SPA" | "DESKTOP_APP" | "MOBILE_APP"): Cypress.Chainable<Element> {
        if (type === "WEB_APP") {
            return cy.dataTestId(ApplicationTemplatesPageConstants.WEB_APP_TEMPLATE_CARD_DATA_ATTR); 
        } else if (type === "SPA") {
            return cy.dataTestId(ApplicationTemplatesPageConstants.SPA_TEMPLATE_CARD_DATA_ATTR);
        } else if (type === "DESKTOP_APP") {
            return cy.dataTestId(ApplicationTemplatesPageConstants.DESKTOP_APP_TEMPLATE_CARD_DATA_ATTR);
        } else if (type === "MOBILE_APP") {
            return cy.dataTestId(ApplicationTemplatesPageConstants.MOBILE_APP_TEMPLATE_CARD_DATA_ATTR);
        }
        
        throw Error("Invalid Quickstart Template type - " + type);
    }

    /**
     * Get vendor application template.
     * @return {Cypress.Chainable<Element>}
     */
    public getVendorTemplate(type: "BOX" | "SLACK" | "WORKDAY" | "ZOOM"): Cypress.Chainable<Element> {
        if (type === "BOX") {
            return cy.dataTestId(ApplicationTemplatesPageConstants.BOX_APP_TEMPLATE_CARD_DATA_ATTR);
        } else if (type === "SLACK") {
            return cy.dataTestId(ApplicationTemplatesPageConstants.SLACK_APP_TEMPLATE_CARD_DATA_ATTR);
        } else if (type === "WORKDAY") {
            return cy.dataTestId(ApplicationTemplatesPageConstants.WORKDAY_APP_TEMPLATE_CARD_DATA_ATTR);
        } else if (type === "ZOOM") {
            return cy.dataTestId(ApplicationTemplatesPageConstants.ZOOM_APP_TEMPLATE_CARD_DATA_ATTR);
        }

        throw Error("Invalid Vendor Template type - " + type);
    }

    /**
     * Get the minimal creation wizard.
     * @return {Cypress.Chainable<Element>}
     */
    public getMinimalCreationWizard(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.MINIMAL_CREATION_WIZARD_DATA_ATTR);
    }

    /**
     * Get the minimal creation wizard application name input.
     * @return {Cypress.Chainable<Element>}
     */
    public getMinimalCreationWizardAppNameInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.MINIMAL_CREATION_WIZARD_APP_NAME_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the minimal creation wizard OIDC card.
     * @return {Cypress.Chainable<Element>}
     */
    public getMinimalCreationWizardOIDCCard(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.MINIMAL_CREATION_WIZARD_OIDC_CARD_DATA_ATTR);
    }

    /**
     * Get the minimal creation wizard SAML card.
     * @return {Cypress.Chainable<Element>}
     */
    public getMinimalCreationWizardSAMLCard(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.MINIMAL_CREATION_WIZARD_SAML_CARD_DATA_ATTR);
    }

    /**
     * Get the minimal creation wizard Redirect URL Input.
     * @return {Cypress.Chainable<Element>}
     */
    public getMinimalCreationWizardRedirectURLInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.MINIMAL_CREATION_WIZARD_REDIRECT_URL_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the minimal creation wizard redirect URL add button.
     * @return {Cypress.Chainable<Element>}
     */
    public getMinimalCreationWizardRedirectURLAddButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(
            ApplicationTemplatesPageConstants.MINIMAL_CREATION_WIZARD_REDIRECT_URL_ADD_BUTTON_DATA_ATTR);
    }

    /**
     * Get the minimal creation wizard form submit button.
     * @return {Cypress.Chainable<Element>}
     */
    public getMinimalCreationWizardSubmitButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationTemplatesPageConstants.MINIMAL_CREATION_WIZARD_SUBMIT_BUTTON_DATA_ATTR);
    }

    /**
     * Click on the minimal creation wizard form submit button.
     * @return {Cypress.Chainable<Element>}
     */
    public clickOnMinimalCreationWizardSubmitButton(): void {
        this.getMinimalCreationWizardSubmitButton().click();
    }
}
