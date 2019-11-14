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

import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Header } from "semantic-ui-react";
import { Application } from "../../models";
import { RecentApplicationCard } from "./recent-application-card";

/**
 * Proptypes for the recent applications component.
 */
interface RecentApplicationsProps {
    recentApps: Application[];
}

/**
 * Recent applications component.
 *
 * @return {JSX.Element}
 */
export const RecentApplications: FunctionComponent<RecentApplicationsProps> = (
    props: RecentApplicationsProps
): JSX.Element => {
    const { recentApps } = props;
    const { t } = useTranslation();

    /**
     * Navigates to the app using the `accessUrl`.
     *
     * @param {string} url - Access URL.
     */
    const handleAppNavigation = (url: string) => {
        window.open(url, "_blank");
    };

    return (
        <>
            <Header as="h2">{ t("views:components.applications.recent.heading") }</Header>
            <Divider hidden />
            <Grid>
                <Grid.Row>
                    {
                        recentApps
                            ? recentApps.map((app) => (
                                <Grid.Column width={ 5 } key={ app.id }>
                                    <RecentApplicationCard
                                        app={ app }
                                        navigateToApp={() => handleAppNavigation(app.accessUrl) }
                                    />
                                </Grid.Column>
                            ))
                            : null
                    }
                </Grid.Row>
            </Grid>
        </>
    );
};
