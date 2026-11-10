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

import { describe, expect, it } from "vitest";
import { ContextTreeNodeMetadataInterface, NodeType, TreeNodeStateInterface } from "../models";
import { buildAccessConfig, findNode, mapMetadataToStateWithAccessConfig } from "../utils";

const REGISTRATION_ONLY: string[] = [ "REGISTRATION" ];

const leaf = (key: string, path: string): ContextTreeNodeMetadataInterface => ({
    allowedOperations: [ "EXPOSE" ],
    applicableFlowTypes: REGISTRATION_ONLY,
    dataType: "String",
    key,
    nodeType: NodeType.LEAF,
    path,
    readOnly: true,
    title: key
});

const subjectOrganization: ContextTreeNodeMetadataInterface = {
    allowedOperations: [ "EXPOSE" ],
    applicableFlowTypes: REGISTRATION_ONLY,
    children: [
        leaf("id", "/subjectOrganization/id"),
        {
            allowedOperations: [ "EXPOSE" ],
            applicableFlowTypes: REGISTRATION_ONLY,
            children: [ leaf("industry", "/subjectOrganization/attributes[name=industry]") ],
            dataType: "Map<String, String>",
            dynamicEntryAllowed: false,
            key: "attributes",
            nodeType: NodeType.MAP,
            path: "/subjectOrganization/attributes",
            readOnly: true,
            title: "Attributes"
        }
    ],
    dataType: "",
    key: "subjectOrganization",
    nodeType: NodeType.OBJECT,
    path: "/subjectOrganization/",
    readOnly: true,
    title: "Subject Organization"
};

describe("subject organization in the access config tree", () => {
    it("restores the saved fields and keeps their paths when saved again", () => {
        const tree: TreeNodeStateInterface[] = mapMetadataToStateWithAccessConfig([ subjectOrganization ], {
            expose: [
                { encrypted: false, flowType: "REGISTRATION", path: "/subjectOrganization/id" },
                { encrypted: true, flowType: "REGISTRATION", path: "/subjectOrganization/attributes[name=industry]" }
            ],
            modify: []
        });

        const industry: TreeNodeStateInterface =
            findNode(tree, "node:/subjectOrganization/attributes[name=industry]");

        expect(industry.exposed).toBe(true);
        expect(industry.exposeEncrypted).toBe(true);
        expect(industry.applicableFlowTypes).toEqual(REGISTRATION_ONLY);
        expect(buildAccessConfig(tree)).toEqual({
            expose: [
                { encrypted: false, flowType: "REGISTRATION", path: "/subjectOrganization/id" },
                { encrypted: true, flowType: "REGISTRATION", path: "/subjectOrganization/attributes[name=industry]" }
            ],
            modify: []
        });
    });

    it("lists a saved attribute the flow no longer collects as removable", () => {
        const tree: TreeNodeStateInterface[] = mapMetadataToStateWithAccessConfig([ subjectOrganization ], {
            expose: [
                { encrypted: false, flowType: "REGISTRATION", path: "/subjectOrganization/attributes[name=size]" }
            ],
            modify: []
        });

        const size: TreeNodeStateInterface = findNode(tree, "synth:/subjectOrganization/attributes[name=size]");

        expect(size.title).toBe("size");
        expect(size.notInFlow).toBe(true);
        expect(size.canDelete).toBe(true);
        expect(size.exposed).toBe(true);
        expect(size.allowedOperations).toEqual([ "EXPOSE" ]);
        expect(buildAccessConfig(tree).expose).toEqual([
            { encrypted: false, flowType: "REGISTRATION", path: "/subjectOrganization/attributes[name=size]" }
        ]);
    });

    it("saves an entry stored without a flow type with the registration flow type", () => {
        const tree: TreeNodeStateInterface[] = mapMetadataToStateWithAccessConfig([ subjectOrganization ], {
            expose: [ { encrypted: false, path: "/subjectOrganization/id" } ],
            modify: []
        });

        expect(buildAccessConfig(tree).expose).toEqual([
            { encrypted: false, flowType: "REGISTRATION", path: "/subjectOrganization/id" }
        ]);
    });
});
