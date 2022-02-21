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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, MouseEvent, PropsWithChildren, ReactElement } from "react";
import { Card, Grid, Header, Icon, List, Menu, Message, Responsive, SemanticICONS } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Proptypes for the section component.
 */
export interface SectionProps extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Show content padding.
     */
    contentPadding?: boolean;
    /**
     * Section description.
     */
    description?: string;
    /**
     * Section header.
     */
    header: string;
    /**
     * Section icon.
     */
    icon?: any;
    /**
     * Mini version of the section icon.
     */
    iconMini?: any;
    /**
     * Icon floated direction.
     */
    iconFloated?: "left" | "right";
    /**
     * Icon style.
     */
    iconStyle?: "twoTone" | "default" | "colored";
    /**
     * Icon size.
     */
    iconSize?: GenericIconSizes;
    /**
     * Primary action onclick callback.
     * @param {React.MouseEvent<HTMLElement>} e - Click event.
     */
    onPrimaryActionClick?: (e: MouseEvent<HTMLElement>) => void;
    /**
     * Secondary action onclick callback.
     * @param {React.MouseEvent<HTMLElement>} e - Click event.
     */
    onSecondaryActionClick?: (e: MouseEvent<HTMLElement>) => void;
    /**
     * Placeholder text.
     */
    placeholder?: string;
    /**
     * Primary action node.
     */
    primaryAction?: any;
    /**
     * Enable/ Disable primary action.
     */
    primaryActionDisabled?: boolean;
    /**
     * Primary action icon.
     */
    primaryActionIcon?: SemanticICONS;
    /**
     * Secondary action node.
     */
    secondaryAction?: any;
    /**
     * Enable/ Disable secondary action.
     */
    secondaryActionDisabled?: boolean;
    /**
     * Secondary action icon.
     */
    secondaryActionIcon?: SemanticICONS;
    /**
     * Show/ Hide action bar.
     */
    showActionBar?: boolean;
    /**
     * Show/ Hide top action bar.
     */
    topActionBar?: React.ReactNode;
    /**
     * Accordion.
     */
    accordion?: any;
}

/**
 * Section component.
 *
 * @param {PropsWithChildren<SectionProps>} props - Props injected to the section component.
 *
 * @return {React.ReactElement}
 */
export const Section: FunctionComponent<PropsWithChildren<SectionProps>> = (
    props: PropsWithChildren<SectionProps>
): ReactElement => {

    const {
        children,
        className,
        contentPadding,
        description,
        header,
        icon,
        iconMini,
        iconFloated,
        iconStyle,
        iconSize,
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
        topActionBar,
        accordion,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
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
                    data-componentid={ `${ componentId }-${ actionType }-action` }
                    data-testid={ `${ testId }-${ actionType }-action` }
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
                    data-componentid={ `${ componentId }-${ actionType }-action` }
                    data-testid={ `${ testId }-${ actionType }-action` }
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
        <Card
            className={ `settings-card ${ classes }` }
            fluid
            padded="very"
            data-componentid={ componentId }
            data-testid={ testId }
        >
            <Card.Content>
                <Grid>
                    <Grid.Row className="header-section" columns={ 2 }>
                        <Grid.Column width={ (icon || iconMini) ? 10 : 16 } className="no-padding">
                            <Header
                                as="h2"
                                data-componentid={ `${ componentId }-header` }
                                data-testid={ `${ testId }-header` }
                            >
                                { header }
                            </Header>
                            <Card.Meta
                                data-componentid={ `${ componentId }-description` }
                                data-testid={ `${ testId }-description` }
                            >
                                { description }
                            </Card.Meta>
                        </Grid.Column>
                        {
                            icon || iconMini ? (
                                <Grid.Column width={ 6 } className="no-padding">
                                    <Responsive as={ Fragment } { ...Responsive.onlyComputer }>
                                        {
                                            icon
                                                ? (
                                                    <GenericIcon
                                                        icon={ icon }
                                                        transparent
                                                        size={ iconSize }
                                                        floated={ iconFloated }
                                                        defaultIcon={ iconStyle === "default" }
                                                        twoTone={ iconStyle === "twoTone" }
                                                        colored={ iconStyle === "colored" }
                                                        data-componentid={ `${ componentId }-icon` }
                                                        data-testid={ `${ testId }-icon` }
                                                    />
                                                )
                                                : null
                                        }
                                    </Responsive>
                                    <Responsive as={ Fragment } maxWidth={ Responsive.onlyTablet.maxWidth }>
                                        {
                                            iconMini
                                                ? (
                                                    <GenericIcon
                                                        icon={ iconMini }
                                                        transparent
                                                        size={ iconSize }
                                                        floated={ iconFloated }
                                                        defaultIcon={ iconStyle === "default" }
                                                        twoTone={ iconStyle === "twoTone" }
                                                        colored={ iconStyle === "colored" }
                                                        data-componentid={ `${ componentId }-icon-mini` }
                                                        data-testid={ `${ testId }-icon-mini` }
                                                    />
                                                )
                                                : null
                                        }
                                    </Responsive>
                                </Grid.Column>
                            )
                                : null
                        }
                    </Grid.Row>
                    <Grid.Row className={ `main-content ${ contentPadding ? "" : "no-padding" }` } columns={ 1 }>
                        <Grid.Column className="no-padding" width={ 16 }>
                            {
                                topActionBar
                                    ? (
                                        <Menu
                                            className="top-action-panel no-margin-bottom"
                                            data-componentid={ `${ componentId }-top-action-panel` }
                                            data-testid={ `${ testId }-top-action-panel` }
                                        >
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
                                    className="action-button"
                                    disabled={ !!placeholder }
                                    // if both `primaryAction` & `secondaryAction` are passed in,
                                    // disable list item `onClick`.
                                    onClick={ !(primaryAction && secondaryAction)
                                        ? onSecondaryActionClick || onPrimaryActionClick
                                        : null
                                    }
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
                                                </>
                                            )
                                    }
                                </List.Item>
                            </List>
                        </Card.Content>
                    )
                    : (
                        accordion
                    )
            }
        </Card>
    );
};

/**
 * Default proptypes for the section component.
 */
Section.defaultProps = {
    className: "",
    contentPadding: false,
    "data-componentid": "section",
    "data-testid": "section",
    description: "",
    header: "",
    iconFloated: "right",
    iconStyle: "colored",
    primaryAction: "",
    primaryActionDisabled: false,
    showActionBar: true,
    topActionBar: null
};
