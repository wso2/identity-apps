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
import { Grid, Icon, Input, Label, List, Message, Popup, Segment } from "semantic-ui-react";
import _ from "lodash";
import { Forms } from "@wso2is/forms";

/**
 * Proptypes for the application consents list component.
 */
interface AddUserRoleProps {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * User role component.
 *
 * @return {JSX.Element}
 */
export const AddUserRole: React.FunctionComponent<AddUserRoleProps> = (props: AddUserRoleProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit
    } = props;

    const [ roleList, setRoleList ] = useState(initialValues);
    const [ tempRoleList, setTempRoleList ] = useState([]);
    const [ duplicationError, setError ] = useState(undefined);

    const handleRemoveRoleItem = (role: any) => {
        const userRolesCopy = [ ...tempRoleList ];
        userRolesCopy.splice(tempRoleList.indexOf(role), 1);
        setTempRoleList(userRolesCopy);
    };

    const addRole = (role: any) => {
         if (!(tempRoleList.includes(role))) {
             setTempRoleList([ ...tempRoleList, role ]);
             setError(undefined);
         } else {
             setError("You have already added the role:" + " " + role.displayName);
         }
    };

    const handleSearchFieldChange = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            roleList && roleList.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredRoleList.push(role);
                    setRoleList(filteredRoleList);
                }
            });
        } else {
            setRoleList(initialValues);
        }
    };

    return (
        <Forms
            onSubmit={ () => {
                onSubmit({ roles: tempRoleList });
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <label>Roles list</label>
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
                                       { roleList &&
                                         roleList.map((role, index) =>{
                                             return (
                                                 <List.Item
                                                     key={ index }
                                                     className={ "user-role-list-item" }
                                                     onClick={ () => addRole(role) }
                                                 >
                                                     { role.displayName }
                                                     <Icon
                                                         name="add"
                                                     />
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
                                <label>Assigned roles</label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Segment className={ "user-assigned-roles-segment" }>
                                        <Popup
                                          trigger={
                                              <Label className={ "info-label" }>
                                                  Internal/everyone
                                              <Icon
                                                  name="info circle"
                                                  inverted
                                              />
                                              </Label>
                                          }
                                          inverted
                                          content="This role will be assigned to all the users by default."
                                        />
                                    {
                                        tempRoleList && tempRoleList.map((role, index) => {
                                            return (
                                                <Label key={ index }>
                                                    { role.displayName }
                                                    <Icon
                                                        name="delete"
                                                        onClick={ () => handleRemoveRoleItem(role) }
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
    );
};
