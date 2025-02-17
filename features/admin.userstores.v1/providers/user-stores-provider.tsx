/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { AlertLevels, FeatureAccessConfigInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useGetUserStoreDetails from "../api/use-get-user-store-details";
import { useGetUserStores } from "../api/use-get-user-stores";
import {
    ON_PREM_READ_ONLY_USER_STORE_TYPE_NAMES,
    UserStoreManagementConstants
} from "../constants/user-store-constants";
import UserStoresContext from "../context/user-stores-context";
import { UserStoreListItem, UserStoreProperty } from "../models/user-stores";

export type UserStoresProviderProps = PropsWithChildren;

const UserStoresProvider: FunctionComponent<UserStoresProviderProps> = (
    props: UserStoresProviderProps
): ReactElement => {
    const { children } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const requiredUserStoreAttributes: string[] = [
        UserStoreManagementConstants.USER_STORE_PROPERTY_READ_ONLY,
        UserStoreManagementConstants.USER_STORE_PROPERTY_BULK_IMPORT_SUPPORTED
    ];

    const userStoreFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userStores);

    const hasUserStoresReadPermission: boolean = useRequiredScopes(userStoreFeatureConfig?.scopes?.read);

    const {
        data: fetchedUserStores,
        isLoading: isUserStoreGetRequestLoading,
        error: userStoreGetRequestError
    } = useGetUserStores(null, null, null, null, requiredUserStoreAttributes.join(","), hasUserStoresReadPermission);

    const shouldFetchPrimaryUserStore: boolean = useMemo(
        () => {
            if (!hasUserStoresReadPermission) {
                return false;
            }

            return !(fetchedUserStores?.some(
                (userStore: UserStoreListItem) => userStore.id === userstoresConfig.primaryUserstoreId
            ) ?? true);
        },
        [ fetchedUserStores ]
    );

    const {
        data: primaryUserStoreDetails,
        isLoading: isPrimaryUserStoreDetailsRequestLoading,
        error: primaryUserStoreDetailsRequestError
    } = useGetUserStoreDetails(userstoresConfig.primaryUserstoreId, shouldFetchPrimaryUserStore);

    const readOnlyUserStoreNames: string[] = useMemo(
        () => {
            if (isUserStoreGetRequestLoading || isPrimaryUserStoreDetailsRequestLoading) {
                return [];
            }

            if (userStoreGetRequestError || primaryUserStoreDetailsRequestError) {
                return [];
            }

            const combinedUserStores: UserStoreListItem[] = [ ...fetchedUserStores ];

            if (shouldFetchPrimaryUserStore && primaryUserStoreDetails) {
                combinedUserStores.push(primaryUserStoreDetails as unknown as UserStoreListItem);
            }

            const filteredUserStores: UserStoreListItem[] = combinedUserStores?.filter(
                (userStore: UserStoreListItem) =>
                    ON_PREM_READ_ONLY_USER_STORE_TYPE_NAMES.includes(userStore.typeName) ||
                    userStore?.properties?.some((property: UserStoreProperty) => {
                        return (
                            property.name === UserStoreManagementConstants.USER_STORE_PROPERTY_READ_ONLY &&
                            property.value === "true"
                        );
                    })
            );

            return filteredUserStores?.map((userStore: UserStoreListItem) => {
                return userStore.name.toUpperCase();
            });
        },
        [ fetchedUserStores, isPrimaryUserStoreDetailsRequestLoading ]
    );

    /**
     * Shows the error notification if the user store get request fails.
     */
    useEffect(() => {
        if (userStoreGetRequestError) {
            dispatch(
                addAlert({
                    description: t("userstores:notifications.fetchUserstores.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("userstores:notifications.fetchUserstores.genericError.message")
                })
            );
        }
    }, [ userStoreGetRequestError ]);

    /**
     * Utility function to check if the user store is read only.
     *
     * @param userStoreName - Name of the user store to be evaluated.
     * @returns whether the user store is read only or not.
     */
    const isUserStoreReadOnly = (userStoreName: string): boolean => {
        return readOnlyUserStoreNames.includes(userStoreName.toUpperCase());
    };

    return (
        <UserStoresContext.Provider
            value={ {
                isLoading: isUserStoreGetRequestLoading || !readOnlyUserStoreNames,
                isUserStoreReadOnly,
                readOnlyUserStoreNamesList: readOnlyUserStoreNames,
                userStoresList: fetchedUserStores
            } }
        >
            { children }
        </UserStoresContext.Provider>
    );
};

export default UserStoresProvider;
