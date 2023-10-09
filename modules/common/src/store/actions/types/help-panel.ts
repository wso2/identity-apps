/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { PortalDocumentationStructureInterface } from "../../../models/help-panel";

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
