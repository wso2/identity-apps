/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent } from "react";
import { Dropdown, DropdownItemProps, DropdownProps, Item } from "semantic-ui-react";
import NineDotsIcon from "../../../assets/images/icons/nine-dots-icon.svg";
import { GenericIcon, GenericIconProps } from "../../icon";
import { Tooltip, TooltipPropsInterface } from "../../typography";

/**
 * App Switcher component props interface.
 */
export interface AppSwitcherPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface,
    DropdownProps {

    /**
     * Set of apps in the switcher
     */
    apps: AppSwitcherItemPropsInterface[];
    /**
     * Is app switcher enabled.
     */
    enabled?: boolean;
    /**
     * Tooltip.
     */
    tooltip?: ReactNode;
    /**
     * Tooltip extra props.
     */
    tooltipOptions?: TooltipPropsInterface;
    /**
     * Override the default Trigger icon.
     */
    triggerIcon?: ReactNode;
}

export interface AppSwitcherItemPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface,
    DropdownItemProps {

    /**
     * Short description about the app.
     */
    description: string;
    /**
     * Show/Hide app on switcher.
     */
    enabled: boolean;
    /**
     * App Icon.
     */
    icon: GenericIconProps[ "icon" ];
    /**
     * Name of the app.
     */
    name: string;
}

/**
 * App Switcher component to switch between apps.
 */
export const AppSwitcher: FunctionComponent<AppSwitcherPropsInterface> = (
    props: AppSwitcherPropsInterface
): ReactElement => {

    const {
        apps,
        enabled,
        className,
        tooltip,
        tooltipOptions,
        triggerIcon,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames("header-dropdown", "app-switch-dropdown", className);

    /**
     * Stops the dropdown from closing on click.
     *
     * @param { React.SyntheticEvent<HTMLElement> } e - Click event.
     */
    const handleDropdownClick = (e: SyntheticEvent<HTMLElement>): void => {
        e.stopPropagation();
    };

    return (
        <>
            {
                enabled && (
                    <Tooltip
                        compact
                        disabled={ tooltip === undefined }
                        trigger={ (
                            <Dropdown
                                icon={
                                    triggerIcon ?? (
                                        <GenericIcon
                                            inverted
                                            transparent
                                            hoverable
                                            hoverType="circular"
                                            icon={ NineDotsIcon }
                                            fill="white"
                                            size="auto"
                                        />
                                    )
                                }
                                className={ classes }
                                data-componentid={ componentId }
                                data-testid={ testId }
                                { ...rest }
                            >
                                {
                                    <Dropdown.Menu
                                        pointing
                                        className="header-dropdown-menu"
                                        onClick={ handleDropdownClick }
                                    >
                                        {
                                            (apps && Array.isArray(apps) && apps.length > 0) && (
                                                apps.map((app: AppSwitcherItemPropsInterface, index: number) => {

                                                    const {
                                                        enabled,
                                                        icon,
                                                        name,
                                                        description,
                                                        ...appRest
                                                    } = app;
                                                    
                                                    if (!enabled) {
                                                        return null;
                                                    }

                                                    return (
                                                        <>
                                                            <Dropdown.Item
                                                                key={ index }
                                                                className="header-dropdown-item"
                                                                { ...appRest }
                                                            >
                                                                <Item className="header-dropdown-item-inner flex">
                                                                    <GenericIcon
                                                                        data-componentid={
                                                                            `${ appRest[ "data-componentid" ] }-icon`
                                                                        }
                                                                        data-testid={
                                                                            `${ appRest[ "data-testid" ] }-icon`
                                                                        }
                                                                        inline
                                                                        transparent
                                                                        icon={ icon }
                                                                        size="x30"
                                                                        spaced="right"
                                                                    />
                                                                    <Item.Content verticalAlign="middle">
                                                                        <Item.Header
                                                                            data-componentid={
                                                                                `${
                                                                                    appRest[ "data-componentid" ]
                                                                                }-name`
                                                                            }
                                                                            data-testid={
                                                                                `${ appRest[ "data-testid" ] }-name`
                                                                            }
                                                                        >
                                                                            { name }
                                                                        </Item.Header>
                                                                        <Item.Meta
                                                                            data-componentid={
                                                                                `${
                                                                                    appRest[ "data-componentid" ]
                                                                                }-description`
                                                                            }
                                                                            data-testid={
                                                                                `${ 
                                                                                    appRest[ "data-testid" ]
                                                                                }-description`
                                                                            }
                                                                        >
                                                                            { description }
                                                                        </Item.Meta>
                                                                    </Item.Content>
                                                                </Item>
                                                            </Dropdown.Item>
                                                            {
                                                                (index !== (apps.length - 1)) && (
                                                                    <Dropdown.Divider />
                                                                )
                                                            }
                                                        </>
                                                    );
                                                })
                                            )
                                        }
                                    </Dropdown.Menu>
                                }
                            </Dropdown>
                        ) }
                        content={ tooltip }
                        size="mini"
                        { ...tooltipOptions }
                    />
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
AppSwitcher.defaultProps = {
    "data-componentid": "app-switcher",
    "data-testid": "app-switcher",
    enabled: true,
    floating: true,
    item: true,
    pointing: "top right",
    tooltip: "Apps"
};
