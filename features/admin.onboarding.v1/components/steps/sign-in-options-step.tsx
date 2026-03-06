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
import { getConnectionIcons } from "@wso2is/admin.connections.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode, useCallback, useMemo } from "react";
import {
    DEFAULT_SIGN_IN_OPTIONS,
    LOGIN_METHOD_OPTIONS,
    OnboardingComponentIds
} from "../../constants";
import {
    OnboardingBrandingConfigInterface,
    SignInOptionDefinitionInterface,
    SignInOptionsConfigInterface,
    SignInOptionsValidationInterface
} from "../../models";
import { validateSignInOptions } from "../../utils/sign-in-options-validator";
import LoginBoxPreview from "../shared/login-box-preview";
import { LeftColumn, RightColumn, SectionLabel, TwoColumnLayout } from "../shared/onboarding-styles";
import SignInOptionToggle from "../shared/sign-in-option-toggle";
import StepHeader from "../shared/step-header";

/**
 * Props interface for SignInOptionsStep component.
 */
interface SignInOptionsStepPropsInterface extends IdentifiableComponentInterface {
    /** Current sign-in options configuration */
    signInOptions?: SignInOptionsConfigInterface;
    /** Callback when sign-in options change */
    onSignInOptionsChange: (options: SignInOptionsConfigInterface) => void;
    /** Branding configuration for preview */
    brandingConfig?: OnboardingBrandingConfigInterface;
}

/**
 * Section container for grouping options.
 */
const OptionSection: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1)
}));

/**
 * Scrollable container for login methods.
 */
const OptionsContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "&::-webkit-scrollbar": {
        width: 6
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.grey[300],
        borderRadius: 3
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent"
    },
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: theme.spacing(3),
    overflowY: "auto",
    paddingRight: theme.spacing(1)
}));

/**
 * Preview column styling.
 */
const PreviewColumn: typeof Box = styled(RightColumn)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius * 2,
    display: "flex",
    justifyContent: "flex-start",
    overflowY: "auto",
    padding: theme.spacing(4)
}));

/**
 * Sign-in options step component for onboarding.
 * Allows users to configure how they want their users to sign in.
 */
const SignInOptionsStep: FunctionComponent<SignInOptionsStepPropsInterface> = (
    props: SignInOptionsStepPropsInterface
): ReactElement => {
    const {
        signInOptions = DEFAULT_SIGN_IN_OPTIONS,
        onSignInOptionsChange,
        brandingConfig,
        ["data-componentid"]: componentId = OnboardingComponentIds.SIGN_IN_OPTIONS_STEP
    } = props;

    const handleLoginMethodToggle: (id: string, enabled: boolean) => void = useCallback(
        (id: string, enabled: boolean): void => {
            onSignInOptionsChange({
                ...signInOptions,
                loginMethods: {
                    ...signInOptions.loginMethods,
                    [id]: enabled
                }
            });
        }, [ signInOptions, onSignInOptionsChange ]
    );

    const validation: SignInOptionsValidationInterface = useMemo(
        () => validateSignInOptions(signInOptions),
        [ signInOptions ]
    );

    const loginMethodIcons: Record<string, ReactNode> = useMemo(() => {
        const icons: Record<string, unknown> = getConnectionIcons();

        return {
            emailOtp: icons.emailOTP as ReactNode,
            magicLink: icons.magicLink as ReactNode,
            passkey: icons.fido as ReactNode,
            password: icons.basic as ReactNode,
            pushNotification: icons.push as ReactNode,
            totp: icons.totp as ReactNode
        };
    }, []);

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    subtitle="Choose how your users will verify their identity."
                    title="How do you want users to sign in?"
                />
                <SectionLabel sx={ { marginBottom: 0 } }>
                    Sign-in methods
                </SectionLabel>
                <OptionsContainer>
                    <OptionSection>
                        { LOGIN_METHOD_OPTIONS.map((option: SignInOptionDefinitionInterface) => (
                            <SignInOptionToggle
                                icon={ loginMethodIcons[option.id] }
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
                { !validation.isValid && validation.errors.length > 0 && (
                    <Alert severity="error" sx={ { marginBottom: 1 } }>
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
