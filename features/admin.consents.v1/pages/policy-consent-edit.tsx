/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { deletePurpose, useGetPurpose } from "@wso2is/common.consents.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    PageLayout
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { EditPolicyConsent } from "../components/edit-policy-consent";

/**
 * Props interface for the Policy Consent edit page component.
 */
interface PolicyConsentEditPageProps extends IdentifiableComponentInterface, RouteComponentProps<{ id: string }> { }

/**
 * Policy Consent edit page.
 *
 * @param props - Props injected to the component.
 * @returns Policy Consent edit page component.
 */
const PolicyConsentEditPage: FunctionComponent<PolicyConsentEditPageProps> = (
    props: PolicyConsentEditPageProps
): ReactElement => {
    const {
        match,
        ["data-componentid"]: componentId = "policy-consent-edit-page"
    } = props;

    const id: string = match?.params?.id;

    const { data: consent, isLoading: isConsentRequestLoading } = useGetPurpose(id);

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = React.useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = React.useState<boolean>(false);

    const handleBackButtonClick = (): void => {
        window.history.back();
    };

    const handleDeleteConsent = (): void => {
        setIsDeleting(true);

        deletePurpose(id)
            .then((): void => {
                dispatch(addAlert({
                    description: t("consents:notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:notifications.delete.success.message")
                }));
                handleBackButtonClick();
            })
            .catch((error: IdentityAppsApiException): void => {
                const status: number = error?.response?.status;
                let description: string;
                let message: string;

                switch (status) {
                    case 404:
                        description = t("consents:notifications.delete.error.notFound.description");
                        message = t("consents:notifications.delete.error.notFound.message");

                        break;
                    case 409:
                        description = t("consents:notifications.delete.error.conflict.description");
                        message = t("consents:notifications.delete.error.conflict.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t("consents:notifications.delete.error.serverError.description");
                            message = t("consents:notifications.delete.error.serverError.message");
                        } else {
                            description = t("consents:notifications.delete.error.description");
                            message = t("consents:notifications.delete.error.message");
                        }
                }

                dispatch(addAlert({
                    description,
                    level: AlertLevels.ERROR,
                    message
                }));
            })
            .finally((): void => {
                setIsDeleting(false);
                setShowDeleteConfirmation(false);
            });
    };


    return (
        <PageLayout
            pageTitle={ t("consents:pages.edit.title") }
            title={ consent?.displayName || "" }
            image={ (
                <AnimatedAvatar
                    name={ consent?.displayName }
                    size="tiny"
                    floated="left"
                />
            ) }
            loadingStateOptions={ {
                count: 5,
                imageType: "square"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ `${componentId}-layout` }
            isLoading={ isConsentRequestLoading }
            backButton={ {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("consents:pages.edit.backButton")
            } }
        >
            { consent && (
                <>
                    <EditPolicyConsent purposeId={ consent.id } />
                    <DangerZoneGroup
                        sectionHeader={ t("common:dangerZone") }
                    >
                        <DangerZone
                            actionTitle={ t("consents:pages.edit.dangerZone.actionTitle") }
                            header={ t("consents:pages.edit.dangerZone.header") }
                            subheader={ t("consents:pages.edit.dangerZone.subheader") }
                            onActionClick={ () => setShowDeleteConfirmation(true) }
                        />
                    </DangerZoneGroup>
                    <ConfirmationModal
                        onClose={ () => setShowDeleteConfirmation(false) }
                        type="negative"
                        open={ showDeleteConfirmation }
                        assertionHint={ t("consents:pages.edit.deleteConfirmation.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("consents:pages.edit.deleteConfirmation.primaryAction") }
                        secondaryAction={ t("consents:pages.edit.deleteConfirmation.secondaryAction") }
                        onSecondaryActionClick={ () => setShowDeleteConfirmation(false) }
                        onPrimaryActionClick={ () => handleDeleteConsent() }
                        data-componentid={ `${componentId}-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                        primaryActionLoading={ isDeleting }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${componentId}-delete-confirmation-modal-header` }
                        >
                            { t("consents:pages.edit.deleteConfirmation.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                        >
                            { t("consents:pages.edit.deleteConfirmation.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${componentId}-delete-confirmation-modal-content` }
                        >
                            { t("consents:pages.edit.deleteConfirmation.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                </>
            ) }
        </PageLayout>
    );
};

export default PolicyConsentEditPage;
