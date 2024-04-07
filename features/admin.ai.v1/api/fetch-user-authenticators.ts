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
import { AuthenticatorInterface } from "features/admin.connections.v1";
import { useGetAuthenticators } from "../../admin.connections.v1/api/authenticators";
import { handleGetConnectionListCallError } from "../../admin.connections.v1/utils/connection-utils";
import AutheticatorsRecord from "../models/authenticators-record";

const useGetAvailableAuthenticators = ():AutheticatorsRecord[]=> {

    const { data: authenticatorsData, error:authenticatorsFetchRequestError } = useGetAuthenticators();

    // Handle the authenticator list fetch request error.
    if (authenticatorsFetchRequestError) {
        handleGetConnectionListCallError(authenticatorsFetchRequestError);
    }

    if (authenticatorsData){
        const availableAuthenticators:AutheticatorsRecord[] = (authenticatorsData.map(
            (authenticator:AuthenticatorInterface) =>{

                if(authenticator.isEnabled){

                    return {
                        authenticator: authenticator.name,
                        idp: authenticator.type
                    };
                }

            })
        );

        return availableAuthenticators ;

    }

    return;




};

export default useGetAvailableAuthenticators;
