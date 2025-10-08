/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com).
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

import { APIErrorResponseInterface, TestableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment } from "@wso2is/react-components";
import { AxiosError } from "axios";
import reverse from "lodash-es/reverse";
import sortBy from "lodash-es/sortBy";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonProps, Container, Modal, Placeholder } from "semantic-ui-react";
import { UserSessionsList } from "./user-sessions-list";
import { fetchUserSessions, terminateAllUserSessions, terminateUserSession } from "../../api";
import { AppConstants } from "../../constants";
import { history } from "../../helpers";
import {
    AlertInterface,
    AlertLevels,
    UserSession,
    UserSessions,
    emptyUserSession,
    emptyUserSessions
} from "../../models";
import { SettingsSection } from "../shared";

/**
 * Proptypes for the user sessions component.
 * Also see {@link UserSessionsComponent}
 */
interface UserSessionsComponentProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * User sessions component.
 *
 * @param props - Props injected to the component.
 * @returns User sessions component.
 */
export const UserSessionsComponent: FunctionComponent<UserSessionsComponentProps> = (
    props: UserSessionsComponentProps
): ReactElement => {

    const { onAlertFired, ["data-testid"]: testId } = props;

    const { t } = useTranslation();

    const [ userSessions, setUserSessions ] = useState<UserSessions>(emptyUserSessions);
    const [ editingUserSession, setEditingUserSession ] = useState<UserSession>(emptyUserSession);
    const [ isRevokeAllUserSessionsModalVisible, setRevokeAllUserSessionsModalVisibility ] = useState(false);
    const [ isRevokeUserSessionModalVisible, setRevokeUserSessionModalVisibility ] = useState(false);
    const [ sessionsListActiveIndexes, setSessionsListActiveIndexes ] = useState([]);
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
            .catch((error: AxiosError<APIErrorResponseInterface> & { response: { detail: string } }) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.userSessions.notifications.fetchSessions.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.userSessions.notifications.fetchSessions.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.userSessions.notifications.fetchSessions.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.userSessions.notifications.fetchSessions.genericError.message"
                    )
                });
            })
            .finally(() => {
                setIsSessionDetailsLoading(false);
            });
    };

    /**
     * Fetches the user sessions on component load.
     */
    useEffect(() => {
        getUserSessions();
    }, []);

    /**
     * Handler for the session detail button click.
     *
     * @param e - Click event.
     * @param id - Session id.
     */
    const handleSessionDetailClick = (e: MouseEvent<HTMLButtonElement>, { id }: ButtonProps): void => {
        const indexes: number[] = [ ...sessionsListActiveIndexes ];

        if (!sessionsListActiveIndexes.includes(id)) {
            indexes.push(id);
        } else if (sessionsListActiveIndexes.includes(id)) {
            const removingIndex: number = sessionsListActiveIndexes.indexOf(id);

            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }
        }
        setSessionsListActiveIndexes(indexes);
    };

    /**
     * Terminate a single user session.
     */
    const handleTerminateUserSession = (): void => {
        terminateUserSession(editingUserSession.id)
            .then(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.userSessions.notifications.terminateUserSession.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.userSessions.notifications.terminateUserSession.success.message"
                    )
                });
            })
            .catch((error: AxiosError<APIErrorResponseInterface> & { response: { detail: string; } }) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.userSessions.notifications.terminateUserSession.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.userSessions.notifications.terminateUserSession.error.message"
                        )
                    });
                } else {
                    onAlertFired({
                        description: t(
                            "myAccount:components.userSessions.notifications.terminateUserSession.genericError." +
                            "description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.userSessions.notifications.terminateUserSession.genericError.message"
                        )
                    });
                }
            })
            .finally(() => {
                setRevokeUserSessionModalVisibility(false);
                getUserSessions();
            });
    };

    /**
     * Terminates all the user sessions.
     */
    const handleTerminateAllUserSessions = (): void => {
        terminateAllUserSessions()
            .then(() => {
                history.push(AppConstants.getPaths().get("LOGOUT"));
                onAlertFired({
                    description: t(
                        "myAccount:components.userSessions.notifications.terminateAllUserSessions.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.userSessions.notifications.terminateAllUserSessions.success.message"
                    )
                });
            })
            .catch((error: AxiosError<APIErrorResponseInterface> & { response: { detail: string; } }) => {
                getUserSessions();
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.userSessions.notifications.terminateAllUserSessions." +
                            "error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.userSessions.notifications.terminateAllUserSessions.error" +
                            ".message"
                        )
                    });
                } else {
                    onAlertFired({
                        description: t(
                            "myAccount:components.userSessions.notifications.terminateAllUserSessions." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.userSessions.notifications.terminateAllUserSessions." +
                            "genericError.message"
                        )
                    });
                }
            })
            .finally(() => {
                setRevokeAllUserSessionsModalVisibility(false);
            });
    };

    /**
     * Handles the terminate all user sessions click event.
     */
    const handleTerminateAllUserSessionsClick = (): void => {
        setRevokeAllUserSessionsModalVisibility(true);
    };

    /**
     * Handles the terminate user sessions click event.
     *
     * @param session - Session which needs to be edited.
     */
    const handleTerminateUserSessionClick = (session: UserSession): void => {
        setEditingUserSession(session);
        setRevokeUserSessionModalVisibility(true);
    };

    /**
     * Handle the terminate all user sessions modal close event.
     */
    const handleTerminateAllUserSessionsModalClose = (): void => {
        setRevokeAllUserSessionsModalVisibility(false);
    };

    /**
     * Handle the terminate user session modal close event.
     */
    const handleTerminateUserSessionModalClose = (): void => {
        setRevokeUserSessionModalVisibility(false);
    };

    const terminateAllUserSessionsModal: ReactElement = (
        <Modal
            data-testid={ `${testId}-terminate-all-modal` }
            size="mini"
            open={ isRevokeAllUserSessionsModalVisible }
            onClose={ handleTerminateAllUserSessionsModalClose }
            dimmer="blurring"
        >
            <Modal.Content data-testid={ `${testId}-terminate-all-modal-content` }>
                <Container>
                    <h3>{ t("myAccount:components.userSessions.modals.terminateAllUserSessionsModal.heading") }</h3>
                </Container>
                <br/>
                <p>{ t("myAccount:components.userSessions.modals.terminateAllUserSessionsModal.message") }</p>
            </Modal.Content>
            <Modal.Actions data-testid={ `${testId}-terminate-all-modal-actions` }>
                <Button className="link-button" onClick={ handleTerminateAllUserSessionsModalClose }>
                    { t("common:cancel") }
                </Button>
                <Button primary={ true } onClick={ handleTerminateAllUserSessions }>
                    { t("common:terminate") }
                </Button>
            </Modal.Actions>
        </Modal>
    );

    const terminateUserSessionModal: ReactElement = (
        <Modal
            data-testid={ `${testId}-termination-modal` }
            size="mini"
            open={ isRevokeUserSessionModalVisible }
            onClose={ handleTerminateUserSessionModalClose }
            dimmer="blurring"
        >
            <Modal.Content data-testid={ `${testId}-termination-modal-content` }>
                <Container>
                    <h3>{ t("myAccount:components.userSessions.modals.terminateUserSessionModal.heading") }</h3>
                </Container>
                <br/>
                <p>{ t("myAccount:components.userSessions.modals.terminateUserSessionModal.message") }</p>
            </Modal.Content>
            <Modal.Actions data-testid={ `${testId}-termination-modal-actions` }>
                <Button
                    className="link-button"
                    onClick={ handleTerminateUserSessionModalClose }
                    data-testid={ `${testId}-termination-modal-actions-cancel-button` }>
                    { t("common:cancel") }
                </Button>
                <Button
                    primary={ true }
                    onClick={ handleTerminateUserSession }
                    data-testid={ `${testId}-termination-modal-actions-terminate-button` }>
                    { t("common:terminate") }
                </Button>
            </Modal.Actions>
        </Modal>
    );

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            description={ t("myAccount:sections.userSessions.description") }
            header={ t("myAccount:sections.userSessions.heading") }
            placeholder={
                ! isSessionDetailsLoading &&
                !(userSessions && userSessions.sessions && (userSessions.sessions.length > 0))
                    ? t("myAccount:sections.userSessions.actionTitles.empty")
                    : null
            }
            topActionBar={
                (userSessions && userSessions.sessions && (userSessions.sessions.length > 0))
                    ? (
                        <Button
                            className="borderless-button"
                            basic={ true }
                            color="red"
                            onClick={ handleTerminateAllUserSessionsClick }
                            data-testid={ `${testId}-settings-section-user-sessions-terminate-all-button` }
                        >
                            { t("common:terminateAll") }
                        </Button>
                    )
                    : null
            }
        >
            { !isSessionDetailsLoading ?
                (<UserSessionsList
                    data-testid={ `${testId}-list` }
                    onTerminateUserSessionClick={ handleTerminateUserSessionClick }
                    onUserSessionDetailClick={ handleSessionDetailClick }
                    userSessions={ userSessions && userSessions.sessions ? userSessions.sessions : null }
                    userSessionsListActiveIndexes={ sessionsListActiveIndexes }
                />)
                : (<EmphasizedSegment className="placeholder-container">
                    <Placeholder fluid>
                        <Placeholder.Header image>
                            <Placeholder.Line/>
                            <Placeholder.Line/>
                        </Placeholder.Header>
                    </Placeholder>
                </EmphasizedSegment>)
            }
            { terminateAllUserSessionsModal }
            { terminateUserSessionModal }
        </SettingsSection>
    );
};

/**
 * Default props of {@link UserSessionsComponent}
 * See type definitions in {@link UserSessionsComponentProps}
 */
UserSessionsComponent.defaultProps = {
    "data-testid": "user-sessions-component"
};
