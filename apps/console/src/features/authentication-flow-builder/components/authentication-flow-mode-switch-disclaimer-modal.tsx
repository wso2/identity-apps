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
import { Trans, useTranslation } from "react-i18next";
import { AuthenticationFlowBuilderModesInterface } from "../models/flow-builder";

/**
 * Proptypes for the Authentication flow mode switch disclaimer modal component.
 */
export interface AuthenticationFlowModeSwitchDisclaimerModalPropsInterface
    extends Partial<ConfirmationModalPropsInterface>,
        IdentifiableComponentInterface {
            /**
             * Authentication flow mode.
             */
            mode: AuthenticationFlowBuilderModesInterface;
}

/**
 * Authentication flow mode switch disclaimer modal.
 *
 * @param props - Props injected to the component.
 * @returns Authentication flow mode switch disclaimer modal.
 */
const AuthenticationFlowModeSwitchDisclaimerModal: FunctionComponent<
    AuthenticationFlowModeSwitchDisclaimerModalPropsInterface
> = (
    props: AuthenticationFlowModeSwitchDisclaimerModalPropsInterface
): ReactElement => {
    const { mode, open, onClose, ["data-componentid"]: componentId, ...rest } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            open={ open }
            onClose={ onClose }
            type="warning"
            closeOnDimmerClick={ false }
            assertionHint={ t("loginFlow:modes.switchConfirmationModal.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("loginFlow:modes.switchConfirmationModal.primaryActionButtonText") }
            secondaryAction={ t("loginFlow:modes.switchConfirmationModal.secondaryActionButtonText") }
            data-componentid={ componentId }
            onPrimaryActionClick={ () => onClose(null, null) }
            onSecondaryActionClick={ (event: MouseEvent<HTMLElement>) => onClose(event, null) }
            { ...rest }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-header` }>
                { t("loginFlow:modes.switchConfirmationModal.title") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-componentid={ `${componentId}-message` }
            >
                <Trans
                    i18nKey="loginFlow:modes.switchConfirmationModal.warningMessage"
                    tOptions={ { mode: mode.label } }
                >
                    If you switch to the <strong>{ mode.label }</strong>, you will loose the
                    unsaved changes in the current flow. Please proceed with caution.
                </Trans>
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-content` }>
                { t("loginFlow:modes.switchConfirmationModal.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
AuthenticationFlowModeSwitchDisclaimerModal.defaultProps = {
    "data-componentid": "authentication-flow-mode-switch-disclaimer-modal"
};

export default AuthenticationFlowModeSwitchDisclaimerModal;
