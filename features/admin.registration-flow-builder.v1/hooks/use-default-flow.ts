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

import VisualFlowConstants from "@wso2is/admin.flow-builder-core.v1/constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { Element, InputVariants } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { EventTypes } from "@wso2is/admin.flow-builder-core.v1/models/extension";
import { Resource } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import { StaticStepTypes, Step } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { TemplateTypes } from "@wso2is/admin.flow-builder-core.v1/models/templates";
import PluginRegistry from "@wso2is/admin.flow-builder-core.v1/plugins/plugin-registry";
import generateResourceId from "@wso2is/admin.flow-builder-core.v1/utils/generate-resource-id";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api/validation-config";
import { ValidationConfInterface, ValidationDataInterface } from "@wso2is/admin.validation.v1/models";
import { Claim } from "@wso2is/core/models";
import { Edge, MarkerType, Node } from "@xyflow/react";
import cloneDeep from "lodash-es/cloneDeep";
import { useCallback, useEffect, useMemo } from "react";
import useRegistrationFlowBuilder from "./use-registration-flow-builder";
import { RegistrationStaticStepTypes } from "../models/flow";

const EMAIL_CLAIM_URI: string = "http://wso2.org/claims/emailaddress";
const FIRST_NAME_CLAIM_URI: string = "http://wso2.org/claims/givenname";
const LAST_NAME_CLAIM_URI: string = "http://wso2.org/claims/lastname";
const USERNAME_CLAIM_URI: string = "http://wso2.org/claims/username";
const USERNAME_FIELD: string = "username";
const ALPHANUMERIC_VALIDATOR: string = "AlphanumericValidator";

const EXCLUDED_CLAIMS: string[] = [
    EMAIL_CLAIM_URI,
    FIRST_NAME_CLAIM_URI,
    LAST_NAME_CLAIM_URI,
    "http://wso2.org/claims/challengeQuestionUris",
    "http://wso2.org/claims/challengeQuestion1",
    "http://wso2.org/claims/challengeQuestion2",
    "http://wso2.org/claims/groups",
    "http://wso2.org/claims/roles",
    "http://wso2.org/claims/url",
    "http://wso2.org/claims/emailAddresses",
    "http://wso2.org/claims/verifiedEmailAddresses",
    "http://wso2.org/claims/mobileNumbers",
    "http://wso2.org/claims/verifiedMobileNumbers",
    "http://wso2.org/claims/username"
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
 * Return type of the hook.
 */
interface DefaultFlowReturnType {
    generateProfileAttributes: (resource: Resource) => boolean;
    addEmailVerificationNodes: (steps: Step[]) => void;
    addEmailVerificationEdges: (edges: Edge[]) => void;
};

/**
 * Hook to handle default flow for registration flow builder.
 */
const useDefaultFlow = (): DefaultFlowReturnType => {

    const { metadata } = useAuthenticationFlowBuilderCore();
    const { supportedAttributes: claims } = useRegistrationFlowBuilder();
    const { data: validationConfig } = useValidationConfigData();

    /**
     * Check if the username field is alphanumeric based on the validation configuration.
     */
    const isAlphanumericUsername: boolean = useMemo(() => {
        if (!validationConfig) {
            return false;
        }

        const usernameValidators: ValidationConfInterface[] = validationConfig.find(
            (validator: ValidationDataInterface) => {
                return validator.field === USERNAME_FIELD;
            })?.rules || [];

        return usernameValidators.find(
            (rule: ValidationConfInterface) => rule.validator === ALPHANUMERIC_VALIDATOR) !== undefined;
    }, [ validationConfig ]);

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

        field.id = generateResourceId("input");
        field.config.label = claim.displayName;
        field.config.placeholder = buildPlaceholderText(claim.displayName);
        field.config.required = claim.required;
        field.config.type = resolveInputType(claim.claimURI);
        field.config.identifier = claim.claimURI;
        field.variant = resolveVariant(claim.claimURI);

        return field;
    };

    /**
     * Generate profile attributes for the given resource.
     *
     * @param resource - The resource to generate profile attributes for.
     * @returns True.
     */
    const generateProfileAttributes: (resource: Resource) => boolean = useCallback((resource: Resource): boolean => {
        if (resource.type === TemplateTypes.Basic) {
            const formComponents: Element[] = resource.config.data.steps[0].data.components[1].components;

            const emailClaim: Claim = claims?.find((claim: Claim) => claim.claimURI === EMAIL_CLAIM_URI);
            const firstNameClaim: Claim = claims?.find((claim: Claim) => claim.claimURI === FIRST_NAME_CLAIM_URI);
            const lastNameClaim: Claim = claims?.find((claim: Claim) => claim.claimURI === LAST_NAME_CLAIM_URI);

            if (isAlphanumericUsername) {
                const field: Element = buildFieldFromClaim({
                    claimURI: USERNAME_CLAIM_URI,
                    displayName: "Username",
                    readOnly: false,
                    required: true
                } as Claim);

                formComponents.splice(0, 0, field);
            }

            if (emailClaim) {
                const field: Element = buildFieldFromClaim(emailClaim);

                formComponents.splice(isAlphanumericUsername ? 1 : 0, 0, field);
            }

            const claimsForRegistration: Element[] = [];

            if (firstNameClaim) {
                claimsForRegistration.push(buildFieldFromClaim(firstNameClaim));
            }

            if (lastNameClaim) {
                claimsForRegistration.push(buildFieldFromClaim(lastNameClaim));
            }

            claims?.forEach((claim: Claim) => {
                if (EXCLUDED_CLAIMS.includes(claim.claimURI) || claim.readOnly) {
                    return;
                }

                claimsForRegistration.push(buildFieldFromClaim(claim));
            });

            formComponents.splice(formComponents.length - 3, 0, ...claimsForRegistration);
        }

        if (resource.type === TemplateTypes.BasicPasskey) {
            const formComponents: Element[] = resource.config.data.steps[0].data.components[1].components;

            if (isAlphanumericUsername) {
                const field: Element = buildFieldFromClaim({
                    claimURI: USERNAME_CLAIM_URI,
                    displayName: "Username",
                    readOnly: false,
                    required: true
                } as Claim);

                formComponents.splice(0, 0, field);
            }
        }

        return true;
    }, [ claims, isAlphanumericUsername ]);

    useEffect(() => {
        generateProfileAttributes[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "generateProfileAttributes";

        PluginRegistry.getInstance().registerSync(EventTypes.ON_TEMPLATE_LOAD, generateProfileAttributes);

        return () => {
            PluginRegistry.getInstance().unregister(EventTypes.ON_TEMPLATE_LOAD,
                generateProfileAttributes[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
        };
    }, [ generateProfileAttributes ]);

    /**
     * Add email verification nodes to the flow if email verification is enabled.
     *
     * @param steps - The steps to add the email verification nodes to.
     */
    const addEmailVerificationNodes: (steps: Step[]) => void = useCallback((steps: Step[]): void => {

        if (metadata?.connectorConfigs?.accountVerificationEnabled) {
            let nodeExists: boolean = false;
            let useOnboardNode: Step;

            steps.forEach((step: Step) => {
                if (step.type === RegistrationStaticStepTypes.EMAIL_CONFIRMATION) {
                    nodeExists = true;
                } else if (step.type === StaticStepTypes.UserOnboard) {
                    useOnboardNode = step;
                }
            });

            if (!nodeExists && useOnboardNode) {
                useOnboardNode.data["end"] = false;
                useOnboardNode.data["sourceHandle"] = useOnboardNode.id +
                    VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX;
                const confirmationStep: Node = {
                    data: {
                        displayOnly: true
                    },
                    deletable: false,
                    id: RegistrationStaticStepTypes.EMAIL_CONFIRMATION.toString(),
                    position: { x: useOnboardNode.position.x + 300, y: useOnboardNode.position.y },
                    type: RegistrationStaticStepTypes.EMAIL_CONFIRMATION
                };
                const accountUnlock: Node = {
                    data: {
                        displayOnly: true
                    },
                    deletable: false,
                    id: RegistrationStaticStepTypes.USER_ACCOUNT_UNLOCK.toString(),
                    position: { x: useOnboardNode.position.x + 800, y: useOnboardNode.position.y },
                    type: RegistrationStaticStepTypes.USER_ACCOUNT_UNLOCK
                };

                steps.push(confirmationStep as Step);
                steps.push(accountUnlock as Step);
            }
        }
    }, [ metadata?.connectorConfigs?.accountVerificationEnabled ]);

    /**
     * Add email verification edges to the flow if email verification is enabled.
     *
     * @param edges - The edges to add the email verification edges to.
     */
    const addEmailVerificationEdges: (edges: Edge[]) => void = useCallback((edges: Edge[]): void => {

        if (metadata?.connectorConfigs?.accountVerificationEnabled) {
            let edgeExists: boolean = false;
            let onboardEdge: Edge;

            edges.forEach((edge: Edge) => {
                if (edge.target === RegistrationStaticStepTypes.EMAIL_CONFIRMATION) {
                    edgeExists = true;
                } else if (edge.target === StaticStepTypes.UserOnboard) {
                    onboardEdge = edge;
                }
            });

            if (!edgeExists && onboardEdge) {
                const emailConfirmationEdge: Edge = {
                    animated: false,
                    deletable: false,
                    id: `${onboardEdge.target}-${RegistrationStaticStepTypes.EMAIL_CONFIRMATION}`,
                    markerEnd: {
                        type: MarkerType.Arrow
                    },
                    source: onboardEdge.target,
                    sourceHandle: `${onboardEdge.target}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`,
                    target: RegistrationStaticStepTypes.EMAIL_CONFIRMATION.toString(),
                    type: "base-edge"
                };
                const userAccountUnlockEdge: Edge = {
                    animated: false,
                    deletable: false,
                    id: `${RegistrationStaticStepTypes.EMAIL_CONFIRMATION}-`
                        + RegistrationStaticStepTypes.USER_ACCOUNT_UNLOCK,
                    markerEnd: {
                        type: MarkerType.Arrow
                    },
                    source: RegistrationStaticStepTypes.EMAIL_CONFIRMATION.toString(),
                    sourceHandle: RegistrationStaticStepTypes.EMAIL_CONFIRMATION +
                        VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX,
                    style: {
                        strokeDasharray: "5, 5"
                    },
                    target: RegistrationStaticStepTypes.USER_ACCOUNT_UNLOCK.toString(),
                    type: "base-edge"
                };

                edges.push(emailConfirmationEdge);
                edges.push(userAccountUnlockEdge);
            }
        }
    }, [ metadata?.connectorConfigs?.accountVerificationEnabled ]);

    return { addEmailVerificationEdges, addEmailVerificationNodes, generateProfileAttributes };
};

export default useDefaultFlow;
