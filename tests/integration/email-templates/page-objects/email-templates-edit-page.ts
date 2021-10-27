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

import { EmailTemplatesEditPageConstants } from "../constants";

/**
 * Class containing Email Templates Edit Page objects.
 */
export class EmailTemplatesEditPage {

    /**
     * Generates a Login Page objects instance.
     * @constructor
     */
    constructor() { }

    /**
     * Get the page layout header element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeader(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesEditPageConstants.PAGE_LAYOUT_HEADER_DATA_ATTR);
    }

    /**
     * Get the page layout header title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesEditPageConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    }

    /**
     * Get the page layout header back button.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderBackButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesEditPageConstants.PAGE_LAYOUT_HEADER_DATA_ATTR)
            .within(() => {
                cy.get(EmailTemplatesEditPageConstants.PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR);
            });
    }

    /**
     * Click on the page layout header back button.
     */
    public clickOnPageLayoutHeaderBackButton(): void {
        this.getPageLayoutHeaderBackButton().click();
    }

    /**
     * Get Subject input element.
     * @return {Cypress.Chainable<Element>}
     */
    public getSubjectInput(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesEditPageConstants.SUBJECT_INPUT_DATA_ATTR);
    }

    /**
     * Get Add template form submit button element.
     * @return {Cypress.Chainable<Element>}
     */
    public getFormSubmitButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesEditPageConstants.FORM_SUBMIT_BUTTON);
    }

    /**
     * Click on add template form submit button.
     */
    public clickOnFormSubmitButton(): void {
        this.getFormSubmitButton().click();
    }
}
