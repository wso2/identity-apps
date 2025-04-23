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
import { deleteWorkflowById, useGetWorkflows } from "../api";
import { WorkflowModelList } from "../components";
import { WorkflowListItemInterface } from "../models/workflow-models";


type WorkflowsPageInterface = IdentifiableComponentInterface;

const WorkflowModels: FunctionComponent<WorkflowsPageInterface> = ( props: WorkflowsPageInterface ): ReactElement => {
    const { t } = useTranslation();

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const dispatch: Dispatch = useDispatch();
    const [ workflowModels, setWorkflowModels ] = useState<WorkflowListItemInterface[]>([]);
    const [ listOffset, setListOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(10);
    const [ inputValue, setInputValue ] = useState<string>("");
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ isWorkflowModelsLoading, setWorkflowModelsLoading ] = useState<boolean>(true);

    const {
        data,
        error: workflowsError,
        isLoading: isWorkflowsListRequestLoading,
        mutate: mutateWorkflowsFetchRequest
    } = useGetWorkflows(listItemLimit, listOffset, searchQuery, true);

    useEffect(() => {
        if (data) {
            const updatedResources: WorkflowListItemInterface[] = data;

            setWorkflowModels(updatedResources);
            setWorkflowModelsLoading(false);
        }
    }, [ data ]);

    useEffect(() => {
        if (workflowsError) {
            dispatch(
                addAlert({
                    description:
                        workflowsError?.response?.data?.description ??
                        workflowsError?.response?.data?.detail ??
                        t(
                            "console:manage.features.workflowModels.notifications." +
                                "fetchWorkflowModels.genericError.description"
                        ),
                    level: AlertLevels.ERROR,
                    message:
                        workflowsError?.response?.data?.message ??
                        t(
                            "console:manage.features.workflowModels.notifications." +
                                "fetchWorkflowModels.genericError.message"
                        )
                })
            );
        }
    }, [ workflowsError ]);

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: any) => {
        setListItemLimit(data.value as number);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: any) => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    /**
     * This is a debounced function to handle the user search by workflow model name.
     */
    const debouncedSearch: (value: string) => void = useCallback(
        debounce((value: string) => {
            setSearchQuery(value);
        }, 1000),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = e.target.value;

        setInputValue(value);
        debouncedSearch(value);
    };

    const handleClearSearch = () => {
        setInputValue("");
        setSearchQuery("");
    };

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const handleOnDelete = (workflowModel: WorkflowListItemInterface): void => {
        deleteWorkflowById(workflowModel.id)
            .then(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.workflowModels.notifications.deleteWorkflowModel.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.workflowModels.notifications.deleteWorkflowModel.success.message"
                    )
                });
                mutateWorkflowsFetchRequest();
            })
            .catch(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.workflowModels.notifications." +
                            "deleteWorkflowModel.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.workflowModels.notifications." +
                        "deleteWorkflowModel.genericError.message"
                    )
                });
            });
    };

    return (
        <PageLayout
            data-componentid={ `${componentId}-page-layout` }
            action={
                !isWorkflowsListRequestLoading &&
                workflowModels?.length > 0 && (
                    <Show
                        when={ featureConfig?.groups?.scopes?.create }
                    >
                        <PrimaryButton
                            data-componentid={ `${componentId}-add-button` }
                            onClick={ () =>
                                history.push(AppConstants.getPaths().get("WORKFLOW_MODEL_CREATE")) }
                        >
                            <Icon
                                data-componentid={ `${componentId}-add-button-icon` }
                                name="add" />
                            { t("roles:list.buttons.addButton", { type: "Workflow Model" }) }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("pages:workflowModels.title") }
            pageTitle={ t("pages:workflowModels.title") }
            description={ t("pages:workflowModels.subTitle") }
        >
            <ListLayout
                data-componentid={ `${componentId}-list-layout` }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ Math.ceil(12 / listItemLimit) }
                totalListSize={ 12 }
                isLoading={ isWorkflowModelsLoading }
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
                            placeholder={ t("console:manage.features.workflowModels.advancedSearch.placeholder") }
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
                { workflowsError ? (
                    <EmptyPlaceholder
                        data-componentid={ `${componentId}-empty-placeholder` }
                        subtitle={ [
                            t("workflowModels:form.placeholders.workflowModelError.subtitles.0"),
                            t("workflowModels:form.placeholders.workflowModelError.subtitles.1")
                        ] }
                        title={ t("workflowModels:form.placeholders.workflowModelError.title") }
                        image={ getEmptyPlaceholderIllustrations().genericError }
                        imageSize="tiny"
                    />
                ) : (
                    <WorkflowModelList
                        data-componentid={ `${componentId}-model-list` }
                        isLoading={ isWorkflowsListRequestLoading }
                        workflowModelList={ workflowModels }
                        onSearchQueryClear={ handleClearSearch }
                        handleWorkflowModelDelete={ handleOnDelete }
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
WorkflowModels.defaultProps = {
    "data-componentid": "workflow-models"
};

export default WorkflowModels;
