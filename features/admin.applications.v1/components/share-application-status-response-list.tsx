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

import {
    DataTable,
    ListLayout,
    TableColumnInterface
} from "@wso2is/react-components";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
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
import { ApplicationShareStatusUnitLinkInterface, ApplicationShareUnitStatusResponse, ShareApplicationStatusResponseSummary } from "../models/application";
import { ApplicationShareStatus } from "../constants/application-management";
import "./share-application-status-response-list.scss";
import useGetApplicationShareStatusUnits from "../api/use-get-application-share-status";
import InfiniteScroll from "react-infinite-scroll-component";

interface ShareApplicationStatusResponseListProps {
    operationId: string;
    isLoading?: boolean;
    ["data-componentid"]?: string;
    shareApplicationSummary?: ShareApplicationStatusResponseSummary;
    hasError: boolean;
    successAlert?: ReactElement;
}

interface Params {
    shouldFetch?: boolean,
    filter?: string;
    limit?: number;
    after?: string;
    before?: string;
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
        operationId,
        isLoading,
        shareApplicationSummary,
        hasError,
        successAlert,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ selectedStatus, setSelectedStatus ] = useState<ApplicationShareStatus>(ApplicationShareStatus.FAIL);
    // const [ successShareCount, setSuccessShareCount ] = useState<number>();
    // const [ failedShareCount, setfailedShareCount ] = useState<number>();
    const [ unitOperations, setUnitOperations ] = useState<ApplicationShareUnitStatusResponse[]>([]);
    const [ afterCursor, setAfterCursor ] = useState<string | null>(null);
    const [ hasMoreItems, setHasMoreItems ] = useState(true);
    const [ isInitialLoading, setIsInitialLoading ] = useState<boolean>(true);

    const API_LIMIT = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT;

    const [ params, setParams ] = useState<Params>({
        after: null,
        filter: `status eq ${selectedStatus}`,
        limit: API_LIMIT,
        shouldFetch: true
    });

    // State for counts (derived from summary or potentially tracked separately if needed)
    // Using summary is more efficient if available
    // const successShareCount = shareApplicationSummary?.successCount ?? 0;
    // const failedShareCount = shareApplicationSummary?.failedCount ?? 0;
    const successShareCount = 2;
    const failedShareCount = 3;
    // const [ successShareCount, setSuccessShareCount ] = useState<number>(0);
    // const [ failedShareCount, setFailedShareCount ] = useState<number>(0);

    const {
        data: shareUnitStatusListResponse,
        isLoading: isShareUnitStatusFetchRequestLoading,
        isValidating: isShareUnitStatusFetchRequestValidating,
        error: shareUnitStatusListFetchRequestError
    } = useGetApplicationShareStatusUnits(operationId, params.shouldFetch, params.filter, params.limit, params.after, null);

    useEffect(() => {
        console.log("Share Unit Status List Response:", unitOperations);
        if (!shareUnitStatusListResponse || isShareUnitStatusFetchRequestLoading || isShareUnitStatusFetchRequestValidating) {
            return;
        }
        if (isInitialLoading) {
            setIsInitialLoading(false);
        }
        setParams((prevParams) => ({
            ...prevParams,
            shouldFetch: false
        }));

        const newUnitShares: ApplicationShareUnitStatusResponse[] = shareUnitStatusListResponse.unitOperations || [];
        setUnitOperations((prevUnits) => [...prevUnits, ...newUnitShares]);

        let nextFound: boolean = false;
        shareUnitStatusListResponse?.links?.forEach((link: ApplicationShareStatusUnitLinkInterface) => {
            if (link.rel === "next") {
                const urlParams = new URLSearchParams(link.href.split("?")[1]);
                console.log("Link found:", link.href);
                const nextCursor = urlParams.get("after");
                console.log("Next cursor found:", nextCursor);
                setAfterCursor(nextCursor);
                setHasMoreItems(!!nextCursor);
                nextFound = true;
            }
        });
        if (!nextFound) {
            setAfterCursor(null);
            setHasMoreItems(false);
        }
    }, [shareUnitStatusListResponse, isShareUnitStatusFetchRequestLoading, isShareUnitStatusFetchRequestValidating, isInitialLoading]);

    useEffect(() => {
        if (shareUnitStatusListFetchRequestError) {
            console.error("Failed to fetch application share status:", shareUnitStatusListFetchRequestError);
            setIsInitialLoading(false);
            setHasMoreItems(false);
        }
    }, [shareUnitStatusListFetchRequestError]);

    const handleStatusDropdownChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const newStatus = data.value as ApplicationShareStatus;
        setSelectedStatus(newStatus);
        setUnitOperations([]);
        setAfterCursor(null);
        setHasMoreItems(true);
        setIsInitialLoading(true);
        setParams({
            limit: API_LIMIT,
            after: null,
            filter: newStatus === ApplicationShareStatus.ALL ? "" : `status eq ${newStatus}`,
            shouldFetch: true
        });
    };
    const loadMoreData = () => {
        if (isShareUnitStatusFetchRequestLoading || !hasMoreItems) {
            return;
        }
        setParams((prevParams) => ({
            ...prevParams,
            after: afterCursor,
            shouldFetch: true
        }));
    }; 
    const OrgIdDisplay = ({ id }: { id: string }) => {
        const [ isHovered, setIsHovered ] = useState(false);
        const [ isCopied, setIsCopied ] = useState(false);

        const handleCopy = (e: React.MouseEvent) => {
            e.stopPropagation();
            navigator.clipboard.writeText(id);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
        };

        return (
            <div
                className="org-id-wrapper"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <span className="ellipsis-text" title={ id }>
                    { id }
                </span>
                <span className="copy-icon-container">
                    { isHovered && (
                        <Icon
                            name={ isCopied ? "check" : "copy outline" }
                            title={ isCopied ? "Copied!" : "Copy ID" }
                            className={ `copy-icon visible` }
                            onClick={ handleCopy }
                            link
                        />
                    ) }
                </span>
            </div>
        );
    };

    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
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
                title: "targetOrgId" 
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: "status",
                render: (response: ApplicationShareUnitStatusResponse): ReactNode => {
                    const isSuccess = response.status === ApplicationShareStatus.SUCCESS;
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
                title: "Status",
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
                title: "Status Message"
            }
        ];
    };

    const statusOptions: DropdownItemProps[] = [
        { key: "ALL", text: "All", value: ApplicationShareStatus.ALL },
        { key: "SUCCESS", text: "Success", value: ApplicationShareStatus.SUCCESS },
        { key: "FAIL", text: "Failed", value: ApplicationShareStatus.FAIL }
    ];

    return (
        <>
            <Grid.Row columns={ 2 } verticalAlign="middle">
                <Grid.Column width={ 8 }>
                    { shareApplicationSummary && (
                        <Label.Group size="small">
                            <Label color="green">
                                Success
                                <Label.Detail>{ successShareCount }</Label.Detail>
                            </Label>
                            <Label color="red">
                                Failed
                                <Label.Detail>{ failedShareCount }</Label.Detail>
                            </Label>
                            </Label.Group>
                    )}
                        { !shareApplicationSummary && "Status counts unavailable" }
                </Grid.Column>

                <Grid.Column width={ 8 } textAlign="right">
                    <div style={ { display: "inline-block" } }> 
                        <Dropdown
                            data-testid={ `${componentId}-filter-status-dropdown` }
                            data-componentid={ `${componentId}-filter-status-dropdown` }
                            selection
                            options={ statusOptions }
                            onChange={ handleStatusDropdownChange }
                            value={ selectedStatus }
                            disabled={ isInitialLoading || isShareUnitStatusFetchRequestLoading } 
                        />
                    </div>
                </Grid.Column>
            </Grid.Row>

            <ListLayout
                className="custom-list-layout-override"
                id="share-units"
                showPagination={ false }
                showTopActionPanel={ false }
                isLoading={ isInitialLoading && unitOperations.length === 0 }
                data-testid={ `${componentId}-list-layout` }
                data-componentid={ `${componentId}-list-layout` }
                totalDataSize={ unitOperations.length }
                listItemLimit={ API_LIMIT }
                showLayoutLoading={ isInitialLoading && unitOperations.length === 0 }
                onPageChange={() => null}
                totalPages={200}
            >
                <div id="scrollableDiv" style={{ height: "400px", overflow: "auto" }}>
                    <InfiniteScroll
                        dataLength={ unitOperations.length } 
                        next={ loadMoreData }
                        hasMore={ hasMoreItems }
                        loader={  
                            <div className="infinite-scroll-loader">
                                <CircularProgress size={ 22 } className="list-item-loader" />
                            </div> 
                        }
                        scrollableTarget={ "scrollableDiv" }
                    >
                        <DataTable<ApplicationShareUnitStatusResponse>
                            className="addon-field-wrapper"
                            isLoading={ isInitialLoading && unitOperations.length === 0 }
                            loadingStateOptions={ {
                                count: API_LIMIT,
                                imageType: "circular"
                            } }
                            actions={ [] }
                            columns={ resolveTableColumns() }
                            data={ unitOperations }
                            onRowClick={ () => null } 
                            transparent={ true }
                            selectable={ false }
                            showHeader={ false }
                            data-testid={ `${componentId}-data-table` }
                            data-componentid={ `${componentId}-data-table` }
                        />
                    </InfiniteScroll>
                </div>
            </ListLayout>
        </>
    );
};