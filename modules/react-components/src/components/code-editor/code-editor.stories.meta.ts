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

import { StoryCategories } from "../../storybook-helpers/hierarchy";
import { StoryMetaInterface } from "../../storybook-helpers/models";

export const meta: StoryMetaInterface = {
    components: [ "CodeEditor" ],
    description: "Component to edit/show code snippets",
    stories: [
        {
            description: "Default Javascript code editor.",
            title: "Default Javascript Editor"
        },
        {
            description: "Code editor with Javascript linting",
            title: "Editor With Javascript Linting"
        },
        {
            description: "Read-only code editor.",
            title: "Read-only Editor"
        },
        {
            description: "Smart code editor with auto-completion, bracket matching etc. Press Ctrl+Space to get " +
                "suggestions.",
            title: "Smart Editor"
        },
        {
            description: "Code editor for JSON.",
            title: "JSON Editor"
        },
        {
            description: "Code editor for Typescript.",
            title: "Typescript Editor"
        },
        {
            description: "Code editor themes demo.",
            title: "Themes"
        }
    ],
    title: StoryCategories.COMPONENTS + "/Code Editor"
};

export const SampleJSCodeSnippet = [
    "// This script will assign the below Office365 specific role to any user if not already assigned",
    "var roleToBeAssigned = ['office365Role'];", "", "var onLoginRequest = function(context) {", "    " +
    "executeStep(1, {", "        onSuccess: function (context) {",
    "            // Extracting authenticated subject from the first step", "            var user =" +
    " context.currentKnownSubject;", "            // Checking if the user is already assigned to the " +
    "given Office365 specific role", "            var hasRole = hasAnyOfTheRoles(user, roleToBeAssigned);" +
    "", "            if (!hasRole) {", "                Log.info('Assigning role: ' + " +
    "roleToBeAssigned.toString() + ' for the user:' + user.username);", "                " +
    "assignUserRoles(user, roleToBeAssigned);", "            }", "        }", "    });", "};"
];

export const SampleJSONSnippet = `{
    "analytics_based": {
        "displayName": "Analytics",
        "templates": [{
            "summary": "Define conditional authentication by risk score value calculated from analytics engine.",
            "helpLink": "https://docs.wso2.com/display/IS570/Configuring+Risk-Based+Adaptive+Authentication",
            "defaultStepsDescription": {
                "Step 1": "Basic (Password) authenticator",
                "Step 2": "TOTP authenticator"
            },
            "parametersDescription": {
                "siddhiApplication": "Name of the Siddhi application in the Stream processor",
                "siddhiInputStream": "Name of the input stream in the above Siddhi application"
            },
            "name": "Risk-Based",
            "defaultAuthenticators": {
                "1": {
                    "federated": [],
                    "local": ["BasicAuthenticator"]
                },
                "2": {
                    "federated": [],
                    "local": ["totp"]
                }
            },
            "category": "analytics_based",
            "title": "Risk-Based 2FA Template",
            "authenticationSteps": 2
        }],
        "icon": "./images/analytics-template.png",
        "order": 4
    }
}`;

export const SampleTSCodeSnippet = `
/**
 * Utility class for encode decode operations.
 */
export class EncodeDecodeUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() { }

    /**
     * Decodes a regex URL which and returns the individual URLs as
     * an array.
     *
     * @param {string} raw - Raw URL.
     * @param {string} separator - Characters to use in separating the string.
     * @return {string[]} An array of URLs.
     */
    public static decodeURLRegex(raw: string, separator: string = ","): string[] {
        if (!this.isRegexURL(raw)) {
            return raw.split(separator);
        }

        const rawURLs = raw.replace("regexp=(", "").replace(")", "");

        return rawURLs.split("|");
    }
}
`;
