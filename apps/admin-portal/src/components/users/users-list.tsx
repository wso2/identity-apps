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

import React, { ReactElement } from "react";
import {
    ResourceList,
    ResourceListItem,
    UserAvatar
} from "@wso2is/react-components";
import { Grid, List, SemanticWIDTHS } from "semantic-ui-react";
import { history } from "../../helpers";
import { UserBasicInterface, UserListInterface } from "../../models";
import { CommonUtils } from "../../utils";

/**
 * Prop types for the liked accounts component.
 */
interface UsersListProps {
    usersList: UserListInterface;
    handleUserDelete: (userId: string) => void;
    userMetaListContent: Map<string, string>;
}

/**
 * Users info page.
 *
 * @return {ReactElement}
 */
export const UsersList: React.FunctionComponent<UsersListProps> = (props: UsersListProps): ReactElement => {
    const {
        usersList,
        handleUserDelete,
        userMetaListContent
    } = props;

    const handleUserEdit = (userId: string) => {
        history.push(`users/${ userId }`);
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
                if (
                    key !== "" &&
                    (key === "meta.lastModified" ||
                        key === "meta.created")
                )
                {
                    if(user.meta) {
                        const metaAttribute = key.split(".");
                        attribute = user.meta[metaAttribute[1]];
                        attribute && (attributes.push(CommonUtils.humanizeDateDifference(attribute)));
                    }
                }
                attribute = user[key];
                attributes.push(attribute);
            }
        }

        let metaColumnWidth: SemanticWIDTHS = 1;
         const metaList = attributes.map((metaAttribute, index) => {
             if (metaAttribute?.toString().length <= 10) {
                 metaColumnWidth = 2;
             }
             if (metaAttribute?.toString().length >= 20) {
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
        return metaList;
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
                        itemDescription={ user.emails ? user.emails[0].toString() :
                            user.userName }
                        metaContent={ listContent(user) }
                        metaColumnWidth={ 10 }
                        descriptionColumnWidth={ 3 }
                        actionsColumnWidth={ 3 }
                    />
                ))
            }
        </ResourceList>
    );
};
