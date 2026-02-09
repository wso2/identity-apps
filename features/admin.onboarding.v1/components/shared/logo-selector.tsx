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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo, useCallback, useEffect, useRef } from "react";
import { OnboardingComponentIds } from "../../constants";
import {
    AVATAR_NAMES,
    getAnimalNameFromUrl,
    getAvatarDisplayImage,
    getAvatarLogoUrl
} from "../../constants/preset-logos";
import { SectionLabel } from "./onboarding-styles";

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
    gap: theme.spacing(1.5)
}));

/**
 * Logo selector component using local animal avatar images.
 * Displays all available avatars for user selection.
 */
const LogoSelector: FunctionComponent<LogoSelectorProps> = memo((
    props: LogoSelectorProps
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

    const handleLogoSelect: (logoUrl: string) => void = useCallback((logoUrl: string): void => {
        onLogoSelect(logoUrl);
    }, [ onLogoSelect ]);

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
                                data-componentid={ `${componentId}-${animalName.toLowerCase()}` }
                                onClick={ () => handleLogoSelect(logoUrl) }
                                sx={ (theme: Theme) => ({
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
        </LogoSelectorContainer>
    );
});

LogoSelector.displayName = "LogoSelector";

export default LogoSelector;
