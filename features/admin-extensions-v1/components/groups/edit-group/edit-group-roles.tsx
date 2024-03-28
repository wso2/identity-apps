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

import {
    AlertLevels,
    IdentifiableComponentInterface,
    LoadableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    Button,
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    Link,
    LinkButton,
    Popup,
    PrimaryButton,
    SegmentedAccordion,
    Text,
    useDocumentation,
    useWizardAlert
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
import { Checkbox, Divider, Grid, Header, Icon, Input, Label, Modal, Table } from "semantic-ui-react";
import { getApplicationList } from "../../../../admin-applications-v1/api";
import { ApplicationListInterface, ApplicationListItemInterface } from "../../../../admin-applications-v1/models";
import { getEmptyPlaceholderIllustrations, history } from "../../../../features/core";
import { GroupsInterface } from "../../../../features/groups";
import {
    getAllApplicationRolesList,
    getAssignedApplicationRolesList,
    updateGroupRoleMapping
} from "../api/application-roles";
import { GroupsConstants } from "../constants/groups-constants";
import {
    ApplicationRoleInterface,
    GroupRoleAssignPayloadInterface,
    RoleBasicInterface
} from "../models/application-roles";

/**
 * Proptypes for the group users list component.
 */
interface GroupRolesListProps extends IdentifiableComponentInterface, LoadableComponentInterface {
    group: GroupsInterface;
    isGroup: boolean;
    isReadOnly?: boolean;
    onGroupUpdate: (groupId: string) => void;
    isGroupDetailsRequestLoading: boolean;
}

/**
 * Group roles tab component.
 * 
 * @param props - Props related to group roles tab component.
 */
export const GroupRolesList: FunctionComponent<GroupRolesListProps> = (props: GroupRolesListProps): ReactElement => {
    const {
        isReadOnly,
        group,
        onGroupUpdate,
        isGroupDetailsRequestLoading,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const { getLink } = useDocumentation();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const [ appList, setAppList ] = useState<ApplicationListItemInterface[]>(null);
    const [ allApplicationRoleList, setAllApplicationRoleList ] = useState<ApplicationRoleInterface[]>([]);
    const [ selectedApplicationRoleList, setSelectedApplicationRoleList ] = useState<ApplicationRoleInterface[]>([]);
    const [ 
        allFilteredApplicationRoleList,
        setAllFilteredApplicationRoleList
    ] = useState<ApplicationRoleInterface[]>([]);
    const [ 
        selectedFilteredApplicationRoleList,
        setSelectedFilteredApplicationRoleList
    ] = useState<ApplicationRoleInterface[]>([]);
    const [ isAssignedRolesFetchRequestLoading, setIsAssignedRolesFetchRequestLoading ] = useState<boolean>(true);
    const [ isApplicationRolesFetchRequestLoading, setIsApplicationRolesFetchRequestLoading ] = useState<boolean>(true);
    const [ isApplicationsFetchRequestLoading, setIsApplicationFetchRequestLoading ] = useState<boolean>(true);
    const [ showAssignApplicationRolesModal, setShowAssignApplicationRolesModal ] = useState<boolean>(false);

    const [ addedRoles, setAddedRoles ] = useState<string[]>([]);
    const [ removedRoles, setRemovedRoles ] = useState<string[]>([]);
    const [ checkedRoles, setCheckedRoles ] = useState<string[]>([]);

    const [ expandedApplications, setExpandedApplications ] = useState<string[]>([]);
    const [ expandedAssignedApplications, setExpandedAssignedApplications ] = useState<string[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        getApplicationList(null, null, null)
            .then((response: ApplicationListInterface) => {
                setAppList(response.applications);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.fetchApplications." +
                            "error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("applications:notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.fetchApplications." +
                        "genericError.message")
                }));
            })
            .finally(() => {
                setIsApplicationFetchRequestLoading(false);
            });
    }, []);

    useEffect(() => {
        if (appList) {
            getAssignedApplicationRoles();
            getAllApplicationRoles();
        }
    }, [ group, appList ]);

    /*
    * Navigate to the API Resources page.
    */
    const navigateToApplications = () => history.push(GroupsConstants.getPaths().get("APPLICATIONS"));

    const getPlaceholders = (): ReactElement => {
        if (allApplicationRoleList?.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    action={ ( 
                        <Link
                            data-componentid={ `${componentId}-link-api-resource-page` }
                            onClick={ navigateToApplications }
                            external={ false }
                        >
                            { t("extensions:manage.groups.edit.roles.placeHolders.emptyRoles.action") }
                        </Link> 
                    ) }
                    imageSize="tiny"
                    title={ t("extensions:manage.groups.edit.roles.placeHolders.emptyRoles.title") }
                    subtitle={ [ t("extensions:manage.groups.edit.roles.placeHolders.emptyRoles.subtitles.0"),
                        t("extensions:manage.groups.edit.roles.placeHolders.emptyRoles.subtitles.1") ] }
                    data-componentid={ `${componentId}-sub-empty-placeholder-icon` }
                />
            );
        } else if (selectedApplicationRoleList?.length === 0) {
            return (
                <EmptyPlaceholder
                    title={ t("extensions:manage.groups.edit.roles.placeHolders.emptyList.title") }
                    subtitle={ [ t("extensions:manage.groups.edit.roles.placeHolders.emptyList.subtitles.0") ] }
                    action={
                        !isReadOnly && (
                            <PrimaryButton
                                data-componentid={ `${ componentId }-empty-assign-roles-button` }
                                onClick={ openAssignApplicationRolesModal }
                            >
                                <Icon name="plus" />
                                { t("extensions:manage.groups.edit.roles.placeHolders.emptyList.action") }
                            </PrimaryButton>
                        )
                    }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                />
            );
        }
    };

    /**
     * This function filters out the stale application roles.
     * 
     * @param applicationRoles - Application roles.
     * @returns Filtered application roles.
     */
    const filterStaleApplicationRoles = (applicationRoles: ApplicationRoleInterface[]): ApplicationRoleInterface[] => {
        if (!appList || appList?.length === 0) {
            return [];
        }

        const filteredApplicationRoles: ApplicationRoleInterface[] = 
                applicationRoles?.filter(
                    (role: ApplicationRoleInterface) => getApplicationName(role.app));
            
        return filteredApplicationRoles;
    };

    /**
     * Get the assigned application roles of the group.
     */
    const getAssignedApplicationRoles = (): void => {

        setIsAssignedRolesFetchRequestLoading(true);
        getAssignedApplicationRolesList(encodeURIComponent(group?.displayName))
            .then((response: ApplicationRoleInterface[]) => {

                const assignedApplicationRoles: ApplicationRoleInterface[] = filterStaleApplicationRoles(response);

                setSelectedApplicationRoleList(assignedApplicationRoles);
                setSelectedFilteredApplicationRoleList(assignedApplicationRoles);
                addCheckedRoles(assignedApplicationRoles);
                setExpandedAssignedApplications(getDefaultExpandedApps(assignedApplicationRoles));
            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail ?? 
                            t("extensions:manage.groups.edit.roles.notifications.fetchAssignedApplicationRoles." + 
                                "error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message ?? 
                            t("extensions:manage.groups.edit.roles.notifications.fetchAssignedApplicationRoles." + 
                                "error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("extensions:manage.groups.edit.roles.notifications.fetchAssignedApplicationRoles." + 
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:manage.groups.edit.roles.notifications.fetchAssignedApplicationRoles." + 
                        "genericError.message")
                }));

                setSelectedApplicationRoleList([]);
                setSelectedFilteredApplicationRoleList([]);
            })
            .finally(() => {
                setIsAssignedRolesFetchRequestLoading(false);
            });
    };

    /**
     * Get all the application roles in the organization.
     */
    const getAllApplicationRoles = (): void => {

        setIsApplicationRolesFetchRequestLoading(true);
        getAllApplicationRolesList()
            .then((response: ApplicationRoleInterface[]) => {

                const allApplicationRoles: ApplicationRoleInterface[] = filterStaleApplicationRoles(response);

                setAllApplicationRoleList(allApplicationRoles);
                setAllFilteredApplicationRoleList(allApplicationRoles);
            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail ?? 
                            t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." + 
                                "error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message ??
                            t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." +
                                "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." + 
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:manage.groups.edit.roles.notifications.fetchApplicationRoles." + 
                        "genericError.message")
                }));

                setAllApplicationRoleList([]);
                setAllFilteredApplicationRoleList([]);
            })
            .finally(() => {
                setIsApplicationRolesFetchRequestLoading(false);
            });
    };

    /**
     * Get the application name by application ID.
     * 
     * @param app_id - Application ID.
     * 
     * @returns Application name.
     */
    const getApplicationName = (app_id: string): string => {

        const applicationFiltered: ApplicationListItemInterface = appList?.find(
            (item: ApplicationListItemInterface) =>
                item.id === app_id);

        return applicationFiltered?.name;
    };

    /**
     * Get the application name by application ID for the title of the segmented accordion.
     * 
     * @param applicationId - Application ID.
     * 
     * @returns Application segmented accordion title.
     */
    const getApplicationSegmentedAccordionTitle = (applicationId: string): ReactElement =>
        (
            <Header
                image
                as="h6"
                className="header-with-icon"
                data-componentId={ `${ componentId }-item-heading` }
            >
                <AppAvatar
                    image={ (
                        <AnimatedAvatar
                            name={ getApplicationName(applicationId) }
                            size="mini"
                        />
                    ) }
                    size="mini"
                    spaced="right"
                    data-testid={ `${componentId}-item-application-name` }
                />
                <Header.Content className="align-self-center">
                    { getApplicationName(applicationId) }
                    <Header.Subheader>
                        <Label
                            size="mini"
                            className="ml-0"
                        >
                            { 
                                t("extensions:manage.groups.edit.roles.rolesList." + 
                                    "applicationLabel") 
                            }
                        </Label>
                    </Header.Subheader>
                </Header.Content>
            </Header>
        );

    /**
     * Get default expanded application list.
     * 
     * @param app - Application role list item.
     * 
     * @returns Default expanded apps.
     */
    const getDefaultExpandedApps = (appRoleList: ApplicationRoleInterface[]): string[] => {
        const initialExpandedApps: string[] = [];

        appRoleList.map(
            (appRole: ApplicationRoleInterface) => {
                initialExpandedApps.push(appRole.app);
            }
        );

        return initialExpandedApps;
    };

    /**
     * Add the selected application roles of the group to checked roles.
     * 
     * @param list - Assigned application roles list.
     */
    const addCheckedRoles = (list: ApplicationRoleInterface[]): void => {
        const tempList: string[] = [];

        list.map( (appRole: ApplicationRoleInterface) => {
            const app_id: string = appRole.app;

            appRole.roles.map( (role: RoleBasicInterface) => {
                tempList.push(app_id + ":" + role.name);
            });
        });
        setCheckedRoles(tempList);
    };

    /**
     * Handle the search field query change.
     * 
     * @param e - Event.
     * @param query - Search query.
     * @param list - Unfiltered application roles list.
     * @param stateActionList - Set filtered application roles action.
     * @param stateActionExpanded - Set expanded application roles action.
     */
    const handleSearchFieldChange = (
        e: FormEvent<HTMLInputElement>,
        query: string,
        list: ApplicationRoleInterface[],
        stateActionList: Dispatch<SetStateAction<any>>,
        stateActionExpanded: Dispatch<SetStateAction<any>>
    ) => {

        if (query.length > 0) {
            searchFilter(query, list, stateActionList, stateActionExpanded);
        } else {
            stateActionList(list);
            stateActionExpanded(getDefaultExpandedApps(list));
        }
    };

    /**
     * Search operation for application roles.
     * 
     * @param changeValue - Search value.
     * @param list - Unfiltered application roles list.
     * @param stateActionList - Set filtered application roles action.
     * @param stateActionExpanded - Set expanded application roles action.
     */
    const searchFilter = (
        changeValue: string,
        list: ApplicationRoleInterface[],
        stateActionList: Dispatch<SetStateAction<any>>,
        stateActionExpanded: Dispatch<SetStateAction<any>>
    ) => {
        if (changeValue !== ""){
            const applicationsFiltered: ApplicationRoleInterface[] = list
                .filter((item: ApplicationRoleInterface) =>
                    getApplicationName(item.app)?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);

            const unfilteredRoles: ApplicationRoleInterface[] = [ ...list ];
            const tempExpandedApplication: string[] = [];
            const applicationRolesFiltered: ApplicationRoleInterface[] = [];

            unfilteredRoles.forEach((application: ApplicationRoleInterface) => {
                const matchedRoles: RoleBasicInterface[] = application.roles
                    .filter((role: RoleBasicInterface) =>
                        (role.name?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1 ));

                if (matchedRoles !== undefined && matchedRoles.length !== 0) {
                    if (!tempExpandedApplication.includes(application.app)) {
                        tempExpandedApplication.push(application.app);
                    }
                    const updatedApplication: ApplicationRoleInterface = { 
                        app: application.app,
                        roles: matchedRoles
                    };

                    applicationRolesFiltered.push(updatedApplication);
                }
                applicationsFiltered.map((tempApplication: ApplicationRoleInterface) => {
                    if (tempApplication.app === application.app && matchedRoles.length === 0){
                        applicationRolesFiltered.push(application);
                    }
                });
            });
            stateActionList(applicationRolesFiltered);
            stateActionExpanded(tempExpandedApplication);
        }
    };

    /**
     * Handle open assign application roles modal.
     */
    const openAssignApplicationRolesModal = () => {
        setShowAssignApplicationRolesModal(true);
    };

    /**
     * Handle close assign application roles modal.
     */
    const handleCloseAssignApplicationRolesModal = () => {
        setAddedRoles([]);
        setRemovedRoles([]);
        addCheckedRoles(selectedApplicationRoleList);
        setShowAssignApplicationRolesModal(false);
    };

    /**
     * Get the application roles list nested by application.
     * 
     * @param roleNameList - Application qualified role name list.
     * 
     * @returns Application roles list nested by application.
     */
    const getOrderedRoleList = (roleNameList: string[]): ApplicationRoleInterface[] => {
        const applicationRoleList: ApplicationRoleInterface[] = [];

        roleNameList.map((roleName: string) => {
            const appId: string = roleName.split(":")[0];
            const role: string = roleName.split(":")[1];

            if (applicationRoleList.some( (item: ApplicationRoleInterface) => item.app === appId)) {
                const itemIndex: number = applicationRoleList.findIndex( 
                    (item: ApplicationRoleInterface) => item.app === appId);
                const appRoleItem: ApplicationRoleInterface = applicationRoleList[itemIndex];

                appRoleItem.roles.push({ name: role });
                applicationRoleList[itemIndex] = appRoleItem;
            } else {
                applicationRoleList.push({
                    app: appId,
                    roles: [ { name: role } ]
                });
            }
        });

        return applicationRoleList;
    };

    /**
     * Update assigned applications roles.
     */
    const updateGroupRolesList = () => {

        const orderedAddedRoles: ApplicationRoleInterface[] = getOrderedRoleList(addedRoles);
        const orderedRemovedRoles: ApplicationRoleInterface[] = getOrderedRoleList(removedRoles);
        const payload: GroupRoleAssignPayloadInterface = {
            added_roles: orderedAddedRoles,
            removed_roles: orderedRemovedRoles
        };

        setIsSubmitting(true);
        updateGroupRoleMapping(encodeURIComponent(group?.displayName), payload)
            .then(() => {
                dispatch(addAlert({
                    description: t("extensions:manage.groups.edit.roles.notifications.updateApplicationRoles." + 
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:manage.groups.edit.roles.notifications.updateApplicationRoles." + 
                        "success.message")
                }));
                onGroupUpdate(group.id);
            }).catch(() => {
                setAlert({
                    description: t("extensions:manage.groups.edit.roles.notifications.updateApplicationRoles." + 
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:manage.groups.edit.roles.notifications.updateApplicationRoles." + 
                        "genericError.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
                setShowAssignApplicationRolesModal(false);
            });
    };

    /**
     * Handle expand accordion title.
     * 
     * @param appRole - Application role.
     */
    const handleAccordionTitleClick = (
        appRole: ApplicationRoleInterface,
        expandedList: string[],
        stateActionExpanded: Dispatch<SetStateAction<any>>
    ) => {
        let tempExpandedList: string[] = [ ...expandedList ];

        if (!expandedList?.includes(appRole.app)) {
            tempExpandedList.push(appRole.app);
        } else {
            tempExpandedList =  tempExpandedList
                .filter((roleDeselected: string) =>
                    roleDeselected !== appRole.app);
        }
        stateActionExpanded(tempExpandedList);
    };

    /**
     * Handle checkbox change of application roles.
     * 
     * @param appId - Application.
     * @param roleName - Application role name.
     */
    const handleCheckboxChange = (appId: string, roleName: string) => {
        const appQualifiedRoleName: string = appId + ":" + roleName;

        if (checkedRoles.includes(appQualifiedRoleName)) {
            const newCheckedRoles: string[] = checkedRoles.filter( 
                (item: string) => item !== appQualifiedRoleName);

            setCheckedRoles(newCheckedRoles);
            if (addedRoles.includes(appQualifiedRoleName)) {
                const newAddedRoles: string[] = addedRoles.filter(
                    (item: string) => item !== appQualifiedRoleName);

                setAddedRoles(newAddedRoles);
            } else {
                const newRemovedRoles: string[] = [ ...removedRoles ].concat(appQualifiedRoleName);

                setRemovedRoles(newRemovedRoles);
            }
        } else {
            const newCheckedRoles: string[] = [ ...checkedRoles ].concat(appQualifiedRoleName);

            setCheckedRoles(newCheckedRoles);
            if (removedRoles.includes(appQualifiedRoleName)) {
                const newRemovedRoles: string[] = removedRoles.filter(
                    (item: string) => item !== appQualifiedRoleName);

                setRemovedRoles(newRemovedRoles);
            } else {
                const newAddedRoles: string[] = [ ...addedRoles ].concat(appQualifiedRoleName);

                setAddedRoles(newAddedRoles);
            }
        }

    };

    /**
     * Renders the nested role list.
     * 
     * @param roles - Role list.
     * @param appId - Application Id.
     * 
     * @returns Selected role list component.
     */
    const resolveSelectedApplicationRolesList = (roles: RoleBasicInterface[], appId: string): ReactElement => {
        return (
            <>
                <Text size={ 13 } className="mb-1">
                    { t("extensions:manage.groups.edit.roles.rolesList.applicationRolesLabel") }
                </Text>
                <Table
                    singleLine
                    padded
                    data-componentId={ `${ componentId }-list` }
                    fixed
                >
                    <Table.Body>
                        <>
                            {
                                roles.map((role: RoleBasicInterface, index: number) => (
                                    <Table.Row key={ role.name } verticalAlign="middle">
                                        <Table.Cell singleLine width={ 10 }>
                                            <div>
                                                { role.name }
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell  key={ role.name } singleLine width={ 5 } textAlign="right">
                                            <Checkbox 
                                                data-componentid={ `${ componentId }-role-item-${ index }` }
                                                checked={ 
                                                    checkedRoles && 
                                                    checkedRoles.some( 
                                                        (checkedRole: string) => 
                                                            checkedRole === appId + ":" + role.name) 
                                                }
                                                onClick={ () => handleCheckboxChange(appId, role.name) }
                                            />
                                        </Table.Cell>
                                        <Table.Cell singleLine width={ 1 } />
                                    </Table.Row>
                                ))
                            }
                        </>
                    </Table.Body>
                </Table>
            </>
        );
    };

    /**
     * Render the assign application roles modal.
     * 
     * @returns Modal component.
     */
    const assignApplicationRolesModal = () => (
        <Modal
            data-componentid={ `${ componentId }-assign-role-wizard-modal` }
            className="wizard"
            dimmer="blurring"
            open={ showAssignApplicationRolesModal }
            size="small"
        >
            <Modal.Header>
                { t("extensions:manage.groups.edit.roles.addNewModal.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("extensions:manage.groups.edit.roles.addNewModal.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                <Grid className="transfer-list" >
                    <Grid.Row>
                        <Grid.Column>
                            <Input
                                data-componentid={ `${ componentId }-roles-list-search-input` }
                                icon={ <Icon name="search" /> }
                                onChange={ (
                                    e: FormEvent<HTMLInputElement>,
                                    { value }: { value: string; }
                                ) => {
                                    handleSearchFieldChange(
                                        e,
                                        value,
                                        allApplicationRoleList, 
                                        setAllFilteredApplicationRoleList,
                                        setExpandedApplications
                                    );
                                } }
                                placeholder={ t("extensions:manage.groups.edit.roles.searchPlaceholder") }
                                floated="left"
                                size="small"
                                fluid
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <SegmentedAccordion
                                data-componentid={ `${ componentId }-application-roles` }
                                viewType="table-view"
                            >
                                {
                                    allFilteredApplicationRoleList.map(
                                        (application: ApplicationRoleInterface, index: number) => (
                                            <Fragment key={ application.app }>
                                                <SegmentedAccordion.Title
                                                    id={ application.app }
                                                    data-componentid={ `${componentId}-edit-app-title-${index}` }
                                                    attached={ true }
                                                    active={ expandedApplications?.includes(application.app) }
                                                    accordionIndex={ application.app }
                                                    className="nested-list-accordion-title"
                                                    onClick={ 
                                                        () => 
                                                            handleAccordionTitleClick(
                                                                application,
                                                                expandedApplications,
                                                                setExpandedApplications
                                                            )
                                                    }
                                                    hideChevron={ false }
                                                    content={ 
                                                        getApplicationSegmentedAccordionTitle(application.app)
                                                    }
                                                />

                                                <SegmentedAccordion.Content
                                                    active={ expandedApplications?.includes(application.app) }
                                                    className="nested-list-accordion-content-checkbox"
                                                    data-componentid={ `${componentId}-${application.app}-content` }
                                                    children={
                                                        resolveSelectedApplicationRolesList(
                                                            application.roles,
                                                            application.app
                                                        )
                                                    }
                                                />
                                            </Fragment>
                                        ))
                                }
                            </SegmentedAccordion>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-componentid={ `${ componentId }-assign-role-wizard-modal-cancel-button` }
                                onClick={ handleCloseAssignApplicationRolesModal }
                                floated="left"
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-componentid={ `${ componentId }-assign-role-wizard-modal-save-button` }
                                onClick={ updateGroupRolesList }
                                floated="right"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

    /**
     * Renders the nested role list.
     * 
     * @param roles - Role list.
     * @returns Role list component.
     */
    const resolveApplicationRolesListItem = (roles: RoleBasicInterface[]): ReactElement => {
        return (
            <>
                <Text size={ 13 } className="mb-1">
                    { t("extensions:manage.groups.edit.roles.rolesList.applicationRolesLabel") }
                </Text>
                <Table
                    singleLine
                    padded
                    data-componentId={ `${ componentId }-list` }
                    fixed
                >
                    <Table.Body>
                        <>
                            {
                                roles.map((role: RoleBasicInterface) => (
                                    <Table.Row key={ role.name } verticalAlign="middle">
                                        <Table.Cell key={ role.name } singleLine width={ 15 }>
                                            <div>{ role.name }</div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </>
                    </Table.Body>
                </Table>
            </>
        );
    };

    /**
     * Renders the application roles list.
     * 
     * @param roles - Role list.
     * 
     * @returns Role list component.
     */
    const resolveApplicationRolesList = (filteredApplicationRoles: ApplicationRoleInterface[]): ReactElement => (
        <>
            {
                filteredApplicationRoles?.map(
                    (application: ApplicationRoleInterface, index: number) => (
                        <Fragment key={ application.app }>
                            <SegmentedAccordion.Title
                                id={ application.app }
                                data-componentid={ `${componentId}-list-app-title-${index}` }
                                active={ expandedAssignedApplications?.includes(application.app) }
                                accordionIndex={ application.app }
                                className="nested-list-accordion-title"
                                onClick={ 
                                    () => 
                                        handleAccordionTitleClick(
                                            application,
                                            expandedAssignedApplications,
                                            setExpandedAssignedApplications
                                        )
                                }
                                hideChevron={ false }
                                content={ getApplicationSegmentedAccordionTitle(application.app) }
                            />
                            <SegmentedAccordion.Content
                                active={ expandedAssignedApplications?.includes(application.app) }
                                className="nested-list-accordion-content-text"
                                data-componentid={ `${componentId}-${application.app}-content` }
                                children={ resolveApplicationRolesListItem(application.roles) }
                            />
                        </Fragment>
                    )
                )
            }
        </>
    );

    return (
        <EmphasizedSegment padded="very">
            <Heading as="h4">{ t("extensions:manage.groups.edit.roles.heading") }</Heading>
            <Heading subHeading ellipsis as="h6">
                { t("extensions:manage.groups.edit.roles.description") }
                <DocumentationLink
                    link={ getLink("manage.groups.roles.learnMore") }
                >
                    { t("extensions:common.learnMore") }
                </DocumentationLink>
            </Heading>
            <Divider hidden />
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 16 }>
                        { (
                            !isGroupDetailsRequestLoading && 
                            !isAssignedRolesFetchRequestLoading &&
                            !isApplicationsFetchRequestLoading &&
                            !isApplicationRolesFetchRequestLoading
                        ) 
                            ? (
                                ( 
                                    allApplicationRoleList?.length > 0 &&
                                    selectedApplicationRoleList?.length > 0 
                                )
                                    ? (
                                        <EmphasizedSegment
                                            data-componentid="group-mgt-application-roles-list"
                                            className="user-group-role-header-segment"
                                        >
                                            <Grid.Row>
                                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                                    <Input
                                                        data-componentid={ `${ componentId }-roles-list-search-input` }
                                                        icon={ <Icon name="search" /> }
                                                        onChange={ (
                                                            e: FormEvent<HTMLInputElement>,
                                                            { value }: { value: string; }
                                                        ) => {
                                                            handleSearchFieldChange(
                                                                e,
                                                                value,
                                                                selectedApplicationRoleList, 
                                                                setSelectedFilteredApplicationRoleList,
                                                                setExpandedAssignedApplications
                                                            );
                                                        } }
                                                        placeholder={
                                                            t("extensions:manage.groups.edit.roles.searchPlaceholder")
                                                        }
                                                        floated="left"
                                                        size="small"
                                                    />
                                                    { !isReadOnly && (
                                                        <Popup
                                                            content= { 
                                                                t("extensions:manage.groups.edit.roles.editHoverText") 
                                                            }
                                                            inverted
                                                            trigger={
                                                                (
                                                                    <Button
                                                                        data-componentid={ 
                                                                            `${ componentId }-roles-list-edit-button`
                                                                        }
                                                                        size="medium"
                                                                        icon="pencil"
                                                                        floated="right"
                                                                        onClick={ openAssignApplicationRolesModal }
                                                                    />
                                                                )
                                                            }
                                                        />
                                                    ) }
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                                    <SegmentedAccordion
                                                        fluid
                                                        data-componentid={ `${ componentId }-application-roles` }
                                                        viewType="table-view"
                                                    >
                                                        { 
                                                            resolveApplicationRolesList(
                                                                selectedFilteredApplicationRoleList
                                                            )
                                                        }
                                                    </SegmentedAccordion>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </EmphasizedSegment>
                                    ) 
                                    : (
                                        <Grid.Row>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                                <EmphasizedSegment>
                                                    { getPlaceholders() }
                                                </EmphasizedSegment>
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                            ) 
                            : (
                                <ContentLoader />
                            ) }
                        { 
                            !isApplicationsFetchRequestLoading && 
                            !isApplicationRolesFetchRequestLoading && 
                            assignApplicationRolesModal()
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EmphasizedSegment>
    );
};
