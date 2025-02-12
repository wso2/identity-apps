/**
 * Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment } from "@wso2is/react-components";
import { fetchUserSessions } from "@wso2is/selfcare.core.v1/api";
import { SettingsSection } from "@wso2is/selfcare.core.v1/components";
import { AppConstants } from "@wso2is/selfcare.core.v1/constants/app-constants";
import { CommonConstants } from "@wso2is/selfcare.core.v1/constants/common-constants";
import { AlertLevels, UserSession, UserSessions, emptyUserSessions } from "@wso2is/selfcare.core.v1/models";
import { addAlert } from "@wso2is/selfcare.core.v1/store/actions";
import { AxiosError } from "axios";
import reverse from "lodash-es/reverse";
import sortBy from "lodash-es/sortBy";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Placeholder } from "semantic-ui-react";
import { history } from "../../../helpers";
import { UserSessionsList } from "../../user-sessions";

/**
 * Prop types of {@link UserSessionsWidget} component.
 */
type UserSessionsWidgetProps = TestableComponentInterface & IdentifiableComponentInterface;

/**
 * User sessions widget.
 *
 * @param props - Props injected to the component.
 * @returns User sessions component.
 */
export const UserSessionsWidget: FunctionComponent<TestableComponentInterface> = (
    props: UserSessionsWidgetProps
): ReactElement => {
    const { ["data-testid"]: testId } = props;
    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ userSessions, setUserSessions ] = useState<UserSessions>(emptyUserSessions);
    const [ isSessionDetailsLoading, setIsSessionDetailsLoading ] = useState<boolean>(false);

    /**
     * Retrieves the user sessions.
     */
    const getUserSessions = (): void => {
        setIsSessionDetailsLoading(true);

        fetchUserSessions()
            .then((response: UserSessions) => {
                if (response && response.sessions && response.sessions.length && response.sessions.length > 0) {
                    let sessions: UserSession[] = [ ...response.sessions ];

                    // Sort the array by last access time
                    sessions = reverse(sortBy(sessions, (session: UserSession) => session.lastAccessTime));

                    setUserSessions({
                        ...response,
                        sessions
                    });

                    return;
                }

                setUserSessions(response);
            })
            .catch((error: AxiosError & { response: { detail: string } }) => {
                if (error.response && error.response.data && error.response.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "myAccount:components.userSessions.notifications.fetchSessions.error.description",
                                { description: error.response.data.detail }
                            ),
                            level: AlertLevels.ERROR,
                            message: t("myAccount:components.userSessions.notifications.fetchSessions.error.message")
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "myAccount:components.userSessions.notifications.fetchSessions.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:components.userSessions.notifications.fetchSessions.genericError.message")
                    })
                );
            })
            .finally(() => {
                setIsSessionDetailsLoading(false);
            });
    };

    useEffect(() => {
        getUserSessions();
    }, []);

    /**
     * Navigates to the Security page.
     */
    const navigate = () => {
        history.push(AppConstants.getPaths().get("SECURITY") + "#" + CommonConstants.ACCOUNT_ACTIVITY);
    };

    return (
        <div className="widget account-status" data-testid={ testId }>
            <SettingsSection
                className="overview"
                data-testid={ `${testId}-settings-section` }
                description={ t("myAccount:components.overview.widgets.accountActivity.description") }
                header={ t("myAccount:components.overview.widgets.accountActivity.header") }
                placeholder={
                    !isSessionDetailsLoading &&
                    !(userSessions && userSessions.sessions && userSessions.sessions.length > 0)
                        ? t("myAccount:sections.userSessions.actionTitles.empty")
                        : null
                }
                primaryAction={ t("myAccount:components.overview.widgets.accountActivity.actionTitles.update") }
                onPrimaryActionClick={ navigate }
            >
                { !isSessionDetailsLoading ? (
                    <UserSessionsList
                        userSessions={
                            userSessions && userSessions.sessions && userSessions.sessions.length > 0
                                ? userSessions.sessions.slice(0, 1)
                                : null
                        }
                    />
                ) : (
                    <EmphasizedSegment className="placeholder-container">
                        <Placeholder fluid>
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                        </Placeholder>
                    </EmphasizedSegment>
                ) }
            </SettingsSection>
        </div>
    );
};

/**
 * Default props of {@link UserSessionsWidget}
 */
UserSessionsWidget.defaultProps = {
    "data-testid": "user-sessions-overview-widget"
};
