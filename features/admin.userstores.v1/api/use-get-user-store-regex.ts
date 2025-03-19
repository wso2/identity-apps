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

import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import { useMemo } from "react";
import { useGetUserStore } from "./use-get-user-store";
import useUserStores from "../hooks/use-user-stores";
import { UserStoreListItem, UserStoreProperty } from "../models/user-stores";

export const useUserStoreRegEx = <Error = RequestErrorInterface>(
    userstoreName: string,
    regExName: string,
    shouldFetch: boolean = true
): Partial<RequestResultInterface<string, Error>> => {

    const {
        userStoresList,
        isLoading: isUserStoresListLoading
    } = useUserStores();

    const userStoreId: string = useMemo(() => {
        if (userstoreName === userstoresConfig.primaryUserstoreName) {
            return userstoresConfig.primaryUserstoreId;
        }

        if (!isUserStoresListLoading && userStoresList) {
            return userStoresList.find((userStore: UserStoreListItem) =>
                userStore.name.toLowerCase() === userstoreName.toLowerCase())?.id;
        }
    }, [ isUserStoresListLoading, userStoresList ]);

    const {
        data: fetchedUserStore,
        isLoading: isUserStoreFetchRequestLoading,
        error: userStoreFetchError
    } = useGetUserStore(
        userStoreId,
        shouldFetch && !isEmpty(userStoreId)
    );

    const userStoreRegExValue: string = useMemo(() => {
        if (!isUserStoreFetchRequestLoading && fetchedUserStore) {
            const userStoreRegEx: UserStoreProperty = fetchedUserStore.properties.find((property: UserStoreProperty) =>
                property?.name?.toLowerCase() === regExName?.toLowerCase());

            return userStoreRegEx?.value;
        }
    }, [ isUserStoreFetchRequestLoading, fetchedUserStore ]);

    return {
        data: userStoreRegExValue,
        error: userStoreFetchError as AxiosError<Error>,
        isLoading: isUserStoresListLoading || isUserStoreFetchRequestLoading
    };
};
