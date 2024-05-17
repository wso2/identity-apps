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
import { useSelector } from "react-redux";
import { AppState } from "@wso2is/admin.core.v1/store";
import useBrandingPreference from "../../hooks/use-branding-preference";

/**
 * Proptypes for the custom text revert confirmation modal.
 */
export interface CustomTextRevertConfirmationModalPropsInterface
    extends Partial<ConfirmationModalPropsInterface>,
        IdentifiableComponentInterface {}

/**
 * Component to display the custom text revert confirmation modal.
 *
 * @param props - Props injected to the component.
 * @returns Custom text revert confirmation modal component.
 */
const CustomTextRevertConfirmationModal: FunctionComponent<CustomTextRevertConfirmationModalPropsInterface> = (
    props: CustomTextRevertConfirmationModalPropsInterface
) => {
    const { onClose, ["data-componentid"]: componentId, ...rest } = props;

    const { t } = useTranslation();

    const { selectedLocale, selectedScreen } = useBrandingPreference();

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

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
                { t("branding:brandingCustomText.revertScreenConfirmationModal.heading") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message attached negative data-componentid={ `${componentId}-message` }>
                <Trans
                    i18nKey={ "branding:brandingCustomText.revertScreenConfirmationModal.message" }
                    tOptions={ {
                        locale: selectedLocale,
                        screen: selectedScreen
                    } }
                >
                    Reverting <Code>{ selectedScreen }</Code> screen&apos;s customized text for the <Code>
                        { selectedLocale }</Code> locale.
                </Trans>
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-content` }>
                { t("branding:brandingCustomText.revertScreenConfirmationModal.content", { productName }) }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
CustomTextRevertConfirmationModal.defaultProps = {
    "data-componentid": "custom-text-revert-confirmation-modal"
};

export default CustomTextRevertConfirmationModal;
