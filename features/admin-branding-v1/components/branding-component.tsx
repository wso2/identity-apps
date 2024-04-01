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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup
} from "@wso2is/react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { BrandingPreferenceTabs, DesignFormValuesInterface } from "../components";
import {
    BrandingPreferenceInterface,
    BrandingPreferenceThemeInterface,
    PredefinedLayouts } from "../models";

interface BrandingComponentProps {
    preferenceTabsComponentKey: number;
    predefinedThemes: BrandingPreferenceThemeInterface;
    brandingPreference: BrandingPreferenceInterface;
    isBrandingPageLoading: boolean;
    isBrandingPreferenceUpdateRequestLoading: boolean;
    handlePreferenceFormSubmit:
    (values: Partial<BrandingPreferenceInterface>, shouldShowNotifications: boolean) => void;
    isGreaterThanComputerViewport: boolean;
    isReadOnly: boolean;
    setSelectedLayout: (layout: PredefinedLayouts) => void;
    setCurrentWidth: (width: number) => void;
    setShowBrandingPublishStatusConfirmationModal: (show: boolean) => void;
    showBrandingPublishStatusConfirmationModal: boolean;
    handleBrandingPublishStatus: () => void;
    componentId: string;
    isBrandingFeatureRequestLoading: boolean;
    productName: string;
    handleBrandingUnpublish: () => void;
    setShowRevertConfirmationModal: (show: boolean) => void;
    showRevertConfirmationModal: boolean;
    handleBrandingPreferenceDelete: () => void;
    isBrandingPreferenceDeleteRequestLoading: boolean;
}

const BrandingComponent: React.FC<BrandingComponentProps> = (props: BrandingComponentProps) => {

    const { t } = useTranslation();

    const {
        preferenceTabsComponentKey,
        predefinedThemes,
        brandingPreference,
        isBrandingPageLoading,
        isBrandingPreferenceUpdateRequestLoading,
        handlePreferenceFormSubmit,
        isGreaterThanComputerViewport,
        isReadOnly,
        setSelectedLayout,
        setCurrentWidth,
        setShowBrandingPublishStatusConfirmationModal,
        showBrandingPublishStatusConfirmationModal,
        handleBrandingPublishStatus,
        componentId,
        isBrandingFeatureRequestLoading,
        productName,
        handleBrandingUnpublish,
        setShowRevertConfirmationModal,
        showRevertConfirmationModal,
        handleBrandingPreferenceDelete,
        isBrandingPreferenceDeleteRequestLoading
    } = props;

    return (
        <>
            <BrandingPreferenceTabs
                key={ preferenceTabsComponentKey }
                predefinedThemes={ predefinedThemes }
                brandingPreference={ brandingPreference }
                isLoading={ isBrandingPageLoading }
                isUpdating={ isBrandingPreferenceUpdateRequestLoading }
                onSubmit={ (values: Partial<BrandingPreferenceInterface>, shouldShowNotifications: boolean) => {
                    handlePreferenceFormSubmit(values, shouldShowNotifications);
                } }
                isSplitView={ isGreaterThanComputerViewport }
                readOnly={ isReadOnly }
                onLayoutChange={ (values: DesignFormValuesInterface): void => {
                    setSelectedLayout(values.layout.activeLayout);
                } }
                onPreviewResize={ (width: number): void => {
                    setCurrentWidth(width);
                } }
            />
            <ConfirmationModal
                onClose={ (): void => setShowBrandingPublishStatusConfirmationModal(false) }
                type="warning"
                open={ showBrandingPublishStatusConfirmationModal }
                assertionHint={
                    t("extensions:develop.branding.confirmations.revertBranding.assertionHint")
                }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => setShowBrandingPublishStatusConfirmationModal(false) }
                onPrimaryActionClick={ (): void => handleBrandingPublishStatus() }
                data-componentid={ `${ componentId }-branding-feature-confirmation-modal` }
                closeOnDimmerClick={ false }
                primaryActionLoading={ isBrandingFeatureRequestLoading }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${ componentId }-branding-feature-confirmation-modal-header` }
                >
                    { t("extensions:develop.branding.confirmations.unpublishBranding.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-componentid={ `${ componentId }-branding-feature-confirmation-modal-message` }
                >
                    { brandingPreference.configs?.isBrandingEnabled ?
                        t("extensions:develop.branding.confirmations.unpublishBranding.disableMessage",
                            { productName: productName }) :
                        t("extensions:develop.branding.confirmations.unpublishBranding.enableMessage")
                    }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${ componentId }-branding-feature-confirmation-modal-content` }
                >
                    { brandingPreference.configs?.isBrandingEnabled ?
                        t("extensions:develop.branding.confirmations.unpublishBranding.disableContent") :
                        t("extensions:develop.branding.confirmations.unpublishBranding.enableContent")
                    }
                </ConfirmationModal.Content>
            </ConfirmationModal>
            <Show when={ AccessControlConstants.BRANDING_DELETE }>
                <DangerZoneGroup sectionHeader={ t("extensions:develop.branding.dangerZoneGroup.header") }>
                    { brandingPreference.configs?.isBrandingEnabled && (
                        <DangerZone
                            actionTitle={
                                t("extensions:develop.branding.dangerZoneGroup.unpublishBranding.actionTitle")
                            }
                            header={
                                t("extensions:develop.branding.dangerZoneGroup.unpublishBranding.header")
                            }
                            subheader={
                                t("extensions:develop.branding.dangerZoneGroup.unpublishBranding.subheader",
                                    { productName: productName })
                            }
                            onActionClick={ (): void => handleBrandingUnpublish() }
                            data-componentid={ `${ componentId }-danger-zone-unpublish` }
                        />
                    ) }
                    <DangerZone
                        actionTitle={
                            t("extensions:develop.branding.dangerZoneGroup.revertBranding.actionTitle")
                        }
                        header={
                            t("extensions:develop.branding.dangerZoneGroup.revertBranding.header")
                        }
                        subheader={
                            t("extensions:develop.branding.dangerZoneGroup.revertBranding.subheader",
                                { productName: productName })
                        }
                        onActionClick={ (): void => setShowRevertConfirmationModal(true) }
                        data-componentid={ `${ componentId }-danger-zone` }
                    />
                </DangerZoneGroup>
            </Show>
            <ConfirmationModal
                onClose={ (): void => setShowRevertConfirmationModal(false) }
                type="negative"
                open={ showRevertConfirmationModal }
                assertionHint={
                    t("extensions:develop.branding.confirmations.revertBranding.assertionHint")
                }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => setShowRevertConfirmationModal(false) }
                onPrimaryActionClick={ (): void => handleBrandingPreferenceDelete() }
                data-componentid={ `${ componentId }-branding-preference-revert-confirmation-modal` }
                closeOnDimmerClick={ false }
                primaryActionLoading={ isBrandingPreferenceDeleteRequestLoading }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${ componentId }-branding-preference-revert-confirmation-modal-header` }
                >
                    { t("extensions:develop.branding.confirmations.revertBranding.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ `${ componentId }-branding-preference-revert-confirmation-modal-message` }
                >
                    {
                        t("extensions:develop.branding.confirmations.revertBranding.message",
                            { productName: productName })
                    }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${ componentId }-branding-preference-revert-confirmation-modal-content` }
                >
                    { t("extensions:develop.branding.confirmations.revertBranding.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

export default BrandingComponent;
