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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Divider from "@oxygen-ui/react/Divider";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Paper from "@oxygen-ui/react/Paper";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    PageLayout
} from "@wso2is/react-components";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { createMoesifPublisher } from "../api/create-moesif-publisher";
import { deleteMoesifPublisher } from "../api/delete-moesif-publisher";
import { updateMoesifPublisher } from "../api/update-moesif-publisher";
import { useGetMoesifPublisher } from "../api/use-get-moesif-publisher";
import {
    MoesifEventPublisherKey,
    MoesifPublisherInterface,
    MoesifPublisherUpdateRequest
} from "../models/moesif-analytics";

const DEFAULT_PUBLISHER_ENABLEMENT: Record<string, boolean> = {
    [MoesifEventPublisherKey.AUTHENTICATION]: false,
    [MoesifEventPublisherKey.FLOW]: false,
    [MoesifEventPublisherKey.ORG_SWITCH]: false,
    [MoesifEventPublisherKey.REGISTRATION]: false,
    [MoesifEventPublisherKey.SESSION]: false,
    [MoesifEventPublisherKey.TOKEN]: false
};

interface PublisherConfigItem {
    key: MoesifEventPublisherKey;
    labelKey: string;
}

const PUBLISHER_CONFIG: PublisherConfigItem[] = [
    {
        key: MoesifEventPublisherKey.AUTHENTICATION,
        labelKey: "extensions:develop.moesifAnalytics.settingsPage.publishers.authentication"
    },
    {
        key: MoesifEventPublisherKey.REGISTRATION,
        labelKey: "extensions:develop.moesifAnalytics.settingsPage.publishers.registration"
    },
    {
        key: MoesifEventPublisherKey.FLOW,
        labelKey: "extensions:develop.moesifAnalytics.settingsPage.publishers.flow"
    },
    {
        key: MoesifEventPublisherKey.ORG_SWITCH,
        labelKey: "extensions:develop.moesifAnalytics.settingsPage.publishers.orgSwitch"
    },
    {
        key: MoesifEventPublisherKey.TOKEN,
        labelKey: "extensions:develop.moesifAnalytics.settingsPage.publishers.token"
    },
    {
        key: MoesifEventPublisherKey.SESSION,
        labelKey: "extensions:develop.moesifAnalytics.settingsPage.publishers.session"
    }
];

/**
 * Analytics settings page.
 *
 * Reachable as `/insights/settings`. Always renders the API key field, publisher
 * enablement toggles, and (when a publisher already exists) a danger-zone delete action.
 * When the host also exposes the Moesif dashboard, a back-button is shown so users can
 * return to the dashboard view.
 */
const AnalyticsSettingsPage: FunctionComponent = (): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const hasDashboardMode: boolean = useSelector((state: AppState) => {
        const extensions: Record<string, unknown> =
            (state?.config?.deployment?.extensions as Record<string, unknown>) ?? {};
        const analytics: Record<string, unknown> =
            (extensions?.analytics as Record<string, unknown>) ?? {};
        const moesif: Record<string, unknown> =
            (analytics?.moesif as Record<string, unknown>) ?? {};

        return !!(moesif?.dashboardEnabled) && !!(moesif?.embeddedPortalUrl);
    });

    const [ existingPublisher, setExistingPublisher ] = useState<MoesifPublisherInterface | null>(null);
    const [ apiKey, setApiKey ] = useState<string>("");
    const [ publisherEnablement, setPublisherEnablement ] =
        useState<Record<string, boolean>>(DEFAULT_PUBLISHER_ENABLEMENT);
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ showRevertConfirmationModal, setShowRevertConfirmationModal ] = useState<boolean>(false);

    // A 404 error means the publisher is not configured yet — defaults are kept in that case.
    const {
        data: moesifPublisher,
        isLoading,
        mutate: mutateMoesifPublisher
    }: RequestResultInterface<MoesifPublisherInterface, RequestErrorInterface> = useGetMoesifPublisher();

    useEffect(() => {
        if (!moesifPublisher) {
            return;
        }

        setExistingPublisher(moesifPublisher);
        setPublisherEnablement({
            ...DEFAULT_PUBLISHER_ENABLEMENT,
            ...(moesifPublisher.eventPublisherEnablement ?? {})
        });
    }, [ moesifPublisher ]);

    const handleToggle = (key: string): void => {
        setPublisherEnablement((prev: Record<string, boolean>) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async (): Promise<void> => {
        const trimmedApiKey: string = apiKey.trim();

        if (!existingPublisher && !trimmedApiKey) {
            return;
        }

        setIsSaving(true);

        try {
            let saved: MoesifPublisherInterface;

            if (existingPublisher) {
                const updateRequest: MoesifPublisherUpdateRequest = {
                    eventPublisherEnablement: publisherEnablement
                };

                if (trimmedApiKey) {
                    updateRequest.apiKeyValue = trimmedApiKey;
                }

                saved = await updateMoesifPublisher(updateRequest);
            } else {
                saved = await createMoesifPublisher({
                    apiKeyValue: trimmedApiKey,
                    eventPublisherEnablement: publisherEnablement
                });
            }

            setExistingPublisher(saved);
            setApiKey("");
            mutateMoesifPublisher();

            dispatch(addAlert({
                description: t(
                    "extensions:develop.moesifAnalytics.collectorKeySettings" +
                    ".notifications.updateSuccess.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "extensions:develop.moesifAnalytics.collectorKeySettings" +
                    ".notifications.updateSuccess.message"
                )
            }));
        } catch (_error: unknown) {
            dispatch(addAlert({
                description: t(
                    "extensions:develop.moesifAnalytics.collectorKeySettings" +
                    ".notifications.updateError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "extensions:develop.moesifAnalytics.collectorKeySettings" +
                    ".notifications.updateError.message"
                )
            }));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (): Promise<void> => {
        if (!existingPublisher) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteMoesifPublisher();

            setShowRevertConfirmationModal(false);
            setExistingPublisher(null);
            setApiKey("");
            setPublisherEnablement(DEFAULT_PUBLISHER_ENABLEMENT);
            // Clear the cached publisher without revalidating — the endpoint now responds with a 404.
            mutateMoesifPublisher(undefined, { revalidate: false });

            dispatch(addAlert({
                description: t(
                    "extensions:develop.moesifAnalytics.publisherSettings" +
                    ".notifications.deleteSuccess.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "extensions:develop.moesifAnalytics.publisherSettings" +
                    ".notifications.deleteSuccess.message"
                )
            }));
        } catch (_error: unknown) {
            dispatch(addAlert({
                description: t(
                    "extensions:develop.moesifAnalytics.publisherSettings" +
                    ".notifications.deleteError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "extensions:develop.moesifAnalytics.publisherSettings" +
                    ".notifications.deleteError.message"
                )
            }));
        } finally {
            setIsDeleting(false);
        }
    };

    const isBusy: boolean = isSaving || isDeleting;
    const isSaveDisabled: boolean = isBusy || (!existingPublisher && !apiKey.trim());
    const saveButtonLabel: string = existingPublisher
        ? t("common:update")
        : t("extensions:develop.moesifAnalytics.publisherSettings.enableButton");

    return (
        <PageLayout
            data-componentid="analytics-settings-page"
            pageTitle={ t("extensions:develop.moesifAnalytics.settingsPage.pageTitle") }
            title={ t("extensions:develop.moesifAnalytics.settingsPage.title") }
            description={ t("extensions:develop.moesifAnalytics.settingsPage.description") }
            backButton={ hasDashboardMode
                ? {
                    onClick: () => history.push(AppConstants.getPaths().get("INSIGHTS")),
                    text: t("insights:title")
                }
                : undefined
            }
        >
            { isLoading ? (
                <ContentLoader />
            ) : (
                <Paper
                    data-componentid="analytics-settings-form-container"
                    variant="outlined"
                    sx={ { p: 4 } }
                >
                    <Typography variant="subtitle2" gutterBottom>
                        { t("extensions:develop.moesifAnalytics.settingsPage.apiKeySection.heading") }
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
                        { t(
                            "extensions:develop.moesifAnalytics.settingsPage.apiKeySection.description"
                        ) }
                    </Typography>
                    <TextField
                        data-componentid="analytics-api-key-input"
                        fullWidth
                        required={ !existingPublisher }
                        aria-label={ t(
                            "extensions:develop.moesifAnalytics.settingsPage.apiKeySection.heading"
                        ) }
                        placeholder={
                            existingPublisher
                                ? t(
                                    "extensions:develop.moesifAnalytics.settingsPage" +
                                    ".apiKeySection.existingKeyHint"
                                )
                                : t(
                                    "extensions:develop.moesifAnalytics.collectorKeySettings" +
                                    ".keyField.placeholder"
                                )
                        }
                        type="password"
                        value={ apiKey }
                        onChange={ (e: ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value) }
                        disabled={ isBusy }
                        autoComplete="new-password"
                    />

                    <Divider sx={ { my: 3 } } />

                    <Typography variant="subtitle2" gutterBottom>
                        { t(
                            "extensions:develop.moesifAnalytics.settingsPage.publishersSection.heading"
                        ) }
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
                        { t(
                            "extensions:develop.moesifAnalytics.settingsPage.publishersSection.description"
                        ) }
                    </Typography>
                    <Box sx={ { display: "flex", flexDirection: "column" } }>
                        { PUBLISHER_CONFIG.map(({ key, labelKey }: PublisherConfigItem) => (
                            <FormControlLabel
                                key={ key }
                                control={
                                    <Checkbox
                                        data-componentid={ `analytics-publisher-${ key }` }
                                        checked={ !!publisherEnablement[key] }
                                        onChange={ () => handleToggle(key) }
                                        disabled={ isBusy }
                                    />
                                }
                                label={ t(labelKey) }
                            />
                        )) }
                    </Box>

                    <Box sx={ { display: "flex", justifyContent: "flex-end", mt: 3 } }>
                        <Button
                            data-componentid="analytics-settings-save-btn"
                            variant="contained"
                            onClick={ handleSave }
                            disabled={ isSaveDisabled }
                            startIcon={ isSaving ? <CircularProgress size={ 16 } /> : null }
                        >
                            { saveButtonLabel }
                        </Button>
                    </Box>
                </Paper>
            ) }

            { !isLoading && existingPublisher && (
                <Box sx={ { mt: 4 } }>
                    <DangerZoneGroup
                        sectionHeader={ t(
                            "extensions:develop.moesifAnalytics.publisherSettings.dangerZone.sectionHeader"
                        ) }
                    >
                        <DangerZone
                            data-componentid="analytics-settings-danger-zone"
                            actionTitle={ t(
                                "extensions:develop.moesifAnalytics.publisherSettings.dangerZone.deleteButton"
                            ) }
                            header={ t(
                                "extensions:develop.moesifAnalytics.publisherSettings.dangerZone.heading"
                            ) }
                            subheader={ t(
                                "extensions:develop.moesifAnalytics.publisherSettings.dangerZone.description"
                            ) }
                            isButtonDisabled={ isBusy }
                            onActionClick={ (): void => setShowRevertConfirmationModal(true) }
                        />
                    </DangerZoneGroup>
                </Box>
            ) }

            { existingPublisher && (
                <ConfirmationModal
                    data-componentid="analytics-settings-revert-confirmation-modal"
                    onClose={ (): void => setShowRevertConfirmationModal(false) }
                    type="negative"
                    open={ showRevertConfirmationModal }
                    assertionHint={ t(
                        "extensions:develop.moesifAnalytics.publisherSettings.dangerZone.confirmation.assertionHint"
                    ) }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowRevertConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => { handleDelete(); } }
                    closeOnDimmerClick={ false }
                    primaryActionLoading={ isDeleting }
                >
                    <ConfirmationModal.Header
                        data-componentid="analytics-settings-revert-confirmation-modal-header"
                    >
                        { t(
                            "extensions:develop.moesifAnalytics.publisherSettings.dangerZone.confirmation.header"
                        ) }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid="analytics-settings-revert-confirmation-modal-message"
                    >
                        { t(
                            "extensions:develop.moesifAnalytics.publisherSettings.dangerZone.confirmation.message"
                        ) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid="analytics-settings-revert-confirmation-modal-content"
                    >
                        { t(
                            "extensions:develop.moesifAnalytics.publisherSettings.dangerZone.confirmation.content"
                        ) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </PageLayout>
    );
};

export default AnalyticsSettingsPage;
