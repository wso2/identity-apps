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
import IconButton from "@oxygen-ui/react/IconButton";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useMemo } from "react";
import {
    DEFAULT_SIGN_IN_OPTIONS,
    IDENTIFIER_OPTIONS,
    LOGIN_METHOD_OPTIONS,
    OnboardingComponentIds
} from "../../constants";
import {
    OnboardingBrandingConfig,
    SignInOptionsConfig,
    SignInOptionsValidation
} from "../../models";
import LoginBoxPreview from "../shared/login-box-preview";
import { LeftColumn, RightColumn, SectionLabel, TwoColumnLayout } from "../shared/onboarding-styles";
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
 * Fixed section for identifiers.
 */
const FixedSection = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    // maxWidth: 500
}));

/**
 * Scrollable container for login methods.
 */
const OptionsContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: theme.spacing(3),
    // maxWidth: 500,
    overflowY: "auto",
    paddingRight: theme.spacing(1),
    // Custom scrollbar styling
    "&::-webkit-scrollbar": {
        width: 6
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.grey[300],
        borderRadius: 3
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent"
    }
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
 * Simplified validation for the Identifier First approach.
 */
const validateSignInOptions = (options: SignInOptionsConfig): SignInOptionsValidation => {
    const errors: string[] = [];
    const { identifiers, loginMethods } = options;

    // Must have at least one identifier
    const hasIdentifier: boolean = identifiers.username || identifiers.email || identifiers.mobile;

    if (!hasIdentifier) {
        errors.push("Select at least one identifier (Username, Email, or Mobile)");
    }

    // Must have at least one login method
    const hasLoginMethod: boolean = loginMethods.password || loginMethods.passkey ||
        loginMethods.magicLink || loginMethods.emailOtp || loginMethods.totp ||
        loginMethods.pushNotification;

    if (!hasLoginMethod) {
        errors.push("Select at least one login method");
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

    const handleLoginMethodToggle = useCallback((id: string, enabled: boolean): void => {
        onSignInOptionsChange({
            ...signInOptions,
            loginMethods: {
                ...signInOptions.loginMethods,
                [id]: enabled
            }
        });
    }, [ signInOptions, onSignInOptionsChange ]);

    const validation: SignInOptionsValidation = useMemo(
        () => validateSignInOptions(signInOptions),
        [ signInOptions ]
    );

    const [ open, setOpen ] = React.useState(true);

    // Show info note when email or mobile identifier is selected
    const showIdentifierNote: boolean = useMemo(
        () => signInOptions.identifiers.email || signInOptions.identifiers.mobile || signInOptions.identifiers.username,
        [ signInOptions.identifiers.email, signInOptions.identifiers.mobile, signInOptions.identifiers.username ]
    );

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    subtitle="Choose how your application's users will identify themselves and verify their identity."
                    title="How do you want users to sign in?"
                />

                { /* Identifiers section - fixed at top */ }
                <FixedSection>
                    <OptionSection>
                        <SectionLabel>Identifiers</SectionLabel>
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

                    { /* Informational note - shown when email or mobile is selected */ }
                    { showIdentifierNote && (
                        <Alert
                            hidden={ !open }
                            severity="info"
                            action={
                                (<IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <XMarkIcon />
                                </IconButton>)
                            }
                            data-componentid={ `${componentId}-identifier-note` }
                        >
                            This identifier setting applies across all applications in your organization.
                        </Alert>
                    ) }
                </FixedSection>
                <SectionLabel>
                    Login Methods
                </SectionLabel>

                { /* Login Methods */ }
                <OptionsContainer>
                    <OptionSection>
                        { LOGIN_METHOD_OPTIONS.map((option) => (
                            <SignInOptionToggle
                                isEnabled={
                                    signInOptions.loginMethods[
                                        option.id as keyof typeof signInOptions.loginMethods
                                    ]
                                }
                                key={ option.id }
                                onToggle={ (enabled: boolean) =>
                                    handleLoginMethodToggle(option.id, enabled)
                                }
                                option={ option }
                                data-componentid={ `${componentId}-login-method-${option.id}` }
                            />
                        )) }
                    </OptionSection>
                </OptionsContainer>

                { /* Validation Warning */ }
                { !validation.isValid && validation.errors.length > 0 && (
                    <Alert severity="error">
                        { validation.errors[0] }
                    </Alert>
                ) }
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
