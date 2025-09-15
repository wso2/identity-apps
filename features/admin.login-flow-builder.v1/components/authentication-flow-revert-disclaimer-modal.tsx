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
import { ConfirmationModal, ConfirmationModalPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";

/**
 * Proptypes for the Authentication flow revert disclaimer modal component.
 */
export type AuthenticationFlowRevertDisclaimerModalPropsInterface = Partial<ConfirmationModalPropsInterface> &
    IdentifiableComponentInterface;

/**
 * Authentication flow revert disclaimer modal.
 *
 * @param props - Props injected to the component.
 * @returns Authentication flow revert disclaimer modal.
 */
const AuthenticationFlowRevertDisclaimerModal: FunctionComponent<
    AuthenticationFlowRevertDisclaimerModalPropsInterface
> = (
    props: AuthenticationFlowRevertDisclaimerModalPropsInterface
): ReactElement => {
    const { open, onClose, ["data-componentid"]: componentId, ...rest } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            open={ open }
            onClose={ onClose }
            type="warning"
            closeOnDimmerClick={ false }
            assertionHint={ t("authenticationFlow:revertConfirmationModal.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("authenticationFlow:revertConfirmationModal.primaryActionButtonText") }
            secondaryAction={ t("authenticationFlow:revertConfirmationModal.secondaryActionButtonText") }
            data-componentid={ componentId }
            onPrimaryActionClick={ () => onClose(null, null) }
            onSecondaryActionClick={ (event: MouseEvent<HTMLElement>) => onClose(event, null) }
            { ...rest }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-header` }>
                { t("authenticationFlow:revertConfirmationModal.title") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-componentid={ `${componentId}-message` }
            >
                { t("authenticationFlow:revertConfirmationModal.warningMessage") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-content` }>
                { t("authenticationFlow:revertConfirmationModal.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
AuthenticationFlowRevertDisclaimerModal.defaultProps = {
    "data-componentid": "authentication-flow-revert-disclaimer-modal"
};

export default AuthenticationFlowRevertDisclaimerModal;
