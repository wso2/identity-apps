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

import { IdentityProviderTemplatesPageConstants } from "../constants";

/**
 * Class containing Identity Providers Templates Page objects.
 */
export class IdentityProviderTemplatesPage {

    /**
     * Generates a Login Page objects instance.
     * @constructor
     */
    constructor() { }

    /**
     * Get the IDP templates page layout header element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeader(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.PAGE_LAYOUT_HEADER_DATA_ATTR);
    }

    /**
     * Get the IDP templates page layout header title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    }

    /**
     * Get the IDP templates page layout header sub title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderSubTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR);
    }

    /**
     * Get the IDP templates page back button.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageBackButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR);
    }

    /**
     * Get the quick-start IDP templates grid.
     * @return {Cypress.Chainable<Element>}
     */
    public getQuickstartGrid(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.QUICK_START_TEMPLATE_GRID);
    }

    /**
     * Get the manual setup IDP templates grid.
     * @return {Cypress.Chainable<Element>}
     */
    public getManualSetupGrid(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.MANUAL_SETUP_TEMPLATE_GRID);
    }

    /**
     * Get quick-start IDP template.
     * @return {Cypress.Chainable<Element>}
     */
    public getQuickStartTemplate(type: "GOOGLE" | "FACEBOOK" | "OIDC"): Cypress.Chainable<Element> {
        if (type === "GOOGLE") {
            return cy.dataTestId(IdentityProviderTemplatesPageConstants.GOOGLE_IDP_TEMPLATE_CARD_DATA_ATTR); 
        } else if (type === "FACEBOOK") {
            return cy.dataTestId(IdentityProviderTemplatesPageConstants.FACEBOOK_IDP_TEMPLATE_CARD_DATA_ATTR);
        } else if (type === "OIDC") {
            return cy.dataTestId(IdentityProviderTemplatesPageConstants.OIDC_IDP_TEMPLATE_CARD_DATA_ATTR);
        }
        
        throw Error("Invalid Quickstart IDP Template type - " + type);
    }

    /**
     * Get manual setup IDP template.
     * @return {Cypress.Chainable<Element>}
     */
    public getManualSetupTemplate(type: "EXPERT"): Cypress.Chainable<Element> {
        if (type === "EXPERT") {
            return cy.dataTestId(IdentityProviderTemplatesPageConstants.EXPERT_IDP_TEMPLATE_CARD_DATA_ATTR);
        }

        throw Error("Invalid Manual Setup Template type - " + type);
    }

    /**
     * Get the creation wizard.
     * @return {Cypress.Chainable<Element>}
     */
    public getCreationWizard(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.CREATION_WIZARD_DATA_ATTR);
    }

    /**
     * Get the creation wizard IDP name input.
     * @return {Cypress.Chainable<Element>}
     */
    public getCreationWizardIDPNameInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.CREATION_WIZARD_IDP_NAME_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the creation wizard IDP description input.
     * @return {Cypress.Chainable<Element>}
     */
    public getCreationWizardIDPDescriptionInput(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.CREATION_WIZARD_IDP_DESCRIPTION_DATA_ATTR);
    }

    /**
     * Get the creation wizard IDP image input.
     * @return {Cypress.Chainable<Element>}
     */
    public getCreationWizardIDPImageInput(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.CREATION_WIZARD_IDP_IMAGE_DATA_ATTR);
    }

    /**
     * Get the creation wizard form next button.
     * @return {Cypress.Chainable<Element>}
     */
    public getCreationWizardNextButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.CREATION_WIZARD_NEXT_BUTTON_DATA_ATTR);
    }

    /**
     * Click on the creation wizard form next button.
     * @return {Cypress.Chainable<Element>}
     */
    public clickOnCreationWizardNextButton(): void {
        this.getCreationWizardNextButton().click();
    }

    /**
     * Get the creation wizard form finish button.
     * @return {Cypress.Chainable<Element>}
     */
    public getCreationWizardFinishButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderTemplatesPageConstants.CREATION_WIZARD_FINISH_BUTTON_DATA_ATTR);
    }

    /**
     * Click on the creation wizard form finish button.
     * @return {Cypress.Chainable<Element>}
     */
    public clickOnCreationWizardFinishButton(): void {
        this.getCreationWizardFinishButton().click();
    }
}
