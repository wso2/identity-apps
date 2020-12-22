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

import { ApplicationManagementConstants } from "../constants";

/**
 * Utility class for adaptive script operations.
 */
export class AdaptiveScriptUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    public static getDefaultScript(): string[] {
        return ApplicationManagementConstants.DEFAULT_ADAPTIVE_AUTH_SCRIPT;
    }

    /**
     * Generates a script based on the number of steps.
     *
     * @param {number} stepCount - No of steps.
     * @return {string[]} Auth script.
     */
    public static generateScript(stepCount: number): string[] {
        // TODO: Beautify JS doesn't work when there are code comments. Therefore, wont work with the templates.
        // Remove the spaces once the above issue is fixed in the code editor component.
        const newStepIdentifier = "    executeStep(:index);";
        const steps: string[] = [];

        for (let i = 1; i < stepCount; i++) {
            steps.push(newStepIdentifier.replace(":index", i.toString()));
        }

        const script = [ ...ApplicationManagementConstants.DEFAULT_ADAPTIVE_AUTH_SCRIPT ];
        script.splice(1, 0, ...steps);
        return script;
    }
}
