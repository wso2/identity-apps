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
import { ContentLoader, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getFederatedAuthenticatorDetails, getFederatedAuthenticatorMeta, updateFederatedAuthenticator } from "../../api";
import {
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorListResponseInterface,
    FederatedAuthenticatorMetaInterface,
    SupportedAuthenticators
} from "../../models";
import { AuthenticatorFormFactory } from "./forms";
import { Divider } from "semantic-ui-react";

/**
 * Proptypes for the identity providers settings component.
 */
interface IdentityProviderSettingsPropsInterface {
    /**
     * Currently editing idp id.
     */
    idpId: string;

    /**
     * federatedAuthenticators of the IDP
     */
    federatedAuthenticators: FederatedAuthenticatorListResponseInterface;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 *  Identity Provider and advance settings component.
 *
 * @param {IdentityProviderSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticatorSettings: FunctionComponent<IdentityProviderSettingsPropsInterface> = (
    props: IdentityProviderSettingsPropsInterface
): ReactElement => {

    const {
        idpId,
        federatedAuthenticators,
        isLoading,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const [ authenticatorMeta, setAuthenticatorMeta ] = useState<FederatedAuthenticatorMetaInterface>({
        name: SupportedAuthenticators.NONE,
        displayName: "",
        authenticatorId: "",
        properties: []
    });

    const [ authenticatorDetails, setAuthenticatorDetails ] = useState<FederatedAuthenticatorListItemInterface>({
        name: "",
        isDefault: false,
        isEnabled: false,
        authenticatorId: "",
        properties: []
    });

    /**
     * Handles the inbound config form submit action.
     *
     * @param values - Form values.
     */
    const handleInboundConfigFormSubmit = (values: any): void => {
        updateFederatedAuthenticator(idpId, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the federated authenticator.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(idpId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating the federated authenticator.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };

    useEffect(() => {
        if (federatedAuthenticators.defaultAuthenticatorId) {
            getFederatedAuthenticatorDetails(idpId, federatedAuthenticators.defaultAuthenticatorId)
                .then(response => {
                    setAuthenticatorDetails(response);
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: "An error occurred retrieving the federated authenticator details.",
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                });

            getFederatedAuthenticatorMeta(federatedAuthenticators.defaultAuthenticatorId)
                .then(response => {
                    setAuthenticatorMeta(response);
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: "An error occurred retrieving the federated authenticator metadata.",
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                });
        }
    }, [props]);

    return (
        (!isLoading)
            ? (
                <div className="inbound-protocols-section">
                    {
                        (
                            <>
                                <Heading as="h4">{authenticatorDetails?.name}</Heading>
                                {
                                    federatedAuthenticators.defaultAuthenticatorId ?
                                        <AuthenticatorFormFactory
                                            metadata={ authenticatorMeta }
                                            initialValues={ authenticatorDetails }
                                            onSubmit={ handleInboundConfigFormSubmit }
                                            type={ authenticatorMeta?.name }
                                        />
                                        : null
                                }
                                <Divider hidden/>
                            </>
                        )}
                </div>
            )
            : <ContentLoader/>
    );
};
