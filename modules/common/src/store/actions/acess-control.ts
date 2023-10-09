/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { 
    AccessControlActionType,
    SetDevelopVisibilityActionInterface,
    SetManageVisibilityActionInterface 
} from "./types/access-control";

/**
 * Redux action to set the access control developer tab visibility.
 *
 * @param {boolean} visibility - visibility state
 * @return {SetHelpPanelDocsContentURLActionInterface} An action of type `SET_DEVELOPER_VISIBILITY`
 */
export const setDeveloperVisibility = (visibility: boolean): SetDevelopVisibilityActionInterface => ({
    payload: visibility,
    type: AccessControlActionType.SET_DEVELOPER_VISIBILITY
});

/**
 * Redux action to set the access control manage tab visibility.
 *
 * @param {boolean} visibility - visibility state
 * @return {SetHelpPanelDocsContentURLActionInterface} An action of type `SET_MANAGE_VISIBILITY`
 */
export const setManageVisibility = (visibility: boolean): SetManageVisibilityActionInterface => ({
    payload: visibility,
    type: AccessControlActionType.SET_MANAGE_VISIBILITY
});
