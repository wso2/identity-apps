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

import { AppState } from "@wso2is/admin.core.v1/store";
import useSubscription, { UseSubscriptionInterface } from "@wso2is/admin.subscription.v1/hooks/use-subscription";
import { TenantTier } from "@wso2is/admin.subscription.v1/models/tenant-tier";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ButtonProps, Segment } from "semantic-ui-react";

import EmailTemplateCustomizationPremiumBanner from "../components/banners/email-template-customization-premium-banner";

interface EmailCustomizationFooterProps extends IdentifiableComponentInterface {

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
 * Email customization footer.
 *
 * @param props - Props injected to the component.
 *
 * @returns Footer component for Email Customization.
 */
const EmailCustomizationFooter: FunctionComponent<EmailCustomizationFooterProps> = (
    props: EmailCustomizationFooterProps
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        isSaveButtonLoading,
        onSaveButtonClick
    } = props;

    const { tierName }: UseSubscriptionInterface = useSubscription();
    const { t } = useTranslation();
    const disableEmailTemplateForFreeTier: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.disableEmailTemplateForFreeTier);

    return (
        <Segment
            className="email-customization-footer"
            attached="bottom"
            padded={ true }
            data-componentid={ componentId }
        >
            { disableEmailTemplateForFreeTier && tierName === TenantTier.FREE &&
                <Segment basic><EmailTemplateCustomizationPremiumBanner /></Segment>
            }
            <PrimaryButton
                size="small"
                loading={ isSaveButtonLoading }
                onClick={ (e: MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
                    onSaveButtonClick(e, data);
                } }
                ariaLabel="Email Templates form save button"
                data-componentid={ `${componentId}-save-button` }
            >
                { t("common:save") }
            </PrimaryButton>
        </Segment>
    );
};

/**
 * Default props for the component.
 */
EmailCustomizationFooter.defaultProps = {
    "data-componentid": "email-customization-footer"
};

export default EmailCustomizationFooter;
