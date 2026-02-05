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
 * Styled FormControlLabel for full width toggle with subtle hover.
 */
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }: { theme: Theme }) => ({
    alignItems: "flex-start",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
    padding: theme.spacing(1.5, 2),
    transition: "background-color 150ms ease-out",
    width: "100%",
    "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.03)"
    },
    "& .MuiFormControlLabel-label": {
        flex: 1
    }
}));

/**
 * Props interface for OptionLabelContent component.
 */
interface OptionLabelContentProps {
    /** Label text */
    label: string;
    /** Optional description text */
    description?: string;
}

/**
 * Custom label content with title and optional description.
 */
const OptionLabelContent: FunctionComponent<OptionLabelContentProps> = ({
    label,
    description
}: OptionLabelContentProps): ReactElement => (
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
);

/**
 * Sign-in option toggle component.
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
        <StyledFormControlLabel
            control={
                <Switch
                    checked={ isEnabled }
                    disabled={ disabled }
                    onChange={ handleChange }
                    data-componentid={ `${componentId}-${option.id}-switch` }
                />
            }
            data-componentid={ `${componentId}-${option.id}` }
            disabled={ disabled }
            label={
                <OptionLabelContent
                    description={ option.description }
                    label={ option.label }
                />
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
