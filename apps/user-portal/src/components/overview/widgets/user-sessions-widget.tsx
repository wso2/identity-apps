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
import { fetchUserSessions } from "../../../api";
import { history } from "../../../helpers";
import { createEmptyNotification, emptyUserSessions, Notification, UserSessions } from "../../../models";
import { SettingsSection } from "../../shared";
import { UserSessionsList } from "../../user-sessions";

/**
 * User sessions widget.
 *
 * @return {JSX.Element}
 */
export const UserSessionsWidget: FunctionComponent<{}> = (): JSX.Element => {
    const [ userSessions, setUserSessions ] = useState<UserSessions>(emptyUserSessions);
    const { t } = useTranslation();

    useEffect(() => {
        getUserSessions();
    }, []);

    /**
     * Retrieves the user sessions.
     */
    const getUserSessions = (): void => {
        let notification: Notification = createEmptyNotification();

        fetchUserSessions()
            .then((response) => {
                setUserSessions(response);
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.userSessions.notifications.fetchSessions.genericError.description"
                    ),
                    message: t("views:components.userSessions.notifications.fetchSessions.genericError.message"),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.userSessions.notifications.fetchSessions.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.userSessions.notifications.fetchSessions.error.message"
                        ),
                    };
                }
            });
    };

    /**
     * Navigates to the Security page.
     */
    const navigate = () => {
        history.push("/security");
    };

    return (
        <div className="widget account-status">
            <SettingsSection
                description={ t("views:components.overview.widgets.accountActivity.description") }
                header={ t("views:components.overview.widgets.accountActivity.header") }
                placeholder={
                    !(userSessions && userSessions.sessions && (userSessions.sessions.length > 0))
                        ? t("views:sections.userSessions.actionTitles.empty")
                        : null
                }
                primaryAction={ t("views:components.overview.widgets.accountActivity.actionTitles.update") }
                onPrimaryActionClick={ navigate }
            >
                <UserSessionsList
                    userSessions={
                        userSessions && userSessions.sessions && (userSessions.sessions.length > 0)
                            ? userSessions.sessions.slice(0, 1)
                            : null
                    }
                />
            </SettingsSection>
        </div>
    );
};
