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
import * as React from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    List,
    Message, Modal,
    Placeholder,
    Segment,
    SemanticICONS,
    Table
} from "semantic-ui-react";
import {
    fetchUserSessions, hideRevokeAllUserSessionsModal, hideRevokeUserSessionModal,
    hideUserSessionsNotification,
    revokeAllUserSessions,
    revokeUserSession, setEditingUserSession,
    setSessionsListActiveIndexes, showRevokeAllUserSessionsModal, showRevokeUserSessionModal
} from "../actions";
import { AppState, UserAgentParser } from "../helpers";
import { UserSession, UserSessions } from "../models/user-sessions";
import { NotificationComponent } from "./notification";
import { SettingsSection } from "./settings-section";

/**
 * This is the User Sessions component of the User Portal
 */
class UserSessionsComponentInner extends React.Component<any, any> {

    /**
     * componentDidMount lifecycle method
     */
    public componentDidMount() {
        const { actions } = this.props;
        actions.userSessions.fetchUserSessions();
    }

    /**
     * Generates the list of user login sessions.
     *
     * @param {UserSessions} userSessions - Array of user sessions.
     * @return {JSX.Element[]}
     */
    public generateSessionList = (userSessions: UserSessions): JSX.Element[] => {
        const { sessionsListActiveIndexes, isRevokeUserSessionRequestLoading, t } = this.props;
        const userAgentParser = new UserAgentParser();
        const sessionList = [];

        for (const [index, session] of userSessions.sessions.entries()) {
            userAgentParser.uaString = session.userAgent;
            sessionList.push(
                <Table.Row key={ session.id }>
                    <Table.Cell>
                        <List relaxed="very">
                            <List.Item>
                                <List.Content floated="right">
                                    <Button
                                        icon
                                        id={ index }
                                        labelPosition="right"
                                        size="mini"
                                        onClick={ this.handleSessionDetailClick }
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
                                <List.Icon
                                    name={ this.resolveDeviceType(userAgentParser.device.type) }
                                    size="big"
                                    color="grey"
                                    verticalAlign="middle"
                                />
                                <List.Content>
                                    <List.Header>{ session.ip }</List.Header>
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
                                {
                                    sessionsListActiveIndexes.includes(index) ?
                                        <List.Content>
                                            <Divider hidden/>
                                            <Divider/>
                                            <Grid padded>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 8 }>
                                                        { t("common:operatingSystem") }
                                                    </Grid.Column>
                                                    <Grid.Column width={ 8 }>
                                                        <List.Description>
                                                            <Icon
                                                                name={ this.resolveOSIcon(userAgentParser.os.name) }
                                                                color="grey"
                                                            />
                                                            { userAgentParser.os.name }
                                                            { " " }
                                                            { userAgentParser.os.version }
                                                        </List.Description>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 8 }>
                                                        { t("common:browser") }
                                                    </Grid.Column>
                                                    <Grid.Column width={ 8 }>
                                                        <List.Description>
                                                            <Icon
                                                                name={
                                                                    this.resolveBrowserIcon(
                                                                        userAgentParser.browser.name
                                                                    )
                                                                }
                                                                color="grey"/>
                                                            { userAgentParser.browser.name }
                                                            { " " }
                                                            { userAgentParser.browser.version }
                                                        </List.Description>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 8 }>
                                                        { t("common:ipAddress") }
                                                    </Grid.Column>
                                                    <Grid.Column width={ 8 }>
                                                        <List.Description>{ session.ip }</List.Description>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                {
                                                    userAgentParser.device.vendor ?
                                                        <Grid.Row columns={ 2 }>
                                                            <Grid.Column width={ 8 }>
                                                                { t("common:deviceModel") }
                                                            </Grid.Column>
                                                            <Grid.Column width={ 8 }>
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
                                                            <Grid.Column width={ 8 }>
                                                                { t("common:applications") }
                                                            </Grid.Column>
                                                            <Grid.Column width={ 8 }>
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
                                                                            session.applications.map((app, i) => (
                                                                                <Table.Row key={i}>
                                                                                    <Table.Cell>
                                                                                        { app.appName }
                                                                                    </Table.Cell>
                                                                                    <Table.Cell>
                                                                                        { app.subject }
                                                                                    </Table.Cell>
                                                                                </Table.Row>
                                                                            ))
                                                                        }
                                                                        </Table.Body>
                                                                    </Table>
                                                                </List.Description>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                        : null
                                                }
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 8 }>
                                                        { t("common:loginTime") }
                                                    </Grid.Column>
                                                    <Grid.Column width={ 8 }>
                                                        <List.Description>
                                                            {
                                                                moment(parseInt(session.loginTime, 10))
                                                                    .format("Do MMMM YYYY, h:mm:ss a")
                                                            }
                                                        </List.Description>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 8 }>
                                                        { t("common:lastSeen") }
                                                    </Grid.Column>
                                                    <Grid.Column width={ 8 }>
                                                        <List.Description>
                                                            {
                                                                moment(parseInt(session.lastAccessTime, 10))
                                                                    .fromNow()
                                                            }
                                                        </List.Description>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 8 }>
                                                        { t("common:access") }
                                                    </Grid.Column>
                                                    <Grid.Column width={ 8 }>
                                                        <Button
                                                            size="mini"
                                                            negative
                                                            onClick={ () => this.handleRevokeUserSessionClick(session) }
                                                            loading={ isRevokeUserSessionRequestLoading }
                                                        >
                                                            { t("common:revokeSession") }
                                                        </Button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </List.Content>
                                        :
                                        null
                                }
                            </List.Item>
                        </List>
                    </Table.Cell>
                </Table.Row>
            );
        }
        return sessionList;
    }

    /**
     * Resolves an icon for the device type extracted from the user agent string.
     *
     * @param {string} type - Device type.
     * @return {SemanticICONS}
     */
    public resolveDeviceType = (type: string): SemanticICONS => {
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
    }

    /**
     * Resolves an icon for the operating system type extracted from the user agent string.
     *
     * @param {string} type - Operating system type.
     * @return {SemanticICONS}
     */
    public resolveOSIcon = (type: string): SemanticICONS => {
        const osType = {
            android: {
                icon: "android",
                values: ["Android"]
            },
            ios: {
                icon: "apple",
                values: ["iOS"]
            },
            linux: {
                icon: "linux",
                values: ["Linux"]
            },
            mac: {
                icon: "apple",
                values: ["Mac OS"]
            },
            windows: {
                icon: "windows",
                values: ["Windows [Phone/Mobile]"]
            }
        };

        for (const [key, value] of Object.entries(osType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }
    }

    /**
     * Resolves an icon for the browser type extracted from the user agent string.
     *
     * @param {string} type - Browser type.
     * @return {SemanticICONS}
     */
    public resolveBrowserIcon = (type: string): SemanticICONS => {
        const browserType = {
            chrome: {
                icon: "chrome",
                values: ["Chrome", "Chrome Headless", "Chrome WebView", "Chromium"]
            },
            firefox: {
                icon: "firefox",
                values: ["Firefox"]
            },
            opera: {
                icon: "opera",
                values: ["Opera Coast", "Opera Mini", "Opera Mobi", "Opera Tablet", "Opera"]
            },
            safari: {
                icon: "safari",
                values: ["Mobile Safari", "Safari"]
            }
        };

        for (const [key, value] of Object.entries(browserType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }
    }

    /**
     * Generates a placeholder for the sessions list.
     *
     * @return {JSX.Element[]}
     */
    public createSessionListPlaceholder = (): JSX.Element[] => {
        const { t } = this.props;
        const placeholder = [];
        for (let i = 0; i < 3; i++) {
            placeholder.push(
                <Table.Row key={ i }>
                    <Table.Cell>
                        <List relaxed="very">
                            <List.Item>
                                <List.Content floated="right">
                                    <Button icon labelPosition="right" size="mini" disabled>
                                        { t("common:showMore") }
                                        <Icon name="arrow down"/>
                                    </Button>
                                </List.Content>
                                <List.Content>
                                    <Placeholder>
                                        <Placeholder.Header image>
                                            <Placeholder.Line/>
                                            <Placeholder.Line/>
                                        </Placeholder.Header>
                                    </Placeholder>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Table.Cell>
                </Table.Row>
            );
        }
        return placeholder;
    }

    /**
     * Handler for the session detail button click.
     *
     * @param e - Click event.
     * @param {any} id - Session id.
     */
    public handleSessionDetailClick = (e, { id }) => {
        const { actions, sessionsListActiveIndexes } = this.props;
        const indexes = [...sessionsListActiveIndexes];

        if (!sessionsListActiveIndexes.includes(id)) {
            indexes.push(id);
        } else if (sessionsListActiveIndexes.includes(id)) {
            const removingIndex = sessionsListActiveIndexes.indexOf(id);
            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }
        }
        actions.userSessions.setSessionsListActiveIndexes(indexes);
    }

    /**
     * Revokes a single user session.
     */
    public revokeUserSession = () => {
        const { actions, editingUserSession } = this.props;
        actions.userSessions.revokeUserSession(editingUserSession.id);
        actions.userSessions.hideRevokeUserSessionModal();
    }

    /**
     * Revokes all the user sessions.
     */
    public revokeAllUserSessions = () => {
        const { actions } = this.props;
        actions.userSessions.revokeAllUserSessions();
        actions.userSessions.hideRevokeAllUserSessionsModal();
    }

    /**
     * Handles the notification dismiss click.
     */
    public handleNotificationDismiss = () => {
        const { actions } = this.props;
        actions.userSessions.hideUserSessionsNotification();
    }

    /**
     * Handles the revoke all user sessions click event.
     */
    public handleRevokeAllUserSessionsClick = (): void => {
        const { actions } = this.props;
        actions.userSessions.showRevokeAllUserSessionsModal();
    }

    /**
     * Handles the revoke user sessions click event.
     *
     * @param {UserSession} session - Clicked session.
     */
    public handleRevokeUserSessionClick = (session: UserSession): void => {
        const { actions } = this.props;
        actions.userSessions.setEditingUserSession(session);
        actions.userSessions.showRevokeUserSessionModal();
    }

    /**
     * Handle the revoke all user sessions modal close event.
     */
    public handleRevokeAllUserSessionsModalClose = () => {
        const { actions } = this.props;
        actions.userSessions.hideRevokeAllUserSessionsModal();
    }

    /**
     * Handle the revoke user session modal close event.
     */
    public handleRevokeUserSessionModalClose = () => {
        const { actions } = this.props;
        actions.userSessions.hideRevokeUserSessionModal();
    }

    public render() {
        const {
            isFetchUserSessionsRequestLoading, t, isSecurityWarningVisible, userSessions, userSessionsNotification,
            isRevokeAllUserSessionsRequestLoading, isRevokeAllUserSessionsModalVisible, isRevokeUserSessionModalVisible
        } = this.props;

        const revokeAllUserSessionsModal = (
            <Modal
                size="mini"
                open={ isRevokeAllUserSessionsModalVisible }
                onClose={ this.handleRevokeAllUserSessionsModalClose }
                dimmer="blurring"
            >
                <Modal.Content>
                    <Container>
                        <h3>{ t("views:userSessions.modals.revokeAllUserSessionsModal.heading") }</h3>
                    </Container>
                    <br/>
                    <p>{ t("views:userSessions.modals.revokeAllUserSessionsModal.message") }</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={ this.handleRevokeAllUserSessionsModalClose }>
                        { t("common:cancel") }
                    </Button>
                    <Button primary onClick={ this.revokeAllUserSessions }>
                        { t("common:revoke") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        const revokeUserSessionModal = (
            <Modal
                size="mini"
                open={ isRevokeUserSessionModalVisible }
                onClose={ this.handleRevokeUserSessionModalClose }
                dimmer="blurring"
            >
                <Modal.Content>
                    <Container>
                        <h3>{ t("views:userSessions.modals.revokeUserSessionModal.heading") }</h3>
                    </Container>
                    <br/>
                    <p>{ t("views:userSessions.modals.revokeUserSessionModal.message") }</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={ this.handleRevokeUserSessionModalClose }>
                        { t("common:cancel") }
                    </Button>
                    <Button primary onClick={ this.revokeUserSession }>
                        { t("common:revoke") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        return (
            <>
                <SettingsSection
                    header={ t("views:userSessions.title") }
                    description={ t("views:userSessions.description") }
                    isEdit={false}
                >
                <Divider hidden/>
                <Grid>
                    <Grid.Column width={ 12 }>
                        <Header.Subheader>{ t("views:userSessions.subTitle") }</Header.Subheader>
                    </Grid.Column>
                    <Grid.Column width={ 4 }>
                        <Button
                            floated="right"
                            negative
                            onClick={ this.handleRevokeAllUserSessionsClick }
                            loading={ isRevokeAllUserSessionsRequestLoading }
                            disabled={ !userSessions || !userSessions.sessions || !(userSessions.sessions.length > 0) }
                        >
                            { t("common:revokeAll") }
                        </Button>
                    </Grid.Column>
                </Grid>
                {
                    userSessionsNotification && userSessionsNotification.message
                    && userSessionsNotification.description ?
                        <NotificationComponent
                            message={ userSessionsNotification.message }
                            description={ userSessionsNotification.description }
                            onDismiss={ this.handleNotificationDismiss }
                            {...userSessionsNotification.otherProps }
                        />
                        : null
                }
                <Divider hidden/>

                {
                    isFetchUserSessionsRequestLoading ?
                        (
                            <Table padded celled>
                                <Table.Body>
                                    { this.createSessionListPlaceholder() }
                                </Table.Body>
                            </Table>
                        )
                        :
                        userSessions.sessions && userSessions.sessions.length > 0 ?
                            (
                                <Table padded celled>
                                    <Table.Body>
                                        { this.generateSessionList(userSessions) }
                                    </Table.Body>
                                </Table>
                            )
                            :
                            <Segment placeholder>
                                <Header icon>
                                    <Icon name="computer"/>
                                    <h3>
                                        { t("views:userSessions.placeholders.emptySessionList.heading") }
                                    </h3>
                                </Header>
                            </Segment>
                }
                {revokeAllUserSessionsModal}
                {revokeUserSessionModal}
                </SettingsSection>
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    editingUserSession: state.userSessions.editingUserSession,
    isFetchUserSessionsRequestLoading: state.userSessions.isFetchUserSessionsRequestLoading,
    isRevokeAllUserSessionsModalVisible: state.userSessions.isRevokeAllUserSessionsModalVisible,
    isRevokeAllUserSessionsRequestLoading: state.userSessions.isRevokeAllUserSessionsRequestLoading,
    isRevokeUserSessionModalVisible: state.userSessions.isRevokeUserSessionModalVisible,
    isRevokeUserSessionRequestLoading: state.userSessions.isRevokeUserSessionRequestLoading,
    isSecurityWarningVisible: state.userSessions.isSecurityWarningVisible,
    sessionsListActiveIndexes: state.userSessions.sessionsListActiveIndexes,
    userSessions: state.userSessions.userSessions,
    userSessionsNotification: state.userSessions.userSessionsNotification
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    actions: {
        userSessions: (
            bindActionCreators(
                {
                    fetchUserSessions,
                    hideRevokeAllUserSessionsModal,
                    hideRevokeUserSessionModal,
                    hideUserSessionsNotification,
                    revokeAllUserSessions,
                    revokeUserSession,
                    setEditingUserSession,
                    setSessionsListActiveIndexes,
                    showRevokeAllUserSessionsModal,
                    showRevokeUserSessionModal
                }, dispatch
            )
        )
    }
});

export const UserSessionsComponent = connect(
    mapStateToProps, mapDispatchToProps
)(withTranslation()(UserSessionsComponentInner));
