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

import * as React from "react";
import { NavLink } from "react-router-dom";
import {
    Container,
    Grid,
    Menu,
    Responsive,
    Sidebar
} from "semantic-ui-react";
import { routes, SidePanelIcons } from "../configs";
import { ThemeIcon } from "./icon";

/**
 * Field variable to save the header height given by the prop.
 * @type {number}
 */
let HEADER_HEIGHT: number = 0;

/**
 * Constant to handle desktop layout content top padding.
 * @type {number}
 */
const DESKTOP_CONTENT_TOP_PADDING: number = 50;

/**
 * Constant to handle mobile layout content padding.
 * @type {string}
 */
const MOBILE_CONTENT_PADDING: string = "2rem 1rem";

/**
 * Default side panel component Prop types.
 */
interface DefaultSidePanelProps {
    onSidePanelItemClick: () => void;
}

/**
 * Default side panel component.
 *
 * @return {JSX.Element}
 */
const DefaultSidePanel: React.FunctionComponent<DefaultSidePanelProps> = (
    props: DefaultSidePanelProps
): JSX.Element => {
    const { onSidePanelItemClick } = props;
    return (
        <SidePanelItems type="desktop" onSidePanelItemClick={ onSidePanelItemClick }/>
    );
};

/**
 * Mobile side panel component Prop types.
 */
interface MobileSidePanelProps extends DefaultSidePanelProps {
    children?: React.ReactNode;
    onPusherClick: () => void;
    visible: boolean;
}

/**
 * Mobile side panel component.
 *
 * @param {MobileSidePanelProps} props - Props injected to the mobile side panel component.
 * @return {JSX.Element}
 */
const MobileSidePanel: React.FunctionComponent<MobileSidePanelProps> = (props: MobileSidePanelProps): JSX.Element => {
    const { children, onPusherClick, visible, onSidePanelItemClick } = props;
    return (
        <Sidebar.Pushable>
            <Sidebar
                animation="push"
                visible={ visible }
            >
                <SidePanelItems type="mobile" onSidePanelItemClick={ onSidePanelItemClick }/>
            </Sidebar>
            <Sidebar.Pusher
                onClick={ onPusherClick }
                className="side-panel-pusher"
            >
                { children }
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
};

/**
 * Side panel items component Prop types.
 */
interface SidePanelItemsProps {
    onSidePanelItemClick: () => void;
    type: "desktop" | "mobile";
}

/**
 * Side panel items component.
 *
 * @param {SidePanelItemsProps} props - Props injected to the side panel items component.
 * @return {JSX.Element}
 */
const SidePanelItems: React.FunctionComponent<SidePanelItemsProps> = (props: SidePanelItemsProps): JSX.Element => {
    const { type, onSidePanelItemClick } = props;
    const activeRoute = (path: string) => {
        const pathname = window.location.pathname;
        const urlTokens = path.split("/");
        return pathname.indexOf(urlTokens[1]) > -1 ? "active" : "";
    };

    const style = type === "desktop"
        ? {
            position: "sticky",
            top: `${ HEADER_HEIGHT + DESKTOP_CONTENT_TOP_PADDING }px`
        }
        : null;

    return (
        <Menu className={ `side-panel ${ type }` } style={ style } vertical fluid>
            {
                routes.map((route, index) => (
                    route.showOnSidePanel ?
                        <Menu.Item
                            as={ NavLink }
                            to={ route.path }
                            name={ route.name }
                            className={ `side-panel-item ${ activeRoute(route.path) }` }
                            active={ activeRoute(route.path) === "active" }
                            onClick={ onSidePanelItemClick }
                            key={ index }
                        >
                            <ThemeIcon
                                icon={ SidePanelIcons[route.icon] }
                                size="micro"
                                floated="left"
                                spaced="right"
                                transparent
                            />
                            <span className="route-name">{ route.name }</span>
                        </Menu.Item>
                        : null
                ))
            }
        </Menu>
    );
};

/**
 * Side panel wrapper component Prop types.
 */
interface SidePanelWrapperProps {
    headerHeight: number;
    children?: React.ReactNode;
    onSidePanelItemClick: () => void;
    onSidePanelPusherClick: () => void;
    mobileSidePanelVisibility: boolean;
}

/**
 * Side panel wrapper component.
 *
 * @param {SidePanelWrapperProps} props - Props injected to the side panel wrapper component.
 * @return {JSX.Element}
 */
export const SidePanelWrapper: React.FunctionComponent<SidePanelWrapperProps> = (
    props: SidePanelWrapperProps
): JSX.Element => {
    const { headerHeight, mobileSidePanelVisibility, children, onSidePanelPusherClick, onSidePanelItemClick } = props;

    HEADER_HEIGHT = headerHeight;

    const mobileContentStyle = {
        padding: `${ MOBILE_CONTENT_PADDING }`
    };

    const desktopContentStyle = {
        paddingTop: `${ DESKTOP_CONTENT_TOP_PADDING }px`
    };

    return (
        <>
            <Responsive { ...Responsive.onlyMobile }>
                <MobileSidePanel
                    onPusherClick={ onSidePanelPusherClick }
                    visible={ mobileSidePanelVisibility }
                    onSidePanelItemClick={ onSidePanelItemClick }
                >
                    <Container style={ mobileContentStyle }>{ children }</Container>
                </MobileSidePanel>
            </Responsive>
            <Responsive as={ Container } minWidth={ Responsive.onlyTablet.minWidth }>
                <Grid style={ desktopContentStyle }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column tablet={ 6 } computer={ 4 }>
                            <DefaultSidePanel onSidePanelItemClick={ onSidePanelItemClick }/>
                        </Grid.Column>
                        <Grid.Column tablet={ 10 } computer={ 12 }>
                            { children }
                        </Grid.Column>.
                    </Grid.Row>
                </Grid>
            </Responsive>
        </>
    );
};
