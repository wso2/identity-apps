/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ButtonProps, Segment } from "semantic-ui-react";

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

    const { t } = useTranslation();

    return (
        <Segment
            className="email-customization-footer"
            attached="bottom"
            padded={ true }
            data-componentid={ componentId }
        >
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
