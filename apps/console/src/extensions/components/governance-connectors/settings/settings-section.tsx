/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon } from "@wso2is/react-components";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, MouseEvent, PropsWithChildren } from "react";
import { Card, Grid, Header, Icon, List, Menu, Message, Responsive, SemanticICONS } from "semantic-ui-react";

/**
 * Proptypes for the settings section component. See also
 * {@link SettingsSection.defaultProps}
 */
interface SettingsSectionProps extends TestableComponentInterface {
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
 * Settings section component.
 *
 * @param {PropsWithChildren<any>} props
 * @return {any}
 */
export const SettingsSection: FunctionComponent<PropsWithChildren<SettingsSectionProps>> = (
    props: PropsWithChildren<SettingsSectionProps>
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
        ["data-testid"]: testId,
        topActionBar
    } = props;

    const classes = classNames({
        "with-top-action-bar": topActionBar !== undefined
    }, className);

    /**
     * Construct the action element.
     *
     * @param action - action which is passed in.
     * @param {SemanticICONS} actionIcon - Icon for the action.
     * @param {boolean} actionDisabled - Flag to determine if the action should be disabled.
     * @param actionOnClick - On Click handler of the action.
     * @param {"primary" | "secondary"} actionType - Type of the action.
     * @return Constructed element.
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
                    <Responsive as={ Fragment } { ...Responsive.onlyComputer }>
                        <Grid.Row className="header-section" columns={ 2 }
                                  data-testid={ `${testId}-card-content-header` }>
                            <Grid.Column width={ (connectorEnabled != undefined) ? 13 : 16 } className="no-padding">
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
                                connectorEnabled !== undefined ? (
                                        <Grid.Column width={ 3 } className="no-padding" textAlign="right" as="h5"
                                                     data-testid={ `${testId}-connector-enable-status` }>
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
                    </Responsive>
                    <Responsive as={ Fragment } maxWidth={ Responsive.onlyTablet.maxWidth }>
                        <Grid.Row className="header-section" columns={ 2 }
                                  data-testid={ `${testId}-card-content-header` }>
                            <Grid.Column width={ (connectorEnabled != undefined) ? 12 : 16 } className="no-padding">
                                <Header as="h2">{ header }</Header>
                                <Card.Meta>{ description }</Card.Meta>
                            </Grid.Column>
                            {
                                connectorEnabled !== undefined ? (
                                    <Grid.Column width={ 4 } className="no-padding" textAlign="right" as="h5"
                                                 data-testid={ `${testId}-connector-enable-status` }>
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
                    </Responsive>
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
                (primaryAction || secondaryAction || placeholder) && showActionBar ? (
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
 * Default proptypes for the settings section component.
 */
SettingsSection.defaultProps = {
    className: "",
    contentPadding: false,
    "data-testid": "settings-section",
    description: "",
    header: "",
    primaryAction: "",
    primaryActionDisabled: false,
    showActionBar: true,
    topActionBar: null
};
