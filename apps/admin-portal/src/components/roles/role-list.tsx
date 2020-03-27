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

import React, { ReactElement, useState } from "react";
import { RolesInterface } from "../../models";
import { ResourceList, ResourceListItem, Avatar, ConfirmationModal } from "@wso2is/react-components";
import { CommonUtils } from "../../utils";
import { history } from "../../helpers";
import { ROLE_VIEW_PATH } from "../../constants";
import { Icon } from "semantic-ui-react";

interface RoleListProps {
    roleList: RolesInterface[];
    handleRoleDelete: (role: RolesInterface) => void;
}

/**
 * List component for Role Management list
 * 
 * @param props contains the role list as a prop to populate
 */
export const RoleList: React.FunctionComponent<RoleListProps> = (props: RoleListProps): ReactElement => {
    
    const {
        roleList,
        handleRoleDelete
    } = props;

    const [ showRoleDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false)
    const [ currentDeletedRole, setCurrentDeletedRole ] = useState<RolesInterface>();

    const handleRoleEdit = (roleId: string) => {
        history.push(ROLE_VIEW_PATH + roleId);
    };

    return (
        <>
            <ResourceList className="roles-list">
                {
                    roleList && roleList.map((role, index) => (
                        <ResourceListItem
                            key={ index }
                            actionsFloated="right"
                            actions={ [{
                                    icon: "pencil alternate",
                                    onClick: () => handleRoleEdit(role.id),
                                    popupText: "Edit Role",
                                    type: "button"
                                },
                                {
                                    icon: "trash alternate",
                                    onClick: () => {
                                        setCurrentDeletedRole(role);
                                        setShowDeleteConfirmationModal(!showRoleDeleteConfirmation);
                                    },
                                    popupText: "Delete Role",
                                    type: "button"
                            }] }
                            avatar={ (
                                <Avatar
                                    name={ role.displayName }
                                    size="small"
                                    image={ 
                                        <Icon size="large" name='users' />
                                    }
                                />
                            ) }
                            itemHeader={ role.displayName }
                            metaContent={ CommonUtils.humanizeDateDifference(role.meta.created) }
                        />
                    ))
                }
            </ResourceList>
            {
                showRoleDeleteConfirmation && 
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showRoleDeleteConfirmation }
                        assertion={ currentDeletedRole.displayName }
                        assertionHint={ 
                            <p>Please type <strong>{ currentDeletedRole.displayName }</strong> to confirm.</p>
                        }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => { 
                            handleRoleDelete(currentDeletedRole);
                            setShowDeleteConfirmationModal(false);
                        } }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will permanently delete the selected role.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this role, the permissions attached to it will be deleted and the users 
                            attached to it will no longer be able to perform intended actions which were previously
                            allowed. Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
            }
        </>
    );
};
