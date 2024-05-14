/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import React from "react";
import "@testing-library/jest-dom";
import { fullPermissions } from "./__mocks__/permissions";
import { render, screen } from "../../../../test-configs/utils";
import AdaptiveAuthTemplateChangeConfirmationModal, {
    AdaptiveAuthTemplateChangeConfirmationModalPropsInterface
} from "../adaptive-auth-template-change-confimation-modal";

describe.skip("AdaptiveAuthTemplateChangeConfirmationModal", () => {
    /* eslint-disable max-len, sort-keys */
    const defaultProps: AdaptiveAuthTemplateChangeConfirmationModalPropsInterface = {
        selectedTemplate: {
            summary:
                "Allows to log in to application if the user's age is over the configured value. User's age is calculated using the user's date of birth attribute.",
            preRequisites: [
                "Change the parameters at the top of the script as needed to match the requirements.",
                "Modify the authentication option(s) from defaults as required.",
                "Birth Date of the user trying to login needs to be updated using the Asgardeo myaccount portal."
            ],
            code: [
                "// This script will only allow login to application if the user's age is over configured value",
                "// The user will be redirected to an error page if the date of birth is not present or user is below configured value",
                "",
                "var ageLimit = 18;",
                "",
                "// Error page to redirect unauthorized users,",
                "// can be either an absolute url or relative url to server root, or empty/null",
                "// null/empty value will redirect to the default error page",
                "var errorPage = '';",
                "",
                "// Additional query params to be added to the above url.",
                "// Hint: Use i18n keys for error messages",
                "var errorPageParameters = {",
                " 'status': 'Unauthorized',",
                " 'statusMsg': 'You need to be over ' + ageLimit + ' years to login to this application.'",
                "};",
                "",
                "// Date of birth attribute at the client side",
                "var dateOfBirthClaim = 'http://wso2.org/claims/dob';",
                "",
                "// The validator function for DOB. Default validation check if the DOB is in YYYY-MM-dd format",
                "var validateDOB = function (dob) {",
                " return dob.match(/^(\\\\d{4})-(\\\\d{2})-(\\\\d{2})$/);",
                "};",
                "",
                "var onLoginRequest = function(context) {",
                " executeStep(1, {",
                " onSuccess: function (context) {",
                " var underAge = true;",
                " // Extracting user store domain of authenticated subject from the first step",
                " var dob = context.currentKnownSubject.localClaims[dateOfBirthClaim];",
                " Log.debug('DOB of user ' + context.currentKnownSubject.uniqueId + ' is : ' + dob);",
                " if (dob && validateDOB(dob)) {",
                " var birthDate = new Date(dob);",
                " if (getAge(birthDate) >= ageLimit) {",
                " underAge = false;",
                " }",
                " }",
                " if (underAge === true) {",
                " Log.debug('User ' + context.currentKnownSubject.uniqueId + ' is under aged. Hence denied to login.');",
                " sendError(errorPage, errorPageParameters);",
                " }",
                " }",
                " });",
                "};",
                "",
                "var getAge = function(birthDate) {",
                " var today = new Date();",
                " var age = today.getFullYear() - birthDate.getFullYear();",
                " var m = today.getMonth() - birthDate.getMonth();",
                " if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {",
                " age--;",
                " }",
                " return age;",
                "};"
            ],
            defaultStepsDescription: {
                "Step 1": "Username & Password"
            },
            parametersDescription: {
                ageLimit: "Minimum age required for the user to log in to the application",
                errorPage: "Error page to redirect the user if the age limit is below ageLimit",
                errorPageParameters: "Parameters to be passed to the error page"
            },
            name: "User-Age-Based",
            defaultAuthenticators: {
                "1": {
                    federated: [],
                    local: [ "BasicAuthenticator" ]
                }
            },
            category: "access_control",
            title: "Control access based on user age",
            authenticationSteps: 1,
            helpLink: ""
        },
        onTemplateChange: jest.fn(),
        onELKConfigureClick: jest.fn()
        // Need to pass `open` prop to keep the modal open during test, but for some reason
        // TypeScript doesn't allow adding this prop here.
        // open: true
    };
    /* eslint-enable max-len */

    it("renders the AdaptiveAuthTemplateChangeConfirmationModal component", () => {
        render(<AdaptiveAuthTemplateChangeConfirmationModal { ...defaultProps } />, { allowedScopes: fullPermissions });

        const adaptiveAuthTemplateChangeConfirmationModal: Element = screen.getByTestId(
            "adaptive-auth-template-change-confirmation-modal"
        );

        expect(adaptiveAuthTemplateChangeConfirmationModal).toBeInTheDocument();
    });
});
