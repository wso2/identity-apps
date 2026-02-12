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
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { ApplicationTemplateIdTypes } from "@wso2is/admin.applications.v1/models/application";
import { PatternConstants } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { URLUtils } from "@wso2is/core/utils";
import React, {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef
} from "react";
import {
    OnboardingComponentIds,
    getDefaultRedirectUrl,
    isKnownDefaultUrl
} from "../../constants";
import Hint from "../shared/hint";
import { LeftColumn, TwoColumnLayout } from "../shared/onboarding-styles";
import StepHeader from "../shared/step-header";

/**
 * Props interface for ConfigureRedirectUrlStep component.
 */
interface ConfigureRedirectUrlStepPropsInterface extends IdentifiableComponentInterface {
    /** Current redirect URLs (array for API compatibility, but only first is used) */
    redirectUrls: string[];
    /** Template ID for determining defaults */
    templateId?: string;
    /** Framework for determining defaults */
    framework?: string;
    /** Callback when redirect URLs change */
    onRedirectUrlsChange: (urls: string[]) => void;
}

/**
 * Container for URL input.
 */
const UrlInputContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    maxWidth: 600
}));

/**
 * Helper text for the input.
 */
const HelperText: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    marginTop: theme.spacing(0.5)
}));

/**
 * Check if URL is localhost (for development hints).
 */
const isLocalhostUrl: (url: string) => boolean = (url: string): boolean => {
    return URLUtils.isLoopBackCall(url);
};

/**
 * Validate a URL string based on template type.
 * @param url - URL to validate
 * @param isMobile - Whether this is for a mobile application
 * @returns Error message or null if valid
 */
const validateUrl: (url: string, isMobile?: boolean) => string | null = (
    url: string, isMobile: boolean = false
): string | null => {
    if (!url.trim()) {
        return isMobile ? "Redirect URI is required" : "Redirect URL is required";
    }

    if (url.length > 2048) {
        return "URL is too long";
    }

    if (isMobile) {
        // Mobile apps accept custom schemes (myapp://) or https://
        if (!PatternConstants.MOBILE_DEEP_LINK_URL_REGEX_PATTERN.test(url)) {
            return "Enter a valid redirect URI (e.g., com.yourapp://callback or https://...)";
        }
    } else {
        // Web apps require http:// or https://
        if (!URLUtils.isHttpsOrHttpUrl(url)) {
            return "Enter a valid URL starting with http:// or https://";
        }

        // Additional sanity check for XSS prevention
        if (!URLUtils.isURLValid(url, true)) {
            return "Enter a valid URL";
        }
    }

    return null;
};

/**
 * Check if the template is for a mobile application.
 */
const isMobileTemplate: (templateId?: string) => boolean = (templateId?: string): boolean => {
    return templateId === ApplicationTemplateIdTypes.MOBILE_APPLICATION;
};

/**
 * Get step title based on template/framework.
 */
const getStepTitle: (templateId?: string) => string = (templateId?: string): string => {
    if (isMobileTemplate(templateId)) {
        return "Configure Redirect URI";
    }

    return "Configure Authorized Redirect URL";
};

/**
 * Get step subtitle based on template/framework.
 * Redirect URIs are a security whitelist - only registered URLs can receive
 * the authorization response after user authentication.
 */
const getStepSubtitle: (templateId?: string) => string = (templateId?: string): string => {
    if (isMobileTemplate(templateId)) {
        return "Authorize where your app can receive users after login. " +
            "Enter the custom URI scheme configured in your mobile app.";
    }

    return "Authorize where your app can receive users after login. " +
        "This is typically the URL in your browser when running your app locally.";
};

/**
 * Get input label based on template type.
 */
const getInputLabel: (templateId?: string) => string = (templateId?: string): string => {
    return isMobileTemplate(templateId) ? "Authorized Redirect URI" : "Authorized Redirect URL";
};

/**
 * Get placeholder text based on template type.
 */
const getPlaceholder: (templateId?: string) => string = (templateId?: string): string => {
    if (isMobileTemplate(templateId)) {
        return "com.yourcompany.app://oauth2redirect";
    }

    return "https://your-app.com/callback";
};

/**
 * Configure redirect URL step component for onboarding.
 * Simplified to accept only one URL for a streamlined onboarding experience.
 */
const ConfigureRedirectUrlStep: FunctionComponent<ConfigureRedirectUrlStepPropsInterface> = (
    props: ConfigureRedirectUrlStepPropsInterface
): ReactElement => {
    const {
        redirectUrls,
        templateId,
        framework,
        onRedirectUrlsChange,
        ["data-componentid"]: componentId = OnboardingComponentIds.CONFIGURE_REDIRECT_URL_STEP
    } = props;

    const isMobile: boolean = useMemo(() => isMobileTemplate(templateId), [ templateId ]);
    const inputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    // Get the current URL value (first in array, or empty string)
    const currentUrl: string = redirectUrls[0] || "";

    // Auto-focus input field when step loads
    useEffect(() => {
        const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Set default URL when framework/template changes
    // Updates if: no URL, empty URL, or URL is a known default (user hasn't edited)
    useEffect(() => {
        const hasNoUrl: boolean = !currentUrl;
        const hasEmptyUrl: boolean = !currentUrl.trim();
        const hasKnownDefault: boolean = currentUrl && isKnownDefaultUrl(currentUrl);

        if (hasNoUrl || hasEmptyUrl || hasKnownDefault) {
            const defaultUrls: string[] = getDefaultRedirectUrl(framework || templateId);

            if (defaultUrls.length > 0) {
                onRedirectUrlsChange([ defaultUrls[0] ]);
            } else {
                // For generic types without defaults, start with empty input
                onRedirectUrlsChange([ "" ]);
            }
        }
    }, [ framework, templateId ]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            onRedirectUrlsChange([ event.target.value ]);
        },
        [ onRedirectUrlsChange ]
    );

    const validationError: string | null = currentUrl ? validateUrl(currentUrl, isMobile) : null;
    const isLocalhost: boolean = currentUrl ? isLocalhostUrl(currentUrl) : false;

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    subtitle={ getStepSubtitle(templateId) }
                    title={ getStepTitle(templateId) }
                />

                <UrlInputContainer>
                    <Box>
                        <TextField
                            error={ !!validationError }
                            fullWidth
                            helperText={ validationError }
                            inputRef={ inputRef }
                            label={ getInputLabel(templateId) }
                            onChange={ handleUrlChange }
                            placeholder={ getPlaceholder(templateId) }
                            value={ currentUrl }
                            data-componentid={ `${componentId}-input` }
                        />
                        { isLocalhost && !validationError && (
                            <HelperText>
                                Localhost { isMobile ? "URIs are" : "URLs are" } fine for development
                            </HelperText>
                        ) }
                    </Box>

                    { /* Conditional hints based on template type - web or mobile */ }
                    { !isMobile && (
                        <Hint collapsible message="Not sure where to find this?">
                            <Box
                                component="ol"
                                sx={ {
                                    color: "text.secondary",
                                    fontSize: "0.8125rem",
                                    lineHeight: 1.6,
                                    m: 0,
                                    pl: 2.5
                                } }
                            >
                                <li>Start your app locally</li>
                                <li>Copy the URL from your browser&apos;s address bar</li>
                                <li>Paste it here</li>
                            </Box>
                        </Hint>
                    ) }
                    { isMobile && (
                        <Hint collapsible message="Not sure where to find this?">
                            <Box
                                component="ol"
                                sx={ {
                                    color: "text.secondary",
                                    fontSize: "0.8125rem",
                                    lineHeight: 1.6,
                                    m: 0,
                                    pl: 2.5
                                } }
                            >
                                <li>
                                    Check your mobile app&apos;s authentication setup
                                    <Box component="ul" sx={ { m: 0, mt: 0.5, pl: 2 } }>
                                        <li>Android: AndroidManifest.xml</li>
                                        <li>iOS: Info.plist</li>
                                    </Box>
                                </li>
                                <li>Copy the redirect URI configured there</li>
                                <li>Paste it here</li>
                            </Box>
                        </Hint>
                    ) }
                </UrlInputContainer>
            </LeftColumn>
        </TwoColumnLayout>
    );
};

export default ConfigureRedirectUrlStep;
