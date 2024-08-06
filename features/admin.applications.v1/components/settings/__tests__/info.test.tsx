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

/* eslint-env jest */

import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
import { Info } from "../info";

describe("Info tab of Application Edit view renders as expected", () => {
    it("MTLS server endpoints section is hidden for M2M applications", () => {
        render(<Info
            appId="e45ec497-e694-49e5-8d0f-fe2cd6de4694"
            inboundProtocols={ [
                {
                    "self": "/t/testorg/api/server/v1/applications/" +
                        "e45ec497-e694-49e5-8d0f-fe2cd6de4694/inbound-protocols/oidc",
                    "type": "oauth2"
                }
            ] }
            isOIDCConfigLoading={ false }
            isSAMLConfigLoading={ false }
            templateId="m2m-application"
            data-componentid="application-edit-server-endpoints"
        />);

        const mtlsConfigurationSection: HTMLElement | null
            = screen?.queryByTestId("applications-help-panel-mtls-oidc-configs");

        expect(mtlsConfigurationSection).toBeNull();
    });
});
