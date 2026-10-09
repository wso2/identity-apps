/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, ListLayout, PageLayout } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
// DropdownProps and PaginationProps are the parameter types ListLayout hands its
// pagination callbacks, so they come from semantic until that layout is replaced.
import { DropdownProps, PaginationProps } from "semantic-ui-react";
import { resolveReviewTask } from "../api/review-tasks";
import ReviewTaskList from "../components/review-task-list";
import useReviewTaskProfiles from "../hooks/use-review-task-profiles";
import useReviewTasks from "../hooks/use-review-tasks";
import {
    ResolveReviewTaskPayload,
    ReviewDecision,
    ReviewTaskListResponse,
    ReviewTaskModel
} from "../models/review-tasks";

/**
 * The server's list endpoint takes a page size and nothing else — no offset, no sort order — so
 * the whole queue is fetched once and ordered and paged here. 200 is the server's own cap.
 */
const FETCH_PAGE_SIZE: number = 200;

/**
 * Pairs of profiles the engine judged similar enough to be worth asking about, but not
 * similar enough to unify on its own.
 */
const ReviewTasksPage: FunctionComponent<IdentifiableComponentInterface> = ({
    ["data-componentid"]: componentId = "cds-review-tasks-page"
}: IdentifiableComponentInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const cdsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.customerDataService);
    const hasUpdateScopes: boolean = useRequiredScopes(cdsFeatureConfig?.scopes?.update);

    const [ offset, setOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);

    const {
        data,
        error,
        isLoading,
        mutate: mutateTasks
    } = useReviewTasks<ReviewTaskListResponse>(cdsFeatureConfig?.enabled ?? false, FETCH_PAGE_SIZE);

    const tasks: ReviewTaskModel[] = data?.tasks ?? [];

    // Strongest matches first: those are the pairs most likely to be the same person, and the
    // ones worth a decision soonest. Equal scores fall back to age, so the order is stable
    // rather than reshuffling between renders.
    const sortedTasks: ReviewTaskModel[] = useMemo(() => [ ...tasks ].sort(
        (a: ReviewTaskModel, b: ReviewTaskModel) =>
            b.match_score - a.match_score
                || (a.created_at ?? "").localeCompare(b.created_at ?? "")
    ), [ tasks ]);

    const paginatedTasks: ReviewTaskModel[] = useMemo(
        () => sortedTasks.slice(offset, offset + listItemLimit),
        [ sortedTasks, offset, listItemLimit ]);

    // Only the page on screen needs its profiles resolved.
    const { profiles, failedProfileIds, isLoading: isLoadingProfiles } =
        useReviewTaskProfiles(paginatedTasks);

    // Resolving the last task on the last page leaves the offset past the end of the list, and
    // the page would show the "nothing to review" placeholder while earlier pages still hold
    // tasks. Step back rather than strand the queue.
    useEffect(() => {
        if (offset > 0 && offset >= sortedTasks.length) {
            setOffset(Math.max(0, (Math.ceil(sortedTasks.length / listItemLimit) - 1) * listItemLimit));
        }
    }, [ sortedTasks.length, offset, listItemLimit ]);

    // The list holds the in-flight state, since it is the one that has to disable a specific
    // row's buttons; this only has to report what happened.
    const handleResolve = async (task: ReviewTaskModel, decision: ReviewDecision): Promise<void> => {
        try {
            const payload: ResolveReviewTaskPayload = { decision };

            await resolveReviewTask(task.id, payload);
            // Awaited: approving also cancels the other tasks that referenced either profile,
            // so releasing the buttons before the list has caught up invites a second resolve
            // against a task the server has already closed.
            await mutateTasks();

            dispatch(addAlert({
                description: t(decision === ReviewDecision.APPROVED
                    ? "customerDataService:reviewTasks.notifications.approved.description"
                    : "customerDataService:reviewTasks.notifications.rejected.description"),
                level: AlertLevels.SUCCESS,
                message: t(decision === ReviewDecision.APPROVED
                    ? "customerDataService:reviewTasks.notifications.approved.message"
                    : "customerDataService:reviewTasks.notifications.rejected.message")
            }));
        } catch {
            dispatch(addAlert({
                description: t("customerDataService:reviewTasks.notifications.resolveFailed.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:reviewTasks.notifications.resolveFailed.message")
            }));
        }
    };

    const handlePaginationChange = (_event: React.MouseEvent<HTMLAnchorElement>, paging: PaginationProps): void => {
        setOffset(((paging.activePage as number) - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (_event: SyntheticEvent<HTMLElement>, paging: DropdownProps): void => {
        setListItemLimit(paging.value as number);
        setOffset(0);
    };

    // A failed request would otherwise fall through to an empty list, and the page would tell an
    // administrator there is nothing to review when the queue may be full. Nor does it recover on
    // its own: the hook disables retry on error.
    if (error) {
        return (
            <PageLayout
                title={ t("customerDataService:reviewTasks.page.title") }
                pageTitle={ t("customerDataService:reviewTasks.page.title") }
                description={ t("customerDataService:reviewTasks.page.description") }
                backButton={ {
                    onClick: () => history.push(AppConstants.getPaths().get("CUSTOMER_DATA_PROFILE")),
                    text: t("customerDataService:reviewTasks.page.backButton")
                } }
                data-componentid={ `${ componentId }-error-layout` }
            >
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                    title={ t("customerDataService:reviewTasks.placeholders.error.title") }
                    subtitle={ [ t("customerDataService:reviewTasks.placeholders.error.subtitle") ] }
                    action={ (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={ () => mutateTasks() }
                        >
                            { t("customerDataService:reviewTasks.buttons.retry") }
                        </Button>
                    ) }
                    data-componentid={ `${ componentId }-error` }
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title={ t("customerDataService:reviewTasks.page.title") }
            pageTitle={ t("customerDataService:reviewTasks.page.title") }
            description={ t("customerDataService:reviewTasks.page.description") }
            backButton={ {
                onClick: () => history.push(AppConstants.getPaths().get("CUSTOMER_DATA_PROFILE")),
                text: t("customerDataService:reviewTasks.page.backButton")
            } }
            data-componentid={ `${ componentId }-layout` }
        >
            { /* No top action panel: there is nothing to search, and the only sort that makes
                 sense here is by score, which the list already applies. A lone sort option
                 renders as a disabled dropdown, and the layout will not show the direction
                 toggle without one — so a control would be there to be looked at, not used. */ }
            <ListLayout
                currentListSize={ paginatedTasks.length }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ sortedTasks.length > 0 }
                showTopActionPanel={ false }
                totalPages={ Math.ceil(sortedTasks.length / listItemLimit) }
                totalListSize={ sortedTasks.length }
                isLoading={ isLoading }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <ReviewTaskList
                    tasks={ paginatedTasks }
                    profiles={ profiles }
                    failedProfileIds={ failedProfileIds }
                    isLoading={ isLoading || isLoadingProfiles }
                    canResolve={ hasUpdateScopes }
                    onResolve={ handleResolve }
                    data-componentid={ `${ componentId }-list` }
                />
            </ListLayout>
        </PageLayout>
    );
};

export default ReviewTasksPage;
