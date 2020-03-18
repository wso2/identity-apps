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
import React, { ReactElement, useState, FunctionComponent, useEffect } from "react";
import { Grid, Input, Icon, Segment, List, Label, Message } from "semantic-ui-react";
import { Forms } from "@wso2is/forms";
import _ from "lodash";
import { UserBasicInterface } from "../../../models";
import { getUsersList } from "../../../api";
import { DEFAULT_USER_LIST_ITEM_LIMIT } from "../../../constants";
import { UserAvatar } from "@wso2is/react-components";

/**
 * Proptypes for the application consents list component.
 */
interface AddRoleUserProps {
    triggerSubmit?: boolean;
    onSubmit?: (values: any) => void;
}

export const AddRoleUsers: FunctionComponent<AddRoleUserProps> = (props: AddRoleUserProps): ReactElement => {
    const {
        triggerSubmit,
        onSubmit
    } = props;

    const [ tempUserList, setTempUserList ] = useState([]);
    const [ duplicationError, setError ] = useState(undefined);
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);

    const getList = (limit: number, offset: number, filter: string, attribute: string) => {
        getUsersList(limit, offset, filter, attribute)
            .then((response) => {
                setUsersList(response.Resources);
            });
    };

    useEffect(() => {
        setListItemLimit(DEFAULT_USER_LIST_ITEM_LIMIT);
        setUserListMetaContent(new Map<string, string>([
            ["name", "name"],
            ["emails", "emails"],
            ["name", "name"],
            ["userName", "userName"],
            ["id", ""],
            ["profileUrl", "profileUrl"],
            ["meta.lastModified", "meta.lastModified"],
            ["meta.created", ""]
        ]));
    }, []);

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @return string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray = [];
        const iterator1 = attributeMap[Symbol.iterator]();

        for (const attribute of iterator1) {
            if (attribute !== "") {
                attArray.push(attribute);
            }
        }

        return attArray.toString();
    };

    useEffect(() => {
        if (userListMetaContent) {
            const attributes = generateAttributesString(userListMetaContent.values());
            getList(listItemLimit, listOffset, null, attributes);
        }
    }, [ listOffset, listItemLimit ]);

    const handleRemoveRoleItem = (role: any) => {
        const userRolesCopy = [ ...tempUserList ];
        userRolesCopy.splice(tempUserList.indexOf(role), 1);
        setTempUserList(userRolesCopy);
    };

    const addRole = (role: any) => {
        if (!(tempUserList.includes(role))) {
            setTempUserList([ ...tempUserList, role ]);
            setError(undefined);
        } else {
            setError("You have already added the role:" + " " + role.displayName);
        }
    };

    const handleSearchFieldChange = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList: UserBasicInterface[] = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            usersList && usersList.map((user) => {
                isMatch = re.test(user.userName);
                if (isMatch) {
                    filteredRoleList.push(user);
                    setUsersList(filteredRoleList);
                }
            });
        } else {
            setUsersList(usersList);
        }
    };
    
    return (
        <Forms
            onSubmit={ () => {
                onSubmit({ users: tempUserList });
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <label>Available Users list</label>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Input
                                    icon={ <Icon name="search"/> }
                                    fluid
                                    onChange={ handleSearchFieldChange }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 2 }>
                           <Grid.Column>
                               <Segment className={ "user-role-list-segment" }>
                                   <List className={ "user-role-list" }>
                                       { usersList && usersList.map((user, index): ReactElement =>{
                                             return (
                                                <List.Item
                                                    key={ index }
                                                    className={ "user-role-list-item" }
                                                    onClick={ () => addRole(user) }
                                                >
                                                    <UserAvatar
                                                        name={ user.userName }
                                                        size="mini"
                                                        floated="left"
                                                        image={ user.profileUrl }
                                                    />
                                                    { user.userName }
                                                    <Icon name="add" />
                                                </List.Item>
                                             )
                                         })
                                       }
                                   </List>
                               </Segment>
                           </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column>
                        <Grid.Row columns={ 1 } className={ "urlComponentLabelRow" }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <label>Added Users</label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Segment className={ "user-assigned-roles-segment" }>
                                    {
                                        tempUserList && tempUserList.map((user, index): ReactElement => {
                                            return (
                                                <Label key={ index }>
                                                    <UserAvatar
                                                        name={ user.userName }
                                                        size="mini"
                                                        floated="left"
                                                        image={ user.profileUrl }
                                                    />
                                                    { user.userName }
                                                    <Icon
                                                        name="delete"
                                                        onClick={ () => handleRemoveRoleItem(user) }
                                                    />
                                                </Label>
                                            );
                                        })
                                    }
                                </Segment>
                                {
                                    duplicationError && (
                                        <Message negative>
                                            <p>
                                                { duplicationError }
                                            </p>
                                        </Message>
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
}
