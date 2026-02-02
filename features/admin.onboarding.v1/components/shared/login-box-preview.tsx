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
 * Social login button.
 */
const SocialButton = styled(Button)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    fontWeight: 500,
    padding: "10px 16px",
    textTransform: "none",
    "&:hover": {
        backgroundColor: theme.palette.action.hover
    }
}));

/**
 * Passkey option link.
 */
const PasskeyLink = styled(Typography)<{ customcolor: string }>(({ customcolor }) => ({
    color: customcolor,
    cursor: "pointer",
    fontSize: "0.875rem",
    marginTop: 8,
    textAlign: "center",
    "&:hover": {
        textDecoration: "underline"
    }
}));

/**
 * Divider with text.
 */
const DividerWithText = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    margin: theme.spacing(2, 0),
    "& hr": {
        flex: 1
    },
    "& span": {
        color: theme.palette.text.secondary,
        fontSize: "0.8125rem",
        padding: theme.spacing(0, 2)
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
    credentials: { passkey: false, password: true },
    identifiers: { email: true, mobile: false, username: true },
    socialLogins: { google: false }
};

/**
 * Default branding config for preview.
 */
const DEFAULT_BRANDING: OnboardingBrandingConfig = {
    primaryColor: "#ff7300"
};

/**
 * Login box preview component.
 * Displays a simplified preview of the login experience based on sign-in options and branding.
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
    const { identifiers, credentials, socialLogins } = signInOptions;

    const hasIdentifier: boolean = identifiers.username || identifiers.email || identifiers.mobile;
    const hasPassword: boolean = credentials.password;
    const hasPasskey: boolean = credentials.passkey;
    const hasGoogle: boolean = socialLogins.google;
    const hasSocialOrPasskey: boolean = hasGoogle || hasPasskey;

    const identifierLabel: string = useMemo(
        () => getIdentifierLabel(signInOptions),
        [ signInOptions ]
    );

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

                    { hasPassword && (
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

                    { (hasIdentifier || hasPassword) && (
                        <PrimaryButtonStyled
                            customcolor={ primaryColor }
                            disabled
                            fullWidth
                            variant="contained"
                        >
                            Sign In
                        </PrimaryButtonStyled>
                    ) }

                    { hasPasskey && !hasGoogle && (
                        <PasskeyLink customcolor={ primaryColor }>
                            Sign in with Passkey
                        </PasskeyLink>
                    ) }

                    { hasSocialOrPasskey && (hasIdentifier || hasPassword) && (
                        <DividerWithText>
                            <Divider />
                            <span>or</span>
                            <Divider />
                        </DividerWithText>
                    ) }

                    { hasGoogle && (
                        <SocialButton disabled fullWidth startIcon={ <GoogleIcon /> }>
                            Continue with Google
                        </SocialButton>
                    ) }

                    { hasPasskey && hasGoogle && (
                        <SocialButton disabled fullWidth startIcon={ <PasskeyIcon /> }>
                            Sign in with Passkey
                        </SocialButton>
                    ) }

                    { !hasIdentifier && !hasPassword && !hasSocialOrPasskey && (
                        <Typography
                            color="text.secondary"
                            sx={ { fontStyle: "italic", textAlign: "center" } }
                        >
                            Select sign-in options to preview
                        </Typography>
                    ) }
                </FormContainer>
            </PreviewContainer>
        </PreviewWrapper>
    );
});

LoginBoxPreview.displayName = "LoginBoxPreview";

/**
 * Simple Google icon component.
 */
const GoogleIcon: FunctionComponent = (): ReactElement => (
    <svg height="18" viewBox="0 0 24 24" width="18">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

/**
 * Simple Passkey icon component.
 */
const PasskeyIcon: FunctionComponent = (): ReactElement => (
    <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18">
        <path d="M12 1C8.14 1 5 4.14 5 8c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h1v1c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-1h1c.55 0 1-.45 1-1v-3.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm0 10c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
    </svg>
);

export default LoginBoxPreview;
