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
    SetHelpPanelDocsContentURLActionInterface,
    SetHelpPanelMetadataActionInterface
} from "./types";
import { HelpPanelMetadataInterface } from "../../models";

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
 * Redux action to set the help panel metadata.
 *
 * @param {HelpPanelMetadataInterface} meta - Metadata.
 * @return {SetHelpPanelMetadataActionInterface} An action of type `SET_HELP_PANEL_METADATA`
 */
export const setHelpPanelMetadata = (meta: HelpPanelMetadataInterface): SetHelpPanelMetadataActionInterface => ({
    payload: meta,
    type: HelpPanelActionTypes.SET_HELP_PANEL_METADATA
});
