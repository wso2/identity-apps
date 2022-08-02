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

    /**
     * Checks if the script a default. i.e Just with execute steps.
     *
     * @param {string | string[]} script - Script to check.
     * @param {number} steps - Number of steps.
     * @return {boolean}
     */
    public static isDefaultScript(script: string | string[], steps: number): boolean {

        let scriptBody: string = ApplicationManagementConstants.EMPTY_STRING;
        const moderatedScript = Array.isArray(script)
            ? script.join(ApplicationManagementConstants.EMPTY_STRING)
            : script;
        const scriptStringContent: string[] = [];

        for(let i = 0; i < steps; i++) {
            scriptStringContent.push("executeStep(" + (i + 1) + ");");
            scriptBody += scriptStringContent[i];
        }

        const scriptComposed = ApplicationManagementConstants.DEFAULT_ADAPTIVE_AUTH_SCRIPT_HEADER
            + scriptBody
            + ApplicationManagementConstants.DEFAULT_ADAPTIVE_AUTH_SCRIPT_FOOTER;

        const userDefined = AdaptiveScriptUtils.minifyScript(moderatedScript, false);
        const defaultScript = AdaptiveScriptUtils.minifyScript(scriptComposed, false);

        return userDefined === defaultScript;
    }

    /**
     * Strips spaces and new lines in the script.
     *
     * @param {string | string[]} originalScript - Original script.
     * @param ignoreComments {boolean}
     * @return {string}
     */
    public static minifyScript(
        originalScript: string | string[],
        ignoreComments: boolean = true
    ): string {

        if (!originalScript) return ApplicationManagementConstants.EMPTY_STRING;

        const script = Array.isArray(originalScript)
            ? originalScript.join(ApplicationManagementConstants.EMPTY_STRING)
            : String(originalScript);

        /**
         * What's this?
         * This is introduced due to a edge case. `if a user erases
         * all the functional code from the editor and left it with
         * only comments` we can't just say "it's a minified script"
         *
         * Since this function is used as a `predicate` in some cases
         * we need to check for that edge case as well.
         *
         * Caveat:
         * Regex is not a lexer... but we also don't want a fat parser
         * library just to remove js comments in strings. The only con of
         * this is that we cannot guarantee that this expression will
         * remove all the comments. But for 98% percent of the time it
         * WILL match and remove.
         *
         * Sandbox Testing:
         * See in test section: https://regex101.com/r/fenP8Z/1/
         */
        const comments = /\/\*[\s\S]*?\*\/|\/\/.*/gm;

        let minimized = script;

        if (ignoreComments)
            minimized = minimized.replace(
                comments,
                ApplicationManagementConstants.EMPTY_STRING
            );

        minimized = minimized
            .replace(/(?:\r\n|\r|\n)/g, ApplicationManagementConstants.EMPTY_STRING)
            .replace(/\s/g, ApplicationManagementConstants.EMPTY_STRING)
            .trim();

        return minimized;

    }

    public static isEmptyScript(script: string | string[]): boolean {
        return !script ||
            (Array.isArray(script) && (script.length === 0 ||
                script.join(ApplicationManagementConstants.EMPTY_STRING).trim().length == 0)) ||
            (script instanceof String && script.trim().length === 0) ||
            !AdaptiveScriptUtils.minifyScript(script);
    }

    /**
     * Flat outs a given string source array.
     * @param code {string | string[]}
     */
    public static sourceToString(code: string | string[]): string {
        if (Array.isArray(code)) {
            return code.join(ApplicationManagementConstants.LINE_BREAK);
        } else {
            // In this case we can guarantee it's a string.
            return code ?? ApplicationManagementConstants.EMPTY_STRING;
        }
    }

}
