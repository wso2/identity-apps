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

import { useEffect, useState } from "react";
import { GenericAuthenticatorInterface } from "../../admin.identity-providers.v1/models";
import {
    IdentityProviderManagementUtils
} from "../../admin.identity-providers.v1/utils/identity-provider-management-utils";
import AuthenticatorsRecord from "../models/authenticators-record";
import { ApplicationManagementConstants } from "../../admin.applications.v1/constants";
import useUIConfig from "../../admin.core.v1/hooks/use-ui-configs";
import { IdentityProviderManagementConstants } from "../../admin.identity-providers.v1/constants";

const useAvailableAuthenticators = (): {
    filteredAuthenticators: {
        enterprise: AuthenticatorsRecord[];
        local: AuthenticatorsRecord[];
        recovery: AuthenticatorsRecord[];
        secondFactor: AuthenticatorsRecord[];
        social: AuthenticatorsRecord[];
    },
    loading: boolean
} => {
    const { UIConfig } = useUIConfig();

    const [ loading, setLoading ] = useState<boolean>(true);
    const [ filteredAuthenticators, setFilteredAuthenticators ] = useState<{
        enterprise: AuthenticatorsRecord[];
        local: AuthenticatorsRecord[];
        recovery: AuthenticatorsRecord[];
        secondFactor: AuthenticatorsRecord[];
        social: AuthenticatorsRecord[];
    }>({
        enterprise: [],
        local: [],
        recovery: [],
        secondFactor: [],
        social: []
    });

    const hiddenAuthenticators: string[] = [ ...(UIConfig?.hiddenAuthenticators ?? []) ];

    useEffect(() => {
        getAvailableAuthenticators();
    }, []);

    const getAvailableAuthenticators = async () => {
        setLoading(true);
        IdentityProviderManagementUtils.getAllAuthenticators()
            .then((response: GenericAuthenticatorInterface[][]) => {
                /**
                 * Extract the local and federated authenticators from the response.
                 */
                const localAuthenticators: GenericAuthenticatorInterface[] = response[0];
                const federatedAuthenticators: GenericAuthenticatorInterface[] = response[1];

                const socialAuthenticators: AuthenticatorsRecord[] = [];
                const enterpriseAuthenticators: AuthenticatorsRecord[] = [];
                const secondFactorAuthenticators: AuthenticatorsRecord[] = [];
                const recoveryAuthenticators: AuthenticatorsRecord[] = [];

                const moderatedLocalAuthenticators: AuthenticatorsRecord[] = [];

                localAuthenticators.forEach((authenticator: GenericAuthenticatorInterface) => {
                    if (hiddenAuthenticators.includes(authenticator.name)) {
                        return;
                    }

                    if (authenticator.name === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
                        recoveryAuthenticators.push({
                            name: authenticator.name,
                            description: authenticator.description,
                            idp: authenticator.idp
                        });
                    } else if (ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS.includes(authenticator.id)) {
                        secondFactorAuthenticators.push({
                            name: authenticator.name,
                            description: authenticator.description,
                            idp: authenticator.idp
                        });
                    } else {
                        moderatedLocalAuthenticators.push({
                            name: authenticator.name,
                            description: authenticator.description,
                            idp: authenticator.idp
                        });
                    }
                });

                federatedAuthenticators.forEach((authenticator: GenericAuthenticatorInterface) => {
                    if (hiddenAuthenticators.includes(authenticator.name)) {
                        return;
                    }

                    if (
                        ApplicationManagementConstants.SOCIAL_AUTHENTICATORS.includes(
                            authenticator.defaultAuthenticator.authenticatorId
                        )
                    ) {
                        socialAuthenticators.push({
                            name: authenticator.name,
                            description: authenticator.description,
                            idp: authenticator.idp
                        });
                    } else {
                        enterpriseAuthenticators.push({
                            name: authenticator.name,
                            description: authenticator.description,
                            idp: authenticator.idp
                        });
                    }
                });

                setFilteredAuthenticators({
                    enterprise: enterpriseAuthenticators,
                    local: moderatedLocalAuthenticators,
                    recovery: recoveryAuthenticators,
                    secondFactor: secondFactorAuthenticators,
                    social: socialAuthenticators
                });
            }).finally(() => {
                setLoading(false);
            });
    };

    return { filteredAuthenticators, loading };
};

export default useAvailableAuthenticators;
