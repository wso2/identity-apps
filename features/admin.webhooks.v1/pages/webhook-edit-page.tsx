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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Checkbox, CheckboxProps, Grid } from "semantic-ui-react";
import changeWebhookStatus from "../api/change-webhook-status";
import createWebhook from "../api/create-webhook";
import deleteWebhook from "../api/delete-webhook";
import { retrySubscriptionOrUnsubscription } from "../api/retry-webhook";
import updateWebhook from "../api/update-webhook";
import useGetDefaultEventProfile from "../api/use-get-default-event-profile";
import useGetWebhookById from "../api/use-get-webhook-by-id";
import useGetWebhooksMetadata from "../api/use-get-webhooks-metadata";
import WebhookConfigForm from "../components/webhook-config-form";
import useWebhookNavigation from "../hooks/use-webhook-navigation";
import { WebhookChannelConfigInterface } from "../models/event-profile";
import {
    WebhookChannelSubscriptionInterface,
    WebhookConfigFormPropertyInterface,
    WebhookCreateRequestInterface,
    WebhookResponseInterface,
    WebhookStatus,
    WebhookUpdateRequestInterface
} from "../models/webhooks";
import { AdapterUtils } from "../utils/adapter-utils";
import { useHandleWebhookError, useHandleWebhookSuccess } from "../utils/alert-utils";
import { mapEventProfileApiToUI, mapFormDataToChannels } from "../utils/model-mapper-utils";

import "./webhook-edit-page.scss";

type WebhookEditPageInterface = IdentifiableComponentInterface;

interface WebhookStatusAlert {
    message: string;
    severity: "warning" | "success";
    title: string;
}

const WebhookEditPage: FunctionComponent<WebhookEditPageInterface> = ({
    ["data-componentid"]: _componentId = "webhook-edit-page"
}: WebhookEditPageInterface): ReactElement => {
    // Selectors and hooks
    const webhooksFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.webhooks
    );
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const { navigateToWebhookEditById, navigateToWebhooksList } = useWebhookNavigation();

    // Permission checks
    const hasWebhookUpdatePermissions: boolean = useRequiredScopes(webhooksFeatureConfig?.scopes?.update);
    const hasWebhookCreatePermissions: boolean = useRequiredScopes(webhooksFeatureConfig?.scopes?.create);
    const hasWebhookDeletePermissions: boolean = useRequiredScopes(webhooksFeatureConfig?.scopes?.delete);

    // Extract webhook ID from URL
    const webhookId: string = useMemo(() => {
        const pathParts: string[] = history.location.pathname.split("/");

        return pathParts[pathParts.length - 1];
    }, [ history.location.pathname ]);

    const isCreateMode: boolean = !webhookId || webhookId === "new" || webhookId === "";

    // State management
    const [ isActive, setIsActive ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isStatusChanging, setIsStatusChanging ] = useState<boolean>(false);
    const [ isDeletingWebhook, setIsDeletingWebhook ] = useState<boolean>(false);
    const [ isRetrying, setIsRetrying ] = useState<boolean>(false);

    // API hooks
    const {
        data: webhook,
        isLoading: isWebhookLoading,
        error: webhookError,
        mutate: mutateWebhook
    } = useGetWebhookById(webhookId);

    const {
        data: eventProfile,
        isLoading: isEventProfileLoading,
        error: eventProfileError
    } = useGetDefaultEventProfile();

    const {
        data: webhooksMetadata,
        isLoading: isWebhooksMetadataLoading,
        error: webhooksMetadataError
    } = useGetWebhooksMetadata();

    // Alert handlers
    const handleSuccess: ReturnType<typeof useHandleWebhookSuccess> = useHandleWebhookSuccess();
    const handleError: ReturnType<typeof useHandleWebhookError> = useHandleWebhookError();

    // Computed values
    const isLoading: boolean = isWebhookLoading || isEventProfileLoading || isWebhooksMetadataLoading;

    const channelConfigs: WebhookChannelConfigInterface[] = useMemo(() => {
        return eventProfile
            ? mapEventProfileApiToUI(eventProfile).map((config: any) => ({
                channelUri: config.channelUri,
                description: config.description ?? "",
                key: config.key,
                name: config.name ?? ""
            }))
            : [];
    }, [ eventProfile ]);

    const webhookInitialValues: WebhookConfigFormPropertyInterface = useMemo(() => {
        const baseFormValues: WebhookConfigFormPropertyInterface = {
            channels: {},
            endpoint: "",
            id: "",
            name: "",
            secret: ""
        };

        if (channelConfigs.length === 0) {
            return baseFormValues;
        }

        const initializeChannels = (isSubscribed: (channelUri: string) => boolean = () => false) => {
            channelConfigs.forEach((config: { key: string; channelUri: string }) => {
                baseFormValues.channels[config.key] = isSubscribed(config.channelUri);
            });
        };

        if (webhook && !isCreateMode) {
            const formValues: WebhookConfigFormPropertyInterface = {
                ...baseFormValues,
                endpoint: webhook.endpoint,
                id: webhook.id,
                name: webhook.name,
                secret: webhook.secret || ""
            };

            initializeChannels(
                (channelUri: string) =>
                    webhook.channelsSubscribed?.some(
                        (sub: WebhookChannelSubscriptionInterface) => sub.channelUri === channelUri
                    ) || false
            );

            return { ...formValues, channels: baseFormValues.channels };
        } else {
            initializeChannels();

            return baseFormValues;
        }
    }, [ webhook, isCreateMode, channelConfigs ]);

    // Helper functions
    const isWebSubHubAdapterMode: () => boolean = useCallback((): boolean => {
        if (!webhooksMetadata?.adapter) {
            return false;
        }

        return AdapterUtils.isWebSubHub(webhooksMetadata.adapter);
    }, [ webhooksMetadata ]);

    const isFormReadOnly: () => boolean = useCallback((): boolean => {
        if (isCreateMode) {
            return !hasWebhookCreatePermissions;
        }

        // For WebSubHub adapter, form fields are always read-only in edit mode
        if (isWebSubHubAdapterMode()) {
            return true;
        }

        return !hasWebhookUpdatePermissions;
    }, [ isCreateMode, hasWebhookCreatePermissions, hasWebhookUpdatePermissions, isWebSubHubAdapterMode ]);

    const canPerformStatusActions: () => boolean = useCallback((): boolean => {
        return !isCreateMode && hasWebhookUpdatePermissions;
    }, [ isCreateMode, hasWebhookUpdatePermissions ]);

    const shouldShowDeleteSection: () => boolean = useCallback((): boolean => {
        if (isLoading || isCreateMode || isEmpty(webhook)) {
            return false;
        }

        if (!hasWebhookDeletePermissions) {
            return false;
        }

        return true;
    }, [ isLoading, isCreateMode, webhook, hasWebhookDeletePermissions ]);

    const isDeleteActionDisabled: () => boolean = useCallback((): boolean => {
        if (isWebSubHubAdapterMode() && webhook) {
            return webhook.status === WebhookStatus.ACTIVE || webhook.status === WebhookStatus.PARTIALLY_ACTIVE;
        }

        return false;
    }, [ isWebSubHubAdapterMode, webhook ]);

    // Effects
    useEffect(() => {
        if (webhook) {
            if (webhook.status === WebhookStatus.ACTIVE || webhook.status === WebhookStatus.PARTIALLY_ACTIVE) {
                setIsActive(true);
            } else if (
                webhook.status === WebhookStatus.INACTIVE ||
                webhook.status === WebhookStatus.PARTIALLY_INACTIVE
            ) {
                setIsActive(false);
            }
        }
    }, [ webhook ]);

    useEffect(() => {
        if (webhookError) {
            handleError(webhookError, "fetchWebhook");
        }
    }, [ webhookError, handleError ]);

    useEffect(() => {
        if (eventProfileError) {
            handleError(eventProfileError, "fetchEventProfile");
        }
    }, [ eventProfileError, handleError ]);

    useEffect(() => {
        if (webhooksMetadataError) {
            handleError(webhooksMetadataError, "fetchWebhooksMetadata");
        }
    }, [ webhooksMetadataError, handleError ]);

    // Event handlers
    const handleWebhookSubmit: (formData: WebhookConfigFormPropertyInterface) => void = useCallback(
        (formData: WebhookConfigFormPropertyInterface): void => {
            const selectedChannelUris: string[] = mapFormDataToChannels(formData, channelConfigs);

            if (isCreateMode) {
                if (!hasWebhookCreatePermissions) return;

                const webhookCreatePayload: WebhookCreateRequestInterface = {
                    channelsSubscribed: selectedChannelUris,
                    endpoint: formData.endpoint || "",
                    eventProfile: {
                        name: eventProfile.profile,
                        uri: eventProfile.uri
                    },
                    name: formData.name,
                    secret: formData.secret,
                    status: isActive ? WebhookStatus.ACTIVE : WebhookStatus.INACTIVE
                };

                setIsSubmitting(true);
                createWebhook(webhookCreatePayload)
                    .then((response: WebhookResponseInterface) => {
                        handleSuccess("createWebhook");
                        navigateToWebhookEditById(response.id);
                    })
                    .catch((error: AxiosError) => {
                        handleError(error, "createWebhook");
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            } else {
                if (!hasWebhookUpdatePermissions) return;

                const webhookUpdatePayload: WebhookUpdateRequestInterface = {
                    channelsSubscribed: selectedChannelUris,
                    endpoint: formData.endpoint || "",
                    eventProfile: {
                        name: eventProfile.profile,
                        uri: eventProfile.uri
                    },
                    name: formData.name,
                    status: isActive ? WebhookStatus.ACTIVE : WebhookStatus.INACTIVE
                };

                // Only include secret if it has a value (user is updating it)
                if (formData.secret && formData.secret.trim() !== "") {
                    webhookUpdatePayload.secret = formData.secret;
                }

                setIsSubmitting(true);
                updateWebhook(webhookId, webhookUpdatePayload)
                    .then(() => {
                        handleSuccess("updateWebhook");
                        mutateWebhook();
                    })
                    .catch((error: AxiosError) => {
                        handleError(error, "updateWebhook");
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            }
        },
        [
            channelConfigs,
            isCreateMode,
            hasWebhookCreatePermissions,
            hasWebhookUpdatePermissions,
            eventProfile,
            isActive,
            webhookId,
            handleSuccess,
            handleError,
            mutateWebhook,
            navigateToWebhookEditById
        ]
    );

    const handleStatusToggle: (event: SyntheticEvent<Element, Event>, data: CheckboxProps) => void = useCallback(
        (event: SyntheticEvent<Element, Event>, data: CheckboxProps): void => {
            if (!hasWebhookUpdatePermissions && !isCreateMode) return;

            const newStatus: boolean = !!data.checked;

            if (!isCreateMode && webhookId && webhook) {
                const action: "activate" | "deactivate" = newStatus ? "activate" : "deactivate";

                setIsStatusChanging(true);
                changeWebhookStatus(webhookId, action)
                    .then(() => {
                        setIsActive(newStatus);
                        handleSuccess("updateWebhookStatus", { status: newStatus ? "active" : "inactive" });
                        mutateWebhook();
                    })
                    .catch((error: AxiosError) => {
                        setIsActive(!newStatus);
                        handleError(error, "updateWebhookStatus");
                    })
                    .finally(() => {
                        setIsStatusChanging(false);
                    });
            } else {
                setIsActive(newStatus);
            }
        },
        [ hasWebhookUpdatePermissions, isCreateMode, webhookId, webhook, handleSuccess, handleError, mutateWebhook ]
    );

    const handleRetry: () => void = useCallback((): void => {
        if (!webhookId || !webhook || !hasWebhookUpdatePermissions) return;

        const requestType: "subscription" | "unsubscription" =
            webhook.status === WebhookStatus.PARTIALLY_ACTIVE ? "subscription" : "unsubscription";

        setIsRetrying(true);
        retrySubscriptionOrUnsubscription(webhookId)
            .then(() => {
                handleSuccess("retryWebhookState", { requestType });
                mutateWebhook();
            })
            .catch((error: AxiosError) => {
                handleError(error, "retryWebhookState");
            })
            .finally(() => {
                setIsRetrying(false);
            });
    }, [ webhookId, webhook, hasWebhookUpdatePermissions, handleSuccess, handleError, mutateWebhook ]);

    const handleWebhookDelete: () => void = useCallback((): void => {
        if (!hasWebhookDeletePermissions) return;

        setIsDeletingWebhook(true);
        deleteWebhook(webhookId)
            .then(() => {
                handleSuccess("deleteWebhook");
                navigateToWebhooksList();
            })
            .catch((error: AxiosError) => {
                handleError(error, "deleteWebhook");
            })
            .finally(() => {
                setIsDeletingWebhook(false);
                setShowDeleteConfirmationModal(false);
            });
    }, [ hasWebhookDeletePermissions, webhookId, handleSuccess, handleError, navigateToWebhooksList ]);

    const handleBackButtonClick: () => void = useCallback((): void => {
        navigateToWebhooksList();
    }, [ navigateToWebhooksList ]);

    // Render helpers
    const getWebhookStatusAlert: () => WebhookStatusAlert | null = useCallback((): WebhookStatusAlert | null => {
        if (!webhook) return null;

        switch (webhook.status) {
            case WebhookStatus.PARTIALLY_ACTIVE:
                return {
                    message: t("webhooks:statusBanner.pendingActivation.message"),
                    severity: "warning",
                    title: t("webhooks:statusBanner.pendingActivation.title")
                };
            case WebhookStatus.PARTIALLY_INACTIVE:
                return {
                    message: t("webhooks:statusBanner.pendingDeactivation.message"),
                    severity: "warning",
                    title: t("webhooks:statusBanner.pendingDeactivation.title")
                };
            default:
                return null;
        }
    }, [ webhook, t ]);

    const renderActionButtons: () => ReactElement | null = useCallback((): ReactElement | null => {
        if (!webhook) return null;

        const canRetry: boolean =
            webhook.status === WebhookStatus.PARTIALLY_ACTIVE || webhook.status === WebhookStatus.PARTIALLY_INACTIVE;

        if (!canRetry) return null;

        return (
            <Box sx={ { display: "flex", gap: 1, mt: 2 } }>
                <Button
                    onClick={ handleRetry }
                    variant="outlined"
                    className="button-container"
                    data-componentid={ `${_componentId}-retry-button` }
                    disabled={ !canPerformStatusActions() || isRetrying }
                    loading={ isRetrying }
                >
                    { t("webhooks:statusBanner.buttons.retry") }
                </Button>
            </Box>
        );
    }, [ webhook, handleRetry, canPerformStatusActions, isRetrying, t, _componentId ]);

    const renderWebhookStatusToggle: () => ReactElement = useCallback((): ReactElement => {
        return (
            <Checkbox
                label={ isActive ? t("webhooks:common.status.active") : t("webhooks:common.status.inactive") }
                toggle
                onChange={ handleStatusToggle }
                checked={ isActive }
                readOnly={ !hasWebhookUpdatePermissions || (isStatusChanging && !isCreateMode) }
                disabled={ !hasWebhookUpdatePermissions || (isStatusChanging && !isCreateMode) }
                data-componentId={ `${_componentId}-webhook-enable-toggle` }
            />
        );
    }, [ isActive, handleStatusToggle, hasWebhookUpdatePermissions, isStatusChanging, isCreateMode, t, _componentId ]);

    const renderWebhookStatusSection: () => ReactElement | null = useCallback((): ReactElement | null => {
        const statusToggle: ReactElement = renderWebhookStatusToggle();

        if (isCreateMode || !isWebSubHubAdapterMode()) {
            return statusToggle;
        }

        if (!webhook) return statusToggle;

        const statusAlert: WebhookStatusAlert | null = getWebhookStatusAlert();
        const showStatusAlert: boolean =
            webhook.status === WebhookStatus.PARTIALLY_ACTIVE || webhook.status === WebhookStatus.PARTIALLY_INACTIVE;

        return (
            <Box sx={ { mb: 3 } } className="webhook-status-section">
                <Box sx={ { mb: showStatusAlert ? 2 : 0 } }>{ statusToggle }</Box>

                { !isLoading && statusAlert && showStatusAlert && (
                    <Alert severity={ statusAlert.severity } sx={ { mb: 2 } } icon={ false }>
                        <AlertTitle>{ statusAlert.title }</AlertTitle>
                        { statusAlert.message }
                        { renderActionButtons() }
                    </Alert>
                ) }
            </Box>
        );
    }, [
        isCreateMode,
        isWebSubHubAdapterMode,
        webhook,
        isLoading,
        getWebhookStatusAlert,
        renderWebhookStatusToggle,
        renderActionButtons
    ]);

    const resolveWebhookHeading: () => ReactNode = useCallback((): ReactNode => {
        const headingKey: string = isCreateMode
            ? "webhooks:pages.create.heading"
            : isWebSubHubAdapterMode()
                ? "webhooks:pages.edit.headingWebSubHubMode"
                : "webhooks:pages.edit.heading";

        return (
            <>
                { t(headingKey) }
            </>
        );
    }, [ isCreateMode, isWebSubHubAdapterMode, t, getLink ]);

    const resolveWebhookSubheading: () => ReactNode = useCallback((): ReactNode => {
        const subheadingKey: string = isCreateMode
            ? "webhooks:pages.create.subHeading"
            : isWebSubHubAdapterMode()
                ? "webhooks:pages.edit.subHeadingWebSubHubMode"
                : "webhooks:pages.edit.subHeading";

        return (
            <>
                { t(subheadingKey) }
                <DocumentationLink link={ getLink("develop.webhooks.learnMore") } showEmptyLink={ false }>
                    { t("common:learnMore") }
                </DocumentationLink>
            </>
        );
    }, [ isCreateMode, isWebSubHubAdapterMode, t, getLink ]);

    const renderDeleteSection: () => ReactElement | null = useCallback((): ReactElement | null => {
        if (!shouldShowDeleteSection()) return null;

        return (
            <>
                <DangerZoneGroup sectionHeader={ t("webhooks:dangerZone.heading") }>
                    <DangerZone
                        data-componentid={ `${_componentId}-danger-zone` }
                        actionTitle={ t("webhooks:dangerZone.delete.actionTitle") }
                        header={ t("webhooks:dangerZone.delete.heading") }
                        subheader={ t("webhooks:dangerZone.delete.subHeading") }
                        isButtonDisabled={ isDeleteActionDisabled() }
                        onActionClick={ () => {
                            if (hasWebhookDeletePermissions && !isDeleteActionDisabled()) {
                                setShowDeleteConfirmationModal(true);
                            }
                        } }
                    />
                </DangerZoneGroup>
                <ConfirmationModal
                    primaryActionLoading={ isDeletingWebhook }
                    data-componentid={ `${_componentId}-delete-confirmation-modal` }
                    onClose={ () => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t("webhooks:confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ () => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ handleWebhookDelete }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${_componentId}-delete-confirmation-modal-header` }>
                        { t("webhooks:confirmations.delete.heading") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        data-componentid={ `${_componentId}-delete-confirmation-modal-message` }
                        attached
                        negative
                    >
                        { t("webhooks:confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${_componentId}-delete-confirmation-modal-content` }>
                        { t("webhooks:confirmations.delete.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            </>
        );
    }, [
        shouldShowDeleteSection,
        t,
        _componentId,
        hasWebhookDeletePermissions,
        isDeletingWebhook,
        showDeleteConfirmationModal,
        handleWebhookDelete,
        isDeleteActionDisabled
    ]);

    return (
        <PageLayout
            title={ resolveWebhookHeading() }
            description={ resolveWebhookSubheading() }
            backButton={ {
                "data-componentid": `${_componentId}-webhooks-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("webhooks:goBackToWebhooks")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            data-componentid={ `${_componentId}-webhooks-page-layout` }
        >
            { renderWebhookStatusSection() }

            <Grid className="grid-form">
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <WebhookConfigForm
                            initialValues={ webhookInitialValues }
                            channelConfigs={ channelConfigs }
                            channelSubscriptions={ webhook?.channelsSubscribed || [] }
                            isLoading={ isLoading }
                            isReadOnly={ isFormReadOnly() }
                            isCreateFormState={ isCreateMode }
                            onSubmit={ handleWebhookSubmit }
                            isSubmitting={ isSubmitting || isDeletingWebhook }
                            hideSubmitButton={ isWebSubHubAdapterMode() && !isCreateMode }
                            isWebSubHubAdopterMode={ isWebSubHubAdapterMode() }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            { renderDeleteSection() }
        </PageLayout>
    );
};

export default WebhookEditPage;
