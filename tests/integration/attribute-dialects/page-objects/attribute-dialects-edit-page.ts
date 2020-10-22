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

import { AttributeDialectsEditPageConstants } from "../constants";

/**
 * Class containing Attribute Dialects Edit Page objects.
 */
export class AttributeDialectsEditPage {

    /**
     * Get the Attribute Dialects edit page layout header element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeader(): Cypress.Chainable<Element> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.PAGE_LAYOUT_HEADER_DATA_ATTR);
    }

    /**
     * Get the Attribute Dialects edit page layout header title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    }

    /**
     * Get the Attribute Dialects edit page layout header sub title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderSubTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR);
    }

    /**
     * Get the Attribute Dialects edit page layout header image element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutImage(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.PAGE_LAYOUT_HEADER_IMAGE_WRAPPER_DATA_ATTR)
            .find("img");
    }

    /**
     * Get the Attribute Dialects edit page back button.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageBackButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR);
    }

    /**
     * Get the Attribute Dialects delete action in the danger zone.
     * @return {Cypress.Chainable<Element>}
     */
    public getDangerZoneDeleteButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.DANGER_ZONE_DELETE_BUTTON_DATA_ATTR);
    }

    /**
     * Get the Attribute Dialects delete assertion.
     * @return {Cypress.Chainable<Element>}
     */
    public getDeleteAssertion(): Cypress.Chainable<Element | any> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.ATTRIBUTE_DIALECT_DELETE_ASSERTION_DATA_ATTR);
    }

    /**
     * Get the Attribute Dialects delete assertion input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getDeleteAssertionInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.ATTRIBUTE_DIALECT_DELETE_ASSERTION_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the Attribute Dialects delete confirm button.
     * @return {Cypress.Chainable<Element>}
     */
    public getDeleteConfirmButton(): Cypress.Chainable<Element | any> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.ATTRIBUTE_DIALECT_DELETE_CONFIRM_BUTTON_DATA_ATTR);
    }

    /**
     * Get the Attribute Dialects delete confirm modal close button.
     * @return {Cypress.Chainable<Element>}
     */
    public getDeleteConfirmModalCloseButton(): Cypress.Chainable<Element | any> {
        return cy.dataTestId(AttributeDialectsEditPageConstants.ATTRIBUTE_DIALECT_DELETE_MODAL_CLOSE_BUTTON_DATA_ATTR);
    }
}
