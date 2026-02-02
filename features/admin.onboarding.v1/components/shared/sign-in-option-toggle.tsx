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
import Switch from "@oxygen-ui/react/Switch";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo } from "react";
import { OnboardingComponentIds } from "../../constants";
import { SignInOptionDefinition } from "../../models";

/**
 * Props interface for SignInOptionToggle component.
 */
export interface SignInOptionToggleProps extends IdentifiableComponentInterface {
    /** Sign-in option definition */
    option: SignInOptionDefinition;
    /** Whether the option is enabled */
    isEnabled: boolean;
    /** Callback when the toggle is changed */
    onToggle: (enabled: boolean) => void;
    /** Whether the toggle is disabled */
    disabled?: boolean;
    /** Reason for being disabled (shown in tooltip) */
    disabledReason?: string;
}

/**
 * Container for the toggle item.
 */
const ToggleContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(1.5, 2),
    transition: "background-color 0.2s ease-in-out",
    "&:hover": {
        backgroundColor: theme.palette.action.hover
    }
}));

/**
 * Container for label and description.
 */
const LabelContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: 2
});

/**
 * Option label text.
 */
const OptionLabel = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontSize: "0.9375rem",
    fontWeight: 500
}));

/**
 * Option description text.
 */
const OptionDescription = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem"
}));

/**
 * Sign-in option toggle component.
 * Displays a sign-in option with a toggle switch.
 */
const SignInOptionToggle: FunctionComponent<SignInOptionToggleProps> = memo((
    props: SignInOptionToggleProps
): ReactElement => {
    const {
        option,
        isEnabled,
        onToggle,
        disabled = false,
        disabledReason,
        ["data-componentid"]: componentId = OnboardingComponentIds.SIGN_IN_OPTION_TOGGLE
    } = props;

    const handleChange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
        onToggle(checked);
    };

    const toggleContent: ReactElement = (
        <ToggleContainer data-componentid={ `${componentId}-${option.id}` }>
            <LabelContainer>
                <OptionLabel>{ option.label }</OptionLabel>
                { option.description && (
                    <OptionDescription>{ option.description }</OptionDescription>
                ) }
            </LabelContainer>
            <Switch
                checked={ isEnabled }
                disabled={ disabled }
                onChange={ handleChange }
                data-componentid={ `${componentId}-${option.id}-switch` }
            />
        </ToggleContainer>
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
