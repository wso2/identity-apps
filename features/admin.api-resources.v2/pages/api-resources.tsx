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

import Grid from "@oxygen-ui/react/Grid";
import { BuildingGearIcon, ChevronRightIcon, HierarchyIcon } from "@oxygen-ui/react-icons";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, LinkInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    EmphasizedSegment,
    EmptyPlaceholder,
    GenericIcon,
    ListLayout,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Icon, List, PaginationProps } from "semantic-ui-react";
import { useAPIResources } from "../api";
import { APIResourcesList } from "../components";
import { AddAPIResource } from "../components/wizard";
import { APIResourceType, APIResourcesConstants } from "../constants";
import useApiResourcesPageContent from "../hooks/use-api-resources-page-content";
import { APIResourceInterface, ResourceServerType } from "../models";
import { APIResourceUtils } from "../utils/api-resource-utils";

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

    const {
        resourceServerListTitle,
        resourceServerListPageTitle,
        addNewResourceButtonText,
        resourceServerType,
        resourceServerListDescription,
        defaultSearchFilter,
        resourceSearchBarPlaceholder
    } = useApiResourcesPageContent();

    const [ activePage, setActivePage ] = useState<number>(1);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ apiResourcesList, setAPIResourcesList ] = useState<APIResourceInterface[]>([]);
    const [ after, setAfter ] = useState<string>(undefined);
    const [ before, setBefore ] = useState<string>(undefined);
    const [ nextAfter, setNextAfter ] = useState<string>(undefined);
    const [ nextBefore, setNextBefore ] = useState<string>(undefined);
    const [ filter, setFilter ] = useState<string>(defaultSearchFilter);
    const [ attributes ] = useState<string>(APIResourcesConstants.PROPERTIES);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const { organizationType } = useGetCurrentOrganizationType();

    const {
        data: apiResourcesListData,
        isLoading: isAPIResourcesListLoading,
        error: apiResourcesFetchRequestError,
        mutate: mutateAPIResourcesFetchRequest
    } = useAPIResources(after, before, filter, true, attributes);

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

            setNextAfter(undefined);
            setNextBefore(undefined);
            if (apiResourcesListData.links && apiResourcesListData.links.length !== 0) {
                apiResourcesListData.links?.forEach((value: LinkInterface) => {
                    switch (value.rel) {
                        case APIResourcesConstants.NEXT_REL:
                            setNextAfter(value.href.split(`${APIResourcesConstants.AFTER}=`)[1]);

                            break;

                        case APIResourcesConstants.PREVIOUS_REL:
                            setNextBefore(value.href.split(`${APIResourcesConstants.BEFORE}=`)[1]);

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
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.message")
            }));
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
     * The following useEffect is used to update the filter value
     */
    useEffect(() => {
        const typeFilter: string = defaultSearchFilter;

        if (searchQuery) {
            setFilter(`${ searchQuery } and ${ typeFilter }`);
        } else {
            setFilter(typeFilter);
        }
    }, [ searchQuery ]);

    /**
     * edit the API resources list once a API resource is deleted
     */
    const onAPIResourceDelete = (): void => {
        setMutateAPIResourcesList();
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

    /**
     * Handles the `onFilter` callback action from the
     * api search component.
     *
     * @param query - Search query.
     */
    const handleApiFilter = (query: string): void => {
        setSearchQuery(query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setTriggerClearQuery(!triggerClearQuery);
    };

    return (
        <PageLayout
            action={
                APIResourceUtils.isAPIResourceCreateAllowed(featureConfig, allowedScopes)
                    && apiResourcesList?.length > 0
                    && (
                        <PrimaryButton
                            data-testid={ `${componentId}-add-api-resources-button` }
                            onClick={ () => setShowWizard(true) }
                        >
                            <Icon name="add" />
                            { addNewResourceButtonText }
                        </PrimaryButton>
                    )
            }
            pageTitle={ resourceServerListPageTitle }
            title={ resourceServerListTitle }
            description={ organizationType !== OrganizationType.SUBORGANIZATION ? (
                resourceServerListDescription
            ) : (
                <>
                    { t("extensions:develop.apiResource.pageHeader.subOrgDescription") }
                    <DocumentationLink
                        link={ getLink("develop.apiResources.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
            data-componentid={ `${ componentId }-page-layout` }
            data-testid={ `${ componentId }-page-layout` }
            headingColumnWidth="11"
            actionColumnWidth="5"
        >
            {
                resourceServerType === ResourceServerType.API && !isAPIResourcesListLoading ? (
                    <>
                        {
                            organizationType !== OrganizationType.SUBORGANIZATION &&
                        (
                            <EmphasizedSegment
                                onClick={ () => {
                                    history.push(APIResourcesConstants.getPaths().get("API_RESOURCES_CATEGORY")
                                        .replace(":categoryId", APIResourceType.MANAGEMENT));
                                } }
                                className="clickable"
                                data-componentid={ `${ componentId }-management-api-container` }
                            >
                                <List>
                                    <List.Item>
                                        <Grid container direction="row" xs={ 12 } alignItems="center">
                                            <Grid xs={ 10 } alignContent="center">
                                                <GenericIcon
                                                    verticalAlign="middle"
                                                    fill="primary"
                                                    transparent
                                                    icon={ <BuildingGearIcon size="medium" /> }
                                                    spaced="right"
                                                    floated="left"
                                                    className="mt-1"
                                                />
                                                <List.Header>
                                                    { t("extensions:develop.apiResource.managementAPI.header") }
                                                </List.Header>
                                                <List.Description>
                                                    { t("extensions:develop.apiResource.managementAPI.description") }
                                                </List.Description>
                                            </Grid>
                                            <Grid xs={ 2 }>
                                                <GenericIcon
                                                    verticalAlign="middle"
                                                    fill="primary"
                                                    transparent
                                                    icon={ <ChevronRightIcon /> }
                                                    spaced="right"
                                                    floated="right"
                                                />
                                            </Grid>
                                        </Grid>
                                    </List.Item>
                                </List>
                            </EmphasizedSegment>
                        )
                        }
                        <EmphasizedSegment
                            onClick={ () => {
                                history.push(APIResourcesConstants.getPaths().get("API_RESOURCES_CATEGORY")
                                    .replace(":categoryId", APIResourceType.ORGANIZATION));
                            } }
                            className="clickable"
                            data-componentid={ `${ componentId }-organization-api-container` }
                        >
                            <List>
                                <List.Item>
                                    <Grid container direction="row" xs={ 12 } alignItems="center">
                                        <Grid xs={ 10 } alignContent="center">
                                            <GenericIcon
                                                verticalAlign="middle"
                                                fill="primary"
                                                transparent
                                                icon={ <HierarchyIcon size="medium" /> }
                                                spaced="right"
                                                floated="left"
                                                className="mt-1"
                                            />
                                            <List.Header>
                                                { t("extensions:develop.apiResource.organizationAPI.header") }
                                            </List.Header>
                                            <List.Description>
                                                { t("extensions:develop.apiResource.organizationAPI.description") }
                                            </List.Description>
                                        </Grid>
                                        <Grid xs={ 2 }>
                                            <GenericIcon
                                                verticalAlign="middle"
                                                fill="primary"
                                                transparent
                                                icon={ <ChevronRightIcon /> }
                                                spaced="right"
                                                floated="right"
                                            />
                                        </Grid>
                                    </Grid>
                                </List.Item>
                            </List>
                        </EmphasizedSegment>
                    </>
                ) : null
            }

            <Divider hidden/>
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleApiFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("applications:advancedSearch.form" +
                                ".inputs.filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("applications:advancedSearch.form" +
                                ".inputs.filterCondition.placeholder")
                        }
                        filterValuePlaceholder={
                            t("applications:advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder={ resourceSearchBarPlaceholder }
                        style={ { minWidth: "425px" } }
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        data-componentid={ `${ componentId }-list-advanced-search` }
                    />
                ) }
                showTopActionPanel={ (!!searchQuery || apiResourcesList?.length > 0) }
                data-componentid={ `${ componentId }-api-resources-list-layout` }
                data-testid={ `${ componentId }-api-resources-list-layout` }
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
                } }
            >
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
                            onSearchQueryClear={ handleSearchQueryClear }
                            searchQuery={ searchQuery }
                            categoryId="custom"
                            onEmptyListPlaceholderActionClicked={ () => setShowWizard(true) }
                        />)

                }
            </ListLayout>
            {
                showWizard && (
                    <AddAPIResource
                        data-testid= { `${componentId}-add-api-resource-wizard-modal` }
                        closeWizard={ () => setShowWizard(false) }
                        resourceType={ resourceServerType }
                    />
                )
            }
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
