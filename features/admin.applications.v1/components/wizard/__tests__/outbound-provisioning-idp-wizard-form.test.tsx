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

/* eslint-env vitest */

import { fireEvent, render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
import { OutboundProvisioningWizardIdpForm } from "../outbound-provisioining-idp-wizard-form";

vi.mock("@wso2is/admin.connections.v1/api/connections", () => ({
    getConnectionDetails: vi.fn(() => new Promise(() => undefined))
}));

vi.mock("@wso2is/admin.core.v1/hooks/use-ui-configs", () => ({
    default: () => ({ UIConfig: {} })
}));

describe("Outbound provisioning IDP form of the Application Edit view", () => {
    it("keeps the saved IDP name when updated before the IDP list has loaded", () => {
        const onSubmit: ReturnType<typeof vi.fn> = vi.fn();

        render(
            <OutboundProvisioningWizardIdpForm
                initialValues={ {
                    blocking: false,
                    connector: "SCIM2",
                    idp: "Test_Provisioning_Connection",
                    jit: true,
                    rules: false
                } }
                idpList={ undefined }
                isEdit={ true }
                triggerSubmit={ null }
                onSubmit={ onSubmit }
                data-componentid="provisioning-form"
            />
        );

        fireEvent.click(screen.getByTestId("provisioning-form-submit-button"));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
            connector: "SCIM2",
            idp: "Test_Provisioning_Connection"
        });
    });
});
