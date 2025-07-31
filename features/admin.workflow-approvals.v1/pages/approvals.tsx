/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Input, PaginationProps, SemanticCOLORS } from "semantic-ui-react";
import { fetchPendingApprovals, updatePendingApprovalStatus } from "../api";
import { ApprovalsList } from "../components";
import { ApprovalStatus, ApprovalTaskListItemInterface } from "../models";

/**
 * Props for the Approvals page.
 */
type ApprovalsPageInterface = TestableComponentInterface;

/**
 * Workflow approvals page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Approvals page.
 */
const ApprovalsPage: FunctionComponent<ApprovalsPageInterface> = (
    props: ApprovalsPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ approvals, setApprovals ] = useState<ApprovalTaskListItemInterface[]>([]);
    const [ tempApprovals, setTempApprovals ] = useState<ApprovalTaskListItemInterface[]>([]);
    const [ isApprovalListRequestLoading, setApprovalListRequestLoading ] = useState<boolean>(false);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ offset, setOffset ] = useState(0);
    const [ filterStatus, setFilterStatus ] = useState<string>(ApprovalStatus.ALL);
    const [ searchResult, setSearchResult ] = useState<number>(undefined);

    const APPROVAL_OPTIONS: DropdownItemProps[] = [
        {
            key: 1,
            text: "All",
            value: ApprovalStatus.ALL
        },
        {
            key: 2,
            text: "Reserved",
            value: ApprovalStatus.RESERVED
        },
        {
            key: 3,
            text: "Ready",
            value: ApprovalStatus.READY
        },
        {
            key: 4,
            text: "Completed",
            value: ApprovalStatus.COMPLETED
        }
    ];

    /**
     * Updates the pending approvals list on change.
     */
    useEffect(() => {
        setApprovals(approvals);
        setTempApprovals(approvals);
    }, [ approvals ]);

    /**
     * Updates the approval list when the filter criteria changes.
     */
    useEffect(() => {
        setSearchResult(undefined);
        getApprovals(false);
    }, [ filterStatus ]);

    /**
     * Fetches the list of pending approvals from the API.
     *
     * @remarks
     * The API doesn't support a param to fetch all the available approvals at once.
     * As a temporary workaround, 1000 approvals are fetched when the `Show all` button
     * is fetched. TODO: Remove this once the API supports this functionality.
     *
     * @param shallowUpdate - A flag to specify if only the statuses should be updated.
     */
    const getApprovals = (shallowUpdate: boolean = false): void => {
        setApprovalListRequestLoading(true);

        fetchPendingApprovals(null, null, filterStatus)
            .then((response: ApprovalTaskListItemInterface[]) => {
                if (!shallowUpdate) {
                    setApprovals(response);
                    setTempApprovals(response);

                    return;
                }

                const approvalsFromState: ApprovalTaskListItemInterface[] = [ ...approvals ];
                const approvalsFromResponse: ApprovalTaskListItemInterface[] = [ ...response ];
                const filteredApprovals: ApprovalTaskListItemInterface[] = [];

                // Compare the approvals list in the state with the new response
                // and update the new statuses. When the status of the approval is changed,
                // it has to be dropped from the list if the filter status is not `ALL`.
                // Therefore the matching entries are extracted out to the `filteredApprovals` array
                // and are set to the state.
                approvalsFromState.forEach((fromState: ApprovalTaskListItemInterface) => {
                    approvalsFromResponse.forEach((fromResponse: ApprovalTaskListItemInterface) => {
                        if (fromState.id === fromResponse.id) {
                            fromState.approvalStatus = fromResponse.approvalStatus;
                            filteredApprovals.push(fromState);
                        }
                    });
                });

                setApprovals(filteredApprovals);
                setTempApprovals(filteredApprovals);
            })
            .catch((error: any) => {
                if (error.response && error.response.data && error.response.detail) {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.approvals.notifications.fetchPendingApprovals.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.approvals.notifications.fetchPendingApprovals.error.message"
                        )
                    }));
                }

                dispatch(addAlert({
                    description: t(
                        "console:manage.features.approvals.notifications.fetchPendingApprovals.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.approvals.notifications.fetchPendingApprovals.genericError.message"
                    )
                }));
            })
            .finally(() => {
                setApprovalListRequestLoading(false);
            });
    };

    /**
     * This slices and returns a portion of the list.
     *
     * @param list - List.
     * @param limit - List limit.
     * @param offset - List offset.
     * @returns Paginated list.
     */
    const paginate = (list: ApprovalTaskListItemInterface[], limit: number,
        offset: number): ApprovalTaskListItemInterface[] => {

        return list?.slice(offset, offset + limit);
    };

    /**
     * Handles the change in the number of items to display.
     *
     * @param event - Event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {

        setListItemLimit(data.value as number);
    };

    /**
     * Handles pagination change.
     *
     * @param event - Event.
     * @param data - Dropdown data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {

        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Resolves the filter tag colors based on the approval statuses.
     *
     * @param status - Filter status.
     *
     * @returns A semantic color instance.
     */
    const resolveApprovalTagColor = (
        status: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED | ApprovalStatus.BLOCKED |
        ApprovalStatus.ALL
    ): SemanticCOLORS => {
        switch (status) {
            case ApprovalStatus.READY:
                return "yellow";
            case ApprovalStatus.RESERVED:
                return "orange";
            case ApprovalStatus.COMPLETED:
                return "green";
            case ApprovalStatus.ALL:
                return "blue";
            case ApprovalStatus.BLOCKED:
                return "red";
            default:
                return "grey";
        }
    };

    /**
     * Handle the approval status filter change.
     *
     * @param event - event
     * @param data - data
     */
    const handleFilterStatusChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setFilterStatus(data.value as string);
    };

    /**
     * Updates the approvals status.
     *
     * @param id - ID of the approval.
     * @param status - New status of the approval.
     */
    const updateApprovalStatus = (
        id: string,
        status: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT
    ): void => {

        updatePendingApprovalStatus(id, status)
            .then(() => {
                getApprovals(false);
            })
            .catch((error: any) => {
                if (error.response && error.response.data && error.response.detail) {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.approvals.notifications.updatePendingApprovals.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.approvals.notifications.updatePendingApprovals.error.message"
                        )
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t(
                        "console:manage.features.approvals.notifications." +
                        "updatePendingApprovals.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.approvals.notifications.updatePendingApprovals.genericError.message"
                    )
                }));
            });
    };

    /**
     * Search the approvals list.
     *
     * @param event - event
     */
    const searchApprovalList = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changeValue: string = event.target.value;

        if (changeValue.length > 0) {
            const searchResult: ApprovalTaskListItemInterface[] = approvals
                .filter((item: ApprovalTaskListItemInterface) =>
                    item.name.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1
                );

            setTempApprovals(searchResult);

            if (searchResult.length === 0) {
                setSearchResult(0);
            }
        } else {
            setTempApprovals(approvals);
        }
    };

    return (
        <PageLayout
            title={ t("pages:approvalsPage.title") }
            pageTitle={ t("pages:approvalsPage.title") }
            description={ t("pages:approvalsPage.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                showTopActionPanel={ true }
                totalPages={ Math.ceil(approvals.length / listItemLimit) }
                totalListSize={ approvals.length }
                isLoading={ isApprovalListRequestLoading }
                data-testid={ `${ testId }-list-layout` }
                rightActionPanel={
                    (<Dropdown
                        data-testid={ `${ testId }-status-filter-dropdown` }
                        selection
                        options={ APPROVAL_OPTIONS }
                        onChange={ handleFilterStatusChange }
                        value={ filterStatus }
                    />)
                }
                leftActionPanel={
                    (<div className="advanced-search-wrapper aligned-left fill-default">
                        <Input
                            className="advanced-search with-add-on"
                            data-testid={ `${ testId }-list-search-input` }
                            icon="search"
                            iconPosition="left"
                            onChange={ searchApprovalList }
                            placeholder="Search by workflow name"
                            floated="right"
                            size="small"
                        />
                    </div>)
                }
            >
                <ApprovalsList
                    filterStatus={ filterStatus }
                    onChangeStatusFilter={ (status: string) => setFilterStatus(status) }
                    searchResult={ searchResult }
                    getApprovalsList={ getApprovals }
                    updateApprovalStatus={ updateApprovalStatus }
                    featureConfig={ featureConfig }
                    list={ paginate(tempApprovals, listItemLimit, offset) }
                    resolveApprovalTagColor={ resolveApprovalTagColor }
                    data-testid={ `${ testId }-list` }
                />
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ApprovalsPage.defaultProps = {
    "data-testid": "approvals"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApprovalsPage;
