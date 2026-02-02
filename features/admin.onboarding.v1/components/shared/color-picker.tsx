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
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo, useCallback } from "react";
import {
    OnboardingComponentIds,
    PRESET_COLORS,
    generateRandomColor,
    isValidHexColor
} from "../../constants";

/**
 * Props interface for ColorPicker component.
 */
export interface ColorPickerProps extends IdentifiableComponentInterface {
    /** Current color value (hex) */
    color: string;
    /** Callback when color changes */
    onChange: (color: string) => void;
    /** Label for the color picker */
    label?: string;
}

/**
 * Container for the color picker.
 */
const ColorPickerContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
}));

/**
 * Row container for color input and preview.
 */
const ColorInputRow = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(2)
}));

/**
 * Color preview swatch.
 */
const ColorPreview = styled(Box)<{ bgcolor: string }>(({ theme, bgcolor }) => ({
    backgroundColor: bgcolor,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    flexShrink: 0,
    height: 40,
    position: "relative",
    width: 40,
    "& input": {
        border: "none",
        cursor: "pointer",
        height: "100%",
        left: 0,
        opacity: 0,
        position: "absolute",
        top: 0,
        width: "100%"
    }
}));

/**
 * Container for preset colors.
 */
const PresetColorsContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1)
}));

/**
 * Preset color swatch.
 */
const PresetColorSwatch = styled(Box)<{ bgcolor: string; isSelected: boolean }>(
    ({ theme, bgcolor, isSelected }) => ({
        backgroundColor: bgcolor,
        border: isSelected
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius / 2,
        cursor: "pointer",
        height: 28,
        transition: "transform 0.15s ease-in-out, border 0.15s ease-in-out",
        width: 28,
        "&:hover": {
            transform: "scale(1.1)"
        }
    })
);

/**
 * Label for the section.
 */
const SectionLabel = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    marginBottom: theme.spacing(0.5)
}));

/**
 * Color picker component with hex input, native picker, preset colors, and random generator.
 */
const ColorPicker: FunctionComponent<ColorPickerProps> = memo((
    props: ColorPickerProps
): ReactElement => {
    const {
        color,
        onChange,
        label = "Primary Color",
        ["data-componentid"]: componentId = OnboardingComponentIds.COLOR_PICKER
    } = props;

    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        const value: string = event.target.value;

        // Allow typing without validation, validate on blur
        onChange(value.startsWith("#") ? value : `#${value}`);
    }, [ onChange ]);

    const handleNativeColorChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        onChange(event.target.value);
    }, [ onChange ]);

    const handlePresetSelect = useCallback((presetColor: string): void => {
        onChange(presetColor);
    }, [ onChange ]);

    const handleRandomize = useCallback((): void => {
        onChange(generateRandomColor());
    }, [ onChange ]);

    const isValid: boolean = isValidHexColor(color);

    return (
        <ColorPickerContainer data-componentid={ componentId }>
            <Box>
                <SectionLabel>{ label }</SectionLabel>
                <ColorInputRow>
                    <ColorPreview bgcolor={ isValid ? color : "#ffffff" }>
                        <input
                            type="color"
                            value={ isValid ? color : "#ffffff" }
                            onChange={ handleNativeColorChange }
                            data-componentid={ `${componentId}-native-input` }
                        />
                    </ColorPreview>
                    <TextField
                        error={ !isValid && color.length > 0 }
                        helperText={ !isValid && color.length > 0 ? "Invalid hex color" : undefined }
                        onChange={ handleTextChange }
                        placeholder="#ff7300"
                        size="small"
                        sx={ { width: 120 } }
                        value={ color }
                        data-componentid={ `${componentId}-text-input` }
                    />
                    <Button
                        onClick={ handleRandomize }
                        size="small"
                        variant="outlined"
                        data-componentid={ `${componentId}-random-button` }
                    >
                        Random
                    </Button>
                </ColorInputRow>
            </Box>

            <Box>
                <SectionLabel>Quick picks</SectionLabel>
                <PresetColorsContainer>
                    { PRESET_COLORS.map((presetColor: string) => (
                        <PresetColorSwatch
                            bgcolor={ presetColor }
                            isSelected={ color.toLowerCase() === presetColor.toLowerCase() }
                            key={ presetColor }
                            onClick={ () => handlePresetSelect(presetColor) }
                            data-componentid={ `${componentId}-preset-${presetColor.replace("#", "")}` }
                        />
                    )) }
                </PresetColorsContainer>
            </Box>
        </ColorPickerContainer>
    );
});

ColorPicker.displayName = "ColorPicker";

export default ColorPicker;
