/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { ProfileConstants } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ProfileSchema } from "../../../models/profile";

interface MultiValueDeleteConfirmationModalPropsInterface extends IdentifiableComponentInterface {
    selectedAttributeInfo: { value: string; schema: ProfileSchema };
    onClose: () => void;
    onConfirm: () => void;
}

const MultiValueDeleteConfirmationModal: FunctionComponent<MultiValueDeleteConfirmationModalPropsInterface> = ({
    selectedAttributeInfo,
    onClose,
    onConfirm,
    ["data-componentid"]: componentId = "component-id"
}: MultiValueDeleteConfirmationModalPropsInterface): ReactElement => {
    const { t } = useTranslation();

    let translationKey: string = "";

    if (selectedAttributeInfo?.schema?.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES")) {
        translationKey = "myAccount:components.profile.modals.emailAddressDeleteConfirmation.";
    } else if (selectedAttributeInfo?.schema?.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS")) {
        translationKey = "myAccount:components.profile.modals.mobileNumberDeleteConfirmation.";
    } else {
        translationKey = "myAccount:components.profile.modals.customMultiAttributeDeleteConfirmation.";
    }

    return (
        <ConfirmationModal
            data-testid={ `${componentId}-delete-confirmation-modal` }
            data-componentid={ `${componentId}-delete-confirmation-modal` }
            onClose={ onClose }
            type="negative"
            open={ Boolean(selectedAttributeInfo?.value) }
            assertionHint={ t(`${translationKey}assertionHint`) }
            assertionType="checkbox"
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ onClose }
            onPrimaryActionClick={ onConfirm }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header data-testid={ `${componentId}-confirmation-modal-header` }>
                { t(`${translationKey}heading`) }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message data-testid={ `${componentId}-confirmation-modal-message` } attached negative>
                { t(`${translationKey}description`) }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-testid={ `${componentId}-confirmation-modal-content` }>
                { t(`${translationKey}content`) }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

export default MultiValueDeleteConfirmationModal;
