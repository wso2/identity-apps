"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="cypress" />
var cypress_base_1 = require("@wso2is-testing/cypress-base");
var USERNAME = Cypress.env("TENANT_USERNAME");
var PASSWORD = Cypress.env("TENANT_PASSWORD");
var SERVER_URL = Cypress.env("SERVER_URL");
var PORTAL = Cypress.env("CONSOLE_BASE_URL");
describe("ITC-001-[email-templates]-User can visit the email templates page.", function () {
    beforeEach(function () {
        cy.login(USERNAME, PASSWORD, SERVER_URL, PORTAL);
        cypress_base_1.CookieUtils.preserveAllSessionCookies();
    });
    before(function () {
        cypress_base_1.HousekeepingUtils.performCleanUpTasks();
    });
    it("CDS_1.1 - User login and navigation in the develop section", function () {
        cy.login(USERNAME, PASSWORD, SERVER_URL, PORTAL);
    });
});
