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

import { AuthenticateSessionUtil, AuthenticateUserKeys } from "@wso2is/authentication";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { fetchApplications } from "../../api";
import * as ApplicationConstants from "../../constants/application-constants";
import * as UIConstants from "../../constants/ui-constants";
import {
    AlertInterface,
    AlertLevels,
    Application,
    emptyStorageApplicationSettingsItem,
    StorageApplicationSettingsInterface
} from "../../models";
import { getValueFromLocalStorage, setValueInLocalStorage } from "../../utils";
import { AllApplications } from "./all-applications";
import { ApplicationSearch } from "./application-search";
import { RecentApplications } from "./recent-applications";

/**
 * Proptypes for the applications component.
 */
interface ApplicationsProps {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Applications component.
 *
 * @return {JSX.Element}
 */
export const Applications: FunctionComponent<ApplicationsProps> = (
    props: ApplicationsProps
): JSX.Element => {
    const { onAlertFired } = props;
    const [ applications, setApplications ] = useState<Application[]>([]);
    const [ recentApplications, setRecentApplications ] = useState<Application[]>([]);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ isRequestLoading, setIsRequestLoading ] = useState(false);
    const { t } = useTranslation();

    /**
     * Fetches the list of applications from the API.
     *
     * @param {number} limit - Results limit.
     * @param {number} offset - Results offset.
     * @param {string} filter - Filter query.
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
                            "views:components.applications.notifications.fetchApplications.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.applications.notifications.fetchApplications.error.message"
                        ),
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "views:components.applications.notifications.fetchApplications.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "views:components.applications.notifications.fetchApplications.genericError.message"
                    )
                });
            });
    };

    /**
     * Populates the list of recent applications.
     */
    const populateRecentApplications = (): void => {
        const username = AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME);
        const applicationSettings: StorageApplicationSettingsInterface = JSON.parse(
            getValueFromLocalStorage(ApplicationConstants.APPLICATION_SETTINGS_STORAGE_KEY)
        );

        // Check if the current logged in user already has an entry in the settings.
        // eslint-disable-next-line no-prototype-builtins
        if (!applicationSettings || !applicationSettings.hasOwnProperty(username)) {
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
    }, [applications]);

    /**
     * Updates the recent applications list.
     *
     * @param {string} id - Id of the accessed application.
     */
    const updateRecentApplications = (id: string): void => {
        const username = AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME);
        let applicationSettings: StorageApplicationSettingsInterface = JSON.parse(
            getValueFromLocalStorage(ApplicationConstants.APPLICATION_SETTINGS_STORAGE_KEY)
        );

        // Check if the current logged in user already has an entry in the settings.
        // eslint-disable-next-line no-prototype-builtins
        if (applicationSettings && applicationSettings.hasOwnProperty(username)) {
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
        // eslint-disable-next-line no-prototype-builtins
        if (!applicationSettings.hasOwnProperty(username)) {
            applicationSettings[username] = emptyStorageApplicationSettingsItem();
        }

        applicationSettings[username].recentApplications.unshift(id);

        // Set the new array in localstorage.
        setValueInLocalStorage(ApplicationConstants.APPLICATION_SETTINGS_STORAGE_KEY,
            JSON.stringify(applicationSettings));

        // Re-populate the recent apps array.
        populateRecentApplications();
    };

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param {string} query - Search query.
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
     * @param {string} id - ID of the application.
     * @param {string} url - App access url.
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
            <ApplicationSearch onFilter={ handleApplicationFilter }/>
            <div className="search-results-indicator">
                {
                    searchQuery
                        ? t("views:components.applications.search.resultsIndicator", { query: searchQuery })
                        : ""
                }
            </div>
            <Divider/>
            {
                (searchQuery || (recentApplications && recentApplications.length <= 0))
                    ? <Divider hidden className="x1"/>
                    : null
            }
            {
                (!searchQuery && recentApplications && recentApplications.length && recentApplications.length > 0)
                    ? (
                        <>
                            <h3 className="section-header">
                                { t("views:components.applications.recent.heading") }
                            </h3>
                            <RecentApplications
                                onAppNavigate={ handleAppNavigation }
                                recentApps={ recentApplications }
                                showFavourites={ false }
                            />
                            <h3 className="section-header">{ t("views:components.applications.all.heading") }</h3>
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
