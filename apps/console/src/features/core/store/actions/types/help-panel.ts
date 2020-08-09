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

import { PortalDocumentationStructureInterface } from "../../../models";

/**
 * Enum for help panel action types.
 *
 * @readonly
 * @enum {string}
 */
export enum HelpPanelActionTypes {
    /**
     * Action type to set the content URL for the help panel docs tab.
     *
     * @type {string}
     */
    SET_HELP_PANEL_DOCS_CONTENT_URL = "SET_HELP_PANEL_DOCS_CONTENT_URL",
    /**
     * Action type to set the documentation structure for the help panel.
     *
     * @type {string}
     */
    SET_HELP_PANEL_DOC_STRUCTURE = "SET_HELP_PANEL_DOC_STRUCTURE",
    /**
     * Action type to toggle the help panel visibility.
     *
     * @type {string}
     */
    TOGGLE_HELP_PANEL_VISIBILITY = "TOGGLE_HELP_PANEL_VISIBILITY",
    /**
     * Action type to set the help panel active tab index.
     *
     * @type {string}
     */
    SET_HELP_PANEL_ACTIVE_TAB_INDEX = "SET_HELP_PANEL_ACTIVE_TAB_INDEX"
}

/**
 * Help panel base action interface.
 */
interface HelpPanelBaseActionInterface {
    type: HelpPanelActionTypes;
}

/**
 * Set the content URL for the help panel docs tab action interface.
 */
export interface SetHelpPanelDocsContentURLActionInterface extends HelpPanelBaseActionInterface {
    payload: string;
    type: HelpPanelActionTypes.SET_HELP_PANEL_DOCS_CONTENT_URL;
}

/**
 * Set the doc structure for the help panel action interface.
 */
export interface SetHelpPanelDocStructureActionInterface extends HelpPanelBaseActionInterface {
    payload: PortalDocumentationStructureInterface;
    type: HelpPanelActionTypes.SET_HELP_PANEL_DOC_STRUCTURE;
}

/**
 * Action interface for the help panel visibility action.
 */
export interface ToggleHelpPanelVisibilityActionInterface extends HelpPanelBaseActionInterface {
    payload: boolean;
    type: HelpPanelActionTypes.TOGGLE_HELP_PANEL_VISIBILITY;
}

/**
 * Action interface for the help panel active tab index action.
 */
export interface SetHelpPanelActiveTabIndexActionInterface extends HelpPanelBaseActionInterface {
    payload: number;
    type: HelpPanelActionTypes.SET_HELP_PANEL_ACTIVE_TAB_INDEX;
}

/**
 * Export action interfaces.
 */
export type HelpPanelActions = SetHelpPanelDocsContentURLActionInterface
    | SetHelpPanelDocStructureActionInterface
    | ToggleHelpPanelVisibilityActionInterface
    | SetHelpPanelActiveTabIndexActionInterface;
