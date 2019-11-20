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

import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { fetchApplications } from "../../api";
import { Application, Notification } from "../../models";
import { AllApplications } from "./all-applications";
import { ApplicationSearch } from "./application-search";

/**
 * Proptypes for the applications component.
 */
interface ApplicationsProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Applications component.
 *
 * @return {JSX.Element}
 */
export const Applications: FunctionComponent<ApplicationsProps> = (
    props: ApplicationsProps
): JSX.Element => {
    const { onNotificationFired } = props;
    const [ applications, setApplications ] = useState<Application[]>([]);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ isRequestLoading, setIsRequestLoading ] = useState(false);
    const { t } = useTranslation();

    /**
     * Fetches the applications list on component mount.
     */
    useEffect(() => {
        getApplications(null, null, null);
    }, []);

    /**
     * Fetches the list of applications from the API.
     *
     * @param {number} limit - Results limit.
     * @param {number} offset - Results offset.
     * @param {string} filter - Filter query.
     */
    const getApplications = (limit: number, offset: number, filter: string) => {
        setIsRequestLoading(true);

        fetchApplications(limit, offset, filter)
            .then((response) => {
                setApplications(response.applications);
                setIsRequestLoading(false);
            })
            .catch((error) => {
                let notification = {
                    description: t(
                        "views:components.applications.notifications.fetchApplications.genericError.description"
                    ),
                    message: t(
                        "views:components.applications.notifications.fetchApplications.genericError.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.applications.notifications.fetchApplications.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.applications.notifications.fetchApplications.error.message"
                        ),
                    };
                }
                onNotificationFired(notification);
            });
    };

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param {string} query - Search query.
     */
    const handleApplicationFilter = (query: string) => {
        setSearchQuery(query);
        getApplications(null, null, query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action from the
     * all application component.
     */
    const handleSearchQueryClear = () => {
        setSearchQuery("");
        getApplications(null, null, null);
    };

    return (
        <>
            <ApplicationSearch onFilter={ handleApplicationFilter }/>
            <div className="search-results-indicator">
                {
                    searchQuery
                        ? t("views:components.applications.search.resultsIndicator", { query: searchQuery })
                        : ""
                }
            </div>
            <Divider/>
            <Divider hidden className="x1"/>
            <AllApplications
                allApps={ applications }
                searchQuery={ searchQuery }
                loading={ isRequestLoading }
                onSearchQueryClear={ handleSearchQueryClear }
            />
        </>
    );
};
