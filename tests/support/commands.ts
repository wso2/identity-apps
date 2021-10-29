/*
 *Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *WSO2 Inc. licenses this file to you under the Apache License,
 *Version 2.0 (the "License"); you may not use this file except
 *in compliance with the License.
 *You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.0
 *
 *Unless required by applicable law or agreed to in writing,
 *software distributed under the License is distributed on an
 *"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *KIND, either express or implied.  See the License for the
 *specific language governing permissions and limitations
 *under the License.
 */

/// <reference types="cypress" />

/**
 * Custom command to used to validate if an element is present or not.
 *
 * @param {Element | any} element - Element to check.
 * @param {number} waitTime - Configure wait time.
 * @returns {Cypress.CanReturnChainable}
 */
Cypress.Commands.add("checkIfElementExists", (element: Element | any,
                                              waitTime: number = 3000): Cypress.Chainable<boolean> => {
    return cy.get("body")
        .find(element)
        .its("length")
        .then((response) => {
            if (response > 0) {
                cy.get(element).select("100").wait(waitTime);
                return true;
            }

            return false;
        });
});

/**
 * This method is used to iterate through children elements.
 */
Cypress.Commands.add("recursiveEachChild", ($element) => {

    $element.children().each(function () {
        const $currentElement = $(this);
        // Loop children
        // recursiveEach($currentElement);
    });
});

/**
 * This method is used to validate the URL is valid.
 */
Cypress.Commands.add("isUrlValid", (userInput: string): Promise<boolean> => {
    const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return Promise.resolve(pattern.test(userInput));
});

/**
 * This method use to generate user data
 * Return, testdata
 * @param  {} "CreateUsersData"
 * @param  {} ScenarioNo
 * @param  {} noUsers
 */
Cypress.Commands.add("CreateUsersData", (ScenarioNo: number | string, noUsers: number): Promise<any> => {

    const testData: { users: any[] } = {
        users: []
    };

    if (noUsers > 0) {
        for (let i = 1; i <= noUsers; i++) {
            testData.users.push({});
            testData.users[ i - 1 ][ "userName" ] = "Testuser_" + ScenarioNo + "_" + i;
            testData.users[ i - 1 ][ "password" ] = "TestUserwso2_" + ScenarioNo + "_" + i;
            testData.users[ i - 1 ][ "familyName" ] = "TestUserFamilyname_" + ScenarioNo + "_" + i;
            testData.users[ i - 1 ][ "givenName" ] = "TestUserGivenname_" + ScenarioNo + "_" + i;
            testData.users[ i - 1 ][ "primaryEmailValue" ] = "TesterprimEmail_" + ScenarioNo + "_" + i;
            testData.users[ i - 1 ][ "primaryEmailType" ] = "home";
            testData.users[ i - 1 ][ "secondaryEmailValue" ] = "TestersecEmail_" + ScenarioNo + "_" + i;
            testData.users[ i - 1 ][ "secondaryEmailType" ] = "work";
            testData.users[ i - 1 ][ "oraganization" ] = "wso2";
            testData.users[ i - 1 ][ "homePhoneNumber" ] = "+94112233440";
            testData.users[ i - 1 ][ "im" ] = "TestIM";
            testData.users[ i - 1 ][ "country" ] = "Sri Lanka";
            testData.users[ i - 1 ][ "mobileNumber" ] = "94777000777";
        }

        return Promise.resolve(testData);
    }
});

/**
 * This command use to create user from scim2.0 POST method and user body data is given by a fixture file
 * Return, response
 * @param  {} "createUserWithGivenFixtureData"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} fixturesFile
 */
Cypress.Commands.add("createUserWithGivenFixtureData", (url, authrzUserName, authrzPassword, fixturesFile,
                                                        failOnStatusCode) => {

    cy.fixture(fixturesFile).as("reqBody");

    cy.get("@reqBody")
        .then(reqBody => {
            return cy.request({
                "method": "POST",
                "url": url,
                "failOnStatusCode": failOnStatusCode,
                "auth": {
                    "username": authrzUserName,
                    "password": authrzPassword
                },
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": reqBody
            });
        });
});

/**
 * This command use to create users from scim2.0 POST method
 * Return, response
 * @param  {} "createUser"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} userInfor
 */
Cypress.Commands.add("createUser", (url, authrzUserName, authrzPassword, userInfor, failOnStatusCode) => {

    return cy.request({
        "method": "POST",
        "url": url,
        "failOnStatusCode": failOnStatusCode,
        "auth": {
            "username": authrzUserName,
            "password": authrzPassword
        },
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {
            "schemas": [],
            "name": {
                "familyName": userInfor.familyName,
                "givenName": userInfor.givenName
            },
            "userName": userInfor.userName,
            "password": userInfor.password,
            "emails": [
                {
                    "primary": true,
                    "value": userInfor.primaryEmailValue,
                    "type": userInfor.primaryEmailType
                },
                {
                    "value": userInfor.secondaryEmailValue,
                    "type": userInfor.secondaryEmailType
                }
            ]
        }
    });
});


/**
 * This command use to delete user from scim2.0 DELETE method
 * Return,response
 * @param  {} "deleteUser"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} userId
 */
Cypress.Commands.add("deleteUser", (url, authrzUserName, authrzPassword, userId, failOnStatusCode) => {

    return cy.request({
        method: "DELETE",
        url: url + userId,
        failOnStatusCode: failOnStatusCode,
        "auth": {
            "username": authrzUserName,
            "password": authrzPassword
        },
        "headers": {
            "Content-Type": "application/json"
        }
    });
});
/**
 * This commad use to filter user from scim2.0 GET method
 * Return, response
 * @param  {} "filterUser"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} paramters
 */
Cypress.Commands.add("filterUser", (url, authrzUserName, authrzPassword, paramters, failOnStatusCode) => {

    if ("id" in paramters) {
        url = url + paramters[ "id" ].id + "?";
    } else {
        url = url.slice(0, -1) + "?";
    }

    for (const x in paramters) {
        if (x === "id") {
            continue;
        }

        const value = paramters[ x ];

        for (const y in value) {
            url = url + x + "=" + value[ y ] + "&";
        }
    }

    url = url.slice(0, -1);

    cy.log(url);

    return cy.request({
        method: "GET",
        url: url,
        failOnStatusCode: failOnStatusCode,
        "auth": {
            "username": authrzUserName,
            "password": authrzPassword
        },
        "headers": {
            "Content-Type": "application/json"
        }
    });
});

/**
 * This method use to get user by user ID from SCIM2.0 GET method
 * Return, response
 * @param  {} "getUserFromUserId"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} userId
 * @param  {} failOnStatusCode
 */
Cypress.Commands.add("getUserFromUserId", (url, authrzUserName, authrzPassword, userId, failOnStatusCode) => {

    return cy.request({
        method: "GET",
        url: url + userId,
        failOnStatusCode: failOnStatusCode,
        "auth": {
            "username": authrzUserName,
            "password": authrzPassword
        },
        "headers": {
            "Content-Type": "application/json"
        }
    });
});

/**
 * This command update user from scim2.0 PATCH method
 * Return, resposne
 * @param  {} "patchUser"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} operations
 * @param  {} userId
 * @param  {} failOnStatusCode
 */
Cypress.Commands.add("patchUser", (url, authrzUserName, authrzPassword, operations, userId, failOnStatusCode) => {

    let requestBody = "\"schemas\": [\"urn:ietf:params:scim:api:messages:2.0:PatchOp\"]," + operations;

    requestBody = requestBody.slice(0, -1);
    requestBody = "{" + requestBody + "}";

    cy.log(requestBody);

    return cy.request({
        "method": "PATCH",
        "url": url + userId,
        "failOnStatusCode": failOnStatusCode,
        "auth": {
            "username": authrzUserName,
            "password": authrzPassword
        },
        "headers": {
            "Content-Type": "application/json"
        },
        "body": requestBody
    });
});

/**
 * This command use to update user from scim2.0 PUT method
 * Return, response
 * @param  {} "patchUser"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} userInfor
 * @param  {} failOnStatusCode
 */
Cypress.Commands.add("patchUser", (url, authrzUserName, authrzPassword, userInfor, failOnStatusCode) => {

    return cy.request({
        method: "PUT",
        url: url + userInfor.id,
        failOnStatusCode: failOnStatusCode,
        "auth": {
            "username": authrzUserName,
            "password": authrzPassword
        },
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {
            "schemas": [],
            "name": {
                "familyName": userInfor.familyName,
                "givenName": userInfor.givenName
            },
            "userName": userInfor.userName,
            "emails": [
                {
                    "primary": true,
                    "value": userInfor.primaryEmailValue,
                    "type": userInfor.primaryEmailType
                },
                {
                    "value": userInfor.secondaryEmailValue,
                    "type": userInfor.secondaryEmailType
                }
            ]
        }
    });
});

/**
 * This command use to update user from scim2.0 PUT method and user body data is given by a fixture file
 * Return, response
 * @param  {} "patchUserWithGivenFixtureData"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} failOnStatusCode
 * @param  {} fixturesFileData
 */
Cypress.Commands.add("patchUserWithGivenFixtureData", (url, authrzUserName, authrzPassword, userId, failOnStatusCode,
                                                       fixturesFileData) => {

    cy.fixture(fixturesFileData).as("reqBody");

    cy.get("@reqBody")
        .then(reqBody => {
            return cy.request({
                method: "PUT",
                url: url + userId,
                failOnStatusCode: failOnStatusCode,
                "auth": {
                    "username": authrzUserName,
                    "password": authrzPassword
                },
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": reqBody
            });
        });
});

/**
 * This command use to search user from sim2.0 POST method
 * Return, reponse
 * @param  {} "searchUser"
 * @param  {} (url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} searchParam
 * @param  {} failOnStatusCode
 */
Cypress.Commands.add("searchUser", (url, authrzUserName, authrzPassword, searchParam, failOnStatusCode) => {

    let requestBody = "\"schemas\": [\"urn:ietf:params:scim:api:messages:2.0:SearchRequest\"],";

    for (const x in searchParam) {
        const value = searchParam[ x ];

        for (const y in value) {
            requestBody = requestBody + x + ":" + value[ y ] + ",";
        }
    }

    requestBody = requestBody.slice(0, -1);
    requestBody = "{" + requestBody + "}";

    return cy.request({
        "method": "POST",
        "url": url,
        "failOnStatusCode": failOnStatusCode,
        "auth": {
            "username": authrzUserName,
            "password": authrzPassword
        },
        "headers": {
            "Content-Type": "application/json"
        },
        "body": requestBody
    });
});

/**
 * This method is use to create users in bulk from scim2.0 POST method
 * Return, response
 * @param  {} "createUserInBulk"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} failCount
 * @param  {} failOnStatusCode
 * @param  {} userInfor
 */
Cypress.Commands.add("createUserInBulk", (url, authrzUserName, authrzPassword, failCount, failOnStatusCode, userInfor) => {

    //Generate operations
    let operations = "[";
    let operaStr;

    const keyCount = Object.keys(userInfor.users).length;

    for (let i = 0; i < keyCount; i++) {
        cy.log(i.toString());

        const userName = userInfor.users[ i ].userName;
        const password = userInfor.users[ i ].password;
        const familyName = userInfor.users[ i ].firstName;
        const givenName = userInfor.users[ i ].givenName;
        const primaryEmailValue = userInfor.users[ i ].primaryEmailValue;
        const primaryEmailType = userInfor.users[ i ].primaryEmailType;
        const secondaryEmailValue = userInfor.users[ i ].secondaryEmailValue;
        const secondaryEmailType = userInfor.users[ i ].secondaryEmailType;
        const homePhoneNumber = userInfor.users[ i ].homePhoneNumber;
        const mobileNumber = userInfor.users [ i ].mobileNumber;

        const operationsBlock = {
            "method": "POST",
            "path": "/Users",
            "bulkId": "qwerty",
            "data": {
                "schemas": [
                    "   urn:ietf:params:scim:schemas:core:2.0:User"
                ],
                "userName": userName,
                "password": password,
                "name": {
                    "familyName": familyName,
                    "givenName": givenName
                },
                "emails": [
                    {
                        "primary": true,
                        "value": primaryEmailValue,
                        "type": primaryEmailType
                    },
                    {
                        "value": secondaryEmailValue,
                        "type": secondaryEmailType
                    }
                ],
                "phoneNumbers": [
                    {
                        "primary": true,
                        "value": homePhoneNumber,
                        "type": "home"
                    },
                    {
                        "value": mobileNumber,
                        "type": "mobile"
                    }
                ]
            }
        };

        operaStr = JSON.stringify(operationsBlock);
        operations = operations + operaStr + ",";
    }

    operations = operations.slice(0, -1);
    operations = operations + "]";

    const operationsJsonObject = JSON.parse(operations);

    return cy.request({
        "method": "POST",
        "url": url,
        "failOnStatusCode": failOnStatusCode,
        "auth": {
            "username": authrzUserName,
            "password": authrzPassword
        },
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {
            "failOnErrors": failCount,
            "schemas": [
                "urn:ietf:params:scim:api:messages:2.0:BulkRequest"
            ],
            "Operations": operationsJsonObject
        }
    });
});

/**
 * This method is use to create users in bulk from scim2.0 POST method user body data is given by a fixture file
 * Return, response
 * @param  {} "createUserInBulkWithGivenFixctureData"
 * @param  {} url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} failOnStatusCode
 * @param  {} fixturesFile
 */
Cypress.Commands.add("createUserInBulkWithGivenFixctureData", (url, authrzUserName, authrzPassword, failOnStatusCode,
                                                               fixturesFile) => {

    cy.fixture(fixturesFile).as("reqBody");
    cy.get("@reqBody").then(reqBody => {
        return cy.request({
            "method": "POST",
            "url": url,
            "failOnStatusCode": failOnStatusCode,
            "auth": {
                "username": authrzUserName,
                "password": authrzPassword
            },
            "headers": {
                "Content-Type": "application/json"
            },
            "body": reqBody
        });
    });
});

/**
 * This command use to delete users in bulk from scim2.0 DELETE method
 * Return, response
 * @param  {} "deleteUserInBulk"
 * @param  {} (url
 * @param  {} authrzUserName
 * @param  {} authrzPassword
 * @param  {} failOnStatusCode
 * @param  {} userIds
 * @param  {} failCount
 */
Cypress.Commands.add("deleteUserInBulk", (url, authrzUserName, authrzPassword, failOnStatusCode, userIds, failCount) => {

    //Generate operations
    let operations = "[";
    let operaStr;

    const keyCount = Object.keys(userIds).length;

    for (let i = 0; i < keyCount; i++) {
        const userId = userIds[ i ];
        const operationsBlock = {
            "path": "/Users/" + userId,
            "method": "DELETE"
        };

        operaStr = JSON.stringify(operationsBlock);
        operations = operations + operaStr + ",";
    }

    operations = operations.slice(0, -1);
    operations = operations + "]";

    const operationsJsonObject = JSON.parse(operations);

    return cy.request({
        "method": "POST",
        "url": url,
        "failOnStatusCode": failOnStatusCode,
        "auth": {
            "username": authrzUserName,
            "password": authrzPassword
        },
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {

            "failOnErrors": failCount,
            "schemas": [
                "urn:scim:schemas:core:1.0"
            ],
            "Operations": operationsJsonObject
        }
    });
});

let LOCAL_STORAGE_MEMORY = {};

/**
 * To prevent the clearing of the local storage.
 */
Cypress.Commands.add("saveLocalStorageCache", () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[ key ] = localStorage[ key ];
    });
});

/**
 * To prevent the clearing of the local storage.
 */
Cypress.Commands.add("restoreLocalStorageCache", () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[ key ]);
    });
});

/**
 * To clear the cache.
 */
Cypress.Commands.add("clearLocalStorageCache", () => {
    localStorage.clear();
    LOCAL_STORAGE_MEMORY = {};
});
