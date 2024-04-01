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
import { Code, ConfirmationModal, ConfirmationModalPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import useAuthenticationFlow from "../../hooks/use-authentication-flow";

/**
 * Proptypes for the adaptive script reset confirmation modal component.
 */
export type AdaptiveScriptResetConfirmationModalPropsInterface = Partial<ConfirmationModalPropsInterface> & 
    IdentifiableComponentInterface

/**
 * Adaptive script reset confirmation modal.
 *
 * @param props - React component props.
 * @returns Adaptive script reset confirmation modal.
 */
const AdaptiveScriptResetConfirmationModal: FunctionComponent<AdaptiveScriptResetConfirmationModalPropsInterface> = (
    props: AdaptiveScriptResetConfirmationModalPropsInterface
): ReactElement => {
    const { open, onClose, ["data-componentid"]: componentId, ...rest } = props;

    const { t } = useTranslation();

    const {
        onConditionalAuthenticationToggle
    } = useAuthenticationFlow();

    const resetAdaptiveScriptTemplateToDefaultHandler = () => {
        onConditionalAuthenticationToggle(false);
        onClose(null, null);
    };

    return (
        <ConfirmationModal
            open={ open }
            onClose={ onClose }
            type="warning"
            closeOnDimmerClick={ false }
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            data-componentid={ componentId }
            onPrimaryActionClick={ () => {
                resetAdaptiveScriptTemplateToDefaultHandler();
            } }
            onSecondaryActionClick={ (event: MouseEvent<HTMLElement>) => onClose(event, null) }
            { ...rest }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-header` }>
                { t("applications:edit." +
                    "sections.signOnMethod.sections.authenticationFlow." +
                    "sections.scriptBased.editor.resetConfirmation.heading") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-componentid={ `${componentId}-message` }
            >
                { t("applications:edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-content` }>
                <Trans
                    i18nKey={
                        "applications:edit.sections.signOnMethod.sections" +
                        ".authenticationFlow.sections.scriptBased.editor.resetConfirmation.content"
                    }
                >
                    This action will reset the adaptive authentication script back to default.
                    Click <Code>Confirm</Code> to proceed.
                </Trans>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
AdaptiveScriptResetConfirmationModal.defaultProps = {
    "data-componentid": "adaptive-script-reset-confirmation-modal"
};

export default AdaptiveScriptResetConfirmationModal;
