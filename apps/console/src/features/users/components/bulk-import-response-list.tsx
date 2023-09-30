/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import {
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    TableColumnInterface,
    UserAvatar
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Header, Label } from "semantic-ui-react";
import {
    UIConstants,
    getEmptyPlaceholderIllustrations } from "../../core";
import { BulkUserImportOperationResponse } from "../models";

interface BulkImportResponseListProps {
    responseList: BulkUserImportOperationResponse[];
    isLoading?: boolean;
    ["data-testid"]?: string;
}

/**
 * Users info page.
 *
 * @param props - Props injected to the component.
 * @returns Users list component.
 */
export const BulkImportResponseList: React.FunctionComponent<BulkImportResponseListProps> = (
    props: BulkImportResponseListProps
): ReactElement => {
    const { responseList, isLoading, ["data-testid"]: testId } = props;

    const { t } = useTranslation();

    /**
     * Resolves data table columns.
     *
     * @returns Table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        const defaultColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "username",
                id: "username",
                key: "username",
                render: (response: BulkUserImportOperationResponse): ReactNode => {
                    return (
                        <Header image as="h6" className="header-with-icon" data-testid={ `${testId}-item-heading` }>
                            <UserAvatar
                                data-testid="users-list-item-image"
                                name={ response.username }
                                size="mini"
                                image={ "" }
                                spaced="right"
                            />
                            <Header.Content>
                                {
                                    // <Header.Subheader data-testid={ `${testId}-item-sub-heading` }>
                                    response.username
                                    // </Header.Subheader>
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                // title: t("console:manage.features.users.list.columns.name")
                title: "Username"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: "status",
                render: (response: BulkUserImportOperationResponse): ReactNode => {
                    return (
                        <Header as="h6" data-testid={ `${testId}-item-heading` }>
                            <Header.Content>
                                <Label
                                    data-testid={ `${testId}-bulk-label` }
                                    content={ response.status }
                                    size="mini"
                                    color={ response.status === "Success" ? "green" : "yellow" }
                                    className={ "group-label" }
                                />
                            </Header.Content>
                        </Header>
                    );
                },
                // title: t("console:manage.features.users.list.columns.name")
                title: "Status"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "message",
                id: "message",
                key: "message",
                render: (response: BulkUserImportOperationResponse): ReactNode => {
                    return (
                        <Header as="h6" data-testid={ `${testId}-item-heading` }>
                            <Header.Content>
                                { /* <div className={ isNameAvailable ? "mt-2" : "" }>{ header as ReactNode }</div> */ }
                                { response.message }
                            </Header.Content>
                        </Header>
                    );
                },
                // title: t("console:manage.features.users.list.columns.name")
                title: "Message"
            }
        ];

        return defaultColumns;
    };

    /**
     * Shows list placeholders. TODO: Change messages.
     *
     * @returns Placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        if (!isLoading && responseList?.length === 0)
            return (
                <EmptyPlaceholder
                    action={
                        (<LinkButton onClick={ () => null }>
                            { t("console:manage.features.users.usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>)
                    }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.features.users.usersList.search.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.0", {
                            query: "searchQuery"
                        }),
                        t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.1")
                    ] }
                />
            );

        return null;
    };

    return (
        <>
            <DataTable<BulkUserImportOperationResponse>
                className="addon-field-wrapper"
                isLoading={ isLoading }
                actions={ [] }
                columns={ resolveTableColumns() }
                data={ responseList }
                onColumnSelectionChange={ () => null }
                onRowClick={ () => null }
                placeholders={ showPlaceholders() }
                selectable={ false }
                showHeader={ true }
                transparent={ !isLoading && showPlaceholders() !== null }
                data-testid={ testId }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
            />
        </>
    );
};

/**
 * Default props for the component.
 */
BulkImportResponseList.defaultProps = {
    isLoading: false,
    responseList: []
};
