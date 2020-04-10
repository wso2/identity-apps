/*
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

import { HelpPanel, HelpPanelPropsInterface } from "@wso2is/react-components";
import { Menu, Sidebar } from "semantic-ui-react";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useRef } from "react";
import classNames from "classnames";

/**
 * Sidebar pusher layout Prop types.
 */
interface SidebarPusherLayoutPropsInterface extends HelpPanelPropsInterface {
    sidebarDirection?: HelpPanelPropsInterface["direction"];
    sidebarVisibility?: HelpPanelPropsInterface["visible"];
}

/**
 * Sidebar pusher layout.
 *
 * @param {React.PropsWithChildren<PageLayoutPropsInterface>} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const HelpPanelLayout: FunctionComponent<PropsWithChildren<SidebarPusherLayoutPropsInterface>> = (
    props: PropsWithChildren<SidebarPusherLayoutPropsInterface>
): ReactElement => {

    const sidebarRef = useRef<HTMLDivElement>();
    const contentRef = useRef<HTMLDivElement>();

    const {
        children,
        sidebarDirection,
        sidebarVisibility,
        ...rest
    } = props;

    const layoutClasses = classNames("layout", "help-panel-layout");
    const layoutContentClasses = classNames("layout-content");

    useEffect(() => {
        if (!sidebarRef?.current?.clientWidth) {
            return;
        }

        contentRef.current.style.width = `calc(100% - ${ sidebarRef?.current?.clientWidth }px)`;
    }, [ sidebarVisibility ]);

    return (
        <Sidebar.Pushable className={ layoutClasses }>
            <HelpPanel
                as={ Menu }
                animation="overlay"
                direction={ sidebarDirection }
                icon="labeled"
                vertical
                visible={ sidebarVisibility }
                ref={ sidebarRef }
                { ...rest }
            />

            <Sidebar.Pusher className={ layoutContentClasses }>
                <div ref={ contentRef }>
                    { children }
                </div>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
};

/**
 * Default props for the sidebar pusher layout.
 */
HelpPanelLayout.defaultProps = {
    sidebarMiniEnabled: true,
    sidebarVisibility: false
};
