/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Forms } from "@wso2is/forms";
import { 
    Code, 
    ContentLoader, 
    EmptyPlaceholder, 
    SegmentedAccordion, 
    SegmentedAccordionTitleActionInterface 
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    Dispatch,
    FormEvent,
    Fragment,
    FunctionComponent,
    ReactElement,
    SetStateAction,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Checkbox, Grid, Header, Icon, Input, Label, Table } from "semantic-ui-react";
import { getAuthorizedAPIList } from "../../api";
import { Policy } from "../../constants";
import { AuthorizedAPIListItemInterface, AuthorizedPermissionListItemInterface } from "../../models";

/**
 * Interface to capture permission list props.
 */
interface PermissionListProp extends  IdentifiableComponentInterface {
    emphasize?: boolean;
    appId?: string;
    triggerSubmit?: boolean;
    initialValues: string[];
    onSubmit?: (permissions: string[]) => void;
}

/**
 * Component to create the API permission list.
 *
 * @param props - Props containing event handlers and data for permission list.
 */
export const PermissionList: FunctionComponent<PermissionListProp> = (props: PermissionListProp): ReactElement => {

    const {
        appId,
        triggerSubmit,
        onSubmit,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    
    const [ isPermissionsLoading, setIsPermissionsLoading ] = useState<boolean>(true);
    const [ authorizedAPIResourceList, setAuthorizedAPIResourceList ] = useState<AuthorizedAPIListItemInterface[]>([]);
    const [ 
        filteredAuthorizedAPIResourceList,
        setFilteredAuthorizedAPIResourceList
    ] = useState<AuthorizedAPIListItemInterface[]>([]);
    const [ expandedAPIs, setExpandedAPIs ] = useState<string[]>([]);
    const [ assignedPermissions, setAssignedPermissions ] = useState<Set<string>>(new Set());

    useEffect(() => {
        getAPIAuthorizations(appId);
    }, []);

    /**
     * Get the authorized API permissions.
     * 
     * @param appId - Application Id.
     */
    const getAPIAuthorizations = (appId: string): void => {
        getAuthorizedAPIList(appId)
            .then((response: AuthorizedAPIListItemInterface[]) => {
                // Filter out the RBAC enabled APIs when policy identifier field is available.
                const authorizedAPIResourcesRBAC: AuthorizedAPIListItemInterface[] = response.filter(
                    (api: AuthorizedAPIListItemInterface) => {
                        if (api?.policyIdentifier) {
                            return api?.policyIdentifier === Policy.ROLE;
                        }

                        return true;
                    }
                );

                setAuthorizedAPIResourceList(authorizedAPIResourcesRBAC);
                setFilteredAuthorizedAPIResourceList(authorizedAPIResourcesRBAC);
                setExpandedAPIs(getDefaultExpandedAPIs(authorizedAPIResourcesRBAC));
            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ??
                            error?.response?.data?.detail ??
                            t("extensions:develop.applications.edit.sections.roles.notifications." + 
                                "fetchAuthorizedAPIs.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message ??
                            t("extensions:develop.applications.edit.sections.roles.notifications." + 
                                "fetchAuthorizedAPIs.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("extensions:develop.applications.edit.sections.roles.notifications." + 
                        "fetchAuthorizedAPIs.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.roles.notifications." + 
                        "fetchAuthorizedAPIs.genericError.message")
                }));
                setAuthorizedAPIResourceList([]);
                setFilteredAuthorizedAPIResourceList([]);
                setExpandedAPIs([]);
            })
            .finally(() => {
                setIsPermissionsLoading(false);
            });
    };
    
    /**
     * Get default expanded API list.
     * 
     * @param apiList - API list item.
     * @returns Default expanded APIs.
     */
    const getDefaultExpandedAPIs = (apiList: AuthorizedAPIListItemInterface[]): string[] => {
        const initialExpandedAPIs: string[] = [];

        apiList.map(
            (api: AuthorizedAPIListItemInterface) => {
                initialExpandedAPIs.push(api.apiId);
            }
        );

        return initialExpandedAPIs;
    };

    /**
     * Handle the expand/collapse of the APIs.
     * 
     * @param api - API list item.
     */
    const handleAccordionTitleClick = (api: AuthorizedAPIListItemInterface) => {
        let tempExpandedAPIs: string[] = [ ...expandedAPIs ];

        if (!expandedAPIs?.includes(api.apiId)) {
            tempExpandedAPIs.push(api.apiId);
        } else {
            tempExpandedAPIs =  tempExpandedAPIs
                .filter((apiDeselected: string) =>
                    apiDeselected !== api.apiId);
        }
        setExpandedAPIs(tempExpandedAPIs);
    };

    /**
     * Handle checkbox change of a permission.
     * 
     * @param permissionName - Permission name.
     */
    const handleCheckboxChange = (permissionName: string) => {
        const permissions: Set<string> = assignedPermissions;

        assignedPermissions.has(permissionName)
            ? permissions.delete(permissionName)
            : permissions.add(permissionName);
        
        setAssignedPermissions(new Set(permissions));
    };

    /**
     * Handle select all permissions of an API resource.
     * 
     * @param apiResource - API list item.
     */
    const handleSelectAllPermissions = (apiResource: AuthorizedAPIListItemInterface) => {
        const permissions: Set<string> = assignedPermissions;

        if (areAllPermissionsSelectedForApi(apiResource)) {
            apiResource.permissions.forEach((permission: AuthorizedPermissionListItemInterface) => {
                permissions.delete(permission.name);
            });
        } else {
            apiResource.permissions.forEach((permission: AuthorizedPermissionListItemInterface) => {
                permissions.add(permission.name);
            });
        }

        setAssignedPermissions(new Set(permissions));
    };

    /**
     * Check whether all the permissions of an API is selected.
     * 
     * @param apiResource - API list item.
     * @returns Whether all the permissions of an API is selected.
     */
    const areAllPermissionsSelectedForApi = (apiResource: AuthorizedAPIListItemInterface): boolean => {
        if (assignedPermissions.size === 0 || apiResource.permissions.length === 0) {
            return false;
        } else {
            let apiResourceAllPermissionsSelected: boolean = true;

            apiResource.permissions.forEach((permission: AuthorizedPermissionListItemInterface) => {
                if (!assignedPermissions.has(permission.name)) {
                    apiResourceAllPermissionsSelected = false;
                }
            });

            return apiResourceAllPermissionsSelected;
        }
    };
        
    /**
     * Handle the search field query change.
     * 
     * @param e - Event.
     * @param query - Search query.
     * @param list - Unfiltered API list.
     * @param stateActionList - Set filtered APIs action.
     * @param stateActionExpanded - Set expanded APIs action.
     */
    const handleSearchFieldChange = (
        e: FormEvent<HTMLInputElement>,
        query: string,
        list: AuthorizedAPIListItemInterface[],
        stateActionList: Dispatch<SetStateAction<any>>,
        stateActionExpanded: Dispatch<SetStateAction<any>>
    ) => {

        if (query.length > 0) {
            searchFilter(query, list, stateActionList, stateActionExpanded);
        } else {
            stateActionList(list);
            stateActionExpanded(getDefaultExpandedAPIs(list));
        }
    };

    /**
     * Search operation for API/permissions.
     *
     * @param changeValue - Search value.
     * @param list - Unfiltered API list.
     * @param stateActionList - Set filtered APIs action.
     * @param stateActionExpanded - Set expanded APIs action.
     */
    const searchFilter = (
        changeValue: string,
        list: AuthorizedAPIListItemInterface[], 
        stateActionList: Dispatch<SetStateAction<any>>,
        stateActionExpanded:  Dispatch<SetStateAction<any>>
    ) => {
        if (changeValue !== ""){
            const apiFiltered: AuthorizedAPIListItemInterface[] = list
                .filter((item: AuthorizedAPIListItemInterface) =>
                    item.apiDisplayName?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
 
            const unfilteredAPIs: AuthorizedAPIListItemInterface[] = [ ...list ];
            const tempExpandedAPIs: string[] = [];
            const apiPermissionsFiltered: AuthorizedAPIListItemInterface[] = [];
 
            unfilteredAPIs.forEach((api: AuthorizedAPIListItemInterface) => {
                const matchedPermissions: AuthorizedPermissionListItemInterface[] = api.permissions
                    .filter((permission: AuthorizedPermissionListItemInterface) =>
                        (permission.displayName?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1 ));
 
                if (matchedPermissions !== undefined && matchedPermissions.length !== 0) {
 
                    if (!tempExpandedAPIs.includes(api.apiId)) {
                        tempExpandedAPIs.push(api.apiId);
                    }
 
                    const updatedAPI: AuthorizedAPIListItemInterface = {
                        ...api,
                        permissions: matchedPermissions
                    };

                    apiPermissionsFiltered.push(updatedAPI);
                }
                apiFiltered.map((apiTemp: AuthorizedAPIListItemInterface) => {
                    if (apiTemp.apiId === api.apiId && matchedPermissions.length === 0){
                        apiPermissionsFiltered.push(api);
                    }
                });
            });
            stateActionList(apiPermissionsFiltered);
            stateActionExpanded(tempExpandedAPIs);
        }
    };

    /**
     * Get the permissions segmented accordion title.
     * 
     * @param apiDisplayName - API display name.
     * @returns Segmented accordion title.
     */
    const getPermissionsSegmentedAccordionTitle = (apiDisplayName: string): ReactElement =>
        (
            <Header
                as="h6"
                data-componentId={ `${ componentId }-item-heading` }
            >
                <Header.Content className="align-self-center">
                    { apiDisplayName }
                    <Header.Subheader>
                        <Label size="mini" className="ml-0">
                            { t("extensions:develop.applications.edit.sections.roles.labels.apiResource") }
                        </Label>
                    </Header.Subheader>
                </Header.Content>
            </Header>
        );

    /**
     * Render the permission list of an API list item.
     * 
     * @param permissions - Permission list.
     * @returns Permission list component.
     */
    const resolvePermissionsList = (permissions: AuthorizedPermissionListItemInterface[]): ReactElement => {
        return (
            <Table
                fixed
                className="opaque"
                compact="very"
                size="small"
            >
                {
                    permissions.map((permission: AuthorizedPermissionListItemInterface, index: number) => {
                        return (
                            <Table.Row key={ permission.id } width="15">
                                <Table.Cell width="1">
                                    <Checkbox 
                                        data-componentid={ `${ componentId }-permission-item-${ index }` }
                                        checked={ assignedPermissions?.has(permission.name) }
                                        onClick={ () => handleCheckboxChange(permission.name) }
                                    />
                                </Table.Cell>
                                <Table.Cell width="14">
                                    <Header.Content>
                                        { permission.displayName }
                                        <Header.Subheader>
                                            <Code withBackground>{ permission.name }</Code>
                                        </Header.Subheader>
                                    </Header.Content>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })
                }
            </Table>
        );
    };

    /**
     * Creates the actions of the subscribed API Resources list item. 
     * 
     * @param apiResource - API resource.
     * @returns Segmented accordion title action list.
     */
    const createAccordionTitleAction = (apiResource: AuthorizedAPIListItemInterface):
        SegmentedAccordionTitleActionInterface[] => {

        return [ {
            checked: areAllPermissionsSelectedForApi(apiResource),
            disabled: apiResource.permissions.length === 0,
            onChange: () => handleSelectAllPermissions(apiResource),
            popoverText: t("extensions:develop.applications.edit.sections.roles.labels.selectAllPermissions"),
            type: "checkbox popup"
        } ];
    };

    /**
     * Render the API list with permissions.
     *
     * @returns API list component.
     */
    const renderAPIList = (): ReactElement => (
        <Grid className="wizard-content-grid">
            <SegmentedAccordion
                fluid
                data-componentid={ `${ componentId }-permissions` }
                className="nested-list-accordion"
                viewType="table-view"
            >
                { filteredAuthorizedAPIResourceList?.map(
                    (api: AuthorizedAPIListItemInterface) => {
                        return (
                            <Fragment key={ api.apiId }>
                                <SegmentedAccordion.Title
                                    id={ api.apiId }
                                    data-componentid={ `${componentId}-${api.apiId}-title` }
                                    active={ expandedAPIs?.includes(api.apiId) }
                                    attached
                                    accordionIndex={ api.apiId }
                                    className="nested-list-accordion-title"
                                    onClick={ () => handleAccordionTitleClick(api) }
                                    content={ 
                                        getPermissionsSegmentedAccordionTitle(api.apiDisplayName) 
                                    }
                                    type="checkbox popup"
                                    actions={ createAccordionTitleAction(api) }
                                />
                                <SegmentedAccordion.Content
                                    emphasized={ false }
                                    active={ expandedAPIs?.includes(api.apiId) }
                                    className="nested-list-accordion-content-checkbox"
                                    data-componentid={ `${componentId}-${api.apiId}-content` }
                                    children={ resolvePermissionsList(api.permissions) }
                                />
                            </Fragment>
                        );
                    })
                }
            </SegmentedAccordion>
        </Grid>
    );

    return (
        isPermissionsLoading
            ? <ContentLoader inline="centered" />
            :  (
                <Forms
                    submitState={ triggerSubmit }
                    onSubmit={ () => { onSubmit([ ...assignedPermissions ]); } }
                >
                    <Grid>
                        {
                            authorizedAPIResourceList?.length === 0
                                ? (
                                    <Grid.Row stretched>
                                        <Grid.Column>
                                            <EmptyPlaceholder
                                                subtitle={ [ t("extensions:develop.applications.edit.sections.roles." + 
                                                    "placeHolders.emptyPermissions.subtitles.0") ] }
                                                data-componentid={ `${ componentId }-empty-permission-placeholder` }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                                : (
                                    <>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Input
                                                    data-componentid=
                                                        { `${ componentId }-permissions-list-search-input` }
                                                    icon={ <Icon name="search" /> }
                                                    placeholder={ t("extensions:develop.applications.edit.sections." + 
                                                        "roles.addRoleWizard.forms.rolePermissions.searchPlaceholer") }
                                                    onChange={ (
                                                        e: FormEvent<HTMLInputElement>,
                                                        { value }: { value: string; }
                                                    ) => {
                                                        handleSearchFieldChange(e, value, authorizedAPIResourceList, 
                                                            setFilteredAuthorizedAPIResourceList, setExpandedAPIs);
                                                    } }
                                                    fluid
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                { renderAPIList() }
                                            </Grid.Column>
                                        </Grid.Row>
                                    </>                               
                                )
                        }
                    </Grid>
                </Forms>
            ) 
    );
};
