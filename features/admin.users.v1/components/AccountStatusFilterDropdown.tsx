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

import { SelectChangeEvent } from "@mui/material/Select";
import Badge from "@oxygen-ui/react/Badge";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControl from "@oxygen-ui/react/FormControl";
import ListItemText from "@oxygen-ui/react/ListItemText";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DropdownChild } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { USER_ACCOUNT_STATUS_FILTER_OPTIONS } from "../constants/user-management-constants";
import "./AccountStatusFilterDropdown.scss";

/**
 * Props for the AccountStatusFilterDropdown component.
 */
interface AccountStatusFilterDropdownProps extends IdentifiableComponentInterface {
    /**
     * Array of selected account status filter keys.
     */
    selectedFilters: string[];
    /**
     * Callback function triggered when the selected filters change.
     * @param selected - Array of selected filter keys.
     */
    onChange: (selected: string[]) => void;
}

/**
 * The AccountStatusFilterDropdown component.
 *
 * @param props - Props injected into the component.
 * @returns React Element.
 */
const AccountStatusFilterDropdown: FunctionComponent<AccountStatusFilterDropdownProps> = ({
    selectedFilters,
    onChange,
    ["data-componentid"]: componentId = "account-status-filter-dropdown"
}: AccountStatusFilterDropdownProps): ReactElement => {

    const { t } = useTranslation();

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const value: string[] | string = event.target.value;

        onChange(typeof value === "string" ? value.split(",") : value);
    };

    /**
     * Renders the dropdown label with selection count badge.
     * @returns The rendered component
     */
    const renderLabelWithCount = (): ReactElement => (
        <Box
            className="dropdown-label-container"
            data-componentid={ `${componentId}-label` }
        >
            { t("users:advancedSearch.accountStatusFilter.label") }
            { selectedFilters.length > 0 && (
                <Badge
                    className="status-count-badge"
                    badgeContent={ selectedFilters.length }
                    data-componentid={ `${componentId}-label-badge` }
                />
            ) }
        </Box>
    );

    return (
        <Box
            className="account-status-filter-dropdown"
            data-componentid={ componentId }
        >
            <FormControl fullWidth>
                <Select
                    className="account-status-select-input"
                    multiple
                    value={ selectedFilters }
                    onChange={ handleChange }
                    renderValue={ renderLabelWithCount }
                    data-componentid={ `${componentId}-select-input` }
                    displayEmpty
                >
                    { USER_ACCOUNT_STATUS_FILTER_OPTIONS
                        .map((filterOption: DropdownChild) => (
                            <MenuItem
                                key={ filterOption.key }
                                value={ filterOption.key }
                                data-componentid={ `${componentId}-option-${filterOption.key}` }
                            >
                                <Checkbox
                                    checked={ selectedFilters.indexOf(filterOption.key.toString()) > -1 }
                                    data-componentid={ `${componentId}-checkbox-${filterOption.key}` }
                                />
                                <ListItemText primary={ t(filterOption.text as string) } />
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </Box>
    );
};

export default AccountStatusFilterDropdown;
