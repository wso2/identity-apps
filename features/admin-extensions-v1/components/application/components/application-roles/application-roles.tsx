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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    DocumentationLink,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    ListLayout,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    useConfirmationModalAlert,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, DropdownProps, Grid, Header, Icon, PaginationProps, SemanticICONS } from "semantic-ui-react";
import { CreateApplicationRoleWizard } from "./create-app-role-wizard";
import { EditApplicationRole } from "./edit-app-role";
import { ApplicationInterface } from "../../../../../admin-applications-v1/models";
import {
    AppState,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "../../../../../features/core";
import { OrganizationResponseInterface } from "../../../../../features/organizations/models";
import { deleteRole, getApplicationRolesList, useSharedApplicationData } from "../../api/application-roles";
import {
    ApplicationRolesResponseInterface,
    LinkInterface,
    RoleListItemInterface,
    SharedApplicationDataInterface
} from "../../models/application-roles";

interface ApplicationRolesSettingsInterface extends IdentifiableComponentInterface {
    /**
     * Application.
     */
    application?: ApplicationInterface
    /**
     * on application update callback
     */
    onUpdate: () => void;
}

/**
 * Application roles component.
 *
 * @param props - Props related to application roles component.
 */
export const ApplicationRoles: FunctionComponent<ApplicationRolesSettingsInterface> = (
    props: ApplicationRolesSettingsInterface
): ReactElement => {

    const {
        application,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const { getLink } = useDocumentation();
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showEditModal, setShowEditModal ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isDeleteSubmitting, setIsDeleteSubmitting ] =  useState<boolean>(false);

    const [ roleList, setRoleList ] = useState<RoleListItemInterface[]>([]);
    const [ roleListItem, setRoleListItem ] = useState<RoleListItemInterface>();
    const [ applicationRoleResponse, setApplicationRoleResponse ] = useState<ApplicationRolesResponseInterface>(null);
    const [ deletingRole, setDeletingRole ] = useState<RoleListItemInterface>(undefined);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ after, setAfter ] = useState<string>("");
    const [ before, setBefore ] = useState<string>("");
    const [ isApplicationRoleNextPageAvailable, setIsApplicationRoleNextPageAvailable ] = useState<boolean>(undefined);
    const [ isApplicationRoleNextPrevAvailable, setIsApplicationRolePrevPageAvailable ] = useState<boolean>(undefined);
    const [ activePage, setActivePage ] = useState<number>(1);
    const [ sharedApplications, setSharedApplications ] = useState<SharedApplicationDataInterface[]>([]);
    const [ paginationReset, triggerResetPagination ] = useTrigger();

    const path: string[] = history.location.pathname.split("/");
    const appId: string = path[path.length - 1].split("#")[0];
    const isSharedApplication: boolean = application?.advancedConfigurations?.fragment;

    const {
        data: originalSharedApplicationData,
        isLoading: isSharedApplicationDataFetchRequestLoading,
        error: sharedApplicationDataFetchRequestError
    } = useSharedApplicationData(appId, currentOrganization?.id);

    useEffect(() => {                
        if (originalSharedApplicationData instanceof IdentityAppsApiException 
                || sharedApplicationDataFetchRequestError) {
            handleRetrieveError();

            return;
        }

        if (!originalSharedApplicationData) {
            return;
        }

        if (originalSharedApplicationData?.sharedApplications) {
            setSharedApplications(originalSharedApplicationData?.sharedApplications);
        }
    }, [ originalSharedApplicationData ]);

    useEffect(() => {
        let nextFound: boolean = false;
        let prevFound: boolean = false;

        applicationRoleResponse?.links?.forEach((link: LinkInterface) => {
            if (link.rel === "after") {
                const afterID: string = link.href.split("after=")[ 1 ];

                setAfter(afterID);
                setIsApplicationRoleNextPageAvailable(true);
                nextFound = true;
            }
            if (link.rel === "before") {
                const beforeID: string = link.href.split("before=")[ 1 ];

                setBefore(beforeID);
                setIsApplicationRolePrevPageAvailable(true);
                prevFound = true;
            }
        });

        if (!nextFound) {
            setAfter("");
            setIsApplicationRoleNextPageAvailable(false);
        }
        if (!prevFound) {
            setBefore("");
            setIsApplicationRolePrevPageAvailable(false);
        }
    }, [ applicationRoleResponse ]);

    useEffect(() => {
        getApplicationRoles(appId, null, null, searchQuery? searchQuery: null , listItemLimit);
    }, [ listItemLimit, searchQuery ]);

    /**
     * Get application roles of the application.
     *
     * @param appId - Application ID.
     * @param before - Before cursor link.
     * @param after - After cursor link.
     * @param filter - Filter query.
     * @param limit - Limit.
     */
    const getApplicationRoles: (
        appId: string,
        before?: string,
        after?: string,
        filter?: string,
        limit?: number
    ) => void = useCallback(
        (appId: string, before?: string, after?: string, filter?: string, limit?: number): void => {
            getApplicationRolesList(appId, before, after, filter, limit)
                .then((response: ApplicationRolesResponseInterface) => {
                    setApplicationRoleResponse(response);
                    setRoleList(response.roles);
                }).catch((error: AxiosError) => {
                    if (error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error?.response?.data?.description ??
                                error?.response?.data?.detail ??
                                t("extensions:develop.applications.edit.sections.roles.notifications." +
                                    "fetchApplicationRoles.error.description"),
                            level: AlertLevels.ERROR,
                            message: error?.response?.data?.message ??
                                t("extensions:develop.applications.edit.sections.roles.notifications." +
                                    "fetchApplicationRoles.error.message")
                        }));

                        return;
                    }
                    dispatch(addAlert({
                        description: t("extensions:develop.applications.edit.sections.roles.notifications." +
                            "fetchApplicationRoles.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.applications.edit.sections.roles.notifications." +
                            "fetchApplicationRoles.genericError.message")
                    }));

                    setApplicationRoleResponse({
                        links: [],
                        roles: []
                    });
                    setRoleList([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, [ getApplicationRolesList, setIsLoading ] );

    /**
     * Delete the selected application roles.
     */
    const deleteApplicationRole = (): void => {
        setIsDeleteSubmitting(true);
        deleteRole(appId, deletingRole.name)
            .then(() => {
                dispatch(addAlert({
                    description: t("extensions:develop.applications.edit.sections.roles.notifications." +
                        "deleteApplicationRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.applications.edit.sections.roles.notifications." +
                        "deleteApplicationRole.success.message")
                }));
                onRoleUpdate();
            }).catch(() => {
                setAlert({
                    description: t("extensions:develop.applications.edit.sections.roles.notifications." +
                        "deleteApplicationRole.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.roles.notifications." +
                        "deleteApplicationRole.genericError.message")
                });
            }).finally(() => {
                setIsDeleteSubmitting(false);
                setShowDeleteConfirmationModal(false);
            });
    };

    /**
     * Reset pagination to initial state.
     */
    const resetPagination: () => void = useCallback((): void => {
        setActivePage(1);
        triggerResetPagination();
    }, [ setActivePage, triggerResetPagination ]);

    /**
     * Handles the search query clear action.
     */
    const handleSearchQueryClear: () => void = useCallback((): void => {
        setSearchQuery("");
        resetPagination();
    }, [ setSearchQuery, resetPagination ]);

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange: (
        event: MouseEvent<HTMLAnchorElement>,
        data: PaginationProps
    ) => void = useCallback((event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        const newPage: number = parseInt(data?.activePage as string);

        if (newPage > activePage) {
            getApplicationRoles(appId, null, after, searchQuery, listItemLimit);
        } else if (newPage < activePage) {
            getApplicationRoles(appId, before, null, searchQuery, listItemLimit);
        }
        setActivePage(newPage);
    }, [ activePage, searchQuery, listItemLimit, after, before ]);

    /**
     * Handles items per page change.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange: (
        event: MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ) => void = useCallback((event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
        resetPagination();
    }, [ setListItemLimit, resetPagination ]);

    /**
     * Handle the edit role action.
     *
     * @param role - Selected role.
     */
    const handleRoleEdit = (role: RoleListItemInterface) => {
        setRoleListItem(role);
        setShowEditModal(true);
    };

    /**
     * Handle the delete role action.
     *
     * @param role - Selected role.
     */
    const handleRoleDelete = (role: RoleListItemInterface) => {
        setDeletingRole(role);
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Triggers on role update.
     */
    const onRoleUpdate = (): void => {
        getApplicationRoles(appId, null, null, null, null);
    };

    /**
     * Displays the error banner when unable to fetch shared applications.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("extensions:console.applicationRoles.roleMapping.notifications.sharedApplication."+
                    "error.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:console.applicationRoles.roleMapping.notifications.sharedApplication."+
                "error.message")
            })
        );
    };

    /**
     * Resolves data table actions.
     *
     * @returns TableActionsInterface[]
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-componentid": `${ componentId }-item-edit-button`,
                hidden: (): boolean => isSharedApplication,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, role: RoleListItemInterface): void => handleRoleEdit(role),
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ componentId }-item-delete-button`,
                hidden: (): boolean => isSharedApplication,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, role: RoleListItemInterface): void => handleRoleDelete(role),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ componentId }-item-view-button`,
                hidden: (): boolean => !isSharedApplication,
                icon: (): SemanticICONS => "eye",
                onClick: (e: SyntheticEvent, role: RoleListItemInterface): void => handleRoleEdit(role),
                popupText: (): string => t("common:view"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolves data table columns.
     *
     * @returns TableColumnInterface[]
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (app: RoleListItemInterface): ReactNode => {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ app.name }
                                        size="mini"
                                        data-componentid={ `${ componentId }-item-image-inner` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-componentid={ `${ componentId }-item-image` }
                            />
                            <Header.Content>
                                { app.name }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("extensions:develop.applications.edit.sections.roles.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("extensions:develop.applications.edit.sections.roles.list.columns.actions")
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React element.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && roleList.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ () => setSearchQuery("") }>
                            { t("extensions:develop.applications.edit.sections.roles.placeHolders." +
                                "emptySearchResults.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("extensions:develop.applications.edit.sections.roles.placeHolders." +
                        "emptySearchResults.title") }
                    subtitle={ [
                        t("extensions:develop.applications.edit.sections.roles.placeHolders." +
                            "emptySearchResults.subtitles.0", { query: searchQuery })
                    ] }
                    data-componentid={ `${ componentId }-empty-search-placeholder-icon` }
                />
            );
        }

        if (roleList.length === 0) {
            return (
                <EmptyPlaceholder
                    className={ "list-placeholder" }
                    action={ !isSharedApplication &&
                        (<Show when={ AccessControlConstants.APPLICATION_WRITE }>
                            <PrimaryButton
                                onClick={ () => { setShowWizard(true); } }>
                                <Icon name="add" />
                                { t("extensions:develop.applications.edit.sections.roles.placeHolders." +
                                    "emptyList.action") }
                            </PrimaryButton>
                        </Show>)
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("extensions:develop.applications.edit.sections.roles.placeHolders." +
                        "emptyList.title") }
                    subtitle={ [
                        t("extensions:develop.applications.edit.sections.roles.placeHolders." +
                            "emptyList.subtitles.0")
                    ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <EmphasizedSegment
            loading={ isLoading || isSharedApplicationDataFetchRequestLoading }
            padded="very"
            data-componentid={ componentId }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column className="heading-wrapper" computer={ 10 }>
                        <Heading as="h4">
                            { t("extensions:develop.applications.edit.sections.roles.heading") }
                        </Heading>
                        <Heading subHeading ellipsis as="h6">
                            {
                                isSharedApplication 
                                    ? t("extensions:develop.applications.edit.sections.roles.subHeadingAlt")
                                    : t("extensions:develop.applications.edit.sections.roles.subHeading")
                            }
                            <DocumentationLink
                                link={ getLink("develop.applications.roles.learnMore") }
                            >
                                { t("extensions:common.learnMore") }
                            </DocumentationLink>
                        </Heading>
                    </Grid.Column>
                    <Grid.Column className="action-wrapper" computer={ 6 }>
                        <div className="floated right action">
                            {
                                (roleList.length > 0) && !isSharedApplication && (
                                    <PrimaryButton
                                        data-componentid={ `${ componentId }-add-new-role-button` }
                                        onClick={ () => setShowWizard(true) }
                                    >
                                        <Icon name="add" />
                                        { t("extensions:develop.applications.edit.sections.roles.buttons.newRole") }
                                    </PrimaryButton>
                                )
                            }
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider hidden />
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <ListLayout
                            currentListSize={ roleList.length }
                            listItemLimit={ listItemLimit }
                            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                            onPageChange={ handlePaginationChange }
                            showPagination={ true }
                            showTopActionPanel={ false }
                            showPaginationPageLimit={ false }
                            totalPages={ 10 }
                            totalListSize={ roleList.length }
                            paginationOptions={ {
                                disableNextButton: !isApplicationRoleNextPageAvailable,
                                disablePreviousButton: !isApplicationRoleNextPrevAvailable
                            } }
                            resetPagination={ paginationReset }
                            activePage={ activePage }
                            data-componentid={ `${ componentId }-list-layout` }
                        >
                            <DataTable<RoleListItemInterface>
                                className="application-roles-table"
                                isLoading={ false }
                                onSearchQueryClear={ handleSearchQueryClear }
                                actions={ resolveTableActions() }
                                columns={ resolveTableColumns() }
                                data={ roleList }
                                onRowClick={ (e: SyntheticEvent, role: RoleListItemInterface): void =>
                                    handleRoleEdit(role) }
                                placeholders={ showPlaceholders() }
                                showHeader={ false }
                                transparent={ !isLoading && (showPlaceholders() !== null) }
                                data-componentid={ `${ componentId }-data-table` }
                            />
                        </ListLayout>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider hidden/>
            {
                showWizard && (
                    <CreateApplicationRoleWizard
                        data-componentid="create-app-role-wizard"
                        onRoleUpdate={ onRoleUpdate }
                        closeWizard={ () => setShowWizard(false) }
                        appId={ appId }
                        sharedApplications={ sharedApplications }
                    />
                )
            }
            <EditApplicationRole
                data-componentid="edit-app-role-wizard"
                onShowEditRoleModal={ setShowEditModal }
                onRoleUpdate={ onRoleUpdate }
                selectedRole={ roleListItem }
                appId={ appId }
                showEditRoleModal={ showEditModal }
                isReadOnly={ isSharedApplication }
            />
            {
                deletingRole && (
                    <ConfirmationModal
                        primaryActionLoading={ isDeleteSubmitting }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("extensions:develop.applications.edit.sections.roles." +
                                    "deleteRole.confirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => {
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => deleteApplicationRole() }
                        data-componentid={ `${ componentId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${ componentId }-delete-confirmation-modal-header` }
                        >
                            { t("extensions:develop.applications.edit.sections.roles." +
                                        "deleteRole.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${ componentId }-delete-confirmation-modal-message` }
                        >
                            { t("extensions:develop.applications.edit.sections.roles." +
                                        "deleteRole.confirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${ componentId }-delete-confirmation-modal-content` }
                        >
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { t("extensions:develop.applications.edit.sections.roles." +
                                        "deleteRole.confirmationModal.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </EmphasizedSegment>
    );
};

/**
 * Default props for application roles tab component.
 */
ApplicationRoles.defaultProps = {
    "data-componentid": "application-roles-tab"
};
