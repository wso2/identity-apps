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
import { Divider, Header, List } from "semantic-ui-react";
import { Field, Forms } from "@wso2is/forms";

/**
 * Prop types for user list options component.
 */
interface UsersListOptionsProps {
    handleMetaColumnChange: (columns: string[]) => void;
    userListMetaContent: Map<string, string>;
}

/**
 * Users list options component.
 *
 * @return {ReactElement}
 */
export const UsersListOptionsComponent: React.FunctionComponent<UsersListOptionsProps> = (
    props: UsersListOptionsProps
): ReactElement => {

    const {
        handleMetaColumnChange,
        userListMetaContent
    } = props;

    const handleOptionOnChange = (isChanged, values) => {
        const checkedValues = [];
        values.forEach((value) => {
            if(value[0]) {
                checkedValues.push(value[0]);
            }
        });
        handleMetaColumnChange(checkedValues);
    };

    return (
        <Forms
            onSubmit={ null }
            onChange={ (isChanged, values) => handleOptionOnChange(isChanged, values) }
        >
            <Header as="h6" >Show Columns</Header>
            <Divider />
            <List relaxed>
                <List.Item>
                    <Field
                        name="name"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: "Name",
                                value: "name"
                            }
                        ] }
                        value={ [userListMetaContent.get("name").toString()] }
                        defaultChecked
                        disabled
                    />
                </List.Item>
                <List.Item>
                    <Field
                        name="emails"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: "Email",
                                value: "emails"
                            }
                        ] }
                        value={ [userListMetaContent.get("emails").toString()] }
                        defaultChecked
                        disabled
                    />
                </List.Item>
                <List.Item>
                    <Field
                        name="userName"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: "Username",
                                value: "userName"
                            }
                        ] }
                        value={ userListMetaContent.get("userName")?.toString() ?
                            [userListMetaContent.get("userName").toString()] : null }
                    />
                </List.Item>
                <List.Item>
                    <Field
                        name="id"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: "User id",
                                value: "id"
                            }
                        ] }
                        value={ userListMetaContent.get("id")?.toString() ?
                            [userListMetaContent.get("id").toString()] : null }
                    />
                </List.Item>
                <List.Item>
                    <Field
                        name="meta.lastModified"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: "Last modified",
                                value: "meta.lastModified"
                            }
                        ] }
                        value={ userListMetaContent.get("meta.lastModified")?.toString() ? [
                            userListMetaContent.get("meta.lastModified").toString()] : null }
                    />
                </List.Item>
                {
                    /*
                     * TODO: enable this field once we add the CSS to truncate the user id.
                    <List.Item>
                        <Field
                            name="meta.created"
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: "Created date",
                                    value: "meta.created"
                                }
                            ] }
                            value={ userListMetaContent.get("meta.created")?.toString() ?
                            [userListMetaContent.get("meta.created").toString()] : null }
                        />
                    </List.Item>
                     */
                }
            </List>
        </Forms>
    );
};
