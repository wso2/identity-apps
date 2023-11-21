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

import Alert from "@oxygen-ui/react/Alert";
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Grid from "@oxygen-ui/react/Grid";
import TextField from "@oxygen-ui/react/TextField";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, LinkInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { RoleAPIResourcesListItem } from "./components/role-api-resources-list-item";
import { useAPIResources } from "../../../../api-resources/api";
import { APIResourcesConstants } from "../../../../api-resources/constants";
import { useAPIResourceDetails, useAPIResourcesList, useGetAuthorizedAPIList } from "../../../api";
import { RoleAudienceTypes } from "../../../constants/role-constants";
import { APIResourceInterface, AuthorizedAPIListItemInterface, ScopeInterface } from "../../../models/apiResources";
import { SelectedPermissionsInterface } from "../../../models/roles";

/**
 * Interface to capture permission list props
 */
interface RolePermissionsListProp extends IdentifiableComponentInterface {
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
    /**
     * Role audience.
     */
    roleAudience: RoleAudienceTypes;
    /**
     * Assigned application id.
     */
    assignedApplicationId?: string;
    /**
     * Assigned application name.
     */
    assignedApplicationName?: string;
}

export const RolePermissionsList: FunctionComponent<RolePermissionsListProp> = 
    (props: RolePermissionsListProp): ReactElement => {

        const {
            selectedPermissions,
            setSelectedPermissions,
            setIsPermissionStepNextButtonDisabled,
            roleAudience,
            assignedApplicationId,
            assignedApplicationName,
            [ "data-componentid" ]: componentId
        } = props;
        
        const { t } = useTranslation();
        const dispatch: Dispatch = useDispatch();

        const [ previousRoleAudience, setPreviousRoleAudience ] = useState<RoleAudienceTypes>(undefined);
        const [ apiResourcesListOptions, setAPIResourcesListOptions ] = useState<DropdownProps[]>([]);
        const [ selectedAPIResources, setSelectedAPIResources ] = useState<APIResourceInterface[]>([]);
        const [ apiResourceSearchQuery, setAPIResourceSearchQuery ] = useState<string>(undefined);
        const [ selectedAPIResourceId, setSelectedAPIResourceId ] = useState<string>(undefined);
        const [ isAPIResourcesListLoading, setIsAPIResourcesListLoading ] = useState<boolean>(false);
        const [ allAPIResourcesDropdownOptions, setAllAPIResourcesDropdownOptions ] = useState<DropdownItemProps[]>([]);
        const [ allAPIResourcesListData, setAllAPIResourcesListData ] = useState<APIResourceInterface[]>([]);
        const [ apiCallNextAfterValue, setAPICallNextAfterValue ] = useState<string>(null);

        const {
            data: apiResourcesList,
            isLoading: isAPIResourcesListFetchRequestLoading,
            error: apiResourcsListFetchRequestError,
            mutate: mutateAPIResourcesListFetchRequest
        } = useAPIResourcesList(apiResourceSearchQuery);

        const {
            data: currentAPIResourcesListData,
            isLoading: iscurrentAPIResourcesListLoading,
            error: currentAPIResourcesFetchRequestError,
            mutate: mutatecurrentAPIResourcesList
        } = useAPIResources(apiCallNextAfterValue);

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
        } = useGetAuthorizedAPIList(assignedApplicationId);

        /**
         * Reset the selected API resources list when the role audience is changed.
         */
        useEffect(() => {
            if (roleAudience !== previousRoleAudience) {
                setSelectedAPIResources([]);
                setSelectedPermissions([]);
                setPreviousRoleAudience(roleAudience);
            }
        }, [ roleAudience ]);

        /**
         * Show error if the API resource fetch request failed.
         */ 
        useEffect(() => {
            if ( selectedAPIResourceFetchRequestError 
                || apiResourcsListFetchRequestError 
                || authorizedAPIListForApplicationError ) {
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

        /**
         * API resources list options.
         */
        useEffect(() => {
            const options: DropdownProps[] = [];

            if(roleAudience === RoleAudienceTypes.ORGANIZATION) {
                // API resources list options when role audience is "organization".
                apiResourcesList?.apiResources?.map(
                    (apiResource: APIResourceInterface) => {
                        if (!selectedAPIResources.find(
                            (selectedAPIResource: APIResourceInterface) => 
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
                    if (!selectedAPIResources.find((selectedAPIResource: APIResourceInterface) => 
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
                                key: apiResource.id,
                                text: apiResource.name,
                                type: apiResource.type,
                                value: apiResource.id
                            });
                        }
                    }

                    return filtered;
                }, []));

                setAllAPIResourcesDropdownOptions([
                    ...allAPIResourcesDropdownOptions,
                    ...filteredDropdownItemOptions ? filteredDropdownItemOptions : []
                ]);

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

        /**
         * Handles the selection of an API resource.
         * 
         * Only retrieve the API resource details when the role audience is "organization",
         * else add the API resource to the selected API resources list from the authorized API list.
         */
        const onAPIResourceSelected = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
            event.preventDefault();
            if(roleAudience === RoleAudienceTypes.ORGANIZATION) {
                setSelectedAPIResourceId(data?.value?.toString());
            } else {
                const selectedAPIResource: AuthorizedAPIListItemInterface = authorizedAPIListForApplication?.find(
                    (api: AuthorizedAPIListItemInterface) => api?.id === data?.value?.toString()
                );

                if (!selectedAPIResource) {
                    return;
                }

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

        /**
         * Handles the change of the assigned scopes(permissions) of a role.
         */
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
                {
                    roleAudience === RoleAudienceTypes.APPLICATION 
                        ? (
                            <Grid xs={ 12 }>
                                <Alert severity="info">
                                    <Trans 
                                        i18nKey= { "console:manage.features.roles.addRoleWizard.forms." + 
                                            "rolePermission.notes.applicationRoles" }
                                        tOptions={ { applicationName: assignedApplicationName } }
                                    >
                                        Only the APIs and the scopes(permissions) that are authorized in the selected 
                                        application (<b>{ assignedApplicationName }</b>) will be listed to select
                                    </Trans>
                                    
                                </Alert>
                            </Grid>
                        ) : null
                }
                <Grid xs={ 12 }>
                    {
                        iscurrentAPIResourcesListLoading
                            ? <ContentLoader inline="centered" active />
                            : (
                                <Autocomplete
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
                                    groupBy={ (apiResourcesListOption: DropdownProps) => apiResourcesListOption.type }
                                    isOptionEqualToValue={ 
                                        (option: DropdownProps, value: DropdownProps) => 
                                            option.value === value.value 
                                    }
                                    onChange={ onAPIResourceSelected }
                                    options={ allAPIResourcesDropdownOptions
                                        .sort((a: DropdownItemProps, b: DropdownItemProps) =>
                                            -b?.type?.localeCompare(a?.type)) }
                                    noOptionsText={
                                        isAPIResourcesListFetchRequestLoading
                                            ? t("common:searching")
                                            : t("common:noResultsFound")
                                    }
                                    renderInput={ (params: AutocompleteRenderInputParams) => (
                                        <TextField
                                            { ...params }
                                            label={ t("console:manage.features.roles.addRoleWizard.forms." +
                                                "rolePermission.apiResource.label") }
                                            placeholder={ t("console:manage.features.roles.addRoleWizard.forms." +
                                                "rolePermission.apiResource.placeholder") }
                                            size="small"
                                        />
                                    ) }
                                />
                            )
                    }
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
                                        className="role-permission-list"
                                        basic
                                        loading={ 
                                            selectedAPIResourceId &&
                                            (isSelectedAPIResourceFetchRequestLoading 
                                            || isSelectedAPIResourceFetchRequestValidating
                                            || isAuthorizedAPIListForApplicationLoading) 
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
