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

import Button from "@oxygen-ui/react/Button";
import Grid from "@oxygen-ui/react/Grid";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    RolePermissionInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment, Heading } from "@wso2is/react-components";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps } from "semantic-ui-react";
import { RoleAPIResourcesListItem } from "./edit-role-common/role-api-resources-list-item";
import { getAPIResourceDetailsBulk, updateRoleDetails, useAPIResourceDetails, useAPIResourcesList } from "../../api";
import { RoleConstants } from "../../constants/role-constants";
import { PatchRoleDataInterface, PermissionUpdateInterface, SelectedPermissionsInterface } from "../../models";
import { APIResourceInterface, ScopeInterface } from "../../models/apiResources";

/**
 * Interface to capture permission edit props.
 */
interface RolePermissionDetailProps extends IdentifiableComponentInterface {
    /**
     * Role details
     */
    role: RolesInterface;
    /**
     * Handle role update callback.
     */
    onRoleUpdate: (activeTabIndex: number) => void;
    /**
     * Tab index
     */
    tabIndex: number;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
}

/**
 * Component to update permissions of the selected role.
 */
export const UpdatedRolePermissionDetails: FunctionComponent<RolePermissionDetailProps> = (props:
    RolePermissionDetailProps): ReactElement => {
    
    const {
        isReadOnly,
        role,
        onRoleUpdate,
        tabIndex,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isAPIResourcesSearching, setAPIResourcesSearching ] = useState<boolean>(false);
    const [ apiResourceSearchQuery, setAPIResourceSearchQuery ] = useState<string>(undefined);
    const [ selectedAPIResourceId, setSelectedAPIResourceId ] = useState<string>(undefined);
    const [ apiResourcesListOptions, setAPIResourcesListOptions ] = useState<DropdownProps[]>([]);
    const [ selectedAPIResources, setSelectedAPIResources ] = useState<APIResourceInterface[]>([]);
    const [ selectedPermissions, setSelectedPermissions ] = useState<SelectedPermissionsInterface[]>([]);
    const [ initialSelectedPermissions, setInitialSelectedPermissions ] = useState<SelectedPermissionsInterface[]>([]);
    const [ initialAPIResourceIds, setInitialAPIResourceIds ] = useState<string[]>([]);

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

    useEffect(() => {
        getExistingAPIResources();
    }, [ role ]);

    /**
     * Show error if the API resource fetch request failed.
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
        }
    }, [ selectedAPIResourceFetchRequestError, apiResourcsListFetchRequestError ]);

    useEffect(() => {
        const options: DropdownProps[] = [];

        apiResourcesList?.apiResources?.map((apiResource: APIResourceInterface) => {
            if (!selectedAPIResources.find((selectedAPIResource: APIResourceInterface) => 
                selectedAPIResource?.id === apiResource?.id)) {
                options.push({
                    key: apiResource?.id,
                    text: apiResource?.name,
                    value: apiResource?.id
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

    useEffect(() => {
        getAPIResourceById(initialAPIResourceIds);
    }, [ initialAPIResourceIds ]);
        
    const getAPIResourceById = async (initialAPIResourceIds: string[]): Promise<void> => {
        const apiResourceIds: string[] = initialAPIResourceIds;

        if (apiResourceIds.length === 0) {
            return;
        }

        getAPIResourceDetailsBulk(apiResourceIds)
            .then((response: APIResourceInterface[]) => {
                setSelectedAPIResources(response);
            })
            .catch(() => {
                handleAlerts({
                    description: t("console:manage.features.roles.notifications." +
                        "fetchAPIResource.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.notifications.fetchAPIResource.error.message")
                });
            });
    };

    const getExistingAPIResources = (): void => {
        const currentPermissions: SelectedPermissionsInterface[] = [];
        const uniqueAPIResourceIds: string[] = [];

        role?.permissions?.forEach((permission: RolePermissionInterface | string) => {
            // Check if permission is of type RolePermissionInterface
            if (typeof permission !== "string") {
                const apiResourceId: string = permission["$ref"].split("/")[7];

                // Populate the selected permissions list.
                if (!currentPermissions.find((selectedPermission: SelectedPermissionsInterface) =>
                    selectedPermission.apiResourceId === apiResourceId)) {
                    // Found a new API resource id.                 
                    uniqueAPIResourceIds.push(apiResourceId);
                    
                    // Add it to the selected API resources list.
                    currentPermissions.push({
                        apiResourceId: apiResourceId,
                        scopes: [ {
                            displayName: permission.display,
                            id: permission.value,
                            name: permission.value
                        } ]
                    });
                } else {
                    // Found a matching API resource id
                    const index: number = currentPermissions.findIndex(
                        (selectedPermission: SelectedPermissionsInterface) => 
                            selectedPermission.apiResourceId === apiResourceId
                    );

                    // Add the scope to the existing API resource.
                    currentPermissions[index].scopes.push({
                        displayName: permission.display,
                        id: permission.value,
                        name: permission.value
                    });
                }
            }
        });
        
        setInitialAPIResourceIds(uniqueAPIResourceIds);
        setSelectedPermissions(currentPermissions);
        setInitialSelectedPermissions(currentPermissions);
    };

    /**
     * The following function handles the update of the role permissions.
     */
    const updateRolePermissions = (): void => {
        setIsSubmitting(true);
        const permissionArray: PermissionUpdateInterface[] = [];

        selectedPermissions.forEach((selectedPermission: SelectedPermissionsInterface) => {
            selectedPermission.scopes.map((scope: ScopeInterface) => {
                permissionArray.push({
                    value: scope.name
                });
            });
        });

        const roleData: PatchRoleDataInterface = {
            Operations: [ {
                "op": "replace",
                "value": {
                    "permissions": permissionArray
                }
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        updateRoleDetails(role?.id, roleData)
            .then(() => {
                onRoleUpdate(tabIndex);
                handleAlerts({
                    description: t("console:manage.features.roles.notifications.updateRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.roles.notifications.updateRole.success.message")
                });
            }).catch(() => {
                handleAlerts({
                    description: t("console:manage.features.roles.notifications.updateRole.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.notifications.updateRole.error.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

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
     * Handles the selection of an API resource.
     */
    const onAPIResourceSelected = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setSelectedAPIResourceId(data.value.toString());
    };

    /**
     * Handles the change of the search query of application list.
     */
    const onSearchChangeAPIResources = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setAPIResourcesSearching(true);
        searchAPIResources(data?.searchQuery?.toString().trim());
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

    return (
        <EmphasizedSegment padded="very">
            <Grid xs={ 8 }>
                <Heading as="h4">
                    { t("console:manage.features.roles.edit.permissions.heading") }
                </Heading>
                <Heading as="h6" color="grey" subHeading className="mb-5">
                    { t("console:manage.features.roles.edit.permissions.subHeading") }
                </Heading>
            </Grid>
            <Grid container direction="column" justifyContent="center" alignItems="flex-start" spacing={ 2 }>
                <Grid xs={ 8 }>
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
                            onSearchChange={ onSearchChangeAPIResources }
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
                                        className="mt-2"
                                        data-componentid={ componentId }
                                        basic
                                        loading={ 
                                            selectedAPIResourceId &&
                                            (isSelectedAPIResourceFetchRequestLoading 
                                                || isSelectedAPIResourceFetchRequestValidating) 
                                        }
                                    >
                                        {
                                            selectedAPIResources?.map((apiResource: APIResourceInterface) => {
                                                return (
                                                    <RoleAPIResourcesListItem 
                                                        key={ apiResource?.id }
                                                        apiResource={ apiResource }
                                                        onChangeScopes={ onChangeScopes }
                                                        onRemoveAPIResource={ onRemoveAPIResource }
                                                        initialSelectedPermissions={ initialSelectedPermissions?.find(
                                                            (selectedPermission: SelectedPermissionsInterface) =>
                                                                selectedPermission.apiResourceId === apiResource?.id)
                                                            ?.scopes
                                                        }
                                                        selectedPermissions={ selectedPermissions?.find(
                                                            (selectedPermission: SelectedPermissionsInterface) =>
                                                                selectedPermission.apiResourceId === apiResource?.id)
                                                            ?.scopes
                                                        }
                                                    /> 
                                                );
                                            })
                                        }
                                    </EmphasizedSegment>
                                </div>
                            ) : null
                    }
                </Grid>
            </Grid>
            <Button
                color="primary"
                variant="contained"
                size="small"
                className="mt-5"
                loading={ isSubmitting }
                disabled={ isReadOnly }
                onClick={ () => {
                    updateRolePermissions();
                } }
                data-componentid={ `${ componentId }-update-button` }
            >
                { t("common:update") }
            </Button>
        </EmphasizedSegment>
    );
};

/**
 * Default props for role permissions tab component.
 */
UpdatedRolePermissionDetails.defaultProps = {
    "data-componentid": "edit-role-permissions"
};
