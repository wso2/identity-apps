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
import { PlusIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo, useCallback, useRef, useState } from "react";
import Hint from "./hint";
import { SectionLabel } from "./onboarding-styles";
import { OnboardingComponentIds, PRESET_COLORS, isValidHexColor } from "../../constants";

/**
 * Props interface for ColorPicker component.
 */
export interface ColorPickerPropsInterface extends IdentifiableComponentInterface {
    /** Current color value (hex) */
    color: string;
    /** Label for the color picker */
    label?: string;
    /** Callback when color changes */
    onChange: (color: string) => void;
    /** Whether to show the hint text */
    showHint?: boolean;
}

/**
 * Container for the color picker.
 */
const ColorPickerContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5)
}));

/**
 * Container for color swatches and input.
 */
const SwatchesRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1)
}));

/**
 * Color swatch button.
 */
const ColorSwatch: any = styled(Box)<{ bgcolor: string; isSelected: boolean }>(
    ({ theme, bgcolor, isSelected }: { theme: Theme; bgcolor: string; isSelected: boolean }) => ({
        "&:hover": {
            transform: "scale(1.07)"
        },
        backgroundColor: bgcolor,
        border: "2px solid transparent",
        borderRadius: theme.shape.borderRadius,
        boxShadow: isSelected
            ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`
            : "none",
        cursor: "pointer",
        height: 40,
        margin: theme.spacing(0.4),
        transition: "all 0.15s ease-in-out",
        width: 40
    })
);

/**
 * Custom color preview button that opens native picker.
 */
const CustomColorButton: any = styled(Box)<{ bgcolor: string; hasColor: boolean; isSelected: boolean }>(
    ({ theme, bgcolor, hasColor, isSelected }:
        { theme: Theme; bgcolor: string; hasColor: boolean; isSelected: boolean }) => ({
        "& svg": {
            color: hasColor ? "#ffffff" : theme.palette.text.secondary,
            filter: hasColor ? "drop-shadow(0 0 1px rgba(0,0,0,0.5))" : "none"
        },
        "&:hover": {
            transform: "scale(1.1)"
        },
        alignItems: "center",
        backgroundColor: bgcolor,
        border: hasColor ? "2px solid transparent" : `2px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        boxShadow: isSelected
            ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`
            : "none",
        cursor: "pointer",
        display: "flex",
        height: 40,
        justifyContent: "center",
        margin: theme.spacing(0.4),
        position: "relative",
        transition: "all 0.15s ease-in-out",
        width: 40
    })
);

/**
 * Hex color input.
 */
const HexColorInput: any = styled("input")({
    height: 0,
    opacity: 0,
    position: "absolute",
    width: 0
});

/**
 * Color picker component with grid swatches and custom color input.
 */
const ColorPicker: FunctionComponent<ColorPickerPropsInterface> = memo((
    props: ColorPickerPropsInterface
): ReactElement => {
    const {
        color,
        label = "Choose a brand color",
        onChange,
        showHint = false,
        ["data-componentid"]: componentId = OnboardingComponentIds.COLOR_PICKER
    } = props;

    const colorInputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const [ customColor, setCustomColor ] = useState<string>(color);

    const handleSwatchClick: (presetColor: string) => void = useCallback((presetColor: string): void => {
        onChange(presetColor);
        setCustomColor(presetColor);
    }, [ onChange ]);

    const handleAddColorClick: () => void = useCallback((): void => {
        colorInputRef.current?.click();
    }, []);

    const handleNativeColorChange: (event: React.ChangeEvent<HTMLInputElement>) => void = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            const value: string = event.target.value;

            onChange(value);
            setCustomColor(value);
        }, [ onChange ]
    );

    const handleCustomColorChange: (event: React.ChangeEvent<HTMLInputElement>) => void = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            const value: string = event.target.value;
            const formattedValue: string = value.startsWith("#") ? value : `#${value}`;

            setCustomColor(formattedValue);

            // Auto-apply if valid hex color
            if (isValidHexColor(formattedValue)) {
                onChange(formattedValue);
            }
        }, [ onChange ]
    );

    const isCustomColorValid: boolean = isValidHexColor(customColor);

    // Check if current color is a custom color (not in presets)
    const isCustomColor: boolean = !PRESET_COLORS.some(
        (preset: string) => preset.toLowerCase() === color.toLowerCase()
    );

    return (
        <ColorPickerContainer data-componentid={ componentId }>
            <SectionLabel>{ label }</SectionLabel>
            <SwatchesRow>
                { PRESET_COLORS.map((presetColor: string) => (
                    <ColorSwatch
                        bgcolor={ presetColor }
                        data-componentid={ `${componentId}-preset-${presetColor.replace("#", "")}` }
                        isSelected={ color.toLowerCase() === presetColor.toLowerCase() }
                        key={ presetColor }
                        onClick={ () => handleSwatchClick(presetColor) }
                    />
                )) }
                <CustomColorButton
                    bgcolor={ isCustomColorValid ? customColor : color }
                    data-componentid={ `${componentId}-custom-color` }
                    hasColor={ isCustomColor || isCustomColorValid }
                    isSelected={ isCustomColor }
                    onClick={ handleAddColorClick }
                >
                    <PlusIcon size={ 16 } />
                    <HexColorInput
                        data-componentid={ `${componentId}-native-picker` }
                        onChange={ handleNativeColorChange }
                        ref={ colorInputRef }
                        type="color"
                        value={ customColor }
                    />
                </CustomColorButton>
                <TextField
                    data-componentid={ `${componentId}-custom-input` }
                    error={ customColor.length > 0 && !isCustomColorValid }
                    FormHelperTextProps={ {
                        sx: {
                            bottom: -18,
                            left: 0,
                            margin: 0,
                            position: "absolute"
                        }
                    } }
                    helperText={
                        customColor.length > 0 && !isCustomColorValid
                            ? "Invalid hex color"
                            : undefined
                    }
                    onChange={ handleCustomColorChange }
                    placeholder="#000000"
                    size="small"
                    sx={ { position: "relative", width: 120 } }
                    value={ customColor }
                />
            </SwatchesRow>

            { showHint && (
                <Hint message="You can find advanced branding options later in the Console." />
            ) }
        </ColorPickerContainer>
    );
});

ColorPicker.displayName = "ColorPicker";

export default ColorPicker;
