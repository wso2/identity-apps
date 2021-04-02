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

import { SidePanelDomConstants } from "@wso2/identity-cypress-test-base/ui";
import { ApplicationsListPageConstants } from "../constants";

/**
 * Class containing Applications List Page objects.
 */
export class ApplicationsListPage {

    /**
     * Generates a Login Page objects instance.
     * @constructor
     */
    constructor() { }

    /**
     * Click on the applications side panel item.
     */
    public clickOnSidePanelItem(): void {
        cy.dataTestId(SidePanelDomConstants.APPLICATIONS_PARENT_ITEM_DATA_ATTR).click();
    }

    /**
     * Get the applications table element.
     * @return {Cypress.Chainable<Element>}
     */
    public getTable(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.TABLE_DATA_ATTR);
    }

    /**
     * Get the applications table body element.
     * @return {Cypress.Chainable<Element>}
     */
    public getTableBody(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.TABLE_BODY_DATA_ATTR);
    }

    /**
     * Get the applications table first element.
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
     * Click on the applications table first element's edit button.
     */
    public clickOnTableFirstElementEditButton(): void {
        this.getTableFirstElement()
            .within(() => {
                this.getTableItemEditButton().trigger("mouseover").click();
            });
    }

    /**
     * Click on the applications table first element's view button.
     */
    public clickOnTableFirstElementViewButton(): void {
        this.getTableFirstElement()
            .within(() => {
                this.getTableItemViewButton().trigger("mouseover").click();
            });
    }

    /**
     * Get the the applications table item heading.
     * @return {Cypress.Chainable<Element>}
     */
    public getTableItemHeading(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.TABLE_ROW_HEADING_DATA_ATTR);
    }

    /**
     * Get the the applications table item edit button.
     * @return {Cypress.Chainable<Element>}
     */
    public getTableItemEditButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.TABLE_ROW_EDIT_BUTTON_DATA_ATTR);
    }

    /**
     * Get the the applications table item delete button.
     * @return {Cypress.Chainable<Element>}
     */
    public getTableItemViewButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.TABLE_ROW_DELETE_BUTTON_DATA_ATTR);
    }

    /**
     * Get the applications page layout header element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeader(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.PAGE_LAYOUT_HEADER_DATA_ATTR);
    }

    /**
     * Get the applications page layout header title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    }

    /**
     * Get the applications page layout header sub title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderSubTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR);
    }

    /**
     * Get the applications page layout header action element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderAction(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.PAGE_LAYOUT_HEADER_ACTION);
    }

    /**
     * Get the applications list new placeholder element.
     * @return {Cypress.Chainable<Element>}
     */
    public getNewTablePlaceholder(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationsListPageConstants.NEW_LIST_PLACEHOLDER);
    }

    /**
     * Get the applications list new placeholder action element.
     * @return {Cypress.Chainable<Element>}
     */
    public getNewTablePlaceholderAction(): Cypress.Chainable<JQuery<HTMLButtonElement>> {
        return cy.dataTestId(ApplicationsListPageConstants.NEW_LIST_PLACEHOLDER_ACTION_CONTAINER)
            .find("button");
    }

    /**
     * Click on the new application button.
     */
    public clickOnNewApplicationButton(): void {
        this.getPageLayoutHeaderAction().click();
    }
}
