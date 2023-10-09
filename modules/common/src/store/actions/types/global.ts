/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AppViewTypes } from "../../../models/ui";

/**
 * Enum for Global action types.
 */
export enum GlobalActionTypes {
    /**
     * Action type to set the current active view.
     *
     * @type {string}
     */
    SET_ACTIVE_VIEW = "SET_ACTIVE_VIEW"
}

/**
 * Global base action interface.
 */
interface GlobalBaseAction {
    type: GlobalActionTypes;
}

/**
 * Set the active view for the Console content.
 * ex: DEVELOPER, ADMIN etc.
 */
export interface SetActiveViewAction extends GlobalBaseAction {
    payload: AppViewTypes;
    type: GlobalActionTypes.SET_ACTIVE_VIEW;
}

/**
 * Export action interfaces.
 */
export type GlobalActions = SetActiveViewAction;
