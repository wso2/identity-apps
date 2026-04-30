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
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Switch from "@oxygen-ui/react/Switch";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode, memo } from "react";
import { OnboardingComponentIds } from "../../constants";
import { SignInOptionDefinitionInterface } from "../../models/sign-in-options";

/**
 * Props interface for SignInOptionToggle component.
 */
interface SignInOptionTogglePropsInterface extends IdentifiableComponentInterface {
    /** Sign-in option definition */
    option: SignInOptionDefinitionInterface;
    /** Whether the option is enabled */
    isEnabled: boolean;
    /** Callback when the toggle is changed */
    onToggle: (enabled: boolean) => void;
    /** Whether the toggle is disabled */
    disabled?: boolean;
    /** Reason for being disabled (shown in tooltip) */
    disabledReason?: string;
    /** Icon to display beside the label */
    icon?: ReactNode;
}

/**
 * Styled FormControlLabel for full width toggle with subtle hover.
 */
const StyledFormControlLabel: React.FC<React.ComponentProps<typeof FormControlLabel>> =
    styled(FormControlLabel)(({ theme }: { theme: Theme }) => ({
        "& .MuiFormControlLabel-label": {
            flex: 1
        },
        "&:hover": {
            backgroundColor: theme.palette.grey[50]
        },
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius * 1.5,
        display: "flex",
        justifyContent: "space-between",
        margin: 0,
        padding: theme.spacing(1.25, 2),
        transition: "background-color 150ms ease-out, border-color 150ms ease-out",
        width: "100%"
    }));

/**
 * Props interface for OptionLabelContent component.
 */
interface OptionLabelContentProps {
    /** Label text */
    label: string;
    /** Optional description text */
    description?: string;
    /** Optional icon */
    icon?: ReactNode;
}

/**
 * Custom label content with icon, title, and optional description.
 */
const OptionLabelContent: FunctionComponent<OptionLabelContentProps> = ({
    label,
    description,
    icon
}: OptionLabelContentProps): ReactElement => (
    <Box sx={ { alignItems: "center", display: "flex", gap: 1.5 } }>
        { icon && (
            <Box sx={ { display: "flex", flexShrink: 0, height: 20, width: 20 } }>
                { typeof icon === "string"
                    ? <img alt="" src={ icon } style={ { height: "100%", width: "100%" } } />
                    : icon }
            </Box>
        ) }
        <Box>
            <Typography
                sx={ {
                    color: "text.primary",
                    fontSize: "0.9375rem",
                    fontWeight: 500
                } }
            >
                { label }
            </Typography>
            { description && (
                <Typography
                    sx={ {
                        color: "text.secondary",
                        fontSize: "0.8125rem"
                    } }
                >
                    { description }
                </Typography>
            ) }
        </Box>
    </Box>
);

/**
 * Sign-in option toggle component.
 */
const SignInOptionToggle: FunctionComponent<SignInOptionTogglePropsInterface> = memo((
    props: SignInOptionTogglePropsInterface
): ReactElement => {
    const {
        option,
        isEnabled,
        onToggle,
        disabled = false,
        disabledReason,
        icon,
        ["data-componentid"]: componentId = OnboardingComponentIds.SIGN_IN_OPTION_TOGGLE
    } = props;

    const handleChange: (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void =
        (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
            onToggle(checked);
        };

    const toggleContent: ReactElement = (
        <StyledFormControlLabel
            control={
                (<Switch
                    size="small"
                    checked={ isEnabled }
                    disabled={ disabled }
                    onChange={ handleChange }
                    data-componentid={ `${componentId}-${option.id}-switch` }
                />)
            }
            data-componentid={ `${componentId}-${option.id}` }
            disabled={ disabled }
            label={
                (<OptionLabelContent
                    description={ option.description }
                    icon={ icon }
                    label={ option.label }
                />)
            }
            labelPlacement="start"
        />
    );

    if (disabled && disabledReason) {
        return (
            <Tooltip title={ disabledReason } placement="top">
                <span>{ toggleContent }</span>
            </Tooltip>
        );
    }

    return toggleContent;
});

SignInOptionToggle.displayName = "SignInOptionToggle";

export default SignInOptionToggle;
