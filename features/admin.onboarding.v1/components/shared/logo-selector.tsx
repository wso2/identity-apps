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
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { ArrowRightIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo, useCallback, useMemo, useState } from "react";
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
    /** Number of logo suggestions to show */
    suggestionCount?: number;
    /** Primary color to use for selection styling */
    primaryColor?: string;
}

/**
 * Container for the logo selector.
 */
const LogoSelectorContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5)
}));

/**
 * Header container with label and shuffle button.
 */
const HeaderContainer = styled(Box)({
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
});

/**
 * Grid container for logo options.
 */
const LogoGrid = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1.5)
}));

/**
 * "None" option for clearing selection.
 */
const NoneOption = styled(Box)<{ isSelected: boolean; primaryColor: string }>(
    ({ theme, isSelected, primaryColor }) => ({
        "&:hover": {
            backgroundColor: `${primaryColor}10`,
            boxShadow: `0 4px 12px ${primaryColor}60`,
            transform: "translateY(-2px)"
        },
        alignItems: "center",
        backgroundColor: isSelected
            ? `${primaryColor}20`
            : theme.palette.background.paper,
        border: `1px dashed ${theme.palette.divider}`,
        borderRadius: "50%",
        boxShadow: isSelected
            ? `0 4px 12px ${primaryColor}40`
            : "0 2px 4px rgba(0, 0, 0, 0.1)",
        color: theme.palette.text.secondary,
        cursor: "pointer",
        display: "flex",
        fontSize: "0.75rem",
        height: 50,
        justifyContent: "center",
        transition: "all 0.2s ease-in-out",
        width: 50
    })
);

/**
 * Section label.
 */
const SectionLabel = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem"
}));

/**
 * Logo selector component using Google's animal profile images.
 *
 */
const LogoSelector: FunctionComponent<LogoSelectorProps> = memo((
    props: LogoSelectorProps
): ReactElement => {
    const {
        selectedLogoUrl,
        onLogoSelect,
        label = "Logo",
        suggestionCount = 8,
        primaryColor = "#ff7300",
        ["data-componentid"]: componentId = OnboardingComponentIds.LOGO_SELECTOR
    } = props;

    // State for logo suggestions with shuffle capability
    const [ logoSeed, setLogoSeed ] = useState<number>(0);

    // Generate logo suggestions - changes when seed changes
    const logos: string[] = useMemo(
        () => generateLogoSuggestions(suggestionCount),
        [ suggestionCount, logoSeed ]
    );

    const handleShuffle = useCallback((): void => {
        setLogoSeed((prev: number) => prev + 1);
        onLogoSelect(undefined); // Clear selection on shuffle
    }, [ onLogoSelect ]);

    const handleLogoSelect = useCallback((logoUrl: string): void => {
        onLogoSelect(logoUrl);
    }, [ onLogoSelect ]);

    const handleClearSelection = useCallback((): void => {
        onLogoSelect(undefined);
    }, [ onLogoSelect ]);

    return (
        <LogoSelectorContainer data-componentid={ componentId }>
            <HeaderContainer>
                <SectionLabel>{ label }</SectionLabel>
                <Tooltip title="Shuffle logos">
                    <IconButton
                        data-componentid={ `${componentId}-shuffle` }
                        onClick={ handleShuffle }
                        size="small"
                    >
                        <ArrowRightIcon />
                    </IconButton>
                </Tooltip>
            </HeaderContainer>
            <LogoGrid>
                <Tooltip title="No logo">
                    <NoneOption
                        data-componentid={ `${componentId}-none` }
                        isSelected={ !selectedLogoUrl }
                        onClick={ handleClearSelection }
                        primaryColor={ primaryColor }
                    >
                        None
                    </NoneOption>
                </Tooltip>
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
                                        boxShadow: `0 4px 12px ${primaryColor}60`,
                                        transform: "translateY(-2px)"
                                    },
                                    backgroundColor: primaryColor,
                                    border: isSelected
                                        ? `2px solid ${primaryColor}`
                                        : "2px solid transparent",
                                    boxShadow: isSelected
                                        ? `0 4px 12px ${primaryColor}40`
                                        : "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    height: 50,
                                    transition: "all 0.2s ease-in-out",
                                    width: 50
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
