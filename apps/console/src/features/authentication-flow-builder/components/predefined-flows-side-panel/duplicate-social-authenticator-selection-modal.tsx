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
import { Code, ConfirmationModal, ConfirmationModalPropsInterface, LabeledCard, Text } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import {
    IdentityProviderManagementConstants
} from "../../../identity-providers/constants/identity-provider-management-constants";
import { GenericAuthenticatorInterface } from "../../../identity-providers/models/identity-provider";

/**
 * Proptypes for the duplicate social authenticator selection modal component.
 */
export interface DuplicateSocialAuthenticatorSelectionModalPropsInterface
    extends Partial<ConfirmationModalPropsInterface>,
        IdentifiableComponentInterface {
    /**
     * Set of authenticators to select from.
     */
    authenticators: GenericAuthenticatorInterface[];
    /**
     * Authenticator category.
     */
    authenticatorCategoryDisplayName: string;
    /**
     * Callback to be fired on authenticator change.
     */
    onSelect: (authenticator: GenericAuthenticatorInterface) => void;
}

/**
 * Modal to select the social authenticator from a list of related authenticators.
 *
 * @param props - Props injected to the component.
 * @returns Social authenticator selection modal.
 */
const DuplicateSocialAuthenticatorSelectionModal: FunctionComponent<
    DuplicateSocialAuthenticatorSelectionModalPropsInterface
> = (
    props: DuplicateSocialAuthenticatorSelectionModalPropsInterface
) => {
    const {
        authenticators,
        authenticatorCategoryDisplayName,
        onSelect,
        onClose,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const [
        selectedAuthenticator,
        setSelectedAuthenticator
    ] = useState<GenericAuthenticatorInterface>(authenticators[0]);

    return (
        <ConfirmationModal
            type="warning"
            className="duplicate-social-authenticator-selection-modal"
            onClose={ onClose }
            primaryAction={ t(
                "console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                    "flowBuilder.duplicateSocialAuthenticatorSelectionModal.primaryButton"
            ) }
            secondaryAction={ t(
                "console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                    "flowBuilder.duplicateSocialAuthenticatorSelectionModal.secondaryButton"
            ) }
            onSecondaryActionClick={ (event: MouseEvent<HTMLElement>): void => {
                onClose(event, null);
            } }
            onPrimaryActionClick={ (event: MouseEvent<HTMLElement>): void => {
                onSelect(selectedAuthenticator);
                onClose(event, null);
            } }
            data-componentid={ componentId }
            closeOnDimmerClick={ false }
            { ...rest }
        >
            <ConfirmationModal.Header>
                { t(
                    "console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.duplicateSocialAuthenticatorSelectionModal.heading",
                    { authenticator: authenticatorCategoryDisplayName }
                ) }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message attached warning>
                { t(
                    "console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                        "flowBuilder.duplicateSocialAuthenticatorSelectionModal.content.message",
                    { authenticator: authenticatorCategoryDisplayName }
                ) }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content scrolling>
                <Text>
                    <Trans
                        i18nKey={
                            "console:develop.features.applications.edit.sections.signOnMethod.sections.landing." +
                            "flowBuilder.duplicateSocialAuthenticatorSelectionModal.content.body"
                        }
                        tOptions={ { authenticator: authenticatorCategoryDisplayName } }
                    >
                        You have multiple Social Connections configured with &nbsp;
                        <Code>
                            { authenticatorCategoryDisplayName }
                            Authenticator
                        </Code>
                        . Select the desired one from the selection below to proceed.
                    </Trans>
                </Text>
                <Divider hidden />
                <div className="authenticator-grid">
                    { authenticators
                        .filter((authenticator: GenericAuthenticatorInterface) => {
                            return authenticator.name !== IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR;
                        })
                        .map((authenticator: GenericAuthenticatorInterface, index: number) => (
                            <LabeledCard
                                key={ index }
                                multilineLabel
                                className="authenticator-card"
                                size="tiny"
                                selected={ selectedAuthenticator.id === authenticator.id }
                                image={ authenticator.image }
                                label={ authenticator.displayName }
                                labelEllipsis={ true }
                                data-componentid={ `${componentId}-authenticator-${authenticator.name}` }
                                onClick={ () => setSelectedAuthenticator(authenticator) }
                            />
                        )) }
                </div>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
DuplicateSocialAuthenticatorSelectionModal.defaultProps = {
    "data-componentid": "duplicate-social-authenticator-selection-modal"
};

export default DuplicateSocialAuthenticatorSelectionModal;
