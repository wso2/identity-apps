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

import { ResourceList, ResourceListItem, UserAvatar } from "@wso2is/react-components";
import React from "react";
import { Grid, List } from "semantic-ui-react";
import { history } from "../../helpers";
import { UserListInterface } from "../../models";
import { handleLastModifiedDate } from "../../utils";

/**
 * Prop types for the liked accounts component.
 */
interface UsersListProps {
    usersList: UserListInterface;
    handleUserDelete: (userId: string) => void;
}

const listContent = (lastModified: any) => (
    <Grid>
        <Grid.Column width={ 9 }>
            <List.Content>
                <List.Description className="list-item-meta">
                    { lastModified }
                </List.Description>
            </List.Content>
        </Grid.Column>
    </Grid>
);

/**
 * Users info page.
 *
 * @return {JSX.Element}
 */
export const UsersList: React.FunctionComponent<UsersListProps> = (props: UsersListProps): JSX.Element => {
    const {
        usersList,
        handleUserDelete
    } = props;

    const handleUserEdit = (userId: string) => {
        history.push(`users/${ userId }`);
    };

    return (
        <ResourceList className="applications-list">
            {
                usersList && usersList.Resources && usersList.Resources instanceof Array &&
                usersList.Resources.map((user, index) => (
                    <ResourceListItem
                        key={ index }
                        actions={ [
                            {
                                icon: "pencil alternate",
                                onClick: () => handleUserEdit(user.id),
                                popupText: "edit",
                                type: "button"
                            },
                            {
                                icon: "trash alternate",
                                onClick: () => handleUserDelete(user.id),
                                popupText: "delete user",
                                type: "button"
                            }
                        ] }
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
                        itemDescription={ user.emails ? user.emails[0].toString() :
                            user.userName }
                        metaContent={ listContent(handleLastModifiedDate(user.meta.lastModified)) }
                    />
                ))
            }
        </ResourceList>
    );
};
