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

import { EmptyComponent } from "@wso2is/unit-testing/__mocks__/empty-component";
import { fireEvent, render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
import { AdvanceAttributeSettings } from "./advance-attribute-settings";
import { State } from "../../../models/application-inbound";

jest.mock("@wso2is/admin.application-templates.v1/components/application-tab-components-filter", () => ({
    ApplicationTabComponentsFilter: EmptyComponent
}));

describe("Advance attribute settings in the attributes tab of Application Edit view works as expected", () => {
    it("Alternate subject attribute dropdown is displayed on checking Alternate subject attribute checkbox", () => {


        render(
            <AdvanceAttributeSettings
                dropDownOptions={ [
                    {
                        key: "username",
                        text: <p>username</p>,
                        value: "http://wso2.org/claims/username"
                    }
                ] }
                triggerSubmission={ jest.fn() }
                claimConfigurations={ {
                    claimMappings: [
                        {
                            applicationClaim: "http://wso2.org/claims/username",
                            localClaim: {
                                uri: "http://wso2.org/claims/username"
                            }
                        }
                    ],
                    dialect: "LOCAL",
                    requestedClaims: [
                        {
                            claim: {
                                uri: "http://wso2.org/claims/username"
                            },
                            mandatory: false
                        }
                    ],
                    role: {
                        claim: {
                            uri: "http://wso2.org/claims/role"
                        },
                        includeUserDomain: true,
                        mappings: []
                    },
                    subject: {
                        claim: { uri: "http://wso2.org/claims/userid" },
                        includeTenantDomain: false,
                        includeUserDomain: false,
                        mappedLocalSubjectMandatory: false,
                        useMappedLocalSubject: false
                    }
                } }
                setSubmissionValues={ jest.fn() }
                setSelectedValue={ jest.fn() }
                defaultSubjectAttribute={ "http://wso2.org/claims/userid" }
                initialRole={ {
                    claim: {
                        uri: "http://wso2.org/claims/role"
                    },
                    includeUserDomain: true,
                    mappings: []
                } }
                initialSubject={ {
                    claim: { uri: "http://wso2.org/claims/userid" },
                    includeTenantDomain: false,
                    includeUserDomain: false,
                    mappedLocalSubjectMandatory: false,
                    useMappedLocalSubject: false
                } }
                claimMappingOn={ false }
                readOnly={ false }
                technology={ [
                    {
                        self:
                            "/t/testorg/api/server/v1/applications/117acd1d-4250-4cda-9aaf-fc4c93aff957/" +
                            "inbound-protocols/oidc",
                        type: "oauth2"

                    }
                ] }
                applicationTemplateId={ "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7" }
                onlyOIDCConfigured
                oidcInitialValues={ {
                    accessToken: {
                        applicationAccessTokenExpiryInSeconds: 3600,
                        bindingType: "sso-session",
                        revokeTokensWhenIDPSessionTerminated: true,
                        type: "Default",
                        userAccessTokenExpiryInSeconds: 3600,
                        validateTokenBinding: false
                    },
                    allowedOrigins: [ "https://localhost:3000", "https://example.com" ],
                    callbackURLs: [ "regexp=(https://example.com|https://localhost:3000)" ],
                    clientAuthentication: { tokenEndpointAllowReusePvtKeyJwt: false },
                    clientId: "0Fo7kLavZtHAVtXRr1zzpjwzeBMa",
                    clientSecret: "EY35GF_H9KSqOc6zhUd_h6bO_xBlkVnAU5FKCdOeXT4a",
                    grantTypes: [ "authorization_code", "refresh_token" ],
                    hybridFlow: { enable: false },
                    idToken: {
                        audience: [],
                        encryption: { algorithm: "", enabled: false,  method: "" },
                        expiryInSeconds: 3600
                    },
                    isFAPIApplication: false,
                    logout: {},
                    pkce: { mandatory: true, supportPlainTransformAlgorithm: false },
                    publicClient: true,
                    pushAuthorizationRequest: { requirePushAuthorizationRequest: false },
                    refreshToken: { expiryInSeconds: 86400, renewRefreshToken: true },
                    requestObject: { encryption: { algorithm: "", method: "" } },
                    scopeValidators: [],
                    state: State.ACTIVE,
                    subject: { subjectType: "public" },
                    subjectToken: {
                        applicationSubjectTokenExpiryInSeconds: 180,
                        enable: false
                    },
                    validateRequestObjectSignature: false
                } }
                data-testid={ "advanced-attribute-settings-form" }
            />
        );

        const altSubjectAttributeSelectionCheckbox: HTMLElement =
            screen.getByTestId("application-advanced-attribute-settings-form-reassign-subject-attribute-checkbox");

        fireEvent.click(altSubjectAttributeSelectionCheckbox);

        const altSubjectAttributeDropdown: HTMLElement =
            screen.getByTestId("application-advanced-attribute-settings-form-subject-attribute-dropdown");

        expect(altSubjectAttributeDropdown).toBeInTheDocument();
    });
});
