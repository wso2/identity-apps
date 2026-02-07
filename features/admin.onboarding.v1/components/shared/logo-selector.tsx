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
import Link from "@oxygen-ui/react/Link";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo, useCallback, useEffect, useRef, useState } from "react";
import { OnboardingComponentIds } from "../../constants";
import { generateLogoSuggestions, getAnimalNameFromUrl } from "../../constants/preset-logos";

/**
 * Props interface for LogoSelector component.
 */
export interface LogoSelectorProps extends IdentifiableComponentInterface {
    /** Currently selected logo URL */
    selectedLogoUrl?: string;
    /** Callback when a logo is selected */
    onLogoSelect: (logoUrl: string | undefined) => void;
    /** Label for the selector */
    label?: string;
    /** Logo suggestions from parent */
    logoSuggestions?: string[];
    /** Callback when logo suggestions change */
    onLogoSuggestionsChange?: (logos: string[]) => void;
    /** Number of logo suggestions to show */
    suggestionCount?: number;
    /** Primary color to use for selection styling */
    primaryColor?: string;
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
 * Header container with label and shuffle link.
 */
const HeaderContainer: typeof Box = styled(Box)({
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
});

/**
 * Grid container for logo options.
 */
const LogoGrid: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1.5)
}));

/**
 * Section label.
 */
const SectionLabel: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem"
}));

/**
 * Logo selector component using Google's animal profile images.
 */
const LogoSelector: FunctionComponent<LogoSelectorProps> = memo((
    props: LogoSelectorProps
): ReactElement => {
    const {
        selectedLogoUrl,
        onLogoSelect,
        label = "Choose an application logo",
        logoSuggestions,
        onLogoSuggestionsChange,
        suggestionCount = 8,
        primaryColor = "#ff7300",
        ["data-componentid"]: componentId = OnboardingComponentIds.LOGO_SELECTOR
    } = props;

    // Use parent-provided logos or generate new ones
    const getInitialLogos = (): string[] => {
        // If parent provides logos, use them
        if (logoSuggestions && logoSuggestions.length > 0) {
            return logoSuggestions;
        }

        // Otherwise generate new logos
        return generateLogoSuggestions(suggestionCount);
    };

    // Use ref to track if we've initialized (for internal state only)
    const initializedRef: React.MutableRefObject<boolean> = useRef<boolean>(false);
    const [ logos, setLogos ] = useState<string[]>(getInitialLogos);

    // Notify parent of initial logos if they don't have them yet
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;

            // If parent doesn't have logos yet, send them the initial set
            if (onLogoSuggestionsChange && (!logoSuggestions || logoSuggestions.length === 0)) {
                onLogoSuggestionsChange(logos);
            }

            // Select first logo by default if none selected
            if (logos.length > 0 && !selectedLogoUrl) {
                onLogoSelect(logos[0]);
            }
        }
    // Only run on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync with parent-provided logos when they change
    useEffect(() => {
        if (logoSuggestions && logoSuggestions.length > 0) {
            setLogos(logoSuggestions);
        }
    }, [ logoSuggestions ]);

    const handleShuffle: () => void = useCallback((): void => {
        const newLogos: string[] = generateLogoSuggestions(suggestionCount);

        setLogos(newLogos);
        onLogoSelect(newLogos[0]);

        // Notify parent so they can persist the new logos
        if (onLogoSuggestionsChange) {
            onLogoSuggestionsChange(newLogos);
        }
    }, [ suggestionCount, onLogoSelect, onLogoSuggestionsChange ]);

    const handleLogoSelect: (logoUrl: string) => void = useCallback((logoUrl: string): void => {
        onLogoSelect(logoUrl);
    }, [ onLogoSelect ]);

    return (
        <LogoSelectorContainer data-componentid={ componentId }>
            <HeaderContainer>
                <SectionLabel>{ label }</SectionLabel>
                <Link
                    component="button"
                    data-componentid={ `${componentId}-shuffle` }
                    onClick={ handleShuffle }
                    sx={ {
                        "&:hover": {
                            textDecoration: "underline"
                        },
                        color: primaryColor,
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        textDecoration: "none"
                    } }
                >
                    Shuffle
                </Link>
            </HeaderContainer>
            <LogoGrid>
                { logos.map((logoUrl: string) => {
                    const isSelected: boolean = selectedLogoUrl === logoUrl;
                    const animalName: string = getAnimalNameFromUrl(logoUrl);

                    return (
                        <Tooltip key={ logoUrl } title={ animalName }>
                            <Avatar
                                alt={ animalName }
                                data-componentid={ `${componentId}-${animalName.toLowerCase()}` }
                                onClick={ () => handleLogoSelect(logoUrl) }
                                src={ logoUrl }
                                sx={ {
                                    "&:hover": {
                                        filter: "none",
                                        opacity: 1,
                                        transform: "scale(1.05)"
                                    },
                                    backgroundColor: isSelected
                                        ? primaryColor
                                        : (theme: Theme) => theme.palette.grey[300],
                                    border: isSelected
                                        ? `3px solid ${primaryColor}`
                                        : "3px solid transparent",
                                    cursor: "pointer",
                                    filter: isSelected ? "none" : "grayscale(30%)",
                                    height: 45,
                                    opacity: isSelected ? 1 : 0.7,
                                    transition: "all 0.2s ease-in-out",
                                    width: 45
                                } }
                            />
                        </Tooltip>
                    );
                }) }
            </LogoGrid>
        </LogoSelectorContainer>
    );
});

LogoSelector.displayName = "LogoSelector";

export default LogoSelector;
