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

import { CommonHelpers } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownProps } from "semantic-ui-react";
// eslint-disable-next-line max-len
import { AppState, FeatureConfigInterface, OrganisationAdvancedSearch, Pagination, UIConstants, searchActionOrganisation, store } from "../../core";
import { Config } from "../../core/configs";
import { deleteOrganisation, getOrganisationList } from "../api";
import { AddOrganization, OrganisationList } from "../components";
import { OrganisationConstants } from "../constants";
import { OrganisationListInterface } from "../models";

/**
 * Users info page.
 *
 * @return {React.ReactElement}
 */
const OrganisationPage: FunctionComponent<any> = (): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ organisationList, setOrganisationList ] = useState<OrganisationListInterface>({});
    const [ rolesList ] = useState([]);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ organisationListMetaContent, setOrganisationListMetaContent ] = useState(undefined);
    const [ orgStore, setOrgStore ] = useState(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ isOrganisationListRequestLoading, setOrganisatonListRequestLoading ] = useState<boolean>(false);
    const [ parentOrgList, setParentOrgList ] = useState<OrganisationListInterface>({});
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [crPageStartIndex, setCrPageStartIndex] = useState<number>(1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchBackQueryOrg, setSearchBackQueryOrg] = useState<string>(store.getState().organisations);

    const username = useSelector((state: AppState) => state.auth.username);
    const tenantName = store.getState().config.deployment.tenant;
    const tenantSettings = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenantName));
    const typeAttribute = OrganisationConstants.DEFAULT_ORG_LIST_ATTRIBUTES[0];
    
    const getList = (limit: number, offset: number, filter: string, attribute: string, 
                     domain: string, isParentOrgSearch: boolean = false) => {                
        setOrganisatonListRequestLoading(true);
        getOrganisationList(limit, offset, filter, attribute, domain)
            .then((response) => {
                if(isParentOrgSearch) {
                    setParentOrgList(response)
                } else {
                    setOrganisationList(response);
                }
            })
            .finally(() => {
                setOrganisatonListRequestLoading(false);
            });

    };
    
    useEffect(() => {
        if(CommonHelpers.lookupKey(tenantSettings, username) !== null) {
            const userSettings = CommonHelpers.lookupKey(tenantSettings, username);
            const userPreferences = userSettings[1];
            const tempColumns = new Map<string, string> ();
            if (userPreferences.identityAppsSettings.userPreferences.userListColumns.length < 1) {
                const metaColumns = OrganisationConstants.DEFAULT_ORG_LIST_ATTRIBUTES;
                setOrgMetaColumns(metaColumns);
                metaColumns.map((column) => {
                    if (column === "id") {
                        tempColumns.set(column, "");
                    } else {
                        tempColumns.set(column, column);
                    }
                });               
                setOrganisationListMetaContent(tempColumns);
            }
            userPreferences.identityAppsSettings.userPreferences.userListColumns.map((column) => {
                tempColumns.set(column, column);
            });           
            setOrganisationListMetaContent(tempColumns);
        }
    }, []);

    /**
     * Fetch the list of available.
     */
    useEffect(() => {
        if (searchBackQueryOrg && searchBackQueryOrg != "") {
            getList(listItemLimit, listOffset, searchBackQueryOrg, typeAttribute, 
                Config.getDeploymentConfig().serverHost);
        }
        else {
            getList(listItemLimit, listOffset, null, typeAttribute, Config.getDeploymentConfig().serverHost);
        }
    }, []);


    useEffect(() => {
        if (searchBackQueryOrg != "" && searchBackQueryOrg != null) {
            getList(listItemLimit, listOffset, searchBackQueryOrg, typeAttribute, orgStore);
            setPageNumber(1);
            setCrPageStartIndex(1);
            setSearchQuery(searchBackQueryOrg);
        }
    }, [searchBackQueryOrg]);

    useEffect(() => {
        if (organisationListMetaContent) {
            getList(listItemLimit, listOffset, null, typeAttribute, "primary");
        }
    }, [ listOffset, listItemLimit ]);

    useEffect(() => {
        if (!isListUpdated) {
            return;
        }
        getList(listItemLimit, listOffset, null, typeAttribute, orgStore);
        setListUpdated(false);
    }, [ isListUpdated ]);


    /**
     * The following method set the user preferred columns to the local storage.
     *
     * @param metaColumns - string[]
     */
    const setOrgMetaColumns = (metaColumns: string[]) => {
        if(CommonHelpers.lookupKey(tenantSettings, username) !== null) {
            const userSettings = CommonHelpers.lookupKey(tenantSettings, username);
            const userPreferences = userSettings[1];

            const newUserSettings = {
                ...tenantSettings,
                [ username ]: {
                    ...userPreferences,
                    identityAppsSettings: {
                        ...userPreferences.identityAppsSettings,
                        userPreferences: {
                            ...userPreferences.identityAppsSettings.userPreferences,
                            userListColumns: metaColumns
                        }
                    }
                }
            };
           
            LocalStorageUtils.setValueInLocalStorage(tenantName, JSON.stringify(newUserSettings));
        }
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setOrganisatonListRequestLoading(true);
        getList(listItemLimit, listOffset, null, typeAttribute, null);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Handles the `onFilter` callback action from the
     * organisations search component.
     *
     * @param {string} query - Search query.
     */
    const handleOrganisationFilter = (query: string, isParentOrgSearch?: boolean): void => {
      //  const attributes = generateAttributesString(organisationListMetaContent.values());
        const attributes = typeAttribute;
        if (query === "name co ") {
            getList(listItemLimit, listOffset, null, attributes, orgStore, isParentOrgSearch);
            return;
        }
        if(query && !query.includes("'")){
            const queryArray = query.split("name co ");
            query = `${"substring(name" + "," + "'" + queryArray[1] + "'" + ")"}`;
        }
        setSearchQuery(query);
        if ( !isParentOrgSearch ) {
            dispatch(searchActionOrganisation(query));
        }
        getList(listItemLimit, listOffset, query, attributes, orgStore, isParentOrgSearch);
        setPageNumber(1);
        
    };

    const handlePaginationChange = (value, direction) => {

        let newStartIndex = 0;
        setPageNumber(value);

        let searchValue = null;
        if(searchQuery !== "" && searchQuery !== null){
            searchValue = searchQuery;
        }

        if(direction === "Next"){
            newStartIndex = crPageStartIndex + listItemLimit;
        }else{
            newStartIndex = crPageStartIndex - listItemLimit;
        }

        if(value === 1 && direction === "Previous"){
            getList(listItemLimit, listOffset, searchValue, typeAttribute, null);
        }else{
            getList(listItemLimit, newStartIndex, searchValue, typeAttribute, null);
        }
        setCrPageStartIndex(newStartIndex);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setPageNumber(1);
        setCrPageStartIndex(1);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        if (data.value === "all") {
            setOrgStore(null);
        } else {
            setOrgStore(data.value as string);
        }
    };

    const handleOrganisationDelete = (orgId: string): void => {
        deleteOrganisation(orgId)
            .then(() => {
                handleAlerts({
                    description: t("adminPortal:organisation.notifications.delete_success.message"),
                    level: AlertLevels.SUCCESS,
                    message: t("adminPortal:organisation.notifications.delete_success.description")
                });
                setListUpdated(true);
            })
            .catch((err) => {
                  if (err) {
                    dispatch(addAlert({
                        description: t("adminPortal:organisation.notifications."+ err +".message"),
                        level: AlertLevels.WARNING,
                        message: t("adminPortal:organisation.notifications."+ err +".description")
                    }));
                }
                else {
                    dispatch(addAlert({
                        description: t("adminPortal:organisation.notifications.generic_delete.message"),
                        level: AlertLevels.ERROR,
                        message: t("adminPortal:organisation.notifications.generic_delete.description")
                    }));
                }
              });
    };

    const handleAddOrgAlert = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
        getList(listItemLimit, listOffset, null, typeAttribute, null);
        setPageNumber(1);
        setCrPageStartIndex(1);
    };

    const handleParentOrgFilter = (query: string) => {
            handleOrganisationFilter(query, true);
       
    };

    const pagenumberEdit = (e) => {
        return e;
    }

    return (
        <PageLayout
            action={
                // (isOrganisationListRequestLoading || !(!searchQuery && organisationList.length <= 0))
                // && (hasRequiredScopes(featureConfig?.organisation, featureConfig?.organisation?.scopes?.create,
                //     allowedScopes))
                (isOrganisationListRequestLoading || !(!searchQuery && organisationList.length <= 0))
                && (
                    <PrimaryButton
                        data-testid="user-mgt-user-list-add-user-button"
                        onClick={ () => setShowWizard(true) }
                    >
                        { "Create Organisation" }
                    </PrimaryButton>
                )
            }
            title={ "Organisations" }
            description={ "Create and manage organisations" }
        >
            { <ListLayout
                // TODO add sorting functionality.
                advancedSearch={ (
                    <OrganisationAdvancedSearch
                        onFilter={ handleOrganisationFilter }
                        searchFromBackOrg = { store.getState().organisations }
                        filterAttributeOptionOne={ [
                            {
                                key: 0,
                                text: "Organisation Name",
                                value: "name"
                            }]
                        }
                        filterAttributeOptionTwo={ [ {
                                key: 0,
                                text: "Type",
                                value: "attributeValue"
                            }]
                        }
                        filterAttributeOptionThree={ [{
                                key: 0,
                                text: "Organisation Status",
                                value: "status"
                            }]
                        }    
                        filterAttributeOptionFour={ [{
                                key: 0,
                                text: "Parent Organisation Name",
                                value: "parentName"
                            }]
                        }
                        filterConditionsPlaceholder={
                            t("adminPortal:components.users.advancedSearch.form.inputs.filterCondition" +
                                ".placeholder")
                        }
                        filterValuePlaceholder={
                            t("adminPortal:components.users.advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder={ t("adminPortal:components.users.advancedSearch.placeholder") }
                        defaultSearchAttribute={ "name" }
                        defaultSearchOperator={ "co" }
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-testid="organisation-mgt-user-list-layout"
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                showTopActionPanel={ isOrganisationListRequestLoading || 
                                    !(!searchQuery && organisationList.length <= 0) }
                totalPages={ Math.ceil(organisationList.length / listItemLimit) }
                totalListSize={ organisationList.length }

            >
                <OrganisationList
                    organisationsList={ organisationList }
                    handleOrganisationDelete={ handleOrganisationDelete }
                    userMetaListContent={ organisationListMetaContent }
                    isLoading={ isOrganisationListRequestLoading }
                    onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-testid="user-mgt-user-list"
                    listView= { false }
                />
                {
                    showWizard && (
                    <AddOrganization
                        data-testid="organisation-mgt-add-user-wizard-modal"
                        closeWizard={ () => setShowWizard(false) }
                        listOffset={ listOffset }
                        listItemLimit={ listItemLimit }
                        updateList={ () => setListUpdated(true) }
                        rolesList={ rolesList }
                        filterParentOrg={ handleParentOrgFilter }
                        onAlertFired={ handleAddOrgAlert }
                        parentOrgList={ parentOrgList }
                            organisationListLoading={ isOrganisationListRequestLoading }
                    />
                    )
                }
            </ListLayout> }
            <Pagination
                  dataSource={ listItemLimit }
                  pageNo={ pageNumber }
                  onPagination={ (pageNumber,direction) => handlePaginationChange(pageNumber,direction) }
                  disabledNextButton={ organisationList.length < listItemLimit ? "disable-button": "" }
                  disabledPrevButton={ pageNumber === 1? "disable-button": "" }
                  customClassName= { "" }
                  isEditable= { false }
                  customPageNumber = { (e) => pagenumberEdit(e) }
            />
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OrganisationPage;
