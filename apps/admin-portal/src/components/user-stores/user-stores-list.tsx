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

import React, {useContext, useState} from "react";
import { ResourceList, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { UserStoreListItem, AlertLevels, AppConfigInterface } from "../../models";
import { Modal } from "semantic-ui-react";
import { deleteUserStore } from "../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "../../store/actions";
import { AppConfig, history } from "../../helpers";

/**
 * Prop types of the `UserStoresList` component
 */
interface UserStoresListPropsInterface {
    /**
     * The user store list
     */
    list: UserStoreListItem[];
    /**
     * Initiate an update
     */
    update: () => void;
}

/**
 * This component renders the User Store List
 * @param {UserStoresListPropsInterface} props
 * @return {React.ReactElement}
 */
export const UserStoresList = (props: UserStoresListPropsInterface): React.ReactElement => {

    const { list, update } = props;

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteID, setDeleteID] = useState<string>(null);

    const dispatch = useDispatch();

    const appConfig: AppConfigInterface = useContext(AppConfig);

    /**
     * Delete a user store
     * @param {string} id user store id
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
     * @return {React.ReactElement}
     */
    const showDeleteConfirm = (): React.ReactElement => {
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
                    This will completely remove the user store and the data in it.
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
                                    message: "User Store deleted successfully!",
                                    description: "The user store has been deleted successfully!",
                                    level: AlertLevels.SUCCESS
                                }));
                                dispatch(addAlert({
                                    message: "Updating User Store list takes time",
                                    description: "It may take a while for the user store list to be updated. " +
                                        "Refresh in a few seconds to get the updated user store list.",
                                    level: AlertLevels.WARNING
                                }));
                                update();
                                closeDeleteConfirm();
                            })
                            .catch(error => {
                                dispatch(addAlert({
                                    message: error?.message ?? "Something went wrong!",
                                    description: error?.description ?? "There was an error while deleting the user store",
                                    level: AlertLevels.ERROR
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
                    appConfig?.userStores?.permissions?.read
                    && list?.map((userStore: UserStoreListItem, index: number) => {
                        return (
                            <ResourceList.Item
                                key={ index }
                                actions={ [
                                    appConfig?.userStores?.permissions?.update && {
                                        icon: "pencil alternate",
                                        onClick: () => {
                                            history.push("/edit-user-store/"+userStore?.id);
                                        },
                                        popupText: "Edit",
                                        type: "button"
                                    },
                                    appConfig?.userStores?.permissions?.delete && {
                                        icon: "trash alternate",
                                        onClick: () => { initDelete(userStore?.id) },
                                        popupText: "Delete",
                                        type: "dropdown"
                                    }
                                ] }
                                actionsFloated="right"
                                itemHeader={ userStore.name }
                                metaContent={ userStore.description }
                            />
                        )
                    })
                }
            </ResourceList>
        </>
    )
};
