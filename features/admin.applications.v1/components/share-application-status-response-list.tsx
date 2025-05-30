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

import CircularProgress from "@oxygen-ui/react/CircularProgress";
import { useGetAsyncOperationStatusUnits } from "@wso2is/admin.core.v1/api/use-get-async-operation-status-units";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import {
    AsyncOperationStatusLinkInterface,
    AsyncOperationStatusUnitResponse,
    OperationStatus,
    OperationStatusSummary } from "@wso2is/admin.core.v1/models/common";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    DataTable,
    EmptyPlaceholder,
    ListLayout,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Grid,
    Header,
    Icon
} from "semantic-ui-react";
import { ApplicationShareUnitStatus } from "../constants/application-management";
import "./share-application-status-response-list.scss";

/**
 * Proptypes for the share application status response list.
 */
interface ShareApplicationStatusResponseListProps extends IdentifiableComponentInterface {
    operationId: string;
    ["data-componentid"]: string;
    operationSummary?: OperationStatusSummary;
}

/**
 * Proptypes for the REST api params.
 */
interface GetApplicationStatusResponseParams {
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
 * @returns Application share status result.
 */
export const ShareApplicationStatusResponseList: React.FunctionComponent<ShareApplicationStatusResponseListProps> = ({
    operationId,
    operationSummary,
    ["data-componentid"]: componentId
}: ShareApplicationStatusResponseListProps): ReactElement => {

    const API_LIMIT: number = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT;

    const [ selectedStatus, setSelectedStatus ] = useState<ApplicationShareUnitStatus>
    (ApplicationShareUnitStatus.FAILED);
    const [ unitOperations, setUnitOperations ] = useState<AsyncOperationStatusUnitResponse[]>([]);
    const [ afterCursor, setAfterCursor ] = useState<string | null>(null);
    const [ hasMoreItems, setHasMoreItems ] = useState(true);
    const [ isInitialLoading, setIsInitialLoading ] = useState<boolean>(true);
    const [ params, setParams ] = useState<GetApplicationStatusResponseParams>({
        after: null,
        filter: `status eq ${selectedStatus}`,
        limit: API_LIMIT,
        shouldFetch: true
    });

    const { t } = useTranslation();

    const {
        data: shareStatusUnitListResponse,
        isLoading: isShareUnitStatusFetchRequestLoading,
        isValidating: isShareUnitStatusFetchRequestValidating,
        error: shareUnitStatusListFetchRequestError
    } = useGetAsyncOperationStatusUnits(operationId, params.shouldFetch,
        params.filter, params.limit, params.after, null);

    useEffect(() => {
        if (!shareStatusUnitListResponse || isShareUnitStatusFetchRequestLoading ||
            isShareUnitStatusFetchRequestValidating) {
            return;
        }
        if (isInitialLoading) {
            setIsInitialLoading(false);
        }
        setParams((prevParams: GetApplicationStatusResponseParams) => ({
            ...prevParams,
            shouldFetch: false
        }));

        const newUnitShares: AsyncOperationStatusUnitResponse[] = shareStatusUnitListResponse.unitOperations || [];

        setUnitOperations((prevUnits: AsyncOperationStatusUnitResponse[]) => [ ...prevUnits, ...newUnitShares ]);

        let nextFound: boolean = false;

        shareStatusUnitListResponse?.links?.forEach((link: AsyncOperationStatusLinkInterface) => {

            if (link.rel === "next") {
                const urlParams: URLSearchParams = new URLSearchParams(link.href.split("?")[1]);
                const nextCursor: string = urlParams.get("after");

                setAfterCursor(nextCursor);
                setHasMoreItems(!!nextCursor);
                nextFound = true;
            }
        });
        if (!nextFound) {
            setAfterCursor(null);
            setHasMoreItems(false);
        }
    }, [ shareStatusUnitListResponse,
        isShareUnitStatusFetchRequestLoading,
        isShareUnitStatusFetchRequestValidating, isInitialLoading ]);

    useEffect(() => {
        if (shareUnitStatusListFetchRequestError) {
            setIsInitialLoading(false);
            setHasMoreItems(false);
        }
    }, [ shareUnitStatusListFetchRequestError ] );

    /**
     * Handles the status dropdown change event.
     * Updates the selected status, resets state variables, and sets the API request parameters.
     *
     * @param event - The dropdown change event.
     * @param data - The selected dropdown data.
     *
     * @returns void
     */
    const handleStatusDropdownChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const newStatus: ApplicationShareUnitStatus = data.value as ApplicationShareUnitStatus;

        setSelectedStatus(newStatus);
        setUnitOperations([]);
        setAfterCursor(null);
        setHasMoreItems(true);
        setIsInitialLoading(true);
        setParams({
            after: null,
            filter: newStatus === ApplicationShareUnitStatus.ALL ? "" : `status eq ${newStatus}`,
            limit: API_LIMIT,
            shouldFetch: true
        });
    };

    const loadMoreData = () => {
        if (isShareUnitStatusFetchRequestLoading || !hasMoreItems) {
            return;
        }
        setParams((prevParams: GetApplicationStatusResponseParams) => ({
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
            <div className="share-application-status-response-list">
                <div
                    className="org-id-wrapper"
                    onMouseEnter={ () => setIsHovered(true) }
                    onMouseLeave={ () => setIsHovered(false) }
                >
                    <span className="ellipsis-text" title={ id }>{ id }</span>
                    <span className="copy-icon-container">
                        { isHovered && (
                            <Icon
                                name={ isCopied ? "check" : "copy outline" }
                                title={ isCopied ? "Copied!" : "Copy ID" }
                                className={ "copy-icon visible" }
                                onClick={ handleCopy }
                                link
                            />
                        ) }
                    </span>
                </div>
            </div>
        );
    };

    const statusToDefaultMessage: Map<OperationStatus, string> = new Map<OperationStatus, string>([
        [ OperationStatus.SUCCESS, t("applications:edit.sections.shareApplication."
            + "applicationShareFailureSummaryDefaultStatus.success") ],
        [ OperationStatus.FAILED, t("applications:edit.sections.shareApplication."
            + "applicationShareFailureSummaryDefaultStatus.failed") ],
        [ OperationStatus.PARTIALLY_COMPLETED, t("applications:edit.sections.shareApplication."
            + "applicationShareFailureSummaryDefaultStatus.partiallyCompleted") ]
    ]);

    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "targetOrgId",
                id: "targetOrgId",
                key: "targetOrgId",
                render: (response: AsyncOperationStatusUnitResponse): ReactNode => {
                    return (
                        <div className="share-application-status-response-list">
                            <Header className="header" data-componentid={ `${componentId}-application-item-heading` }>
                                <Header.Subheader className="org-handler">
                                    { response?.targetOrgName }
                                </Header.Subheader>
                                <Header.Content className="org-id">
                                    <OrgIdDisplay id={ response?.targetOrgId } />
                                </Header.Content>
                            </Header>
                        </div>
                    );
                },
                title: "targetOrgId"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: "status",
                render: (response: AsyncOperationStatusUnitResponse): ReactNode => {
                    return (
                        <Header
                            as="h6"
                            data-componentid={ `${componentId}-status-item-heading` } >
                            <Header.Content>
                                <Icon
                                    name="circle"
                                    color={ response?.status === OperationStatus.SUCCESS ? "green" : "red" }
                                    size="small"
                                    data-componentid={ `${componentId}-status-icon` }
                                />
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Status"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "statusMessage",
                id: "statusMessage",
                key: "statusMessage",
                render: (response: AsyncOperationStatusUnitResponse): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${componentId}-status-item-heading` }>
                            <Header.Content>
                                { response?.statusMessage
                                    ? response?.statusMessage : statusToDefaultMessage.get(response?.status) }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Status Message"
            }
        ];
    };

    const statusOptions: DropdownItemProps[] = [
        { key: "ALL", text: t("applications:edit.sections.sharedAccess.sharedAccessStatusOptions.all"),
            value: ApplicationShareUnitStatus.ALL },
        { key: "SUCCESS", text: t("applications:edit.sections.sharedAccess.sharedAccessStatusOptions.success"),
            value: ApplicationShareUnitStatus.SUCCESS },
        { key: "FAILED", text: t("applications:edit.sections.sharedAccess.sharedAccessStatusOptions.failed"),
            value: ApplicationShareUnitStatus.FAILED },
        { key: "PARTIALLY_COMPLETED",
            text: t("applications:edit.sections.sharedAccess.sharedAccessStatusOptions.partiallyCompleted"),
            value: ApplicationShareUnitStatus.PARTIALLY_COMPLETED }
    ];

    return (
        <>
            <Grid.Row columns={ 2 } verticalAlign="middle">
                <Grid.Column width={ 8 }>
                    { operationSummary && (
                        <p>
                            { t("applications:wizards.sharedAccessStatus.banner.partiallyCompleted") }
                            { operationSummary.partiallyCompletedCount } &nbsp;&nbsp; | &nbsp;&nbsp;
                            { t("applications:wizards.sharedAccessStatus.banner.failed") }
                            { operationSummary.failedCount }
                        </p>
                    ) }
                    { !operationSummary && "Status counts unavailable" }
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
            <div className="share-application-status-response-list">
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
                    onPageChange={ () => null }
                    totalPages={ 200 }
                >
                    <div id="scrollableDiv" style={ { height: "400px", overflow: "auto" } }>
                        { unitOperations.length === 0 ? (
                            <EmptyPlaceholder
                                data-testid={ `${componentId}-empty-list-placeholder` }
                                action={ null }
                                image={ getEmptyPlaceholderIllustrations().emptyList }
                                imageSize="micro"
                                subtitle={ [
                                    t("applications:edit.sections.attributes.emptySearchResults.title")
                                ] }
                            />
                        ) : (
                            <InfiniteScroll
                                dataLength={ unitOperations.length }
                                next={ loadMoreData }
                                hasMore={ hasMoreItems }
                                loader={
                                    (<div className="infinite-scroll-loader">
                                        <CircularProgress size={ 22 } className="list-item-loader" />
                                    </div>)
                                }
                                scrollableTarget={ "scrollableDiv" }
                            >
                                <DataTable<AsyncOperationStatusUnitResponse>
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
                        ) }
                    </div>
                </ListLayout>
            </div>
        </>
    );
};
