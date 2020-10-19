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
    ContentLoader,
    DangerButton,
    SegmentedAccordion
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
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Label, List, SemanticICONS } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../core";
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
}

/**
 * Component to manage user sessions.
 *
 * @param {UserSessionsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const UserSessions: FunctionComponent<UserSessionsPropsInterface> = (
    props: UserSessionsPropsInterface
): ReactElement => {

    const {
        defaultActiveIndexes,
        isLoading,
        user,
        [ "data-testid" ]: testId
    } = props;

    const userAgentParser = new UserAgentParser();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ userSessions, setUserSessions ] = useState<UserSessionsInterface>(undefined);
    const [ isUserSessionsFetchRequestLoading, setIsUserSessionsFetchRequestLoading ] = useState<boolean>(false);
    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>(defaultActiveIndexes);
    
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
                    description: "console:manage.features.users.userSessions.notifications.getUserSessions." +
                        "genericError.description",
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

    const renderSessionDetails = (session: UserSessionInterface): ReactElement => {

        userAgentParser.uaString = session.userAgent;

        return (
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
                                        { userAgentParser.os.name }{ " " }{ userAgentParser.os.version }
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
                                            name={ resolveBrowserIcon(userAgentParser.browser.name) }
                                            color="grey"
                                        />
                                        { userAgentParser.browser.name }{ " " }{ userAgentParser.browser.version }
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
                                userAgentParser.device.vendor
                                    ? (
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
                                    )
                                    : null
                            }
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 5 }>
                                    { t("common:loginTime") }
                                </Grid.Column>
                                <Grid.Column width={ 11 }>
                                    <List.Description>
                                        { moment(parseInt(session.loginTime, 10)).format("lll") }
                                    </List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 5 }>
                                    { t("common:lastAccessed") }
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
                                                Recent Activity
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
                                                            Logged in on <strong>
                                                            { application.appName }
                                                        </strong> as <strong>
                                                            { application.subject.split("@")[ 0 ] }
                                                        </strong>
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
                                    <DangerButton
                                        data-testid={ `${ testId }-terminate-button` }
                                        onClick={ () => handleSessionTerminate(session.id) }
                                    >
                                        Terminate Session
                                    </DangerButton>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        );
    };

    const handleAllSessionsTerminate = () => {

        terminateAllUserSessions(user.id)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: "console:manage.features.users.userSessions.notifications.terminateAllUserSessions." +
                        "success.description",
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.users.userSessions.notifications.terminateAllUserSessions." +
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
                            ".terminateAllUserSessions.error.message")
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: "console:manage.features.users.userSessions.notifications.terminateAllUserSessions." +
                        "genericError.description",
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.users.userSessions.notifications.terminateAllUserSessions." +
                        "genericError.message"
                    )
                }));
            })
            .finally(() => {
                fetchUserSessions(user.id);
            });
    };

    const handleSessionTerminate = (sessionId: string) => {

        terminateUserSession(user.id, sessionId)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: "console:manage.features.users.userSessions.notifications.terminateUserSession." +
                        "success.description",
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
                    description: "console:manage.features.users.userSessions.notifications.terminateUserSession." +
                        "genericError.description",
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
                                <DangerButton
                                    floated="right"
                                    data-testid={ `${ testId }-terminate-all-button` }
                                    onClick={ handleAllSessionsTerminate }
                                >
                                    <Icon name="add"/>
                                    Terminate All
                                </DangerButton>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <SegmentedAccordion fluid data-testid={ `${ testId }-accordion` }>
                                    {
                                        (userSessions
                                            && userSessions.sessions
                                            && Array.isArray(userSessions.sessions)
                                            && userSessions.sessions.length > 0)
                                            ? userSessions.sessions
                                                .map((session: UserSessionInterface, index: number) => (
                                                    <Fragment key={ session.id }>
                                                        <SegmentedAccordion.Title
                                                            id={ session.id }
                                                            data-testid={ `${ testId }-${ session.id }-title` }
                                                            active={ accordionActiveIndexes.includes(index) }
                                                            index={ index }
                                                            onClick={ handleAccordionOnClick }
                                                            content={ (
                                                                <>
                                                                    { session.lastAccessTime }
                                                                </>
                                                            ) }
                                                            actions={ [
                                                                {
                                                                    icon: "trash alternate",
                                                                    onClick: () => null,
                                                                    type: "icon"
                                                                }
                                                            ] }
                                                            hideChevron={ false }
                                                        />
                                                        <SegmentedAccordion.Content
                                                            active={ accordionActiveIndexes.includes(index) }
                                                            data-testid={ `${ testId }-${ session.id }-content` }
                                                        >
                                                            { renderSessionDetails(session) }
                                                        </SegmentedAccordion.Content>
                                                    </Fragment>
                                            ))
                                            : null
                                    }
                                </SegmentedAccordion>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
                : null
            : <ContentLoader/>
    );
};

/**
 * Default props for the user sessions component.
 */
UserSessions.defaultProps = {
    "data-testid": "user-sessions",
    defaultActiveIndexes: [ -1 ]
};
