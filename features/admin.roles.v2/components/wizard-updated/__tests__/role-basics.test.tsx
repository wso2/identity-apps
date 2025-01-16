/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { fireEvent, render, screen, within } from "@wso2is/unit-testing/utils";
import React from "react";
import { RoleBasics } from "../role-basics";

jest.mock("@wso2is/admin.applications.v1/api/application", () => ({
    useApplicationList: () => ({
        data: {
            applications: [
                {
                    "access": "WRITE",
                    "advancedConfigurations": {
                        "fragment": false
                    },
                    "associatedRoles": {
                        "allowedAudience": "ORGANIZATION"
                    },
                    "clientId": "QRCkHOhBpRHHpNR21Xr5WzGJmBsa",
                    "id": "2a2014c0-1a81-400c-91e3-034a443b31ef",
                    "name": "Test App",
                    "realm": "",
                    "self": "/t/testorg/api/server/v1/applications/2a2014c0-1a81-400c-91e3-034a443b31ef"
                }
            ]
        },
        isLoading: false
    })
}));

describe("Create Role Wizard works as expected", () => {
    test("Clicking on \"Change the audience\" link of application option in the assigned " +
        "application dropdown navigates to the roles tab of the application", async () => {

        render(
            <RoleBasics
                initialValues={ {} }
                triggerSubmission={ jest.fn() }
                onSubmit={ jest.fn() }
                setIsNextDisabled={ jest.fn() }
            />
        );

        const autocomplete: HTMLElement = screen.getByTestId("add-role-basics-form-typography-font-family-dropdown");
        const input: HTMLElement = within(autocomplete).getByRole("textbox");

        autocomplete.focus();

        fireEvent.change(input, { target: { value: "Test App" } });
        fireEvent.keyDown(autocomplete, { key: "ArrowDown" });

        const changeAudienceBtn: HTMLElement = screen.getByTestId("add-role-basics-form-link-navigate-roles");

        fireEvent.click(changeAudienceBtn);

        // Check if the navigation happened to the target page
        expect(window.location.pathname).toBe("/t/testorg/app/applications/2a2014c0-1a81-400c-91e3-034a443b31ef");
        expect(window.location.search).toBe("?isRoles=true");
    });
});
