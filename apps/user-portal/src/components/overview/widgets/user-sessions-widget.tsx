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

import moment from "moment";
import React, { FunctionComponent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Icon, List, Placeholder, SemanticICONS } from "semantic-ui-react";
import { history, UserAgentParser } from "../../../helpers";
import { UserSessions } from "../../../models";
import { AppState } from "../../../store";
import { fetchUserSessions } from "../../../store/actions";
import { SettingsSection, ThemeIcon } from "../../shared";

/**
 * User sessions widget.
 *
 * @return {JSX.Element}
 */
export const UserSessionsWidget: FunctionComponent<{}> = (): JSX.Element => {
    const isFetchUserSessionsRequestLoading = useSelector(
        (state: AppState) => state.userSessions.isFetchUserSessionsRequestLoading
    );
    const userSessions = useSelector((state: AppState) => state.userSessions.userSessions as UserSessions);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        dispatch(fetchUserSessions());
    }, []);

    /**
     * Generates the list of user login sessions.
     *
     * @param {UserSessions} sessions - Array of user sessions.
     * @return {JSX.Element[]}
     */
    const generateSessionList = (sessions: UserSessions): JSX.Element[] => {

        if (!sessions || !sessions.sessions || !(sessions.sessions.length > 0)) {
            return null;
        }

        const userAgentParser = new UserAgentParser();
        const sessionList = [];

        for (const [index, session] of sessions.sessions.slice(0, 1).entries()) {
            userAgentParser.uaString = session.userAgent;
            sessionList.push(
                <List.Item className="inner-list-item" key={ session.id }>
                    <Grid padded>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 16 } className="first-column">
                                <ThemeIcon
                                    icon={
                                        <Icon
                                            name={ resolveDeviceType(userAgentParser.device.type) }
                                            size="big"
                                            color="grey"
                                        />
                                    }
                                    transparent
                                    spaced="right"
                                    floated="left"
                                />
                                <List.Content>
                                    <List.Header>{ userAgentParser.os.name }</List.Header>
                                    <List.Description>
                                        <p style={ { fontSize: "11px" } }>
                                            {
                                                t("views:userSessions.lastAccessed",
                                                    {
                                                        date: moment(
                                                            parseInt(session.lastAccessTime, 10)
                                                        ).fromNow()
                                                    }
                                                )
                                            }
                                        </p>
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Item>
            );
        }
        return sessionList;
    };

    /**
     * Resolves an icon for the device type extracted from the user agent string.
     *
     * @param {string} type - Device type.
     * @return {SemanticICONS}
     */
    const resolveDeviceType = (type: string): SemanticICONS => {
        const deviceType = {
            desktop: {
                icon: "computer",
                values: ["desktop"]
            },
            mobile: {
                icon: "mobile alternate",
                values: ["mobile"]
            },
            tablet: {
                icon: "tablet alternate",
                values: ["tablet"]
            }
        };

        for (const [key, value] of Object.entries(deviceType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }

        // Default device icon.
        return "computer";
    };

    /**
     * Generates a placeholder for the sessions list.
     *
     * @return {JSX.Element[]}
     */
    const createSessionListPlaceholder = (): JSX.Element[] => {
        const placeholder = [];
        for (let i = 0; i < 1; i++) {
            placeholder.push(
                <List.Item className="inner-list-item" key={ i }>
                    <Grid padded>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 } className="first-column">
                                <List.Content verticalAlign="middle">
                                    <Placeholder>
                                        <Placeholder.Header image>
                                            <Placeholder.Line/>
                                            <Placeholder.Line/>
                                        </Placeholder.Header>
                                    </Placeholder>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Item>
            );
        }
        return placeholder;
    };

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
                <List divided verticalAlign="middle" className="main-content-inner">
                    {
                        isFetchUserSessionsRequestLoading
                            ? createSessionListPlaceholder()
                            : generateSessionList(userSessions)
                    }
                </List>
            </SettingsSection>
        </div>
    );
};
