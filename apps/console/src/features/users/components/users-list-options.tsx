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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms } from "@wso2is/forms";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Header, List } from "semantic-ui-react";

/**
 * Prop types for user list options component.
 */
interface UsersListOptionsProps extends  TestableComponentInterface {
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
        userListMetaContent,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

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
            <Header as="h6" >{ t("console:manage.features.users.usersList.metaOptions.heading") }</Header>
            <Divider />
            <List relaxed>
                <List.Item>
                    <Field
                        data-testid={ `${ testId }-name` }
                        name="name"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: t("console:manage.features.users.usersList.metaOptions.columns.name"),
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
                        data-testid={ `${ testId }-emails` }
                        name="emails"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: t("console:manage.features.users.usersList.metaOptions.columns.emails"),
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
                        data-testid={ `${ testId }-username` }
                        name="userName"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: t("console:manage.features.users.usersList.metaOptions.columns.userName"),
                                value: "userName"
                            }
                        ] }
                        value={ userListMetaContent.get("userName")?.toString() ?
                            [userListMetaContent.get("userName").toString()] : null }
                    />
                </List.Item>
                <List.Item>
                    <Field
                        data-testid={ `${ testId }-id` }
                        name="id"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: t("console:manage.features.users.usersList.metaOptions.columns.id"),
                                value: "id"
                            }
                        ] }
                        value={ userListMetaContent.get("id")?.toString() ?
                            [userListMetaContent.get("id").toString()] : null }
                    />
                </List.Item>
                <List.Item>
                    <Field
                        data-testid={ `${ testId }-lastModified` }
                        name="meta.lastModified"
                        required={ false }
                        requiredErrorMessage=""
                        type="checkbox"
                        children={ [
                            {
                                label: t("console:manage.features.users.usersList.metaOptions.columns.lastModified"),
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
