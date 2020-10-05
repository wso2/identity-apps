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

import { ApplicationEditPageConstants } from "../constants";

/**
 * Class containing Applications Edit Page objects.
 */
export class ApplicationEditPage {

    /**
     * Generates a Login Page objects instance.
     * @constructor
     */
    constructor() { }

    /**
     * Get the application edit page layout header element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeader(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.PAGE_LAYOUT_HEADER_DATA_ATTR);
    };

    /**
     * Get the application edit page layout header title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    };

    /**
     * Get the application edit page layout header sub title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderSubTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR);
    };

    /**
     * Get the application edit page back button.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageBackButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR);
    };

    /**
     * Get the application name input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getAppNameInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_NAME_INPUT_DATA_ATTR)
            .find("input");
    };

    /**
     * Get the application description input.
     * @return {Cypress.Chainable<Element>}
     */
    public getAppDescriptionInput(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_DESCRIPTION_INPUT_DATA_ATTR);
    };

    /**
     * Get the application image input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getAppImageInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_IMAGE_INPUT_DATA_ATTR)
            .find("input");
    };

    /**
     * Get the application discoverable checkbox.
     * @return {Cypress.Chainable<Element>}
     */
    public getAppDiscoverableCheckbox(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_DISCOVERABLE_CHECKBOX_DATA_ATTR);
    };

    /**
     * Get the application access URL input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getAppAccessURLInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_ACCESS_URL_INPUT_DATA_ATTR)
            .find("input");
    };

    /**
     * Get the application general settings form submit button.
     * @return {Cypress.Chainable<Element>}
     */
    public getGeneralSettingsFormSubmitButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.GENERAL_SETTINGS_SUBMIT_BUTTON_DATA_ATTR);
    };

    /**
     * Click on get the application general settings form submit button.
     */
    public clickOnGeneralSettingsFormSubmitButton(): void {
        this.getGeneralSettingsFormSubmitButton().click();
    };
}
