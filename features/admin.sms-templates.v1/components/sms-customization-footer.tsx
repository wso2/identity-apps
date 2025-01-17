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

import Button from "@oxygen-ui/react/Button";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface SMSCustomizationFooterProps extends IdentifiableComponentInterface {
    /**
     * Is content loading? So Save button should also depict it's loading
     */
    isSaveButtonLoading: boolean;

    /**
     * On Save button clicked
     * @param e - Button Click Event
     * @param data - Button Props
     */
    onSaveButtonClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * SMS customization footer.
 *
 * @param props - Props injected to the component.
 *
 * @returns Footer component for SMS Customization.
 */
const SMSCustomizationFooter: FunctionComponent<SMSCustomizationFooterProps> = (
    props: SMSCustomizationFooterProps
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "sms-customization-footer",
        isSaveButtonLoading,
        onSaveButtonClick
    } = props;

    const { t } = useTranslation();

    return (
        <Button
            size="small"
            variant="contained"
            loading={ isSaveButtonLoading }
            onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                onSaveButtonClick(e);
            } }
            data-componentid={ `${componentId}-save-button` }
        >
            { t("common:save") }
        </Button>
    );
};

export default SMSCustomizationFooter;
