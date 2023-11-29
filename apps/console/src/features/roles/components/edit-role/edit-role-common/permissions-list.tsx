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
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { AutoCompleteRenderOption } from "./auto-complete-render-option";
import { RenderChip } from "./render-chip";
import { APIResourceInterface, ScopeInterface } from "../../../models/apiResources";

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
}

export const PermissionsList: FunctionComponent<PermissionsListPropsInterface> =
    (props: PermissionsListPropsInterface): ReactElement => {

        const {
            apiResource,
            initialSelectedPermissions,
            selectedPermissions,
            onChangeScopes,
            [ "data-componentid" ]: componentId
        } = props;

        const { t } = useTranslation();

        const [ activeOption, setActiveOption ] = useState<ScopeInterface>(undefined);

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
                            placeholder= { t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                                "permissions.placeholder") }
                        />
                    ) }
                    onChange={ (event: SyntheticEvent, scopes: ScopeInterface[]) => handleScopeSelection(scopes) }
                    renderTags={ (
                        value: ScopeInterface[],
                        getTagProps: AutocompleteRenderGetTagProps
                    ) => value.map((option: ScopeInterface, index: number) => (
                        <RenderChip
                            { ...getTagProps({ index }) }
                            key={ index }
                            primaryText={ option.displayName }
                            secondaryText={ option.name }
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
    "data-componentid": "permissions-list"
};
