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

import { AlertLevels, CRUDPermissionsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AppAvatar, ConfirmationModal, ResourceList, ResourceListActionInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../../helpers";
// TODO: Importing `deleteApplication` before `history` import throws `appBaseName` undefined error.
// tslint:disable-next-line:ordered-imports
import { deleteApplication } from "../../api";
import { ApplicationListInterface, ApplicationListItemInterface, ConfigReducerStateInterface } from "../../models";
import { AppState } from "../../store";

/**
 *
 * Proptypes for the applications list component.
 */
interface ApplicationListPropsInterface {
    /**
     * Application list.
     */
    list: ApplicationListInterface;
    /**
     * On application delete callback.
     */
    onApplicationDelete: () => void;
    /**
     * CRUD permissions,
     */
    permissions?: CRUDPermissionsInterface;
}

/**
 * Application list component.
 *
 * @param {ApplicationListPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ApplicationList: FunctionComponent<ApplicationListPropsInterface> = (
    props: ApplicationListPropsInterface
): ReactElement => {

    const {
        list,
        onApplicationDelete,
        permissions
    } = props;

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingApplication, setDeletingApplication ] = useState<ApplicationListItemInterface>(undefined);

    /**
     * Redirects to the applications edit page when the edit button is clicked.
     *
     * @param {string} appId - Application id.
     */
    const handleApplicationEdit = (appId: string): void => {
        history.push(`applications/${ appId }`);
    };

    /**
     * Deletes an application when the delete application button is clicked.
     *
     * @param {string} appId - Application id.
     */
    const handleApplicationDelete = (appId: string): void => {
        deleteApplication(appId)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully deleted the application",
                    level: AlertLevels.SUCCESS,
                    message: "Delete successful"
                }));

                setShowDeleteConfirmationModal(false);
                onApplicationDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Delete Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while deleting the application",
                    level: AlertLevels.ERROR,
                    message: "Application Delete Error"
                }));
            });
    };

    /**
     * Resolves list item actions based on the app config.
     *
     * @param {ApplicationListItemInterface} app - Application derails.
     * @return {ResourceListActionInterface[]} Resolved list actions.
     */
    const resolveListActions = (app: ApplicationListItemInterface): ResourceListActionInterface[]  => {
        const actions: ResourceListActionInterface[] = [
            {
                icon: "pencil alternate",
                onClick: (): void => handleApplicationEdit(app.id),
                popupText: "Edit",
                type: "button"
            }
        ];

        if (permissions && permissions.delete === false) {
            return actions;
        }

        actions.push({
            hidden: config?.deployment?.doNotDeleteApplications.includes(app.name),
            icon: "trash alternate",
            onClick: (): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingApplication(app);
            },
            popupText: "Delete",
            type: "button"
        });

        return actions;
    };

    return (
        <>
            <ResourceList className="applications-list">
                {
                    list.applications.map((app: ApplicationListItemInterface, index: number) => {
                        // TODO Remove this check and move the logic to backend.
                        if ("wso2carbon-local-sp" !== app.name) {
                            return (
                                <ResourceList.Item
                                    key={ index }
                                    actions={ resolveListActions(app) }
                                    actionsFloated="right"
                                    avatar={ (
                                        <AppAvatar
                                            name={ app.name }
                                            image={ app.image }
                                            size="mini"
                                            floated="left"
                                        />
                                    ) }
                                    itemHeader={ app.name }
                                    itemDescription={ app.description }
                                />
                            );
                        }
                    })
                }
            </ResourceList>
            {
                deletingApplication && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingApplication.name }
                        assertionHint={ <p>Please type <strong>{ deletingApplication.name }</strong> to confirm.</p> }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleApplicationDelete(deletingApplication.id) }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will permanently delete the application.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this application, you will not be able to get it back. All the applications
                            depending on this also might stop working. Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
