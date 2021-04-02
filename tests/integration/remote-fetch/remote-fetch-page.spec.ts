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

import { CookieUtils, HousekeepingUtils } from "@wso2/identity-cypress-test-base/ui";
import { v4 as uuidv4 } from "uuid";
import { RemoteConfigurationPage } from "./page-objects";

const USERNAME: string = Cypress.env("TENANT_USERNAME");
const PASSWORD: string = Cypress.env("TENANT_PASSWORD");
const SERVER_URL: string = Cypress.env("SERVER_URL");
const PORTAL: string = Cypress.env("CONSOLE_BASE_URL");
const TENANT_DOMAIN: string = Cypress.env("TENANT_DOMAIN");

describe("ITC-3.0.0 - [remote-configuration] - Remote configuration.", () => {

    const remoteFetchConfigurationPage: RemoteConfigurationPage = new RemoteConfigurationPage();

    before(() => {
        HousekeepingUtils.performCleanUpTasks();
        cy.login(USERNAME, PASSWORD, SERVER_URL, PORTAL, TENANT_DOMAIN);
    });

    beforeEach(() => {
        CookieUtils.preserveAllSessionCookies();
    });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context.skip("ITC-3.1.0 - [remote-configuration] - Remote configuration page.", () => {
    //
    //     it("ITC_3.1.1 - After User login and navigate to remote configuration page", function () {
    //         cy.navigateToRemoteFetchPage(true, false);
    //     });
    //
    //     it("ITC_3.1.2 - Check if remote configuration page is rendered.", function () {
    //         cy.checkIfRemoteFetchPageRenders()
    //     });
    //
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore disabling this test temporally until we find the cause for this failure.
    // context("ITC-3.2.0 - [remote-configuration] - Save new remote configuration polling configuration.", () => {
    //
    //     const configURL = "https://github.com/Thumimku/TestGit.git";
    //     const configBranch = "master";
    //     const configDirectory = "restDemo/";
    //     const configUsername = "SampleUsername";
    //     const configAccessToken = uuidv4();
    //
    //     it("ITC_3.2.1 - After navigate to remote configuration page, click add remote configuration.", () => {
    //
    //         remoteFetchConfigurationPage.clickAddConfigureRepository();
    //
    //         cy.wait(1000);
    //
    //         remoteFetchConfigurationPage.getSaveConfigGitURL().should("be.visible");
    //     });
    //
    //     it("ITC_3.2.2 - Fill remote config details into form", () => {
    //
    //         remoteFetchConfigurationPage.getSaveConfigGitURL().type(configURL);
    //         remoteFetchConfigurationPage.getSaveConfigGitBranch().type(configBranch);
    //         remoteFetchConfigurationPage.getSaveConfigGitDirecotry().type(configDirectory);
    //         remoteFetchConfigurationPage.getSaveConfigGitConnectivityPolling().click();
    //         remoteFetchConfigurationPage.getSaveConfigGitUserName().type(configUsername);
    //         remoteFetchConfigurationPage.getSaveConfigGitAccessToken().type(configAccessToken);
    //     });
    //
    //     // This test case only fails during the product build time, but passes when it run locally.
    //     // Therefore skipping this test temporally until we find the cause for this failure.
    //     it.skip("ITC_3.2.3 - Save remote configurations details", () => {
    //
    //         remoteFetchConfigurationPage.clickSaveConfiguration();
    //
    //         cy.wait(3000);
    //
    //         remoteFetchConfigurationPage.getSaveConfigStatus().should("be.visible");
    //     });
    //
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore skipping this test temporally until we find the cause for this failure.
    // context.skip("ITC-3.3.0 - [remote-configuration] - View remote configuration status on application view.", () => {
    //
    //     it("ITC_3.2.3 - Remote configuration status rendered", () => {
    //
    //         cy.navigateToApplicationsList(true, false);
    //
    //         remoteFetchConfigurationPage.getApplicationRemoteFetchStatus().should("be.visible");
    //     });
    //
    //     it("ITC_3.2.3 - Remote configuration status rendered", () => {
    //
    //         remoteFetchConfigurationPage.clickRemoteFetchTrigger();
    //
    //         remoteFetchConfigurationPage.getApplicationRemoteFetchSuccess().should("be.visible");
    //     });
    // });

    // This test case only fails during the product build time, but passes when it run locally.
    // Therefore skipping this test temporally until we find the cause for this failure.
    // context("ITC-3.4.0 - [remote-configuration] - Remove remote configuration.", () => {
    //
    //     it("ITC_3.4.1 - Save remote configurations details", () => {
    //
    //         cy.navigateToRemoteFetchPage(true, false);
    //     });
    //
    //     // This test case only fails during the product build time, but passes when it run locally.
    //     // Therefore skipping this test temporally until we find the cause for this failure.
    //     it.skip("ITC_3.4.2 - After navigate to remote configuration page, click add remote configuration.", () => {
    //
    //         remoteFetchConfigurationPage.clickRemoveConfiguration();
    //         remoteFetchConfigurationPage.getConfigRemoveModal().should("be.visible");
    //         remoteFetchConfigurationPage.getConfigRemoveModalAssertInput().type("ApplicationConfigurationRepository");
    //         remoteFetchConfigurationPage.clickRemoveConfigurationConfirm();
    //     });
    //
    // });

});
