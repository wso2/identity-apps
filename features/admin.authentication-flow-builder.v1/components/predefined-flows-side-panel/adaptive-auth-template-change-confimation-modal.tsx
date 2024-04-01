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

import { GearIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code, ConfirmationModal, ConfirmationModalPropsInterface, Link, Text } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import { AdaptiveAuthTemplateInterface } from "../../../admin.applications.v1/models/application";

/**
 * Proptypes for the Predefined flows side panel component.
 */
export interface AdaptiveAuthTemplateChangeConfirmationModalPropsInterface
    extends Partial<ConfirmationModalPropsInterface>,
        IdentifiableComponentInterface {
    /**
     * Is the template ELK risk based.
     */
    isELKRiskBased?: boolean;
    /**
     * Selected adaptive auth template to be changed.
     */
    selectedTemplate: AdaptiveAuthTemplateInterface;
    /**
     * Callback to be fired on ELK configure click.
     */
    onELKConfigureClick: () => void;
    /**
     * Callback to be fired on template change.
     */
    onTemplateChange: (template: AdaptiveAuthTemplateInterface) => void;
}

/**
 * Adaptive auth template change confirmation modal.
 *
 * @param props - Props injected to the component.
 * @returns Adaptive auth template change confirmation modal.
 */
const AdaptiveAuthTemplateChangeConfirmationModal: FunctionComponent<
    AdaptiveAuthTemplateChangeConfirmationModalPropsInterface
> = (
    props: AdaptiveAuthTemplateChangeConfirmationModalPropsInterface
) => {
    const {
        isELKRiskBased,
        selectedTemplate,
        onELKConfigureClick,
        onTemplateChange,
        onClose,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

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
                { t("authenticationFlow:adaptiveLoginFlowSelectConfirmationModal.heading") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-componentid={ `${componentId}-message` }
            >
                { t("authenticationFlow:adaptiveLoginFlowSelectConfirmationModal.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-content` }>
                {
                    isELKRiskBased && (
                        <>
                            <Text>
                                <Trans
                                    i18nKey={
                                        "governanceConnectors:connectorCategories." +
                                        "otherSettings.connectors.elasticAnalyticsEngine.warningModal.configure"
                                    }
                                >
                                    (<Link
                                        onClick={ onELKConfigureClick }
                                        external={ false }
                                    >
                                        Configure
                                    </Link>
                                        ELK Analytics settings for proper functionality.)
                                </Trans>
                            </Text>
                            <Text>
                                <Trans
                                    i18nKey={
                                        "governanceConnectors:connectorCategories." +
                                        "otherSettings.connectors.elasticAnalyticsEngine.warningModal.reassure"
                                    }
                                >
                                    You can update your settings anytime.
                                </Trans> (<Code><GearIcon size={ 14 } /></Code>)
                            </Text>
                        </>
                    )
                }
                <Trans
                    i18nKey={
                        "authenticationFlow:adaptiveLoginFlowSelectConfirmationModal.content"
                    }
                >
                    The selected template will replace the existing script in the editor as well
                    as the login steps you configured. Click <Code>Confirm</Code> to proceed.
                </Trans>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
AdaptiveAuthTemplateChangeConfirmationModal.defaultProps = {
    "data-componentid": "adaptive-auth-template-change-confirmation-modal"
};

export default AdaptiveAuthTemplateChangeConfirmationModal;
