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
import Button from "@oxygen-ui/react/Button";
import Grid from "@oxygen-ui/react/Grid";
import TextField from "@oxygen-ui/react/TextField";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    RolePermissionInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Heading } from "@wso2is/react-components";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps } from "semantic-ui-react";
import { RenderChip } from "./edit-role-common/render-chip";
import { RoleAPIResourcesListItem } from "./edit-role-common/role-api-resources-list-item";
import { useGetAuthorizedAPIList } from "../../../api-resources/api/useGetAuthorizedAPIList";
import { getAPIResourceDetailsBulk, updateRoleDetails, useAPIResourceDetails, useAPIResourcesList } from "../../api";
import { RoleAudienceTypes, RoleConstants } from "../../constants/role-constants";
import { PatchRoleDataInterface, PermissionUpdateInterface, SelectedPermissionsInterface } from "../../models";
import { APIResourceInterface, AuthorizedAPIListItemInterface, ScopeInterface } from "../../models/apiResources";

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
    } = useAPIResourcesList(apiResourceSearchQuery, !isReadOnly);

    const {
        data: selectedAPIResource,
        isLoading: isSelectedAPIResourceFetchRequestLoading,
        isValidating: isSelectedAPIResourceFetchRequestValidating,
        error: selectedAPIResourceFetchRequestError
    } = useAPIResourceDetails(selectedAPIResourceId);

    const {
        data: authorizedAPIListForApplication,
        isLoading: isAuthorizedAPIListForApplicationLoading,
        error: authorizedAPIListForApplicationError
    } = useGetAuthorizedAPIList(
        role.audience.type.toUpperCase() === RoleAudienceTypes.APPLICATION ? role.audience.value : null
    );

    useEffect(() => {
        !isReadOnly
            ? getExistingAPIResources()
            : null;
    }, [ role ]);

    /**
     * Show error if the API resource fetch request failed.
     */
    useEffect(() => {
        if (
            selectedAPIResourceFetchRequestError ||
            apiResourcsListFetchRequestError ||
            authorizedAPIListForApplicationError
        ) {
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

        if (role.audience.type.toUpperCase() === RoleAudienceTypes.ORGANIZATION) {
            // API resources list options when role audience is "organization".
            apiResourcesList?.apiResources?.map((apiResource: APIResourceInterface) => {
                if (!selectedAPIResources.find((selectedAPIResource: APIResourceInterface) =>
                    selectedAPIResource?.id === apiResource?.id)) {
                    options.push({
                        key: apiResource.id,
                        text: apiResource.name,
                        type: apiResource.type,
                        value: apiResource.id
                    });
                }
            });
        } else {
            // API resources list options when role audience is "application".
            authorizedAPIListForApplication?.map((api: AuthorizedAPIListItemInterface) => {
                if (
                    !selectedAPIResources.find((selectedAPIResource: APIResourceInterface) =>
                        selectedAPIResource?.id === api?.id)) {
                    options.push({
                        key: api.id,
                        text: api.displayName,
                        value: api.id
                    });
                }
            });
        }

        setAPIResourcesListOptions(options);
    }, [ authorizedAPIListForApplication, apiResourcesList, selectedAPIResources ]);

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
                if (role.audience.type.toUpperCase() === RoleAudienceTypes.ORGANIZATION) {
                    setSelectedAPIResources(response);
                } else {
                    const selectedAPIResourcesList: APIResourceInterface[] = [];

                    response.map((apiResource: APIResourceInterface) => {
                        const selectedAPIResource: AuthorizedAPIListItemInterface =
                            authorizedAPIListForApplication.find(
                                (api: AuthorizedAPIListItemInterface) => api.id === apiResource.id
                            );

                        selectedAPIResourcesList.push({
                            id: selectedAPIResource.id,
                            name: selectedAPIResource.displayName,
                            scopes: selectedAPIResource.authorizedScopes
                        });
                    });
                    setSelectedAPIResources(selectedAPIResourcesList);
                }
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
                // Extract the API resource id from the permission object.
                const apiResourceId: string = permission["$ref"].split("/").reverse()[2];

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
            setAPIResourceSearchQuery(
                !isEmpty(query)
                    ? `name co ${query}`
                    : null
            );
            mutateAPIResourcesListFetchRequest().finally(() => {
                setAPIResourcesSearching(false);
            });
        }, RoleConstants.DEBOUNCE_TIMEOUT), []);

    /**
     * Handles the selection of an API resource.
     *
     * Only retrieve the API resource details when the role audience is "organization",
     * else add the API resource to the selected API resources list from the authorized API list.
     */
    const onAPIResourceSelected = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        event.preventDefault();
        if (role.audience.type.toUpperCase() === RoleAudienceTypes.ORGANIZATION) {
            setSelectedAPIResourceId(data.value.toString());
        } else {
            const selectedAPIResource: AuthorizedAPIListItemInterface = authorizedAPIListForApplication.find(
                (api: AuthorizedAPIListItemInterface) => api.id === data.value.toString()
            );

            setSelectedAPIResources([
                {
                    id: selectedAPIResource.id,
                    name: selectedAPIResource.displayName,
                    scopes: selectedAPIResource.authorizedScopes
                },
                ...selectedAPIResources
            ]);
        }
        setAPIResourceSearchQuery(undefined);
    };

    /**
     * Handles the change of the search query of application list.
     */
    const onSearchChangeAPIResources = (event: ChangeEvent<HTMLInputElement>): void => {
        setAPIResourcesSearching(true);
        searchAPIResources(event?.target?.value?.toString().trim());
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

    const editablePermissionList = (): ReactNode => (
        <Grid container direction="column" justifyContent="center" alignItems="flex-start" spacing={ 2 }>
            <Grid xs={ 8 }>
                <Autocomplete
                    disableCloseOnSelect
                    fullWidth
                    aria-label="API resource selection"
                    componentsProps={ {
                        paper: {
                            elevation: 2
                        },
                        popper: {
                            modifiers: [
                                {
                                    enabled: false,
                                    name: "flip"
                                },
                                {
                                    enabled: false,
                                    name: "preventOverflow"
                                }
                            ]
                        }
                    } }
                    getOptionLabel={ (apiResourcesListOption: DropdownProps) => apiResourcesListOption.text }
                    groupBy={ (apiResourcesListOption: DropdownProps) => apiResourcesListOption.type }
                    isOptionEqualToValue={ 
                        (option: DropdownProps, value: DropdownProps) => 
                            option.value === value.value 
                    }
                    loading={ isAPIResourcesSearching }
                    onChange={ onAPIResourceSelected }
                    options={ !isAPIResourcesSearching ? apiResourcesListOptions
                        .sort((a: DropdownProps, b: DropdownProps) =>
                            -b?.type?.localeCompare(a?.type)) : [] }
                    noOptionsText={
                        isAPIResourcesListFetchRequestLoading
                            ? t("common:searching")
                            : t("common:noResultsFound")
                    }
                    renderInput={ (params: AutocompleteRenderInputParams) => (
                        <TextField
                            { ...params }
                            label={ t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                                "apiResource.label") }
                            onChange={ onSearchChangeAPIResources }
                            placeholder={ t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                                "apiResource.placeholder") }
                            size="small"
                        />
                    ) }
                />
            </Grid>
            <Grid xs={ 12 }>
                {
                    selectedAPIResources?.length > 0
                        ? (
                            <div className="role-permission-list field">
                                <label className="form-label">
                                    { t("console:manage.features.roles.addRoleWizard." +
                                        "forms.rolePermission.permissions.label") }
                                </label>
                                <EmphasizedSegment
                                    className="mt-2"
                                    data-componentid={ componentId }
                                    basic
                                    loading={
                                        selectedAPIResourceId &&
                                        (isSelectedAPIResourceFetchRequestLoading
                                            || isSelectedAPIResourceFetchRequestValidating
                                            || isAuthorizedAPIListForApplicationLoading)
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
    );

    const readOnlyPermissionList = (): ReactNode => (
        <Autocomplete
            readOnly
            multiple
            options={ role?.permissions ?? [] }
            defaultValue={ role?.permissions ?? [] }
            getOptionLabel={ (scope: RolePermissionInterface) => scope.display }
            renderInput={ (params: AutocompleteRenderInputParams) => (
                <TextField
                    { ...params }
                    data-componentid={ `${componentId}-textfield` }
                />
            ) }
            renderTags={ (
                value: RolePermissionInterface[],
                getTagProps: AutocompleteRenderGetTagProps
            ) => value.map((option: RolePermissionInterface, index: number) => (
                <RenderChip
                    { ...getTagProps({ index }) }
                    key={ index }
                    className="pt-5 m-1"
                    primaryText={ option.display }
                    secondaryText={ option.value }
                    option={ option }
                    activeOption={ null }
                    setActiveOption={ () => null }
                    variant="solid"
                />
            )) }
        />
    );

    return (
        <EmphasizedSegment padded="very">
            <Grid xs={ 8 }>
                <Heading as="h4">
                    { t("console:manage.features.roles.edit.permissions.heading") }
                </Heading>
                {
                    isReadOnly ? (
                        <Heading as="h6" color="grey" subHeading className="mb-5">
                            { t("console:manage.features.roles.edit.permissions.readOnlySubHeading") }
                        </Heading>
                    ) : (
                        <Heading as="h6" color="grey" subHeading className="mb-5">
                            { t("console:manage.features.roles.edit.permissions.subHeading") }
                        </Heading>
                    )
                }
            </Grid>
            {
                isReadOnly ? readOnlyPermissionList() : editablePermissionList()
            }
            {
                !isReadOnly && (
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
                )
            }
        </EmphasizedSegment>
    );
};

/**
 * Default props for role permissions tab component.
 */
UpdatedRolePermissionDetails.defaultProps = {
    "data-componentid": "edit-role-permissions"
};
