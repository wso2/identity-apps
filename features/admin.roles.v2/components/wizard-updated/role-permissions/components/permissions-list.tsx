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
import React, { FunctionComponent, HTMLAttributes, ReactElement, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { APIResourceInterface, ScopeInterface } from "../../../../models/apiResources";
import { AutoCompleteRenderOption } from "../../../edit-role/edit-role-common/auto-complete-render-option";
import { RenderChip } from "../../../edit-role/edit-role-common/render-chip";

interface PermissionsListPropsInterface extends  IdentifiableComponentInterface {
    /**
     * API resource.
     */
    apiResource: APIResourceInterface;
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
            selectedPermissions,
            onChangeScopes,
            [ "data-componentid" ]: componentId
        } = props;

        const { t } = useTranslation();

        // Active option.
        const [ activeOption, setActiveOption ] = React.useState<ScopeInterface>(undefined);
        
        /**
         * Handles the select scope action.
         */
        const handleScopeSelection = (event: SyntheticEvent, scopes: ScopeInterface[]) => {
            onChangeScopes(apiResource, scopes);
        };

        return (
            <Autocomplete
                multiple
                disableCloseOnSelect
                options={ apiResource?.scopes ? apiResource?.scopes : [] }
                value={ selectedPermissions ? selectedPermissions : [] }
                getOptionLabel={ (scope: ScopeInterface) => scope.displayName }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        data-componentid={ `${componentId}-textfield` }
                        placeholder= { t("roles:addRoleWizard.forms.rolePermission." +
                            "permissions.placeholder") }
                    />
                ) }
                onChange={ handleScopeSelection }
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
        );
    };

/**
 * Default props for the component.
 */
PermissionsList.defaultProps = {
    "data-componentid": "permissions-list"
};
