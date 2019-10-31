/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 */

import React from "react";
import { render } from "../../../../helpers/test-utils";
import { Validation } from "../../../../models";
import { FormWrapper } from "../form-wrapper";

describe("Tests if the FormWrapper is working fine", () => {

    test("Test if the textbox works fine", () => {
        const { getByLabelText } = render(
            <FormWrapper
                formFields={ [
                    {
                        label: "Text Box",
                        name: "textBox",
                        placeholder: "textbox",
                        required: true,
                        requiredErrorMessage: "Required",
                        type: "text",
                        validation: (value: string, validation: Validation) => {
                            if (value !== "validate") {
                                validation.isValid = false;
                                validation.errorMessages.push(
                                    "Validation failed"
                                );
                            }
                        },
                        value: "Sample text",
                        width: 15
                    },
                    {
                        type: "submit",
                        value: "Submit",
                    }
                ] }
                onSubmit={ (value) => undefined }
            />
        );

    });
});
