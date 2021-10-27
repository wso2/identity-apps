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

import { EmailTemplatesListPageConstants } from "../constants";

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
     * Get the email templates table element.
     * @return {Cypress.Chainable<Element>}
     */
    public getTable(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.TABLE_DATA_ATTR);
    }

    /**
     * Get the email templates table body element.
     * @return {Cypress.Chainable<Element>}
     */
    public getTableBody(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.TABLE_BODY_DATA_ATTR);
    }

    /**
     * Get the email templates table first element.
     * @return {Cypress.Chainable<Element>}
     */
    public getTableFirstElement(): Cypress.Chainable<Element> {
        return this.getTable()
            .within(() => {
                cy.dataTestId("data-table-row")
                    .eq(0);
            });
    }

    /**
     * Click on the email templates table first element's edit button.
     */
    public clickOnTableFirstElementEditButton(): void {
        this.getTableFirstElement()
            .within(() => {
                this.getTableItemEditButton().trigger("mouseover").click();
            });
    }

    /**
     * Click on the email templates table first element's view button.
     */
    public clickOnTableFirstElementViewButton(): void {
        this.getTableFirstElement()
            .within(() => {
                this.getTableItemViewButton().trigger("mouseover").click();
            });
    }

    /**
     * Get the the email templates table item heading.
     * @return {Cypress.Chainable<Element>}
     */
    public getTableItemHeading(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.TABLE_ROW_HEADING_DATA_ATTR);
    }

    /**
     * Get the the email templates table item edit button.
     * @return {Cypress.Chainable<Element>}
     */
    public getTableItemEditButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.TABLE_ROW_EDIT_BUTTON_DATA_ATTR);
    }

    /**
     * Get the the email templates table item view button.
     * @return {Cypress.Chainable<Element>}
     */
    public getTableItemViewButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.TABLE_ROW_VIEW_BUTTON_DATA_ATTR);
    }

    /**
     * Get the email templates page layout header element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeader(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.PAGE_LAYOUT_HEADER_DATA_ATTR);
    }

    /**
     * Get the email templates page layout header title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    }

    /**
     * Get the email templates page layout header action element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderAction(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.PAGE_LAYOUT_HEADER_ACTION);
    }

    /**
     * Get the email templates list new placeholder element.
     * @return {Cypress.Chainable<Element>}
     */
    public getNewTablePlaceholder(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.NEW_LIST_PLACEHOLDER);
    }

    /**
     * Get the email templates list new placeholder action element.
     * @return {Cypress.Chainable<Element>}
     */
    public getNewTablePlaceholderAction(): Cypress.Chainable<JQuery<HTMLButtonElement>> {
        return cy.dataTestId(EmailTemplatesListPageConstants.NEW_LIST_PLACEHOLDER_ACTION_CONTAINER)
            .find("button");
    }

    /**
     * Get the email templates view modal.
     * @return {Cypress.Chainable<Element>}
     */
    public getEmailTemplateViewModal(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.TEMPLATE_VIEW_MODAL_DATA_ATTR);
    }

    /**
     * Get the email templates view modal cancel button.
     * @return {Cypress.Chainable<Element>}
     */
    public getEmailTemplateViewModalCancelButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(EmailTemplatesListPageConstants.TEMPLATE_VIEW_MODAL_CANCEL_BUTTON_DATA_ATTR);
    }

    /**
     * Click on the email templates view modal cancel button.
     */
    public clickOnEmailTemplateViewModalCancelButton(): void {
        this.getEmailTemplateViewModalCancelButton().click();
    }

    /**
     * Click on the new template button on the empty placeholder.
     */
    public clickOnNewTablePlaceholderAction(): void {
        this.getNewTablePlaceholderAction().click();
    }

    /**
     * Click on the new template button.
     */
    public clickOnNewTemplateButton(): void {
        this.getPageLayoutHeaderAction().click();
    }
}
