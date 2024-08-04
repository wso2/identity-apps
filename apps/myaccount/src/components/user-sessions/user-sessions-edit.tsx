/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
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

import { IBrowser, IDevice, IOS, TestableComponentInterface } from "@wso2is/core/models";
import moment from "moment";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Icon, List, SemanticICONS, Table } from "semantic-ui-react";
import { ApplicationSession, UserSession } from "../../models";
import { DangerZone, DangerZoneGroup, EditSection } from "../shared";

/**
 * Prop-types for the user sessions edit component.
 * Also see {@link UserSessionsEdit.defaultProps}
 */
interface UserSessionsEditProps extends TestableComponentInterface {
    browser: IBrowser;
    device: IDevice;
    os: IOS;
    onTerminateUserSessionClick: (userSession: UserSession) => void;
    userSession: UserSession;
    /**
     * Determines whether to show or hide the username attribute
     * next to the application name in the active sessions list.
     * Since the username is mostly common across the applications
     * we hide this by default.
     *
     * sub has tenant attached (zzz\@yyy.com)
     */
    showUsernameInApplicationUsingSub?: boolean;
}

type PlatformIcon = {
    icon: string;
    values: string[];
}

/**
 * User sessions edit component.
 *
 * @param props - Props injected to the user sessions edit component.
 * @returns User Sessions component.
 */
export const UserSessionsEdit: FunctionComponent<UserSessionsEditProps> = (
    props: UserSessionsEditProps
): JSX.Element => {

    const {
        browser,
        device,
        os,
        onTerminateUserSessionClick,
        userSession,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Resolves an icon for the operating system type extracted from the user agent string.
     *
     * @param type - Operating system type.
     * @returns OS icon.
     */
    const resolveOSIcon = (type: string): SemanticICONS => {
        const osType: Record<string, PlatformIcon> = {
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
                values: [ "Windows 10", "Windows [Phone/Mobile]" ]
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [ key, value ] of Object.entries(osType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }
    };

    /**
     * Resolves an icon for the browser type extracted from the user agent string.
     *
     * @param type - Browser type.
     * @returns Browser Icon.
     */
    const resolveBrowserIcon = (type: string): SemanticICONS => {
        const browserType: Record<string, PlatformIcon> = {
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [ key, value ] of Object.entries(browserType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }
    };

    return (
        <EditSection data-testid={ `${testId}-editing-section` } className="user-sessions-edit-secion">
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
                                        { resolveOSIcon(os.name) && (
                                            <Icon
                                                name={ resolveOSIcon(os.name) }
                                                color="grey"
                                            />
                                        ) }
                                        { os.name }{ " " }{ os.version }
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
                                            name={ resolveBrowserIcon(browser.name) }
                                            color="grey"
                                        />
                                        { browser.name }{ " " }{ browser.version }
                                    </List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 5 }>
                                    { t("common:ipAddress") }
                                </Grid.Column>
                                <Grid.Column width={ 11 }>
                                    <List.Description>{ userSession.ip }</List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            {
                                device.vendor
                                    ? (
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 5 }>
                                                { t("common:deviceModel") }
                                            </Grid.Column>
                                            <Grid.Column width={ 11 }>
                                                <List.Description>
                                                    { device.vendor }{ " " }{ device.model }
                                                </List.Description>
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                    : null
                            }
                            {
                                userSession.applications && userSession.applications.length > 0
                                    ? (
                                        <Grid.Row columns={ 2 } className="session-display-padded">
                                            <Grid.Column width={ 5 } className="session-display">
                                                { t("common:applications") }
                                            </Grid.Column>
                                            <Grid.Column mobile={ 16 } computer={ 11 }>
                                                <List.Description>
                                                    <Table celled compact className="session-table opaque">
                                                        <Table.Body>
                                                            {
                                                                userSession.applications.map(
                                                                    (app: ApplicationSession, i: number) => (
                                                                        <Table.Row key={ i }>
                                                                            <Table.Cell className="app-name">
                                                                                { app.appName }
                                                                            </Table.Cell>
                                                                            {
                                                                                true &&
                                                                                (<Table.Cell>
                                                                                    { app.subject.split("@")[0] }
                                                                                </Table.Cell>)
                                                                            }
                                                                        </Table.Row>
                                                                    )
                                                                )
                                                            }
                                                        </Table.Body>
                                                    </Table>
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
                                        { moment(parseInt(userSession.loginTime, 10)).format("lll") }
                                    </List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 5 }>
                                    { t("common:lastAccessed") }
                                </Grid.Column>
                                <Grid.Column width={ 11 }>
                                    <List.Description>
                                        { moment(parseInt(userSession.lastAccessTime, 10)).fromNow() }
                                    </List.Description>
                                </Grid.Column>
                            </Grid.Row>
                            <Divider />
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 16 }>
                                    <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                                        <DangerZone
                                            actionTitle={ t("myAccount:components.userSessions.dangerZones." +
                                                "terminate." +
                                                "actionTitle") }
                                            header={ t("myAccount:components.userSessions.dangerZones.terminate." +
                                                "header") }
                                            subheader={ t("myAccount:components.userSessions.dangerZones.terminate." +
                                                "subheader") }
                                            onActionClick={ () => onTerminateUserSessionClick(userSession) }
                                            data-testid={ `${testId}-editing-section-danger-zone-terminate` }
                                        />
                                    </DangerZoneGroup>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        </EditSection>
    );
};

/**
 * Default props of {@link UserSessionsEdit}
 * See type definitions in {@link UserSessionsEditProps}
 */
UserSessionsEdit.defaultProps = {
    "data-testid": "user-sessions-edit",
    showUsernameInApplicationUsingSub: false
};
