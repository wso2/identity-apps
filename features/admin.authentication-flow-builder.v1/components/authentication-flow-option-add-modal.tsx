/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import {
    AddAuthenticatorModal,
    AddAuthenticatorModalPropsInterface
} from "@wso2is/admin.applications.v1/components/settings/sign-on-methods/step-based-flow/add-authenticator-modal";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models";
import { AppState } from "@wso2is/admin.core.v1/store";
import { GenericAuthenticatorInterface } from "@wso2is/admin.identity-providers.v1/models/identity-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModalPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useAuthenticationFlow from "../hooks/use-authentication-flow";

/**
 * Proptypes for the Authentication flow option add modal component.
 */
export type AuthenticationFlowOptionAddModalPropsInterface = Partial<ConfirmationModalPropsInterface> &
    Partial<AddAuthenticatorModalPropsInterface> &
    IdentifiableComponentInterface;

/**
 * Authentication flow option add modal.
 *
 * @param props - Props injected to the component.
 * @returns Authentication flow option add modal.
 */
const AuthenticationFlowOptionAddModal: FunctionComponent<AuthenticationFlowOptionAddModalPropsInterface> = (
    props: AuthenticationFlowOptionAddModalPropsInterface
): ReactElement => {
    const { open, onClose, ["data-componentid"]: componentId, currentStep, onIDPCreateWizardTrigger, ...rest } = props;

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);

    const { authenticators, authenticationSequence, addSignInOption } = useAuthenticationFlow();
    const hasIdentityProviderCreatePermissions: boolean = useRequiredScopes(
        featureConfig?.identityProviders?.scopes?.create
    );
    const { t } = useTranslation();

    return (
        <AddAuthenticatorModal
            authenticationSteps={ authenticationSequence?.steps }
            allowSocialLoginAddition={ hasIdentityProviderCreatePermissions }
            currentStep={ currentStep }
            open={ open }
            onModalSubmit={ (authenticators: GenericAuthenticatorInterface[]) => {
                authenticators.map((authenticator: GenericAuthenticatorInterface) => {
                    addSignInOption(currentStep, authenticator.id);
                });

                onClose(null, null);
            } }
            onClose={ onClose }
            header={ t(
                "applications:edit.sections.signOnMethod.sections.authenticationFlow." +
                    "sections.stepBased.addAuthenticatorModal.heading"
            ) }
            authenticators={ authenticators }
            showStepSelector={ false }
            stepCount={ authenticationSequence?.steps?.length }
            onIDPCreateWizardTrigger={ onIDPCreateWizardTrigger }
            data-componentid={ componentId }
            { ...rest }
        />
    );
};

/**
 * Default props for the component.
 */
AuthenticationFlowOptionAddModal.defaultProps = {
    "data-componentid": "authentication-flow-option-add-modal"
};

export default AuthenticationFlowOptionAddModal;
