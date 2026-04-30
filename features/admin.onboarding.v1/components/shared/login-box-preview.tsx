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
import Divider from "@oxygen-ui/react/Divider";
import Paper from "@oxygen-ui/react/Paper";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { getConnectionIcons } from "@wso2is/admin.connections.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo, useMemo } from "react";
import { FIRST_FACTOR_METHOD_IDS, OnboardingComponentIds } from "../../constants";
import { getAnimalNameFromUrl, getAvatarDisplayImage } from "../../constants/preset-logos";
import { OnboardingBrandingConfigInterface } from "../../models/branding";
import { SignInOptionsConfigInterface } from "../../models/sign-in-options";

/**
 * Auth method display configuration interface.
 */
interface AuthMethodDisplayConfigInterface {
    /** Icon - can be string path or React component */
    icon: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
    /** Display label */
    label: string;
}

/**
 * Get auth method display configuration with proper icons.
 */
const getAuthMethodConfig: () => Record<string, AuthMethodDisplayConfigInterface> =
    (): Record<string, AuthMethodDisplayConfigInterface> => ({
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
interface LoginBoxPreviewPropsInterface extends IdentifiableComponentInterface {
    /** Sign-in options configuration */
    signInOptions?: SignInOptionsConfigInterface;
    /** Branding configuration */
    brandingConfig?: OnboardingBrandingConfigInterface;
    /** Whether self-registration is enabled */
    selfRegistrationEnabled?: boolean;
    /** Scale factor for the preview */
    scale?: number;
}

/**
 * Browser-chrome frame that grounds the preview visually.
 */
const BrowserFrame: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[1],
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    width: "100%"
}));

/**
 * Faux browser toolbar with window-control dots.
 */
const BrowserToolbar: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    gap: theme.spacing(0.75),
    padding: theme.spacing(1, 1.5)
}));

/**
 * Single toolbar dot (macOS-style window control).
 */
const ToolbarDot: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.grey[300],
    borderRadius: "50%",
    height: 8,
    width: 8
}));

/**
 * Browser content area with subtle background.
 */
const BrowserContent: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.grey[50],
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: theme.spacing(2),
    justifyContent: "center",
    minHeight: 480,
    padding: theme.spacing(4, 3)
}));

/**
 * Login card — the primary sign-in form.
 */
const LoginCard: typeof Paper = styled(Paper)(({ theme }: { theme: Theme }) => ({
    borderRadius: theme.shape.borderRadius * 1.5,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    maxWidth: 340,
    padding: theme.spacing(3, 2.5),
    width: "100%"
}));

/**
 * Compact strip below the login card showing second-step verification methods.
 */
const Step2Strip: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 1.5,
    display: "flex",
    gap: theme.spacing(1.5),
    maxWidth: 340,
    padding: theme.spacing(1.5, 2),
    width: "100%"
}));

/**
 * Small icon container for the step 2 strip.
 */
const Step2MethodIcon: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.grey[50],
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    height: 28,
    justifyContent: "center",
    width: 28
}));

/**
 * Styled text field for preview.
 */
const PreviewTextField: typeof TextField = styled(TextField)(({ theme }: { theme: Theme }) => ({
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
const PrimaryButtonStyled: typeof Button = styled(Button)(() => ({
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: 500,
    padding: "8px 16px",
    pointerEvents: "none",
    textTransform: "none"
}));

/**
 * Icon container for sign-in option buttons.
 */
const IconImage: React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>> = styled("img")({
    height: 16,
    objectFit: "contain",
    width: 16
});

/**
 * Get the identifier field label based on selected options.
 */
const getIdentifierLabel: (signInOptions: SignInOptionsConfigInterface) => string =
    (signInOptions: SignInOptionsConfigInterface): string => {
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
 * Displays a unified single-card preview of the login experience.
 */
const LoginBoxPreview: FunctionComponent<LoginBoxPreviewPropsInterface> = memo((
    props: LoginBoxPreviewPropsInterface
): ReactElement => {
    const {
        signInOptions = DEFAULT_PREVIEW_OPTIONS,
        brandingConfig = DEFAULT_BRANDING,
        selfRegistrationEnabled = false,
        scale: _scale,
        ["data-componentid"]: componentId = OnboardingComponentIds.LOGIN_BOX_PREVIEW
    } = props;

    const { primaryColor } = brandingConfig;
    const { identifiers, loginMethods } = signInOptions;

    const hasIdentifier: boolean = identifiers.username || identifiers.email || identifiers.mobile;
    const hasPassword: boolean = loginMethods.password;
    const hasPasskey: boolean = loginMethods.passkey;
    const hasMagicLink: boolean = loginMethods.magicLink;
    const hasAnyLoginMethod: boolean = loginMethods.password || loginMethods.passkey ||
        loginMethods.magicLink || loginMethods.emailOtp || loginMethods.totp ||
        loginMethods.pushNotification;

    const identifierLabel: string = useMemo(
        () => getIdentifierLabel(signInOptions),
        [ signInOptions ]
    );

    const authMethodConfig: Record<string, AuthMethodDisplayConfigInterface> = useMemo(
        () => getAuthMethodConfig(),
        []
    );

    // Second-step verification methods (exclude first-factor methods: password, passkey, magicLink)
    const step2Methods: string[] = useMemo(() => {
        return Object.entries(loginMethods)
            .filter(([ key, enabled ]: [string, boolean]) =>
                enabled && !FIRST_FACTOR_METHOD_IDS.includes(key)
            )
            .map(([ key ]: [string, boolean]) => key);
    }, [ loginMethods ]);

    /**
     * Render icon for a method - handles both string paths and React components.
     */
    const renderIcon: (
        icon: AuthMethodDisplayConfigInterface["icon"] | undefined,
        size?: number
    ) => ReactElement | null =
        (
            icon: AuthMethodDisplayConfigInterface["icon"] | undefined,
            size: number = 16
        ): ReactElement | null => {
            if (!icon) return null;

            if (typeof icon === "string") {
                return <IconImage src={ icon } alt="" style={ { height: size, width: size } } />;
            }

            const IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>> = icon;

            return (
                <Box sx={ { display: "flex", height: size, width: size } }>
                    <IconComponent style={ { height: "100%", width: "100%" } } />
                </Box>
            );
        };

    return (
        <BrowserFrame data-componentid={ componentId }>
            <BrowserToolbar>
                <ToolbarDot />
                <ToolbarDot />
                <ToolbarDot />
            </BrowserToolbar>
            <BrowserContent>
                { /* Empty state */ }
                { !hasIdentifier && !hasAnyLoginMethod && (
                    <Typography
                        color="text.secondary"
                        sx={ { fontStyle: "italic", py: 6, textAlign: "center" } }
                    >
                        Select sign-in options to preview
                    </Typography>
                ) }

                { /* Error states */ }
                { hasIdentifier && !hasAnyLoginMethod && (
                    <Typography
                        color="error"
                        sx={ { fontSize: "0.75rem", py: 6, textAlign: "center" } }
                    >
                        Select at least one login method
                    </Typography>
                ) }

                { !hasIdentifier && hasAnyLoginMethod && (
                    <Typography
                        color="error"
                        sx={ { fontSize: "0.75rem", py: 6, textAlign: "center" } }
                    >
                        Select at least one identifier
                    </Typography>
                ) }

                { /* Login card (Step 1: identifier + password/passkey) */ }
                { hasIdentifier && hasAnyLoginMethod && (
                    <>
                        <LoginCard variant="outlined">
                            { brandingConfig.logoUrl && (() => {
                                const animalName: string =
                                    getAnimalNameFromUrl(brandingConfig.logoUrl);
                                const logoSrc: string = animalName
                                    ? getAvatarDisplayImage(animalName)
                                    : brandingConfig.logoUrl;

                                return (
                                    <Box
                                        sx={ {
                                            display: "flex",
                                            justifyContent: "center",
                                            mb: 0.5
                                        } }>
                                        <Box
                                            component="img"
                                            src={ logoSrc }
                                            alt="Application logo"
                                            sx={ {
                                                height: 48,
                                                maxWidth: "100%",
                                                objectFit: "contain",
                                                width: 48
                                            } }
                                        />
                                    </Box>
                                );
                            })() }
                            <Typography
                                sx={ { mb: 0.5, textAlign: "center" } }
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
                                sx={ { backgroundColor: primaryColor, mt: 1 } }
                            >
                                { hasPassword ? "Sign In" : "Continue" }
                            </PrimaryButtonStyled>
                            { (hasPasskey || hasMagicLink) && (
                                <>
                                    <Divider sx={ { fontSize: "0.625rem" } }>OR</Divider>
                                    { hasPasskey && (
                                        <Button
                                            fullWidth
                                            startIcon={ renderIcon(authMethodConfig.passkey?.icon, 16) }
                                            sx={ {
                                                border: (t: Theme) =>
                                                    `1px solid ${t.palette.divider}`,
                                                borderRadius: 1,
                                                color: "text.primary",
                                                fontSize: "0.6875rem",
                                                justifyContent: "flex-start",
                                                pointerEvents: "none",
                                                textTransform: "none"
                                            } }
                                            variant="outlined"
                                        >
                                            Sign In With Passkey
                                        </Button>
                                    ) }
                                    { hasMagicLink && (
                                        <Button
                                            fullWidth
                                            startIcon={
                                                renderIcon(authMethodConfig.magicLink?.icon, 16) }
                                            sx={ {
                                                border: (t: Theme) =>
                                                    `1px solid ${t.palette.divider}`,
                                                borderRadius: 1,
                                                color: "text.primary",
                                                fontSize: "0.6875rem",
                                                justifyContent: "flex-start",
                                                pointerEvents: "none",
                                                textTransform: "none"
                                            } }
                                            variant="outlined"
                                        >
                                            Sign In With Magic Link
                                        </Button>
                                    ) }
                                </>
                            ) }
                            { selfRegistrationEnabled && (
                                <Typography
                                    sx={ {
                                        color: "text.primary",
                                        cursor: "default",
                                        fontSize: "0.6875rem",
                                        mt: 0.5,
                                        pointerEvents: "none",
                                        textAlign: "center"
                                    } }
                                >
                                    Don&apos;t have an account?
                                    { " " }
                                    <Typography
                                        component="span"
                                        sx={ {
                                            color: primaryColor,
                                            fontSize: "0.6875rem"
                                        } }
                                    >
                                        Register
                                    </Typography>
                                </Typography>
                            ) }
                        </LoginCard>

                        { /* Step 2 verification strip */ }
                        { step2Methods.length > 0 && (
                            <Step2Strip>
                                <Typography
                                    sx={ {
                                        color: "text.secondary",
                                        fontSize: "0.6875rem",
                                        fontWeight: 500,
                                        whiteSpace: "nowrap"
                                    } }
                                >
                                    Step 2
                                </Typography>
                                <Divider
                                    flexItem
                                    orientation="vertical"
                                />
                                <Box
                                    sx={ {
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.75
                                    } }
                                >
                                    { step2Methods.map((methodKey: string) => {
                                        const config: AuthMethodDisplayConfigInterface =
                                            authMethodConfig[methodKey];

                                        if (!config) return null;

                                        return (
                                            <Tooltip
                                                key={ methodKey }
                                                placement="top"
                                                title={ config.label }
                                            >
                                                <Step2MethodIcon>
                                                    { renderIcon(config.icon, 14) }
                                                </Step2MethodIcon>
                                            </Tooltip>
                                        );
                                    }) }
                                </Box>
                            </Step2Strip>
                        ) }
                    </>
                ) }
            </BrowserContent>
        </BrowserFrame>
    );
});

LoginBoxPreview.displayName = "LoginBoxPreview";

export default LoginBoxPreview;
