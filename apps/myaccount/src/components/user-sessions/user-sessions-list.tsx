/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { UserAgentParser } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Media, Text } from "@wso2is/react-components";
import moment from "moment";
import React, { FunctionComponent, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonProps, Grid, Icon, List, SemanticICONS } from "semantic-ui-react";
import { UserSessionsEdit } from "./user-sessions-edit";
import { UserSession } from "../../models";

/**
 * Prop-types for the user sessions list component.
 * Also see {@link UserSessionsList.defaultProps}
 */
interface UserSessionsListProps extends TestableComponentInterface {
    /**
     * Callback for user session termination click event.
     */
    onTerminateUserSessionClick?: (userSession: UserSession) => void;
    /**
     * Callback for user session details click event.
     */
    onUserSessionDetailClick?: (e: MouseEvent<HTMLButtonElement>, data: ButtonProps) => void;
    /**
     * User sessions list.
     */
    userSessions: UserSession[];
    /**
     * Set of active indexes for the sessions list.
     */
    userSessionsListActiveIndexes?: number[];
}

const userAgentParser = new UserAgentParser();

/**
 * User sessions list component.
 *
 * @returns User Sessions List component.
 */
export const UserSessionsList: FunctionComponent<UserSessionsListProps> = (
    props: UserSessionsListProps
): JSX.Element => {

    const {
        onTerminateUserSessionClick,
        onUserSessionDetailClick,
        userSessions,
        userSessionsListActiveIndexes,
        ["data-testid"]: testId
    } = props;
    const { t } = useTranslation();

    /**
     * Resolves an icon for the device type extracted from the user agent string.
     *
     * @param type - Device type.
     * @returns Device Icon.
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [ key, value ] of Object.entries(deviceType)) {
            if (value.values.includes(type)) {
                return value.icon as SemanticICONS;
            }
        }

        // Default device icon.
        return "computer";
    };

    return (
        <List divided verticalAlign="middle" className="main-content-inner" data-testid={ testId }>
            {
                userSessions
                && userSessions.length
                && userSessions.length > 0
                    ? userSessions.map((userSession, index) => {
                        userAgentParser.uaString = userSession.userAgent;

                        return (
                            <List.Item
                                className="inner-list-item"
                                key={ userSession.id }
                                data-testid={ `${testId}-item` }
                            >
                                <Grid padded>
                                    <Grid.Row columns={ 2 }>
                                        <Grid.Column
                                            /*
                                             * This is a generic component. This is used in both overview
                                             * and security pages. Therefore the column width will be set
                                             * depending on the user sessions list.
                                             */
                                            width={ userSessionsListActiveIndexes ? 11 : 16 }
                                            className="first-column"
                                        >
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
                                                            t("myAccount:components.userSessions.lastAccessed",
                                                                {
                                                                    date: moment(
                                                                        parseInt(userSession.lastAccessTime, 10)
                                                                    ).fromNow()
                                                                }
                                                            )
                                                        }
                                                    </Text>
                                                </List.Description>
                                            </List.Content>
                                        </Grid.Column>
                                        {
                                            userSessionsListActiveIndexes
                                                ? (
                                                    <Grid.Column width={ 5 } className="last-column">
                                                        <List.Content floated="right">
                                                            <Media lessThan="computer">
                                                                <Button
                                                                    className="borderless-button"
                                                                    basic={ true }
                                                                    id={ index }
                                                                    onClick={ onUserSessionDetailClick }
                                                                >
                                                                    <Icon
                                                                        name={
                                                                            userSessionsListActiveIndexes
                                                                                .includes(index)
                                                                                ? "angle up"
                                                                                : "angle down"
                                                                        }
                                                                    />
                                                                </Button>
                                                            </Media>
                                                            <Media greaterThanOrEqual="computer">
                                                                <Button
                                                                    icon
                                                                    basic
                                                                    id={ index }
                                                                    labelPosition="right"
                                                                    size="mini"
                                                                    onClick={ onUserSessionDetailClick }
                                                                >
                                                                    {
                                                                        userSessionsListActiveIndexes.includes(index)
                                                                            ? (
                                                                                <>
                                                                                    { t("common:showLess") }
                                                                                    <Icon
                                                                                        name="arrow down"
                                                                                        flipped="vertically"
                                                                                    />
                                                                                </>
                                                                            )
                                                                            : (
                                                                                <>
                                                                                    { t("common:showMore") }
                                                                                    <Icon name="arrow down"/>
                                                                                </>
                                                                            )
                                                                    }
                                                                </Button>
                                                            </Media>
                                                        </List.Content>
                                                    </Grid.Column>
                                                ) : null
                                        }
                                    </Grid.Row>
                                    {
                                        userSessionsListActiveIndexes && userSessionsListActiveIndexes.includes(index)
                                            ? (
                                                <UserSessionsEdit
                                                    data-testid={ `${testId}-edit` }
                                                    browser={ userAgentParser.browser }
                                                    device={ userAgentParser.device }
                                                    os={ userAgentParser.os }
                                                    onTerminateUserSessionClick={ onTerminateUserSessionClick }
                                                    userSession={ userSession }
                                                />
                                            ) : null
                                    }
                                </Grid>
                            </List.Item>
                        );
                    })
                    : null
            }
        </List>
    );
};

/**
 * Default prop-types for the user sessions list component.
 * See type definitions in {@link UserSessionsListProps}
 */
UserSessionsList.defaultProps = {
    "data-testid": "user-sessions-list",
    onTerminateUserSessionClick: () => null,
    onUserSessionDetailClick: () => null,
    userSessionsListActiveIndexes: null
};
