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
import { Button, Container, Grid, Icon, List, Menu, Modal, Placeholder, SemanticICONS, Table } from "semantic-ui-react";
import { UserAgentParser } from "../../helpers";
import { UserSession, UserSessions } from "../../models";
import { AppState } from "../../store";
import {
    fetchUserSessions,
    hideRevokeAllUserSessionsModal,
    hideRevokeUserSessionModal,
    revokeAllUserSessions,
    revokeUserSession,
    setEditingUserSession,
    setSessionsListActiveIndexes,
    showRevokeAllUserSessionsModal,
    showRevokeUserSessionModal
} from "../../store/actions";
import { EditSection, SettingsSection, ThemeIcon } from "../shared";

/**
 * User sessions component.
 *
 * @return {JSX.Element}
 */
export const UserSessionsComponent: FunctionComponent<{}> = (): JSX.Element => {
    const editingUserSession = useSelector((state: AppState) => state.userSessions.editingUserSession);
    const isFetchUserSessionsRequestLoading = useSelector(
        (state: AppState) => state.userSessions.isFetchUserSessionsRequestLoading
    );
    const isRevokeAllUserSessionsModalVisible = useSelector(
        (state: AppState) => state.userSessions.isRevokeAllUserSessionsModalVisible
    );
    const isRevokeUserSessionModalVisible = useSelector(
        (state: AppState) => state.userSessions.isRevokeUserSessionModalVisible
    );
    const isRevokeUserSessionRequestLoading = useSelector(
        (state: AppState) => state.userSessions.isRevokeUserSessionRequestLoading
    );
    const sessionsListActiveIndexes = useSelector((state: AppState) => state.userSessions.sessionsListActiveIndexes);
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

        for (const [ index, session ] of sessions.sessions.entries()) {
            userAgentParser.uaString = session.userAgent;
            sessionList.push(
                <List.Item className="inner-list-item" key={ session.id }>
                    <Grid padded>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 11 } className="first-column">
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
                            <Grid.Column width={ 5 } className="last-column">
                                <List.Content floated="right">
                                    <Button
                                        icon
                                        basic
                                        id={ index }
                                        labelPosition="right"
                                        size="mini"
                                        onClick={ handleSessionDetailClick }
                                    >
                                        {
                                            sessionsListActiveIndexes.includes(index) ?
                                                <>
                                                    { t("common:showLess") }
                                                    <Icon name="arrow down" flipped="vertically"/>
                                                </>
                                                :
                                                <>
                                                    { t("common:showMore") }
                                                    <Icon name="arrow down"/>
                                                </>
                                        }
                                    </Button>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                        {
                            sessionsListActiveIndexes.includes(index) ?
                                <EditSection>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <List.Content>
                                                <Grid padded>
                                                    <Grid.Row columns={ 2 }>
                                                        <Grid.Column width={ 5 }>
                                                            { t("common:operatingSystem") }
                                                        </Grid.Column>
                                                        <Grid.Column width={ 11 }>
                                                            <List.Description>
                                                                <Icon
                                                                    name={ resolveOSIcon(userAgentParser.os.name) }
                                                                    color="grey"
                                                                />
                                                                { userAgentParser.os.name }
                                                                { " " }
                                                                { userAgentParser.os.version }
                                                            </List.Description>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 2 }>
                                                        <Grid.Column width={ 5 }>
                                                            { t("common:browser") }
                                                        </Grid.Column>
                                                        <Grid.Column width={ 11 }>
                                                            <List.Description>
                                                                <Icon
                                                                    name={
                                                                        resolveBrowserIcon(userAgentParser.browser.name)
                                                                    }
                                                                    color="grey"/>
                                                                { userAgentParser.browser.name }
                                                                { " " }
                                                                { userAgentParser.browser.version }
                                                            </List.Description>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 2 }>
                                                        <Grid.Column width={ 5 }>
                                                            { t("common:ipAddress") }
                                                        </Grid.Column>
                                                        <Grid.Column width={ 11 }>
                                                            <List.Description>{ session.ip }</List.Description>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    {
                                                        userAgentParser.device.vendor ?
                                                            <Grid.Row columns={ 2 }>
                                                                <Grid.Column width={ 5 }>
                                                                    { t("common:deviceModel") }
                                                                </Grid.Column>
                                                                <Grid.Column width={ 11 }>
                                                                    <List.Description>
                                                                        { userAgentParser.device.vendor }
                                                                        { " " }
                                                                        { userAgentParser.device.model }
                                                                    </List.Description>
                                                                </Grid.Column>
                                                            </Grid.Row>
                                                            : null
                                                    }
                                                    {
                                                        session.applications && session.applications.length > 0 ?
                                                            <Grid.Row columns={ 2 }>
                                                                <Grid.Column width={ 5 }>
                                                                    { t("common:applications") }
                                                                </Grid.Column>
                                                                <Grid.Column width={ 11 }>
                                                                    <List.Description>
                                                                        <Table celled compact>
                                                                            <Table.Header>
                                                                                <Table.Row>
                                                                                    <Table.HeaderCell>
                                                                                        { t("common:applicationName") }
                                                                                    </Table.HeaderCell>
                                                                                    <Table.HeaderCell>
                                                                                        { t("common:user") }
                                                                                    </Table.HeaderCell>
                                                                                </Table.Row>
                                                                            </Table.Header>
                                                                            <Table.Body>
                                                                                {
                                                                                    session.applications.map(
                                                                                        (app, i) => (
                                                                                            <Table.Row key={ i }>
                                                                                                <Table.Cell>
                                                                                                    { app.appName }
                                                                                                </Table.Cell>
                                                                                                <Table.Cell>
                                                                                                    { app.subject }
                                                                                                </Table.Cell>
                                                                                            </Table.Row>
                                                                                        )
                                                                                    )
                                                                                }
                                                                            </Table.Body>
                                                                        </Table>
                                                                    </List.Description>
                                                                </Grid.Column>
                                                            </Grid.Row>
                                                            : null
                                                    }
                                                    <Grid.Row columns={ 2 }>
                                                        <Grid.Column width={ 5 }>
                                                            { t("common:loginTime") }
                                                        </Grid.Column>
                                                        <Grid.Column width={ 11 }>
                                                            <List.Description>
                                                                {
                                                                    moment(parseInt(session.loginTime, 10))
                                                                        .format("lll")
                                                                }
                                                            </List.Description>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 2 }>
                                                        <Grid.Column width={ 5 }>
                                                            { t("common:lastAccessed") }
                                                        </Grid.Column>
                                                        <Grid.Column width={ 11 }>
                                                            <List.Description>
                                                                {
                                                                    moment(parseInt(session.lastAccessTime, 10))
                                                                        .fromNow()
                                                                }
                                                            </List.Description>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 2 }>
                                                        <Grid.Column width={ 5 }>{ " " }</Grid.Column>
                                                        <Grid.Column width={ 11 }>
                                                            <Button
                                                                negative
                                                                onClick={
                                                                    () => handleTerminateUserSessionClick(session)
                                                                }
                                                                loading={ isRevokeUserSessionRequestLoading }
                                                            >
                                                                { t("common:terminateSession") }
                                                            </Button>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </List.Content>
                                        </Grid.Column>
                                    </Grid.Row>
                                </EditSection>
                                :
                                null
                        }
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
                values: [ "desktop" ]
            },
            mobile: {
                icon: "mobile alternate",
                values: [ "mobile" ]
            },
            tablet: {
                icon: "tablet alternate",
                values: [ "tablet" ]
            }
        };

        for (const [ key, value ] of Object.entries(deviceType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }

        // Default device icon.
        return "computer";
    };

    /**
     * Resolves an icon for the operating system type extracted from the user agent string.
     *
     * @param {string} type - Operating system type.
     * @return {SemanticICONS}
     */
    const resolveOSIcon = (type: string): SemanticICONS => {
        const osType = {
            android: {
                icon: "android",
                values: [ "Android" ]
            },
            ios: {
                icon: "apple",
                values: [ "iOS" ]
            },
            linux: {
                icon: "linux",
                values: [ "Linux" ]
            },
            mac: {
                icon: "apple",
                values: [ "Mac OS" ]
            },
            windows: {
                icon: "windows",
                values: [ "Windows [Phone/Mobile]" ]
            }
        };

        for (const [ key, value ] of Object.entries(osType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }
    };

    /**
     * Resolves an icon for the browser type extracted from the user agent string.
     *
     * @param {string} type - Browser type.
     * @return {SemanticICONS}
     */
    const resolveBrowserIcon = (type: string): SemanticICONS => {
        const browserType = {
            chrome: {
                icon: "chrome",
                values: [ "Chrome", "Chrome Headless", "Chrome WebView", "Chromium" ]
            },
            firefox: {
                icon: "firefox",
                values: [ "Firefox" ]
            },
            opera: {
                icon: "opera",
                values: [ "Opera Coast", "Opera Mini", "Opera Mobi", "Opera Tablet", "Opera" ]
            },
            safari: {
                icon: "safari",
                values: [ "Mobile Safari", "Safari" ]
            }
        };

        for (const [ key, value ] of Object.entries(browserType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }
    };

    /**
     * Generates a placeholder for the sessions list.
     *
     * @return {JSX.Element[]}
     */
    const createSessionListPlaceholder = (): JSX.Element[] => {
        const placeholder = [];
        for (let i = 0; i < 2; i++) {
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

    /**
     * Handler for the session detail button click.
     *
     * @param e - Click event.
     * @param {any} id - Session id.
     */
    const handleSessionDetailClick = (e, { id }) => {
        const indexes = [ ...sessionsListActiveIndexes ];

        if (!sessionsListActiveIndexes.includes(id)) {
            indexes.push(id);
        } else if (sessionsListActiveIndexes.includes(id)) {
            const removingIndex = sessionsListActiveIndexes.indexOf(id);
            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }
        }
        dispatch(setSessionsListActiveIndexes(indexes));
    };

    /**
     * Terminate a single user session.
     */
    const terminateUserSession = () => {
        dispatch(revokeUserSession(editingUserSession.id));
        dispatch(hideRevokeUserSessionModal());
    };

    /**
     * Terminates all the user sessions.
     */
    const terminateAllUserSessions = () => {
        dispatch(revokeAllUserSessions());
        dispatch(hideRevokeAllUserSessionsModal());
    };

    /**
     * Handles the terminate all user sessions click event.
     */
    const handleTerminateAllUserSessionsClick = (): void => {
        dispatch(showRevokeAllUserSessionsModal());
    };

    /**
     * Handles the terminate user sessions click event.
     *
     * @param {UserSession} session - Clicked session.
     */
    const handleTerminateUserSessionClick = (session: UserSession): void => {
        dispatch(setEditingUserSession(session));
        dispatch(showRevokeUserSessionModal());
    };

    /**
     * Handle the terminate all user sessions modal close event.
     */
    const handleTerminateAllUserSessionsModalClose = () => {
        dispatch(hideRevokeAllUserSessionsModal());
    };

    /**
     * Handle the terminate user session modal close event.
     */
    const handleTerminateUserSessionModalClose = () => {
        dispatch(hideRevokeUserSessionModal());
    };

    const terminateAllUserSessionsModal = (
        <Modal
            size="mini"
            open={ isRevokeAllUserSessionsModalVisible }
            onClose={ handleTerminateAllUserSessionsModalClose }
            dimmer="blurring"
        >
            <Modal.Content>
                <Container>
                    <h3>{ t("views:userSessions.modals.terminateAllUserSessionsModal.heading") }</h3>
                </Container>
                <br/>
                <p>{ t("views:userSessions.modals.terminateAllUserSessionsModal.message") }</p>
            </Modal.Content>
            <Modal.Actions>
                <Button className="link-button" onClick={ handleTerminateAllUserSessionsModalClose }>
                    { t("common:cancel") }
                </Button>
                <Button primary onClick={ terminateAllUserSessions }>
                    { t("common:terminate") }
                </Button>
            </Modal.Actions>
        </Modal>
    );

    const terminateUserSessionModal = (
        <Modal
            size="mini"
            open={ isRevokeUserSessionModalVisible }
            onClose={ handleTerminateUserSessionModalClose }
            dimmer="blurring"
        >
            <Modal.Content>
                <Container>
                    <h3>{ t("views:userSessions.modals.terminateUserSessionModal.heading") }</h3>
                </Container>
                <br/>
                <p>{ t("views:userSessions.modals.terminateUserSessionModal.message") }</p>
            </Modal.Content>
            <Modal.Actions>
                <Button className="link-button" onClick={ handleTerminateUserSessionModalClose }>
                    { t("common:cancel") }
                </Button>
                <Button primary onClick={ terminateUserSession }>
                    { t("common:terminate") }
                </Button>
            </Modal.Actions>
        </Modal>
    );

    return (
        <SettingsSection
            description={ t("views:userSessions.subTitle") }
            header={ t("views:userSessions.title") }
            placeholder={
                !(userSessions && userSessions.sessions && (userSessions.sessions.length > 0))
                    ? t("views:userSessions.actionTitles.empty")
                    : null
            }
        >
            {
                userSessions && userSessions.sessions && (userSessions.sessions.length > 0)
                    ? (
                        <Menu className="top-action-panel no-margin-bottom" borderless>
                            <Menu.Menu position="right">
                                <Button
                                    className="borderless-button"
                                    basic
                                    color="red"
                                    onClick={ handleTerminateAllUserSessionsClick }
                                >
                                    { t("common:terminateAll") }
                                </Button>
                            </Menu.Menu>
                        </Menu>
                    )
                    : null
            }
            <List divided verticalAlign="middle" className="main-content-inner">
                {
                    isFetchUserSessionsRequestLoading
                        ? createSessionListPlaceholder()
                        : generateSessionList(userSessions)
                }
            </List>
            { terminateAllUserSessionsModal }
            { terminateUserSessionModal }
        </SettingsSection>
    );
};
