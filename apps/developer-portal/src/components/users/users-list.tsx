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

import { LoadableComponentInterface } from "@wso2is/core/dist/src/models";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceList,
    ResourceListItem,
    UserAvatar
} from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { Grid, Icon, List, SemanticWIDTHS } from "semantic-ui-react";
import { EmptyPlaceholderIllustrations } from "../../configs";
import { UIConstants } from "../../constants";
import { history } from "../../helpers";
import { UserBasicInterface, UserListInterface } from "../../models";
import { CommonUtils } from "../../utils";

/**
 * Prop types for the liked accounts component.
 */
interface UsersListProps extends LoadableComponentInterface {
    /**
     * User delete callback.
     * @param {string} userId - ID of the deleting user.
     */
    handleUserDelete: (userId: string) => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick: () => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear: () => void;
    /**
     * Search query for the list.
     */
    searchQuery: string;
    /**
     * Meta for the user list.
     */
    userMetaListContent: Map<string, string>;
    /**
     * User list.
     */
    usersList: UserListInterface;
}

/**
 * Users info page.
 *
 * @return {ReactElement}
 */
export const UsersList: React.FunctionComponent<UsersListProps> = (props: UsersListProps): ReactElement => {
    const {
        handleUserDelete,
        isLoading,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery,
        userMetaListContent,
        usersList
    } = props;

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);

    const handleUserEdit = (userId: string) => {
        history.push(`users/${ userId }`);
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
                        <LinkButton onClick={ onSearchQueryClear }>Clear search query</LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ "No results found" }
                    subtitle={ [
                        `We couldn't find any results for ${ searchQuery }`,
                        "Please try a different search term."
                    ] }
                />
            );
        }

        if (usersList.totalResults === 0 && usersList.Resources) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton
                            data-testid="user_mgt_user_list_add_user_button"
                            onClick={ () => onEmptyListPlaceholderActionClick() }
                        >
                            <Icon name="add"/>
                            New User
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ "Add a new User" }
                    subtitle={ [
                        "There are currently no users available.",
                        "You can add a new user easily by following the",
                        "steps in the user creation wizard."
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            <ResourceList
                className="applications-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
            >
                {
                    usersList?.Resources && usersList.Resources instanceof Array && usersList.Resources.length > 0
                        ? usersList.Resources.map((user, index) => (
                            <ResourceListItem
                                key={ index }
                                actions={ [
                                    {
                                        elementTestId: `user_mgt_user_list_edit_user_${ user.userName }_button`,
                                        icon: "pencil alternate",
                                        onClick: () => handleUserEdit(user.id),
                                        popupText: "Edit",
                                        type: "button"
                                    },
                                    {
                                        elementTestId: `user_mgt_user_list_delete_user_${ user.userName }_button`,
                                        hidden: user.userName === "admin",
                                        icon: "trash alternate",
                                        onClick: (): void => {
                                            setShowDeleteConfirmationModal(true);
                                            setDeletingUser(user);
                                        },
                                        popupText: "Delete user",
                                        type: "button"
                                    }
                                ] }
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
                                metaContent={ listContent(user) }
                                metaColumnWidth={ 10 }
                                descriptionColumnWidth={ 3 }
                                actionsColumnWidth={ 3 }
                            />
                        ))
                        : showPlaceholders()
                }
            </ResourceList>
            {
                deletingUser && (
                    <ConfirmationModal
                        confirmationModalTestId="user_mgt_user_list_confirmation_modal"
                        primaryActionButtonTestId="user_mgt_user_list_confirmation_modal_confirm_button"
                        secondaryActionButtonTestId="user_mgt_user_list_confirmation_modal_cancel_button"
                        confirmationInputTestId="user_mgt_user_list_confirmation_modal_input"
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingUser.userName }
                        assertionHint={ <p>Please type <strong>{ deletingUser.userName }</strong> to confirm.</p> }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => deleteUser(deletingUser.id) }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will permanently delete the user.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this user, the user will not be able to login to the developer portal or any
                            other application the user was subscribed before. Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
