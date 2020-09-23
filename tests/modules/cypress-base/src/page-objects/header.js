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
exports.Header = void 0;
var constants_1 = require("../constants");
/// <reference types="cypress" />
/// <reference path="../commands/index.d.ts" />
var Header = /** @class */ (function () {
    function Header() {
    }
    Header.prototype.getUserAvatar = function () {
        return cy.dataTestId(constants_1.HeaderDomConstants.AVATAR_ICON_DATA_ATTR);
    };
    Header.prototype.getLogoutButton = function () {
        return cy.dataTestId(constants_1.HeaderDomConstants.LOGOUT_BUTTON_DATA_ATTR);
    };
    return Header;
}());
exports.Header = Header;
