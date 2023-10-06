/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Enum for Access Constol action types
 *
 * @readonly
 * @enum {string}
 */
export enum AccessControlActionType {
    /**
     * Action type to set the visibility of the developer tab.
     *
     * @type {string}
     */
    SET_DEVELOPER_VISIBILITY = "SET_DEVELOPER_VISIBILITY",
    /**
     * Action type to set the visibility of the manage tab.
     *
     * @type {string}
     */
    SET_MANAGE_VISIBILITY = "SET_MANAGE_VISIBILITY",
}

/**
 * Access control base action interface.
 */
interface AccessControlBaseActionInterface {
    type: AccessControlActionType;
}

export interface SetDevelopVisibilityActionInterface extends AccessControlBaseActionInterface {
    payload: boolean;
    type: AccessControlActionType.SET_DEVELOPER_VISIBILITY;
}

export interface SetManageVisibilityActionInterface extends AccessControlBaseActionInterface {
    payload: boolean;
    type: AccessControlActionType.SET_MANAGE_VISIBILITY;
}

/**
 * Export action interfaces.
 */
export type AccessControlActions = SetDevelopVisibilityActionInterface
    | SetManageVisibilityActionInterface;
