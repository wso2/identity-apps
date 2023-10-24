/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    HelpPanelActionTypes,
    SetHelpPanelActiveTabIndexActionInterface,
    SetHelpPanelDocStructureActionInterface,
    SetHelpPanelDocsContentURLActionInterface,
    ToggleHelpPanelVisibilityActionInterface
} from "./types/help-panel";
import { PortalDocumentationStructureInterface } from "../../models/help-panel";

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
