/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import {
    getUserNameWithoutDomain,
    resolveUserDisplayName,
    resolveUserStoreEmbeddedUsername,
    resolveUsername,
    resolveUserstore
} from "../profile";

describe("Test resolveUserDisplayName function", () => {

    const firstName: string = "John";
    const lastName: string = "Doe";
    const fullName: string = "John Doe";
    const usernameWithoutDomain: string = "john-doe";

    test("Should return the first name as the display name when the profile information contains only the first name",
        () => {
            expect(resolveUserDisplayName({
                emails: [],
                name: {
                    familyName: "",
                    givenName: firstName
                },
                userName: ""
            })).toBe(firstName + " ");
        }
    );

    test("Should return the last name as the display name when the profile information contains only the last name",
        () => {
            expect(resolveUserDisplayName({
                emails: [],
                name: {
                    familyName: lastName,
                    givenName: ""
                },
                userName: ""
            })).toBe(lastName);
        }
    );

    test("Should return the full name as the display name when the profile information contains last and first names",
        () => {
            expect(resolveUserDisplayName({
                emails: [],
                name: {
                    familyName: lastName,
                    givenName: firstName
                },
                userName: ""
            })).toBe(fullName);
        }
    );

    test("Should return the username as the display name when the profile information contains username",
        () => {
            expect(resolveUserDisplayName({
                emails: [],
                name: {
                    familyName: "",
                    givenName: ""
                },
                userName: usernameWithoutDomain
            })).toBe(usernameWithoutDomain);
        }
    );

    test("Should return the auth state displayName when profile info doesn't contain names",
        () => {
            expect(resolveUserDisplayName({
                emails: [],
                name: {
                    familyName: "",
                    givenName: ""
                },
                userName: ""
            }, {
                displayName: fullName,
                emails: "test@company.com",
                isAuthenticated: true,
                loginInit: false,
                logoutInit: false,
                username: usernameWithoutDomain
            })).toBe(fullName);
        }
    );

    test("Should return the auth state username when auth state doesn't contain displayName",
        () => {
            expect(resolveUserDisplayName({
                emails: [],
                name: {
                    familyName: "",
                    givenName: ""
                },
                userName: ""
            }, {
                displayName: "",
                emails: "test@company.com",
                isAuthenticated: true,
                loginInit: false,
                logoutInit: false,
                username: usernameWithoutDomain
            })).toBe(usernameWithoutDomain);
        }
    );

    test("Should return the fallback value when auth state doesn't contain name",
        () => {
            expect(resolveUserDisplayName({
                emails: [],
                name: {
                    familyName: "",
                    givenName: ""
                },
                userName: ""
            }, {
                displayName: "",
                emails: "test@company.com",
                isAuthenticated: true,
                loginInit: false,
                logoutInit: false,
                username: ""
            },
            fullName)).toBe(fullName);
        }
    );
});

describe("Test resolveUsername function", () => {

    const usernameWithoutDomain: string = "john-doe";
    const tenantDomain: string = "WSO2.ORG";
    const primaryDomain: string = "CARBON.SUPER";

    test("Should return the username without domain",
        () => {
            expect(resolveUsername(usernameWithoutDomain, primaryDomain, primaryDomain)).toBe(usernameWithoutDomain);
        }
    );

    test("Should return the username with domain",
        () => {
            expect(resolveUsername(usernameWithoutDomain, tenantDomain, primaryDomain))
                .toBe(`${tenantDomain}/${usernameWithoutDomain}`);
        }
    );
});

describe("Test resolveUserStoreEmbeddedUsername function", () => {

    const usernameWithoutDomain: string = "john-doe";
    const primaryDomain: string = "CARBON.SUPER";
    const usernameWithDomain: string = `WSO2.ORG/${usernameWithoutDomain}`;
    const usernameWithPrimaryDomain: string = `${primaryDomain}/${usernameWithoutDomain}`;

    test("Should return the username without domain",
        () => {
            expect(resolveUserStoreEmbeddedUsername(usernameWithoutDomain, primaryDomain)).toBe(usernameWithoutDomain);
        }
    );

    test("Should return the username without domain when the domain is primary",
        () => {
            expect(resolveUserStoreEmbeddedUsername(usernameWithPrimaryDomain, primaryDomain))
                .toBe(usernameWithoutDomain);
        }
    );

    test("Should return the username with domain",
        () => {
            expect(resolveUserStoreEmbeddedUsername(usernameWithDomain, primaryDomain))
                .toBe(usernameWithDomain);
        }
    );
});

describe("Test getUserNameWithoutDomain function", () => {

    const usernameWithoutDomain: string = "john-doe";
    const usernameWithDomain: string = `WSO2.ORG/${usernameWithoutDomain}`;

    test("Should return the username without domain when the username doesn't contain the domain",
        () => {
            expect(getUserNameWithoutDomain(usernameWithoutDomain)).toBe(usernameWithoutDomain);
        }
    );

    test("Should return the username without domain when the username contains the domain",
        () => {
            expect(getUserNameWithoutDomain(usernameWithDomain)).toBe(usernameWithoutDomain);
        }
    );
});

describe("Test resolveUserstore function", () => {

    const usernameWithoutDomain: string = "john-doe";
    const tenantDomain: string = "WSO2.ORG";
    const primaryDomain: string = "CARBON.SUPER";
    const usernameWithDomain: string = `${tenantDomain}/${usernameWithoutDomain}`;

    test("Should return the primary domain when the username doesn't contain the domain",
        () => {
            expect(resolveUserstore(usernameWithoutDomain, primaryDomain)).toBe(primaryDomain);
        }
    );

    test("Should return the domain when the username contains the domain",
        () => {
            expect(resolveUserstore(usernameWithDomain, primaryDomain)).toBe(tenantDomain);
        }
    );
});
