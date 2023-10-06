/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertTitle } from "@mui/material";
import Alert from "@oxygen-ui/react/Alert";
import Typography from "@oxygen-ui/react/Typography";
import {
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    ListLayout,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Grid,
    Header,
    Label
} from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters, UIConstants, getEmptyPlaceholderIllustrations } from "../../core";
import { BulkUserImportStatus } from "../constants";
import { BulkResponseSummary, BulkUserImportOperationResponse } from "../models";

interface BulkImportResponseListProps {
    responseList: BulkUserImportOperationResponse[];
    isLoading?: boolean;
    ["data-componentid"]?: string;
    bulkResponseSummary?: BulkResponseSummary
}

const ALL_STATUS: string = "ALL";

type FilterStatus = BulkUserImportStatus | typeof ALL_STATUS;

/**
 * Users info page.
 *
 * @param props - Props injected to the component.
 * @returns Users list component.
 */
export const BulkImportResponseList: React.FunctionComponent<BulkImportResponseListProps> = (
    props: BulkImportResponseListProps
): ReactElement => {

    const { responseList, isLoading, ["data-componentid"]: testId, bulkResponseSummary } = props;
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ selectedStatus, setSelectedStatus ] = useState<FilterStatus>(ALL_STATUS);
    const [ filteredResponseList, setFilteredResponseList ] = useState<BulkUserImportOperationResponse[]>([]);
    
    const { t } = useTranslation();
    const totalCount: number = bulkResponseSummary.failedCount + bulkResponseSummary.successCount;
    const listItemLimit: number = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT;
    
    const statusOptions: DropdownItemProps[] = [
        { key: 1, text: "All", value: ALL_STATUS },
        {
            key: 2,
            text: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableStatus.success"),
            value: BulkUserImportStatus.SUCCESS
        },
        {
            key: 3,
            text: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableStatus.failed"),
            value: BulkUserImportStatus.FAILED
        }
    ];

    useEffect(() => {
        setFilteredResponseList(responseList);
    }, [ responseList ]);

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
                        <Header image as="h6" data-componentid={ `${testId}-username-item-heading` }>
                            <Header.Content>
                                {
                                    response.username
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableHeaders.username")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: "status",
                render: (response: BulkUserImportOperationResponse): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${testId}--status-item-heading` } >
                            <Header.Content>
                                <Label
                                    data-componentid={ `${testId}-bulk-label` }
                                    content={ response.status }
                                    size="small"
                                    color={ response.statusCode === BulkUserImportStatus.SUCCESS ? "green" : "red" }
                                    className={ "group-label" }
                                />
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableHeaders.status")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "message",
                id: "message",
                key: "message",
                render: (response: BulkUserImportOperationResponse): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${testId}-status-item-heading` }>
                            <Header.Content>
                                { response.message }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableHeaders.message")
            }
        ];

        return defaultColumns;
    };
    
    /**
     * Filters the response list based on the search query and the selected status.
     */
    const filterResponseList = () => {
        let filteredList: BulkUserImportOperationResponse[] = responseList;

        if (searchQuery && searchQuery !== "") {
            const [ _, condition, value ] = searchQuery.split(" ");
            
            filteredList = filteredList.filter((item: BulkUserImportOperationResponse) => {
                if (selectedStatus !== ALL_STATUS && item.statusCode !== selectedStatus) return false;

                switch (condition) {
                    case "sw":
                        return item.username?.startsWith(value);
                    case "ew":
                        return item.username?.endsWith(value);
                    case "co":
                        return item.username?.includes(value);
                    case "eq":
                        return item.username === value;
                    default:
                        return false;
                }
            });
        }

        if (selectedStatus !== ALL_STATUS) {
            filteredList = filteredList.filter((item: BulkUserImportOperationResponse) => {
                return item.statusCode === selectedStatus;
            });
        }

        setFilteredResponseList(filteredList);
    };

    useEffect(() => {
        filterResponseList();
    }, [ searchQuery, selectedStatus ]);

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredResponseList(responseList);
    };

    const handleUserFilter = (query: string) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredResponseList(responseList);
        }
    };

    const handleStatusDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        const newStatus: FilterStatus = data.value as FilterStatus;
        
        setSelectedStatus(newStatus);
        setTriggerClearQuery(!triggerClearQuery);
    };

    /**
     * Shows list placeholders.
     *
     * @returns Placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        return (
            <EmptyPlaceholder
                data-testid={ `${testId}-bulk-user-empty-search-result` }
                data-componentid={ `${testId}-bulk-user-empty-search-result` }
                action={ !searchQuery ? null : (
                    <LinkButton onClick={ handleSearchQueryClear }>
                        { t("console:manage.features.users.usersList.search.emptyResultPlaceholder.clearButton") }
                    </LinkButton>
                ) }
                image={ getEmptyPlaceholderIllustrations().emptySearch }
                imageSize="tiny"
                title={ t("console:manage.features.users.usersList.search.emptyResultPlaceholder.title") }
                subtitle={ [
                    t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.0",
                        { query: !searchQuery ? selectedStatus : searchQuery }),
                    t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.1")
                ] }
            />
        );
    };

    return (
        <>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        {
                            isLoading ? null :
                                bulkResponseSummary.failedCount === 0 ?
                                    (<Alert severity="success">
                                        <AlertTitle>
                                            {
                                                t("console:manage.features.user.modals.bulkImportUserWizard." +
                                            "wizardSummary.alerts.importSuccess.message")
                                            }
                                        </AlertTitle>
                                        {
                                            t("console:manage.features.user.modals.bulkImportUserWizard." +
                                            "wizardSummary.alerts.importSuccess.description")
                                        }
                                    </Alert>)
                                    :  
                                    (<Alert severity="error">
                                        <AlertTitle>
                                            {
                                                t("console:manage.features.user.modals.bulkImportUserWizard." +
                                            "wizardSummary.alerts.importFailed.message")
                                            }
                                        </AlertTitle>
                                        <Trans
                                            i18nKey={
                                                "console:manage.features.user.modals.bulkImportUserWizard." +
                                                "wizardSummary.alerts.importFailed.description"
                                            }
                                            tOptions={ {
                                                failedCount: bulkResponseSummary.failedCount
                                            } }
                                        >
                                            Issues encountered in <b>count import(s)</b>.
                                        </Trans>
                                    </Alert>)
                        }
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <ListLayout
                            advancedSearch={ (
                                <AdvancedSearchWithBasicFilters
                                    onFilter={ handleUserFilter }
                                    filterAttributeOptions={ [
                                        {
                                            key: 0,
                                            text: t("console:manage.features.users.advancedSearch.form.dropdown." +
                                                "filterAttributeOptions.username"),
                                            value: "userName"
                                        } ] }
                                    filterAttributePlaceholder={
                                        t("console:manage.features.users.advancedSearch.form.inputs.filterAttribute" +
                                            ".placeholder")
                                    }
                                    filterConditionsPlaceholder={
                                        t("console:manage.features.users.advancedSearch.form.inputs.filterCondition" +
                                            ".placeholder")
                                    }
                                    filterValuePlaceholder={
                                        t("console:manage.features.users.advancedSearch.form.inputs.filterValue" +
                                            ".placeholder")
                                    }
                                    placeholder={ t("console:manage.features.user.modals.bulkImportUserWizard." +
                                    "wizardSummary.advanceSearch.placeholder") }
                                    defaultSearchAttribute="userName"
                                    defaultSearchOperator="co"
                                    triggerClearQuery={ triggerClearQuery }
                                />
                            ) }
                            rightActionPanel={
                                (
                                    <>
                                        <Dropdown
                                            data-testid="bulk-user-list-status-dropdown"
                                            data-componentid="bulk-user-list-status-dropdown"
                                            selection
                                            options={ statusOptions }
                                            onChange={ handleStatusDropdownChange }
                                            defaultValue={ ALL_STATUS }
                                        />
                                    </>
                                )
                            }
                            showPagination={ false }
                            showTopActionPanel={ true }
                            totalPages={ Math.ceil(totalCount / listItemLimit) }
                            totalListSize={ totalCount }
                            isLoading={ isLoading }
                            listItemLimit={ UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT }
                            data-testid="bulk-user-list-layout"
                            data-componentid="bulk-user-list-layout"
                            onPageChange={ () => null }
                            disableRightActionPanel={ false }
                        >
                            <Typography variant="body2" style={ { textAlign: "right" } }>
                                { t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary." +
                            "totalCount") } : { totalCount }
                            </Typography>
                            <DataTable<BulkUserImportOperationResponse>
                                className="addon-field-wrapper"
                                isLoading={ isLoading }
                                actions={ [] }
                                columns={ resolveTableColumns() }
                                data={ filteredResponseList }
                                onColumnSelectionChange={ () => null }
                                onRowClick={ () => null }
                                placeholders={ showPlaceholders() }
                                transparent={ true }
                                selectable={ false }
                                showHeader={ false }
                                data-testid="bulk-user-list-data-table"
                                data-componentid="bulk-user-list-data-table"
                                loadingStateOptions={ {
                                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                                    imageType: "circular"
                                }
                                }
                            />
                        </ListLayout>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
