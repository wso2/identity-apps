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
import React, { FunctionComponent, MouseEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import { AuthenticationSequenceInterface } from "../../../applications/models/application";

/**
 * Proptypes for the basic login flow change confirmation modal component.
 */
export interface BasicLoginFlowTemplateChangeConfirmationModalPropsInterface
    extends Partial<ConfirmationModalPropsInterface>,
        IdentifiableComponentInterface {
    /**
     * Selected adaptive auth template to be changed.
     */
    selectedTemplate: {
        sequenceCategoryId: string;
        sequenceId: string;
        sequence: AuthenticationSequenceInterface;
    };
    /**
     * Callback to be fired on template change.
     */
    onTemplateChange: (template: {
        sequenceCategoryId: string;
        sequenceId: string;
        sequence: AuthenticationSequenceInterface;
    }) => void;
}

/**
 * Basic login flow change confirmation.
 *
 * @param props - Props injected to the component.
 * @returns Basic login flow change confirmation modal.
 */
const BasicLoginFlowTemplateChangeConfirmationModal: FunctionComponent<
    BasicLoginFlowTemplateChangeConfirmationModalPropsInterface
> = (
    props: BasicLoginFlowTemplateChangeConfirmationModalPropsInterface
) => {
    const { selectedTemplate, onTemplateChange, onClose, ["data-componentid"]: componentId, ...rest } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            onClose={ onClose }
            type="warning"
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (event: MouseEvent<HTMLElement>): void => {
                onClose(event, null);
                onTemplateChange(undefined);
            } }
            onPrimaryActionClick={ (event: MouseEvent<HTMLElement>): void => {
                onClose(event, null);
                onTemplateChange(selectedTemplate);
            } }
            data-componentid={ componentId }
            closeOnDimmerClick={ false }
            { ...rest }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-header` }>
                { t("loginFlow:basicLoginFlowSelectConfirmationModal.heading") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-componentid={ `${componentId}-message` }
            >
                { t("loginFlow:basicLoginFlowSelectConfirmationModal.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-content` }>
                <Trans
                    i18nKey={ "loginFlow:basicLoginFlowSelectConfirmationModal.content" }
                >
                    The selected template will replace the existing login steps you configured.
                    Click <Code>Confirm</Code> to proceed.
                </Trans>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
BasicLoginFlowTemplateChangeConfirmationModal.defaultProps = {
    "data-componentid": "basic-login-flow-change-confirmation-modal"
};

export default BasicLoginFlowTemplateChangeConfirmationModal;
