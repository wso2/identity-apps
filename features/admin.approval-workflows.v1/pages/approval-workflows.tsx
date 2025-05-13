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
import { Show } from "@wso2is/access-control";
import { ReactComponent as CrossIcon } from "@wso2is/admin.core.v1/assets/icons/cross-icon.svg";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, GenericIcon, ListLayout, PageLayout, Popup, PrimaryButton } from "@wso2is/react-components";
import debounce from "lodash-es/debounce";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Icon, Input } from "semantic-ui-react";
import { deleteApprovalWorkflowById, useGetApprovalWorkflows } from "../api";
import { ApprovalWorkflowList } from "../components";
import { WorkflowListItemInterface } from "../models/approval-workflows";

/**
 * Props for the Approval Workflow page.
 */
type WorkflowsPageInterface = IdentifiableComponentInterface;

/**
 * This renders the approval workflow page.
 *
 * @param props - Props injected to the component.
 * @returns Approval Workflow page component.
 */
const ApprovalWorkflows: FunctionComponent<WorkflowsPageInterface> = (props: WorkflowsPageInterface): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ approvalWorkflows, setApprovalWorkflows ] = useState<WorkflowListItemInterface[]>([]);
    const [ listOffset, setListOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(10);
    const [ inputValue, setInputValue ] = useState<string>("");
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ isApprovalWorkflowsLoading, setApprovalWorkflowsLoading ] = useState<boolean>(true);
    const [ totalResults, setTotalResults ] = useState<number>(0);

    const dispatch: Dispatch = useDispatch();

    const {
        data: workflowList,
        error: workflowListFetchRequestError,
        isLoading: isWorkflowsListRequestLoading,
        mutate: mutateWorkflowsFetchRequest
    } = useGetApprovalWorkflows(listItemLimit, listOffset, searchQuery, true);

    /**
     * Moderate workflow list fetch response from the API.
     */
    useEffect(() => {
        if (!workflowList) {
            return;
        }

        const updatedResources: WorkflowListItemInterface[] = workflowList.workflows;

        setApprovalWorkflows(updatedResources);
        setApprovalWorkflowsLoading(false);
        setTotalResults(workflowList.totalResults);
    }, [ workflowList ]);

    /**
     * Handles workflow list fetch request error.
     */
    useEffect(() => {
        if (!workflowListFetchRequestError) {
            return;
        }
        dispatch(
            addAlert({
                description:
                    workflowListFetchRequestError?.response?.data?.description ??
                    t(
                        "console:manage.features.approvalWorkflows.notifications." +
                            "fetchApprovalWorkflows.genericError.description"
                    ),
                level: AlertLevels.ERROR,
                message:
                    workflowListFetchRequestError?.response?.data?.message ??
                    t(
                        "console:manage.features.approvalWorkflows.notifications." +
                            "fetchApprovalWorkflows.genericError.message"
                    )
            })
        );
    }, [ workflowListFetchRequestError ]);

    /**
     * Handles changes to the "items per page" dropdown.
     *
     * @param event - Click event
     * @param data - Items per page
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: any) => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles pagination change events.
     *
     * @param event - Click event
     * @param data - Active page number
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: any) => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    /**
     * This is a debounced function to handle the user search by approval workflow name.
     */
    const debouncedSearch: (value: string) => void = useCallback(
        debounce((value: string) => {
            setSearchQuery(value);
        }, 1000),
        []
    );

    /**
     * Handles the `onChange` callback action.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = e.target.value;

        setInputValue(value);
        debouncedSearch(value);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleClearSearch = () => {
        setInputValue("");
        setSearchQuery("");
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle approval workflow deletion action.
     *
     * @param approvalWorkflow - Approval workflow ID which needs to be deleted
     */
    const handleOnDelete = (approvalWorkflow: WorkflowListItemInterface): void => {
        deleteApprovalWorkflowById(approvalWorkflow.id)
            .then(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.approvalWorkflows.notifications." +
                            "deleteApprovalWorkflow.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.approvalWorkflows.notifications.deleteApprovalWorkflow.success.message"
                    )
                });
                mutateWorkflowsFetchRequest();
            })
            .catch(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.approvalWorkflows.notifications." +
                            "deleteApprovalWorkflow.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.approvalWorkflows.notifications." +
                            "deleteApprovalWorkflow.genericError.message"
                    )
                });
            });
    };

    return (
        <PageLayout
            data-componentid={ `${componentId}-page-layout` }
            action={
                !isWorkflowsListRequestLoading &&
                approvalWorkflows?.length > 0 && (
                    <Show when={ featureConfig?.groups?.scopes?.create }>
                        <PrimaryButton
                            data-componentid={ `${componentId}-add-button` }
                            onClick={ () => history.push(AppConstants.getPaths().get("APPROVAL_WORKFLOW_CREATE")) }
                        >
                            <Icon data-componentid={ `${componentId}-add-button-icon` } name="add" />
                            { t("roles:list.buttons.addButton", { type: "Approval Workflow" }) }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("pages:approvalWorkflows.title") }
            pageTitle={ t("pages:approvalWorkflows.title") }
            description={ t("pages:approvalWorkflows.subTitle") }
        >
            <ListLayout
                data-componentid={ `${componentId}-list-layout` }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ Math.ceil(totalResults / listItemLimit) }
                totalListSize={ totalResults }
                isLoading={ isApprovalWorkflowsLoading }
                leftActionPanel={
                    (<div
                        className="advanced-search-wrapper aligned-left fill-default"
                        data-componentid={ `${componentId}-advanced-search-wrapper` }
                    >
                        <Input
                            data-componentid={ `${componentId}-search-input` }
                            className="advanced-search with-add-on"
                            icon="search"
                            iconPosition="left"
                            value={ inputValue }
                            onChange={ handleInputChange }
                            placeholder={ t("console:manage.features.approvalWorkflows.advancedSearch.placeholder") }
                            floated="right"
                            size="small"
                            action={
                                inputValue ? (
                                    <Popup
                                        data-componentid={ `${componentId}-clear-search-popup` }
                                        trigger={
                                            (<Button
                                                basic
                                                compact
                                                className="input-add-on workflows"
                                                data-componentid={ `${componentId}-clear-search-button` }
                                            >
                                                <GenericIcon
                                                    data-componentid={ `${componentId}-clear-search-icon` }
                                                    size="nano"
                                                    defaultIcon
                                                    transparent
                                                    icon={ CrossIcon }
                                                    onClick={ handleClearSearch }
                                                />
                                            </Button>)
                                        }
                                        position="top center"
                                        content={ t("console:common.advancedSearch.popups.clear") }
                                        inverted={ true }
                                    />
                                ) : null
                            }
                        />
                    </div>)
                }
            >
                { workflowListFetchRequestError ? (
                    <EmptyPlaceholder
                        data-componentid={ `${componentId}-empty-placeholder` }
                        subtitle={ [
                            t("approvalWorkflows:form.placeholders.ApprovalWorkflowError.subtitles.0"),
                            t("approvalWorkflows:form.placeholders.ApprovalWorkflowError.subtitles.1")
                        ] }
                        title={ t("approvalWorkflows:form.placeholders.ApprovalWorkflowError.title") }
                        image={ getEmptyPlaceholderIllustrations().genericError }
                        imageSize="tiny"
                    />
                ) : (
                    <ApprovalWorkflowList
                        data-componentid={ `${componentId}-model-list` }
                        isLoading={ isWorkflowsListRequestLoading }
                        approvalWorkflowList={ approvalWorkflows }
                        onSearchQueryClear={ handleClearSearch }
                        handleApprovalWorkflowDelete={ handleOnDelete }
                        searchQuery={ searchQuery }
                    />
                ) }
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ApprovalWorkflows.defaultProps = {
    "data-componentid": "approval-workflows"
};

export default ApprovalWorkflows;
