/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ButtonProps } from "semantic-ui-react";

interface SmsCustomizationFooterProps extends IdentifiableComponentInterface {

    /**
     * Is content loading? So Save button should also depict it's loading
     */
    isSaveButtonLoading: boolean;

    /**
     * On Save button clicked
     * @param e - Button Click Event
     * @param data - Button Props
     */
    onSaveButtonClick: (e: MouseEvent<HTMLButtonElement>, data: ButtonProps) => void;
}

/**
 * SMS customization footer.
 *
 * @param props - Props injected to the component.
 *
 * @returns Footer component for SMS Customization.
 */
const SmsCustomizationFooter: FunctionComponent<SmsCustomizationFooterProps> = (
    props: SmsCustomizationFooterProps
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        isSaveButtonLoading,
        onSaveButtonClick
    } = props;

    const { t } = useTranslation();

    return (
        <PrimaryButton
            size="small"
            loading={ isSaveButtonLoading }
            onClick={ (e: MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
                onSaveButtonClick(e, data);
            } }
            ariaLabel="SMS Templates form save button"
            data-componentid={ `${componentId}-save-button` }
        >
            { t("common:save") }
        </PrimaryButton>
    );
};

/**
 * Default props for the component.
 */
SmsCustomizationFooter.defaultProps = {
    "data-componentid": "sms-customization-footer"
};

export default SmsCustomizationFooter;
