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
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Paper from "@oxygen-ui/react/Paper";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { getConnectionIcons } from "@wso2is/admin.connections.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo, useMemo } from "react";
import { OnboardingComponentIds } from "../../constants";
import { getAnimalNameFromUrl, getAvatarDisplayImage } from "../../constants/preset-logos";
import { OnboardingBrandingConfigInterface, SignInOptionsConfigInterface } from "../../models";

/**
 * Auth method display configuration interface.
 */
interface AuthMethodDisplayConfigInterface {
    /** Icon - can be string path or React component */
    icon: any;
    /** Display label */
    label: string;
}

/**
 * Get auth method display configuration with proper icons.
 */
const getAuthMethodConfig = (): Record<string, AuthMethodDisplayConfigInterface> => ({
    emailOtp: {
        icon: getConnectionIcons().emailOTP,
        label: "Email OTP"
    },
    magicLink: {
        icon: getConnectionIcons().magicLink,
        label: "Magic Link"
    },
    passkey: {
        icon: getConnectionIcons().fido,
        label: "Passkey"
    },
    password: {
        icon: getConnectionIcons().basic,
        label: "Password"
    },
    pushNotification: {
        icon: getConnectionIcons().push,
        label: "Push Notification"
    },
    totp: {
        icon: getConnectionIcons().totp,
        label: "Authenticator App"
    }
});

/**
 * Props interface for LoginBoxPreview component.
 */
export interface LoginBoxPreviewPropsInterface extends IdentifiableComponentInterface {
    /** Sign-in options configuration */
    signInOptions?: SignInOptionsConfigInterface;
    /** Branding configuration */
    brandingConfig?: OnboardingBrandingConfigInterface;
    /** Scale factor for the preview */
    scale?: number;
}

/**
 * Outer container for centering and scaling.
 */
const PreviewWrapper = styled(Box)({
    alignItems: "flex-start",
    display: "flex",
    justifyContent: "center",
    width: "100%"
});

/**
 * Main preview container for the two-step flow.
 */
const PreviewContainer = styled(Box)<{ scale: number }>(({ scale }) => ({
    display: "flex",
    flexDirection: "column",
    maxWidth: 320,
    transform: `scale(${scale})`,
    transformOrigin: "top center",
    width: "100%"
}));

/**
 * Step container with relative positioning for label.
 */
const StepContainer = styled(Box)({
    position: "relative"
});

/**
 * Step label badge.
 */
const StepLabel = styled(Typography)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
    fontSize: "0.625rem",
    fontWeight: 600,
    left: theme.spacing(1.5),
    padding: theme.spacing(0.25, 0.75),
    position: "absolute",
    top: -8,
    zIndex: 1
}));

/**
 * Step box (card) styling.
 */
const StepBox = styled(Paper)(({ theme }: { theme: Theme }) => ({
    borderRadius: theme.shape.borderRadius * 1.5,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2.5, 2)
}));

/**
 * Connector between steps.
 */
const StepConnector = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    height: 24,
    justifyContent: "center",
    "& .connector-line": {
        backgroundColor: theme.palette.divider,
        height: "100%",
        width: 2
    }
}));

/**
 * Styled text field for preview.
 */
const PreviewTextField = styled(TextField)(({ theme }: { theme: Theme }) => ({
    "& .MuiInputBase-root": {
        fontSize: "0.75rem",
        pointerEvents: "none"
    },
    "& .MuiInputLabel-root": {
        fontSize: "0.75rem"
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.divider
    }
}));

/**
 * Primary button styled with custom color.
 */
const PrimaryButtonStyled = styled(Button)<{ customcolor?: string }>(({ customcolor }) => ({
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: 500,
    padding: "8px 16px",
    pointerEvents: "none",
    textTransform: "none"
}));

/**
 * Sign-in option button.
 */
const SignInOptionButton = styled(Button)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    fontSize: "0.6875rem",
    justifyContent: "flex-start",
    padding: theme.spacing(0.75, 1.5),
    textTransform: "none",
    pointerEvents: "none",
    "& .MuiButton-startIcon": {
        marginRight: theme.spacing(1)
    }
}));

/**
 * Icon container for sign-in option buttons.
 */
const IconImage = styled("img")({
    height: 16,
    objectFit: "contain",
    width: 16
});

/**
 * Get the identifier field label based on selected options.
 */
const getIdentifierLabel = (signInOptions: SignInOptionsConfigInterface): string => {
    const { identifiers } = signInOptions;
    const labels: string[] = [];

    if (identifiers.username) labels.push("Username");
    if (identifiers.email) labels.push("Email");
    if (identifiers.mobile) labels.push("Mobile");

    if (labels.length === 0) return "Email";
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return labels.join(" or ");

    return `${labels.slice(0, -1).join(", ")} or ${labels[labels.length - 1]}`;
};

/**
 * Default sign-in options for preview.
 */
const DEFAULT_PREVIEW_OPTIONS: SignInOptionsConfigInterface = {
    identifiers: { email: true, mobile: false, username: true },
    loginMethods: {
        emailOtp: false,
        magicLink: false,
        passkey: false,
        password: true,
        pushNotification: false,
        totp: false
    }
};

/**
 * Default branding config for preview.
 */
const DEFAULT_BRANDING: OnboardingBrandingConfigInterface = {
    primaryColor: "#ff7300"
};

/**
 * Login box preview component.
 * Displays a two-step preview of the Identifier First login flow.
 */
const LoginBoxPreview: FunctionComponent<LoginBoxPreviewPropsInterface> = memo((
    props: LoginBoxPreviewPropsInterface
): ReactElement => {
    const {
        signInOptions = DEFAULT_PREVIEW_OPTIONS,
        brandingConfig = DEFAULT_BRANDING,
        scale = 0.85,
        ["data-componentid"]: componentId = OnboardingComponentIds.LOGIN_BOX_PREVIEW
    } = props;

    const { primaryColor } = brandingConfig;
    const { identifiers, loginMethods } = signInOptions;

    const hasIdentifier: boolean = identifiers.username || identifiers.email || identifiers.mobile;
    const hasPassword: boolean = loginMethods.password;
    const hasAnyLoginMethod: boolean = loginMethods.password || loginMethods.passkey ||
        loginMethods.magicLink || loginMethods.emailOtp || loginMethods.totp ||
        loginMethods.pushNotification;

    // Non-password methods go to Step 2 as alternatives
    const hasNonPasswordMethods: boolean = loginMethods.passkey || loginMethods.magicLink ||
        loginMethods.emailOtp || loginMethods.totp || loginMethods.pushNotification;

    const identifierLabel: string = useMemo(
        () => getIdentifierLabel(signInOptions),
        [ signInOptions ]
    );

    // Get auth method config for icons
    const authMethodConfig: Record<string, AuthMethodDisplayConfigInterface> = useMemo(
        () => getAuthMethodConfig(),
        []
    );

    /**
     * Get selected login methods.
     */
    const selectedMethods: string[] = useMemo(() => {
        return Object.entries(loginMethods)
            .filter(([ , enabled ]: [string, boolean]) => enabled)
            .map(([ key ]: [string, boolean]) => key);
    }, [ loginMethods ]);

    /**
     * Render icon for a method - handles both string paths and React components.
     */
    const renderIcon = (icon: any): ReactElement | null => {
        if (!icon) return null;

        // If it's a string (image path), use img tag
        if (typeof icon === "string") {
            return <IconImage src={ icon } alt="" />;
        }

        // If it's a React component (SVG), render it
        if (typeof icon === "function" || typeof icon === "object") {
            const IconComponent = icon;

            return (
                <Box sx={ { display: "flex", height: 16, width: 16 } }>
                    <IconComponent style={ { height: "100%", width: "100%" } } />
                </Box>
            );
        }

        return null;
    };

    return (
        <PreviewWrapper data-componentid={ componentId }>
            <PreviewContainer scale={ scale }>
                { /* Empty state */ }
                { !hasIdentifier && !hasAnyLoginMethod && (
                    <Typography
                        color="text.secondary"
                        sx={ { fontStyle: "italic", textAlign: "center" } }
                    >
                        Select sign-in options to preview
                    </Typography>
                ) }

                { /* Error states */ }
                { hasIdentifier && !hasAnyLoginMethod && (
                    <Typography
                        color="error"
                        sx={ { fontSize: "0.75rem", textAlign: "center" } }
                    >
                        Select at least one login method
                    </Typography>
                ) }

                { !hasIdentifier && hasAnyLoginMethod && (
                    <Typography
                        color="error"
                        sx={ { fontSize: "0.75rem", textAlign: "center" } }
                    >
                        Select at least one identifier
                    </Typography>
                ) }

                { /* Login flow preview */ }
                { hasIdentifier && hasAnyLoginMethod && (
                    <>
                        { /* Step 1: Identifier + Password (if selected) */ }
                        <StepContainer>
                            { hasNonPasswordMethods && <StepLabel>Step 1</StepLabel> }
                            <StepBox variant="outlined">
                                { /* Logo display when selected */ }
                                { brandingConfig.logoUrl && (
                                    <Box sx={ { display: "flex", justifyContent: "center", mb: 1 } }>
                                        <Box
                                            component="img"
                                            src={ getAvatarDisplayImage(
                                                getAnimalNameFromUrl(brandingConfig.logoUrl)
                                            ) }
                                            alt="Application logo"
                                            sx={ {
                                                height: 56,
                                                objectFit: "cover",
                                                width: 56
                                            } }
                                        />
                                    </Box>
                                ) }
                                { /* Sign in title */ }
                                <Typography
                                    sx={ { mb: 1, textAlign: "center" } }
                                    variant="h6"
                                >
                                    Sign in
                                </Typography>
                                <PreviewTextField
                                    fullWidth
                                    label={ identifierLabel }
                                    size="small"
                                    variant="outlined"
                                />
                                { hasPassword && (
                                    <PreviewTextField
                                        fullWidth
                                        label="Password"
                                        size="small"
                                        type="password"
                                        variant="outlined"
                                    />
                                ) }
                                <PrimaryButtonStyled
                                    fullWidth
                                    sx={ { marginTop: 2, backgroundColor: primaryColor } }
                                >
                                    { hasPassword ? "Sign In" : "Continue" }
                                </PrimaryButtonStyled>
                            </StepBox>
                        </StepContainer>

                        { /* Connector + Step 2: Only shown if non-password methods selected */ }
                        { hasNonPasswordMethods && (
                            <>
                                <StepConnector>
                                    <div className="connector-line" />
                                </StepConnector>

                                <StepContainer>
                                    <StepLabel>Step 2</StepLabel>
                                    <StepBox variant="outlined">
                                        { selectedMethods
                                            .filter((methodKey: string) => methodKey !== "password")
                                            .map((methodKey: string) => {
                                                const config: AuthMethodDisplayConfigInterface =
                                                    authMethodConfig[methodKey];

                                                if (!config) return null;

                                                return (
                                                    <SignInOptionButton
                                                        fullWidth
                                                        key={ methodKey }
                                                        startIcon={ renderIcon(config.icon) }
                                                        variant="outlined"
                                                    >
                                                        { config.label }
                                                    </SignInOptionButton>
                                                );
                                            }) }
                                    </StepBox>
                                </StepContainer>
                            </>
                        ) }
                    </>
                ) }
            </PreviewContainer>
        </PreviewWrapper>
    );
});

LoginBoxPreview.displayName = "LoginBoxPreview";

export default LoginBoxPreview;
