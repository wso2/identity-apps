/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment } from "@wso2is/react-components";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps } from "semantic-ui-react";
import { RoleAPIResourcesListItem } from "./components/role-api-resources-list-item";
import { useAPIResourceDetails, useAPIResourcesList } from "../../../api";
import { RoleConstants } from "../../../constants/role-constants";
import { APIResourceInterface, ScopeInterface } from "../../../models/apiResources";
import { SelectedPermissionsInterface } from "../../../models/roles";

/**
 * Interface to capture permission list props
 */
interface RolePermissionsListProp extends  IdentifiableComponentInterface {
    /**
     * Selected permissions.
     */
    selectedPermissions: SelectedPermissionsInterface[];
    /**
     * Callback to set the selected permissions.
     */
    setSelectedPermissions: (selectedPermissions: SelectedPermissionsInterface[]) => void;
    /**
     * Callback to set the next button state of the permission step.
     */
    setIsPermissionStepNextButtonDisabled: (isPermissionStepNextButtonDisabled: boolean) => void;
}

export const RolePermissionsList: FunctionComponent<RolePermissionsListProp> = 
    (props: RolePermissionsListProp): ReactElement => {

        const {
            selectedPermissions,
            setSelectedPermissions,
            setIsPermissionStepNextButtonDisabled,
            [ "data-componentid" ]: componentId
        } = props;
        
        const { t } = useTranslation();
        const dispatch: Dispatch = useDispatch();

        const [ apiResourcesListOptions, setAPIResourcesListOptions ] = useState<DropdownProps[]>([]);
        const [ selectedAPIResources, setSelectedAPIResources ] = useState<APIResourceInterface[]>([]);
        const [ apiResourceSearchQuery, setAPIResourceSearchQuery ] = useState<string>(undefined);
        const [ selectedAPIResourceId, setSelectedAPIResourceId ] = useState<string>(undefined);
        const [ isAPIResourcesSearching, setAPIResourcesSearching ] = useState<boolean>(false);

        const {
            data: apiResourcesList,
            isLoading: isAPIResourcesListFetchRequestLoading,
            error: apiResourcsListFetchRequestError,
            mutate: mutateAPIResourcesListFetchRequest
        } = useAPIResourcesList(apiResourceSearchQuery);

        const {
            data: selectedAPIResource,
            isLoading: isSelectedAPIResourceFetchRequestLoading,
            isValidating: isSelectedAPIResourceFetchRequestValidating,
            error: selectedAPIResourceFetchRequestError        
        } = useAPIResourceDetails(selectedAPIResourceId);

        /**
         * Show error if user list fetch request failed
         */ 
        useEffect(() => {
            if ( selectedAPIResourceFetchRequestError ||  apiResourcsListFetchRequestError) {
                dispatch(
                    addAlert({
                        description: t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                            "notifications.fetchAPIResourceError.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                            "notifications.fetchAPIResourceError.error.message")
                    })
                );
                setIsPermissionStepNextButtonDisabled(true);
            } else {
                setIsPermissionStepNextButtonDisabled(false);
            }
        }, [ selectedAPIResourceFetchRequestError, apiResourcsListFetchRequestError ]);

        useEffect(() => {
            const options: DropdownProps[] = [];
    
            apiResourcesList?.apiResources?.map((apiResource: APIResourceInterface) => {
                if (!selectedAPIResources.find((selectedAPIResource: APIResourceInterface) => 
                    selectedAPIResource?.id === apiResource?.id)) {
                    options.push({
                        key: apiResource.id,
                        text: apiResource.name,
                        value: apiResource.id
                    });
                }
            });
        
            setAPIResourcesListOptions(options);
        }, [ apiResourcesList, selectedAPIResources ]);

        /**
         * Add API resource to the selected API resources list.
         */
        useEffect(() => {
            if (selectedAPIResource 
                && !isSelectedAPIResourceFetchRequestLoading 
                && !isSelectedAPIResourceFetchRequestValidating) {
                
                if (!selectedAPIResources.find(
                    (apiResource: APIResourceInterface) => selectedAPIResource?.id === apiResource?.id)) {
                    setSelectedAPIResources([ selectedAPIResource, ...selectedAPIResources ]);
                }

                selectedAPIResourceId && setSelectedAPIResourceId(undefined);
            }
        }, [ selectedAPIResource ]);

        // TODO: Need to handle the error state.

        /**
         * The following function handles the search query for the groups list.
         */
        const searchAPIResources: DebouncedFunc<(query: string) => void> = 
            useCallback(debounce((query: string) => {
                setAPIResourceSearchQuery(`name co ${query}`);
                mutateAPIResourcesListFetchRequest().finally(() => {
                    setAPIResourcesSearching(false);
                    setAPIResourceSearchQuery(undefined);
                });
            }, RoleConstants.DEBOUNCE_TIMEOUT), []);

        /**
         * Handles the change of the search query of application list.
         */
        const onSearchChangeAPIResourcs = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
            setAPIResourcesSearching(true);
            searchAPIResources(data.searchQuery.toString().trim());
        };

        /**
         * Handles the selection of an API resource.
         */
        const onAPIResourceSelected = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
            setSelectedAPIResourceId(data.value.toString());
        };

        /**
         * Handles the removal of an API resource.
         */
        const onRemoveAPIResource = (apiResourceId: string): void => {
            // Remove the API resource from the selected API resources list.
            setSelectedAPIResources(selectedAPIResources.filter((apiResource: APIResourceInterface) => {
                return apiResource.id !== apiResourceId;
            }));


            // Removing the scopes(permissions) of the removed API resource from the selected permissions list.
            setSelectedPermissions(selectedPermissions.filter((selectedPermission: SelectedPermissionsInterface) => {
                return selectedPermission.apiResourceId !== apiResourceId;
            }));
        };

        const onChangeScopes = (apiResource: APIResourceInterface, scopes: ScopeInterface[]): void => {
            const selectedScopes: SelectedPermissionsInterface[] = selectedPermissions.filter(
                (selectedPermission: SelectedPermissionsInterface) => 
                    selectedPermission.apiResourceId !== apiResource.id
            );
            
            selectedScopes.push(
                {
                    apiResourceId: apiResource.id,
                    scopes: scopes
                }
            );

            setSelectedPermissions(selectedScopes);
        };

        return (
            <Grid container direction="column" justifyContent="center" alignItems="flex-start" spacing={ 2 }>
                <Grid xs={ 12 }>
                    <Form
                        id={ componentId } 
                        uncontrolledForm={ false } 
                        onSubmit={ undefined }
                    >
                        <Field.Dropdown
                            ariaLabel="assignedApplication"
                            name="assignedApplication"
                            label={ t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                                "apiResource.label") }
                            options={ apiResourcesListOptions }
                            search
                            data-componentid={ `${componentId}-typography-font-family-dropdown` }
                            placeholder={ t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                                "apiResource.placeholder") }
                            noResultsMessage={
                                isAPIResourcesListFetchRequestLoading
                                    ? t("common:searching")
                                    : t("common:noResultsFound")
                            }
                            loading={ isAPIResourcesSearching }
                            onSearchChange={ onSearchChangeAPIResourcs }
                            onChange={ onAPIResourceSelected }
                        />
                    </Form>
                </Grid>
                <Grid xs={ 12 }>
                    {
                        selectedAPIResources?.length > 0 
                            ? (
                                <div className="role-permission-list field">
                                    <label className="form-label">
                                        { t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                                            "permissions.label") }
                                    </label>
                                    <EmphasizedSegment
                                        data-componentid={ componentId }
                                        basic
                                        loading={ 
                                            selectedAPIResourceId &&
                                            (isSelectedAPIResourceFetchRequestLoading 
                                                || isSelectedAPIResourceFetchRequestValidating) 
                                        }
                                    >
                                        {
                                            selectedAPIResources?.map((apiResource: APIResourceInterface) => (  
                                                <RoleAPIResourcesListItem 
                                                    key={ apiResource?.id } 
                                                    apiResource={ apiResource }
                                                    onChangeScopes={ onChangeScopes }
                                                    onRemoveAPIResource={ onRemoveAPIResource }
                                                    selectedPermissions={ selectedPermissions?.find(
                                                        (selectedPermission: SelectedPermissionsInterface) =>
                                                            selectedPermission.apiResourceId === apiResource?.id)
                                                        ?.scopes
                                                    }
                                                /> 
                                            ))
                                        }
                                    </EmphasizedSegment>
                                </div>
                            ) : null
                    }
                </Grid>
            </Grid>
        );
    };

/**
 * Default props for the component.
 */
RolePermissionsList.defaultProps = {
    "data-componentid": "role-permission-list"
};
