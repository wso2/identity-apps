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

import { GearIcon } from "@oxygen-ui/react-icons";
import { Show } from "@wso2is/access-control";
import { ApplicationTemplateConstants } from "@wso2is/admin.application-templates.v1/constants/templates";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { getGeneralIcons } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { ResourceTypes } from "@wso2is/admin.template-core.v1/models/templates";
import ExtensionTemplatesProvider from "@wso2is/admin.template-core.v1/provider/extension-templates-provider";
import { AlertLevels, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import {
    CopyInputField,
    DocumentationLink,
    EmphasizedSegment,
    GenericIcon,
    ListLayout,
    PageLayout,
    Popup,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import find from "lodash-es/find";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Button,
    DropdownItemProps,
    DropdownProps,
    Grid,
    Icon,
    List,
    PaginationProps
} from "semantic-ui-react";
import { useApplicationList, useMyAccountApplicationData } from "../api/application";
import { useGetApplication } from "../api/use-get-application";
import { ApplicationList } from "../components/application-list";
import { ApplicationManagementConstants } from "../constants/application-management";
import { ApplicationAccessTypes, ApplicationListInterface, ApplicationListItemInterface } from "../models/application";
import "./applications.scss";

const APPLICATIONS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: I18n.instance.t("common:name") as ReactNode,
        value: "name"
    },
    {
        key: 2,
        text: I18n.instance.t("common:type") as ReactNode,
        value: "type"
    },
    {
        key: 3,
        text: I18n.instance.t("common:createdOn") as ReactNode,
        value: "createdDate"
    },
    {
        key: 4,
        text: I18n.instance.t("common:lastUpdatedOn") as ReactNode,
        value: "lastUpdated"
    }
];

/**
 * Props for the Applications page.
 */
type ApplicationsPageInterface = TestableComponentInterface & IdentifiableComponentInterface;

/**
 * Applications page.
 *
 * @param props - Props injected to the component.
 * @returns Applications listing page.
 */
const ApplicationsPage: FunctionComponent<ApplicationsPageInterface> = (
    props: ApplicationsPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch: Dispatch = useDispatch();

    const { UIConfig } = useUIConfig();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const applicationDisabledFeatures: string[] = useSelector((state: AppState) => {
        return state.config.ui.features?.applications?.disabledFeatures;
    });

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        APPLICATIONS_LIST_SORTING_OPTIONS[0]
    );
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const consumerAccountURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.accountApp?.tenantQualifiedPath);
    const [ isMyAccountEnabled, setMyAccountStatus ] = useState<boolean>(AppConstants.DEFAULT_MY_ACCOUNT_STATUS);
    // Note: If we are providing strong auth for applications use this state to handle it.
    const [ strongAuth, _setStrongAuth ] = useState<boolean>(undefined);
    const [ filteredApplicationList, setFilteredApplicationList ] = useState<ApplicationListInterface>(null);
    const [ myAccountAppId, setMyAccountAppId ] = useState<string>(null);

    const { organizationType } = useGetCurrentOrganizationType();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading,
        error: applicationListFetchRequestError,
        mutate: mutateApplicationListFetchRequest
    } = useApplicationList(
        "advancedConfigurations,templateId,clientId,issuer",
        listItemLimit,
        listOffset,
        searchQuery,
        true,
        true
    );

    const {
        data: myAccountApplicationData,
        isLoading: isMyAccountApplicationDataFetchRequestLoading,
        error: myAccountApplicationDataFetchRequestError
    } = useMyAccountApplicationData("advancedConfigurations,templateId,clientId,issuer");

    const {
        data: myAccountApplication,
        isLoading: isMyAccountApplicationGetRequestLoading,
        error: myAccountApplicationGetRequestError
    } = useGetApplication(myAccountAppId , !!myAccountAppId);

    /**
     * Set the application id for My Account.
     */
    useEffect(() => {
        if (myAccountApplicationData?.applications?.length === 1) {
            myAccountApplicationData.applications.forEach((
                item: ApplicationListItemInterface
            ) => {
                setMyAccountAppId(item?.id);
            });
        }
    }, [ myAccountApplicationData ]);

    /**
     * Sets the initial spinner.
     * TODO: Remove this once the loaders are finalized.
     */
    useEffect(() => {
        let status: boolean = AppConstants.DEFAULT_MY_ACCOUNT_STATUS;

        if (
            !isApplicationListFetchRequestLoading
                && !isMyAccountApplicationGetRequestLoading
                && !isMyAccountApplicationDataFetchRequestLoading
        ) {
            if (myAccountApplication) {
                status = myAccountApplication?.applicationEnabled;
            }
        }

        setMyAccountStatus(status);
    }, [
        isApplicationListFetchRequestLoading,
        isMyAccountApplicationGetRequestLoading,
        isMyAccountApplicationDataFetchRequestLoading,
        myAccountAppId
    ]);

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
                message: t("applications:notifications." +
                    "fetchApplications.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchApplications" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications." +
                "fetchApplications.genericError.message")
        }));
    }, [ applicationListFetchRequestError ]);

    /**
     * Handles the my account application fetch request error.
     */
    useEffect(() => {
        if (!myAccountApplicationDataFetchRequestError) {
            return;
        }

        if (myAccountApplicationDataFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: myAccountApplicationDataFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications." +
                    "fetchMyAccountApplication.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchMyAccountApplication" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications." +
                "fetchMyAccountApplication.genericError.message")
        }));
    }, [ myAccountApplicationDataFetchRequestError ]);

    /**
     * Handles the My Account application data fetch request error.
     */
    useEffect(() => {
        if (!myAccountApplicationGetRequestError) {
            return;
        }

        if (
            myAccountApplicationGetRequestError?.response?.data?.description
        ) {
            if (myAccountApplicationGetRequestError.response?.status === 404) {
                return;
            }

            dispatch(addAlert({
                description: myAccountApplicationGetRequestError.response.data.description ??
                    t("applications:myaccount.fetchMyAccountStatus.error.description"),
                level: AlertLevels.ERROR,
                message: t("applications:myaccount.fetchMyAccountStatus.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:myaccount.fetchMyAccountStatus" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:myaccount.fetchMyAccountStatus" +
                ".genericError.message")
        }));
    }, [ myAccountApplicationGetRequestError ]);

    /**
     * Filter out the system apps from the application list.
     * TODO: This implementation is a temporary one. This filtering should be
     * done from the backend side and should have a seperate endpoint to
     * access the system apps details.
     */
    useEffect(() => {

        if (applicationList?.applications) {
            const appList: ApplicationListInterface = cloneDeep(applicationList);

            appList.count = appList.count - (applicationList.applications.length - appList.applications.length);
            appList.totalResults = appList.totalResults -
                (applicationList.applications.length - appList.applications.length);

            setFilteredApplicationList(appList);
        }
    }, [ applicationList ]);

    /**
     * Sets the list sorting strategy.
     *
     * @param event - The event.
     * @param data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>,
        data: DropdownProps): void => {
        setListSortingStrategy(find(APPLICATIONS_LIST_SORTING_OPTIONS, (option: DropdownItemProps) => {
            return data.value === option.value;
        }));
    };

    /**
     * Checks if the `Next` page nav button should be shown.
     *
     * @param appList - List of applications.
     * @returns `true` if `Next` page nav button should be shown.
     */
    const shouldShowNextPageNavigation = (appList: ApplicationListInterface): boolean => {

        return appList?.startIndex + appList?.count !== appList?.totalResults + 1;
    };

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param query - Search query.
     */
    const handleApplicationFilter = (query: string): void => {
        setSearchQuery(query);
        setListOffset(0);
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
     * Navigate to the my account edit page.
     */
    const navigateToMyAccountSettings = (): void => {
        if (strongAuth) {
            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(
                    ":id", myAccountApplicationData?.applications[0]?.id
                ),
                search: `?${ ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_KEY }=${
                    ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_VALUE }`
            });
        } else {
            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(
                    ":id", myAccountApplicationData?.applications[0]?.id
                ),
                search: myAccountApplicationData?.applications[0]?.access === ApplicationAccessTypes.READ
                    ? `?${ ApplicationManagementConstants.APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY }=true`
                    : ""
            });
        }
    };

    /**
     * Renders the URL for the tenanted my account login.
     *
     * @returns My Account link.
     */
    const renderTenantedMyAccountLink = (): ReactElement => {
        if (
            !applicationConfig.advancedConfigurations.showMyAccount
            || UIConfig?.legacyMode?.applicationListSystemApps
        ) {
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
                                mobile={ 16 }
                                computer={ 9 }
                                verticalAlign="middle"
                            >
                                <GenericIcon
                                    icon={ getGeneralIcons().myAccountSolidIcon }
                                    floated="left"
                                    size="mini"
                                    spaced="right"
                                    verticalAlign="middle"
                                    inline
                                    square
                                    transparent
                                />
                                <List.Content verticalAlign="middle">
                                    <List.Header
                                        data-componentid="application-consumer-account-link-title"
                                        className="my-account-title"
                                    >
                                        { t("applications:myaccount.title") }
                                        {
                                            applicationConfig?.advancedConfigurations?.showMyAccountStatus && (
                                                <Icon
                                                    color={ isMyAccountEnabled ? "green" : "grey" }
                                                    name={ isMyAccountEnabled ? "check circle" : "minus circle" }
                                                    className="middle aligned ml-1"
                                                />
                                            )
                                        }
                                    </List.Header>
                                    <List.Description
                                        data-componentid="application-consumer-account-link-description"
                                    >
                                        { t("applications:myaccount.description") }
                                        <DocumentationLink
                                            link={ getLink("develop.applications.myaccount.learnMore") }
                                        >
                                            { t("common:learnMore") }
                                        </DocumentationLink>
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                            { isMyAccountEnabled ? (
                                <Popup
                                    trigger={ (
                                        <Grid.Column
                                            mobile={ 16 }
                                            computer={ 6 }
                                            className="pr-0"
                                        >
                                            <CopyInputField
                                                value={ consumerAccountURL }
                                                data-componentid={ "application-consumer-account-link-copy-field" }
                                            />
                                        </Grid.Column>
                                    ) }
                                    content={ t("applications:myaccount.popup") }
                                    position="top center"
                                    size="mini"
                                    hideOnScroll
                                    inverted
                                />
                            ) : null
                            }
                            <Grid.Column
                                mobile={ 16 }
                                computer={ 1 }
                            >
                                { (
                                    <Popup
                                        trigger={ (
                                            <Button
                                                className="my-account-settings-button"
                                                data-componentid="navigate-to-my-account-settings-button"
                                                onClick={ (): void => navigateToMyAccountSettings() }
                                            >
                                                <GearIcon />
                                            </Button>
                                        ) }
                                        content={ t("applications:myaccount.settings") }
                                        position="top center"
                                        size="mini"
                                        hideOnScroll
                                        inverted
                                    />
                                ) }
                            </Grid.Column>
                        </Grid>
                    </List.Item>
                </List>
            </EmphasizedSegment>
        );
    };

    const handleSettingsButton = () => {
        history.push(AppConstants.getPaths().get("APPLICATIONS_SETTINGS"));
    };

    return (
        <ExtensionTemplatesProvider
            resourceType={ ResourceTypes.APPLICATIONS }
            categories={ ApplicationTemplateConstants.SUPPORTED_CATEGORIES_INFO }
        >
            <PageLayout
                pageTitle="Applications"
                action={ (organizationType !== OrganizationType.SUBORGANIZATION &&
                    filteredApplicationList?.totalResults > 0) ? (
                        <>
                            <Show when={ featureConfig?.applications?.scopes?.create }>
                                {
                                    !applicationDisabledFeatures?.includes(
                                        ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATIONS_SETTINGS")
                                    ) &&
                                    (
                                        <Popup
                                            trigger={ (
                                                <Button
                                                    data-componentid={ "applications-settings-button" }
                                                    icon={ GearIcon }
                                                    onClick={ handleSettingsButton }
                                                />
                                            ) }
                                            content={ t("applications:forms.applicationsSettings.title") }
                                            position="top center"
                                            size="mini"
                                            hideOnScroll
                                            inverted
                                        />
                                    )
                                }
                            </Show>
                            <Show
                                when={ featureConfig?.applications?.scopes?.create }
                            >
                                <PrimaryButton
                                    onClick={ (): void => {
                                        eventPublisher.publish("application-click-new-application-button");
                                        history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"));
                                    } }
                                    data-testid={ `${ testId }-list-layout-add-button` }
                                >
                                    <Icon name="add" />
                                    { t("applications:list.actions.add") }
                                </PrimaryButton>
                            </Show>
                        </>
                    ) : (
                        <Show when={ featureConfig?.applications?.scopes?.create }>
                            {
                                !applicationDisabledFeatures?.includes(
                                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATIONS_SETTINGS")
                                ) &&
                                (
                                    <Popup
                                        trigger={ (
                                            <Button
                                                data-componentid={ "applications-settings-button" }
                                                icon={ GearIcon }
                                                onClick={ handleSettingsButton }
                                            />
                                        ) }
                                        content={ t("applications:applicationsSettings.title") }
                                        position="top center"
                                        size="mini"
                                        hideOnScroll
                                        inverted
                                    />
                                )
                            }
                        </Show>

                    ) }
                title={ t("console:develop.pages.applications.title") }
                description={ organizationType !== OrganizationType.SUBORGANIZATION
                    ? (
                        <p>
                            { t("console:develop.pages.applications.subTitle") }
                            <DocumentationLink
                                link={ getLink("develop.applications.learnMore") }
                            >
                                { t("common:learnMore") }
                            </DocumentationLink>
                        </p>
                    )
                    : (
                        <p>
                            { t("console:develop.pages.applications.alternateSubTitle") }
                            <DocumentationLink
                                link={ getLink("develop.applications.learnMore") }
                            >
                                { t("common:learnMore") }
                            </DocumentationLink>
                        </p>
                    )
                }
                contentTopMargin={ (AppConstants.getTenant() === AppConstants.getSuperTenant()) }
                data-testid={ `${ testId }-page-layout` }
            >
                {
                    !isMyAccountApplicationDataFetchRequestLoading
                        && myAccountApplicationData?.applications?.length !== 0
                        && renderTenantedMyAccountLink()
                }
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
                            placeholder={ t("applications:advancedSearch.placeholder") }
                            style={ { minWidth: "425px" } }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
                            predefinedDefaultSearchStrategy={
                                "name co %search-value% or clientId co %search-value% or issuer co %search-value%"
                            }
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-list-advanced-search` }
                        />
                    ) }
                    currentListSize={ filteredApplicationList?.count }
                    isLoading={
                        isApplicationListFetchRequestLoading || isMyAccountApplicationDataFetchRequestLoading
                    }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleListSortingStrategyOnChange }
                    showPagination={ true }
                    showTopActionPanel={
                        isApplicationListFetchRequestLoading
                        || isMyAccountApplicationDataFetchRequestLoading
                        || !(!searchQuery && filteredApplicationList?.totalResults <= 0) }
                    sortOptions={ APPLICATIONS_LIST_SORTING_OPTIONS }
                    sortStrategy={ listSortingStrategy }
                    totalPages={ Math.ceil(filteredApplicationList?.totalResults / listItemLimit) }
                    totalListSize={ filteredApplicationList?.totalResults }
                    paginationOptions={ {
                        disableNextButton: !shouldShowNextPageNavigation(filteredApplicationList)
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
                                    t("applications:advancedSearch." +
                                        "form.inputs.filterAttribute.placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("applications:advancedSearch." +
                                        "form.inputs.filterCondition.placeholder")
                                }
                                filterValuePlaceholder={
                                    t("applications:advancedSearch." +
                                        "form.inputs.filterValue.placeholder")
                                }
                                placeholder={
                                    t("applications:advancedSearch.placeholder")
                                }
                                style={ { minWidth: "425px" } }
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
                        isSetStrongerAuth={ strongAuth }
                        isLoading={
                            isApplicationListFetchRequestLoading || isMyAccountApplicationDataFetchRequestLoading
                        }
                        list={ filteredApplicationList }
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
            </PageLayout>
        </ExtensionTemplatesProvider>
    );
};

/**
 * Default props for the component.
 */
ApplicationsPage.defaultProps = {
    "data-componentid": "applications",
    "data-testid": "applications"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApplicationsPage;
