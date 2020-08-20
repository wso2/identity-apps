/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { LoadableComponentInterface, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceList,
    ResourceListActionInterface,
    ResourceListItem,
    UserAvatar
} from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Icon, List, ListItemProps, SemanticWIDTHS } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    EmptyPlaceholderIllustrations,
    FeatureConfigInterface,
    UIConstants,
    history
} from "../../core";
import { UserManagementConstants } from "../constants";
import { UserBasicInterface, UserListInterface } from "../models";

/**
 * Prop types for the liked accounts component.
 */
interface UsersListProps extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {
    /**
     * Width of the action panel column.
     */
    actionsColumnWidth?: SemanticWIDTHS;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * User delete callback.
     *
     * @param {string} userId - ID of the deleting user.
     */
    handleUserDelete?: (userId: string) => void;
    /**
     * Callback to be fired when the empty list placeholder action is clicked.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * Meta column list for the user list.
     */
    userMetaListContent?: Map<string, string>;
    /**
     * Users list.
     */
    usersList: UserListInterface;
    /**
     * Width of the description area.
     */
    descriptionColumnWidth?: SemanticWIDTHS;
    /**
     * Width of the meta info area.
     */
    metaColumnWidth?: SemanticWIDTHS;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
}

/**
 * Users info page.
 *
 * @return {ReactElement}
 */
export const UsersList: React.FunctionComponent<UsersListProps> = (props: UsersListProps): ReactElement => {
    const {
        actionsColumnWidth,
        descriptionColumnWidth,
        defaultListItemLimit,
        handleUserDelete,
        isLoading,
        readOnlyUserStores,
        featureConfig,
        onEmptyListPlaceholderActionClick,
        onListItemClick,
        onSearchQueryClear,
        metaColumnWidth,
        searchQuery,
        selection,
        showListItemActions,
        showMetaContent,
        userMetaListContent,
        usersList,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const handleUserEdit = (userId: string) => {
        history.push(AppConstants.PATHS.get("USER_EDIT").replace(":id", userId));
    };

    const deleteUser = (id: string): void => {
        handleUserDelete(id);
        setDeletingUser(undefined);
        setShowDeleteConfirmationModal(false);
    };

    /**
     * The following function generate the meta list items by mapping the
     * meta content columns selected by the user to the user details.
     *
     * @param user - UserBasicInterface
     */
    const generateMetaContent = (user: UserBasicInterface) => {
        const attributes = [];
        let attribute = "";

        for (const [key, value] of userMetaListContent.entries()) {
            if (key !== "name" && key !== "emails" && key !== "profileUrl" && value !== "") {
                if (key !== "" && (key === "meta.lastModified")) {
                    if(user.meta) {
                        const metaAttribute = key.split(".");
                        attribute = user.meta[metaAttribute[1]];
                        attribute && (attributes.push(CommonUtils.humanizeDateDifference(attribute)));
                    }
                } else {
                    attribute = user[key];
                    attributes.push(attribute);
                }
            }
        }

        let metaColumnWidth: SemanticWIDTHS = 1;

        return attributes.map((metaAttribute, index) => {
            if (metaAttribute?.toString().length <= 20) {
                metaColumnWidth = 2;
            }
            if (metaAttribute?.toString().length > 20) {
                metaColumnWidth = 4;
            }
            if (metaAttribute?.toString().length >= 30 && metaAttribute?.toString().length <= 40) {
                metaColumnWidth = 6;
            }
            return (
                <Grid.Column width={ metaColumnWidth } key={ index }>
                    <List.Content>
                        <List.Description className="list-item-meta">
                            { metaAttribute }
                        </List.Description>
                    </List.Content>
                </Grid.Column>
            );
        });
    };

    const listContent = (user: UserBasicInterface) => {
        if (userMetaListContent) {
            return (
                <Grid>
                    { generateMetaContent(user)}
                </Grid>
            );
        } else {
            return (
                <Grid>
                    <Grid.Column width={ 6 }>
                        <List.Content>
                            <List.Description className="list-item-meta">
                                { CommonUtils.humanizeDateDifference(user.meta.lastModified) }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                </Grid>
            );
        }
    };

    /**
     * Resolves list item actions based on user store mutability and app configs.
     *
     * @param user - User details.
     *
     * @return {ResourceListActionInterface[]} Resolved list actions.
     */
    const resolveListItemActions = (user): ResourceListActionInterface[] => {
        if (!showListItemActions) {
            return;
        }

        const userStore = user?.userName?.split("/").length > 1 ? user?.userName?.split("/")[0] : "PRIMARY";

        const actions: ResourceListActionInterface[] = [
            {
                "data-testid": `${ testId }-edit-user-${ user.userName }-button`,
                hidden: false,
                icon: !hasRequiredScopes(
                    featureConfig?.users,
                    featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(
                    featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                    ? "eye" : "pencil alternate",
                onClick: (): void => handleUserEdit(user.id),
                popupText: !hasRequiredScopes(
                    featureConfig?.users,
                    featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(
                    featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                    ? t("common:view")
                    : t("common:edit"),
                type: "button"
            }
        ];

        actions.push({
            "data-testid": `${ testId }-delete-user-${ user.userName }-button`,
            hidden: !hasRequiredScopes(
                featureConfig?.users,
                featureConfig?.users?.scopes?.delete, allowedScopes)
                || readOnlyUserStores?.includes(userStore.toString()) || user.userName === "admin",
            icon: "trash alternate",
            onClick: (): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingUser(user);
            },
            popupText: t("adminPortal:components.users.usersList.list" +
                ".iconPopups.delete"),
            type: "button"
        });

        return actions;
    };

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("adminPortal:components.users.usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ t("adminPortal:components.users.usersList.search.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("adminPortal:components.users.usersList.search.emptyResultPlaceholder.subTitle.0",
                            { query: searchQuery }),
                        t("adminPortal:components.users.usersList.search.emptyResultPlaceholder.subTitle.1")
                    ] }
                />
            );
        }

        if (usersList.totalResults === 0 && usersList.Resources) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-placeholder` }
                    action={ (
                        <PrimaryButton
                            data-testid={ `${ testId }-empty-placeholder-add-user-button` }
                            onClick={ () => onEmptyListPlaceholderActionClick() }
                        >
                            <Icon name="add"/>
                            { t("adminPortal:components.users.usersList.list.emptyResultPlaceholder.addButton") }
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ t("adminPortal:components.users.usersList.list.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("adminPortal:components.users.usersList.list.emptyResultPlaceholder.subTitle.0"),
                        t("adminPortal:components.users.usersList.list.emptyResultPlaceholder.subTitle.1"),
                        t("adminPortal:components.users.usersList.list.emptyResultPlaceholder.subTitle.2")
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            <ResourceList
                className="application-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
                fill={ !showPlaceholders() }
                celled={ false }
                divided={ true }
                selection={ selection }
            >
                {
                    usersList?.Resources && usersList.Resources instanceof Array && usersList.Resources.length > 0
                        ? usersList.Resources.map((user, index) => (
                            <ResourceListItem
                                key={ index }
                                actions={ resolveListItemActions(user) }
                                actionsFloated="right"
                                avatar={ (
                                    <UserAvatar
                                        name={ user.userName }
                                        size="mini"
                                        floated="left"
                                        image={ user.profileUrl }
                                    />
                                ) }
                                itemHeader={ user.name && user.name.givenName !== undefined ? user.name.givenName +
                                    " " + user.name.familyName : user.userName }
                                itemDescription={ user.emails ? user.emails[ 0 ].toString() :
                                    user.userName }
                                metaContent={ showMetaContent ? listContent(user) : null }
                                metaColumnWidth={ metaColumnWidth }
                                descriptionColumnWidth={ descriptionColumnWidth }
                                actionsColumnWidth={ actionsColumnWidth }
                                onClick={ (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => {
                                    if (!selection) {
                                        return;
                                    }

                                    handleUserEdit(user.id);
                                    onListItemClick(event, data);
                                } }
                            />
                        ))
                        : showPlaceholders()
                }
            </ResourceList>
            {
                deletingUser && (
                    <ConfirmationModal
                        data-testid={ `${ testId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingUser.userName }
                        assertionHint={
                            (
                                <p>
                                    <Trans
                                        i18nKey={ "adminPortal:components.user.deleteUser.confirmationModal." +
                                        "assertionHint" }
                                        tOptions={ { userName: deletingUser.userName } }
                                    >
                                        Please type <strong>{ deletingUser.userName }</strong> to confirm.
                                    </Trans>
                                </p>
                            )
                        }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => deleteUser(deletingUser.id) }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-confirmation-modal-header` }>
                            { t("adminPortal:components.user.deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${ testId }-confirmation-modal-message` }
                            attached
                            warning
                        >
                            { t("adminPortal:components.user.deleteUser.confirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-confirmation-modal-content` }>
                            { t("adminPortal:components.user.deleteUser.confirmationModal.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
UsersList.defaultProps = {
    actionsColumnWidth: 3,
    descriptionColumnWidth: 3,
    metaColumnWidth: 10,
    showListItemActions: true,
    showMetaContent: true
};
