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
import { LoadableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceList
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
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
interface UserStoresListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface {
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
 * This component renders the Userstore List
 * @param {UserStoresListPropsInterface} props
 * @return {ReactElement}
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
        update
    } = props;

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteID, setDeleteID ] = useState<string>(null);
    const [ deleteName, setDeleteName ] = useState<string>("");

    const dispatch = useDispatch();

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
            assertionHint={ <p>Please type <strong>{ deleteName }</strong> to confirm.</p> }
            assertionType="input"
            primaryAction="Confirm"
            secondaryAction="Cancel"
            onSecondaryActionClick={ closeDeleteConfirm }
            onPrimaryActionClick={ (): void => {
                deleteUserStore(deleteID)
                    .then(() => {
                        dispatch(addAlert({
                            description: "The userstore has been deleted successfully!",
                            level: AlertLevels.SUCCESS,
                            message: "Userstore deleted successfully!"

                        }));
                        dispatch(addAlert({
                            description: "It may take a while for the userstore list to be updated. " +
                                "Refresh in a few seconds to get the updated userstore list.",
                            level: AlertLevels.WARNING,
                            message: "Updating Userstore list takes time"
                        }));
                        update();
                    })
                    .catch(error => {
                        dispatch(addAlert({
                            description: error?.description
                                ?? "There was an error while deleting the userstore",
                            level: AlertLevels.ERROR,
                            message: error?.message ?? "Something went wrong!"
                        }));
                    }).finally(() => {
                        closeDeleteConfirm();
                    });
            } }
        >
            <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
            <ConfirmationModal.Message attached warning>
                This action is irreversible and will permanently delete the selected userstore and the data in it.
                        </ConfirmationModal.Message>
            <ConfirmationModal.Content>
                If you delete this userstore, the user data in this userstore will also be deleted.
                Please proceed with caution.
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

        if (list?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                            <Icon name="add" />
                            New Userstore
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ "Add a new Userstore" }
                    subtitle={ [
                        "There are currently no userstores available.",
                        "You can add a new userstore easily by following the",
                        "steps in the userstore creation wizard."
                    ] }
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
                                        popupText: "Edit",
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
                                        popupText: "Delete",
                                        type: "dropdown"
                                    }
                                ] }
                                actionsFloated="right"
                                itemHeader={ userStore.name }
                                itemDescription={ userStore.description }
                            />
                        ))
                        : showPlaceholders()
                }
            </ResourceList>
        </>
    )
};
