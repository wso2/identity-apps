/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import useGetAllLocalClaims from "@wso2is/admin.claims.v1/api/use-get-all-local-claims";
import VisualFlowConstants from "@wso2is/admin.flow-builder-core.v1/constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { Element, InputVariants } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { EventTypes } from "@wso2is/admin.flow-builder-core.v1/models/extension";
import { Resource } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import { TemplateTypes } from "@wso2is/admin.flow-builder-core.v1/models/templates";
import PluginRegistry from "@wso2is/admin.flow-builder-core.v1/plugins/plugin-registry";
import { Claim } from "@wso2is/core/models";
import cloneDeep from "lodash-es/cloneDeep";
import { useEffect } from "react";

const EMAIL_CLAIM_URI: string = "http://wso2.org/claims/emailaddress";
const FIRST_NAME_CLAIM_URI: string = "http://wso2.org/claims/givenname";
const LAST_NAME_CLAIM_URI: string = "http://wso2.org/claims/lastname";

const EXCLUDED_CLAIMS: string[] = [
    EMAIL_CLAIM_URI,
    FIRST_NAME_CLAIM_URI,
    LAST_NAME_CLAIM_URI,
    "http://wso2.org/claims/challengeQuestionUris",
    "http://wso2.org/claims/challengeQuestion1",
    "http://wso2.org/claims/challengeQuestion2",
    "http://wso2.org/claims/groups",
    "http://wso2.org/claims/role",
    "http://wso2.org/claims/url",
    "http://wso2.org/claims/emailAddresses",
    "http://wso2.org/claims/verifiedEmailAddresses",
    "http://wso2.org/claims/mobileNumbers",
    "http://wso2.org/claims/verifiedMobileNumbers"
];

const FIELD: Element = {
    category: "FIELD",
    config: {
        hint: "",
        identifier: "",
        label: "",
        placeholder: "",
        required: false,
        type: ""
    },
    id: "{{ID}}",
    type: "INPUT",
    variant: ""
} as Element;

/**
 * Hook to handle default flow for registration flow builder.
 */
const useDefaultFlow = (): void => {

    const { metadata } = useAuthenticationFlowBuilderCore();
    const { data: claims } = useGetAllLocalClaims({
        "exclude-hidden-claims": true,
        "exclude-identity-claims": true,
        filter: null,
        limit: null,
        offset: null,
        profile: metadata?.attributeProfile,
        sort: null
    }, !!metadata?.attributeProfile);

    /**
     * Resolve the input variant based on the claim URI.
     *
     * @param claimUri - The claim URI to resolve the variant for.
     * @returns The resolved input variant.
     */
    const resolveVariant = (claimUri: string): string => {
        switch (claimUri) {
            case EMAIL_CLAIM_URI:
                return InputVariants.Email;
            default:
                return InputVariants.Text;
        }
    };

    /**
     * Resolve the input type based on the claim URI.
     * @param claimUri - The claim URI to resolve the type for.
     * @returns The resolved input type.
     */
    const resolveInputType = (claimUri: string): string => {
        switch (claimUri) {
            case EMAIL_CLAIM_URI:
                return "email";
            default:
                return "text";
        }
    };

    /**
     * Build the placeholder text for the input field based on the display name.
     *
     * @param displayName - The display name of the claim.
     * @returns The built placeholder text.
     */
    const buildPlaceholderText = (displayName: string): string => {

        return displayName ? `Enter your ${displayName.toLowerCase()}` : "Enter value";
    };

    /**
     * Build a field element from a claim.
     *
     * @param claim - The claim to build the field from.
     * @returns The built field element.
     */
    const buildFieldFromClaim = (claim: Claim): Element => {
        const field: Element = cloneDeep(FIELD);

        field.config.label = claim.displayName;
        field.config.placeholder = buildPlaceholderText(claim.displayName);
        field.config.required = claim.required;
        field.config.type = resolveInputType(claim.claimURI);
        field.config.identifier = claim.claimURI;
        field.variant = resolveVariant(claim.claimURI);

        return field;
    };

    useEffect(() => {
        generateProfileAttributes[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "generateProfileAttributes";

        PluginRegistry.getInstance().registerSync(EventTypes.ON_TEMPLATE_LOAD, generateProfileAttributes);

        return () => {
            PluginRegistry.getInstance().unregister(EventTypes.ON_TEMPLATE_LOAD,
                generateProfileAttributes[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
        };
    }, []);

    /**
     * Generate profile attributes for the given resource.
     *
     * @param resource - The resource to generate profile attributes for.
     * @returns True.
     */
    const generateProfileAttributes = (resource: Resource): boolean => {
        if (resource.type === TemplateTypes.Basic) {
            const formComponents: Element[] = resource.data.steps[0].data.components;

            const emailClaim: Claim = claims?.find((claim: Claim) => claim.claimURI === EMAIL_CLAIM_URI);
            const firstNameClaim: Claim = claims?.find((claim: Claim) => claim.claimURI === FIRST_NAME_CLAIM_URI);
            const lastNameClaim: Claim = claims?.find((claim: Claim) => claim.claimURI === LAST_NAME_CLAIM_URI);

            if (emailClaim) {
                const field: Element = buildFieldFromClaim(emailClaim);

                formComponents.splice(0, 0, field);
            }

            if (firstNameClaim) {
                const field: Element = buildFieldFromClaim(firstNameClaim);

                formComponents.push(field);
            }

            if (lastNameClaim) {
                const field: Element = buildFieldFromClaim(lastNameClaim);

                formComponents.push(field);
            }

            claims?.forEach((claim: Claim) => {
                if (EXCLUDED_CLAIMS.includes(claim.claimURI)) {
                    return;
                }

                const field: Element = buildFieldFromClaim(claim);

                formComponents.push(field);
            });
        }

        return true;
    };
};

export default useDefaultFlow;
