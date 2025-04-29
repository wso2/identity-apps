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

import { FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getApplicationDetails, getInboundProtocolConfig, useApplicationList } from "../api/application";
import TryItApplicationConstants from "../constants/try-it-constants";
import { ApplicationListItemInterface } from "../models/application";
import { ApplicationManagementUtils } from "../utils/application-management-utils";
import getTryItClientId from "../utils/get-try-it-client-id";

/**
 * Interface representing the return value of the useTryItApplication hook.
 */
export interface UseTryItApplication {
    /**
     * Indicates whether the Try It application is available.
     */
    isTryItApplicationAvailable: boolean;
    /**
     * Indicates whether the request to retrieve the Try It application is loading.
     */
    isTryItApplicationRetrieveRequestLoading: boolean;
    /**
     * Callback function to trigger the creation of the Try It application.
     */
    onTryItApplicationCreate: () => void;
    /**
     * Access ULR of the Try It application.
     */
    tryItApplicationAccessUrl: string;
    /**
     * The client ID of the Try It application.
     */
    tryItApplicationClientId: string;
    /**
     * The ID of the Try It application.
     */
    tryItApplicationId: string;
}

/**
 * Custom hook to manage the Try It application's state and operations
 * This hook handles checking for the existence of a Try It application,
 * retrieving its details, and managing its state.
 *
 * @returns Object containing Try It application state and operations.
 */
const useTryItApplication = (): UseTryItApplication => {
    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);
    const {
        data: tryItApplicationSearchResults,
        isLoading: isTryItApplicationSearchRequestLoading,
        error: tryItApplicationSearchRequestError,
        isValidating: isTryItApplicationSearchRequestValidating,
        mutate: mutateTryItApplicationSearchResults
    } = useApplicationList(
        null,
        null,
        null,
        `name eq ${TryItApplicationConstants.DISPLAY_NAME}`,
        saasFeatureStatus !== FeatureStatus.DISABLED
    );

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const accessUrl: string = useSelector((state: AppState) => {
        return state.config.deployment.extensions.asgardeoTryItURL as string;
    });

    const [ isTryItApplicationAvailable, setIsTryItApplicationAvailable ] = useState<boolean>(undefined);
    const [
        isTryItApplicationExistenceCheckRequestLoading,
        setIsTryItApplicationExistenceCheckRequestLoading
    ] = useState<boolean>(false);
    const [ tryItApplicationClientId, setTryItApplicationClientId ] = useState<string>(undefined);

    useEffect(() => {
        checkTryItApplicationExistence();
    }, [ tryItApplicationSearchResults ]);

    useEffect(() => {
        // Add debug logs here one a logger is added.
        // Tracked here https://github.com/wso2/product-is/issues/11650.
    }, [ tryItApplicationSearchRequestError ]);

    /**
     * Checking whether the playground application already exist or not
     */
    const checkTryItApplicationExistence = (): void => {
        setIsTryItApplicationExistenceCheckRequestLoading(true);

        if (!tryItApplicationSearchResults?.applications || isTryItApplicationSearchRequestValidating) {
            return;
        }

        if (tryItApplicationSearchResults.applications.length <= 0) {
            setIsTryItApplicationAvailable(false);
            setIsTryItApplicationExistenceCheckRequestLoading(false);

            return;
        }

        const applicationDetailPromises: Promise<any>[] = [];
        let protocolConfigs: any = {};

        tryItApplicationSearchResults.applications.forEach((application: ApplicationListItemInterface) => {
            applicationDetailPromises.push(getApplicationDetails(application.id));
        });

        axios
            .all(applicationDetailPromises)
            .then(
                axios.spread((...responses: any[]) => {
                    getInboundProtocolConfig(
                        responses[0].id,
                        ApplicationManagementUtils.mapProtocolTypeToName(responses[0].inboundProtocols[0].type)
                    )
                        .then((response: any) => {
                            protocolConfigs = {
                                ...protocolConfigs,
                                [responses[0].inboundProtocols[0].type]: response
                            };

                            setTryItApplicationClientId(protocolConfigs?.oauth2?.clientId);
                        })
                        .finally(() => {
                            if (protocolConfigs?.oauth2?.clientId === getTryItClientId(tenantDomain)) {
                                setIsTryItApplicationAvailable(true);
                            } else {
                                setIsTryItApplicationAvailable(false);
                            }
                        });
                })
            )
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            })
            .finally(() => {
                setIsTryItApplicationExistenceCheckRequestLoading(false);
            });
    };

    return {
        isTryItApplicationAvailable,
        isTryItApplicationRetrieveRequestLoading:
        isTryItApplicationSearchRequestLoading ||
        isTryItApplicationExistenceCheckRequestLoading ||
        isTryItApplicationSearchRequestValidating,
        onTryItApplicationCreate: (): void => {
            setIsTryItApplicationAvailable(true);
            mutateTryItApplicationSearchResults();
        },
        tryItApplicationAccessUrl: accessUrl,
        tryItApplicationClientId,
        tryItApplicationId: tryItApplicationSearchResults?.applications?.[0]?.id
    };
};

export default useTryItApplication;
