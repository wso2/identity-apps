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

/**
 * Interface for the user preferences items.
 */
export interface StorageUserPreferencesItemsInterface {
    /**
     * Array of user preferred user list columns.
     */
    userListColumns: [];
}

/**
 * Interface for the applications settings items.
 */
export interface StorageApplicationSettingsItemsInterface {
    /**
     * Array of recent application ids.
     */
    recentApplications: string[];
}

/**
 * Interface for the dev portal preferences.
 */
export interface StorageDevPortalPreferencesInterface {
    /**
     * Help panel preferences.
     */
    helpPanel: StorageHelpPanelPreferencesItemsInterface;
    [ key: string ]: any;
}

/**
 * Interface for the help panel preferences.
 */
export interface StorageHelpPanelPreferencesItemsInterface {
    /**
     * Is help panel pinned.
     */
    isPinned: boolean;
}

/**
 * Interface for the user preferences object.
 * TODO: Revisit the structure. Modify this interface to accept a generic portal settings type and
 *  assign it to a dynamic key. Ex: [ portal: string ]: T;
 */
export interface StorageIdentityUserPreferencesInterface {
    applicationPreferences: StorageApplicationSettingsItemsInterface;
    devPortal: StorageDevPortalPreferencesInterface;
    userPreferences: StorageUserPreferencesItemsInterface;
    [ key: string ]: any;
}

/**
 * Interface for identity apps settings.
 */
export interface StorageIdentityAppsSettingsInterface {
    identityAppsSettings: StorageIdentityUserPreferencesInterface;
}

/**
 * Empty storage application settings item object.
 *
 * @return {StorageApplicationSettingsItemsInterface}
 */
export const emptyStorageApplicationSettingsItem = (): StorageApplicationSettingsItemsInterface => ({
    recentApplications: []
});

/**
 * Empty identity apps settings object.
 *
 * @return {StorageIdentityAppsSettingsInterface}
 */
export const emptyIdentityAppsSettings = (): StorageIdentityAppsSettingsInterface => ({
    identityAppsSettings: {
        applicationPreferences: {
            recentApplications: []
        },
        devPortal: {
            helpPanel: {
                isPinned: false
            }
        },
        userPreferences: {
            userListColumns: []
        }
    }
});
