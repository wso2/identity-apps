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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getIdentityProviderDetail, getIdentityProviderList, updateAuthenticationSequence } from "../../api";
import {
    AuthenticationSequenceType,
    IdentityProviderListItemInterface,
    IdentityProviderListResponseInterface,
    IdentityProviderResponseInterface
} from "../../models";
import { AuthenticatorListInterface, selectedFederatedAuthenticators, selectedLocalAuthenticators } from "./meta";

/**
 *  Captures IDPs name, logo and ID
 */
interface IDPNameInterface {
    authenticatorId: string;
    idp: string;
    image?: string;
}

interface SignOnMethodPropsInterface {
    appId?: string;
}

/**
 * Edit the authentication sequence of the application.
 *
 * @param props SignOnMethodPropsInterface
 *
 */
export const SignOnMethod: FunctionComponent<SignOnMethodPropsInterface> = (
    props: SignOnMethodPropsInterface
): JSX.Element => {

    const {
        appId
    } = props;

    const dispatch = useDispatch();

    const [federatedAuthenticatorList, setFederatedAuthenticatorList] = useState<AuthenticatorListInterface[]>([]);
    const [localAuthenticatorList, setLocalAuthenticatorList] = useState<AuthenticatorListInterface[]>([]);

    /**
     *  Updates the federatedIDPNameList with available IDPs.
     */
    const updateFederateIDPNameList = (): Promise<any> => {
        return getIdentityProviderList()
            .then((response: IdentityProviderListResponseInterface) => {
                return Promise.all(response.identityProviders.map((item: IdentityProviderListItemInterface) => {
                    if (item.isEnabled) {
                        return updateFederatedIDPNameListItem(item.id);
                    }
                }));
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred while populating authenticators",
                    level: AlertLevels.ERROR,
                    message: "Get Error"
                }));
            });
    };

    /**
     * Add Federated IDP name and ID in to the state.
     * @param id Identity Provider ID
     */
    const updateFederatedIDPNameListItem = (id: string): Promise<any> => {
        return getIdentityProviderDetail(id)
            .then((response: IdentityProviderResponseInterface) => {
                const iDPNamePair: IDPNameInterface = {
                    authenticatorId: response.federatedAuthenticators.defaultAuthenticatorId,
                    idp: response.name,
                    image: response.image
                };
                if (typeof iDPNamePair.image === "undefined") {
                    delete iDPNamePair.image;
                }
                return Promise.resolve(iDPNamePair);
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred while populating authenticators",
                    level: AlertLevels.ERROR,
                    message: "Get Error"
                }));
            });
    };

    /**
     *  Merge the IDP name list and meta details to populate the final federated List.
     */
    const loadFederatedAuthenticators = () => {
        updateFederateIDPNameList().then((response) => {
            const selectedFederatedList = [...selectedFederatedAuthenticators];
            const newIDPNameList: IDPNameInterface[] = [...response];

            const finalList = _(selectedFederatedList)
                .concat(newIDPNameList)
                .groupBy("authenticatorId")
                .map(_.spread(_.merge))
                .value();

            // Updates the federated authenticator List.
            setFederatedAuthenticatorList(finalList);
        });
    };

    /**
     * Load local authenticator list.
     *
     */
    const loadLocalAuthenticators = () => {
        setLocalAuthenticatorList([...selectedLocalAuthenticators]);
    };

    /**
     * Update Authentication Sequence.
     *
     * @param values Authentication Sequence
     */
    const updateAuthentication = (values: any) => {
        updateAuthenticationSequence(appId, values)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred while updating the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            });
    };

    // Submit Authentication Sequence.
    const handleSubmit = () => {
        const submit = {
            authenticationSequence: {
                attributeStepId: 1,
                requestPathAuthenticators: [],
                steps: [
                    {
                        id: 1,
                        options: [
                            {
                                authenticator: "BasicAuthenticator",
                                idp: "LOCAL"
                            }

                        ]
                    }
                ],
                subjectStepId: 1,
                type: AuthenticationSequenceType.USER_DEFINED
            }
        };
        updateAuthentication(submit);
    };

    useEffect(() => {
        loadFederatedAuthenticators();
        loadLocalAuthenticators();
    }, []);

    return (
        <>
        </>
    );
};
