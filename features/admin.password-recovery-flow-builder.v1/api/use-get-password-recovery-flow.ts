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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { useMemo } from "react";
import PasswordRecoveryFlowConstants from "../constants/password-recovery-flow-constants";
import endStepMigrator from "../migrations/migrators/end-step-migrator";
import { PasswordRecoveryFlow } from "../models/flow";

/**
 * Hook to get the configured password recovery flow with automatic migration support.
 *
 * This function calls the GET method of the following endpoint to get the password recovery flow of the organization.
 * - `https://{serverUrl}/t/{tenantDomain}/api/server/v1/password-recovery-flow`
 *
 * The hook automatically applies migrations to convert legacy flows:
 * - Migrates flows with string "End" references to proper configurable END nodes
 *
 * For more details, refer to the documentation:
 * {@link https://TODO:<fillthis>)}
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the migrated data, error, isLoading, isValidating, mutate.
 */
const useGetPasswordRecoveryFlow = <Data = any, Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        // eslint-disable-next-line max-len
        url: `${store.getState().config.endpoints.passwordRecoveryFlow}?flowType=${PasswordRecoveryFlowConstants.PASSWORD_RECOVERY_FLOW_TYPE}`
    };

    const { data: rawData, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null
    );

    // Apply migration if needed
    const migratedData: Data = useMemo(() => {
        if (!rawData) {
            return rawData;
        }

        try {
            const flow: PasswordRecoveryFlow = rawData as unknown as PasswordRecoveryFlow;
            const migratedFlow: PasswordRecoveryFlow = endStepMigrator(flow);

            return migratedFlow as unknown as Data;
        } catch (migrationError) {
            // Fallback to original data if migration fails.
            return rawData;
        }
    }, [ rawData ]);

    return {
        data: migratedData as Data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetPasswordRecoveryFlow;
