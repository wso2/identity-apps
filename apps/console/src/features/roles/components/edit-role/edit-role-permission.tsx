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
    LinkInterface,
    RolePermissionInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Heading } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { RenderChip } from "./edit-role-common/render-chip";
import { RoleAPIResourcesListItem } from "./edit-role-common/role-api-resources-list-item";
import { useAPIResources } from "../../../api-resources/api";
import { useGetAuthorizedAPIList } from "../../../api-resources/api/useGetAuthorizedAPIList";
import { APIResourceCategories, APIResourcesConstants } from "../../../api-resources/constants";
import { APIResourceUtils } from "../../../api-resources/utils/api-resource-utils";
import { useGetCurrentOrganizationType } from "../../../organizations/hooks/use-get-organization-type";
import { getAPIResourceDetailsBulk, updateRoleDetails, useAPIResourceDetails } from "../../api";
import { RoleAudienceTypes } from "../../constants/role-constants";
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
    const { isSubOrganization } = useGetCurrentOrganizationType();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ selectedAPIResourceId, setSelectedAPIResourceId ] = useState<string>(undefined);
    const [ selectedAPIResources, setSelectedAPIResources ] = useState<APIResourceInterface[]>([]);
    const [ selectedPermissions, setSelectedPermissions ] = useState<SelectedPermissionsInterface[]>([]);
    const [ initialSelectedPermissions, setInitialSelectedPermissions ] = useState<SelectedPermissionsInterface[]>([]);
    const [ initialAPIResourceIds, setInitialAPIResourceIds ] = useState<string[]>([]);
    const [ isAPIResourcesListLoading, setIsAPIResourcesListLoading ] = useState<boolean>(false);
    const [ allAPIResourcesDropdownOptions, setAllAPIResourcesDropdownOptions ] = useState<DropdownItemProps[]>([]);
    const [ allAPIResourcesListData, setAllAPIResourcesListData ] = useState<APIResourceInterface[]>([]);
    const [ apiCallNextAfterValue, setAPICallNextAfterValue ] = useState<string>(null);

    const shouldFetchAPIResources: boolean = role?.audience?.type?.
        toUpperCase() === RoleAudienceTypes.ORGANIZATION && !isSubOrganization();

    const {
        data: currentAPIResourcesListData,
        isLoading: iscurrentAPIResourcesListLoading,
        error: currentAPIResourcesFetchRequestError,
        mutate: mutatecurrentAPIResourcesList
    } = useAPIResources(apiCallNextAfterValue, null, null, shouldFetchAPIResources);

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
    }, [ selectedAPIResourceFetchRequestError ]);

    useEffect(() => {
        const options: DropdownItemProps[] = [];

        if (role.audience.type.toUpperCase() === RoleAudienceTypes.APPLICATION) {
            // API resources list options when role audience is "application".
            authorizedAPIListForApplication?.map((api: AuthorizedAPIListItemInterface) => {
                if (
                    !selectedAPIResources.find((selectedAPIResource: APIResourceInterface) =>
                        selectedAPIResource?.id === api?.id)) {
                    // Remove this once the backend improvement is done to send the type of the API resource.
                    const apiResourceType: string = api?.identifier?.startsWith("/o/")
                        ? APIResourcesConstants.SYSTEM_ORG
                        : APIResourcesConstants.SYSTEM;

                    options.push({
                        identifier: api.identifier,
                        key: api.id,
                        text: api.displayName,
                        type: api.type ?? apiResourceType,
                        value: api.id
                    });
                }
            });

            setAllAPIResourcesDropdownOptions(options);
        }

    }, [ authorizedAPIListForApplication, selectedAPIResources ]);

    useEffect(() => {
        const options: DropdownItemProps[] = [];

        if(role.audience.type.toUpperCase() === RoleAudienceTypes.ORGANIZATION) {
            // API resources list options when role audience is "organization".
            allAPIResourcesListData.map((api: APIResourceInterface) => {
                if (!selectedAPIResources.find((selectedAPIResource: APIResourceInterface) =>
                    selectedAPIResource?.id === api?.id)) {
                    options.push({
                        identifier: api.identifier,
                        key: api.id,
                        text: api.name,
                        type: api.type,
                        value: api.id
                    });
                }
            });

            // Filter out duplicate options
            // ToDo: Remove this once the duplicate issue is fixed.
            const filteredOptions: DropdownItemProps[] = options.filter((
                option: DropdownItemProps, index: number, self: DropdownItemProps[]) =>
                index === self.findIndex((t: DropdownItemProps) => (
                    t.key === option.key
                ))
            );

            setAllAPIResourcesDropdownOptions(filteredOptions);
        }
    }, [ selectedAPIResources ]);

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
    }, [ initialAPIResourceIds, authorizedAPIListForApplication ]);

    /**
     * Assign all the API resources to the dropdown options if the after value is not null.
     */
    useEffect(() => {
        if (!isAPIResourcesListLoading) {
            setIsAPIResourcesListLoading(true);
        }

        let afterValue: string;

        if (currentAPIResourcesListData) {
            const filteredDropdownItemOptions: DropdownItemProps[] =
            (currentAPIResourcesListData?.apiResources.reduce(function (filtered: DropdownItemProps[],
                apiResource: APIResourceInterface) {

                const isCurrentAPIResourceSubscribed: boolean = selectedAPIResources?.length === 0
                    || !selectedAPIResources?.some(
                        (subscribedAPIResource: AuthorizedAPIListItemInterface) =>
                            subscribedAPIResource.identifier === apiResource.identifier);

                if (isCurrentAPIResourceSubscribed) {
                    const isCurrentAPIResourceAlreadyAdded: boolean = allAPIResourcesDropdownOptions.length === 0
                        || !allAPIResourcesDropdownOptions?.some(
                            (dropdownOption: DropdownItemProps) => dropdownOption.key === apiResource.id);

                    if (isCurrentAPIResourceAlreadyAdded) {
                        filtered.push({
                            identifier: apiResource.identifier,
                            key: apiResource.id,
                            text: apiResource.name,
                            type: apiResource.type,
                            value: apiResource.id
                        });
                    }
                }

                return filtered;
            }, []));

            if (role.audience.type.toUpperCase() === RoleAudienceTypes.ORGANIZATION) {
                setAllAPIResourcesDropdownOptions([
                    ...allAPIResourcesDropdownOptions,
                    ...filteredDropdownItemOptions ? filteredDropdownItemOptions : []
                ]);
            }

            // Add the current API resources to the all API resources list.
            setAllAPIResourcesListData([ ...allAPIResourcesListData, ...currentAPIResourcesListData.apiResources ]);

            // Check if there are more API resources to be fetched.
            let isAfterValueExists: boolean = false;

            currentAPIResourcesListData?.links?.forEach((value: LinkInterface) => {
                if (value.rel === APIResourcesConstants.NEXT_REL) {
                    afterValue = value.href.split(`${APIResourcesConstants.AFTER}=`)[1];

                    if (afterValue !== apiCallNextAfterValue) {
                        setAPICallNextAfterValue(afterValue);
                        isAfterValueExists = true;
                    }
                }
            });

            if (isAfterValueExists) {
                mutatecurrentAPIResourcesList();
            } else {
                setIsAPIResourcesListLoading(false);
            }
        }
    }, [ currentAPIResourcesListData ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching API resources.
     */
    useEffect(() => {
        if (currentAPIResourcesFetchRequestError) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.message")
            }));
        }
    }, [ currentAPIResourcesFetchRequestError ]);

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
                            authorizedAPIListForApplication?.find(
                                (api: AuthorizedAPIListItemInterface) => api.id === apiResource.id
                            );

                        if (selectedAPIResource) {
                            selectedAPIResourcesList.push({
                                id: selectedAPIResource.id,
                                identifier: selectedAPIResource.identifier,
                                name: selectedAPIResource.displayName,
                                scopes: selectedAPIResource.authorizedScopes,
                                type: selectedAPIResource.type
                            });
                        }
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
     * Handles the selection of an API resource.
     *
     * Only retrieve the API resource details when the role audience is "organization",
     * else add the API resource to the selected API resources list from the authorized API list.
     */
    const onAPIResourceSelected = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        event.preventDefault();
        if (role?.audience?.type?.toUpperCase() === RoleAudienceTypes.ORGANIZATION) {
            setSelectedAPIResourceId(data?.value?.toString());
        } else {
            const selectedAPIResource: AuthorizedAPIListItemInterface = authorizedAPIListForApplication?.find(
                (api: AuthorizedAPIListItemInterface) => api?.id === data?.value?.toString()
            );

            const apiResourceType: string = selectedAPIResource?.identifier?.startsWith("/o/")
                ? APIResourcesConstants.SYSTEM_ORG
                : APIResourcesConstants.SYSTEM;

            setSelectedAPIResources([
                {
                    id: selectedAPIResource?.id,
                    identifier: selectedAPIResource?.identifier,
                    name: selectedAPIResource?.displayName,
                    scopes: selectedAPIResource?.authorizedScopes,
                    type: selectedAPIResource?.type ?? apiResourceType
                },
                ...selectedAPIResources
            ]);
        }
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
                    getOptionLabel={ (apiResourcesListOption: DropdownProps) =>
                        apiResourcesListOption.text }
                    groupBy={ (apiResourcesListOption: DropdownItemProps) =>
                        APIResourceUtils.resolveApiResourceGroup(apiResourcesListOption?.type) }
                    isOptionEqualToValue={
                        (option: DropdownProps, value: DropdownProps) =>
                            option.value === value.value
                    }
                    loading={ shouldFetchAPIResources && iscurrentAPIResourcesListLoading }
                    onChange={ onAPIResourceSelected }
                    options={ allAPIResourcesDropdownOptions
                        ?.filter((item: DropdownItemProps) =>
                            item?.type === APIResourceCategories.TENANT_ADMIN ||
                            item?.type === APIResourceCategories.TENANT_USER ||
                            item?.type === APIResourceCategories.ORGANIZATION_ADMIN ||
                            item?.type === APIResourceCategories.ORGANIZATION_USER ||
                            item?.type === APIResourceCategories.BUSINESS
                        ).sort((a: DropdownItemProps, b: DropdownItemProps) =>
                            -b?.type?.localeCompare(a?.type)
                        )
                    }
                    noOptionsText={ t("common:noResultsFound") }
                    renderInput={ (params: AutocompleteRenderInputParams) => (
                        <TextField
                            { ...params }
                            label={ t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                                "apiResource.label") }
                            placeholder={ t("console:manage.features.roles.addRoleWizard.forms." +
                                "rolePermission.apiResource.placeholder") }
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
