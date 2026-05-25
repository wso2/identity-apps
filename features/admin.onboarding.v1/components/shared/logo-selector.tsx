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
import Tooltip from "@oxygen-ui/react/Tooltip";
import { BrandingPreferencesConstants } from "@wso2is/admin.branding.v1/constants/branding-preferences-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { URLUtils } from "@wso2is/core/utils";
import React, { FunctionComponent, ReactElement, memo, useCallback, useEffect, useRef, useState } from "react";
import { SectionLabel, StyledTextField } from "./onboarding-styles";
import { OnboardingComponentIds } from "../../constants";
import {
    AVATAR_NAMES,
    getAnimalNameFromUrl,
    getAvatarDisplayImage,
    getAvatarLogoUrl
} from "../../constants/preset-logos";

/**
 * Props interface for LogoSelector component.
 */
interface LogoSelectorPropsInterface extends IdentifiableComponentInterface {
    /** Currently selected logo URL */
    selectedLogoUrl?: string;
    /** Callback when a logo is selected */
    onLogoSelect: (logoUrl: string | undefined) => void;
    /** Label for the selector */
    label?: string;
}

/**
 * Container for the logo selector.
 */
const LogoSelectorContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5)
}));

/**
 * Grid container for logo options.
 */
const LogoGrid: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1.5),
    padding: theme.spacing(1)
}));


/**
 * Logo selector component using local animal avatar images.
 * Displays all available avatars for user selection.
 */
const LogoSelector: FunctionComponent<LogoSelectorPropsInterface> = memo((
    props: LogoSelectorPropsInterface
): ReactElement => {
    const {
        selectedLogoUrl,
        onLogoSelect,
        label = "Choose a logo",
        ["data-componentid"]: componentId = OnboardingComponentIds.LOGO_SELECTOR
    } = props;

    // Generate all logo URLs from avatar names
    const logos: string[] = AVATAR_NAMES.map(getAvatarLogoUrl);

    // Track initialization to select first logo by default
    const initializedRef: React.MutableRefObject<boolean> = useRef<boolean>(false);

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;

            // Select first logo by default if none selected
            if (logos.length > 0 && !selectedLogoUrl) {
                onLogoSelect(logos[0]);
            }
        }
    // Only run on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Local state for the custom URL input and validation
    const [ customUrl, setCustomUrl ] = useState<string>("");
    const [ urlError, setUrlError ] = useState<string>("");

    // Check if the current selection is a custom URL (not a preset avatar)
    const isCustomUrlSelected: boolean = !!selectedLogoUrl && !getAnimalNameFromUrl(selectedLogoUrl);

    // Sync local input when an external custom URL is already selected
    useEffect(() => {
        if (isCustomUrlSelected && selectedLogoUrl) {
            setCustomUrl(selectedLogoUrl);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogoSelect: (logoUrl: string) => void = useCallback((logoUrl: string): void => {
        setCustomUrl("");
        setUrlError("");
        onLogoSelect(logoUrl);
    }, [ onLogoSelect ]);

    const handleKeyDown: (event: React.KeyboardEvent, logoUrl: string) => void = useCallback(
        (event: React.KeyboardEvent, logoUrl: string): void => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleLogoSelect(logoUrl);
            }
        },
        [ handleLogoSelect ]
    );

    const handleCustomUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            const value: string = event.target.value;

            setCustomUrl(value);

            if (urlError) {
                setUrlError("");
            }
        },
        [ urlError ]
    );

    const handleCustomUrlBlur: () => void = useCallback((): void => {
        const trimmed: string = customUrl.trim();

        if (!trimmed) {
            setUrlError("");

            return;
        }

        const { LOGO_URL_MIN_LENGTH, LOGO_URL_MAX_LENGTH } =
            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS;

        if (trimmed.length < LOGO_URL_MIN_LENGTH || trimmed.length > LOGO_URL_MAX_LENGTH) {
            setUrlError(`URL must be between ${LOGO_URL_MIN_LENGTH} and ${LOGO_URL_MAX_LENGTH} characters`);

            return;
        }

        if (!URLUtils.isHttpsOrHttpUrl(trimmed)) {
            setUrlError("Please enter a valid URL starting with https:// or http://");

            return;
        }

        setUrlError("");
        onLogoSelect(trimmed);
    }, [ customUrl, onLogoSelect ]);

    return (
        <LogoSelectorContainer data-componentid={ componentId }>
            <SectionLabel>{ label }</SectionLabel>
            <LogoGrid>
                { logos.map((logoUrl: string) => {
                    const isSelected: boolean = selectedLogoUrl === logoUrl;
                    const animalName: string = getAnimalNameFromUrl(logoUrl);
                    const displayImageSrc: string = getAvatarDisplayImage(animalName);

                    return (
                        <Tooltip key={ logoUrl } title={ animalName }>
                            <Box
                                aria-label={ `Select ${animalName} logo` }
                                aria-pressed={ isSelected }
                                data-componentid={ `${componentId}-${animalName.toLowerCase()}` }
                                onClick={ () => handleLogoSelect(logoUrl) }
                                onKeyDown={ (event: React.KeyboardEvent) => handleKeyDown(event, logoUrl) }
                                role="button"
                                tabIndex={ 0 }
                                sx={ (theme: Theme) => ({
                                    "&:focus-visible": {
                                        outline: `2px solid ${theme.palette.primary.main}`,
                                        outlineOffset: 2
                                    },
                                    "&:hover": {
                                        borderColor: theme.palette.primary.main,
                                        transform: "scale(1.05)"
                                    },
                                    alignItems: "center",
                                    backgroundColor: theme.palette.background.paper,
                                    border: isSelected
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : `2px solid ${theme.palette.divider}`,
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    height: 50,
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    padding: "6px",
                                    transition: "all 0.15s ease-in-out",
                                    width: 50
                                }) }
                            >
                                <Box
                                    alt={ animalName }
                                    component="img"
                                    src={ displayImageSrc }
                                    sx={ {
                                        height: "100%",
                                        objectFit: "contain",
                                        width: "100%"
                                    } }
                                />
                            </Box>
                        </Tooltip>
                    );
                }) }
            </LogoGrid>
            <StyledTextField
                data-componentid={ `${componentId}-${OnboardingComponentIds.LOGO_URL_INPUT}` }
                error={ !!urlError }
                fullWidth
                helperText={ urlError || undefined }
                label="Or use your own logo URL"
                onBlur={ handleCustomUrlBlur }
                onChange={ handleCustomUrlChange }
                placeholder="https://your-company.com/logo.png"
                size="small"
                sx={ { mt: 1 } }
                value={ customUrl }
            />
        </LogoSelectorContainer>
    );
});

LogoSelector.displayName = "LogoSelector";

export default LogoSelector;
