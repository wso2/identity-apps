/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AllApplications } from "./all-applications";
import { RecentApplications } from "./recent-applications";
import { fetchApplications } from "../../api";
import { AppConstants, UIConstants } from "../../constants";
import {
    AlertInterface,
    AlertLevels,
    Application,
    StorageApplicationSettingsInterface,
    emptyStorageApplicationSettingsItem
} from "../../models";
import { AppState } from "../../store";
import { getValueFromLocalStorage, setValueInLocalStorage } from "../../utils";
import { AdvancedSearchWithBasicFilters } from "../shared";

/**
 * Prop-types for the applications component.
 * Also see {@link Applications.defaultProps}
 */
interface ApplicationsProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Applications component.
 *
 * @param props - Props injected to the component.
 * @returns Application component.
 */
export const Applications: FunctionComponent<ApplicationsProps> = (
    props: ApplicationsProps
): ReactElement => {

    const { [ "data-testid" ]: testId } = props;

    const { onAlertFired } = props;
    const [ applications, setApplications ] = useState<Application[]>([]);
    const [ recentApplications, setRecentApplications ] = useState<Application[]>([]);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ isRequestLoading, setIsRequestLoading ] = useState(false);
    const username = useSelector((state: AppState) => state.authenticationInformation.username);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const { t } = useTranslation();

    /**
     * Fetches the list of applications from the API.
     *
     * @param limit - Results limit.
     * @param offset - Results offset.
     * @param filter - Filter query.
     */
    const getApplications = (limit: number, offset: number, filter: string): void => {
        setIsRequestLoading(true);

        fetchApplications(limit, offset, filter)
            .then((response) => {
                setApplications(response.applications);
                setIsRequestLoading(false);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.applications.notifications.fetchApplications.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.applications.notifications.fetchApplications.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.applications.notifications.fetchApplications.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.applications.notifications.fetchApplications.genericError.message"
                    )
                });
            });
    };

    /**
     * Populates the list of recent applications.
     */
    const populateRecentApplications = (): void => {
        const applicationSettings: StorageApplicationSettingsInterface = JSON.parse(
            getValueFromLocalStorage(AppConstants.APPLICATION_SETTINGS_STORAGE_KEY)
        );

        // Check if the current logged in user already has an entry in the settings.
        if (!applicationSettings || !Object.prototype.hasOwnProperty.call(applicationSettings, username)) {
            return;
        }

        const recentApps: Application[] = [];

        if (applicationSettings[username].recentApplications
            && applicationSettings[username].recentApplications.length
            && applicationSettings[username].recentApplications.length > 0) {

            for (const appId of applicationSettings[username].recentApplications) {
                for (const app of applications) {
                    if (app.id === appId) {
                        recentApps.push(app);
                    }
                }
            }
        }

        setRecentApplications(recentApps);
    };

    /**
     * Fetches the applications list on component mount.
     */
    useEffect(() => {
        getApplications(null, null, null);
    }, []);

    /**
     * Trigger the recent application populate method when
     * the applications array changes.
     */
    useEffect(() => {
        populateRecentApplications();
    }, [ applications ]);

    /**
     * Updates the recent applications list.
     *
     * @param id - Id of the accessed application.
     */
    const updateRecentApplications = (id: string): void => {
        let applicationSettings: StorageApplicationSettingsInterface = JSON.parse(
            getValueFromLocalStorage(AppConstants.APPLICATION_SETTINGS_STORAGE_KEY)
        );

        // Check if the current logged in user already has an entry in the settings.
        if (applicationSettings && Object.prototype.hasOwnProperty.call(applicationSettings, username)) {
            if (applicationSettings[username].recentApplications
                && applicationSettings[username].recentApplications.length
                && applicationSettings[username].recentApplications.length > 0) {
                // check if the current app is in the recent apps array.
                // If the app is already in the array, terminate the function.
                for (const appId of applicationSettings[username].recentApplications) {
                    if (appId === id) {
                        return;
                    }
                }

                // If the array size is greater than the limit, adjust the array length.
                // If the array size is equal to the limit, remove the last item.
                if (applicationSettings[username].recentApplications.length >=
                    UIConstants.RECENT_APPLICATIONS_LIST_LIMIT
                ) {
                    applicationSettings[username].recentApplications.length =
                        UIConstants.RECENT_APPLICATIONS_LIST_LIMIT;
                    applicationSettings[username].recentApplications.pop();
                }
            }
        }

        // If `applicationSettings` is null, init it with an empty object.
        if (!applicationSettings) {
            applicationSettings = {};
        }

        // If `applicationSettings` doesn't have the logged in user's entry,
        // create a new one.
        if (!Object.prototype.hasOwnProperty.call(applicationSettings, username)) {
            applicationSettings[username] = emptyStorageApplicationSettingsItem();
        }

        applicationSettings[username].recentApplications.unshift(id);

        // Set the new array in localstorage.
        setValueInLocalStorage(AppConstants.APPLICATION_SETTINGS_STORAGE_KEY,
            JSON.stringify(applicationSettings));

        // Re-populate the recent apps array.
        populateRecentApplications();
    };

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param query - Search query.
     */
    const handleApplicationFilter = (query: string): void => {
        setSearchQuery(query);
        getApplications(null, null, query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action from the
     * all application component.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        getApplications(null, null, null);
        setTriggerClearQuery(!triggerClearQuery);
    };

    /**
     * Handles the `onListRefresh` callback action from the
     * all application component.
     */
    const handleListRefresh = (): void => {
        getApplications(null, null, null);
    };

    /**
     * Handles access url navigation.
     *
     * @remarks
     * `_blank` target has a security vulnerability. Hence the `rel=noopener`
     * attribute was used.
     * @see {@link https://searchenginelaws.com/seo/what-is-rel-noopener-noreferrer-tag/}
     *
     * @param id - ID of the application.
     * @param url - App access url.
     */
    const handleAppNavigation = (id: string, url: string): void => {
        updateRecentApplications(id);

        const a = document.createElement("a");

        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        a.click();
    };

    return (
        <div className="applications-page">
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 8 }>
                        <AdvancedSearchWithBasicFilters
                            fill="white"
                            onFilter={ handleApplicationFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("common:name"),
                                    value: "name"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("myAccount:components.applications.advancedSearch.form.inputs.filterAttribute" +
                                    ".placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("myAccount:components.applications.advancedSearch.form.inputs.filterCondition" +
                                    ".placeholder")
                            }
                            filterValuePlaceholder={
                                t("myAccount:components.applications.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                            }
                            placeholder={ t("myAccount:components.applications.advancedSearch.placeholder") }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-list-advanced-search` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <div className="search-results-indicator">
                {
                    searchQuery
                        ? t("myAccount:components.advancedSearch.resultsIndicator", { query: searchQuery })
                        : ""
                }
            </div>
            <Divider />
            {
                (searchQuery || (recentApplications && recentApplications.length <= 0))
                    ? <Divider hidden className="x1" />
                    : null
            }
            {
                (!searchQuery && recentApplications && recentApplications.length && recentApplications.length > 0)
                    ? (
                        <>
                            <h3 className="section-header">
                                { t("myAccount:components.applications.recent.heading") }
                            </h3>
                            <RecentApplications
                                onAppNavigate={ handleAppNavigation }
                                recentApps={ recentApplications }
                                showFavourites={ false }
                            />
                            <h3 className="section-header">
                                { t("myAccount:components.applications.all.heading") }
                            </h3>
                        </>
                    )
                    : null
            }
            <AllApplications
                allApps={ applications }
                searchQuery={ searchQuery }
                loading={ isRequestLoading }
                onAppNavigate={ handleAppNavigation }
                onListRefresh={ handleListRefresh }
                onSearchQueryClear={ handleSearchQueryClear }
                showFavourites={ false }
            />
        </div>
    );
};

/**
 * Default props for the component.
 * See type definitions in {@link ApplicationsProps}
 */
Applications.defaultProps = {
    "data-testid": "applications"
};
