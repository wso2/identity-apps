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
exports.LoginPage = void 0;
var header_1 = require("./header");
var constants_1 = require("../constants");
/**
 * Class containing Login Page objects.
 */
var LoginPage = /** @class */ (function () {
    /**
     * Generates a Login Page objects instance.
     * @constructor
     */
    function LoginPage() {
        this.header = new header_1.Header();
    }
    LoginPage.prototype.getLoginUsernameInputField = function () {
        return cy.get(constants_1.LoginPageDomConstants.USERNAME_INPUT_DATA_ATTR);
    };
    ;
    LoginPage.prototype.getLoginPasswordInputField = function () {
        return cy.get(constants_1.LoginPageDomConstants.PASSWORD_INPUT_DATA_ATTR);
    };
    ;
    LoginPage.prototype.getLoginFormSubmitButton = function () {
        return cy.get(constants_1.LoginPageDomConstants.CONTINUE_BUTTON_DATA_ATTR);
    };
    ;
    LoginPage.prototype.clickOnLogoutButton = function () {
        this.header.getLogoutButton().click();
    };
    ;
    return LoginPage;
}());
exports.LoginPage = LoginPage;
