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

import { TestableComponentInterface } from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";
import {
    Heading,
    LinkButton,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import { ExtendedExternalClaimInterface } from "./attribute-settings";
import { AttributeSelectList } from "../../../../core";

interface AttributeSelectionWizardOtherDialectPropsInterface extends TestableComponentInterface {
    availableExternalClaims: ExtendedExternalClaimInterface[];
    setAvailableExternalClaims: any;
    selectedExternalClaims: ExtendedExternalClaimInterface[];
    setSelectedExternalClaims: any;
    setInitialSelectedExternalClaims: any;
    showAddModal: boolean;
    setShowAddModal: (showModal: boolean) => void;
    /**
     * Specifies if this is shown in the scope section.
     */
    isScopeSection?: boolean;
    /**
     * The name of the scope.
     */
    scopeName?: string;
}

/**
 * Other dialects attribute selection wizard component.
 *
 * @param {AttributeSelectionWizardOtherDialectPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AttributeSelectionWizardOtherDialect:
    FunctionComponent<AttributeSelectionWizardOtherDialectPropsInterface> = (
        props: AttributeSelectionWizardOtherDialectPropsInterface
    ): ReactElement => {
        const {
            selectedExternalClaims,
            setAvailableExternalClaims,
            setInitialSelectedExternalClaims,
            showAddModal,
            setShowAddModal,
            availableExternalClaims,
            isScopeSection,
            scopeName,
            [ "data-testid" ]: testId
        } = props;

        const [ submit, triggerSubmit ] = useTrigger();

        const { t } = useTranslation();

        const handleAttributeModal = () => {
            setShowAddModal(false);
        };

        return (
            <Modal open={ showAddModal } size="large" className="user-roles attribute-modal" data-testid={ testId }>
                <Modal.Header>
                    { t("console:develop.features.applications.edit.sections.attributes.selection.addWizard.header") }
                    <Heading subHeading ellipsis as="h6">
                        { !isScopeSection
                            ? t(
                                "console:develop.features.applications.edit.sections.attributes.selection.addWizard." +
                            "subHeading"
                            )
                            : t(
                                "console:manage.features.oidcScopes.addAttributes.description", { name: scopeName }
                            )
                        }
                    </Heading>
                </Modal.Header>
                <Modal.Content image>
                    { showAddModal && (
                        <AttributeSelectList
                            triggerSubmit={ submit }
                            setAvailableExternalClaims={ setAvailableExternalClaims }
                            setInitialSelectedExternalClaims={ setInitialSelectedExternalClaims }
                            selectedExternalClaims={ selectedExternalClaims }
                            availableExternalClaims={ availableExternalClaims }
                            onUpdate={ handleAttributeModal }
                        />
                    ) }
                </Modal.Content>
                <Modal.Actions>
                    <LinkButton onClick={ handleAttributeModal } data-testid={ `${testId}-cancel-button` }>
                        { t("common:cancel") }
                    </LinkButton>
                    <PrimaryButton
                        onClick={ () => {
                            triggerSubmit();
                        } }
                        data-testid={ `${testId}-save-button` }
                    >
                        { t("common:save") }
                    </PrimaryButton>
                </Modal.Actions>
            </Modal>
        );
    };

/**
 * Default props for the application attribute selection wizard other dialects component.
 */
AttributeSelectionWizardOtherDialect.defaultProps = {
    "data-testid": "application-attribute-selection-wizard-other-dialects"
};
