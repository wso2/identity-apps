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

import { HelpPanelMetadataInterface } from "../../../models";

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
     * Action type to set the metadata for the help panel.
     *
     * @type {string}
     */
    SET_HELP_PANEL_METADATA = "SET_HELP_PANEL_METADATA"
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
 * Set the metadata for the help panel action interface.
 */
export interface SetHelpPanelMetadataActionInterface extends HelpPanelBaseActionInterface {
    payload: HelpPanelMetadataInterface;
    type: HelpPanelActionTypes.SET_HELP_PANEL_METADATA;
}

/**
 * Export action interfaces.
 */
export type HelpPanelActions = SetHelpPanelDocsContentURLActionInterface
    | SetHelpPanelMetadataActionInterface;
