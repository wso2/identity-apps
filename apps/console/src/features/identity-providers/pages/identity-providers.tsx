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

import { getRawDocumentation } from "@wso2is/core/api";
import { TestableComponentInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";
import {
    ContentLoader,
    HelpPanelLayout,
    HelpPanelTabInterface,
    ListLayout,
    Markdown,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, MouseEvent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    HelpPanelActionIcons,
    HelpPanelUtils,
    PortalDocumentationStructureInterface,
    UIConstants,
    history,
    setHelpPanelDocsContentURL
} from "../../core";
import { getIdentityProviderList } from "../api";
import { IdentityProviderList, handleGetIDPListCallError } from "../components";
import { HelpPanelIcons } from "../configs";
import { IdentityProviderManagementConstants } from "../constants";
import { IdentityProviderListResponseInterface } from "../models";

/**
 * Proptypes for the IDP edit page component.
 */
type IDPPropsInterface = TestableComponentInterface

const IDENTITY_PROVIDER_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: "Name",
        value: "name"
    },
    {
        key: 2,
        text: "Type",
        value: "type"
    },
    {
        key: 3,
        text: "Created date",
        value: "createdDate"
    },
    {
        key: 4,
        text: "Last updated",
        value: "lastUpdated"
    }
];

/**
 * Overview page.
 *
 * @return {React.ReactElement}
 */
const IdentityProvidersPage: FunctionComponent<IDPPropsInterface> = (
    props: IDPPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const helpPanelDocURL: string = useSelector((state: AppState) => state.helpPanel.docURL);
    const helpPanelDocStructure: PortalDocumentationStructureInterface = useSelector(
        (state: AppState) => state.helpPanel.docStructure);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        IDENTITY_PROVIDER_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ idpList, setIdPList ] = useState<IdentityProviderListResponseInterface>({});
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ helpPanelDocContent, setHelpPanelDocContent ] = useState<string>(undefined);
    const [
        isHelpPanelDocContentRequestLoading,
        setHelpPanelDocContentRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     * Set the default doc content URL for the tab.
     */
    useEffect(() => {
        if (_.isEmpty(helpPanelDocStructure)) {
            return;
        }

        const overviewDocs = _.get(helpPanelDocStructure, IdentityProviderManagementConstants.IDP_OVERVIEW_DOCS_KEY);

        if (!overviewDocs) {
            return;
        }

        dispatch(setHelpPanelDocsContentURL(overviewDocs));
    }, [ helpPanelDocStructure, dispatch ]);

    /**
     * Called when help panel doc URL status changes.
     */
    useEffect(() => {
        if (!helpPanelDocURL) {
            return;
        }

        setHelpPanelDocContentRequestLoadingStatus(true);

        getRawDocumentation<string>(
            config.endpoints.documentationContent,
            helpPanelDocURL,
            config.deployment.documentation.provider,
            config.deployment.documentation.githubOptions.branch)
            .then((response) => {
                setHelpPanelDocContent(response);
            })
            .finally(() => {
                setHelpPanelDocContentRequestLoadingStatus(false);
            });
    }, [
        helpPanelDocURL,
        config.endpoints.documentationContent,
        config.deployment.documentation.provider,
        config.deployment.documentation.githubOptions.branch
    ]);

    /**
     * Retrieves the list of identity providers.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getIdPList = (limit: number, offset: number, filter: string): void => {
        setIdPListRequestLoading(true);

        getIdentityProviderList(limit, offset, filter)
            .then((response) => {
                setIdPList(response);
            })
            .catch((error) => {
                handleGetIDPListCallError(error);
            })
            .finally(() => {
                setIdPListRequestLoading(false);
            });
    };

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        getIdPList(listItemLimit, listOffset, null);
    }, [ listOffset, listItemLimit ]);

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>,
                                               data: DropdownProps): void => {
        setListSortingStrategy(_.find(IDENTITY_PROVIDER_LIST_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    /**
     * Handles the `onFilter` callback action from the
     * identity provider search component.
     *
     * @param {string} query - Search query.
     */
    const handleIdentityProviderFilter = (query: string): void => {
        setSearchQuery(query);
        getIdPList(listItemLimit, listOffset, query);
    };

    /**
     * Handles the pagination change.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {PaginationProps} data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
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
     * Handles identity provider delete action.
     */
    const handleIdentityProviderDelete = (): void => {
        getIdPList(listItemLimit, listOffset, null);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        getIdPList(listItemLimit, listOffset, null);
        setTriggerClearQuery(!triggerClearQuery);
    };

    const helpPanelTabs: HelpPanelTabInterface[] = [
        {
            content: (
                isHelpPanelDocContentRequestLoading
                    ? <ContentLoader dimmer/>
                    : (
                        <Markdown
                            source={ helpPanelDocContent }
                            transformImageUri={ (uri) =>
                                uri.startsWith("http" || "https")
                                    ? uri
                                    : config.deployment.documentation?.imagePrefixURL + "/"
                                        + StringUtils.removeDotsAndSlashesFromRelativePath(uri)
                            }
                            data-testid={ `${ testId }-help-panel-docs-tab-markdown-renderer` }
                        />
                    )
            ),
            heading: t("common:docs"),
            hidden: !helpPanelDocURL,
            icon: {
                icon: HelpPanelIcons.tabs.docs
            }
        }
    ];

    return (
        <HelpPanelLayout
            sidebarDirection="right"
            sidebarMiniEnabled={ true }
            tabs={ helpPanelTabs }
            onHelpPanelPinToggle={ () => HelpPanelUtils.togglePanelPin() }
            isPinned={ HelpPanelUtils.isPanelPinned() }
            icons={ {
                close: HelpPanelActionIcons.close,
                pin: HelpPanelActionIcons.pin
            } }
            sidebarToggleTooltip={ t("devPortal:components.helpPanel.actions.open") }
            pinButtonTooltip={ t("devPortal:components.helpPanel.actions.pin") }
            unpinButtonTooltip={ t("devPortal:components.helpPanel.actions.unPin") }
        >
            <PageLayout
                action={
                    (isIdPListRequestLoading || !(!searchQuery && idpList?.totalResults <= 0))
                    && (
                        <PrimaryButton
                            onClick={ (): void => {
                                history.push(AppConstants.getPaths().get("IDP_TEMPLATES"));
                            } }
                            data-testid={ `${ testId }-add-button` }
                        >
                            <Icon name="add"/>{ t("devPortal:components.idp.buttons.addIDP") }
                        </PrimaryButton>
                    )
                }
                title={ t("devPortal:pages.idp.title") }
                description={ t("devPortal:pages.idp.subTitle") }
                data-testid={ `${ testId }-page-layout` }
            >
                <ListLayout
                    advancedSearch={
                        <AdvancedSearchWithBasicFilters
                            onFilter={ handleIdentityProviderFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("common:name"),
                                    value: "name"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("devPortal:components.idp.advancedSearch.form.inputs.filterAttribute.placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("devPortal:components.idp.advancedSearch.form.inputs.filterCondition.placeholder")
                            }
                            filterValuePlaceholder={
                                t("devPortal:components.idp.advancedSearch.form.inputs.filterValue.placeholder")
                            }
                            placeholder={ t("devPortal:components.idp.advancedSearch.placeholder") }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-advance-search` }
                        />
                    }
                    currentListSize={ idpList.count }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleListSortingStrategyOnChange }
                    showPagination={ true }
                    showTopActionPanel={ isIdPListRequestLoading || !(!searchQuery && idpList?.totalResults <= 0) }
                    sortOptions={ IDENTITY_PROVIDER_LIST_SORTING_OPTIONS }
                    sortStrategy={ listSortingStrategy }
                    totalPages={ Math.ceil(idpList.totalResults / listItemLimit) }
                    totalListSize={ idpList.totalResults }
                    data-testid={ `${ testId }-list-layout` }
                >
                    <IdentityProviderList
                        advancedSearch={
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleIdentityProviderFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("common:name"),
                                        value: "name"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("devPortal:components.idp.advancedSearch.form.inputs.filterAttribute" +
                                        ".placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("devPortal:components.idp.advancedSearch.form.inputs.filterCondition" +
                                        ".placeholder")
                                }
                                filterValuePlaceholder={
                                    t("devPortal:components.idp.advancedSearch.form.inputs.filterValue" +
                                        ".placeholder")
                                }
                                placeholder={ t("devPortal:components.idp.advancedSearch.placeholder") }
                                defaultSearchAttribute="name"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-advance-search` }
                            />
                        }
                        isLoading={ isIdPListRequestLoading }
                        list={ idpList }
                        onEmptyListPlaceholderActionClick={
                            () => history.push(AppConstants.getPaths().get("IDP_TEMPLATES"))
                        }
                        onIdentityProviderDelete={ handleIdentityProviderDelete }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        data-testid={ `${ testId }-list` }
                    />
                </ListLayout>
            </PageLayout>
        </HelpPanelLayout>
    );
};

/**
 * Default proptypes for the IDP component.
 */
IdentityProvidersPage.defaultProps = {
    "data-testid": "idp"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default IdentityProvidersPage;
