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

import { Theme, styled } from "@mui/material/styles";
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useMemo } from "react";
import {
    CREDENTIAL_OPTIONS,
    DEFAULT_SIGN_IN_OPTIONS,
    IDENTIFIER_OPTIONS,
    OnboardingComponentIds,
    SOCIAL_LOGIN_OPTIONS
} from "../../constants";
import {
    OnboardingBrandingConfig,
    SignInOptionsConfig,
    SignInOptionsValidation
} from "../../models";
import LoginBoxPreview from "../shared/login-box-preview";
import { LeftColumn, RightColumn, TwoColumnLayout } from "../shared/onboarding-styles";
import SignInOptionToggle from "../shared/sign-in-option-toggle";
import StepHeader from "../shared/step-header";

/**
 * Props interface for SignInOptionsStep component.
 */
interface SignInOptionsStepProps extends IdentifiableComponentInterface {
    /** Current sign-in options configuration */
    signInOptions?: SignInOptionsConfig;
    /** Callback when sign-in options change */
    onSignInOptionsChange: (options: SignInOptionsConfig) => void;
    /** Branding configuration for preview */
    brandingConfig?: OnboardingBrandingConfig;
}

/**
 * Section container for grouping options.
 */
const OptionSection = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1)
}));

/**
 * Section title.
 */
const SectionTitle = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
    marginBottom: theme.spacing(0.5),
    textTransform: "uppercase"
}));

/**
 * Container for all options.
 */
const OptionsContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    maxWidth: 400
}));

/**
 * Preview column styling.
 */
const PreviewColumn = styled(RightColumn)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius * 2,
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(4)
}));

/**
 * Validate sign-in options configuration.
 */
const validateSignInOptions = (options: SignInOptionsConfig): SignInOptionsValidation => {
    const errors: string[] = [];
    const { identifiers, credentials, socialLogins } = options;

    const hasIdentifier: boolean = identifiers.username || identifiers.email || identifiers.mobile;
    const hasCredential: boolean = credentials.password || credentials.passkey;
    const hasSocial: boolean = socialLogins.google;

    // Must have at least one way to sign in
    if (!hasIdentifier && !hasSocial) {
        errors.push("Select at least one identifier or social login option");
    }

    // Username alone requires a credential
    if (identifiers.username && !identifiers.email && !identifiers.mobile && !hasCredential) {
        errors.push("Username requires a credential (Password or Passkey)");
    }

    return {
        errors,
        isValid: errors.length === 0
    };
};

/**
 * Sign-in options step component for onboarding.
 * Allows users to configure how they want their users to sign in.
 */
const SignInOptionsStep: FunctionComponent<SignInOptionsStepProps> = (
    props: SignInOptionsStepProps
): ReactElement => {
    const {
        signInOptions = DEFAULT_SIGN_IN_OPTIONS,
        onSignInOptionsChange,
        brandingConfig,
        ["data-componentid"]: componentId = OnboardingComponentIds.SIGN_IN_OPTIONS_STEP
    } = props;

    const handleIdentifierToggle = useCallback((id: string, enabled: boolean): void => {
        onSignInOptionsChange({
            ...signInOptions,
            identifiers: {
                ...signInOptions.identifiers,
                [id]: enabled
            }
        });
    }, [ signInOptions, onSignInOptionsChange ]);

    const handleCredentialToggle = useCallback((id: string, enabled: boolean): void => {
        onSignInOptionsChange({
            ...signInOptions,
            credentials: {
                ...signInOptions.credentials,
                [id]: enabled
            }
        });
    }, [ signInOptions, onSignInOptionsChange ]);

    const handleSocialToggle = useCallback((id: string, enabled: boolean): void => {
        onSignInOptionsChange({
            ...signInOptions,
            socialLogins: {
                ...signInOptions.socialLogins,
                [id]: enabled
            }
        });
    }, [ signInOptions, onSignInOptionsChange ]);

    const validation: SignInOptionsValidation = useMemo(
        () => validateSignInOptions(signInOptions),
        [ signInOptions ]
    );

    // Check if username requires credential warning should show
    const showUsernameWarning: boolean = useMemo(() => {
        const { identifiers, credentials } = signInOptions;

        return identifiers.username &&
               !identifiers.email &&
               !identifiers.mobile &&
               !credentials.password &&
               !credentials.passkey;
    }, [ signInOptions ]);

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    subtitle="Choose how your users will identify themselves and verify their identity."
                    title="How do you want users to sign in?"
                />

                <OptionsContainer>
                    { /* Identifier Options */ }
                    <OptionSection>
                        <SectionTitle>Identifiers</SectionTitle>
                        { IDENTIFIER_OPTIONS.map((option) => (
                            <SignInOptionToggle
                                isEnabled={
                                    signInOptions.identifiers[
                                        option.id as keyof typeof signInOptions.identifiers
                                    ]
                                }
                                key={ option.id }
                                onToggle={ (enabled: boolean) =>
                                    handleIdentifierToggle(option.id, enabled)
                                }
                                option={ option }
                                data-componentid={ `${componentId}-identifier-${option.id}` }
                            />
                        )) }
                    </OptionSection>

                    { /* Credential Options */ }
                    <OptionSection>
                        <SectionTitle>Credentials</SectionTitle>
                        { CREDENTIAL_OPTIONS.map((option) => (
                            <SignInOptionToggle
                                isEnabled={
                                    signInOptions.credentials[
                                        option.id as keyof typeof signInOptions.credentials
                                    ]
                                }
                                key={ option.id }
                                onToggle={ (enabled: boolean) =>
                                    handleCredentialToggle(option.id, enabled)
                                }
                                option={ option }
                                data-componentid={ `${componentId}-credential-${option.id}` }
                            />
                        )) }
                    </OptionSection>

                    { /* Social Login Options */ }
                    <OptionSection>
                        <SectionTitle>Social Login</SectionTitle>
                        { SOCIAL_LOGIN_OPTIONS.map((option) => (
                            <SignInOptionToggle
                                isEnabled={
                                    signInOptions.socialLogins[
                                        option.id as keyof typeof signInOptions.socialLogins
                                    ]
                                }
                                key={ option.id }
                                onToggle={ (enabled: boolean) =>
                                    handleSocialToggle(option.id, enabled)
                                }
                                option={ option }
                                data-componentid={ `${componentId}-social-${option.id}` }
                            />
                        )) }
                    </OptionSection>

                    { /* Validation Warning */ }
                    { showUsernameWarning && (
                        <Alert severity="warning">
                            Username alone requires a credential. Enable Password or Passkey.
                        </Alert>
                    ) }

                    { !validation.isValid && !showUsernameWarning && validation.errors.length > 0 && (
                        <Alert severity="error">
                            { validation.errors[0] }
                        </Alert>
                    ) }
                </OptionsContainer>
            </LeftColumn>

            <PreviewColumn>
                <LoginBoxPreview
                    brandingConfig={ brandingConfig }
                    signInOptions={ signInOptions }
                    data-componentid={ `${componentId}-preview` }
                />
            </PreviewColumn>
        </TwoColumnLayout>
    );
};

export default SignInOptionsStep;
