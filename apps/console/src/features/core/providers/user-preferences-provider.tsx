/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import get from "lodash-es/get";
import merge from "lodash-es/merge";
import React, { PropsWithChildren, ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import UserPreferencesContext from "../context/user-preferences-context";
import { AppState } from "../store";

/**
 * Props interface of {@link UserPreferenceProvider}
 */
export interface UserPreferenceProviderProps<T> {
    /**
     * Initial preferences.
     */
    initialPreferences?: T;
}

/**
 * Provider for the Application local settings.
 * This is a generic provider which can be used to store any type of settings.
 * The type of the preferences should be passed as a generic type.
 *
 * @example
 * `<UserPreferenceProvider<Preference> initialPreferences={ { "orgId": { "key": "value" } } }>`
 *
 * @param props - Props for the client.
 * @returns App settings provider.
 */
const UserPreferenceProvider = <T, >(props: PropsWithChildren<UserPreferenceProviderProps<T>>): ReactElement => {
    const { children } = props;

    const organizationId: string = useSelector((state: AppState) => {
        return state?.organization?.organization?.id;
    });

    const [ preferencesInContext, setPreferencesInContext ] = useState<T>(null);

    /**
     * Set the preferences in storage.
     *
     * @example
     * `setPreferences({ "key": "value" }, "orgId")`
     *
     * @param preferencesToUpdate - The new preferences to update.
     * @param orgId - Optional organization ID. If provided, the preferences for this organization will be updated.
     */
    const setPreferences = (preferencesToUpdate: T, orgId?: string) => {
        const _orgId: string = orgId ?? organizationId;

        const updatedPreferences: T = merge({}, preferencesInContext, {
            [_orgId]: {
                ...preferencesToUpdate
            }
        });

        setPreferencesInContext(updatedPreferences);
    };

    /**
     * Get the preferences from storage.
     *
     * @example
     * `getPreferences("key.nested", "orgId")`
     *
     * @param key - The key of the preference to retrieve.
     * @param orgId - Optional organization ID. If provided, the preference for this organization will be retrieved.
     */
    const getPreferences = (key: string, orgId?: string): unknown => {
        const _orgId: string = orgId ?? organizationId;

        return get(preferencesInContext, `${_orgId}.${key}`, null);
    };

    return (
        <UserPreferencesContext.Provider
            value={ {
                getPreferences,
                preferences: preferencesInContext,
                setPreferences
            } }
        >
            { children }
        </UserPreferencesContext.Provider>
    );
};

export default UserPreferenceProvider;
