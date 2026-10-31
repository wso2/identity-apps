/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { PublishedFlowInterface } from "../../../models/published-flow";
import { extractOrganizationAttributes } from "../organization-attributes";

describe("extractOrganizationAttributes", () => {
    it("collects nested custom fields and keeps the first label for each key", () => {
        const flow: PublishedFlowInterface = {
            steps: [
                { data: { components: [ { components: [
                    { config: { identifier: "businessType", identifierType: "ORGANIZATION", label: "Business Type" } },
                    { components: [ { config: { identifier: "taxId", identifierType: "ORGANIZATION" } } ] }
                ] } ] } },
                { data: { components: [ {
                    config: { identifier: "businessType", identifierType: "ORGANIZATION", label: "Other label" }
                } ] } }
            ]
        };

        expect(extractOrganizationAttributes(flow)).toEqual([
            { key: "businessType", label: "Business Type" },
            { key: "taxId", label: "taxId" }
        ]);
    });

    it("excludes core fields, user fields, and invalid path keys", () => {
        const flow: PublishedFlowInterface = {
            steps: [ { data: { components: [
                { config: { identifier: "organizationName", identifierType: "ORGANIZATION" } },
                { config: { identifier: "organizationHandle", identifierType: "ORGANIZATION" } },
                { config: { identifier: "organizationDescription", identifierType: "ORGANIZATION" } },
                { config: { identifier: "email", identifierType: "USER" } },
                { config: { identifier: "invalid/key", identifierType: "ORGANIZATION" } },
                { config: { identifier: "1invalid", identifierType: "ORGANIZATION" } },
                { config: { identifier: "", identifierType: "ORGANIZATION" } },
                {}
            ] } } ]
        };

        expect(extractOrganizationAttributes(flow)).toEqual([]);
    });

    it("handles a flow without steps and steps without components", () => {
        expect(extractOrganizationAttributes({})).toEqual([]);
        expect(extractOrganizationAttributes({ steps: [ {}, { data: {} } ] })).toEqual([]);
    });
});
