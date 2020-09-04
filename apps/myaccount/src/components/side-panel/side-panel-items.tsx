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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import _ from "lodash";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { fetchApplications } from "../../api";
import { SidePanelIcons } from "../../configs";
import { ApplicationConstants } from "../../constants";
import * as UIConstants from "../../constants/ui-constants";
import { FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";
import { toggleApplicationsPageVisibility } from "../../store/actions";
import { filteredRoutes } from "../../utils";
import { ThemeIcon } from "../shared";

/**
 * Side panel items component Prop types.
 */
interface SidePanelItemsProps {
    headerHeight: number;
    onSidePanelItemClick: () => void;
    type: "desktop" | "mobile";
}

/**
 * Side panel items component.
 *
 * @param {SidePanelItemsProps} props - Props injected to the side panel items component.
 * @return {JSX.Element}
 */
export const SidePanelItems: React.FunctionComponent<SidePanelItemsProps> = (
    props: SidePanelItemsProps
): JSX.Element => {
    const { headerHeight, type, onSidePanelItemClick } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isApplicationsPageVisible = useSelector((state: AppState) => state.global.isApplicationsPageVisible);
    const appConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const activeRoute = (path: string) => {
        const pathname = window.location.pathname;
        const urlTokens = path.split("/");
        return pathname.indexOf(urlTokens[ 1 ]) > -1 ? "active" : "";
    };

    const style = type === "desktop"
        ? {
            position: "sticky",
            top: `${ headerHeight + UIConstants.DESKTOP_CONTENT_TOP_PADDING }px`
        }
        : null;

    /**
     * Performs pre-requisites for the side panel items visibility.
     */
    useEffect(() => {
        // Fetches the list of applications to see if the list is empty.
        // If it is empty, hides the side panel item.
        if (isApplicationsPageVisible === undefined) {
            fetchApplications(null, null, null)
                .then((response) => {
                    if (_.isEmpty(response.applications)) {
                        dispatch(toggleApplicationsPageVisibility(false));
                        return;
                    }
                    dispatch(toggleApplicationsPageVisibility(true));
                })
                .catch(() => {
                    dispatch(toggleApplicationsPageVisibility(false));
                });
        }
    }, [dispatch, isApplicationsPageVisible ]);

    /**
     * Validates if the side panel item should be displayed.
     *
     * @param {string} path - specific route.
     * @return {boolean}
     */
    const validateSidePanelVisibility = (path: string): boolean => {
        if (path === ApplicationConstants.APPLICATIONS_PAGE_PATH) {
            return isApplicationsPageVisible;
        }
        return true;
    };

    return (
        <Menu className={ `side-panel ${ type }` } style={ style } vertical fluid>
            {
                appConfig && (
                    filteredRoutes(appConfig).map((route, index) => (
                        (route.showOnSidePanel
                            && hasRequiredScopes(appConfig[route.id], appConfig[route.id]?.scopes?.read, allowedScopes)
                            && validateSidePanelVisibility(route.path))
                            ? (
                                <Menu.Item
                                    as={ NavLink }
                                    to={ route.path }
                                    name={ route.name }
                                    className={
                                        `side-panel-item ${ activeRoute(route.path) } hover-background ellipsis`
                                    }
                                    active={ activeRoute(route.path) === "active" }
                                    onClick={ onSidePanelItemClick }
                                    key={ index }
                                >
                                    <ThemeIcon
                                        icon={ SidePanelIcons[ route.icon ] }
                                        size="micro"
                                        floated="left"
                                        spaced="right"
                                        transparent
                                    />
                                    <span className="route-name">{ t(route.name) }</span>
                                </Menu.Item>
                            )
                            : null
                    ))
                )
            }
        </Menu>
    );
};
