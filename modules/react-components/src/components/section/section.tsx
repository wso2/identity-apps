/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, useMediaContext } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, PropsWithChildren } from "react";
import { Card, Grid, Header, Icon, List, Menu, Message, SemanticICONS } from "semantic-ui-react";

/**
 * Prop-types for the section component.
 */
export interface SectionProps extends IdentifiableComponentInterface {
    className?: string;
    contentPadding?: boolean;
    description?: string;
    connectorEnabled?: boolean;
    header: string;
    icon?: any;
    onPrimaryActionClick?: (e: MouseEvent<HTMLElement> | KeyboardEvent) => void;
    onSecondaryActionClick?: (e: MouseEvent<HTMLElement> | KeyboardEvent) => void;
    placeholder?: string;
    primaryAction?: any;
    primaryActionDisabled?: boolean;
    primaryActionIcon?: SemanticICONS;
    secondaryAction?: any;
    secondaryActionDisabled?: boolean;
    secondaryActionIcon?: SemanticICONS;
    showActionBar?: boolean;
    topActionBar?: React.ReactNode;
}

/**
 * Section component.
 *
 * @param props - Props injected to the section component.
 * @returns Section component.
 */
export const Section: FunctionComponent<PropsWithChildren<SectionProps>> = (
    props: PropsWithChildren<SectionProps>
): JSX.Element => {

    const {
        children,
        className,
        contentPadding,
        description,
        connectorEnabled,
        header,
        icon,
        onPrimaryActionClick,
        onSecondaryActionClick,
        placeholder,
        primaryAction,
        primaryActionDisabled,
        primaryActionIcon,
        secondaryAction,
        secondaryActionDisabled,
        secondaryActionIcon,
        showActionBar,
        ["data-componentid"]: testId,
        topActionBar
    } = props;

    const { isGreaterThanOrEqualComputerViewport } = useMediaContext();

    const classes = classNames({
        "with-top-action-bar": topActionBar !== undefined
    }, className);

    /**
     * Construct the action element.
     *
     * @param action - action which is passed in.
     * @param actionIcon - Icon for the action.
     * @param actionDisabled - Flag to determine if the action should be disabled.
     * @param actionOnClick - On Click handler of the action.
     * @param actionType - Type of the action.
     * @returns Constructed element.
     */
    const constructAction = (
        action: any,
        actionIcon: SemanticICONS,
        actionDisabled: boolean,
        actionOnClick: any,
        actionType: "primary" | "secondary"
    ) => {
        // if passed in action is a react component
        if (typeof action === "function" || typeof action === "object") {
            return (
                <List.Content
                    className={ actionDisabled ? "disabled" : "" }
                    floated={ actionType === "secondary" ? "right" : "left" }
                >
                    { action }
                </List.Content>
            );
        }

        // if passed in action is of type `string`.
        if (typeof action === "string") {
            return (
                <List.Content
                    className={ actionDisabled ? "disabled" : "" }
                    floated={ actionType === "secondary" ? "right" : "left" }
                >
                    <List.Header className="action-button-text" onClick={ actionOnClick }>
                        {
                            actionIcon
                                ? (<><Icon name={ actionIcon }/>{ " " }</>)
                                : null
                        }
                        { action }
                    </List.Header>
                </List.Content>
            );
        }

        return null;
    };

    return (
        <Card className={ `settings-card ${ classes }` } fluid padded="very" data-testid={ `${testId}-card` }>
            <Card.Content data-testid={ `${testId}-card-content` }>
                <Grid>
                    {
                        isGreaterThanOrEqualComputerViewport
                            ? (
                                <Grid.Row
                                    className="header-section"
                                    columns={ 2 }
                                    data-testid={ `${testId}-card-content-header` }
                                >
                                    <Grid.Column
                                        width={ (connectorEnabled != undefined) ? 13 : 16 }
                                        className="no-padding"
                                    >
                                        <Header as="h2">
                                            {
                                                icon
                                                    ? (
                                                        <GenericIcon
                                                            size="micro"
                                                            icon={ icon }
                                                            inline
                                                            transparent
                                                            shape={ "square" }
                                                            style={ {
                                                                "display": "inline",
                                                                "verticalAlign": "text-bottom"
                                                            } }
                                                        />
                                                    )
                                                    : null
                                            }
                                            { header }
                                        </Header>
                                        <Card.Meta>{ description }</Card.Meta>
                                    </Grid.Column>
                                    {
                                        connectorEnabled !== undefined
                                            ? (
                                                <Grid.Column
                                                    width={ 3 }
                                                    className="no-padding"
                                                    textAlign="right"
                                                    as="h5"
                                                    data-testid={ `${testId}-connector-enable-status` }
                                                >
                                                    <Icon
                                                        color={ connectorEnabled ? "green":"grey" }
                                                        name={ connectorEnabled ? "check circle" : "minus circle" }
                                                    />
                                                    { connectorEnabled ? "Enabled" : "Disabled" }
                                                </Grid.Column>
                                            )
                                            : null
                                    }
                                </Grid.Row>
                            )
                            : (
                                <Grid.Row
                                    className="header-section"
                                    columns={ 2 }
                                    data-testid={ `${testId}-card-content-header` }
                                >
                                    <Grid.Column
                                        width={ (connectorEnabled != undefined) ? 12 : 16 }
                                        className="no-padding"
                                    >
                                        <Header as="h2">{ header }</Header>
                                        <Card.Meta>{ description }</Card.Meta>
                                    </Grid.Column>
                                    {
                                        connectorEnabled !== undefined
                                            ? (
                                                <Grid.Column
                                                    width={ 4 }
                                                    className="no-padding"
                                                    textAlign="right"
                                                    as="h5"
                                                    data-testid={ `${testId}-connector-enable-status` }
                                                >
                                                    <Icon
                                                        color={ connectorEnabled ? "green":"grey" }
                                                        name={ connectorEnabled ? "check circle" : "minus circle" }
                                                    />
                                                    { connectorEnabled ? "Enabled" : "Disabled" }
                                                </Grid.Column>
                                            )
                                            : null
                                    }
                                </Grid.Row>
                            )
                    }
                    <Grid.Row
                        className={ `main-content ${ contentPadding ? "" : "no-padding" }` }
                        columns={ 1 }
                        data-testid={ `${testId}-card-content-items` }
                    >
                        <Grid.Column className="no-padding" width={ 16 }>
                            {
                                topActionBar
                                    ? (
                                        <Menu className="top-action-panel no-margin-bottom">
                                            <Menu.Menu position="right">
                                                { topActionBar }
                                            </Menu.Menu>
                                        </Menu>
                                    )
                                    : null
                            }
                            { children }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card.Content>
            {
                (primaryAction || secondaryAction || placeholder) && showActionBar
                    ? (
                        <Card.Content className="extra-content" extra>
                            <List selection={ !secondaryAction } verticalAlign="middle">
                                <List.Item
                                    active
                                    className="action-button"
                                    tabIndex={ 0 }
                                    disabled={ !!placeholder }
                                    // if both `primaryAction` & `secondaryAction` are passed in,
                                    // disable list item `onClick`.
                                    onClick={ !(primaryAction && secondaryAction)
                                        ? onSecondaryActionClick || onPrimaryActionClick
                                        : null
                                    }
                                    data-testid={ primaryAction
                                        ? `${testId}-card-primary-button`
                                        : secondaryAction
                                            ? `${testId}-card-secondary-button`
                                            : `${testId}-card-placeholder` }
                                    onKeyPress={ (e: KeyboardEvent) => {
                                        if (e.key !== "Enter") {
                                            return;
                                        }

                                        if (onPrimaryActionClick) {
                                            onPrimaryActionClick(e);

                                            return;
                                        }

                                        if (onSecondaryActionClick) {
                                            onSecondaryActionClick(e);

                                            return;
                                        }
                                    } }
                                >

                                    {
                                        placeholder
                                            ? (
                                                <List.Header className="action-button-text">
                                                    <Message info>
                                                        <Icon name="info circle" />{ placeholder }
                                                    </Message>
                                                </List.Header>
                                            )
                                            : (
                                                <>
                                                    {
                                                        primaryAction
                                                            ? constructAction(
                                                                primaryAction,
                                                                primaryActionIcon,
                                                                primaryActionDisabled,
                                                                (primaryAction && secondaryAction)
                                                                    ? onPrimaryActionClick
                                                                    : null,
                                                                "primary"
                                                            )
                                                            : null
                                                    }
                                                    {
                                                        secondaryAction
                                                            ? constructAction(
                                                                secondaryAction,
                                                                secondaryActionIcon,
                                                                secondaryActionDisabled,
                                                                (primaryAction && secondaryAction)
                                                                    ? onSecondaryActionClick
                                                                    : null,
                                                                "secondary"
                                                            )
                                                            : null
                                                    }
                                                    <List.Content
                                                        floated={ "right" }
                                                    >
                                                        <List.Header className="action-button-text">
                                                            <Icon name="angle right" size="large"/>
                                                        </List.Header>
                                                    </List.Content>
                                                </>
                                            )
                                    }
                                </List.Item>
                            </List>
                        </Card.Content>
                    )
                    : null
            }
        </Card>
    );
};

/**
 * Default prop-types for the section component.
 */
Section.defaultProps = {
    className: "",
    contentPadding: false,
    "data-componentid": "section",
    description: "",
    header: "",
    primaryAction: "",
    primaryActionDisabled: false,
    showActionBar: true,
    topActionBar: null
};
