/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { AutoCompleteRenderOption } from "./auto-complete-render-option";
import { APIResourceInterface, ScopeInterface } from "../../../models/apiResources";
import "./permissions-list.scss";

interface PermissionsListPropsInterface extends  IdentifiableComponentInterface {
    /**
     * API resource.
     */
    apiResource: APIResourceInterface;
    /**
     * Initial selected permissions.
     */
    initialSelectedPermissions?: ScopeInterface[];
    /**
     * Selected permissions.
     */
    selectedPermissions: ScopeInterface[];
    /**
     * Callback to handle API resource removal.
     */
    onChangeScopes: (apiResource: APIResourceInterface, scopes: ScopeInterface[]) => void;
    /**
     * Whether has an error or not.
     */
    hasError?: boolean;
    /**
     * Error message.
     */
    errorMessage?: string;
}

export const PermissionsList: FunctionComponent<PermissionsListPropsInterface> =
    (props: PermissionsListPropsInterface): ReactElement => {

        const {
            apiResource,
            initialSelectedPermissions,
            selectedPermissions,
            onChangeScopes,
            hasError,
            errorMessage,
            [ "data-componentid" ]: componentId
        } = props;

        const { t } = useTranslation();

        const [ activeOption, setActiveOption ] = useState<ScopeInterface>(undefined);
        const [ isTouched, setIsTouched ] = useState<boolean>(false);

        /**
         * Handles the select scope action.
         */
        const handleScopeSelection = (scopes: ScopeInterface[]) => {
            onChangeScopes(apiResource, scopes);
        };

        return (
            <>
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    disablePortal
                    options={ apiResource?.scopes ? apiResource?.scopes : [] }
                    value={ selectedPermissions ? selectedPermissions : [] }
                    isOptionEqualToValue={
                        (option: ScopeInterface, value: ScopeInterface) =>
                            option.name === value.name
                    }
                    getOptionLabel={ (scope: ScopeInterface) => scope.displayName }
                    renderInput={ (params: AutocompleteRenderInputParams) => (
                        <TextField
                            { ...params }
                            data-componentid={ `${componentId}-textfield` }
                            placeholder= { t("roles:addRoleWizard.forms.rolePermission." +
                                "permissions.placeholder") }
                            error={ isTouched && hasError }
                            helperText={ isTouched && hasError && errorMessage }
                            label={ t("roles:addRoleWizard.forms.rolePermission.permissions" +
                                ".permissionsLabel") }
                            InputLabelProps={ {
                                className: "permissions-label",
                                required: true
                            } }
                            size="small"
                        />
                    ) }
                    onChange={ (event: SyntheticEvent, scopes: ScopeInterface[]) => handleScopeSelection(scopes) }
                    onClose={ () => setIsTouched(true) }
                    renderTags={ (
                        value: ScopeInterface[],
                        getTagProps: AutocompleteRenderGetTagProps
                    ) => value.map((option: ScopeInterface, index: number) => (
                        <Chip
                            { ...getTagProps({ index }) }
                            key={ index }
                            label={ option.displayName }
                            option={ option }
                            activeOption={ activeOption }
                            setActiveOption={ setActiveOption }
                            variant={
                                initialSelectedPermissions?.find(
                                    (permission: ScopeInterface) => permission.name === option.name
                                )
                                    ? "solid"
                                    : "outlined"
                            }
                        />
                    )) }
                    renderOption={ (
                        props: HTMLAttributes<HTMLLIElement>,
                        option: ScopeInterface,
                        { selected }: { selected: boolean }
                    ) => (
                        <AutoCompleteRenderOption
                            selected={ selected }
                            subTitle={ option.name }
                            displayName={ option.displayName }
                            renderOptionProps={ props }
                        />
                    ) }
                />
            </>
        );
    };

/**
 * Default props for the component.
 */
PermissionsList.defaultProps = {
    "data-componentid": "permissions-list",
    hasError: false
};
