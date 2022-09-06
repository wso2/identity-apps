/**
 * Copyright (c) 2020, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import {
    CopyInputField,
    DocumentationLink,
    EmphasizedSegment,
    GenericIcon,
    GridLayout,
    ListLayout,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import find from "lodash-es/find";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    DropdownItemProps,
    DropdownProps,
    Grid,
    Icon,
    Label,
    List,
    PaginationProps,
    Popup
} from "semantic-ui-react";
import { applicationConfig } from "../../../extensions";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants,
    getGeneralIcons,
    history
} from "../../core";
import { RemoteFetchStatus } from "../../remote-repository-configuration";
import { useApplicationList } from "../api";
import { ApplicationList, MinimalAppCreateWizard } from "../components";
import { ApplicationManagementConstants } from "../constants";
import CustomApplicationTemplate
    from "../data/application-templates/templates/custom-application/custom-application.json";
import { ApplicationListInterface } from "../models";

const APPLICATIONS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: I18n.instance.t("common:name"),
        value: "name"
    },
    {
        key: 2,
        text: I18n.instance.t("common:type"),
        value: "type"
    },
    {
        key: 3,
        text: I18n.instance.t("common:createdOn"),
        value: "createdDate"
    },
    {
        key: 4,
        text: I18n.instance.t("common:lastUpdatedOn"),
        value: "lastUpdated"
    }
];

/**
 * Props for the Applications page.
 */
type ApplicationsPageInterface = TestableComponentInterface;

/**
 * Applications page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const ApplicationsPage: FunctionComponent<ApplicationsPageInterface> = (
    props: ApplicationsPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        APPLICATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const consumerAccountURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.accountApp?.tenantQualifiedPath);
    const [ isLoadingForTheFirstTime, setIsLoadingForTheFirstTime ] = useState<boolean>(true);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading,
        error: applicationListFetchRequestError,
        mutate: mutateApplicationListFetchRequest
    } = useApplicationList("advancedConfigurations,templateId", listItemLimit, listOffset, searchQuery);

    /**
     * Sets the initial spinner.
     * TODO: Remove this once the loaders are finalized.
     */
    useEffect(() => {
        if (isApplicationListFetchRequestLoading === false && isLoadingForTheFirstTime === true) {
            setIsLoadingForTheFirstTime(false);
        }
    }, [ isApplicationListFetchRequestLoading, isLoadingForTheFirstTime ]);

    /**
     * Handles the application list fetch request error.
     */
    useEffect(() => {

        if (!applicationListFetchRequestError) {
            return;
        }

        if (applicationListFetchRequestError.response
            && applicationListFetchRequestError.response.data
            && applicationListFetchRequestError.response.data.description) {
            dispatch(addAlert({
                description: applicationListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:develop.features.applications.notifications." +
                    "fetchApplications.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:develop.features.applications.notifications.fetchApplications" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:develop.features.applications.notifications." +
                "fetchApplications.genericError.message")
        }));
    }, [ applicationListFetchRequestError ]);

    /**
     * Sets the list sorting strategy.
     *
     * @param event - Synthetic event.
     * @param data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>,
        data: DropdownProps): void => {
        setListSortingStrategy(find(APPLICATIONS_LIST_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    /**
     * Checks if the `Next` page nav button should be shown.
     *
     * @param appList - List of applications.
     * @returns Boolean to show if the `Next` page nav button should be shown.
     */
    const shouldShowNextPageNavigation = (appList: ApplicationListInterface): boolean => {

        if (appList?.startIndex + appList?.count === appList?.totalResults + 1) {
            return false;
        }

        return true;
    };

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param query - Search query.
     */
    const handleApplicationFilter = (query: string): void => {
        setSearchQuery(query);
    };

    /**
     * Handles the pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handles per page dropdown page.
     *
     * @param event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>,
        data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles application delete action.
     */
    const handleApplicationDelete = (): void => {
        mutateApplicationListFetchRequest();
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setTriggerClearQuery(!triggerClearQuery);
    };

    /**
     * Renders the URL for the tenanted my account login.
     *
     * @returns React element
     */
    const renderTenantedMyAccountLink = (): ReactElement => {
        if (AppConstants.getTenant() === AppConstants.getSuperTenant() ||
            !applicationConfig.advancedConfigurations.showMyAccount) {
            return null;
        }

        return (
            <EmphasizedSegment
                className="mt-0 mb-5"
                data-componentid="application-consumer-account-link"
            >
                <List>
                    <List.Item>
                        <Grid verticalAlign="middle">
                            <Grid.Column
                                floated="left"
                                width={ 10 }
                            >
                                <GenericIcon
                                    icon={ getGeneralIcons().myAccountSolidIcon }
                                    className="mt-1"
                                    floated="left"
                                    size="tiny"
                                    spaced="right"
                                    verticalAlign="middle"
                                    inline
                                    square
                                    transparent
                                />
                                <List.Header
                                    data-componentid="application-consumer-account-link-title"
                                    className="my-account-title mb-1"
                                >
                                    { t("console:develop.features.applications.myaccount.title") }
                                    <Label size="tiny" className="preview-label ml-2">
                                        { t("common:preview") }
                                    </Label>
                                </List.Header>
                                <List.Description
                                    data-componentid="application-consumer-account-link-description"
                                >
                                    { t("console:develop.features.applications.myaccount.description") }
                                    <DocumentationLink
                                        link={ getLink("develop.applications.myaccount.learnMore") }
                                    >
                                        { t("common:learnMore") }
                                    </DocumentationLink>
                                </List.Description>
                            </Grid.Column>
                            <Popup
                                trigger={
                                    (<Grid.Column
                                        floated="right"
                                        width={ 6 }
                                    >
                                        <CopyInputField
                                            value={ consumerAccountURL }
                                            data-componentid={ "application-consumer-account-link-copy-field" }
                                        />
                                    </Grid.Column>)
                                }
                                content={ t("console:develop.features.applications.myaccount.popup") }
                                position="top center"
                                size="mini"
                                hideOnScroll
                                inverted
                            />
                        </Grid>
                    </List.Item>
                </List>
            </EmphasizedSegment>
        );
    };

    return (
        <PageLayout
            pageTitle="Applications"
            action={
                (!isApplicationListFetchRequestLoading && !(!searchQuery && applicationList?.totalResults <= 0))
                && (
                    <Show when={ AccessControlConstants.APPLICATION_WRITE }>
                        <PrimaryButton
                            disabled={ isApplicationListFetchRequestLoading }
                            loading={ isApplicationListFetchRequestLoading }
                            onClick={ (): void => {
                                eventPublisher.publish("application-click-new-application-button");
                                history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"));
                            } }
                            data-testid={ `${ testId }-list-layout-add-button` }
                        >
                            <Icon name="add"/>
                            { t("console:develop.features.applications.list.actions.add") }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("console:develop.pages.applications.title") }
            description={ (
                <p>
                    { t("console:develop.pages.applications.subTitle") }
                    <DocumentationLink
                        link={ getLink("develop.applications.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </p>
            ) }
            contentTopMargin={ (AppConstants.getTenant() === AppConstants.getSuperTenant()) }
            data-testid={ `${ testId }-page-layout` }
        >
            { !isLoadingForTheFirstTime? (
                <>
                    { renderTenantedMyAccountLink() }
                    { /* renderRemoteFetchStatus() */ }
                    <ListLayout
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleApplicationFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("common:name"),
                                        value: "name"
                                    },
                                    {
                                        key: 1,
                                        text: t("common:clientId"),
                                        value: "clientId"
                                    },
                                    {
                                        key: 2,
                                        text: t("common:issuer"),
                                        value: "issuer"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("console:develop.features.applications.advancedSearch.form" +
                                        ".inputs.filterAttribute.placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("console:develop.features.applications.advancedSearch.form" +
                                        ".inputs.filterCondition.placeholder")
                                }
                                filterValuePlaceholder={
                                    t("console:develop.features.applications.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                                }
                                placeholder={ t("console:develop.features.applications.advancedSearch.placeholder") }
                                customStyle={ { minWidth: "500px" } }
                                defaultSearchAttribute="name"
                                defaultSearchOperator="co"
                                predefinedDefaultSearchStrategy={
                                    "name co %search-value% or clientId co %search-value% or issuer co %search-value%"
                                }
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-list-advanced-search` }
                            />
                        ) }
                        currentListSize={ applicationList?.count }
                        listItemLimit={ listItemLimit }
                        onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                        onPageChange={ handlePaginationChange }
                        onSortStrategyChange={ handleListSortingStrategyOnChange }
                        showPagination={ true }
                        showTopActionPanel={
                            isApplicationListFetchRequestLoading
                        || !(!searchQuery && applicationList?.totalResults <= 0) }
                        sortOptions={ APPLICATIONS_LIST_SORTING_OPTIONS }
                        sortStrategy={ listSortingStrategy }
                        totalPages={ Math.ceil(applicationList?.totalResults / listItemLimit) }
                        totalListSize={ applicationList?.totalResults  }
                        paginationOptions={ {
                            disableNextButton: !shouldShowNextPageNavigation(applicationList)
                        } }
                        data-testid={ `${ testId }-list-layout` }
                    >
                        <ApplicationList
                            advancedSearch={ (
                                <AdvancedSearchWithBasicFilters
                                    onFilter={ handleApplicationFilter }
                                    filterAttributeOptions={ [
                                        {
                                            key: 0,
                                            text: t("common:name"),
                                            value: "name"
                                        },
                                        {
                                            key: 1,
                                            text: t("common:clientId"),
                                            value: "clientId"
                                        },
                                        {
                                            key: 2,
                                            text: t("common:issuer"),
                                            value: "issuer"
                                        }
                                    ] }
                                    filterAttributePlaceholder={
                                        t("console:develop.features.applications.advancedSearch." +
                                        "form.inputs.filterAttribute.placeholder")
                                    }
                                    filterConditionsPlaceholder={
                                        t("console:develop.features.applications.advancedSearch." +
                                        "form.inputs.filterCondition.placeholder")
                                    }
                                    filterValuePlaceholder={
                                        t("console:develop.features.applications.advancedSearch." +
                                        "form.inputs.filterValue.placeholder")
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.advancedSearch.placeholder")
                                    }
                                    defaultSearchAttribute="name"
                                    defaultSearchOperator="co"
                                    predefinedDefaultSearchStrategy={
                                        "name co %search-value% or clientId co %search-value% or " +
                                        "issuer co %search-value%"
                                    }
                                    triggerClearQuery={ triggerClearQuery }
                                    data-testid={ `${ testId }-list-advanced-search` }
                                />
                            ) }
                            featureConfig={ featureConfig }
                            isLoading={ isApplicationListFetchRequestLoading }
                            list={ applicationList }
                            onApplicationDelete={ handleApplicationDelete }
                            onEmptyListPlaceholderActionClick={
                                () => {
                                    history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"));
                                }
                            }
                            onSearchQueryClear={ handleSearchQueryClear }
                            searchQuery={ searchQuery }
                            data-testid={ `${ testId }-list` }
                            data-componentid="application"
                        />
                    </ListLayout>
                    { showWizard && (
                        <MinimalAppCreateWizard
                            title={ CustomApplicationTemplate?.name }
                            subTitle={ CustomApplicationTemplate?.description }
                            closeWizard={ (): void => setShowWizard(false) }
                            template={ CustomApplicationTemplate }
                            showHelpPanel={ true }
                            subTemplates={ CustomApplicationTemplate?.subTemplates }
                            subTemplatesSectionTitle={ CustomApplicationTemplate?.subTemplatesSectionTitle }
                            addProtocol={ false }
                            templateLoadingStrategy={
                                config.ui.applicationTemplateLoadingStrategy
                            ?? ApplicationManagementConstants.DEFAULT_APP_TEMPLATE_LOADING_STRATEGY
                            }
                        />
                    ) }
                </>
            ) : (
                <GridLayout
                    isLoading={ isLoadingForTheFirstTime }
                />
            )
            }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ApplicationsPage.defaultProps = {
    "data-testid": "applications"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApplicationsPage;
