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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    AuthenticatorCreateWizardFactory
} from "@wso2is/admin.identity-providers.v1/components/wizards/authenticator-create-wizard-factory";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code, ConfirmationModal, ConfirmationModalPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ModalProps } from "semantic-ui-react";
import useAuthenticationFlow from "../../hooks/use-authentication-flow";

/**
 * Proptypes for the duplicate social authenticator selection modal component.
 */
export interface MissingSocialAuthenticatorSelectionModalPropsInterface
    extends Partial<ConfirmationModalPropsInterface>,
        IdentifiableComponentInterface {
    /**
     * Authenticator category.
     */
    authenticatorCategoryDisplayName: string;
    /**
     * Authenticator category template.
     */
    authenticatorCategoryTemplate: string;
}

/**
 * Modal to select the social authenticator from a list of related authenticators.
 *
 * @param props - Props injected to the component.
 * @returns Social authenticator selection modal.
 */
const MissingSocialAuthenticatorSelectionModal: FunctionComponent<
    MissingSocialAuthenticatorSelectionModalPropsInterface
> = (
    props: MissingSocialAuthenticatorSelectionModalPropsInterface
) => {
    const {
        open: missingSocialAuthenticatorModalOpen,
        authenticatorCategoryTemplate,
        authenticatorCategoryDisplayName,
        onClose: missingSocialAuthenticatorModalOnClose,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const { refetchAuthenticators } = useAuthenticationFlow();

    const [
        showMissingSocialAuthenticatorModal,
        setShowMissingSocialAuthenticatorModal
    ] = useState<boolean>(missingSocialAuthenticatorModalOpen);
    const [ showAuthenticatorCreateWizard, setShowAuthenticatorCreateWizard ] = useState<boolean>(false);

    const { t } = useTranslation();

    /**
     * Set the internal state of the showMissingSocialAuthenticatorModal when the `open` prop changes.
     */
    useEffect(() => {
        setShowMissingSocialAuthenticatorModal(missingSocialAuthenticatorModalOpen);
    }, [ open ]);

    /**
     * Renders the IDP create wizard.
     *
     * @returns React element.
     */
    const renderIDPCreateWizard = (): ReactElement => {

        if (!authenticatorCategoryTemplate) {
            return;
        }

        return (
            <AuthenticatorCreateWizardFactory
                open={ showAuthenticatorCreateWizard }
                type={ authenticatorCategoryTemplate }
                selectedTemplate={ null }
                onIDPCreate={ () => {
                    refetchAuthenticators();
                } }
                onWizardClose={ () => {
                    setShowAuthenticatorCreateWizard(false);
                    missingSocialAuthenticatorModalOnClose(null, null);
                } }
            />
        );
    };

    return (
        <>
            <ConfirmationModal
                open={ showMissingSocialAuthenticatorModal }
                type="info"
                onClose={ (event: MouseEvent<HTMLElement>, data: ModalProps): void => {
                    missingSocialAuthenticatorModalOnClose(event, data);
                } }
                primaryAction={
                    t("applications:edit.sections.signOnMethod.sections.landing." +
                    "flowBuilder.addMissingSocialAuthenticatorModal.primaryButton")
                }
                secondaryAction={
                    t("applications:edit.sections.signOnMethod.sections.landing." +
                    "flowBuilder.addMissingSocialAuthenticatorModal.secondaryButton")
                }
                onSecondaryActionClick={ (event: MouseEvent<HTMLElement>): void => {
                    missingSocialAuthenticatorModalOnClose(event, null);
                } }
                onPrimaryActionClick={ (): void => {
                    setShowAuthenticatorCreateWizard(true);
                    setShowMissingSocialAuthenticatorModal(false);
                } }
                data-componentid={ componentId }
                closeOnDimmerClick={ false }
                { ...rest }
            >
                <ConfirmationModal.Header>
                    {
                        t("applications:edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.addMissingSocialAuthenticatorModal.heading",
                        { authenticator: authenticatorCategoryDisplayName })
                    }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached info>
                    {
                        t("applications:edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.addMissingSocialAuthenticatorModal.content.message",
                        { authenticator: authenticatorCategoryDisplayName })
                    }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    <Trans
                        i18nKey={
                            "applications:edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.addMissingSocialAuthenticatorModal.content.body"
                        }
                        tOptions={ { authenticator: authenticatorCategoryDisplayName } }
                    >
                        You do not have an active Social Connection configured with
                        <Code> { authenticatorCategoryDisplayName }
                        Authenticator</Code>. Click on the <strong>Configure</strong> button to register a new
                        <Code>{ authenticatorCategoryDisplayName } Social Connection</Code> or navigate to the <a
                            onClick={ () => {
                                history.push(AppConstants.getPaths().get("IDP"));
                            } }
                            className="external-link link pointing primary"
                        >Connections</a> section manually.
                    </Trans>
                </ConfirmationModal.Content>
            </ConfirmationModal>
            { showAuthenticatorCreateWizard && renderIDPCreateWizard() }
        </>
    );
};

/**
 * Default props for the component.
 */
MissingSocialAuthenticatorSelectionModal.defaultProps = {
    "data-componentid": "duplicate-social-authenticator-selection-modal"
};

export default MissingSocialAuthenticatorSelectionModal;
