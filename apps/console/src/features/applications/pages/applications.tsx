/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import {
    ConfirmationModal,
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
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    Checkbox,
    CheckboxProps,
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
import { updateMyAccountStatus, useApplicationList, useMyAccountStatus } from "../api";
import { ApplicationList, MinimalAppCreateWizard } from "../components";
import { ApplicationManagementConstants } from "../constants";
import CustomApplicationTemplate
    from "../data/application-templates/templates/custom-application/custom-application.json";
import { ApplicationListInterface } from "../models";

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
type ApplicationsPageInterface = TestableComponentInterface;

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

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        APPLICATIONS_LIST_SORTING_OPTIONS[0]
    );
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const consumerAccountURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.accountApp?.tenantQualifiedPath);
    const [ isLoadingForTheFirstTime, setIsLoadingForTheFirstTime ] = useState<boolean>(true);
    const [ isMyAccountEnabled, setMyAccountStatus ] = useState<boolean>(AppConstants.DEFAULT_MY_ACCOUNT_STATUS);
    const [ showMyAccountStatusEnableModal, setShowMyAccountStatusEnableConfirmationModal ] = useState<boolean>(false);
    const [ showMyAccountStatusDisableModal,
        setShowMyAccountStatusDisableConfirmationModal ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading,
        error: applicationListFetchRequestError,
        mutate: mutateApplicationListFetchRequest
    } = useApplicationList("advancedConfigurations,templateId,clientId,issuer", listItemLimit, listOffset, searchQuery);

    const {
        data: myAccountStatus,
        isLoading: isMyAccountStatusLoading,
        error: myAccountStatusFetchRequestError,
        mutate: mutateMyAccountStatusFetchRequest
    } = useMyAccountStatus();

    /**
     * Sets the initial spinner.
     * TODO: Remove this once the loaders are finalized.
     */
    useEffect(() => {
        if (isApplicationListFetchRequestLoading === false && isMyAccountStatusLoading === false
            && isLoadingForTheFirstTime === true) {
            let status: boolean = AppConstants.DEFAULT_MY_ACCOUNT_STATUS;

            if (myAccountStatus) {
                const enableProperty = myAccountStatus["value"];

                if (enableProperty && enableProperty === "false") {
                    status = false;
                }
            }
            setMyAccountStatus(status);
            setIsLoadingForTheFirstTime(false);
        }
    }, [ isApplicationListFetchRequestLoading, isMyAccountStatusLoading, isLoadingForTheFirstTime ]);

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
     * Handles the application list fetch request error.
     */
    useEffect(() => {

        if (!myAccountStatusFetchRequestError) {
            return;
        }

        if (myAccountStatusFetchRequestError.response
            && myAccountStatusFetchRequestError.response.data
            && myAccountStatusFetchRequestError.response.data.description) {
            if (myAccountStatusFetchRequestError.response.status === 404) {
                return;
            }
            dispatch(addAlert({
                description: myAccountStatusFetchRequestError.response.data.description ??
                    t("console:develop.features.applications.myaccount.fetchMyAccountStatus.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.applications.myaccount.fetchMyAccountStatus.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:develop.features.applications.myaccount.fetchMyAccountStatus" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:develop.features.applications.myaccount.fetchMyAccountStatus" +
                ".genericError.message")
        }));
    }, [ myAccountStatusFetchRequestError ]);

    /**
     * Sets the list sorting strategy.
     *
     * @param event - The event.
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
     * Handles the My Account Portal status update action.
     *
     * @param e - SyntheticEvent of My Account toggle.
     * @param data - CheckboxProps of My Account toggle.
     */
    const handleMyAccountStatusToggle = (e: SyntheticEvent, data: CheckboxProps): void => {

        if (data.checked) {
            setShowMyAccountStatusEnableConfirmationModal(true);
        } else {
            setShowMyAccountStatusDisableConfirmationModal(true);
        }
    };

    /**
     * Update the My Account Portal status.
     *
     * @param status - New status of the My Account portal.
     */
    const handleUpdateMyAccountStatus = (status: boolean): void => {

        updateMyAccountStatus(status)
            .then(() => {
                setMyAccountStatus(status);
                mutateMyAccountStatusFetchRequest();
                dispatch(addAlert({
                    description: t("console:develop.features.applications.myaccount.notifications.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.myaccount.notifications.success.message")
                }));

            }).catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:develop.features.applications.myaccount.notifications.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:develop.features.applications.myaccount.notifications.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t(
                        "console:develop.features.applications.myaccount.notifications.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.myaccount.notifications.genericError.message")
                }));
            });
    };


    /**
     * Renders a confirmation modal when the My Account Portal status is being enabled.
     * @returns My Account status enabling warning modal.
     */
    const renderMyAccountStatusEnableWarning = (): ReactElement => {

        return (
            <ConfirmationModal
                onClose={ (): void => setShowMyAccountStatusEnableConfirmationModal(false) }
                type="warning"
                open={ showMyAccountStatusEnableModal }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={
                    (): void => {
                        setShowMyAccountStatusEnableConfirmationModal(false);
                    }
                }
                onPrimaryActionClick={
                    (): void => {
                        setShowMyAccountStatusEnableConfirmationModal(false);
                        handleUpdateMyAccountStatus(true);
                    }
                }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("console:develop.features.applications.myaccount.Confirmation.enableConfirmation.heading") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                >
                    { t("console:develop.features.applications.myaccount.Confirmation.enableConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("console:develop.features.applications.myaccount.Confirmation.enableConfirmation.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };


    /**
     * Renders a confirmation modal when the My Account Portal status is being disabled.
     * @returns My Account status disabling warning modal.
     */
    const renderMyAccountStatusDisableWarning = (): ReactElement => {

        return (
            <ConfirmationModal
                onClose={ (): void => setShowMyAccountStatusDisableConfirmationModal(false) }
                type="warning"
                open={ showMyAccountStatusDisableModal }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={
                    (): void => {
                        setShowMyAccountStatusDisableConfirmationModal(false);
                    }
                }
                onPrimaryActionClick={
                    (): void => {
                        setShowMyAccountStatusDisableConfirmationModal(false);
                        handleUpdateMyAccountStatus(false);
                    }
                }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("console:develop.features.applications.myaccount.Confirmation.disableConfirmation.heading") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                >
                    { t("console:develop.features.applications.myaccount.Confirmation.disableConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("console:develop.features.applications.myaccount.Confirmation.disableConfirmation.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Renders the URL for the tenanted my account login.
     *
     * @returns My Account link.
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
                                mobile={ 16 }
                                computer={ 5 }
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
                            { isMyAccountEnabled? (
                                <Popup
                                    trigger={
                                        (<Grid.Column
                                            mobile={ 16 }
                                            computer={ 6 }
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
                                /> ) : null
                            }
                            <Grid.Column
                                mobile={ 16 }
                                computer={ 5 }
                            >
                                <Checkbox
                                    className="right floated mr-3"
                                    label={ t( isMyAccountEnabled ?
                                        "console:develop.features.applications.myaccount.enable.0" :
                                        "console:develop.features.applications.myaccount.enable.1") }
                                    toggle
                                    onChange={ handleMyAccountStatusToggle }
                                    checked={ isMyAccountEnabled }
                                    data-testId={ `${ testId }-myaccount-status-update-toggle` }
                                />
                            </Grid.Column>
                        </Grid>
                    </List.Item>
                </List>
                { showMyAccountStatusEnableModal && renderMyAccountStatusEnableWarning() }
                { showMyAccountStatusDisableModal && renderMyAccountStatusDisableWarning() }
            </EmphasizedSegment>
        );
    };

    return (
        <PageLayout
            pageTitle="Applications"
            action={
                (!isApplicationListFetchRequestLoading && !isMyAccountStatusLoading
                    &&!(!searchQuery && applicationList?.totalResults <= 0))
                && (
                    <Show when={ AccessControlConstants.APPLICATION_WRITE }>
                        <PrimaryButton
                            disabled={ isApplicationListFetchRequestLoading || isMyAccountStatusLoading }
                            loading={ isApplicationListFetchRequestLoading || isMyAccountStatusLoading }
                            onClick={ (): void => {
                                eventPublisher.publish("application-click-new-application-button");
                                history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"));
                            } }
                            data-testid={ `${ testId }-list-layout-add-button` }
                        >
                            <Icon name="add" />
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
            { !isLoadingForTheFirstTime ? (
                <>
                    { renderTenantedMyAccountLink() }
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
                        totalListSize={ applicationList?.totalResults }
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
                            isLoading={ isApplicationListFetchRequestLoading || isMyAccountStatusLoading }
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
