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

import { CommonUtils } from "@wso2/identity-cypress-test-base/ui";
import { IdentityProviderEditPageConstants } from "../constants";

/**
 * Class containing Identity Provider Edit Page objects.
 */
export class IdentityProviderEditPage {

    /**
     * Get the IDP edit page layout header element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeader(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.PAGE_LAYOUT_HEADER_DATA_ATTR);
    }

    /**
     * Get the IDP edit page layout header title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR);
    }

    /**
     * Get the IDP edit page layout header sub title element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutHeaderSubTitle(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR);
    }

    /**
     * Get the IDP edit page layout header image element.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageLayoutImage(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(IdentityProviderEditPageConstants.PAGE_LAYOUT_HEADER_IMAGE_WRAPPER_DATA_ATTR)
            .find("img");
    }

    /**
     * Get the IDP edit tabs.
     * @return {Cypress.Chainable<Element>}
     */
    public getTabs(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.RESOURCE_TABS_DATA_ATTR);
    }

    /**
     * Get a specif tab.
     *
     * @param tab - Tab to be selected.
     * @return {Cypress.Chainable<JQuery<HTMLElement>>}
     */
    public getTab(tab: "GENERAL" | "ATTRIBUTES" | "AUTHENTICATION" | "OUTBOUND_PROVISIONING" | "JIT_PROVISIONING" |
        "ADVANCED"): Cypress.Chainable<JQuery<HTMLElement>> {

        return cy.get(IdentityProviderEditPageConstants.RESOURCE_TABS_MENU_DATA_ATTR)
            .within(() => {
                if (tab === "GENERAL") {
                    return cy.get("a").eq(0);
                } else if (tab === "ATTRIBUTES") {
                    return cy.get("a").eq(1);
                } else if (tab === "AUTHENTICATION") {
                    return cy.get("a").eq(2);
                } else if (tab === "OUTBOUND_PROVISIONING") {
                    return cy.get("a").eq(3);
                } else if (tab === "JIT_PROVISIONING") {
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
    public selectTab(tab: "GENERAL" | "ATTRIBUTES" | "AUTHENTICATION" | "OUTBOUND_PROVISIONING" | "JIT_PROVISIONING" |
        "ADVANCED"): void {

        this.getTab(tab).click();
    }
    

    /**
     * Get the IDP edit page back button.
     * @return {Cypress.Chainable<Element>}
     */
    public getPageBackButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR);
    }

    /**
     * Get the IDP name input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getIDPNameInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_NAME_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the IDP description input.
     * @return {Cypress.Chainable<Element>}
     */
    public getIDPDescriptionInput(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_DESCRIPTION_INPUT_DATA_ATTR);
    }

    /**
     * Get the IDP image input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getIDPImageInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_IMAGE_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the IDP JWKS cert endpoint input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getIDPCertJWKSURLInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_CERT_JWKS_URL_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the JWKS IDP certificate radio button.
     * @return {Cypress.Chainable<Element>}
     */
    public getJWKSCertRadio(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_CERT_RADIO_GROUP_DATA_ATTR)
            .within(() => {
                cy.get("input[value=\"JWKS\"]");
            });
    }

    /**
     * Get the custom IDP certificate radio button.
     * @return {Cypress.Chainable<Element>}
     */
    public getCustomCertRadio(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_CERT_RADIO_GROUP_DATA_ATTR)
            .within(() => {
                cy.get("input[value=\"PEM\"]");
            });
    }

    /**
     * Get the IDP delete action in the danger zone.
     * @return {Cypress.Chainable<Element>}
     */
    public getDangerZoneDeleteButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.DANGER_ZONE_DELETE_BUTTON_DATA_ATTR);
    }

    /**
     * Get the IDP delete assertion.
     * @return {Cypress.Chainable<Element>}
     */
    public getDeleteAssertion(): Cypress.Chainable<Element | any> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_DELETE_ASSERTION_DATA_ATTR);
    }

    /**
     * Get the IDP delete assertion input.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getDeleteAssertionInput(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_DELETE_ASSERTION_INPUT_DATA_ATTR)
            .find("input");
    }

    /**
     * Get the IDP delete confirm button.
     * @return {Cypress.Chainable<Element>}
     */
    public getDeleteConfirmButton(): Cypress.Chainable<Element | any> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_DELETE_CONFIRM_BUTTON_DATA_ATTR);
    }

    /**
     * Get the IDP delete confirm modal close button.
     * @return {Cypress.Chainable<Element>}
     */
    public getDeleteConfirmModalCloseButton(): Cypress.Chainable<Element | any> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_DELETE_CONFIRM_MODAL_CLOSE_BUTTON_DATA_ATTR);
    }

    /**
     * Get the IDP general settings form submit button.
     * @return {Cypress.Chainable<Element>}
     */
    public getGeneralSettingsFormSubmitButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.GENERAL_SETTINGS_SUBMIT_BUTTON_DATA_ATTR);
    }

    /**
     * Click on get the IDP general settings form submit button.
     */
    public clickOnGeneralSettingsFormSubmitButton(): void {
        this.getGeneralSettingsFormSubmitButton().click();
    }

    /**
     * Get the IDP certificate update button.
     * @return {Cypress.Chainable<Element>}
     */
    public getCertificateUpdateButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.IDP_CERT_UPDATE_BUTTON_DATA_ATTR);
    }

    /**
     * Click on get the IDP certificate update button.
     */
    public clickOnCertificateUpdateButton(): void {
        this.getCertificateUpdateButton().click();
    }

    /**
     * Get the claim attribute selection list.
     * @return {Cypress.Chainable<Element>}
     */
    public getClaimAttributeSelectionList(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_LIST_DATA_ATTR);
    }

    /**
     * Get the claim attribute selection list edit button.
     * @return {Cypress.Chainable<Element>}
     */
    public getClaimAttributeSelectionListEditButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_LIST_EDIT_BUTTON_DATA_ATTR);
    }

    /**
     * Get the claim attribute selection list empty placeholder.
     * @return {Cypress.Chainable<Element>}
     */
    public getClaimAttributeSelectionListEmptyPlaceholder(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_LIST_EMPTY_PLACEHOLDER_DATA_ATTR);
    }

    /**
     * Get the claim attribute selection list empty placeholder action.
     * @return {Cypress.Chainable<JQuery<Element>>}
     */
    public getClaimAttributeSelectionListEmptyPlaceholderAction(): Cypress.Chainable<JQuery<Element>> {
        return cy.dataTestId(
            IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_LIST_EMPTY_PLACEHOLDER_ACTION_DATA_ATTR)
            .find("button");
    }

    /**
     * Clicks on claim attribute mapping update button.
     */
    public clickOnUpdateClaimAttributeMapping(): void {
        cy.get("body")
            .then(($body) => {
                if ($body.find(CommonUtils.resolveDataTestId(
                    IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_LIST_EMPTY_PLACEHOLDER_ACTION_DATA_ATTR))) {

                    this.getClaimAttributeSelectionListEmptyPlaceholderAction().click();
                } else {
                    this.getClaimAttributeSelectionListEditButton().click();
                }
            });
    }

    /**
     * Get the claim attribute selection wizard.
     * @return {Cypress.Chainable<Element>}
     */
    public getClaimAttributeSelectionWizard(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_WIZARD_DATA_ATTR);
    }

    /**
     * Get the claim attribute selection wizard unselected list.
     * @return {Cypress.Chainable<Element>}
     */
    public getClaimAttributeSelectionWizardUnselectedList(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_WIZARD_UNSELECTED_LIST_DATA_ATTR);
    }

    /**
     * Get the claim attribute selection wizard list add button.
     * @return {Cypress.Chainable<Element>}
     */
    public getClaimAttributeSelectionWizardListAddButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_WIZARD_LIST_ADD_BUTTON_DATA_ATTR);
    }

    /**
     * Get the claim attribute selection wizard list remove button.
     * @return {Cypress.Chainable<Element>}
     */
    public getClaimAttributeSelectionWizardListRemoveButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_WIZARD_LIST_REMOVE_BUTTON_DATA_ATTR);
    }

    /**
     * Get the claim attribute selection wizard list save button.
     * @return {Cypress.Chainable<Element>}
     */
    public getClaimAttributeSelectionWizardListSaveButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_WIZARD_LIST_SAVE_BUTTON_DATA_ATTR);
    }

    /**
     * Get the claim attribute selection wizard list cancel button.
     * @return {Cypress.Chainable<Element>}
     */
    public getClaimAttributeSelectionWizardListCancelButton(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.CLAIM_ATTR_SELECT_WIZARD_LIST_SAVE_BUTTON_DATA_ATTR);
    }

    /**
     * Get the subject attribute dropdown.
     * @return {Cypress.Chainable<Element>}
     */
    public getSubjectAttributeDropdown(): Cypress.Chainable<Element> {
        return cy.dataTestId(IdentityProviderEditPageConstants.SUBJECT_ATTRIBUTE_DROPDOWN_DATA_ATTR);
    }
}
