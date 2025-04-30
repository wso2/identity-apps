/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import {
    DataTable,
    ListLayout,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { Trans, useTranslation } from "react-i18next";
import {
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Grid,
    Header,
    Label,
    Icon
} from "semantic-ui-react";
import { ApplicationShareUnitStatusResponse, ShareApplicationStatusResponseSummary } from "../models/application";
import { ApplicationShareStatus } from "../constants/application-management";
import "./share-application-status-response-list.scss";

interface ShareApplicationStatusResponseListProps {
    responseList: ApplicationShareUnitStatusResponse[];
    isLoading?: boolean;
    ["data-componentid"]?: string;
    shareApplicationSummary?: ShareApplicationStatusResponseSummary;
    hasError: boolean;
    /**
     * Alert component to show the success message.
     */
    successAlert?: ReactElement;
}

/**
 * Application Share status page.
 * 
 * @param props - Props injected to the component.
 * @return Application share status result.
 */
export const ShareApplicationStatusResponseList: React.FunctionComponent<ShareApplicationStatusResponseListProps> = (
    props: ShareApplicationStatusResponseListProps
): ReactElement => {

    const {
        responseList,
        isLoading,
        shareApplicationSummary,
        hasError,
        successAlert,
        ["data-componentid"]: componentId
    } = props;

    const [ filteredResponseList, setFilteredResponseList ] = useState<ApplicationShareUnitStatusResponse[]>(responseList);
    const [ selectedStatus, setSelectedStatus ] = useState<ApplicationShareStatus>(ApplicationShareStatus.FAIL);
    const [ successShareCount, setSuccessShareCount ] = useState<number>();
    const [ failedShareCount, setfailedShareCount ] = useState<number>();
    
    const statusOptions: DropdownItemProps[] = [
        { key: 0, text: "All", value: ApplicationShareStatus.ALL },
        {
            key: 1,
            text: "SUCCESS",
            value: ApplicationShareStatus.SUCCESS
        },
        {
            key: 2,
            text: "FAIL",
            value: ApplicationShareStatus.FAIL
        }
    ];

    const handleStatusDropdownChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const newStatus = data.value as ApplicationShareStatus;
        setSelectedStatus(newStatus);
    };

    const OrgIdDisplay = ({ id }: { id: string }) => {
        const [ isHovered, setIsHovered ] = useState(false);
        const [ isCopied, setIsCopied ] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(id);
            setIsCopied(true);

            setTimeout(() => setIsCopied(false), 1000);
        };

        return (
            <div
                className="org-id-wrapper"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsCopied(false);
                }}
            >
                <span className="ellipsis-text" title={id}>
                    {id}
                </span>
                <span className="copy-icon-container">
                    <Icon
                        name={isCopied ? "copy" : "copy outline"}
                        title={isCopied ? "Copied!" : "Copy"}
                        className={`copy-icon ${isHovered ? "visible" : ""}`}
                        onClick={handleCopy}
                    />
                </span>
            </div>
        );
    };

    const resolveTableColumns = (): TableColumnInterface[] => {

        const defaultColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "targetOrgId",
                id: "targetOrgId",
                key: "targetOrgId",
                render: (response: ApplicationShareUnitStatusResponse): ReactNode => {
                    return (
                        <Header className="share-application-status-response-list-header" data-componentid={ `${componentId}-application-item-heading` }>
                            <Header.Subheader className="share-application-status-response-list-org-handler">
                                {response.targetOrgName}
                            </Header.Subheader>
                            <Header.Content className="share-application-status-response-list-org-id">
                                <OrgIdDisplay id={response.targetOrgId} />
                            </Header.Content>
                        </Header>
                    );
                },
                title: "title"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: "status",
                render: (response: ApplicationShareUnitStatusResponse): ReactNode => {
                    return (
                        <Header className="share-application-status-response-list-status-icon" as="h6" data-componentid={ `${componentId}-status-item-heading` } >
                            <Header.Content>
                                <Icon
                                    name="circle"
                                    color={response.status === ApplicationShareStatus.SUCCESS ? "green" : "red"}
                                    size="small"
                                    data-componentid={ `${componentId}-status-icon` }
                                />
                            </Header.Content>
                        </Header>
                    );
                },
                title: "title:status"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "statusMessage",
                id: "statusMessage",
                key: "statusMessage",
                render: (response: ApplicationShareUnitStatusResponse): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${componentId}-status-item-heading` }>
                            <Header.Content>
                                { response.status === "SUCCESS"
                                    ? "Application shared successfully."
                                    : response.statusMessage }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "title:statusMessage"
            }
        ];

        return defaultColumns;
    };

    

    useEffect(() => {
        if (selectedStatus === ApplicationShareStatus.ALL) {
            setFilteredResponseList(responseList);
        } else {
            const filtered = responseList.filter(
                (response) => response.status === selectedStatus
            );
            setFilteredResponseList(filtered);
        }
        const successCount = responseList.filter(
            (item) => item.status === ApplicationShareStatus.SUCCESS
        ).length;
    
        const failedCount = responseList.filter(
            (item) => item.status === ApplicationShareStatus.FAIL
        ).length;
    
        setSuccessShareCount(successCount);
        setfailedShareCount(failedCount);

    }, [selectedStatus, responseList]);

    return (
        <>
            <Grid.Row columns={2} verticalAlign="middle">
                <Grid.Column width={8}>
                    {successShareCount} success | {failedShareCount} failed
                </Grid.Column>

                <Grid.Column width={8} textAlign="right">
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        <Dropdown
                            data-testid={`${componentId}-filter-status-dropdown`}
                            data-componentid={`${componentId}-filter-status-dropdown`}
                            selection
                            options={statusOptions}
                            onChange={handleStatusDropdownChange}
                            value={selectedStatus}
                            style={{ marginRight: "1rem" }}
                        />
                        {/* <Button onClick={() => console.log("Button clicked")}>
                            Download
                        </Button> */}
                    </div>
                </Grid.Column>
            </Grid.Row>


            
            <ListLayout
                showPagination={false}
                showTopActionPanel={false}
                totalPages={200}
                isLoading={isLoading}
                // listItemLimit={UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT}
                listItemLimit={5}
                data-testid={`${componentId}-list-layout`}
                data-componentid={`${componentId}-list-layout`}
                onPageChange={() => null}
                disableRightActionPanel={false}
            >
                <DataTable<ApplicationShareUnitStatusResponse>
                    className="addon-field-wrapper"
                    isLoading={isLoading}
                    actions={[]}
                    columns={resolveTableColumns()}
                    data={filteredResponseList}
                    onColumnSelectionChange={() => null}
                    onRowClick={() => null}
                    // placeholders={showPlaceholders()}
                    transparent={true}
                    selectable={false}
                    showHeader={false}
                    data-testid={`${componentId}-data-table`}
                    data-componentid={`${componentId}-data-table`}
                    loadingStateOptions={{
                        count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                        imageType: "circular"
                    }}
                />
            </ListLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
ShareApplicationStatusResponseList.defaultProps = {
    isLoading: false,
    responseList: []
};
