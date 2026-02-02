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
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo
} from "react";
import {
    OnboardingComponentIds,
    RedirectUrlConstraints,
    getDefaultRedirectUrl,
    isLocalhostUrl
} from "../../constants";
import Hint from "../shared/hint";
import { LeftColumn, TwoColumnLayout } from "../shared/onboarding-styles";
import StepHeader from "../shared/step-header";

/**
 * Props interface for ConfigureRedirectUrlStep component.
 */
interface ConfigureRedirectUrlStepProps extends IdentifiableComponentInterface {
    /** Current redirect URLs */
    redirectUrls: string[];
    /** Template ID for determining defaults */
    templateId?: string;
    /** Framework for determining defaults */
    framework?: string;
    /** Callback when redirect URLs change */
    onRedirectUrlsChange: (urls: string[]) => void;
}

/**
 * Container for URL input and delete button.
 */
const UrlInputRow = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "flex-start",
    display: "flex",
    gap: theme.spacing(1)
}));

/**
 * Container for all URL inputs.
 */
const UrlInputsContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    maxWidth: 500
}));

/**
 * Helper text for the input.
 */
const HelperText = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    marginTop: theme.spacing(0.5)
}));

/**
 * Validate a URL string.
 */
const validateUrl = (url: string): string | null => {
    if (!url.trim()) {
        return "URL is required";
    }

    if (!RedirectUrlConstraints.PATTERN.test(url)) {
        return "Enter a valid URL (http:// or https://)";
    }

    return null;
};

/**
 * Get step title based on template/framework.
 */
const getStepTitle = (templateId?: string): string => {
    if (templateId === "mobile-application") {
        return "Configure Redirect URI";
    }

    return "Configure Authorized Redirect URL";
};

/**
 * Get step subtitle based on template/framework.
 */
const getStepSubtitle = (templateId?: string): string => {
    if (templateId === "mobile-application") {
        return "Enter the redirect URI for your mobile application.";
    }

    return "This is where users will be redirected after authentication.";
};

/**
 * Configure redirect URL step component for onboarding.
 */
const ConfigureRedirectUrlStep: FunctionComponent<ConfigureRedirectUrlStepProps> = (
    props: ConfigureRedirectUrlStepProps
): ReactElement => {
    const {
        redirectUrls,
        templateId,
        framework,
        onRedirectUrlsChange,
        ["data-componentid"]: componentId = OnboardingComponentIds.CONFIGURE_REDIRECT_URL_STEP
    } = props;

    // Set default URL on mount if no URLs are set
    useEffect(() => {
        if (redirectUrls.length === 0) {
            const defaultUrls: string[] = getDefaultRedirectUrl(framework || templateId);

            onRedirectUrlsChange(defaultUrls);
        }
    }, [ framework, templateId ]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleUrlChange = useCallback((index: number, value: string): void => {
        const newUrls: string[] = [ ...redirectUrls ];

        newUrls[index] = value;
        onRedirectUrlsChange(newUrls);
    }, [ redirectUrls, onRedirectUrlsChange ]);

    const handleAddUrl = useCallback((): void => {
        if (redirectUrls.length < RedirectUrlConstraints.MAX_URLS) {
            onRedirectUrlsChange([ ...redirectUrls, "" ]);
        }
    }, [ redirectUrls, onRedirectUrlsChange ]);

    const handleRemoveUrl = useCallback((index: number): void => {
        const newUrls: string[] = redirectUrls.filter((_: string, i: number) => i !== index);

        onRedirectUrlsChange(newUrls.length > 0 ? newUrls : [ "" ]);
    }, [ redirectUrls, onRedirectUrlsChange ]);

    const canAddMore: boolean = redirectUrls.length < RedirectUrlConstraints.MAX_URLS;
    const canRemove: boolean = redirectUrls.length > 1;

    const defaultUrls: string[] = useMemo(
        () => getDefaultRedirectUrl(framework || templateId),
        [ framework, templateId ]
    );

    const isUsingDefault: boolean = useMemo(() => {
        if (redirectUrls.length !== defaultUrls.length) return false;

        return redirectUrls.every((url: string, index: number) => url === defaultUrls[index]);
    }, [ redirectUrls, defaultUrls ]);

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <LeftColumn>
                <StepHeader
                    data-componentid={ `${componentId}-header` }
                    subtitle={ getStepSubtitle(templateId) }
                    title={ getStepTitle(templateId) }
                />

                <UrlInputsContainer>
                    { redirectUrls.map((url: string, index: number) => {
                        const error: string | null = url ? validateUrl(url) : null;
                        const isLocalhost: boolean = isLocalhostUrl(url);

                        return (
                            <UrlInputRow key={ index }>
                                <Box sx={ { flex: 1 } }>
                                    <TextField
                                        error={ !!error }
                                        fullWidth
                                        helperText={ error }
                                        label={ redirectUrls.length > 1
                                            ? `Redirect URL ${index + 1}`
                                            : "Redirect URL"
                                        }
                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleUrlChange(index, e.target.value)
                                        }
                                        placeholder="https://your-app.com/callback"
                                        value={ url }
                                        data-componentid={ `${componentId}-input-${index}` }
                                    />
                                    { isLocalhost && !error && (
                                        <HelperText>
                                            Localhost URLs are fine for development
                                        </HelperText>
                                    ) }
                                </Box>
                                { canRemove && (
                                    <IconButton
                                        color="error"
                                        onClick={ () => handleRemoveUrl(index) }
                                        size="small"
                                        sx={ { mt: 1 } }
                                        data-componentid={ `${componentId}-remove-${index}` }
                                    >
                                        <TrashIcon />
                                    </IconButton>
                                ) }
                            </UrlInputRow>
                        );
                    }) }

                    { canAddMore && (
                        <Button
                            onClick={ handleAddUrl }
                            size="small"
                            startIcon={ <PlusIcon /> }
                            variant="text"
                            data-componentid={ `${componentId}-add-button` }
                        >
                            Add another URL
                        </Button>
                    ) }

                    { !isUsingDefault && (
                        <Hint message={ `Default for ${framework || "your selection"}: ${defaultUrls[0]}` } />
                    ) }
                </UrlInputsContainer>
            </LeftColumn>
        </TwoColumnLayout>
    );
};

export default ConfigureRedirectUrlStep;
