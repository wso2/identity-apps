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

import { Header } from "@wso2/identity-cypress-test-base/dist/page-objects";
import { RemoteConfigurationPage } from "../../integration/remote-fetch/page-objects";

/**
 * Custom command to navigate to the remote  configurations page.
 * @example cy.navigateToRemoteFetchPage()
 *
 * @param {boolean} switchPortalTab - If needed to switch to manage portal.
 * @returns {Cypress.CanReturnChainable}
 */
Cypress.Commands.add("navigateToRemoteFetchPage", (switchPortalTab: boolean = true): Cypress.CanReturnChainable => {

    if (switchPortalTab) {
        const header: Header = new Header();
        header.clickOnManagePortalSwitch();
    }

    const remoteFetchConfigurationPage: RemoteConfigurationPage = new RemoteConfigurationPage();

    remoteFetchConfigurationPage.clickOnSidePanelItem();
});

/**
 * Custom command to check if the remote configuration page renders properly.
 * @example cy.checkIfIDPListingRenders()
 *
 * @param {boolean} isNew - Is the list a new one.
 * @returns {Cypress.CanReturnChainable}
 */
Cypress.Commands.add("checkIfRemoteFetchPageRenders", (): Cypress.CanReturnChainable => {

    const remoteFetchConfigurationPage: RemoteConfigurationPage = new RemoteConfigurationPage();

    // Check if page header exists and check if all the necessary elements are rendering.
    remoteFetchConfigurationPage.getPageLayoutHeader().should("be.visible");
    remoteFetchConfigurationPage.getPageLayoutHeaderTitle().should("be.visible");

});
