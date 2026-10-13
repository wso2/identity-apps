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

import { act, fireEvent, render, screen } from "@wso2is/unit-testing/utils";
import React, { ReactElement } from "react";
import "@testing-library/jest-dom";
import { AdvanceAttributeSettings } from "./advance-attribute-settings";
import { State } from "../../../models/application-inbound";

vi.mock("@wso2is/admin.application-templates.v1/components/application-tab-components-filter", () => ({
    ApplicationTabComponentsFilter: ({ children }: { children: React.ReactNode }) => children
}));

const USER_ID: string = "http://wso2.org/claims/userid";
const USERNAME: string = "http://wso2.org/claims/username";
const CHECKBOX_TEST_ID: string = "application-advanced-attribute-settings-form-reassign-subject-attribute-checkbox";
const DROPDOWN_TEST_ID: string = "application-advanced-attribute-settings-form-subject-attribute-dropdown";
const INCLUDE_USER_DOMAIN_TEST_ID: string = "application-edit-user-attributes-include-user-domain";
const INCLUDE_ORGANIZATION_NAME_TEST_ID: string = "application-edit-user-attributes-include-tenant-domain";

/**
 * Renders the component for an application whose configured subject attribute and default subject attribute are the
 * given local claim URIs.
 */
const buildElement = (
    subjectAttribute: string,
    defaultSubjectAttribute: string,
    onlyOIDCConfigured: boolean = true,
    dropDownOptions: { key: string; text: ReactElement; value: string }[] = [
        {
            key: "username",
            text: <p>username</p>,
            value: "http://wso2.org/claims/username"
        }
    ],
    extraProps: Record<string, unknown> = {}
): ReactElement => {
    return (
        <AdvanceAttributeSettings
            dropDownOptions={ dropDownOptions }
            defaultSubjectOption={ {
                key: defaultSubjectAttribute,
                text: <p>{ defaultSubjectAttribute.split("/").pop() }</p>,
                value: defaultSubjectAttribute
            } }
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
                    claim: { uri: subjectAttribute },
                    includeTenantDomain: false,
                    includeUserDomain: false,
                    mappedLocalSubjectMandatory: false,
                    useMappedLocalSubject: false
                }
            } }
            setSubmissionValues={ jest.fn() }
            setSelectedValue={ jest.fn() }
            defaultSubjectAttribute={ defaultSubjectAttribute }
            initialRole={ {
                claim: {
                    uri: "http://wso2.org/claims/role"
                },
                includeUserDomain: true,
                mappings: []
            } }
            initialSubject={ {
                claim: { uri: subjectAttribute },
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
            onlyOIDCConfigured={ onlyOIDCConfigured }
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
            { ...extraProps }
        />
    );
};

const renderWithSubject = (
    subjectAttribute: string,
    defaultSubjectAttribute: string,
    onlyOIDCConfigured: boolean = true,
    dropDownOptions?: { key: string; text: ReactElement; value: string }[],
    extraProps: Record<string, unknown> = {}
): ReturnType<typeof render> => {
    return render(buildElement(subjectAttribute, defaultSubjectAttribute, onlyOIDCConfigured, dropDownOptions,
        extraProps));
};

describe("Advance attribute settings in the attributes tab of Application Edit view works as expected", () => {
    it("Subject attribute dropdown shows the default disabled until the alternate checkbox is ticked", () => {
        renderWithSubject(USER_ID, USER_ID);

        const altSubjectAttributeSelectionCheckbox: HTMLElement = screen.getByTestId(CHECKBOX_TEST_ID);

        expect(altSubjectAttributeSelectionCheckbox.querySelector("input")).not.toBeChecked();
        expect(screen.getByTestId(DROPDOWN_TEST_ID)).toHaveClass("disabled");
        expect(screen.getByTestId(DROPDOWN_TEST_ID).textContent).toContain("userid");

        fireEvent.click(altSubjectAttributeSelectionCheckbox);

        const altSubjectAttributeDropdown: HTMLElement = screen.getByTestId(DROPDOWN_TEST_ID);

        expect(altSubjectAttributeDropdown).toBeInTheDocument();
        expect(altSubjectAttributeDropdown).not.toHaveClass("disabled");
    });

    it("Subject attribute equal to the application's default is shown as the default, not as an alternate", () => {
        renderWithSubject(USERNAME, USERNAME);

        expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).not.toBeChecked();
        expect(screen.getByTestId(DROPDOWN_TEST_ID)).toHaveClass("disabled");
        expect(screen.getByTestId(DROPDOWN_TEST_ID).textContent).toContain("username");
        expect(document.body.textContent).toMatch(/instead of the\s*username/);
    });

    it("Subject attribute different from the application's default is shown as an alternate", () => {
        renderWithSubject(USERNAME, USER_ID);

        expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).toBeChecked();
        expect(screen.getByTestId(DROPDOWN_TEST_ID)).not.toHaveClass("disabled");
        expect(document.body.textContent).toMatch(/instead of the\s*userid/);
    });

    it("Alternate subject attribute checkbox is rendered for applications that are not OIDC only", () => {
        renderWithSubject(USERNAME, USERNAME, false);

        expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).not.toBeChecked();
        expect(screen.getByTestId(DROPDOWN_TEST_ID)).toHaveClass("disabled");
    });

    it("Subject attribute whose mapping is removed falls back to the default", () => {
        const ADDRESSES: string = "http://wso2.org/claims/addresses";
        const COUNTRY: string = "http://wso2.org/claims/country";
        const addressesOption: { key: string; text: ReactElement; value: string } = {
            key: ADDRESSES,
            text: <p>addresses</p>,
            value: ADDRESSES
        };
        const countryOption: { key: string; text: ReactElement; value: string } = {
            key: COUNTRY,
            text: <p>country</p>,
            value: COUNTRY
        };

        // Attribute name mapping on, the stored subject is the mapped attribute addresses.
        const { rerender } = renderWithSubject(ADDRESSES, USER_ID, false, [ addressesOption, countryOption ],
            { claimMappingOn: true, isStoredSubjectMappingRemoved: false });

        expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).toBeChecked();
        expect(screen.getByTestId(DROPDOWN_TEST_ID)).not.toHaveClass("disabled");

        // The addresses row is removed from the table while a mapped row remains.
        rerender(buildElement(ADDRESSES, USER_ID, false, [ countryOption ],
            { claimMappingOn: true, isStoredSubjectMappingRemoved: true, removedSubjectMapping: ADDRESSES }));

        expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).not.toBeChecked();
        expect(screen.getByTestId(DROPDOWN_TEST_ID)).toHaveClass("disabled");
        expect(screen.getByTestId(DROPDOWN_TEST_ID).textContent).toContain("userid");
    });

    it("Subject attribute whose last row is removed falls back to the default although the local list offers it",
        () => {
            const ADDRESSES: string = "http://wso2.org/claims/addresses";
            const addressesOption: { key: string; text: ReactElement; value: string } = {
                key: ADDRESSES,
                text: <p>addresses</p>,
                value: ADDRESSES
            };

            const { rerender } = renderWithSubject(ADDRESSES, USER_ID, false, [ addressesOption ],
                { claimMappingOn: true, isStoredSubjectMappingRemoved: false });

            expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).toBeChecked();

            // The only row is removed: mapping is no longer in effect and the local attributes, addresses among
            // them, are offered. The confirmed removal still sends the selection back to the default.
            rerender(buildElement(ADDRESSES, USER_ID, false, [ addressesOption ],
                { claimMappingOn: false, isStoredSubjectMappingRemoved: true, removedSubjectMapping: ADDRESSES }));

            expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).not.toBeChecked();
            expect(screen.getByTestId(DROPDOWN_TEST_ID)).toHaveClass("disabled");

            // The parent clears the record once the subject has moved on; the user may assign the attribute again.
            rerender(buildElement(ADDRESSES, USER_ID, false, [ addressesOption ],
                { claimMappingOn: false, isStoredSubjectMappingRemoved: true }));
            fireEvent.click(screen.getByTestId(CHECKBOX_TEST_ID));
            fireEvent.click(screen.getByTestId(DROPDOWN_TEST_ID).querySelector(".item"));

            expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).toBeChecked();
            expect(screen.getByTestId(DROPDOWN_TEST_ID).textContent).toContain("addresses");
        });

    it("Subject attribute whose mapped name is gone falls back to the default once mapping is no longer in effect",
        () => {
            const MAIL: string = "mail";
            const mailOption: { key: string; text: ReactElement; value: string } = {
                key: "http://wso2.org/claims/emailaddress",
                text: <p>mail</p>,
                value: MAIL
            };
            const countryOption: { key: string; text: ReactElement; value: string } = {
                key: "http://wso2.org/claims/country",
                text: <p>country</p>,
                value: "http://wso2.org/claims/country"
            };

            // Attribute name mapping in effect, the stored subject is the mapped name mail.
            const { rerender } = renderWithSubject(MAIL, USER_ID, false, [ mailOption, countryOption ],
                { claimMappingOn: true, isStoredSubjectMappingRemoved: false });

            expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).toBeChecked();

            // The last mapped row is removed: mapping is no longer in effect and the local attributes are offered.
            rerender(buildElement(MAIL, USER_ID, false, [ countryOption ],
                { claimMappingOn: false, isStoredSubjectMappingRemoved: true }));

            expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).not.toBeChecked();
            expect(screen.getByTestId(DROPDOWN_TEST_ID)).toHaveClass("disabled");
            expect(screen.getByTestId(DROPDOWN_TEST_ID).textContent).toContain("userid");
        });

    it("Alternate subject attribute dropdown search matches the attribute display name and URI", () => {
        // Stands in for the list item the options render, which carries the attribute's display name and URI.
        const SubjectAttributeOption = (props: { displayName: string; claimURI: string }): ReactElement => (
            <span>{ props.displayName }</span>
        );

        renderWithSubject(USER_ID, USER_ID, true, [
            {
                key: "email",
                text: (
                    <SubjectAttributeOption
                        displayName="Email"
                        claimURI="http://wso2.org/claims/emailaddress"
                    />
                ),
                value: "http://wso2.org/claims/emailaddress"
            },
            {
                key: "mobile",
                text: <SubjectAttributeOption displayName="Mobile" claimURI="http://wso2.org/claims/mobile" />,
                value: "http://wso2.org/claims/mobile"
            },
            {
                key: "username",
                text: <SubjectAttributeOption displayName="Username" claimURI={ USERNAME } />,
                value: USERNAME
            }
        ]);

        fireEvent.click(screen.getByTestId(CHECKBOX_TEST_ID));

        const altSubjectAttributeDropdown: HTMLElement = screen.getByTestId(DROPDOWN_TEST_ID);
        const searchInput: Element = altSubjectAttributeDropdown.querySelector("input.search");

        expect(searchInput).toBeInTheDocument();
        expect(altSubjectAttributeDropdown.querySelectorAll(".item")).toHaveLength(3);

        fireEvent.change(searchInput, { target: { value: "mob" } });

        expect(altSubjectAttributeDropdown.querySelectorAll(".item")).toHaveLength(1);
        expect(altSubjectAttributeDropdown.querySelector(".item").textContent).toBe("Mobile");

        fireEvent.change(searchInput, { target: { value: "claims/EMAIL" } });

        expect(altSubjectAttributeDropdown.querySelectorAll(".item")).toHaveLength(1);
        expect(altSubjectAttributeDropdown.querySelector(".item").textContent).toBe("Email");
    });

    it("Include user domain and organization name options are offered for the user ID subject of OIDC applications",
        () => {
            renderWithSubject(USER_ID, USER_ID, true, [], {
                initialSubject: {
                    claim: { uri: USER_ID },
                    includeTenantDomain: true,
                    includeUserDomain: true,
                    mappedLocalSubjectMandatory: false,
                    useMappedLocalSubject: false
                }
            });

            expect(screen.getByTestId(CHECKBOX_TEST_ID).querySelector("input")).not.toBeChecked();
            expect(screen.getByTestId(INCLUDE_USER_DOMAIN_TEST_ID).querySelector("input")).toBeChecked();
            expect(screen.getByTestId(INCLUDE_ORGANIZATION_NAME_TEST_ID).querySelector("input")).toBeChecked();
        });

    it("Include user domain and organization name keep their values when the alternate subject is unticked",
        async () => {
            let submit: () => void;
            const setSubmissionValues: jest.Mock = jest.fn();

            renderWithSubject(USER_ID, USER_ID, true, undefined, {
                initialSubject: {
                    claim: { uri: USER_ID },
                    includeTenantDomain: true,
                    includeUserDomain: true,
                    mappedLocalSubjectMandatory: false,
                    useMappedLocalSubject: false
                },
                setSubmissionValues,
                triggerSubmission: (submitFunction: () => void) => {
                    submit = submitFunction;
                }
            });

            fireEvent.click(screen.getByTestId(CHECKBOX_TEST_ID));
            fireEvent.click(screen.getByTestId(CHECKBOX_TEST_ID));

            await act(async () => {
                submit();
            });

            expect(setSubmissionValues).toHaveBeenCalledWith(expect.objectContaining({
                isSubjectClaimExplicit: false,
                subject: expect.objectContaining({
                    claim: USER_ID,
                    includeTenantDomain: true,
                    includeUserDomain: true
                })
            }));
        });
});
