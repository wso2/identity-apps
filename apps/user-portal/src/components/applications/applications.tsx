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
import { Divider, Form, Grid, Input } from "semantic-ui-react";
import { fetchApplications } from "../../api";
import { Application, Notification } from "../../models";
import { AdvanceSearch } from "../shared";
import { AllApplications } from "./all-applications";
import { FavouriteApplications } from "./favourite-applications";
import { RecentApplications } from "./recent-applications";

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
    const [ applications, setApplications ] = useState<Application[]>([]);
    const { onNotificationFired } = props;
    const { t } = useTranslation();

    /**
     * Fetches the applications list on component mount.
     */
    useEffect(() => {
        fetchApplications()
            .then((response) => {
                setApplications(response.applications);
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
    }, []);

    /**
     * Filters the list of recent applications.
     * TODO: Replace the hardcoded return count with actual recent apps.
     *
     * @return {Application[]} - The list of recent applications.
     */
    const filterRecentApps = (): Application[] => {
        const apps = [...applications];
        return apps.splice(0, 3);
    };

    /**
     * Filters the list of favourite apps.
     *
     * @return {Application[]}
     */
    const filterFavouriteApps = (): Application[] => {
        return applications.filter((app) => {
            return app.favourite === true;
        });
    };

    return (
        <>
            <AdvanceSearch>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Form>
                                <Input placeholder="test" />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </AdvanceSearch>
            <Divider />
            <RecentApplications recentApps={ filterRecentApps() } />
            <Divider />
            <FavouriteApplications favouriteApps={ filterFavouriteApps() } />
            <Divider />
            <AllApplications allApps={ applications } />
        </>
    );
};
