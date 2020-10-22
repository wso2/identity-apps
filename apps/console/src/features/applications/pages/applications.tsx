/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { LinkButton, ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import _ from "lodash";
import moment from "moment";
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
    Button,
    DropdownItemProps, 
    DropdownProps,
    Icon,
    Menu,
    PaginationProps,
    Popup,
} from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    history
} from "../../core";
import { 
    InterfaceRemoteConfigDetails, 
    InterfaceRemoteRepoConfig, 
    InterfaceRemoteRepoListResponse, 
    getRemoteRepoConfig, 
    getRemoteRepoConfigList, 
    triggerConfigDeployment 
} from "../../remote-repository-configuration";
import { getApplicationList } from "../api";
import { ApplicationList } from "../components";
import { RemoteFetchDetails } from "../components/remote-fetch-details";
import { ApplicationManagementConstants } from "../constants";
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
 * @param {ApplicationsPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const ApplicationsPage: FunctionComponent<ApplicationsPageInterface> = (
    props: ApplicationsPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        APPLICATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ appList, setAppList ] = useState<ApplicationListInterface>({});
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listOffsetAddition, setListOffsetAddition ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isApplicationListRequestLoading, setApplicationListRequestLoading ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ remoteConfig, setRemoteConfig ] = useState<InterfaceRemoteRepoConfig>(undefined);
    const [ remoteConfigDetails, setRemoteConfigDetails ] = useState<InterfaceRemoteConfigDetails>(undefined);
    const [ openRemoteFetchDetails, setOpenRemoteFetchDetails ] = useState<boolean>(false);

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        getAppLists(listItemLimit, listOffset, null);
    }, [ listOffset, listItemLimit ]);

    useEffect(() => {
        getRemoteConfigList();
    }, [ remoteConfig != undefined ]);

    /**
     * Retrieves the list of applications.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getAppLists = (limit: number, offset: number, filter: string): void => {
        setApplicationListRequestLoading(true);

        getApplicationList(limit, offset, filter)
            .then((response) => {
                let isLocalSPFound = false;
                for (const app of response.applications){
                    if (app.name === ApplicationManagementConstants.WSO2_CARBON_LOCAL_SP) {
                        isLocalSPFound = true;
                        break;
                    }
                }

                if (isLocalSPFound) {
                    getApplicationList(limit + 1, offset, filter).then((response) => {
                        setAppList(response);
                        setListOffsetAddition(1);
                    })
                } else {
                    setAppList(response);
                }

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.fetchApplications.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.applications.notifications.fetchApplications.genericError.message")
                }));
            })
            .finally(() => {
                setApplicationListRequestLoading(false);
            });
    };
    
    /**
     * Util method to get remote configuration list 
     */
    const getRemoteConfigList = () => {
        getRemoteRepoConfigList().then((remoteRepoList: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
            if (remoteRepoList.status == 200 && remoteRepoList.data.count > 0 ) {
                setRemoteConfig(remoteRepoList.data.remotefetchConfigurations[0]);
                getRemoteRepoConfig(remoteRepoList.data.remotefetchConfigurations[0].id).then((
                    response: AxiosResponse<InterfaceRemoteConfigDetails>
                ) => {
                    setRemoteConfigDetails(response.data);
                }).catch(() => {
                    dispatch(addAlert({
                        description: "Error while retrieving remote configuration details",
                        level: AlertLevels.ERROR,
                        message: "There was an error while fetching the remote configuration details."
                    }));
                })
            }
        }).catch(() => {
            dispatch(addAlert({
                description: "Error while retrieving remote configuration details",
                level: AlertLevels.ERROR,
                message: "There was an error while fetching the remote configuration details."
            }));
        })
    }

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>,
                                               data: DropdownProps): void => {
        setListSortingStrategy(_.find(APPLICATIONS_LIST_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param {string} query - Search query.
     */
    const handleApplicationFilter = (query: string): void => {
        setSearchQuery(query);
        getAppLists(listItemLimit, listOffset, query);
    };

    /**
     * Handles the pagination change.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {PaginationProps} data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset((data.activePage as number - 1) * listItemLimit + listOffsetAddition);
    };

    /**
     * Handles per page dropdown page.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>,
                                              data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles application delete action.
     */
    const handleApplicationDelete = (): void => {
        getAppLists(listItemLimit, listOffset, null);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        getAppLists(listItemLimit, listOffset, null);
        setTriggerClearQuery(!triggerClearQuery);
    };

    const getHumanizedDeployment = (date: any): string => {
        const now = moment(new Date());
        const receivedDate = moment(date);
        return "Last deployed " +   moment.duration(now.diff(receivedDate)).humanize() + " ago";
    }

    return (
        <PageLayout
            action={
                (isApplicationListRequestLoading || !(!searchQuery && appList?.totalResults <= 0))
                && (hasRequiredScopes(featureConfig?.applications, featureConfig?.applications?.scopes?.create,
                    allowedScopes))
                && (
                    <PrimaryButton
                        onClick={ (): void => {
                            history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"));
                        } }
                        data-testid={ `${ testId }-list-layout-add-button` }
                    >
                        <Icon name="add"/>
                        { t("devPortal:components.applications.list.actions.add") }
                    </PrimaryButton>
                )
            }
            title={ t("devPortal:pages.applications.title") }
            description={ t("devPortal:pages.applications.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            {
                openRemoteFetchDetails &&
                    <RemoteFetchDetails 
                        isOpen={ openRemoteFetchDetails }
                        onClose={ ()=> {
                            setOpenRemoteFetchDetails(false);
                        } }
                        remoteDeployment={ remoteConfigDetails }
                    />
            }
            {
                remoteConfig &&
                <Menu size="small" borderless className="mb-6">
                    <Menu.Item active header>Remote Configurations</Menu.Item>
                    {
                        remoteConfigDetails?.status?.failedDeployments &&
                        <>
                            <Menu.Item className="pr-3">
                                <Icon.Group className="mr-2" size="large">
                                    <Icon name="fork" />
                                    <Icon 
                                        color="green" 
                                        corner="bottom right" 
                                        name="checkmark" 
                                    />
                                </Icon.Group>
                                {
                                    remoteConfigDetails?.status?.successfulDeployments > 0 ?
                                    <strong className="mr-1">{ 
                                        remoteConfigDetails?.status?.successfulDeployments 
                                    }</strong>
                                    :
                                    remoteConfigDetails?.status?.successfulDeployments
                                } Successful
                            </Menu.Item>
                            <Menu.Item className="pl-1 pr-3">
                                <Icon.Group className="mr-2" size="large">
                                    <Icon name="fork" />
                                    <Icon 
                                        color="red" 
                                        corner="bottom right" 
                                        name="cancel" 
                                    />
                                </Icon.Group>
                                {
                                    remoteConfigDetails?.status?.failedDeployments > 0 ?
                                    <strong className="mr-1">{ 
                                        remoteConfigDetails?.status?.failedDeployments 
                                    }</strong>
                                    :
                                    remoteConfigDetails?.status?.failedDeployments
                                } Failed
                                {
                                    remoteConfigDetails?.status?.lastSynchronizedTime  &&
                                    <LinkButton 
                                        className="ml-2" 
                                        compact
                                        onClick={ () => {
                                            setOpenRemoteFetchDetails(true);
                                        } }
                                    >
                                        Details
                                    </LinkButton>
                                }
                            </Menu.Item>
                            <Menu.Item className="pl-1">
                                <Icon.Group className="mr-2" size="large">
                                    <Icon name="calendar alternate outline" />
                                </Icon.Group>
                                { getHumanizedDeployment(remoteConfigDetails?.status?.lastSynchronizedTime) }
                            </Menu.Item>
                        </>
                    }
                    <Menu.Item compact position="right">
                        <Popup
                            content={ remoteConfigDetails?.repositoryManagerAttributes?.uri }
                            header="Github Repository URL"
                            on="click"
                            pinned
                            offset={ "35%" }
                            position="top right"
                            trigger={
                                <Icon.Group className="mr-3 p-1 link">
                                    <Icon name="linkify"></Icon>
                                </Icon.Group>
                            }
                        />
                        <Button 
                            basic 
                            icon 
                            labelPosition="left"
                            onClick={ ()=> {
                                triggerConfigDeployment(remoteConfigDetails.id).then((response: AxiosResponse<any>) => {
                                    if (response.status === 202) {
                                        dispatch(addAlert({
                                            description: "The applications were successfully refetched.",
                                            level: AlertLevels.SUCCESS,
                                            message: "Successfully fetched applications."
                                        }));

                                        setTimeout(()=> {
                                            getRemoteConfigList();
                                        }, 3000)
                                    }
                                }).catch(() => {
                                    dispatch(addAlert({
                                        description: "There was an error while fetching the applications",
                                        level: AlertLevels.ERROR,
                                        message: "Error while refetching applications"
                                    }));
                                })
                            } }
                        >
                            <Icon name="retweet" />
                            Refetch
                        </Button>
                    </Menu.Item>
                </Menu>
            }
            
            <ListLayout
                advancedSearch={
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleApplicationFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("devPortal:components.applications.advancedSearch.form.inputs.filterAttribute" +
                                ".placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("devPortal:components.applications.advancedSearch.form.inputs.filterCondition" +
                                ".placeholder")
                        }
                        filterValuePlaceholder={
                            t("devPortal:components.applications.advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder={ t("devPortal:components.applications.advancedSearch.placeholder") }
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        data-testid={ `${ testId }-list-advanced-search` }
                    />
                }
                currentListSize={ appList.count }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                showPagination={ true }
                showTopActionPanel={ isApplicationListRequestLoading || !(!searchQuery && appList?.totalResults <= 0) }
                sortOptions={ APPLICATIONS_LIST_SORTING_OPTIONS }
                sortStrategy={ listSortingStrategy }
                totalPages={ Math.ceil(appList.totalResults / listItemLimit) }
                totalListSize={ appList.totalResults }
                data-testid={ `${ testId }-list-layout` }
            >
                <ApplicationList
                    advancedSearch={
                        <AdvancedSearchWithBasicFilters
                            onFilter={ handleApplicationFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("common:name"),
                                    value: "name"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("devPortal:components.applications.advancedSearch.form.inputs.filterAttribute" +
                                    ".placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("devPortal:components.applications.advancedSearch.form.inputs.filterCondition" +
                                    ".placeholder")
                            }
                            filterValuePlaceholder={
                                t("devPortal:components.applications.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                            }
                            placeholder={ t("devPortal:components.applications.advancedSearch.placeholder") }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-list-advanced-search` }
                        />
                    }
                    featureConfig={ featureConfig }
                    isLoading={ isApplicationListRequestLoading }
                    list={ appList }
                    onApplicationDelete={ handleApplicationDelete }
                    onEmptyListPlaceholderActionClick={
                        () => history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"))
                    }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-testid={ `${ testId }-list` }
                />
            </ListLayout>
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
