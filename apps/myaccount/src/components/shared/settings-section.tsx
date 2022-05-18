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

import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, MessageWithIcon } from "@wso2is/react-components";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, MouseEvent, PropsWithChildren, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Dimmer, Grid, Header, Icon, List, Menu, Responsive, SemanticICONS } from "semantic-ui-react";
import { ThemeIconSizes } from "./icon";

/**
 * Proptypes for the settings section component. See also
 * {@link SettingsSection.defaultProps}
 */
interface SettingsSectionProps extends TestableComponentInterface {
    className?: string;
    contentPadding?: boolean;
    description?: React.ReactNode;
    header: string;
    icon?: any;
    iconMini?: any;
    iconFloated?: "left" | "right";
    iconStyle?: "twoTone" | "default" | "colored";
    iconSize?: ThemeIconSizes;
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
    disabled?: boolean;
    renderDisabledItemsAsGrayscale?: boolean;
    overlayOpacity?: number;
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
        disabled,
        header,
        icon,
        iconMini,
        iconFloated,
        iconStyle,
        iconSize,
        onPrimaryActionClick,
        onSecondaryActionClick,
        overlayOpacity,
        placeholder,
        primaryAction,
        primaryActionDisabled,
        primaryActionIcon,
        renderDisabledItemsAsGrayscale,
        secondaryAction,
        secondaryActionDisabled,
        secondaryActionIcon,
        showActionBar,
        ["data-testid"]: testId,
        topActionBar
    } = props;

    const classes = classNames(
        {
            "with-top-action-bar": topActionBar !== undefined,
            disabled,
            grayscale : disabled && renderDisabledItemsAsGrayscale
        },
        className);

    const { t } = useTranslation();

    const [ dimmerState, setDimmerState ] = useState<boolean>(false);

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
        <Card
            className={ `settings-card ${ classes }` }
            fluid
            padded="very"
            onMouseEnter={ () => setDimmerState(true) }
            onMouseLeave={ () => setDimmerState(false) }
            data-testid={ `${testId}-card` }
        >
            {
                disabled && (
                    <Dimmer className="lighter" active={ dimmerState }>
                        { t("common:featureAvailable" ) }
                    </Dimmer>
                )
            }
            <Card.Content data-testid={ `${testId}-card-content` }>
                <Grid>
                    <Grid.Row className="header-section" columns={ 2 } data-testid={ `${testId}-card-content-header` }>
                        <Grid.Column width={ (icon || iconMini) ? 10 : 16 } className="no-padding">
                            <Header as="h2">{ header }</Header>
                            <Card.Meta>{ description }</Card.Meta>
                        </Grid.Column>
                        {
                            icon || iconMini ? (
                                    <Grid.Column width={ 6 } className="no-padding">
                                        <Responsive as={ Fragment } { ...Responsive.onlyComputer }>
                                            {
                                                icon ? (
                                                        <GenericIcon
                                                            transparent
                                                            icon={ icon }
                                                            as="data-url"
                                                            size={ iconSize }
                                                            floated={ iconFloated }
                                                            defaultIcon={ iconStyle === "default" }
                                                            twoTone={ iconStyle === "twoTone" }
                                                            colored={ iconStyle === "colored" }
                                                        />
                                                    )
                                                    : null
                                            }
                                        </Responsive>
                                        <Responsive as={ Fragment } maxWidth={ Responsive.onlyTablet.maxWidth }>
                                            {
                                                iconMini ? (
                                                        <GenericIcon
                                                            transparent
                                                            icon={ iconMini }
                                                            as="data-url"
                                                            size={ iconSize }
                                                            floated={ iconFloated }
                                                            defaultIcon={ iconStyle === "default" }
                                                            twoTone={ iconStyle === "twoTone" }
                                                            colored={ iconStyle === "colored" }
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
                                                    <MessageWithIcon type="info" content={ placeholder } />
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
    iconFloated: "right",
    iconStyle: "colored",
    primaryAction: "",
    primaryActionDisabled: false,
    showActionBar: true,
    topActionBar: null
};
