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
import Tab from "@oxygen-ui/react/Tab";
import Tabs from "@oxygen-ui/react/Tabs";
import Typography from "@oxygen-ui/react/Typography";
import { DropdownChild } from "@wso2is/forms";
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
    AdvancedSearchWithBasicFilters, UIConstants, getEmptyPlaceholderIllustrations } from "../../admin-core-v1";
import { BulkImportResponseOperationTypes, BulkUserImportStatus } from "../constants";
import { BulkResponseSummary, BulkUserImportOperationResponse } from "../models";

interface BulkImportResponseListProps {
    responseList: BulkUserImportOperationResponse[];
    isLoading?: boolean;
    ["data-componentid"]?: string;
    bulkResponseSummary?: BulkResponseSummary
    hasError: boolean;
    /**
     * Alert component to show the success message.
     */
    successAlert?: ReactElement;
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

    const {
        responseList,
        isLoading,
        bulkResponseSummary,
        hasError,
        successAlert,
        ["data-componentid"]: componentId
    } = props;

    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ selectedStatus, setSelectedStatus ] = useState<FilterStatus>(ALL_STATUS);
    const [ filteredResponseList, setFilteredResponseList ] = useState<BulkUserImportOperationResponse[]>([]);
    const [ responseOperationType, setResponseOperationType ] =
        useState<BulkImportResponseOperationTypes>(BulkImportResponseOperationTypes.USER_CREATION);
    const [ responseOperationTypeTab, setResponseOperationTypeTab ] = useState<number>(0);

    const { t } = useTranslation();

    const totalUserCreationCount: number =
        bulkResponseSummary.failedUserCreation + bulkResponseSummary.successUserCreation;
    const totalUserAssignmentCount: number =
        bulkResponseSummary.failedUserAssignment + bulkResponseSummary.successUserAssignment;
    const listItemLimit: number = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT;

    const statusOptions: DropdownItemProps[] = [
        { key: 0, text: "All", value: ALL_STATUS },
        {
            key: 1,
            text: t("user:modals.bulkImportUserWizard.wizardSummary.tableStatus.success"),
            value: BulkUserImportStatus.SUCCESS
        },
        {
            key: 2,
            text: t("user:modals.bulkImportUserWizard.wizardSummary.tableStatus.failed"),
            value: BulkUserImportStatus.FAILED
        }
    ];

    const bulkResponseOperationTypes: DropdownItemProps[] = [
        {
            key: 0,
            text: t("user:modals.bulkImportUserWizard.wizardSummary." +
                "responseOperationType.userCreation"),
            value: BulkImportResponseOperationTypes.USER_CREATION
        },
        {
            key: 1,
            text: t("user:modals.bulkImportUserWizard.wizardSummary." +
                "responseOperationType.roleAssignment"),
            value: BulkImportResponseOperationTypes.ROLE_ASSIGNMENT
        }
    ];

    /**
     * Set the filtered response list based on the response list.
     */
    useEffect(() => {
        filterResponseListByOperationType();
    }, [ responseList ]);

    /**
     * Set the filtered response list based on the response operation type.
     */
    useEffect(() => {
        handleSearchQueryClear();
        setSelectedStatus(ALL_STATUS);
        filterResponseListByOperationType();
    }, [ responseOperationType ]);

    /**
     * Filter the response list based on the response operation type.
     */
    const filterResponseListByOperationType = () => {
        const filteredResponse: BulkUserImportOperationResponse[] =
            responseList.filter((response: BulkUserImportOperationResponse) => {

                return response.operationType === responseOperationType;
            });

        setFilteredResponseList(filteredResponse);
    };

    /**
     * Resolves data table columns.
     *
     * @returns Table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        const defaultColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "resourceIdentifier",
                id: "resourceIdentifier",
                key: "resourceIdentifier",
                render: (response: BulkUserImportOperationResponse): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${componentId}-username-item-heading` }>
                            <Header.Content>
                                {
                                    response.resourceIdentifier
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("user:modals.bulkImportUserWizard.wizardSummary.tableHeaders.username")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: "status",
                render: (response: BulkUserImportOperationResponse): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${componentId}-status-item-heading` } >
                            <Header.Content>
                                <Label
                                    data-componentid={ `${componentId}-bulk-label` }
                                    content={ response.status }
                                    size="small"
                                    color={ response.statusCode === BulkUserImportStatus.SUCCESS ? "green" : "red" }
                                    className={ "group-label" }
                                />
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("user:modals.bulkImportUserWizard.wizardSummary.tableHeaders.status")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "message",
                id: "message",
                key: "message",
                render: (response: BulkUserImportOperationResponse): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${componentId}-status-item-heading` }>
                            <Header.Content>
                                { response.message }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("user:modals.bulkImportUserWizard.wizardSummary.tableHeaders.message")
            }
        ];

        return defaultColumns;
    };

    /**
     * Filters the response list based on the search query and the selected status.
     */
    const filterBulkUsersResponseList = () => {
        let filteredList: BulkUserImportOperationResponse[] = responseList?.filter(
            (response: BulkUserImportOperationResponse) => {
                return response?.operationType === responseOperationType;
            });

        if (searchQuery && searchQuery !== "") {
            const [ , condition, value ] = searchQuery.split(" ");

            filteredList = filteredList.filter((item: BulkUserImportOperationResponse) => {
                if (
                    selectedStatus !== ALL_STATUS
                    && item.statusCode !== selectedStatus
                ) return false;

                switch (condition) {
                    case "sw":
                        return item.resourceIdentifier?.startsWith(value);
                    case "ew":
                        return item.resourceIdentifier?.endsWith(value);
                    case "co":
                        return item.resourceIdentifier?.includes(value);
                    case "eq":
                        return item.resourceIdentifier === value;
                    default:
                        return false;
                }
            });
        }

        if (selectedStatus !== ALL_STATUS) {
            filteredList = filteredList.filter((item: BulkUserImportOperationResponse) => {
                return item.statusCode === selectedStatus && item.operationType === responseOperationType;
            });
        }

        setFilteredResponseList(filteredList);
    };

    useEffect(() => {
        filterBulkUsersResponseList();
    }, [ searchQuery, selectedStatus ]);

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    };

    const handleUserFilter = (query: string) => {
        setSearchQuery(query);
        if (!query) {
            filterResponseListByOperationType();
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
                data-testid={ `${componentId}-empty-search-result` }
                data-componentid={ `${componentId}-empty-search-result` }
                action={ !searchQuery
                    ? null
                    : (
                        <LinkButton onClick={ handleSearchQueryClear }>
                            { t("users:usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                image={ getEmptyPlaceholderIllustrations().emptySearch }
                imageSize="tiny"
                title={ t("users:usersList.search.emptyResultPlaceholder.title") }
                subtitle={ [
                    t("users:usersList.search.emptyResultPlaceholder.subTitle.0",
                        { query: !searchQuery ? selectedStatus : searchQuery }),
                    t("users:usersList.search.emptyResultPlaceholder.subTitle.1")
                ] }
            />
        );
    };

    /**
     * Handles the flow mode switch.
     *
     * @param _ - Event.
     * @param newTabIndex - New tab index.
     */
    const handleTabChange = (_: React.SyntheticEvent, newTabIndex: number): void => {
        const item: DropdownItemProps = bulkResponseOperationTypes.find((item: DropdownItemProps) =>
            item.key === newTabIndex);

        if (item) {
            setResponseOperationType(item.value as BulkImportResponseOperationTypes);
            setResponseOperationTypeTab(newTabIndex);
        }
    };

    /**
     * Render user creation and user assignment operation type selection.
     */
    const resolveBulkResponseOperationTypeSelection = (): ReactElement => {
        return(
            <Tabs
                value={ responseOperationTypeTab }
                onChange={ handleTabChange }
                component-id={ `${componentId}-operation-type-tab` }
            >
                { bulkResponseOperationTypes.map((item: DropdownItemProps) => (
                    <Tab
                        key={ item.key }
                        label={ (
                            <div className="beta-feature-tab-item">
                                <Typography sx={ { fontWeight: 500 } }>{ item.text }</Typography>
                            </div>
                        ) }
                        data-componentid={ `${componentId}-${ item.value }-tab` }
                    />
                )) }
            </Tabs>
        );
    };

    const isResponseStatusFilterDisabled = (): boolean => {
        const isUserCreation: boolean = responseOperationType === BulkImportResponseOperationTypes.USER_CREATION;
        const isRoleAssignment: boolean = responseOperationType === BulkImportResponseOperationTypes.ROLE_ASSIGNMENT;

        const noFailedOrSuccessfulUserCreation: boolean =
            (bulkResponseSummary.failedUserCreation === 0 || bulkResponseSummary.successUserCreation === 0);
        const noFailedOrSuccessfulUserAssignment: boolean =
            (bulkResponseSummary.failedUserAssignment === 0 || bulkResponseSummary.successUserAssignment === 0);

        return (isUserCreation && noFailedOrSuccessfulUserCreation) ||
            (isRoleAssignment && noFailedOrSuccessfulUserAssignment);
    };

    const advanceSearchFilterOptions: DropdownChild[] =
        responseOperationType === BulkImportResponseOperationTypes.USER_CREATION
            ? [
                {
                    key: 0,
                    text: t("users:advancedSearch.form.dropdown." +
                    "filterAttributeOptions.username"),
                    value: "userName"
                }
            ]
            : [
                {
                    key: 1,
                    text:  t("user:modals.bulkImportUserWizard." +
                    "wizardSummary.advanceSearch.roleGroupFilterAttributePlaceHolder"),
                    value: "roleName"
                }
            ];

    return (
        <>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    {
                        isLoading || hasError
                            ? null
                            : bulkResponseSummary.failedUserCreation === 0 &&
                                bulkResponseSummary.failedUserAssignment === 0
                                ? (
                                    successAlert ?? (
                                        <Alert severity="success" data-componentid={ `${componentId}-success-alert` }>
                                            <AlertTitle data-componentid={ `${componentId}-success-alert-title` }>
                                                {
                                                    t("user:modals.bulkImportUserWizard." +
                                            "wizardSummary.alerts.importSuccess.message")
                                                }
                                            </AlertTitle>
                                            {
                                                t("user:modals.bulkImportUserWizard." +
                                            "wizardSummary.alerts.importSuccess.description")
                                            }
                                        </Alert>
                                    )
                                ) : (
                                    <Alert severity="error" data-componentid={ `${componentId}-error-alert` }>
                                        <AlertTitle data-componentid={ `${componentId}-error-alert-title` }>
                                            {
                                                t("user:modals.bulkImportUserWizard." +
                                                "wizardSummary.alerts.importFailed.message")
                                            }
                                        </AlertTitle>
                                        {
                                            bulkResponseSummary.failedUserCreation !== 0 &&
                                            (
                                                <li>
                                                    <Trans
                                                        i18nKey={
                                                            "user:modals." +
                                                            "bulkImportUserWizard.wizardSummary.alerts.importFailed." +
                                                            "userCreation"
                                                        }
                                                        tOptions={ {
                                                            failedUserCreationCount:
                                                                bulkResponseSummary.failedUserCreation
                                                        } }
                                                    >
                                                        Issues encountered in
                                                        <b>{ bulkResponseSummary.failedUserCreation } user
                                                        creations</b>.
                                                    </Trans>
                                                </li>
                                            )
                                        }
                                        {
                                            bulkResponseSummary.failedUserAssignment !== 0 &&
                                            (
                                                <li>
                                                    <Trans
                                                        i18nKey={
                                                            "user:modals." +
                                                            "bulkImportUserWizard.wizardSummary.alerts.importFailed." +
                                                            "groupAssignment"
                                                        }
                                                        tOptions={ {
                                                            failedUserAssignmentCount:
                                                            bulkResponseSummary.failedUserAssignment
                                                        } }
                                                    >
                                                        Issues encountered in
                                                        <b>{ bulkResponseSummary.failedUserAssignment } group
                                                        assignments</b>. Users in the affected groups were created
                                                        but not assigned. Please navigate to User Management section
                                                        to review  and assign groups to the users.
                                                    </Trans>
                                                </li>
                                            )
                                        }
                                    </Alert>
                                )
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    { resolveBulkResponseOperationTypeSelection() }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <ListLayout
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleUserFilter }
                                filterAttributeOptions={ advanceSearchFilterOptions }
                                filterAttributePlaceholder={
                                    responseOperationType === BulkImportResponseOperationTypes.USER_CREATION
                                        ? t("users:advancedSearch.form.dropdown." +
                                            "filterAttributeOptions.username")
                                        : t("user:modals.bulkImportUserWizard." +
                                            "wizardSummary.advanceSearch.roleGroupFilterAttributePlaceHolder")
                                }
                                filterConditionsPlaceholder={
                                    t("users:advancedSearch.form.inputs.filterCondition" +
                                    ".placeholder")
                                }
                                filterValuePlaceholder={
                                    t("users:advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                                }
                                placeholder={
                                    responseOperationType === BulkImportResponseOperationTypes.USER_CREATION
                                        ? t("user:modals.bulkImportUserWizard." +
                                            "wizardSummary.advanceSearch.searchByUsername")
                                        : t("user:modals.bulkImportUserWizard." +
                                            "wizardSummary.advanceSearch.searchByGroup")
                                }
                                defaultSearchAttribute="resourceName"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${componentId}-advanced-search` }
                                data-componentid={ `${componentId}-advanced-search` }
                            />
                        ) }
                        rightActionPanel={
                            (
                                <>
                                    <Dropdown
                                        data-testid={ `${componentId}-filter-status-dropdown` }
                                        data-componentid={ `${componentId}-filter-status-dropdown` }
                                        selection
                                        options={ statusOptions }
                                        onChange={ handleStatusDropdownChange }
                                        value={ selectedStatus }
                                        disabled={ isResponseStatusFilterDisabled() }
                                    />
                                </>
                            )
                        }
                        showPagination={ false }
                        showTopActionPanel={ true }
                        totalPages={ Math.ceil(totalUserCreationCount / listItemLimit) }
                        totalListSize={ totalUserCreationCount }
                        isLoading={ isLoading }
                        listItemLimit={ UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT }
                        data-testid={ `${componentId}-list-layout` }
                        data-componentid={ `${componentId}-list-layout` }
                        onPageChange={ () => null }
                        disableRightActionPanel={ false }
                    >
                        <Typography variant="body2" style={ { textAlign: "right" } }>
                            {
                                responseOperationType === BulkImportResponseOperationTypes.USER_CREATION
                                    ? (
                                        t("user:modals.bulkImportUserWizard.wizardSummary." +
                                        "totalUserCreationCount") + " : " + totalUserCreationCount
                                    )
                                    : (
                                        t("user:modals.bulkImportUserWizard.wizardSummary." +
                                        "totalUserAssignmentCount") + " : " + totalUserAssignmentCount
                                    )
                            }
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
                            data-testid={ `${componentId}-data-table` }
                            data-componentid={ `${componentId}-data-table` }
                            loadingStateOptions={ {
                                count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                                imageType: "circular"
                            } }
                        />
                    </ListLayout>
                </Grid.Column>
            </Grid.Row>
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
