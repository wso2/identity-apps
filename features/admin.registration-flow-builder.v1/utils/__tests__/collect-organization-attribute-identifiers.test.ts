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

import { Node } from "@xyflow/react";
import { AttributeType } from "../../models/attributes";
import collectOrganizationAttributeIdentifiers from "../collect-organization-attribute-identifiers";

describe("collectOrganizationAttributeIdentifiers", () => {
    it("collects nested organization fields and removes duplicates across steps", () => {
        const nodes: Node[] = [
            {
                data: {
                    components: [
                        {
                            components: [
                                {
                                    config: {
                                        identifier: "organizationName",
                                        identifierType: AttributeType.Organization
                                    }
                                },
                                {
                                    components: [
                                        {
                                            config: {
                                                identifier: "businessType",
                                                identifierType: AttributeType.Organization
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                id: "first-step",
                position: { x: 0, y: 0 }
            },
            {
                data: {
                    components: [
                        { config: { identifier: "businessType", identifierType: AttributeType.Organization } },
                        { config: { identifier: "taxId", identifierType: AttributeType.Organization } }
                    ]
                },
                id: "second-step",
                position: { x: 0, y: 0 }
            }
        ];

        expect(collectOrganizationAttributeIdentifiers(nodes))
            .toEqual([ "organizationName", "businessType", "taxId" ]);
    });

    it("ignores user fields, missing identifiers, and components without configuration", () => {
        const nodes: Node[] = [ {
            data: {
                components: [
                    { config: { identifier: "email", identifierType: AttributeType.User } },
                    { config: { identifier: "", identifierType: AttributeType.Organization } },
                    { config: { identifierType: AttributeType.Organization } },
                    {}
                ]
            },
            id: "step",
            position: { x: 0, y: 0 }
        } ];

        expect(collectOrganizationAttributeIdentifiers(nodes)).toEqual([]);
    });

    it("handles empty flows and steps without components", () => {
        expect(collectOrganizationAttributeIdentifiers([])).toEqual([]);
        expect(collectOrganizationAttributeIdentifiers([ {
            data: {},
            id: "end",
            position: { x: 0, y: 0 }
        } ])).toEqual([]);
    });
});
