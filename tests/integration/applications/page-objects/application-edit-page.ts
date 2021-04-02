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
    }

    /**
     * Get the application edit page layout header title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    }

    /**
     * Get the application edit page layout header sub title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderSubTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR);
    }

    /**
     * Get the application edit tabs.
     * @return {Cypress.Chainable<Element>}
     */
    public getTabs(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.RESOURCE_TABS_DATA_ATTR);
    }

    /**
     * Get a specif tab.
     *
     * @param tab - Tab to be selected.
     * @return {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    public getTab(tab: "GENERAL" | "ACCESS" | "ATTRIBUTES" | "SIGN_ON" | "PROVISIONING" |
        "ADVANCED"): Cypress.Chainable<JQuery<HTMLElement>> {

        return cy.get(ApplicationEditPageConstants.RESOURCE_TABS_MENU_DATA_ATTR)
            .within(() => {
                if (tab === "GENERAL") {
                    return cy.get("a").eq(0);
                } else if (tab === "ACCESS") {
                    return cy.get("a").eq(1);
                } else if (tab === "ATTRIBUTES") {
                    return cy.get("a").eq(2);
                } else if (tab === "SIGN_ON") {
                    return cy.get("a").eq(3);
                } else if (tab === "PROVISIONING") {
                    return cy.get("a").eq(4);
                } else if (tab === "ADVANCED") {
                    return cy.get("a").eq(5);
                }
                
                throw new Error("Invalid tab selection - " + tab);
            });
    }

    /**
     * Select a tab from the resource tabs.
     *
     * @param tab - Tab to be selected.
     */
    public selectTab(tab: "GENERAL" | "ACCESS" | "ATTRIBUTES" | "SIGN_ON" | "PROVISIONING" | "ADVANCED"): void {

        this.getTab(tab).click({ force: true, multiple: true });
    }
    

    /**
     * Get the application edit page back button.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageBackButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR);
    }

    /**
     * Get the application name input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getAppNameInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_NAME_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the application description input.
     * @return {Cypress.Chainable<Element>}
     */
    public getAppDescriptionInput(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_DESCRIPTION_INPUT_DATA_ATTR);
    }

    /**
     * Get the application image input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getAppImageInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_IMAGE_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the application discoverable checkbox.
     * @return {Cypress.Chainable<Element>}
     */
    public getAppDiscoverableCheckbox(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_DISCOVERABLE_CHECKBOX_DATA_ATTR);
    }

    /**
     * Get the application access URL input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getAppAccessURLInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_ACCESS_URL_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the application JWKS cert endpoint input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getAppCertJWKSURLInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_CERT_JWKS_URL_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the JWKS application certificate radio button.
     * @return {Cypress.Chainable<Element>}
     */
    public getJWKSCertRadio(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_CERT_RADIO_GROUP_DATA_ATTR)
            .within(() => {
                cy.get("input[value=\"JWKS\"]");
            });
    }

    /**
     * Get the custom application certificate radio button.
     * @return {Cypress.Chainable<Element>}
     */
    public getCustomCertRadio(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_CERT_RADIO_GROUP_DATA_ATTR)
            .within(() => {
                cy.get("input[value=\"PEM\"]");
            });
    }

    /**
     * Get the application PEM certificate input.
     * @return {Cypress.Chainable<Element>}
     */
    public getPEMCertInput(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_PEM_CERT_INPUT_DATA_ATTR);
    }

    /**
     * Get the application PEM certificate preview button.
     * @return {Cypress.Chainable<Element>}
     */
    public getPEMCertPreviewButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_PEM_CERT_PREVIEW_BUTTON_DATA_ATTR);
    }

    /**
     * Get the application PEM certificate preview modal.
     * @return {Cypress.Chainable<Element>}
     */
    public getPEMCertPreviewModal(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_PEM_CERT_PREVIEW_MODAL_DATA_ATTR);
    }

    /**
     * Get the application PEM certificate preview modal dimmer.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getPEMCertPreviewModalDimmer(): Cypress.Chainable<JQuery<Element>> {
        return cy.get(ApplicationEditPageConstants.APP_PEM_CERT_PREVIEW_MODAL_DIMMER_DATA_ATTR);
    }

    /**
     * Get the application delete action in the danger zone.
     * @return {Cypress.Chainable<Element>}
     */
    public getDangerZoneDeleteButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.DANGER_ZONE_DELETE_BUTTON_DATA_ATTR);
    }

    /**
     * Get the application delete assertion.
     * @return {Cypress.Chainable<Element>}
     */
    public getDeleteAssertion(): Cypress.Chainable<Element | any> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_DELETE_ASSERTION_DATA_ATTR);
    }

    /**
     * Get the application delete assertion input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getDeleteAssertionInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_DELETE_ASSERTION_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the application delete confirm button.
     * @return {Cypress.Chainable<Element>}
     */
    public getDeleteConfirmButton(): Cypress.Chainable<Element | any> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_DELETE_CONFIRM_BUTTON_DATA_ATTR);
    }

    /**
     * Get the application delete confirm modal close button.
     * @return {Cypress.Chainable<Element>}
     */
    public getDeleteConfirmModalCloseButton(): Cypress.Chainable<Element | any> {
        return cy.dataTestId(ApplicationEditPageConstants.APP_DELETE_CONFIRM_MODAL_CLOSE_BUTTON_DATA_ATTR);
    }

    /**
     * Get the application general settings form submit button.
     * @return {Cypress.Chainable<Element>}
     */
    public getGeneralSettingsFormSubmitButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.GENERAL_SETTINGS_SUBMIT_BUTTON_DATA_ATTR);
    }

    /**
     * Click on get the application general settings form submit button.
     */
    public clickOnGeneralSettingsFormSubmitButton(): void {
        this.getGeneralSettingsFormSubmitButton().click();
    }

    /**
     * Get the protocol accordion.
     * @return {Cypress.Chainable<Element>}
     */
    public getProtocolAccordion(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.PROTOCOL_ACCORDION_DATA_ATTR);
    }

    /**
     * Get the add protocol button.
     * @return {Cypress.Chainable<Element>}
     */
    public getProtocolAddButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.ADD_PROTOCOL_BUTTON_DATA_ATTR);
    }

    /**
     * Get the add protocol wizard.
     * @return {Cypress.Chainable<Element>}
     */
    public getProtocolAddWizard(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.ADD_PROTOCOL_WIZARD_DATA_ATTR);
    }

    /**
     * Get the add protocol wizard cancel button.
     * @return {Cypress.Chainable<Element>}
     */
    public getProtocolAddWizardCancelButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.ADD_PROTOCOL_WIZARD_CANCEL_BUTTON_DATA_ATTR);
    }

    /**
     * Get the OIDC section on protocol accordion.
     * @return {Cypress.Chainable<Element>}
     */
    public getProtocolAccordionOIDCItem(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.OIDC_PROTOCOL_ACCORDION_ITEM_DATA_ATTR);
    }

    /**
     * Get the chevron icon of OIDC section on protocol accordion.
     * @return {Cypress.Chainable<Element>}
     */
    public getProtocolAccordionOIDCItemChevron(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.OIDC_PROTOCOL_ACCORDION_ITEM_CHEVRON_DATA_ATTR);
    }

    /**
     * Get the attribute selection list.
     * @return {Cypress.Chainable<Element>}
     */
    public getAttributeSelectionList(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.ATTRIBUTE_SELECTION_LIST_DATA_ATTR);
    }

    /**
     * Get the subject attribute dropdown.
     * @return {Cypress.Chainable<Element>}
     */
    public getSubjectAttributeDropdown(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.SUBJECT_ATTRIBUTE_DROPDOWN_DATA_ATTR);
    }

    /**
     * Get the include userstore checkbox.
     * @return {Cypress.Chainable<Element>}
     */
    public getIncludeUserstoreCheckbox(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.INCLUDE_USERSTORE_CHECKBOX_DATA_ATTR);
    }

    /**
     * Get the include tenant domain checkbox.
     * @return {Cypress.Chainable<Element>}
     */
    public getIncludeTenantDomainCheckbox(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.INCLUDE_TENANT_DOMAIN_CHECKBOX_DATA_ATTR);
    }

    /**
     * Get the use mapped local subject checkbox.
     * @return {Cypress.Chainable<Element>}
     */
    public getUseMappedLocalSubjectCheckbox(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.USED_MAPPED_LOCAL_SUBJECT_CHECKBOX_DATA_ATTR);
    }

    /**
     * Get the role attribute dropdown
     * @return {Cypress.Chainable<Element>}
     */
    public getRoleAttributeDropdown(): Cypress.Chainable<Element> {
        return cy.dataTestId(ApplicationEditPageConstants.ROLE_ATTRIBUTE_DROPDOWN_DATA_ATTR);
    }
}
