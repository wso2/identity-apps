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
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, CheckboxProps, Grid } from "semantic-ui-react";
import changeWebhookStatus from "../api/change-webhook-status";
import createWebhook from "../api/create-webhook";
import deleteWebhook from "../api/delete-webhook";
import updateWebhook from "../api/update-webhook";
import useGetDefaultEventProfile from "../api/use-get-default-event-profile";
import useGetWebhookById from "../api/use-get-webhook-by-id";
import WebhookConfigForm from "../components/webhook-config-form";
import { WebhooksConstants } from "../constants/webhooks-constants";
import { WebhookChannelConfigInterface } from "../models/event-profile";
import {
    WebhookConfigFormPropertyInterface,
    WebhookCreateRequestInterface,
    WebhookStatus,
    WebhookUpdateRequestInterface
} from "../models/webhooks";
import { useHandleWebhookError, useHandleWebhookSuccess } from "../utils/alert-utils";
import { mapEventProfileApiToUI } from "../utils/model-mapper-utils";
import "./webhook-edit-page.scss";

type WebhookEditPageInterface = IdentifiableComponentInterface;

const WebhookEditPage: FunctionComponent<WebhookEditPageInterface> = ({
    ["data-componentid"]: _componentId = "webhook-edit-page"
}: WebhookEditPageInterface): ReactElement => {
    const pathParts: string[] = history.location.pathname.split("/");
    const webhookId: string = pathParts[pathParts.length - 1];
    const isCreateMode: boolean = !webhookId || webhookId === "new" || webhookId === "";

    const [ isActive, setIsActive ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isStatusChanging, setIsStatusChanging ] = useState<boolean>(false);
    const [ isDeletingWebhook, setIsDeletingWebhook ] = useState<boolean>(false);

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    // Fetch webhook data
    const {
        data: webhook,
        isLoading: isWebhookLoading,
        error: webhookError,
        mutate: mutateWebhook
    } = useGetWebhookById(webhookId);

    // Fetch event profile to get available channels
    const {
        data: eventProfile,
        isLoading: isEventProfileLoading,
        error: eventProfileError
    } = useGetDefaultEventProfile();

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

    const handleSuccess: (action: string, data?: Record<string, unknown>) => void = useHandleWebhookSuccess();
    const handleError: (error: unknown, action: string) => void = useHandleWebhookError();

    useEffect(() => {
        if (webhook) {
            setIsActive(webhook.status === WebhooksConstants.ACTIVE_STATUS);
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

            initializeChannels((channelUri: string) => webhook.channelsSubscribed?.includes(channelUri) || false);

            return { ...formValues, channels: baseFormValues.channels };
        } else {
            initializeChannels(); // All channels default to false

            return baseFormValues;
        }
    }, [ webhook, isCreateMode, channelConfigs ]);

    /**
     * Maps form data to selected channel URIs
     */
    const mapFormDataToChannels = (formData: WebhookConfigFormPropertyInterface): string[] => {
        const selectedChannelUris: string[] = [];

        channelConfigs.forEach((config: { key: string; channelUri: string }) => {
            if (formData.channels[config.key]) {
                selectedChannelUris.push(config.channelUri);
            }
        });

        return selectedChannelUris;
    };

    /**
     * Handles webhook creation/update submission
     */
    const handleWebhookSubmit = (formData: WebhookConfigFormPropertyInterface): void => {
        const selectedChannelUris: string[] = mapFormDataToChannels(formData);

        if (isCreateMode) {
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
                .then(() => {
                    handleSuccess("createWebhook");
                    history.push(AppConstants.getPaths().get("WEBHOOKS"));
                })
                .catch((error: AxiosError) => {
                    handleError(error, "createWebhook");
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
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
    };

    /**
     * Handles webhook status toggle
     */
    const handleStatusToggle = (event: SyntheticEvent<Element, Event>, data: CheckboxProps): void => {
        const newStatus: boolean = !!data.checked;

        if (!isCreateMode && webhookId && webhook) {
            const action: "activate" | "deactivate" = newStatus ? "activate" : "deactivate";

            setIsStatusChanging(true);
            changeWebhookStatus(webhookId, action)
                .then(() => {
                    setIsActive(newStatus);
                    handleSuccess("updateWebhookStatus", { "status": newStatus ? "active" : "inactive" });
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
    };

    /**
     * Handles webhook deletion
     */
    const handleWebhookDelete = (): void => {
        setIsDeletingWebhook(true);
        deleteWebhook(webhookId)
            .then(() => {
                handleSuccess("deleteWebhook");
                history.push(AppConstants.getPaths().get("WEBHOOKS"));
            })
            .catch((error: AxiosError) => {
                handleError(error, "deleteWebhook");
            })
            .finally(() => {
                setIsDeletingWebhook(false);
                setShowDeleteConfirmationModal(false);
            });
    };

    /**
     * This renders the toggle button for webhook status.
     */
    const webhooksActivateDeactivateToggle = (): ReactElement => {
        return (
            <Checkbox
                label={ isActive ? t("webhooks:common.status.active") : t("webhooks:common.status.inactive") }
                toggle
                onChange={ handleStatusToggle }
                checked={ isActive }
                readOnly={ isStatusChanging && !isCreateMode }
                disabled={ isStatusChanging && !isCreateMode }
            />
        );
    };

    /**
     * Resolves the subheading for the webhook page based on create/edit mode.
     */
    const resolveWebhookSubheading = (): ReactNode => {
        return (
            <>
                { isCreateMode ? t("webhooks:pages.create.subHeading") : t("webhooks:pages.edit.subHeading") }
                <DocumentationLink link={ getLink("develop.webhooks.learnMore") } showEmptyLink={ false }>
                    { t("common:learnMore") }
                </DocumentationLink>
            </>
        );
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("WEBHOOKS"));
    };

    const isLoading: boolean = isWebhookLoading || isEventProfileLoading;

    return (
        <PageLayout
            title={ isCreateMode ? t("webhooks:pages.create.heading") : t("webhooks:pages.edit.heading") }
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
            { webhooksActivateDeactivateToggle() }
            <Grid className="grid-form">
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <WebhookConfigForm
                            initialValues={ webhookInitialValues }
                            channelConfigs={ channelConfigs }
                            isLoading={ isLoading }
                            isReadOnly={ false }
                            isCreateFormState={ isCreateMode }
                            onSubmit={ handleWebhookSubmit }
                            isSubmitting={ isSubmitting || isDeletingWebhook }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { !isWebhookLoading && !isCreateMode && !isEmpty(webhook) && (
                <Show>
                    <DangerZoneGroup sectionHeader={ t("webhooks:dangerZone.heading") }>
                        <DangerZone
                            data-componentid={ `${_componentId}-danger-zone` }
                            actionTitle={ t("webhooks:dangerZone.delete.actionTitle") }
                            header={ t("webhooks:dangerZone.delete.heading") }
                            subheader={ t("webhooks:dangerZone.delete.subHeading") }
                            onActionClick={ (): void => {
                                setShowDeleteConfirmationModal(true);
                            } }
                        />
                    </DangerZoneGroup>
                    <ConfirmationModal
                        primaryActionLoading={ isDeletingWebhook }
                        data-componentid={ `${_componentId}-delete-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("webhooks:confirmations.delete.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => {
                            handleWebhookDelete();
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${_componentId}-delete-confirmation-modal-header` }
                        >
                            { t("webhooks:confirmations.delete.heading") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentid={ `${_componentId}-delete-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { t("webhooks:confirmations.delete.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${_componentId}-delete-confirmation-modal-content` }
                        >
                            { t("webhooks:confirmations.delete.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                </Show>
            ) }
        </PageLayout>
    );
};

export default WebhookEditPage;
