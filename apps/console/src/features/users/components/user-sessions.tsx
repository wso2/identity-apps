/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { UserAgentParser } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    ProfileInfoInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    DangerButton,
    DangerZone,
    DangerZoneGroup,
    EmptyPlaceholder,
    GenericIcon,
    SegmentedAccordion,
    Text
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import moment from "moment";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    SyntheticEvent, useEffect,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Icon, Label, List, SemanticICONS } from "semantic-ui-react";
import { userstoresConfig } from "../../../extensions";
import { AppState, FeatureConfigInterface, getEmptyPlaceholderIllustrations, history } from "../../core";
import { getUserSessions, terminateAllUserSessions, terminateUserSession } from "../api";
import { ApplicationSessionInterface, UserSessionInterface, UserSessionsInterface } from "../models";

/**
 * Proptypes for the user sessions component.
 */
interface UserSessionsPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Initial activeIndexes value.
     */
    defaultActiveIndexes?: number[];
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Specifies if the session termination button should be shown
     */
    showSessionTerminationButton?: boolean;
}

/**
 * Component to manage user sessions.
 *
 * @param {UserSessionsPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const UserSessions: FunctionComponent<UserSessionsPropsInterface> = (
    props: UserSessionsPropsInterface
): ReactElement => {

    const {
        defaultActiveIndexes,
        isLoading,
        user,
        showSessionTerminationButton,
        [ "data-testid" ]: testId
    } = props;

    const userAgentParser = new UserAgentParser();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ userSessions, setUserSessions ] = useState<UserSessionsInterface>(undefined);
    const [ terminatingSession, setTerminatingSession ] = useState<UserSessionInterface>(undefined);
    const [ isUserSessionsFetchRequestLoading, setIsUserSessionsFetchRequestLoading ] = useState<boolean>(false);
    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>(defaultActiveIndexes);
    const [
        showSessionTerminateConfirmationModal,
        setShowSessionTerminateConfirmationModal
    ] = useState<boolean>(false);
    const [
        showAllSessionsTerminateConfirmationModal,
        setShowAllSessionsTerminateConfirmationModal
    ] = useState<boolean>(false);
    const authenticatedUserTenanted: string = useSelector((state: AppState) => state?.auth?.username);
    const authenticatedUserComponents = authenticatedUserTenanted.split("@");
    authenticatedUserComponents.pop();
    const authenticatedUser = authenticatedUserComponents.join("@");

    /**
     * Fetches the active sessions once the user prop is avaiable.
     */
    useEffect(() => {

        if (!user || !user.id) {
            return;
        }

        fetchUserSessions(user.id);
    }, [ user ]);

    /**
     * Fetches the active user sessions belonging to a specific user.
     *
     * @param {string} id - User ID
     */
    const fetchUserSessions = (id: string): void => {

        setIsUserSessionsFetchRequestLoading(true);

        getUserSessions(id)
            .then((response: AxiosResponse<UserSessionsInterface>) => {
                setUserSessions(response.data);
            })
            .catch((error: AxiosError) => {
                if (error.response
                    && error.response.data
                    && (error.response.data.description || error.response.data.detail)) {

                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description || error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.users.userSessions.notifications.getUserSessions.error.message"
                        )
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.users.userSessions.notifications.getUserSessions." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.users.userSessions.notifications.getUserSessions." +
                        "genericError.message"
                    )
                }));
            })
            .finally(() => {
                setIsUserSessionsFetchRequestLoading(false);
            });
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

        for (const value of Object.values(deviceType)) {
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

        for (const value of Object.values(osType)) {
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
            edge: {
                icon: "edge",
                values: [ "Edge" ]
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

        for (const value of Object.values(browserType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }
    };

    /**
     * Handles accordion title click.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {number} index - Clicked on index.
     */
    const handleAccordionOnClick = (e: SyntheticEvent, { index }: { index: number }): void => {

        const newIndexes = [ ...accordionActiveIndexes ];

        if (newIndexes.includes(index)) {
            const removingIndex = newIndexes.indexOf(index);
            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(index);
        }

        setAccordionActiveIndexes(newIndexes);
    };

    /**
     * Processes the username according to userstore configurations.
     *
     * @param {string} applicationSubject
     * @return {string}
     */
    const getUsername = (applicationSubject: string): string => {

        const splitComponents = applicationSubject.split("/");
        let username = applicationSubject;

        if (splitComponents.length > 1 && !userstoresConfig.userstoreDomain.appendToUsername) {
            username = splitComponents[1];
        }
        if (username.split("@").length > 1) {
            return username.split("@")[0].concat("@").concat(username.split("@")[1]);
        }

        return username.split("@")[0];
    };

    /**
     * Renders user session details.
     *
     * @param {UserSessionInterface} session - User session object.
     * @return {React.ReactElement}
     */
    const renderSessionDetails = (session: UserSessionInterface): ReactElement => {

        userAgentParser.uaString = session.userAgent;

        return (
            <Grid.Row>
                <Grid.Column>
                    <List.Content>
                        <Grid padded>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 5 }>
                                    {
                                        t("console:manage.features.users.userSessions.components.sessionDetails" +
                                            ".labels.os")
                                    }
                                </Grid.Column>
                                <Grid.Column width={ 11 }>
                                    <List.Description>
                                        <Icon
                                            name={ resolveOSIcon(userAgentParser.os.name) }
                                            color="grey"
                                        />
                                        { userAgentParser.os.name }{ " " }{ userAgentParser.os.version }
                                    </List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 5 }>
                                    {
                                        t("console:manage.features.users.userSessions.components.sessionDetails" +
                                            ".labels.browser")
                                    }
                                </Grid.Column>
                                <Grid.Column width={ 11 }>
                                    <List.Description>
                                        <Icon
                                            name={ resolveBrowserIcon(userAgentParser.browser.name) }
                                            color="grey"
                                        />
                                        { userAgentParser.browser.name }{ " " }{ userAgentParser.browser.version }
                                    </List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 5 }>
                                    {
                                        t("console:manage.features.users.userSessions.components.sessionDetails" +
                                            ".labels.ip")
                                    }
                                </Grid.Column>
                                <Grid.Column width={ 11 }>
                                    <List.Description data-suppress="">{ session.ip }</List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            {
                                userAgentParser.device.vendor
                                    ? (
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 5 }>
                                                {
                                                    t("console:manage.features.users.userSessions.components" +
                                                        ".sessionDetails.labels.deviceModel")
                                                }
                                            </Grid.Column>
                                            <Grid.Column width={ 11 }>
                                                <List.Description>
                                                    { userAgentParser.device.vendor }
                                                    { " " }
                                                    { userAgentParser.device.model }
                                                </List.Description>
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                    : null
                            }
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 5 }>
                                    {
                                        t("console:manage.features.users.userSessions.components" +
                                            ".sessionDetails.labels.loginTime")
                                    }
                                </Grid.Column>
                                <Grid.Column width={ 11 }>
                                    <List.Description>
                                        { moment(parseInt(session.loginTime, 10)).format("lll") }
                                    </List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 5 }>
                                    {
                                        t("console:manage.features.users.userSessions.components" +
                                            ".sessionDetails.labels.lastAccessed", {
                                            date: ""
                                        })
                                    }
                                </Grid.Column>
                                <Grid.Column width={ 11 }>
                                    <List.Description>
                                        { moment(parseInt(session.lastAccessTime, 10)).fromNow() }
                                    </List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            {
                                (session.applications && session.applications.length > 0)
                                    ? (
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 5 }>
                                                {
                                                    t("console:manage.features.users.userSessions.components" +
                                                        ".sessionDetails.labels.activeApplication")
                                                }
                                            </Grid.Column>
                                            <Grid.Column mobile={ 16 } computer={ 11 }>
                                                {
                                                    session.applications.map((application: ApplicationSessionInterface,
                                                                              index: number) => (
                                                        <List.Description className="pb-2" key={ index }>
                                                            <Label
                                                                className="micro spaced-right"
                                                                circular
                                                                color="green"
                                                                size="mini"
                                                            />
                                                            <Trans
                                                                i18nKey={
                                                                    "console:manage.features.users.userSessions" +
                                                                    ".components.sessionDetails.labels.loggedInAs"
                                                                }
                                                                tOptions={ {
                                                                    app: application.appName,
                                                                    user: getUsername(application.subject)
                                                                } }
                                                            >
                                                                { "Logged in on " }
                                                                <strong>
                                                                    { application.appName }
                                                                </strong>
                                                                { " as " }
                                                                <strong>
                                                                    { application.subject.split("@")[ 0 ] }
                                                                </strong>
                                                            </Trans>
                                                        </List.Description>
                                                    ))
                                                }
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                    : null
                            }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 16 }>
                                    { showSessionTerminationButton && (
                                        <Show when={ AccessControlConstants.USER_EDIT }>
                                            <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                                                <DangerZone
                                                    actionTitle={ t("console:manage.features.users.userSessions." +
                                                        "dangerZones.terminate." +
                                                        "actionTitle") }
                                                    header={
                                                        t("console:manage.features.users.userSessions.dangerZones." +
                                                        "terminate.header") }
                                                    subheader={ t("console:manage.features.users.userSessions." +
                                                        "dangerZones.terminate.subheader") }
                                                    onActionClick={ () => {
                                                        setTerminatingSession(session);
                                                        setShowSessionTerminateConfirmationModal(true);
                                                    } }
                                                    data-testid={ `${ testId }-terminate-button` }
                                                />
                                            </DangerZoneGroup>
                                        </Show>
                                    ) }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        );
    };

    /**
     * Terminates all active user sessions.
     */
    const handleAllSessionsTerminate = (): void => {

        terminateAllUserSessions(user.id)
            .then(() => {
                // Redirect to login page if all the sessions are terminated.
                if (authenticatedUser === user?.userName) {
                    history.push(window["AppUtils"].getConfig().routes.logout);
                }
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "console:manage.features.users.userSessions.notifications.terminateAllUserSessions." +
                        "success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.users.userSessions.notifications.terminateAllUserSessions." +
                        "success.message"
                    )
                }));
            })
            .catch((error: AxiosError) => {
                // fetch the sessions if and only if the session termination fails.
                fetchUserSessions(user.id);
                if (error.response
                    && error.response.data
                    && (error.response.data.description || error.response.data.detail)) {

                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description || error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.users.userSessions.notifications" +
                            ".terminateAllUserSessions.error.message")
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "console:manage.features.users.userSessions.notifications.terminateAllUserSessions." +
                        "genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.users.userSessions.notifications.terminateAllUserSessions." +
                        "genericError.message"
                    )
                }));
            })
            .finally(() => {
                if (authenticatedUser !== user?.userName) {
                    fetchUserSessions(user.id);
                }
            });
    };

    /**
     * Terminate the selected user session.
     *
     * @param {string} sessionId - ID of the session to be terminated.
     */
    const handleSessionTerminate = (sessionId: string): void => {

        terminateUserSession(user.id, sessionId)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.users.userSessions.notifications.terminateUserSession." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.users.userSessions.notifications.terminateUserSession." +
                        "success.message"
                    )
                }));
            })
            .catch((error: AxiosError) => {
                if (error.response
                    && error.response.data
                    && (error.response.data.description || error.response.data.detail)) {

                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description || error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.users.userSessions.notifications" +
                            ".terminateUserSession.error.message")
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.users.userSessions.notifications.terminateUserSession." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.users.userSessions.notifications.terminateUserSession." +
                        "genericError.message"
                    )
                }));
            })
            .finally(() => {
                fetchUserSessions(user.id);
            });
    };

    /**
     * Renders the session listing accordion.
     * @return {React.ReactElement}
     */
    const renderAccordion = (): ReactElement => {

        return (
            <SegmentedAccordion fluid data-testid={ `${ testId }-accordion` }>
                {
                    userSessions.sessions.map((session: UserSessionInterface, index: number) => {

                        console.log({
                            date: moment(
                                parseInt(session.lastAccessTime, 10)
                            ).fromNow()
                        });

                        userAgentParser.uaString = session.userAgent;

                        return (
                            <Fragment key={ session.id }>
                                <SegmentedAccordion.Title
                                    id={ session.id }
                                    data-testid={ `${ testId }-${ session.id }-title` }
                                    active={ accordionActiveIndexes.includes(index) }
                                    index={ index }
                                    onClick={ handleAccordionOnClick }
                                    content={ (
                                        <>
                                            <GenericIcon
                                                icon={
                                                    (
                                                        <Icon
                                                            name={ resolveDeviceType(userAgentParser.device.type) }
                                                            size="big"
                                                            color="grey"
                                                        />
                                                    )
                                                }
                                                transparent
                                                spaced="right"
                                                floated="left"
                                                data-testid={
                                                    `${ testId }-${ session.id }-title-icon`
                                                }
                                            />
                                            <List.Content>
                                                <List.Header>
                                                    { userAgentParser.browser.name }
                                                    { " on " }
                                                    { userAgentParser.os.name }
                                                </List.Header>
                                                <List.Description>
                                                    <Text size={ 11 }>
                                                        {
                                                            t("console:manage.features.users.userSessions." +
                                                                "components.sessionDetails.labels.lastAccessed",
                                                                {
                                                                    date: moment(
                                                                        parseInt(session.lastAccessTime, 10)
                                                                    ).fromNow()
                                                                }
                                                            )
                                                        }
                                                    </Text>
                                                </List.Description>
                                            </List.Content>
                                        </>
                                    ) }
                                    hideChevron={ false }
                                />
                                <SegmentedAccordion.Content
                                    active={ accordionActiveIndexes.includes(index) }
                                    data-testid={ `${ testId }-${ session.id }-content` }
                                >
                                    { renderSessionDetails(session) }
                                </SegmentedAccordion.Content>
                            </Fragment>
                        );
                    })
                }
            </SegmentedAccordion>
        );
    };

    return (
        (!isLoading && !isUserSessionsFetchRequestLoading)
            ? (userSessions
                && userSessions.sessions
                && Array.isArray(userSessions.sessions)
                && userSessions.sessions.length > 0)
                ? (
                    <Grid data-testid={ testId }>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                { showSessionTerminationButton && (
                                    <Show when={ AccessControlConstants.USER_EDIT }>
                                        <DangerButton
                                            floated="right"
                                            data-testid={ `${ testId }-terminate-all-button` }
                                            onClick={ () => setShowAllSessionsTerminateConfirmationModal(true) }
                                        >
                                            {
                                                t("console:manage.features.users.userSessions." +
                                                    "components.sessionDetails.actions.terminateAllSessions")
                                                }
                                            </DangerButton>
                                    </Show>
                                ) }
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                { renderAccordion() }
                            </Grid.Column>
                        </Grid.Row>
                        {
                            (showSessionTerminateConfirmationModal || showAllSessionsTerminateConfirmationModal) && (
                                <ConfirmationModal
                                    onClose={ (): void => {
                                        if (showSessionTerminateConfirmationModal) {
                                            setShowSessionTerminateConfirmationModal(false);

                                            return;
                                        }

                                        setShowAllSessionsTerminateConfirmationModal(false);
                                    } }
                                    type="warning"
                                    open={
                                        showSessionTerminateConfirmationModal
                                        || showAllSessionsTerminateConfirmationModal
                                    }
                                    assertion={ getUsername(user.userName) }
                                    assertionHint={ showSessionTerminateConfirmationModal
                                        ? t("console:manage.features.users.confirmations." +
                                        "terminateSession.assertionHint")
                                        : t("console:manage.features.users.confirmations." +
                                        "terminateAllSessions.assertionHint") }
                                    assertionType="checkbox"
                                    primaryAction={ t("common:confirm") }
                                    secondaryAction={ t("common:cancel") }
                                    onSecondaryActionClick={ (): void => {
                                        if (showSessionTerminateConfirmationModal) {
                                            setShowSessionTerminateConfirmationModal(false);

                                            return;
                                        }

                                        setShowAllSessionsTerminateConfirmationModal(false);
                                    } }
                                    onPrimaryActionClick={ (): void => {
                                        if (showSessionTerminateConfirmationModal) {
                                            handleSessionTerminate(terminatingSession.id);
                                            setShowSessionTerminateConfirmationModal(false);

                                            return;
                                        }

                                        handleAllSessionsTerminate();
                                        setShowAllSessionsTerminateConfirmationModal(false);
                                    } }
                                    data-testid={
                                        showSessionTerminateConfirmationModal
                                            ? "session-terminate-confirmation-modal"
                                            : "all-sessions-terminate-confirmation-modal"
                                    }
                                    closeOnDimmerClick={ false }
                                >
                                    <ConfirmationModal.Header
                                        data-testid={
                                            showSessionTerminateConfirmationModal
                                                ? "session-terminate-confirmation-modal-header"
                                                : "all-sessions-terminate-confirmation-modal-header"
                                        }
                                    >
                                        {
                                            showSessionTerminateConfirmationModal
                                                ? t("console:manage.features.users.confirmations." +
                                                "terminateSession.header")
                                                : t("console:manage.features.users.confirmations." +
                                                "terminateAllSessions.header")
                                        }
                                    </ConfirmationModal.Header>
                                    <ConfirmationModal.Message
                                        attached
                                        warning
                                        data-testid={
                                            showSessionTerminateConfirmationModal
                                                ? "session-terminate-confirmation-modal-message"
                                                : "all-sessions-terminate-confirmation-modal-message"
                                        }
                                    >
                                        {
                                            showSessionTerminateConfirmationModal
                                                ? t("console:manage.features.users.confirmations." +
                                                "terminateSession.message")
                                                : t("console:manage.features.users.confirmations." +
                                                "terminateAllSessions.message")
                                        }
                                    </ConfirmationModal.Message>
                                    <ConfirmationModal.Content
                                        data-testid={
                                            showSessionTerminateConfirmationModal
                                                ? "session-terminate-confirmation-modal-content"
                                                : "all-sessions-terminate-confirmation-modal-content"
                                        }
                                    >
                                        {
                                            showSessionTerminateConfirmationModal
                                                ? t("console:manage.features.users.confirmations." +
                                                "terminateSession.content")
                                                : t("console:manage.features.users.confirmations." +
                                                "terminateAllSessions.content")
                                        }
                                    </ConfirmationModal.Content>
                                </ConfirmationModal>
                            )
                        }
                    </Grid>
                )
                :
                (
                    <EmptyPlaceholder
                        image={ getEmptyPlaceholderIllustrations().emptyList }
                        imageSize="tiny"
                        title={
                            t("console:manage.features.users.userSessions.placeholders.emptyListPlaceholder.title")
                        }
                        subtitle={ [
                            t("console:manage.features.users.userSessions.placeholders.emptyListPlaceholder.subtitles")
                        ] }
                    />
                )
            : <ContentLoader/>
    );
};

/**
 * Default props for the user sessions component.
 */
UserSessions.defaultProps = {
    "data-testid": "user-sessions",
    defaultActiveIndexes: [ -1 ],
    showSessionTerminationButton: true
};
