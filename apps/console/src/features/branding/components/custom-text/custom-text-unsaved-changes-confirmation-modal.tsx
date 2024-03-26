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

/**
 * Proptypes for the custom text revert confirmation modal.
 */
export interface CustomTextUnsavedChangesConfirmationModalPropsInterface
    extends Partial<ConfirmationModalPropsInterface>,
        IdentifiableComponentInterface {}

/**
 * Component to display the custom text revert confirmation modal.
 *
 * @param props - Props injected to the component.
 * @returns Custom text revert confirmation modal component.
 */
const CustomTextUnsavedChangesConfirmationModal: FunctionComponent<
    CustomTextUnsavedChangesConfirmationModalPropsInterface
> = (
    props: CustomTextUnsavedChangesConfirmationModalPropsInterface
) => {
    const { onClose, ["data-componentid"]: componentId, ...rest } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            onClose={ onClose }
            type="negative"
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (event: MouseEvent<HTMLElement>): void => {
                onClose(event, null);
            } }
            onPrimaryActionClick={ (event: MouseEvent<HTMLElement>): void => {
                onClose(event, null);
            } }
            data-componentid={ componentId }
            closeOnDimmerClick={ false }
            { ...rest }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-header` }>
                { t("branding:brandingCustomText.revertUnsavedConfirmationModal.heading") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-componentid={ `${componentId}-message` }
            >
                { t("branding:brandingCustomText.revertUnsavedConfirmationModal.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-content` }>
                <Trans
                    i18nKey={
                        "branding:brandingCustomText.revertUnsavedConfirmationModal.content"
                    }
                >
                    If you switch the screen, your unsaved changes will be lost.
                    Click <Code>Confirm</Code> to proceed.
                </Trans>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
CustomTextUnsavedChangesConfirmationModal.defaultProps = {
    "data-componentid": "custom-text-unsaved-changes-confirmation-modal"
};

export default CustomTextUnsavedChangesConfirmationModal;
