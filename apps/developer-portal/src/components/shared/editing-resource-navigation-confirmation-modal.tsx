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

import { ConfirmationModal, ConfirmationModalPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";

/**
 * Resource tab navigation confirmation modal.
 */
export type EditingResourceNavigationConfirmationModalInterface = ConfirmationModalPropsInterface;

/**
 * Confirmation modal to show a disclaimer message to users notifying
 * when trying to navigate away from partially filled formed.
 *
 * @param {EditingResourceNavigationConfirmationModalInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const EditingResourceNavigationConfirmationModal: FunctionComponent<
    EditingResourceNavigationConfirmationModalInterface
    > = (
        props: EditingResourceNavigationConfirmationModalInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            primaryAction={ t("devPortal:confirmations.resourceEditTabNav.primaryAction") }
            secondaryAction={ t("devPortal:confirmations.resourceEditTabNav.secondaryAction") }
            data-testid={ testId  }
            { ...rest }
        >
            <ConfirmationModal.Header
                data-testid={ `${ testId }-header` }
            >
                { t("devPortal:confirmations.resourceEditTabNav.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-message` }
            >
                { t("devPortal:confirmations.resourceEditTabNav.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-content` }
            >
                { t("devPortal:confirmations.resourceEditTabNav.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
EditingResourceNavigationConfirmationModal.defaultProps = {
    "data-testid": "tan-nav-confirmation-modal",
    type: "warning"
};
