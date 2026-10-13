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
    SubjectMappingEntryInterface,
    isClaimMappingInEffect,
    isStoredSubjectMappingRemoved,
    isStoredSubjectServerMapping
} from "./subject-mapping-utils";
import { ClaimConfigurationInterface } from "../../../models/application";

const EMAIL: string = "http://wso2.org/claims/emailaddress";
const COUNTRY: string = "http://wso2.org/claims/country";
const USER_ID: string = "http://wso2.org/claims/userid";

const customApp = (subject: string, mappings: [string, string][]): ClaimConfigurationInterface => ({
    claimMappings: mappings.map(([ applicationClaim, uri ]: [string, string]) => ({
        applicationClaim,
        localClaim: { uri }
    })),
    dialect: "CUSTOM",
    requestedClaims: [],
    subject: { claim: { uri: subject } }
} as ClaimConfigurationInterface);

const localApp = (subject: string, requested: string[]): ClaimConfigurationInterface => ({
    claimMappings: requested.map((uri: string) => ({ applicationClaim: uri, localClaim: { uri } })),
    dialect: "LOCAL",
    requestedClaims: requested.map((uri: string) => ({ claim: { uri }, mandatory: false })),
    subject: { claim: { uri: subject } }
} as ClaimConfigurationInterface);

const mapped = (applicationClaim: string, uri: string): SubjectMappingEntryInterface =>
    ({ addMapping: true, applicationClaim, localClaim: { uri } });

describe("Subject attribute rules of the attribute name mapping view", () => {
    it("mapping is in effect only with the toggle on and a mapped row", () => {
        expect(isClaimMappingInEffect(true, [ mapped("mail", EMAIL) ], [ EMAIL ])).toBe(true);
        expect(isClaimMappingInEffect(false, [ mapped("mail", EMAIL) ], [ EMAIL ])).toBe(false);
        expect(isClaimMappingInEffect(true, [], [])).toBe(false);
        // An entry without a row (the implicit identity mapping of the user id) does not count.
        expect(isClaimMappingInEffect(true, [ mapped(USER_ID, USER_ID) ], [ COUNTRY ])).toBe(false);
        // Entries of the local dialect view are not mapped.
        expect(isClaimMappingInEffect(true, [ { addMapping: false, applicationClaim: "", localClaim: { uri: EMAIL } } ],
            [ EMAIL ])).toBe(false);
        // A mapping of an attribute the Console cannot list has no row but still counts.
        expect(isClaimMappingInEffect(true, [ mapped("locked", "http://wso2.org/claims/identity/accountLocked") ], [],
            [ EMAIL, COUNTRY ])).toBe(true);
        expect(isClaimMappingInEffect(true, [ mapped(USER_ID, USER_ID) ], [ COUNTRY ], [ EMAIL, COUNTRY, USER_ID ]))
            .toBe(false);
    });

    it("only a custom dialect application has a mapped subject name on the server", () => {
        expect(isStoredSubjectServerMapping(customApp("mail", [ [ "mail", EMAIL ] ]), true)).toBe(true);
        expect(isStoredSubjectServerMapping(customApp(USER_ID, [ [ "mail", EMAIL ] ]), true)).toBe(false);
        // The identity mappings the server reports for a local dialect application mirror its requested attributes.
        expect(isStoredSubjectServerMapping(localApp(EMAIL, [ EMAIL ]), true)).toBe(false);
        // The OpenID Connect scope view has no mapping state.
        expect(isStoredSubjectServerMapping(customApp("mail", [ [ "mail", EMAIL ] ]), false)).toBe(false);
    });

    it("the stored mapped subject name is gone once its mapping is not in effect or not mapped any more", () => {
        const app: ClaimConfigurationInterface = customApp("mail", [ [ "mail", EMAIL ], [ COUNTRY, COUNTRY ] ]);
        const entries: SubjectMappingEntryInterface[] = [ mapped("mail", EMAIL), mapped(COUNTRY, COUNTRY) ];

        expect(isStoredSubjectMappingRemoved(app, entries, true, true)).toBe(false);
        // The row of the subject was removed.
        expect(isStoredSubjectMappingRemoved(app, entries.slice(1), true, true)).toBe(true);
        // Attribute name mapping switched off.
        expect(isStoredSubjectMappingRemoved(app, entries, false, true)).toBe(true);
        // A local dialect application never relies on a mapped name.
        expect(isStoredSubjectMappingRemoved(localApp(EMAIL, [ EMAIL ]), [], false, true)).toBe(false);
    });
});
