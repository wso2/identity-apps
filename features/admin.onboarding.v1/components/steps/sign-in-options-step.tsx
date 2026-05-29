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
import Divider from "@oxygen-ui/react/Divider";
import Typography from "@oxygen-ui/react/Typography";
import { getConnectionIcons } from "@wso2is/admin.connections.v1/configs/ui";
import { RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import {
    useGetGovernanceConnectorById
} from "@wso2is/admin.server-configurations.v1/api/governance-connectors";
import {
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "@wso2is/admin.server-configurations.v1/models/governance-connectors";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode, useCallback, useEffect, useMemo } from "react";
import {
    DEFAULT_SIGN_IN_OPTIONS,
    LOGIN_METHOD_OPTIONS,
    MFA_METHOD_IDS,
    OnboardingComponentIds,
    PASSWORDLESS_METHOD_IDS,
    PASSWORD_METHOD_IDS
} from "../../constants";
import { OnboardingBrandingConfigInterface } from "../../models/branding";
import {
    SignInOptionDefinitionInterface,
    SignInOptionsConfigInterface,
    SignInOptionsValidationInterface
} from "../../models/sign-in-options";
import { validateSignInOptions } from "../../utils/sign-in-options-validator";
import LoginBoxPreview from "../shared/login-box-preview";
import { ConfigPanel, PreviewPanel, SectionLabel, TwoColumnLayout } from "../shared/onboarding-styles";
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
    /** Whether user self-registration is enabled */
    selfRegistrationEnabled?: boolean;
    /** Callback when self-registration toggle changes */
    onSelfRegistrationChange: (enabled: boolean) => void;
}

/**
 * Self-registration option definition for the toggle component.
 */
const SELF_REGISTRATION_OPTION: SignInOptionDefinitionInterface = {
    authenticatorConfig: { authenticator: "", idp: "" },
    category: "identifier",
    id: "selfRegistration",
    label: "Allow user self-registration"
};

/**
 * Section container for grouping options.
 */
const OptionSection: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5)
}));

/**
 * Group label for categorizing options (e.g., "Passwordless", "MFA").
 */
const GroupLabel: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    textTransform: "uppercase"
}));


/**
 * Scrollable container for login methods.
 */
const OptionsContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "&::-webkit-scrollbar": {
        width: 6
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "transparent",
        borderRadius: 3,
        transition: "background-color 200ms ease"
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent"
    },
    "&:hover::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.grey[300]
    },
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: theme.spacing(2.5),
    overflowY: "auto",
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(1),
    scrollbarGutter: "stable"
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
        selfRegistrationEnabled,
        onSelfRegistrationChange,
        ["data-componentid"]: componentId = OnboardingComponentIds.SIGN_IN_OPTIONS_STEP
    } = props;

    // Fetch current org-wide self-registration setting
    const {
        data: selfSignUpConnector,
        isLoading: isLoadingSelfReg
    }: RequestResultInterface<GovernanceConnectorInterface> = useGetGovernanceConnectorById(
        ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
        ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID,
        true
    );

    // Initialize toggle from server state on first load only.
    // The undefined check ensures returning to this step preserves the user's explicit choice.
    useEffect(() => {
        if (selfSignUpConnector && selfRegistrationEnabled === undefined) {
            const enableProp: ConnectorPropertyInterface | undefined =
                selfSignUpConnector.properties?.find(
                    (prop: ConnectorPropertyInterface) =>
                        prop.name === ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE
                );

            onSelfRegistrationChange(enableProp?.value === "true");
        }
    }, [ selfSignUpConnector, selfRegistrationEnabled, onSelfRegistrationChange ]);

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

    const handleSelfRegistrationToggle: (enabled: boolean) => void = useCallback(
        (enabled: boolean): void => {
            onSelfRegistrationChange(enabled);
        }, [ onSelfRegistrationChange ]
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
            <ConfigPanel>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    title="How do you want users to sign in?"
                />
                <OptionsContainer>
                    { /* Password — standalone */ }
                    <OptionSection>
                        { LOGIN_METHOD_OPTIONS
                            .filter((o: SignInOptionDefinitionInterface) => PASSWORD_METHOD_IDS.includes(o.id))
                            .map((option: SignInOptionDefinitionInterface) => (
                                <SignInOptionToggle
                                    data-componentid={ `${componentId}-login-method-${option.id}` }
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
                                />
                            )) }
                    </OptionSection>

                    { /* Passwordless group */ }
                    <OptionSection>
                        <GroupLabel>Passwordless</GroupLabel>
                        { LOGIN_METHOD_OPTIONS
                            .filter((o: SignInOptionDefinitionInterface) => PASSWORDLESS_METHOD_IDS.includes(o.id))
                            .map((option: SignInOptionDefinitionInterface) => (
                                <SignInOptionToggle
                                    data-componentid={ `${componentId}-login-method-${option.id}` }
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
                                />
                            )) }
                    </OptionSection>

                    { /* MFA group */ }
                    <OptionSection>
                        <GroupLabel>Multi-Factor Authentication (MFA)</GroupLabel>
                        { LOGIN_METHOD_OPTIONS
                            .filter((o: SignInOptionDefinitionInterface) => MFA_METHOD_IDS.includes(o.id))
                            .map((option: SignInOptionDefinitionInterface) => (
                                <SignInOptionToggle
                                    data-componentid={ `${componentId}-login-method-${option.id}` }
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
                                />
                            )) }
                    </OptionSection>

                    { !validation.isValid && validation.errors.length > 0 && (
                        <Alert severity="error">
                            { validation.errors[0] }
                        </Alert>
                    ) }

                    <Divider />

                    { /* User registration section */ }
                    <Box sx={ { display: "flex", flexDirection: "column", gap: 1.5 } }>
                        <SectionLabel sx={ { fontWeight: 600, marginBottom: 0 } }>
                            User registration
                        </SectionLabel>
                        <SignInOptionToggle
                            data-componentid={
                                `${componentId}-${OnboardingComponentIds.SELF_REGISTRATION_SECTION}`
                            }
                            disabled={ isLoadingSelfReg }
                            isEnabled={ selfRegistrationEnabled ?? false }
                            onToggle={ handleSelfRegistrationToggle }
                            option={ SELF_REGISTRATION_OPTION }
                        />
                        <Typography
                            data-componentid={
                                `${componentId}-${OnboardingComponentIds.SELF_REGISTRATION_SECTION}-hint`
                            }
                            sx={ {
                                color: "text.secondary",
                                fontSize: "0.75rem",
                                lineHeight: 1.5,
                                px: 1
                            } }
                        >
                            This is an organization-wide setting and will apply to all applications.
                        </Typography>
                    </Box>
                </OptionsContainer>
            </ConfigPanel>
            <PreviewPanel>
                <LoginBoxPreview
                    brandingConfig={ brandingConfig }
                    data-componentid={ `${componentId}-preview` }
                    selfRegistrationEnabled={ selfRegistrationEnabled ?? false }
                    signInOptions={ signInOptions }
                />
            </PreviewPanel>
        </TwoColumnLayout>
    );
};

export default SignInOptionsStep;
