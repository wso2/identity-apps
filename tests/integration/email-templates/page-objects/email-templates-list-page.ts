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

import { EmailTemplateTypesDomConstants } from "../constants";

/**
 * Class containing Email Templates Page objects.
 */
export class EmailTemplatesListPage {

    /**
     * Generates a Login Page objects instance.
     * @constructor
     */
    constructor() { }

    /**
     * Click on the email templates side panel item.
     */
    public clickOnSidePanelItem(): void {
        cy.dataTestId(EmailTemplateTypesDomConstants.SIDE_PANEL_ITEM_DATA_ATTR).click();
    };

    /**
     * Get the data attribute of the email templates table.
     * @return {Cypress.Chainable<Element>}
     */
    public getEmailTemplatesTable(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplateTypesDomConstants.TABLE_DATA_ATTR);
    };

    /**
     * Get the data attribute of the email templates table body.
     * @return {Cypress.Chainable<Element>}
     */
    public getEmailTemplatesTableBody(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplateTypesDomConstants.TABLE_BODY_DATA_ATTR);
    };

    /**
     * Get the data attribute of the email templates page layout header.
     * @return {Cypress.Chainable<Element>}
     */
    public getEmailTemplatesPageLayoutHeader(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplateTypesDomConstants.PAGE_LAYOUT_HEADER_DATA_ATTR);
    };

    /**
     * Get the data attribute of the email templates page layout header title.
     * @return {Cypress.Chainable<Element>}
     */
    public getEmailTemplatesPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplateTypesDomConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    };

    /**
     * Get the data attribute of the email templates page layout header sub title.
     * @return {Cypress.Chainable<Element>}
     */
    public getEmailTemplatesPageLayoutHeaderSubTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplateTypesDomConstants.PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR);
    };

    /**
     * Get the data attribute of the email templates page layout header action.
     * @return {Cypress.Chainable<Element>}
     */
    public getEmailTemplatesPageLayoutHeaderAction(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplateTypesDomConstants.PAGE_LAYOUT_HEADER_ACTION);
    };

    /**
     * Click on the New template type button.
     */
    public clickOnNewTemplateTypeButton(): void {
        this.getEmailTemplatesPageLayoutHeaderAction().click();
    };

    /**
     * Get the data attribute of the add new templates type wizard.
     * @return {Cypress.Chainable<Element>}
     */
    public getAddTemplateTypeWizard(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplateTypesDomConstants.ADD_WIZARD_DATA_ATTR);
    };

    /**
     * Get the data attribute of the new templates type name input in the wizard.
     * @return {Cypress.Chainable<Element>}
     */
    public getTemplateTypeNameInputInWizard(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplateTypesDomConstants.TEMPLATE_TYPE_NAME_INPUT_DATA_ATTR);
    };

    /**
     * Get the data attribute of the new template type wizard's create button.
     * @return {Cypress.Chainable<Element>}
     */
    public getTemplateTypeCreateButtonInWizard(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplateTypesDomConstants.CREATE_TEMPLATE_TYPE_BUTTON_DATA_ATTR);
    };
}
