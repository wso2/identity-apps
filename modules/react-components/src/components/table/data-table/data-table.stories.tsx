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
 *
 */

import { action } from "@storybook/addon-actions";
import cloneDeep from "lodash-es/cloneDeep";
import orderBy from "lodash-es/orderBy";
import React, { ReactElement, SyntheticEvent, useState } from "react";
import { Divider, Form, Grid, Header, Label, SemanticICONS } from "semantic-ui-react";
import { DataTable, DataTableSortOrder, TableColumnInterface } from "./data-table";
import { DEMO_DATA_LIST, DataTableDemoDataInterface, meta } from "./data-table.stories.meta";
import { AppAvatar } from "../../avatar";
import { LinkButton, PrimaryButton } from "../../button";
import { AdvancedSearch } from "../../input";

export default {
    parameters: {
        component: DataTable,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Data Table"
};

/**
 * Story to display the basic usage of a Data Table.
 *
 * @return {React.ReactElement}
 */
export const BasicUsage = (): ReactElement => (
    <DataTable
        padded
        actions={ [
            {
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, item: DataTableDemoDataInterface): void => {
                    action(`Clicked on ${ item.name }`);
                },
                popupText: (): string => "edit",
                renderer: "semantic-icon"
            },
            {
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, item: DataTableDemoDataInterface): void => {
                    action(`Clicked on delete of ${ item.name }`);
                },
                popupText: (): string => "delete",
                renderer: "semantic-icon"
            }
        ] }
        data={ DEMO_DATA_LIST }
        columns={ [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: 0,
                render: (item) => (
                    <Header as="h6" image>
                        <AppAvatar
                            name={ item.name }
                            image={ item.imageUrl }
                            size="mini"
                        />
                        <Header.Content>
                            { item.name }
                            <Header.Subheader>{ item.description }</Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: "Name"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "clientId",
                id: "clientId",
                key: 1,
                render: (item) => (
                    <Label>{ item.clientId }</Label>
                ),
                title: "Client ID"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: 2,
                title: "Actions"
            }
        ] }
        onRowClick={
            (e: SyntheticEvent, item: DataTableDemoDataInterface): void => {
                action(`Clicked on the row of ${ item.name }`);
            }
        }
    />
);

BasicUsage.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display the usage of a Data Table with an operations bar present.
 *
 * @return {React.ReactElement}
 */
export const WithOperationsBar = (): ReactElement => (
    <DataTable
        padded
        showSearch
        showOperationsHeader
        showColumnSelector
        showToggleDisallowedColumns
        actions={ [
            {
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, item: DataTableDemoDataInterface): void => {
                    action(`Clicked on ${ item.name }`);
                },
                popupText: (): string => "edit",
                renderer: "semantic-icon"
            },
            {
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, item: DataTableDemoDataInterface): void => {
                    action(`Clicked on delete of ${ item.name }`);
                },
                popupText: (): string => "delete",
                renderer: "semantic-icon"
            }
        ] }
        data={ DEMO_DATA_LIST }
        externalSearch={ (
            <AdvancedSearch
                aligned="left"
                dropdownPosition="bottom left"
                fill="white"
                defaultSearchStrategy={ "name co" }
                onSearchQuerySubmit={ (processQuery: boolean, query: string) =>
                    action(`Processing search query ${ query }`)
                }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <Form style={ { minWidth: "420px" } }>
                                <Form.Select
                                    fluid
                                    label="Filter Attribute"
                                    options={ [
                                        {
                                            key: "name",
                                            text: "Name",
                                            value: "name"
                                        },
                                        {
                                            key: "description",
                                            text: "Description",
                                            value: "description"
                                        },
                                        {
                                            key: "clientId",
                                            text: "Client ID",
                                            value: "clientId"
                                        }
                                    ] }
                                    placeholder="E.g. Name, Description etc."
                                />
                                <Form.Group widths="equal">
                                    <Form.Select
                                        fluid
                                        label="Filter Condition"
                                        options={ [
                                            {
                                                key: "sw",
                                                text: "Starts With",
                                                value: "sw"
                                            },
                                            {
                                                key: "ew",
                                                text: "Ends With",
                                                value: "ew"
                                            },
                                            {
                                                key: "co",
                                                text: "Contains",
                                                value: "co"
                                            },
                                            {
                                                key: "eq",
                                                text: "Equals",
                                                value: "eq"
                                            }
                                        ] }
                                        placeholder="E.g. Starts With etc."
                                    />
                                    <Form.Input label="Filter Value" placeholder="E.g. Zoom, Salesforce etc."/>
                                </Form.Group>
                                <Divider hidden/>
                                <Form.Group inline>
                                    <PrimaryButton size="small" type="submit">
                                        Search
                                    </PrimaryButton>
                                    <LinkButton size="small" type="reset">
                                        Reset Filters
                                    </LinkButton>
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </AdvancedSearch>
        ) }
        columns={ [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: 0,
                render: (item) => (
                    <Header as="h6" image>
                        <AppAvatar
                            name={ item.name }
                            image={ item.imageUrl }
                            size="mini"
                        />
                        <Header.Content>
                            { item.name }
                            <Header.Subheader>{ item.description }</Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: "Name"
            },
            {
                allowToggleVisibility: true,
                dataIndex: "clientId",
                id: "clientId",
                key: 1,
                render: (item) => (
                    <Label>{ item.clientId }</Label>
                ),
                title: "Client ID"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: 2,
                title: "Actions"
            }
        ] }
        onRowClick={
            (e: SyntheticEvent, item: DataTableDemoDataInterface): void => {
                action(`Clicked on the row of ${ item.name }`);
            }
        }
    />
);

WithOperationsBar.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display a sortable Data Table.
 *
 * @return {React.ReactElement}
 */
export const Sortable = (): ReactElement => {

    const [ list, setList ] = useState<DataTableDemoDataInterface[]>(DEMO_DATA_LIST);

    const handleListSorting = (order: DataTableSortOrder, column: TableColumnInterface) => {
        const orderedList: DataTableDemoDataInterface[] = orderBy(cloneDeep(list), [ column.dataIndex ],
            [ order === "ascending" ? "asc" : "desc" ]);
        
        setList(orderedList);
    };

    return (
        <DataTable
            padded
            actions={ [
                {
                    icon: (): SemanticICONS => "pencil alternate",
                    onClick: (e: SyntheticEvent, item: DataTableDemoDataInterface): void => {
                        action(`Clicked on ${ item.name }`);
                    },
                    popupText: (): string => "edit",
                    renderer: "semantic-icon"
                },
                {
                    icon: (): SemanticICONS => "trash alternate",
                    onClick: (e: SyntheticEvent, item: DataTableDemoDataInterface): void => {
                        action(`Clicked on delete of ${ item.name }`);
                    },
                    popupText: (): string => "delete",
                    renderer: "semantic-icon"
                }
            ] }
            data={ list }
            columns={ [
                {
                    allowToggleVisibility: false,
                    dataIndex: "name",
                    getSortOrder: handleListSorting,
                    id: "name",
                    key: 0,
                    render: (item) => (
                        <Header as="h6" image>
                            <AppAvatar
                                name={ item.name }
                                image={ item.imageUrl }
                                size="mini"
                            />
                            <Header.Content>
                                { item.name }
                                <Header.Subheader>{ item.description }</Header.Subheader>
                            </Header.Content>
                        </Header>
                    ),
                    sortOrder: "ascending",
                    sortable: true,
                    title: "Name"
                },
                {
                    allowToggleVisibility: false,
                    dataIndex: "clientId",
                    getSortOrder: handleListSorting,
                    id: "clientId",
                    key: 1,
                    render: (item) => (
                        <Label>{ item.clientId }</Label>
                    ),
                    sortable: true,
                    title: "Client ID"
                },
                {
                    allowToggleVisibility: false,
                    dataIndex: "action",
                    id: "actions",
                    key: 2,
                    title: "Actions"
                }
            ] }
            onRowClick={
                (e: SyntheticEvent, item: DataTableDemoDataInterface): void => {
                    action(`Clicked on the row of ${ item.name }`);
                }
            }
        />
    );
};

Sortable.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};
