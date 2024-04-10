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
import AutheticatorsRecord from "../models/authenticators-record";

const useGetAvailableAuthenticators = ():AutheticatorsRecord[]=> {


    /**
     * State to hold the all available authenticators.
     */
    const [ availableAuthenticators, setAvailableAuthenticators ] = useState<AutheticatorsRecord[]>([]);
    /**
     * State to hold the updated authenticators.
     */
    const updatedAuthenticators:AutheticatorsRecord[] = [];

    /**
     * Get all enabled authenticators.
     */
    useEffect(() =>{IdentityProviderManagementUtils.getAllAuthenticators()
        .then((response: GenericAuthenticatorInterface[][]) => {
            /**
             * Extract the local and federated authenticators from the response.
             */
            const localAuthenticators: GenericAuthenticatorInterface[] = response[0];
            const federatedAuthenticators: GenericAuthenticatorInterface[] = response[1];

            /**
             * Extract required information from local and federated authenticators and set them to the state.
             * @param authenticator - default authenticator name.
             * @param idp - identity provider name.
             */


            localAuthenticators.forEach((authenticator: GenericAuthenticatorInterface) => {

                updatedAuthenticators.push({
                    authenticator: authenticator.defaultAuthenticator.name,
                    idp:authenticator.idp

                });

            });

            federatedAuthenticators.forEach((authenticator: GenericAuthenticatorInterface) => {

                updatedAuthenticators.push({
                    authenticator: authenticator.defaultAuthenticator.name,
                    idp:authenticator.idp

                });

            });

        }).finally(() => {
            setAvailableAuthenticators(updatedAuthenticators);
        });

    }, []);

    return availableAuthenticators;
};

export default useGetAvailableAuthenticators;
