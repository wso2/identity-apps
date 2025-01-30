/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { ExtensionTemplateListInterface, ResourceTypes } from "@wso2is/admin.template-core.v1/models/templates";
import ExtensionTemplatesProvider from "@wso2is/admin.template-core.v1/provider/extension-templates-provider";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DangerZone, DangerZoneGroup, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import { createPushProvider, deletePushProvider, updatePushProvider } from "../api/push-provider";
import useGetPushProviderTemplate from "../api/use-get-push-provider-template";
import useGetPushProviderTemplateMetadata from "../api/use-get-push-provider-template-metadata";
import useGetPushProvidersList from "../api/use-get-push-providers";
import { PushProviderSettings } from "../components/push-provider-settings";
import PushProvidersGrid from "../components/push-providers-grid";
import { PushProviderConstants } from "../constants/push-provider-constants";
import { PushProviderAPIInterface, PushProviderAPIResponseInterface } from "../models/push-providers";

type PushProvidersPageInterface = IdentifiableComponentInterface;

/**
 * Push Providers page.
 *
 * @param props - Props injected to the component.
 * @returns Push Providers main page.
 */
const PushProvidersPage: FunctionComponent<PushProvidersPageInterface> = (
    props: PushProvidersPageInterface
): ReactElement => {

    const { ["data-componentid"]: componentId = "push-providers-page" } = props;
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ selectedTemplate, setSelectedTemplate ] = useState<ExtensionTemplateListInterface>(null);
    const [ availableTemplates, setAvailableTemplates ] = useState<ExtensionTemplateListInterface[]>(null);
    const [ pushProvider, setPushProvider ] = useState<PushProviderAPIResponseInterface>(null);
    const [ isOpenRevertConfigModal, setOpenRevertConfigModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data: pushProviderTemplate,
        isLoading: isPushProviderTemplateLoading,
        mutate: mutatePushProviderTemplateFetchRequest
    } = useGetPushProviderTemplate(selectedTemplate?.id, !!selectedTemplate);

    const {
        data: pushProviderTemplateMetadata,
        isLoading: isPushProviderTemplateMetadataLoading,
        mutate: mutatePushProviderTemplateMetadataFetchRequest
    } = useGetPushProviderTemplateMetadata(selectedTemplate?.id, !!selectedTemplate);

    const {
        data: pushProvidersList,
        isLoading: isPushProvidersListLoading,
        mutate: mutatePushProvidersListFetchRequest
    } = useGetPushProvidersList();

    useEffect(() => {
        if (pushProvidersList?.length > 0) {
            setPushProvider(pushProvidersList[0]);
            const providerType: string = pushProvidersList[0].provider;

            availableTemplates?.forEach((template: ExtensionTemplateListInterface) => {
                if (PushProviderConstants.PUSH_PROVIDER_TEMPLATE_NAME_MAPPING.get(template.id) === providerType) {
                    setSelectedTemplate(template);
                }
            });
        }
        if (availableTemplates?.length > 0 && !selectedTemplate) {
            setSelectedTemplate(availableTemplates[0]);
        }

    }, [ pushProvidersList, availableTemplates ]);

    const handleBackButtonClick = () => {
        history.push(`${AppConstants.getPaths().get("NOTIFICATION_CHANNELS")}`);
    };

    const handlePushProviderDelete = (): void => {
        deletePushProvider()
            .then(() => {
                dispatch(addAlert({
                    description: t("pushProviders:alerts.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("pushProviders:alerts.delete.success.message")
                }));
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        || t("pushProviders:alerts.delete.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("pushProviders:alerts.delete.error.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
                setOpenRevertConfigModal(false);
                setPushProvider(null);
                mutatePushProvidersListFetchRequest();
                mutatePushProviderTemplateFetchRequest();
                mutatePushProviderTemplateMetadataFetchRequest();
            });;
    };

    const handlePushProviderUpdate = ( data: PushProviderAPIInterface ): void => {
        updatePushProvider(data)
            .then(() => {
                dispatch(addAlert({
                    description: t("pushProviders:alerts.create.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("pushProviders:alerts.create.success.message")
                }));
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        || t("pushProviders:alerts.create.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("pushProviders:alerts.create.error.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
                mutatePushProvidersListFetchRequest();
                mutatePushProviderTemplateFetchRequest();
                mutatePushProviderTemplateMetadataFetchRequest();
            });
    };

    const handlePushProviderCreate = ( data: PushProviderAPIInterface, callback: () => void ): void => {
        createPushProvider(data)
            .then(() => {
                dispatch(addAlert({
                    description: t("pushProviders:alerts.create.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("pushProviders:alerts.create.success.message")
                }));
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        || t("pushProviders:alerts.create.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("pushProviders:alerts.create.error.message")
                }));
            })
            .finally(() => {
                callback();
                setIsSubmitting(false);
                mutatePushProvidersListFetchRequest();
                mutatePushProviderTemplateFetchRequest();
                mutatePushProviderTemplateMetadataFetchRequest();
            });
    };

    return(
        <PageLayout
            title={ t("pushProviders:heading") }
            pageTitle={ t("pushProviders:heading") }
            description={ t("pushProviders:subHeading") }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth= { true }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("pushProviders:goBack")
            } }
            data-componentid={ `${componentId}-page-layout` }
        >
            <ExtensionTemplatesProvider
                resourceType={ ResourceTypes.NOTIFICATION_PROVIDERS }
                categories={ PushProviderConstants.NOTIFICATION_PROVIDER_CATEGORIES_INFO }
            >
                <PushProvidersGrid
                    onTemplateSelect={ (template: ExtensionTemplateListInterface) => {
                        setSelectedTemplate(template);
                    } }
                    onTemplatesLoad={ (templates: ExtensionTemplateListInterface[]) => {
                        setAvailableTemplates(templates);
                    } }
                    selectedTemplate={ selectedTemplate }
                />
                <PushProviderSettings
                    pushProvider={ pushProvider }
                    pushProviderTemplateInfo={ selectedTemplate }
                    pushProviderTemplateData={ pushProviderTemplate }
                    pushProviderTemplateMetadata={ pushProviderTemplateMetadata }
                    isLoading={ isPushProviderTemplateLoading
                        || isPushProviderTemplateMetadataLoading
                        || isPushProvidersListLoading
                    }
                    handleDelete={ handlePushProviderDelete }
                    handleUpdate={ handlePushProviderUpdate }
                    handleCreate={ handlePushProviderCreate }
                />
                <Show
                    when={ featureConfig?.notificationChannels?.scopes?.delete }
                >
                    <Divider hidden />
                    <DangerZoneGroup
                        sectionHeader={ t("pushProviders:dangerZoneGroup.header") }
                    >
                        <DangerZone
                            data-componentid={ `${componentId}-revert-push-provider-config` }
                            actionTitle={ t("pushProviders:dangerZoneGroup.revertConfig.actionTitle") }
                            header={ t("pushProviders:dangerZoneGroup.revertConfig.heading") }
                            subheader={ t("pushProviders:dangerZoneGroup.revertConfig.subHeading") }
                            onActionClick={ (): void => {
                                setOpenRevertConfigModal(true);
                            } }
                        />
                    </DangerZoneGroup>
                    <ConfirmationModal
                        primaryActionLoading={ isSubmitting }
                        data-componentid={ `${ componentId}-revert-confirmation-modal` }
                        onClose={ (): void => setOpenRevertConfigModal(false) }
                        type="negative"
                        open={ isOpenRevertConfigModal }
                        assertionHint={ t("pushProviders:modals.deleteConfirmation.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setOpenRevertConfigModal(false) }
                        onPrimaryActionClick={ (): void => {
                            setIsSubmitting(true);
                            handlePushProviderDelete();;
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${componentId}-revert-confirmation-modal-header` }
                        >
                            { t("pushProviders:modals.deleteConfirmation.heading") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${componentId}-revert-confirmation-modal-message` }
                        >
                            { t("pushProviders:modals.deleteConfirmation.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("pushProviders:modals.deleteConfirmation.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                </Show>
            </ExtensionTemplatesProvider>
        </PageLayout>
    );
};

export default PushProvidersPage;
