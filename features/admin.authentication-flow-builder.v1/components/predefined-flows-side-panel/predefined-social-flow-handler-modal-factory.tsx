/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModalPropsInterface } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, useEffect, useState } from "react";
import DuplicateSocialAuthenticatorSelectionModal from "./duplicate-social-authenticator-selection-modal";
import MissingSocialAuthenticatorSelectionModal from "./missing-social-authenticator-selection-modal";
import {
    AuthenticationSequenceInterface,
    AuthenticatorInterface
} from "@wso2is/admin.applications.v1/models/application";
import {
    IdentityProviderManagementConstants
} from "@wso2is/admin.identity-providers.v1/constants/identity-provider-management-constants";
import { GenericAuthenticatorInterface } from "@wso2is/admin.identity-providers.v1/models";
import useAuthenticationFlow from "../../hooks/use-authentication-flow";

/**
 * Proptypes for the predefined social flow handler modal factory component.
 */
export interface PredefinedSocialFlowHandlerModalFactoryPropsInterface
    extends Partial<ConfirmationModalPropsInterface>,
        IdentifiableComponentInterface {
    /**
     * Authenticator category.
     */
    selectedSequence: {
        id: string;
        sequence: AuthenticationSequenceInterface;
    };
    /**
     * Callback to be fired on authenticator change.
     */
    onSelect: (sequence: AuthenticationSequenceInterface) => void;
}

/**
 * Factory to handle predefined social flow handler modals.
 *
 * @param props - Props injected to the component.
 * @returns Predefined social flow handler modal factory.
 */
const PredefinedSocialFlowHandlerModalFactory: FunctionComponent<
    PredefinedSocialFlowHandlerModalFactoryPropsInterface
> = (
    props: PredefinedSocialFlowHandlerModalFactoryPropsInterface
) => {
    const { selectedSequence, onSelect } = props;

    const { authenticators } = useAuthenticationFlow();

    const [ filteredAuthenticators, setSelectedAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ authenticatorCategoryDisplayName, setAuthenticatorCategoryDisplayName ] = useState<string>(undefined);
    const [ authenticatorCategoryTemplate, setAuthenticatorCategoryTemplate ] = useState<string>(undefined);
    const [
        showDuplicateSocialAuthenticatorSelectionModal,
        setShowDuplicateSocialAuthenticatorSelectionModal
    ] = useState<boolean>(false);
    const [ showMissingSocialAuthenticatorModal, setShowMissingSocialAuthenticatorModal ] = useState<boolean>(false);

    /**
     * When the authenticators are fetched, filter the social authenticators.
     */
    useEffect(() => {
        if (!selectedSequence) {
            return;
        }

        let authenticatorId: string = null;
        let authenticatorName: string = null;

        if (selectedSequence.id === "GoogleSocialLoginSequence") {
            authenticatorId = IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID;
            authenticatorName = IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_NAME;
            setAuthenticatorCategoryTemplate(IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE);
            setAuthenticatorCategoryDisplayName(
                IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_DISPLAY_NAME
            );
        } else if (selectedSequence.id === "GithubSocialLoginSequence") {
            authenticatorId = IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID;
            authenticatorName = IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_NAME;
            setAuthenticatorCategoryTemplate(IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GITHUB);
            setAuthenticatorCategoryDisplayName(IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_DISPLAY_NAME);
        } else if (selectedSequence.id === "FacebookSocialLoginSequence") {
            authenticatorId = IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID;
            authenticatorName = IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_NAME;
            setAuthenticatorCategoryTemplate(IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.FACEBOOK);
            setAuthenticatorCategoryDisplayName(
                IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_DISPLAY_NAME
            );
        } else if (selectedSequence.id === "AppleSocialLoginSequence") {
            authenticatorId = IdentityProviderManagementConstants.APPLE_AUTHENTICATOR_ID;
            authenticatorName = IdentityProviderManagementConstants.APPLE_AUTHENTICATOR_NAME;
            setAuthenticatorCategoryTemplate(IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.APPLE);
            setAuthenticatorCategoryDisplayName(IdentityProviderManagementConstants.APPLE_AUTHENTICATOR_DISPLAY_NAME);
        }

        const filtered: GenericAuthenticatorInterface[] = authenticators?.social?.filter(
            (authenticator: GenericAuthenticatorInterface) => {
                return authenticator?.defaultAuthenticator?.authenticatorId === authenticatorId;
            }
        );

        setSelectedAuthenticators(filtered);

        // If there are no IDP's with the selected authenticator, show missing authenticator modal.
        if (isEmpty(filtered)) {
            setShowMissingSocialAuthenticatorModal(true);

            return;
        }

        // If there are more than 1 IDP's with the selected authenticator, show authenticator select modal.
        if (filtered.length > 1) {
            setShowDuplicateSocialAuthenticatorSelectionModal(true);

            return;
        }

        // If there are only 1 IDP's with the selected authenticator, fire the onSelect callback.
        if (filtered.length === 1) {
            onSelect(
                updateSelectedSequenceIdPPlaceholders(selectedSequence.sequence, authenticatorName, filtered[0].idp)
            );

            return;
        }
    }, [ authenticators, selectedSequence ]);

    /**
     * Updates the IdP placeholders of the selected sequence.
     *
     * @param sequence - Selected sequence.
     * @param authenticatorName - Selected authenticator name.
     * @param authenticatorIdP - Selected authenticator IdP.
     * @returns Updated sequence.
     */
    const updateSelectedSequenceIdPPlaceholders = (
        sequence: AuthenticationSequenceInterface,
        authenticatorName: string,
        authenticatorIdP: string
    ): AuthenticationSequenceInterface => {
        const updatedSequence: AuthenticationSequenceInterface = cloneDeep(sequence);

        updatedSequence.steps[0].options.map((option: AuthenticatorInterface) => {
            if (option.authenticator === authenticatorName) {
                option.idp = authenticatorIdP;
            }
        });

        return updatedSequence;
    };

    if (showDuplicateSocialAuthenticatorSelectionModal) {
        return (
            <DuplicateSocialAuthenticatorSelectionModal
                open={ showDuplicateSocialAuthenticatorSelectionModal }
                authenticators={ filteredAuthenticators }
                authenticatorCategoryDisplayName={ authenticatorCategoryDisplayName }
                onSelect={ (authenticator: GenericAuthenticatorInterface) => {
                    onSelect(
                        updateSelectedSequenceIdPPlaceholders(
                            selectedSequence.sequence,
                            authenticator.defaultAuthenticator.name,
                            authenticator.idp
                        )
                    );
                } }
                onClose={ () => setShowDuplicateSocialAuthenticatorSelectionModal(false) }
            />
        );
    }

    if (showMissingSocialAuthenticatorModal) {
        return (
            <MissingSocialAuthenticatorSelectionModal
                open={ showMissingSocialAuthenticatorModal }
                authenticatorCategoryTemplate={ authenticatorCategoryTemplate }
                authenticatorCategoryDisplayName={ authenticatorCategoryDisplayName }
                onClose={ () => {
                    setAuthenticatorCategoryTemplate(undefined);
                    setShowMissingSocialAuthenticatorModal(false);
                } }
            />
        );
    }

    return null;
};

/**
 * Default props for the component.
 */
PredefinedSocialFlowHandlerModalFactory.defaultProps = {
    "data-componentid": "predefined-social-flow-handler-modal-factory"
};

export default PredefinedSocialFlowHandlerModalFactory;
