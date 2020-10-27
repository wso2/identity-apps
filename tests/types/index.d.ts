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

declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to used to validate if an element is present or not.
         */
        checkIfElementExists(element: Element | any, waitTime?: number): Promise<any>;

        /**
         * Custom command to navigate to the applications list page.
         */
        navigateToApplicationsList(switchPortalTab?: boolean, assertIfRenders?: boolean): Cypress.CanReturnChainable;

        /**
         * Custom command to check if the applications listing page renders properly.
         */
        checkIfApplicationsListingRenders(): Cypress.CanReturnChainable;

        /**
         * Custom command to navigate to the email template types page.
         */
        navigateToEmailTemplateTypes(switchPortalTab?: boolean, assertIfRenders?: boolean): Cypress.CanReturnChainable;

        /**
         * Custom command to check if the email template types page renders properly.
         */
        checkIfEmailTemplateTypeListingRenders(): Cypress.CanReturnChainable;

        /**
         * Custom command to navigate to the identity providers list page.
         */
        navigateToIDPList(switchPortalTab?: boolean): Cypress.CanReturnChainable;

        /**
         * Custom command to check if the identity providers listing page renders properly.
         */
        checkIfIDPListingRenders(isNew?: boolean): Cypress.CanReturnChainable;

        /**
         * Custom command to navigate to the Attribute Dialect list page.
         */
        navigateToAttributeDialectsList(switchPortalTab?: boolean): Cypress.CanReturnChainable;

        /**
         * Custom command to check if the Attribute Dialect listing page renders properly.
         */
        checkIfAttributeDialectsListingRenders(isNew?: boolean): Cypress.CanReturnChainable;

        /**
         * Custom command to navigate to the Remote configuration page.
         */
        navigateToRemoteFetchPage(switchPortalTab?: boolean, assertIfRenders?: boolean): Cypress.CanReturnChainable;

        /**
         * Custom command to check if the Remote configuration page renders properly.
         */
        checkIfRemoteFetchPageRenders(): Cypress.CanReturnChainable;
    }
}
