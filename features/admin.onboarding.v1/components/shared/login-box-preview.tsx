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
import Avatar from "@oxygen-ui/react/Avatar";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo, useMemo } from "react";
import { OnboardingComponentIds } from "../../constants";
import { OnboardingBrandingConfig, SignInOptionsConfig } from "../../models";

/**
 * Props interface for LoginBoxPreview component.
 */
export interface LoginBoxPreviewProps extends IdentifiableComponentInterface {
    /** Sign-in options configuration */
    signInOptions?: SignInOptionsConfig;
    /** Branding configuration */
    brandingConfig?: OnboardingBrandingConfig;
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
 * Main preview container styled as a login card.
 */
const PreviewContainer = styled(Box)<{ scale: number }>(({ theme, scale }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    maxWidth: 360,
    padding: theme.spacing(4),
    transform: `scale(${scale})`,
    transformOrigin: "top center",
    width: "100%"
}));

/**
 * Logo container.
 */
const LogoContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(3)
}));

/**
 * Title text.
 */
const Title = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: theme.spacing(3),
    textAlign: "center"
}));

/**
 * Form container.
 */
const FormContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
}));

/**
 * Styled text field to look like a disabled preview.
 */
const PreviewTextField = styled(TextField)(({ theme }: { theme: Theme }) => ({
    "& .MuiInputBase-root": {
        backgroundColor: theme.palette.action.hover,
        pointerEvents: "none"
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.divider
    }
}));

/**
 * Primary button styled with custom color.
 */
const PrimaryButtonStyled = styled(Button)<{ customcolor: string }>(({ customcolor }) => ({
    backgroundColor: customcolor,
    color: "#ffffff",
    fontWeight: 500,
    padding: "10px 16px",
    textTransform: "none",
    "&:hover": {
        backgroundColor: customcolor,
        opacity: 0.9
    }
}));


/**
 * Get the identifier field label based on selected options.
 */
const getIdentifierLabel = (signInOptions: SignInOptionsConfig): string => {
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
const DEFAULT_PREVIEW_OPTIONS: SignInOptionsConfig = {
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
const DEFAULT_BRANDING: OnboardingBrandingConfig = {
    primaryColor: "#ff7300"
};

/**
 * Get a summary of selected login methods.
 */
const getLoginMethodsSummary = (loginMethods: SignInOptionsConfig["loginMethods"]): string[] => {
    const methods: string[] = [];

    if (loginMethods.password) methods.push("Password");
    if (loginMethods.passkey) methods.push("Passkey");
    if (loginMethods.magicLink) methods.push("Magic Link");
    if (loginMethods.emailOtp) methods.push("Email OTP");
    if (loginMethods.totp) methods.push("TOTP");
    if (loginMethods.pushNotification) methods.push("Push Notification");

    return methods;
};

/**
 * Login box preview component.
 * Displays a preview of the login experience based on selected options.
 *
 * **Password selected (Traditional Login):**
 * - Shows identifier field + password field + "Sign In" button
 *
 * **Password NOT selected (Identifier First flow):**
 * - Shows identifier field + "Continue" button + login methods summary
 */
const LoginBoxPreview: FunctionComponent<LoginBoxPreviewProps> = memo((
    props: LoginBoxPreviewProps
): ReactElement => {
    const {
        signInOptions = DEFAULT_PREVIEW_OPTIONS,
        brandingConfig = DEFAULT_BRANDING,
        scale = 0.85,
        ["data-componentid"]: componentId = OnboardingComponentIds.LOGIN_BOX_PREVIEW
    } = props;

    const { primaryColor, logoUrl } = brandingConfig;
    const { identifiers, loginMethods } = signInOptions;

    const hasIdentifier: boolean = identifiers.username || identifiers.email || identifiers.mobile;
    const hasPassword: boolean = loginMethods.password;
    const hasAnyLoginMethod: boolean = loginMethods.password || loginMethods.passkey ||
        loginMethods.magicLink || loginMethods.emailOtp || loginMethods.totp ||
        loginMethods.pushNotification;

    // Get non-password login methods for summary (shown as additional options when password is selected)
    const hasOtherMethods: boolean = loginMethods.passkey || loginMethods.magicLink ||
        loginMethods.emailOtp || loginMethods.totp || loginMethods.pushNotification;

    const identifierLabel: string = useMemo(
        () => getIdentifierLabel(signInOptions),
        [ signInOptions ]
    );

    const loginMethodsList: string[] = useMemo(
        () => getLoginMethodsSummary(loginMethods),
        [ loginMethods ]
    );

    // Get non-password methods for the summary when password is selected
    const otherMethodsList: string[] = useMemo(() => {
        const methods: string[] = [];

        if (loginMethods.passkey) methods.push("Passkey");
        if (loginMethods.magicLink) methods.push("Magic Link");
        if (loginMethods.emailOtp) methods.push("Email OTP");
        if (loginMethods.totp) methods.push("TOTP");
        if (loginMethods.pushNotification) methods.push("Push Notification");

        return methods;
    }, [ loginMethods ]);

    return (
        <PreviewWrapper data-componentid={ componentId }>
            <PreviewContainer scale={ scale }>
                { logoUrl && (
                    <LogoContainer>
                        <Avatar
                            alt="Logo"
                            src={ logoUrl }
                            sx={ {
                                backgroundColor: primaryColor,
                                height: 56,
                                width: 56
                            } }
                        />
                    </LogoContainer>
                ) }

                <Title>Sign In</Title>

                <FormContainer>
                    { /* Identifier field */ }
                    { hasIdentifier && (
                        <PreviewTextField
                            disabled
                            fullWidth
                            label={ identifierLabel }
                            placeholder={ `Enter your ${identifierLabel.toLowerCase()}` }
                            size="small"
                            variant="outlined"
                        />
                    ) }

                    { /* Password field - only shown when password is selected */ }
                    { hasIdentifier && hasPassword && (
                        <PreviewTextField
                            disabled
                            fullWidth
                            label="Password"
                            placeholder="Enter your password"
                            size="small"
                            type="password"
                            variant="outlined"
                        />
                    ) }

                    { /* Primary action button */ }
                    { hasIdentifier && hasAnyLoginMethod && (
                        <PrimaryButtonStyled
                            customcolor={ primaryColor }
                            disabled
                            fullWidth
                            variant="contained"
                        >
                            { hasPassword ? "Sign In" : "Continue" }
                        </PrimaryButtonStyled>
                    ) }

                    { /* Additional methods summary when password is selected */ }
                    { hasPassword && hasOtherMethods && hasIdentifier && (
                        <>
                            <Divider sx={ { my: 1 } } />
                            <Typography
                                color="text.secondary"
                                sx={ { fontSize: "0.75rem", textAlign: "center" } }
                            >
                                Additional sign-in options:
                            </Typography>
                            <Typography
                                color="text.primary"
                                sx={ { fontSize: "0.8125rem", fontWeight: 500, textAlign: "center" } }
                            >
                                { otherMethodsList.join(" • ") }
                            </Typography>
                        </>
                    ) }

                    { /* Login methods summary for Identifier First flow (no password) */ }
                    { !hasPassword && hasAnyLoginMethod && hasIdentifier && (
                        <>
                            <Divider sx={ { my: 1 } } />
                            <Typography
                                color="text.secondary"
                                sx={ { fontSize: "0.75rem", textAlign: "center" } }
                            >
                                After identification, users can sign in with:
                            </Typography>
                            <Typography
                                color="text.primary"
                                sx={ { fontSize: "0.8125rem", fontWeight: 500, textAlign: "center" } }
                            >
                                { loginMethodsList.join(" • ") }
                            </Typography>
                        </>
                    ) }

                    { /* Empty state */ }
                    { !hasIdentifier && !hasAnyLoginMethod && (
                        <Typography
                            color="text.secondary"
                            sx={ { fontStyle: "italic", textAlign: "center" } }
                        >
                            Select sign-in options to preview
                        </Typography>
                    ) }

                    { hasIdentifier && !hasAnyLoginMethod && (
                        <Typography
                            color="error"
                            sx={ { fontSize: "0.75rem", mt: 1, textAlign: "center" } }
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
                </FormContainer>
            </PreviewContainer>
        </PreviewWrapper>
    );
});

LoginBoxPreview.displayName = "LoginBoxPreview";

export default LoginBoxPreview;
