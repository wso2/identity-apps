/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, LinkInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    EmptyPlaceholder,
    ListLayout,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon, PaginationProps } from "semantic-ui-react";
import { AppState, getEmptyPlaceholderIllustrations } from "../../admin.core.v1";
import { ExtendedFeatureConfigInterface } from "../../admin.extensions.v1/configs/models";
import { useAPIResources } from "../api";
import { APIResourcesList } from "../components";
import { AddAPIResource } from "../components/wizard";
import { APIResourcesConstants } from "../constants";
import { APIResourceInterface } from "../models";

/**
 * Prop-types for the API resources page component.
 */
type APIResourcesPageInterface = IdentifiableComponentInterface;

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
const APIResourcesPage: FunctionComponent<APIResourcesPageInterface> = (
    props: APIResourcesPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();

    const [ activePage, setActivePage ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ apiResourcesList, setAPIResourcesList ] = useState<APIResourceInterface[]>([]);
    const [ isListUpdated, setListUpdated ] = useState<boolean>(false);
    const [ after, setAfter ] = useState<string>(undefined);
    const [ before, setBefore ] = useState<string>(undefined);
    const [ currentAfter, setCurrentAfter ] = useState<string>(undefined);
    const [ currentBefore, setCurrentBefore ] = useState<string>(undefined);
    const [ nextAfter, setNextAfter ] = useState<string>(undefined);
    const [ nextBefore, setNextBefore ] = useState<string>(undefined);

    const featureConfig: ExtendedFeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const {
        data: apiResourcesListData,
        isLoading: isAPIResourcesListLoading,
        error: apiResourcesFetchRequestError,
        mutate: mutateAPIResourcesFetchRequest
    } = useAPIResources(after, before);

    /**
     * Update the API resources list.
     */
    useEffect(() => {
        if (apiResourcesListData instanceof IdentityAppsApiException) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.message")
            }));

            return;
        }

        if (apiResourcesListData) {
            const apiResourceList: APIResourceInterface[] = apiResourcesListData.apiResources.map(
                (apiResource: APIResourceInterface) => apiResource);

            if (apiResourcesListData.links && apiResourcesListData.links.length === 0) {
                setNextAfter(undefined);
                setNextBefore(undefined);
            } else {
                apiResourcesListData.links?.forEach((value: LinkInterface) => {

                    switch (value.rel) {
                        case APIResourcesConstants.AFTER_REL:
                            setNextAfter(value.href.split(`${APIResourcesConstants.AFTER_REL}=`)[1]);

                            break;

                        case APIResourcesConstants.BEFORE_REL:
                            setNextBefore(value.href.split(`${APIResourcesConstants.BEFORE_REL}=`)[1]);

                            break;

                        default:
                            break;
                    }
                });
            }

            setAPIResourcesList(apiResourceList);
        }
    }, [ apiResourcesListData ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching the API resources list
     */
    useEffect(() => {
        if (apiResourcesFetchRequestError) {
            switch (apiResourcesFetchRequestError.response?.data?.code) {
                case APIResourcesConstants.UNAUTHORIZED_ACCESS:
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                            ".unauthorizedError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                            ".unauthorizedError.message")
                    }));

                    break;

                default:
                    dispatch(addAlert<AlertInterface>({
                        description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                            ".genericError.message")
                    }));
            }
        }
    }, [ apiResourcesFetchRequestError ]);

    /**
     * The following useEffect is used to update the API resources list once a mutate function is called.
     */
    useEffect(() => {
        if (isListUpdated) {
            mutateAPIResourcesFetchRequest();
            setListUpdated(false);
        }
    }, [ isListUpdated ]);

    /**
     * edit the API resources list once a API resource is deleted
     */
    const onAPIResourceDelete = (): void => {
        if (apiResourcesList?.length === 1) {
            setMutateAPIResourcesList();
        } else {
            setMutateAPIResourcesList(currentAfter, currentBefore);
        }
    };

    /**
     * set the after and before values needed for the `mutateAPIResourcesFetchRequest`
     *
     * @param afterValue - after value
     * @param beforeValue - before value
     */
    const setMutateAPIResourcesList = (afterValue?: string, beforeValue?: string): void => {
        // set the after and before values needed for the `mutateAPIResourcesFetchRequest`
        setAfter(afterValue);
        setBefore(beforeValue);

        // update the current after and before values
        setCurrentAfter(nextAfter);
        setCurrentBefore(nextBefore);
        setListUpdated(true);
    };

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        const newPage: number = parseInt(data?.activePage as string);

        if (newPage > activePage) {
            setMutateAPIResourcesList(nextAfter, undefined);
        } else if (newPage < activePage) {
            setMutateAPIResourcesList(undefined, nextBefore);
        }
        setActivePage(newPage);
    };

    return (
        <PageLayout
            action={
                !apiResourcesFetchRequestError && apiResourcesList?.length > 0 && (
                    <PrimaryButton
                        data-testid= { `${componentId}-add-api-resources-button` }
                        onClick={ () => setShowWizard(true) }
                    >
                        <Icon name="add" />
                        { t("extensions:develop.apiResource.addApiResourceButton") }
                    </PrimaryButton>
                )
            }
            pageTitle={ t("extensions:develop.apiResource.pageHeader.title") }
            title={ t("extensions:develop.apiResource.pageHeader.title") }
            description={ (
                <>
                    { t("extensions:develop.apiResource.pageHeader.description") }
                    <DocumentationLink
                        link={ getLink("develop.apiResources.learnMore") }
                    >
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </>
            ) }
            data-componentid={ `${componentId}-page-layout` }
            data-testid={ `${componentId}-page-layout` }
            headingColumnWidth="11"
            actionColumnWidth="5"
        >
            <ListLayout
                showTopActionPanel={ false }
                data-componentid={ `${componentId}-api-resources-list-layout` }
                data-testid={ `${componentId}-api-resources-list-layout` }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ APIResourcesConstants.DEFAULT_TOTAL_PAGES }
                totalListSize={ apiResourcesList?.length }
                showPaginationPageLimit={ false }
                isLoading={ isAPIResourcesListLoading }
                activePage={ activePage }
                paginationOptions={ {
                    disableNextButton: !nextAfter,
                    disablePreviousButton: !nextBefore
                } }>
                {
                    apiResourcesFetchRequestError
                        ? (<EmptyPlaceholder
                            subtitle={ [ t("extensions:develop.apiResource.apiResourceError.subtitles.0"),
                                t("extensions:develop.apiResource.apiResourceError.subtitles.1") ] }
                            title={ t("extensions:develop.apiResource.apiResourceError.title") }
                            image={ getEmptyPlaceholderIllustrations().genericError }
                            imageSize="tiny"
                        />)
                        : (<APIResourcesList
                            apiResourcesList={ apiResourcesList }
                            isAPIResourcesListLoading={ isAPIResourcesListLoading }
                            featureConfig={ featureConfig }
                            onAPIResourceDelete={ onAPIResourceDelete }
                            setShowAddAPIWizard={ setShowWizard }
                        />)

                }
                {
                    showWizard && (
                        <AddAPIResource
                            data-testid= { `${componentId}-add-api-resource-wizard-modal` }
                            closeWizard={ () => setShowWizard(false) }
                        />
                    )
                }
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
APIResourcesPage.defaultProps = {
    "data-componentid": "api-resources"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default APIResourcesPage;
