import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import React, { FunctionComponent, ReactElement, useState, useEffect, MouseEvent, ReactNode } from "react";
import { Dispatch } from "redux";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { useTranslation } from "react-i18next";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { WorkflowListItemInterface } from "../models/workflow-definitions";
import { deleteWorkflowById, fetchWorkflows } from "../api";
import { AnimatedAvatar, AppAvatar, DataTable, ListLayout, PageLayout, PrimaryButton, TableColumnInterface } from "@wso2is/react-components";
import { DropdownProps, PaginationProps, Input, Header, Icon } from "semantic-ui-react";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@wso2is/admin.core.v1/store";
import { ApprovalProcessList } from "../components";
import { Show } from "@wso2is/access-control";
import { addAlert } from "@wso2is/core/store";
import ApprovalProcessesConstants from "../constants/approval-processes-constants";

type WorkflowsPageInterface = IdentifiableComponentInterface & TestableComponentInterface;

const WorkflowDefinitions: FunctionComponent<WorkflowsPageInterface> = (
    props: WorkflowsPageInterface 
): ReactElement => {

    const { ["data-testid"]: testId } = props;
    const { t } = useTranslation(); 

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features); 

    const dispatch: Dispatch = useDispatch();
    const [approvalProcesses, setApprovalProcesses] = useState<WorkflowListItemInterface[]>([]);
    const [paginatedApprovalProcesses, setPaginatedApprovalProcesses] = useState<WorkflowListItemInterface[]>([])
    const [tempApprovalProcesses, setTempApprovalProcesses] = useState<WorkflowListItemInterface[]>([]);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [isApprovalProcessListRequestLoading, setApprovalProcessListLoading] = useState<boolean>(false);
    const [listOffset, setListOffset] = useState(0);
    const [listItemLimit, setListItemLimit] = useState<number>(10);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const {
        data,
        error: groupsError,
        isLoading: isGroupsListRequestLoading,
        mutate: mutateWorkflowsFetchRequest
    } = fetchWorkflows(listItemLimit, listOffset, true);

    console.log("data", data);

    useEffect(() => {
        const updatedResources: WorkflowListItemInterface[] = data;
        setApprovalProcesses(updatedResources);
        //setApprovalProcessPages(listItemLimit, listOffset, updatedResources);
    }, [data]);

    // const setApprovalProcessPages = (limit: number, offset: number, list: WorkflowListItemInterface[]) => {

    //     if (!list) {
    //         setPaginatedApprovalProcesses([]);
    //         return;
    //     }
    //     setPaginatedApprovalProcesses(list?.slice(limit, limit+offset));
    // }

    //console.log("Paginated list: ", paginatedApprovalProcesses);

    // Handle pagination limit change
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: any) => {
        setListItemLimit(data.value as number);
        console.log("handle items per page drop down called");
    }

    // Handle page change
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: any) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    }

    const searchApprovalProcessList = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changeValue: string = event.target.value;
        setSearchQuery(changeValue)

        if (changeValue.length > 0) {
            const searchResult: WorkflowListItemInterface[] = approvalProcesses.filter((item: WorkflowListItemInterface) => item.name.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1)

            setTempApprovalProcesses(searchResult);
            if (searchResult.length === 0) {
                setSearchQuery("");
            }
        } else {
            setTempApprovalProcesses([]);
        }
    }

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const handleOnDelete = (approvalProcess: WorkflowListItemInterface): void => {
        deleteWorkflowById(approvalProcess.id).then(() => {
            handleAlerts({
                description: t(
                    "console:manage.features.groups.notifications.deleteGroup.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.groups.notifications.deleteGroup.success.message"
                )
            });
            mutateWorkflowsFetchRequest();
        }).catch(() => {
            handleAlerts({
                description: t(
                    "console:manage.features.groups.notifications.deleteGroup.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.groups.notifications.deleteGroup.error.message"
                )
            });
        })
    }
    
    return (
        <PageLayout
            action={
                (!isApprovalProcessListRequestLoading && approvalProcesses?.length > 0)
                && (
                    // <Show
                    //     when={ featureConfig?.groups?.scopes?.create }
                    // >
                        <PrimaryButton
                            data-testid="workflow-mgt-approval-processes-list-add-button"
                            onClick={ () =>
                                history.push(ApprovalProcessesConstants.getPaths().get("APPROVAL_PROCESS_CREATE")) }
                        >
                            <Icon name="add"/>
                            { "Add Workflow Model" }
                        </PrimaryButton>
                    // </Show>
                )
            }
            title={ t("pages:approvalProcesses.title") }
            pageTitle={ t("pages:approvalProcesses.title") }
            description={ t("pages:approvalProcesses.subTitle") }
            data-testid={`${testId}-page-layout`}
        >
            <ListLayout
                currentListSize={listItemLimit}
                listItemLimit={listItemLimit}
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={true}
                totalPages={Math.ceil(12 / listItemLimit)}
                totalListSize={12}
                isLoading={isApprovalProcessListRequestLoading}
                data-testid={`${testId}-list-layout`}
                leftActionPanel={
                    <div className="advanced-search-wrapper aligned-left fill-default">
                        <Input
                            className="advanced-search with-add-on"
                            data-testid={`${testId}-list-search-input`}
                            icon="search"
                            iconPosition="left"
                            onChange={ searchApprovalProcessList }
                            placeholder="Search by workflow model name"
                            floated="right"
                            size="small"
                        />
                    </div>
                }
            >
                <ApprovalProcessList
                    isLoading = {isApprovalProcessListRequestLoading}
                    approvalProcessList={searchQuery.length > 0 ? tempApprovalProcesses : approvalProcesses}
                    handleApprovalProcessDelete={handleOnDelete}
                    searchQuery= { searchQuery }
                    onListItemClick={null}
                    selection={null}
                />
            </ListLayout>
        </PageLayout>
    );
};


export default WorkflowDefinitions;
