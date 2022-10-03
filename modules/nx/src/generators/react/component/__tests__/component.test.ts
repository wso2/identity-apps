/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { Tree, logger } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { createApp } from "../../../../../test-configs/utils";
import componentGenerator from "../component";
import { Schema } from "../schema";

describe("nx React component generator", () => {

    let appTree: Tree;
    let projectName: string;

    beforeEach(async () => {
        appTree = createTreeWithEmptyWorkspace();
        projectName = "myaccount";

        await createApp(appTree, projectName, false);

        jest.spyOn(logger, "warn").mockImplementation(() => {});
        jest.spyOn(logger, "debug").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should generate files", async () => {
        const options: Schema = {
            directory: "components",
            name: "label",
            project: projectName,
            style: "None"
        };

        await componentGenerator(appTree, options);

        expect(appTree.exists(`apps/${ projectName }/src/components/label/label.tsx`)).toBeTruthy();
        expect(appTree.exists(`apps/${ projectName }/src/components/label/__tests__/label.test.tsx`)).toBeTruthy();
        expect(appTree.exists(`apps/${ projectName }/src/components/label/__tests__/__mocks__/label-permissions.ts`));
    });
});
