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
import { SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LinkButton, PrimaryButton, ResourceList } from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "semantic-ui-react";
import { deleteUserStore } from "../../api";
import { EDIT_USER_STORE_PATH } from "../../constants";
import { history } from "../../helpers";
import { AlertLevels, FeatureConfigInterface, UserStoreListItem } from "../../models";

/**
 * Prop types of the `UserStoresList` component
 */
interface UserStoresListPropsInterface extends SBACInterface<FeatureConfigInterface> {
    /**
     * The userstore list
     */
    list: UserStoreListItem[];
    /**
     * Initiate an update
     */
    update: () => void;
}

/**
 * This component renders the Userstore List
 * @param {UserStoresListPropsInterface} props
 * @return {ReactElement}
 */
export const UserStoresList = (props: UserStoresListPropsInterface): ReactElement => {

    const {
        featureConfig,
        list,
        update
    } = props;

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteID, setDeleteID] = useState<string>(null);

    const dispatch = useDispatch();

    /**
     * Delete a userstore
     * @param {string} id userstore id
     */
    const initDelete = (id: string) => {
        setDeleteID(id);
        setDeleteConfirm(true);
    };

    /**
     * Closes the delete confirmation modal
     */
    const closeDeleteConfirm = () => {
        setDeleteConfirm(false);
        setDeleteID(null);
    };

    /**
     * Shows the delete confirmation modal
     * @return {ReactElement}
     */
    const showDeleteConfirm = (): ReactElement => {
        return (
            <Modal
                open={ deleteConfirm }
                onClose={ closeDeleteConfirm }
                size="mini"
                dimmer="blurring"
            >
                <Modal.Header>
                    Confirm Delete
                </Modal.Header>
                <Modal.Content>
                    This will completely remove the userstore and the data in it.
                    Do you want to continue deleting it?
                </Modal.Content>
                <Modal.Actions>
                    <LinkButton onClick={ closeDeleteConfirm }>
                        Cancel
                    </LinkButton>
                    <PrimaryButton onClick={ () => {

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
                                closeDeleteConfirm();
                            })
                            .catch(error => {
                                dispatch(addAlert({
                                    description: error?.description
                                        ?? "There was an error while deleting the userstore",
                                    level: AlertLevels.ERROR,
                                    message: error?.message ?? "Something went wrong!"
                                }));
                                closeDeleteConfirm();
                            });

                    } }>
                        Delete
                    </PrimaryButton>
                </Modal.Actions>
            </Modal>
        )
    };

    return (
        <>
            {showDeleteConfirm()}
            <ResourceList>
                {
                    list?.map((userStore: UserStoreListItem, index: number) => (
                        <ResourceList.Item
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
                                        initDelete(userStore?.id)
                                    },
                                    popupText: "Delete",
                                    type: "dropdown"
                                }
                            ] }
                            actionsFloated="right"
                            itemHeader={ userStore.name }
                            metaContent={ userStore.description }
                        />
                    ))
                }
            </ResourceList>
        </>
    )
};
