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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetBrandingPreferenceResolve from "@wso2is/common.branding.v1/api/use-get-branding-preference-resolve";
import { BrandingPreferenceTypes } from "@wso2is/common.branding.v1/models";
import { deletePurpose, useGetPurpose } from "@wso2is/common.consents.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    PageLayout
} from "@wso2is/react-components";
import Chip from "@oxygen-ui/react/Chip";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { EditPolicyConsent } from "../components/edit-policy-consent";
import { DEFAULT_POLICY_PATH_MAP } from "../constants/default-policies";

/**
 * Props interface for the Policy Consent edit page component.
 */
interface PolicyConsentEditPageProps extends IdentifiableComponentInterface, RouteComponentProps<{ id: string }> { }

/**
 * Policy Consent edit page.
 * Also handles the 3 built-in default policies accessed via constant URL slugs
 * (e.g. /policy-consents/privacy-policy).
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
    const slugConfig: string | undefined = DEFAULT_POLICY_PATH_MAP[id];
    const isDefaultPolicy: boolean = !!slugConfig;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );
    const hasDeletePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.delete);

    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

    const { data: consent, isLoading: isConsentLoading } = useGetPurpose(
        isDefaultPolicy ? null : id
    );

    const { isLoading: isBrandingLoading } = useGetBrandingPreferenceResolve(
        isDefaultPolicy ? AppConstants.getTenant() : null,
        BrandingPreferenceTypes.ORG
    );

    const purposeId: string | undefined = useMemo((): string | undefined => {
        return isDefaultPolicy ? undefined : consent?.id;
    }, [ isDefaultPolicy, consent ]);

    const displayName: string = isDefaultPolicy
        ? slugConfig
        : (consent?.displayName || "");

    const isLoading: boolean = isDefaultPolicy ? isBrandingLoading : isConsentLoading;

    const isReady: boolean = isDefaultPolicy ? !isBrandingLoading : !!consent;

    const handleBackButtonClick = (): void => {
        window.history.back();
    };

    const handleDeleteConsent = (): void => {
        if (!purposeId) {
            return;
        }

        setIsDeleting(true);

        deletePurpose(purposeId)
            .then((): void => {
                dispatch(addAlert({
                    description: t("consents:policyConsents.notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:policyConsents.notifications.delete.success.message")
                }));
                history.replace(AppConstants.getPaths().get("POLICY_CONSENTS"));
            })
            .catch((error: IdentityAppsApiException): void => {
                const status: number = error?.response?.status;
                let description: string;
                let message: string;

                switch (status) {
                    case 404:
                        description = t("consents:policyConsents.notifications.delete.error.notFound.description");
                        message = t("consents:policyConsents.notifications.delete.error.notFound.message");

                        break;
                    case 409:
                        description = t("consents:policyConsents.notifications.delete.error.conflict.description");
                        message = t("consents:policyConsents.notifications.delete.error.conflict.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t(
                                "consents:policyConsents.notifications.delete.error.serverError.description"
                            );
                            message = t("consents:policyConsents.notifications.delete.error.serverError.message");
                        } else {
                            description = t("consents:policyConsents.notifications.delete.error.description");
                            message = t("consents:policyConsents.notifications.delete.error.message");
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
            pageTitle={ t("consents:policyConsents.pages.edit.title") }
            title={ displayName }
            description={ isDefaultPolicy && (
                <Chip
                    label={ t("common:default") }
                    size="medium"
                    variant="filled"
                    color="default"
                />
            ) }
            image={ (
                <AnimatedAvatar
                    name={ displayName }
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
            isLoading={ isLoading }
            backButton={ {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("consents:policyConsents.pages.edit.backButton")
            } }
        >
            { isReady && (
                <>
                    <EditPolicyConsent
                        purposeId={ purposeId }
                        defaultName={ slugConfig }
                    />
                    { hasDeletePermission && purposeId && (
                        <DangerZoneGroup
                            sectionHeader={ t("common:dangerZone") }
                        >
                            <DangerZone
                                actionTitle={ t("consents:policyConsents.pages.edit.dangerZone.actionTitle") }
                                header={ t("consents:policyConsents.pages.edit.dangerZone.header") }
                                subheader={ t("consents:policyConsents.pages.edit.dangerZone.subheader") }
                                onActionClick={ () => setShowDeleteConfirmation(true) }
                            />
                        </DangerZoneGroup>
                    ) }
                    <ConfirmationModal
                        onClose={ () => setShowDeleteConfirmation(false) }
                        type="negative"
                        open={ showDeleteConfirmation }
                        assertionHint={ t("consents:policyConsents.pages.deleteConfirmation.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("consents:policyConsents.pages.deleteConfirmation.primaryAction") }
                        secondaryAction={ t("consents:policyConsents.pages.deleteConfirmation.secondaryAction") }
                        onSecondaryActionClick={ () => setShowDeleteConfirmation(false) }
                        onPrimaryActionClick={ () => handleDeleteConsent() }
                        data-componentid={ `${componentId}-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                        primaryActionLoading={ isDeleting }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${componentId}-delete-confirmation-modal-header` }
                        >
                            { t("consents:policyConsents.pages.deleteConfirmation.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                        >
                            { t("consents:policyConsents.pages.deleteConfirmation.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${componentId}-delete-confirmation-modal-content` }
                        >
                            { t("consents:policyConsents.pages.deleteConfirmation.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                </>
            ) }
        </PageLayout>
    );
};

export default PolicyConsentEditPage;
