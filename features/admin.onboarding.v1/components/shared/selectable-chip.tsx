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

import { Theme, alpha, styled } from "@mui/material/styles";
import Chip from "@oxygen-ui/react/Chip";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Props interface for SelectableChip component.
 */
interface SelectableChipPropsInterface {
    /**
     * Chip label text.
     */
    label: string;
    /**
     * Whether the chip is selected.
     */
    isSelected?: boolean;
    /**
     * Click handler.
     */
    onClick?: () => void;
}

/**
 * Styled chip with selected/unselected states.
 */
const StyledChip: typeof Chip = styled(Chip)(({ theme }: { theme: Theme }) => ({
    "&.MuiChip-filled": {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main
    },
    "&.MuiChip-outlined": {
        borderColor: theme.palette.divider,
        color: theme.palette.text.secondary
    },
    "&.MuiChip-root": {
        borderRadius: theme.shape.borderRadius * 3
    },
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08)
    },
    cursor: "pointer",
    fontSize: "0.8rem",
    padding: theme.spacing(2, 1)
}));

/**
 * A selectable chip component with visual feedback for selected state.
 */
const SelectableChip: FunctionComponent<SelectableChipPropsInterface> = ({
    isSelected = false,
    label,
    onClick
}: SelectableChipPropsInterface): ReactElement => (
    <StyledChip
        label={ label }
        onClick={ onClick }
        variant={ isSelected ? "filled" : "outlined" }
    />
);

export default SelectableChip;
