/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { LoadableComponentInterface, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceList
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Icon, Image } from "semantic-ui-react";
import { deleteUserStore } from "../../api";
import { DatabaseAvatarGraphic, EmptyPlaceholderIllustrations } from "../../configs";
import { EDIT_USER_STORE_PATH, UIConstants } from "../../constants";
import { history } from "../../helpers";
import { AlertLevels, FeatureConfigInterface, UserStoreListItem } from "../../models";

/**
 * Prop types of the `UserStoresList` component
 */
interface UserStoresListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

    /**
     * The userstore list
     */
    list: UserStoreListItem[];
    /**
     * Initiate an update
     */
    update: () => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick: () => void;
    /**
     * Search query for the list.
     */
    searchQuery: string;
}

/**
 * This component renders the Userstore List.
 *
 * @param {UserStoresListPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const UserStoresList: FunctionComponent<UserStoresListPropsInterface> = (
    props: UserStoresListPropsInterface
): ReactElement => {

    const {
        isLoading,
        featureConfig,
        list,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery,
        update,
        [ "data-testid" ]: testId
    } = props;

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteID, setDeleteID ] = useState<string>(null);
    const [ deleteName, setDeleteName ] = useState<string>("");

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Delete a userstore.
     * 
     * @param {string} id userstore id.
     * @param {string} name userstore name.
     */
    const initDelete = (id: string, name: string) => {
        setDeleteID(id);
        setDeleteName(name);
        setDeleteConfirm(true);
    };

    /**
     * Closes the delete confirmation modal
     */
    const closeDeleteConfirm = () => {
        setDeleteConfirm(false);
        setDeleteName("");
        setDeleteID(null);
    };

    /**
     * Shows the delete confirmation modal
     * @return {ReactElement}
     */
    const showDeleteConfirm = (): ReactElement => (
        <ConfirmationModal
            onClose={ closeDeleteConfirm }
            type="warning"
            open={ deleteConfirm }
            assertion={ deleteName }
            assertionHint={
                <p>
                    <Trans i18nKey="devPortal:components.userstores.confirmation.hint">
                        Please type
                        <strong data-testid={ `${ testId }-delete-confirmation-modal-assertion` }>
                            { { name: deleteName } }
                        </strong > to confirm.
                    </Trans>
                </p>
            }
            assertionType="input"
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ closeDeleteConfirm }
            onPrimaryActionClick={ (): void => {
                deleteUserStore(deleteID)
                    .then(() => {
                        dispatch(addAlert({
                            description: t("devPortal:components.userstores.notifications." +
                                "deleteUserstore.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("devPortal:components.userstores.notifications." +
                                "deleteUserstore.success.message")

                        }));
                        dispatch(addAlert({
                            description: t("devPortal:components.userstores.notifications." +
                                "delay.description"),
                            level: AlertLevels.WARNING,
                            message: t("devPortal:components.userstores.notifications." +
                                "delay.message")
                        }));
                        update();
                    })
                    .catch(error => {
                        dispatch(addAlert({
                            description: error?.description
                                ?? t("devPortal:components.userstores.notifications." +
                                    "deleteUserstore.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: error?.message
                                ?? t("devPortal:components.userstores.notifications." +
                                    "deleteUserstore.genericError.message")
                        }));
                    }).finally(() => {
                        closeDeleteConfirm();
                    });
            } }
            data-testid={ `${ testId }-delete-confirmation-modal` }
        >
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }
            >
                { t("devPortal:components.userstores.confirmation.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-delete-confirmation-modal-message` }
            >
                { t("devPortal:components.userstores.confirmation.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-delete-confirmation-modal-content` }
            >
                { t("devPortal:components.userstores.confirmation.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

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
                            { t("devPortal:components.userstores.placeholders.emptySearch.action") }
                        </LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ t("devPortal:components.userstores.placeholders.emptySearch.title") }
                    subtitle={ [
                        t("devPortal:components.userstores.placeholders.emptySearch.subtitles",
                            {
                                searchQuery: searchQuery
                            })
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        if (list?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                            <Icon name="add" />
                            { t("devPortal:components.userstores.placeholders.emptyList.action") }
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ t("devPortal:components.userstores.placeholders.emptyList.title") }
                    subtitle={ [
                        t("devPortal:components.userstores.placeholders.emptyList.subtitles")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            { deleteConfirm && showDeleteConfirm() }
            <ResourceList
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                data-testid={ testId }
            >
                {
                    list && list instanceof Array && list.length > 0
                        ? list?.map((userStore: UserStoreListItem, index: number) => (
                            <ResourceList.Item
                                avatar={
                                    <Image
                                        floated="left"
                                        verticalAlign="middle"
                                        rounded
                                        centered
                                        size="mini"
                                        data-testid={ `${ testId }-item-image` }
                                    >
                                        <DatabaseAvatarGraphic.ReactComponent />
                                    </Image>
                                }
                                key={ index }
                                actions={ [
                                    {
                                        icon: "pencil alternate",
                                        onClick: () => {
                                            history.push(`${EDIT_USER_STORE_PATH}/${userStore?.id}`);
                                        },
                                        popupText: t("common:edit"),
                                        type: "button"
                                    },
                                    {
                                        hidden: !hasRequiredScopes(
                                            featureConfig?.userStores,
                                            featureConfig?.userStores?.scopes?.delete),
                                        icon: "trash alternate",
                                        onClick: () => {
                                            initDelete(userStore?.id, userStore?.name)
                                        },
                                        popupText: t("common:delete"),
                                        type: "dropdown"
                                    }
                                ] }
                                actionsFloated="right"
                                itemHeader={ userStore.name }
                                itemDescription={ userStore.description }
                                data-testid={ `${ testId }-item` }
                            />
                        ))
                        : showPlaceholders()
                }
            </ResourceList>
        </>
    )
};

/**
 * Default props for the component.
 */
UserStoresList.defaultProps = {
    "data-testid": "userstores-list"
};
