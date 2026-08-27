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

import { useMemo } from "react";
import { FapiProfile } from "../models/fapi-security-policy";

/**
 * Grant types disallowed by both FAPI 1.0 Advanced and FAPI 2.0 Security Profile.
 *
 * FAPI 1.0 Advanced (https://openid.net/specs/openid-financial-api-part-2-1_0.html):
 *   §5.2.2 — "shall not allow the resource owner password credentials grant type"
 *   §5.2.2 — "shall not support the implicit grant type"
 *
 * FAPI 2.0 Security Profile (https://openid.net/specs/fapi-security-profile-2_0.html):
 *   §5.3.2.2 — "shall only support response_type value code", making implicit and ROPC
 *   incompatible with the required authorization code flow.
 */
const FAPI_DISABLED_GRANT_TYPES: string[] = ["implicit", "password"];

/**
 * Constraints returned by `useFapiProfileConstraints`.
 * Each flag describes a restriction that must be applied to the protocol form.
 */
export interface FapiProfileConstraintsInterface {
    /**
     * Grant types that must be disabled in the grant type selector.
     * Empty when no profile is selected.
     */
    disabledGrantTypes: string[];
    /**
     * Whether PKCE must be enforced as mandatory.
     * FAPI 1.0 §5.2.2.2, FAPI 2.0 §5.3.2.2.5 — PKCE with S256 required.
     */
    isPKCEMandatory: boolean;
    /**
     * Whether the plain PKCE transform algorithm must be disallowed.
     * FAPI 1.0 §5.2.2.2, FAPI 2.0 §5.3.2.2.5 — only S256 allowed.
     */
    isPlainPKCEDisallowed: boolean;
    /**
     * Whether Pushed Authorization Requests (PAR) must be required.
     * FAPI 1.0 §5.2.3.1, FAPI 2.0 §5.3.2.2.2–3 — PAR is mandatory.
     */
    isPARRequired: boolean;
    /**
     * Whether the Hybrid Flow section must be disabled entirely.
     * FAPI 2.0 §5.3.2.2.1 only — only `response_type=code` is permitted.
     * FAPI 1.0 Advanced allows hybrid flow (response_type=code id_token).
     */
    isHybridFlowDisabled: boolean;
    /**
     * Whether refresh token renewal (rotation) must be locked to OFF.
     * FAPI 2.0 §5.3.2.1.9 — refresh token rotation is not allowed.
     */
    isRefreshTokenRenewalDisabled: boolean;
    /**
     * Whether re-use of the same private_key_jwt must be locked to OFF.
     * FAPI 1.0 §5.2.2.2, FAPI 2.0 §5.3.2.1.6 — each token request must use a unique JWT.
     */
    isPrivateKeyJwtReuseDisabled: boolean;
    /**
     * The subset of token binding types the user is permitted to select.
     * `null` means no constraint (no FAPI profile selected — all binding types available).
     * A single-element array means binding is locked to that type (read-only in the UI).
     * A multi-element array means the binding field is editable but restricted to those values.
     * FAPI 1.0 Advanced locks to certificate; FAPI 2.0 allows both certificate (MTLS) and DPoP.
     */
    allowedBindingTypes: string[] | null;
}

const NO_CONSTRAINTS: FapiProfileConstraintsInterface = {
    allowedBindingTypes: null,
    disabledGrantTypes: [],
    isHybridFlowDisabled: false,
    isPARRequired: false,
    isPKCEMandatory: false,
    isPlainPKCEDisallowed: false,
    isPrivateKeyJwtReuseDisabled: false,
    isRefreshTokenRenewalDisabled: false
};

/**
 * Constraints for FAPI 1.0 Advanced profile.
 *
 * Specification: Financial-grade API Security Profile 1.0 – Part 2: Advanced
 * https://openid.net/specs/openid-financial-api-part-2-1_0.html
 */
const FAPI1_ADVANCED_CONSTRAINTS: FapiProfileConstraintsInterface = {
    /**
     * FAPI 1.0 Advanced §5.2.2 (Authorization server):
     *   "5. shall only issue sender-constrained access tokens;"
     *   "6. shall support MTLS as mechanism for constraining the legitimate senders of access tokens;"
     *
     * See: https://openid.net/specs/openid-financial-api-part-2-1_0.html#authorization-server
     */
    allowedBindingTypes: ["certificate"],

    /**
     * FAPI 1.0 Advanced §5.2.2 (Authorization server):
     *   "2. shall require 
     *      1. the response_type value code id_token, or 
     *      2. the response_type value code in conjunction with the response_mode value jwt;"
     *
     * See: https://openid.net/specs/openid-financial-api-part-2-1_0.html#authorization-server
     */
    disabledGrantTypes: FAPI_DISABLED_GRANT_TYPES,

    /**
     * FAPI 1.0 Advanced §5.2.2 (Authorization server):
     *   "2. shall require 
     *      1. the response_type value code id_token"
     *
     * The `code id_token` requirement explicitly permits (and dictates) the use of the Hybrid Flow.
     *
     * See: https://openid.net/specs/openid-financial-api-part-2-1_0.html#authorization-server
     */
    isHybridFlowDisabled: false,

    /**
     * FAPI 1.0 Advanced §5.2.2 (Authorization server):
     *   "11. may support the pushed authorization request endpoint as described in PAR;"
     *
     * See: https://openid.net/specs/openid-financial-api-part-2-1_0.html#authorization-server
     */
    isPARRequired: false,

    /**
     * FAPI 1.0 Advanced §5.2.2 (Authorization server):
     *   "The authorization server shall support the provisions specified in clause 5.2.2 of 
     *   Financial-grade API Security Profile 1.0 - Part 1: Baseline, with the exception that 
     *   Section 5.2.2-7 (enforcement of RFC7636) is not required."
     *
     * Because FAPI 1.0 Advanced explicitly exempts the baseline requirement for PKCE (RFC7636), 
     * it is strictly optional by default unless PAR is used.
     *
     * See: https://openid.net/specs/openid-financial-api-part-2-1_0.html#authorization-server
     */
    isPKCEMandatory: false,

    /**
     * FAPI 1.0 Advanced §5.2.2 (Authorization server):
     *   "18. shall require PAR requests, if supported, to use PKCE ( RFC7636) with S256 as the 
     *   code challenge method."
     * 
     * FAPI 1.0 Baseline §5.2.2 (Authorization server) also dictates:
     *   "7. shall require RFC7636 with S256 as the code challenge method;"
     *
     * If PKCE is utilized, only the "S256" transformation is permitted. The "plain" transform 
     * is disallowed.
     *
     * See: https://openid.net/specs/openid-financial-api-part-2-1_0.html#authorization-server
     */
    isPlainPKCEDisallowed: true,

    /**
     * FAPI 1.0 Advanced §5.2.2 (Authorization server) mandates authentication using:
     *   "14. shall authenticate the confidential client using one of the following methods: ... 
     *   private_key_jwt as specified in section 9 of OIDC;"
     *
     * OpenID Connect Core 1.0 §9 (Client Authentication) for private_key_jwt:
     *   "jti REQUIRED. JWT ID. A unique identifier for the token, which can be used to prevent 
     *   reuse of the token. These tokens MUST only be used once"
     * 
     * Permitting reuse would allow replay attacks on token requests.
     *
     * See: https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication
     */
    isPrivateKeyJwtReuseDisabled: true,

    /**
     * FAPI 1.0 Baseline §5.2.2 (Authorization server):
     *   "NOTE: The use of refresh tokens instead of long-lived access tokens for both public 
     *   and confidential clients is recommended."
     *
     * See: https://openid.net/specs/openid-financial-api-part-1-1_0.html#authorization-server
     */
    isRefreshTokenRenewalDisabled: false
};

/**
 * Constraints for FAPI 2.0 Security Profile.
 *
 * Specification: FAPI 2.0 Security Profile
 * https://openid.net/specs/fapi-security-profile-2_0.html
 */
const FAPI2_SECURITY_CONSTRAINTS: FapiProfileConstraintsInterface = {
    /**
     * FAPI 2.0 Security Profile §5.3.2.1 (General requirements):
     *   "4. shall only issue sender-constrained access tokens;"
     *   "5. shall use one of the following methods for sender-constrained access tokens: 
     *      * MTLS as described in [RFC8705], 
     *      * DPoP as described in [RFC9449];"
     * 
     * See: https://openid.net/specs/fapi-security-profile-2_0.html
     */
    allowedBindingTypes: ["certificate", "DPoP"],

    /**
     * FAPI 2.0 Security Profile §5.3.2.1 (General requirements):
     *   "2. shall reject requests using the resource owner password credentials grant;"
     *
     * FAPI 2.0 Security Profile §5.3.2.2 (Authorization endpoint flows):
     *   "1. shall require the value of response_type described in [RFC6749] to be code;"
     * 
     * The Resource Owner Password Credentials grant is explicitly banned. By mandating 
     * only the `code` response type, implicit grants are also incompatible.
     *
     * See: https://openid.net/specs/fapi-security-profile-2_0.html
     */
    disabledGrantTypes: FAPI_DISABLED_GRANT_TYPES,

    /**
     * FAPI 2.0 Security Profile §5.3.2.2 (Authorization endpoint flows):
     *   "1. shall require the value of response_type described in [RFC6749] to be code;"
     *
     * By strictly mandating `code`, hybrid flows (which require response types such 
     * as `code id_token`) are not permitted.
     *
     * See: https://openid.net/specs/fapi-security-profile-2_0.html
     */
    isHybridFlowDisabled: true,

    /**
     * FAPI 2.0 Security Profile §5.3.2.2 (Authorization endpoint flows):
     *   "2. shall support client-authenticated pushed authorization requests according to [RFC9126];"
     *   "3. shall reject authorization requests sent without [RFC9126];"
     *
     * All authorization requests must be submitted via the PAR endpoint before the redirect.
     *
     * See: https://openid.net/specs/fapi-security-profile-2_0.html
     */
    isPARRequired: true,

    /**
     * FAPI 2.0 Security Profile §5.3.2.2 (Authorization endpoint flows):
     *   "5. shall require PKCE [RFC7636] with S256 as the code challenge method;"
     *
     * See: https://openid.net/specs/fapi-security-profile-2_0.html
     */
    isPKCEMandatory: true,

    /**
     * FAPI 2.0 Security Profile §5.3.2.2 (Authorization endpoint flows):
     *   "5. shall require PKCE [RFC7636] with S256 as the code challenge method;"
     *
     * Because only S256 is permitted, the plain transform is implicitly disallowed.
     *
     * See: https://openid.net/specs/fapi-security-profile-2_0.html
     */
    isPlainPKCEDisallowed: true,

    /**
     * FAPI 2.0 Security Profile §5.3.2.1 (General requirements) mandates authentication using:
     *   "6. shall authenticate clients using one of the following methods: ... 
     *       private_key_jwt as specified in Section 9 of [OIDC];"
     *
     * OpenID Connect Core 1.0 §9 (Client Authentication) for private_key_jwt:
     *   "jti REQUIRED. JWT ID. A unique identifier for the token, which can be used to prevent 
     *   reuse of the token. These tokens MUST only be used once"
     *
     * Each private_key_jwt used at the token endpoint must carry a unique jti to prevent replay attacks.
     *
     * See: https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication
     */
    isPrivateKeyJwtReuseDisabled: true,

    /**
     * FAPI 2.0 Security Profile §5.3.2.1 (General requirements):
     *   "9. shall not use refresh token rotation except in extraordinary circumstances (see Note 1 below);"
     * 
     * NOTE 1: 
     *   "This specification prohibits the use of refresh token rotation for security 
     *   reasons as it causes user experience degradation and operational issues whenever 
     *   the client fails to store or receive the new refresh token and has no option to retry."
     *
     * See: https://openid.net/specs/fapi-security-profile-2_0.html
     */
    isRefreshTokenRenewalDisabled: true
};

/**
 * Returns FAPI protocol constraints for the given FAPI profile.
 *
 * - Returns `NO_CONSTRAINTS` when `profile` is `null` (no FAPI profile selected).
 * - Returns FAPI 1 Advanced constraints when `"FAPI1_ADVANCED"` is selected.
 * - Returns FAPI 2 Security constraints when `"FAPI2_SECURITY"` is selected.
 *
 * @param profile - The currently selected FAPI profile, or `null` for none.
 * @returns A `FapiProfileConstraintsInterface` object describing what must be locked.
 */
const useFapiProfileConstraints = (profile: FapiProfile | null): FapiProfileConstraintsInterface => {
    const constraints: FapiProfileConstraintsInterface = useMemo((): FapiProfileConstraintsInterface => {
        if (profile === "FAPI1_ADVANCED") {
            return FAPI1_ADVANCED_CONSTRAINTS;
        }

        if (profile === "FAPI2_SECURITY") {
            return FAPI2_SECURITY_CONSTRAINTS;
        }

        return NO_CONSTRAINTS;
    }, [profile]);

    return constraints;
};

export default useFapiProfileConstraints;
