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
import { Button, Grid, Icon, Input, Label, List, Popup, Segment } from "semantic-ui-react";
import _ from "lodash";
import { Forms } from "@wso2is/forms";
import { EmptyPlaceholder } from "@wso2is/react-components";
import { EmptyPlaceholderIllustrations } from "../../configs";

/**
 * Proptypes for the application consents list component.
 */
interface AddUserRoleProps {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    handleRoleListChange: (roles: any) => void;
    handleTempListChange: (roles: any) => void;
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
        onSubmit,
        handleRoleListChange,
        handleTempListChange
    } = props;

    const handleRemoveRoleItem = (role: any) => {
        const userRolesCopy = [ ...initialValues?.tempRoleList ];
        userRolesCopy.splice(initialValues?.tempRoleList.indexOf(role), 1);
        handleTempListChange(userRolesCopy);

        // When a role is removed from the assigned list it is appended
        // back to the initial list.
        handleRoleListChange([ ...initialValues?.roleList, role]);
    };

    const addRole = (role: any) => {
         if (!(initialValues?.tempRoleList.includes(role))) {
             handleTempListChange([ ...initialValues?.tempRoleList, role ]);

             // When a role is added to the assigned role list it is removed
             // from the initial list.
             const roleListCopy = [ ...initialValues?.roleList ];
             roleListCopy.splice(initialValues?.roleList.indexOf(role), 1);
             handleRoleListChange(roleListCopy);
         }
    };

    /**
     * The following function enables the user to select all the roles
     * at once.
     */
    const handleSelectAll = () => {
        handleTempListChange(initialValues.initialRoleList);
        handleRoleListChange([]);
    };

    /**
     * The following function enables the user to deselect all the roles
     * at once.
     */
    const handleRemoveAll = () => {
        handleRoleListChange(initialValues.initialRoleList);
        handleTempListChange([]);
    };

    const handleSearchFieldChange = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            initialValues.roleList && initialValues.roleList.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredRoleList.push(role);
                    handleRoleListChange(filteredRoleList);
                }
            });
        } else {
            handleRoleListChange(initialValues?.initialRoleList);
        }
    };

    return (
        <>
        <Forms
            onSubmit={ () => {
                onSubmit({ roles: initialValues?.tempRoleList });
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
                                   {
                                       !_.isEmpty(initialValues.roleList) ?
                                           <List className={ "user-role-list" }>
                                               { initialValues.roleList &&
                                               initialValues.roleList.map((role, index) => {
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
                                           : (
                                               <div className={ "empty-placeholder-center" }>
                                                   <EmptyPlaceholder
                                                       image={ EmptyPlaceholderIllustrations.emptyList }
                                                       imageSize="mini"
                                                       title={ "The role list is empty" }
                                                       subtitle={ [ "You have assigned all the roles to user." ] }
                                                   />
                                               </div>
                                           )
                                   }
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
                                        initialValues.tempRoleList && initialValues.tempRoleList.map((role, index) => {
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
                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <Button
                            fluid
                            onClick={ () => handleSelectAll() }
                        >
                            <Icon name="check circle outline"/>
                            Select all
                        </Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button
                            fluid
                            onClick={ () => handleRemoveAll() }
                        >
                            <Icon name="times circle outline"/>
                            Remove all
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};
