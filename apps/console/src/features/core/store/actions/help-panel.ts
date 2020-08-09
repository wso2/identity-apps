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

import {
    HelpPanelActionTypes,
    SetHelpPanelActiveTabIndexActionInterface,
    SetHelpPanelDocStructureActionInterface,
    SetHelpPanelDocsContentURLActionInterface,
    ToggleHelpPanelVisibilityActionInterface
} from "./types";
import { PortalDocumentationStructureInterface } from "../../models";

/**
 * Redux action to set the help panel docs tab content URL.
 *
 * @param {string} url - Content URL.
 * @return {SetHelpPanelDocsContentURLActionInterface} An action of type `SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META`
 */
export const setHelpPanelDocsContentURL = (url: string): SetHelpPanelDocsContentURLActionInterface => ({
    payload: url,
    type: HelpPanelActionTypes.SET_HELP_PANEL_DOCS_CONTENT_URL
});

/**
 * Redux action to set the help panel doc structure.
 *
 * @param {PortalDocumentationStructureInterface} structure - Doc structure.
 * @return {SetHelpPanelDocStructureActionInterface} An action of type `SET_HELP_PANEL_DOC_STRUCTURE`
 */
export const setHelpPanelDocStructure = (
    structure: PortalDocumentationStructureInterface
): SetHelpPanelDocStructureActionInterface => ({
    payload: structure,
    type: HelpPanelActionTypes.SET_HELP_PANEL_DOC_STRUCTURE
});

/**
 * Redux action to toggle help panel visibility.
 *
 * @param {boolean} isVisible - Should side panel be visible.
 * @return {ToggleHelpPanelVisibilityActionInterface} An action of type `TOGGLE_HELP_PANEL_VISIBILITY`
 */
export const toggleHelpPanelVisibility = (isVisible: boolean): ToggleHelpPanelVisibilityActionInterface => ({
    payload: isVisible,
    type: HelpPanelActionTypes.TOGGLE_HELP_PANEL_VISIBILITY
});

/**
 * Redux action to set the help panel active tab index.
 *
 * @param {number} tabIndex - The active tab index.
 * @return {SetHelpPanelActiveTabIndexActionInterface} An action of type `SET_HELP_PANEL_ACTIVE_TAB_INDEX`
 */
export const setHelpPanelActiveTabIndex = (tabIndex: number): SetHelpPanelActiveTabIndexActionInterface => ({
    payload: tabIndex,
    type: HelpPanelActionTypes.SET_HELP_PANEL_ACTIVE_TAB_INDEX
});
