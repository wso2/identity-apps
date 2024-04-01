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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { resolveUserstore } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    ContentLoader,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    Popup,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ChangeEvent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Header, Icon, Input, SemanticICONS } from "semantic-ui-react";
import AssignGroupWizard from "./assign-group-wizard";
import {
    updateApplicationRoleMappedGroups,
    useApplicationRoleMappedGroups
} from "../../admin-extensions-v1/components/application/api";
import {
    ApplicationRoleGroupInterface,
    ApplicationRoleGroupsUpdatePayloadInterface
} from "../../admin-extensions-v1/components/application/models";
import { UIConstants } from "../../admin.core.v1";
import { CONSUMER_USERSTORE } from "../../admin-userstores-v1/constants";

interface ApplicationRoleGroupsProps extends IdentifiableComponentInterface {
    appId: string;
    roleId: string;
}

/**
 * Application role groups component.
 */
const ApplicationRoleGroups = (props: ApplicationRoleGroupsProps): ReactElement => {
    const {
        appId,
        roleId,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ processedGroupsList, setProcessedGroupsList ] = useState<ApplicationRoleGroupInterface[]>([]);
    const [ showGroupDeleteConfirmation, setShowGroupDeleteConfirmation ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ currentDeletedGroup, setCurrentDeletedGroup ] = useState<ApplicationRoleGroupInterface>(undefined);
    const [ isSubmitting, setSubmitting ] = useState<boolean>(false);

    const {
        data: originalApplicationRoleGroupData,
        mutate: mutateApplicationRoleGroupData,
        isLoading: isApplicationRoleGroupDataFetchRequestLoading,
        error: applicationRoleGroupDataFetchRequestError
    } = useApplicationRoleMappedGroups(appId, roleId);

    useEffect(() => {                        
        if (originalApplicationRoleGroupData instanceof IdentityAppsApiException 
                || applicationRoleGroupDataFetchRequestError) {
            handleAlerts({
                description: t(
                    "extensions:console.applicationRoles.roleGroups.fetchGroups.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "extensions:console.applicationRoles.roleGroups.fetchGroups.error.message"
                )
            });

            return;
        }

        if (!originalApplicationRoleGroupData) {
            return;
        }

        if (originalApplicationRoleGroupData.groups) {
            setProcessedGroupsList(originalApplicationRoleGroupData.groups);
        }
    }, [ originalApplicationRoleGroupData ]);

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Handles the change event of the search query input.
     * Return results that matches the search query.
     */
    const searchGroups = (query: string) => {
        setSearchQuery(query);

        if (query === "") {
            setProcessedGroupsList(originalApplicationRoleGroupData.groups);
            
            return;
        }

        const filteredGroupsList: ApplicationRoleGroupInterface[] = 
        originalApplicationRoleGroupData.groups.filter((group: ApplicationRoleGroupInterface) => {
            return group.name.toLowerCase().includes(query.toLowerCase());
        });

        setProcessedGroupsList(filteredGroupsList);
    };

    /**
     * Handles the application role group delete action.
     */
    const handleGroupDelete = (group: ApplicationRoleGroupInterface): void => {
        const groupData: ApplicationRoleGroupsUpdatePayloadInterface = {
            added_groups: [],
            removed_groups: [ {
                name: group.name
            } ]
        };

        setSubmitting(true);
        
        updateApplicationRoleMappedGroups(appId, roleId, groupData)
            .then(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.groups.notifications.deleteGroup.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.groups.notifications.deleteGroup.success.message"
                    )
                });
                mutateApplicationRoleGroupData();
            })
            .catch(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.groups.notifications.deleteGroup.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.groups.notifications.deleteGroup.error.message"
                    )
                });
            }).finally(() => {
                setSubmitting(false);
                setShowGroupDeleteConfirmation(false);
            });
    };

    /**
     * Handles the application role group add action.
     */
    const handleGroupAdd = (groups: ApplicationRoleGroupInterface[]): void => {
        const groupData: ApplicationRoleGroupsUpdatePayloadInterface = {
            added_groups: groups,
            removed_groups: []
        };

        setSubmitting(true);

        updateApplicationRoleMappedGroups(appId, roleId, groupData)
            .then(() => {
                handleAlerts({
                    description: t(
                        "extensions:console.applicationRoles.roleGroups.notifications.addGroups.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "extensions:console.applicationRoles.roleGroups.notifications.addGroups.success.message"
                    )
                });
                mutateApplicationRoleGroupData();
            })
            .catch(() => {
                handleAlerts({
                    description: t(
                        "extensions:console.applicationRoles.roleGroups.notifications.addGroups.error.message"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "extensions:console.applicationRoles.roleGroups.notifications.addGroups.error.message"
                    )
                });
            }).finally(() => {
                setSubmitting(false);
                setShowWizard(false);
            });
    };

    const onSearchQueryClear = (): void => {
        setSearchQuery("");
        setProcessedGroupsList(originalApplicationRoleGroupData?.groups);
    };

    /**
     * Shows list placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && processedGroupsList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ componentId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-testid={ `${ componentId }-search-empty-placeholder-clear-button` }
                            onClick={ onSearchQueryClear }
                        >
                            { t("roles:list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    title={ t("roles:list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("roles:list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (processedGroupsList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ componentId }-search-empty-placeholder` }
                    action={ (
                        <PrimaryButton
                            data-testid={ `${ componentId }-groups-list-assign-button` }
                            onClick={ () => setShowWizard(true) }
                        >
                            <Icon name="add"/>
                            { t("extensions:console.applicationRoles.roleGroups.assignGroup") }
                        </PrimaryButton>
                    ) }
                    title={ t("extensions:console.applicationRoles.roleGroups.placeholder.title") }
                    subtitle={ [
                        t("extensions:console.applicationRoles.roleGroups.placeholder.subTitle.0"),
                        t("extensions:console.applicationRoles.roleGroups.placeholder.subTitle.1")
                    ] }
                />
            );
        }

        return null;
    };
        
    /**
     * Resolves data table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (group: ApplicationRoleGroupInterface): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ componentId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ group?.name?.split("/")[1] }
                                    size="mini"
                                    data-testid={ `${ componentId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-testid={ `${ componentId }-item-image` }
                        />
                        <Header.Content>
                            <div className="mt-1">{ group?.name?.split("/")[1] } </div>
                        </Header.Content>
                    </Header>
                ),
                title: t("console:manage.features.groups.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "type",
                id: "type",
                key: "type",
                render: (group: ApplicationRoleGroupInterface): ReactNode => {
                    const grpName: string = resolveUserstore(group.name);

                    if (grpName === CONSUMER_USERSTORE) {
                        return CONSUMER_USERSTORE;
                    }

                    return grpName.toUpperCase();
                },
                title: (
                    <>
                        { t("console:manage.features.groups.list.columns.source") }
                        <Popup
                            trigger={ (
                                <div className="inline" >
                                    <Icon disabled name="info circle" className="link pointing pl-1" />
                                </div>
                            ) }
                            content="Where group is managed."
                            position="top center"
                            size="mini"
                            hideOnScroll
                            inverted
                        />
                    </>
                )
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: null
            }
        ];
    };

    /**
     * Resolves data table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        const actions: TableActionsInterface[] = [
            {
                icon: (): SemanticICONS =>  "trash alternate",
                onClick: (e: SyntheticEvent, group: ApplicationRoleGroupInterface): void => {
                    setCurrentDeletedGroup(group);
                    setShowGroupDeleteConfirmation(!showGroupDeleteConfirmation);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];

        return actions;
    };

    return (
        !isApplicationRoleGroupDataFetchRequestLoading 
            ? (
                <>
                    <Grid>
                        {
                            (searchQuery || processedGroupsList?.length !== 0) && (
                                <Grid.Row columns={ 1 } className="pb-0">
                                    <Grid.Column width={ 6 }>
                                        <Input
                                            data-componentid={ `${ componentId }-groups-list-search-input` }
                                            icon={ <Icon name="search" /> }
                                            iconPosition="left"
                                            onChange={ (e: ChangeEvent<HTMLInputElement>) => 
                                                searchGroups(e.target.value) }
                                            value={ searchQuery }
                                            placeholder={ t("extensions:console.applicationRoles.roleGroups." +
                                                "searchGroup") }
                                            floated="left"
                                            fluid
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={ 10 }>
                                        <PrimaryButton
                                            data-testid={ `${ componentId }-groups-list-assign-button` }
                                            onClick={ () => setShowWizard(true) }
                                            floated="right"
                                        >
                                            <Icon name="add"/>
                                            { t("extensions:console.applicationRoles.roleGroups.assignGroup") }
                                        </PrimaryButton>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <DataTable<ApplicationRoleGroupInterface[]>
                                    loadingStateOptions={ {
                                        count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                                        imageType: "square"
                                    } }
                                    actions={ resolveTableActions() }
                                    columns={ resolveTableColumns() }
                                    data={ processedGroupsList }
                                    onRowClick={ () => null }
                                    data-testid={ componentId }
                                    placeholders={ showPlaceholders() }
                                    isLoading={ isApplicationRoleGroupDataFetchRequestLoading }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    {
                        showGroupDeleteConfirmation &&
                            (
                                <ConfirmationModal
                                    data-testid={ `${ componentId }-delete-item-confirmation-modal` }
                                    onClose={ (): void => setShowGroupDeleteConfirmation(false) }
                                    type="negative"
                                    open={ showGroupDeleteConfirmation }
                                    assertionHint={ t("roles:list.confirmations" +
                                        ".deleteItem.assertionHint") }
                                    assertionType="checkbox"
                                    primaryAction="Confirm"
                                    secondaryAction="Cancel"
                                    onSecondaryActionClick={ (): void => setShowGroupDeleteConfirmation(false) }
                                    onPrimaryActionClick={ (): void => {
                                        handleGroupDelete(currentDeletedGroup);
                                    } }
                                    closeOnDimmerClick={ false }
                                    primaryActionLoading={ isSubmitting }
                                >
                                    <ConfirmationModal.Header>
                                        { t("roles:list.confirmations.deleteItem.header") }
                                    </ConfirmationModal.Header>
                                    <ConfirmationModal.Message attached negative>
                                        { t("extensions:console.applicationRoles.roleGroups.confirmation." +
                                        "deleteRole.message") }
                                    </ConfirmationModal.Message>
                                    <ConfirmationModal.Content>
                                        { t("extensions:console.applicationRoles.roleGroups.confirmation." +
                                        "deleteRole.content") }
                                    </ConfirmationModal.Content>
                                </ConfirmationModal>
                            )
                    }
                    {
                        showWizard && (
                            <AssignGroupWizard
                                data-testid={ `${ componentId }-assign-group-wizard` }
                                closeWizard={ () => setShowWizard(false) }
                                existingGroupsList={ originalApplicationRoleGroupData }
                                handleGroupAdd={ handleGroupAdd }
                                isSubmitting={ isSubmitting }
                            />
                        )
                    }
                </>
            )
            : <ContentLoader />
    );
};

export default ApplicationRoleGroups;
