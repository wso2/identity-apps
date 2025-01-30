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

import { useAuthContext } from "@asgardeo/auth-react";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal } from "@wso2is/react-components";
import React, { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import deleteTenantMetadata from "../api/delete-tenant-metadata";
import updateTenantActivationStatus from "../api/update-tenant-activation-status";
import useGetTenants from "../api/use-get-tenants";
import TenantContext from "../context/tenant-context";
import { Tenant, TenantLifecycleStatus } from "../models/tenants";

/**
 * Props interface of {@link TenantProvider}
 */
export interface TenantProviderProps {
    /**
     * Callback to be fired on successful tenant deletion.
     */
    onTenantDeleteSuccess?: () => void;
    /**
     * Callback to be fired on un-successful tenant deletion.
     */
    onTenantDeleteError?: () => void;
    /**
     * Callback to be fired on successful tenant disable.
     */
    onTenantDisableSuccess?: () => void;
    /**
     * Callback to be fired on un-successful tenant disable.
     */
    onTenantDisableError?: () => void;
    /**
     * Callback to be fired on successful tenant enable.
     */
    onTenantEnableSuccess?: () => void;
    /**
     * Callback to be fired on un-successful tenant enable.
     */
    onTenantEnableError?: () => void;
}

/**
 * This component provides tenant-related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The TenantProvider component.
 */
const TenantProvider = ({
    children,
    onTenantDeleteError,
    onTenantDeleteSuccess,
    onTenantDisableError,
    onTenantDisableSuccess,
    onTenantEnableError,
    onTenantEnableSuccess
}: PropsWithChildren<TenantProviderProps>): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { updateConfig } = useAuthContext();

    const clientHost: string = useSelector((state: AppState) => state.config?.deployment?.clientHost);

    const [ isInitialRenderingComplete, setIsInitialRenderingComplete ] = useState<boolean>(false);
    const [ tenantListLimit, setTenantListLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showDisableConfirmationModal, setShowDisableConfirmationModal ] = useState<boolean>(false);
    const [ showTenantConsoleNavigationConfirmationModal, setShowTenantConsoleNavigationConfirmationModal ] = useState<
        boolean
    >(false);
    const [ deletingTenant, setDeletingTenant ] = useState<Tenant>(null);
    const [ disablingTenant, setDisablingTenant ] = useState<Tenant>(null);
    const [ consoleNavigatingTenant, setConsoleNavigatingTenant ] = useState<Tenant>(null);
    const [ isTenantDeleteRequestLoading, setIsTenantDeleteRequestLoading ] = useState<boolean>(false);
    const [ isTenantStatusUpdateRequestLoading, setIsTenantStatusUpdateRequestLoading ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ searchQueryClearTrigger, setSearchQueryClearTrigger ] = useState<boolean>(false);

    const { data: tenantList, isLoading: isTenantListLoading, mutate: mutateTenantList } = useGetTenants({
        filter: searchQuery,
        limit: tenantListLimit,
        offset: 0,
        sortBy: "domainName",
        sortOrder: "asc"
    });

    useEffect(() => {
        if (tenantList && tenantList?.tenants?.length > 0) {
            setIsInitialRenderingComplete(true);
        }
    }, [ tenantList ]);

    /**
     * Handles the tenant deletion after the user confirms the action.
     * @param tenant - Tenant to be deleted.
     */
    const handleTenantDeletionConfirmation = (tenant: Tenant): void => {
        setIsTenantDeleteRequestLoading(true);

        deleteTenantMetadata(tenant.id)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:editTenant.notifications.deleteTenantMeta.success.description", {
                            tenantDomain: tenant.domain
                        }),
                        level: AlertLevels.SUCCESS,
                        message: t("tenants:editTenant.notifications.deleteTenantMeta.success.message")
                    })
                );

                mutateTenantList();
                onTenantDeleteSuccess && onTenantDeleteSuccess();
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:editTenant.notifications.deleteTenantMeta.error.description", {
                            tenantDomain: tenant.domain
                        }),
                        level: AlertLevels.ERROR,
                        message: t("tenants:editTenant.notifications.deleteTenantMeta.error.message")
                    })
                );

                onTenantDeleteError && onTenantDeleteError();
            })
            .finally(() => {
                setShowDeleteConfirmationModal(false);
                setIsTenantDeleteRequestLoading(false);
            });
    };

    /**
     * Handles the tenant status update after the user confirms the action.
     * @param tenant - Tenant to be enabled/disabled.
     */
    const handleTenantStatusUpdateConfirmation = (tenant: Tenant): void => {
        setIsTenantStatusUpdateRequestLoading(true);

        const newLifecycleStatus: TenantLifecycleStatus = {
            activated: !tenant?.lifecycleStatus?.activated
        };

        updateTenantActivationStatus(tenant.id, newLifecycleStatus)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:editTenant.notifications.updateTenantStatus.success.description", {
                            operation: newLifecycleStatus.activated ? t("common:enabled") : t("common:disabled"),
                            tenantDomain: tenant.domain
                        }),
                        level: AlertLevels.SUCCESS,
                        message: t("tenants:editTenant.notifications.updateTenantStatus.success.message", {
                            operation: newLifecycleStatus.activated ? t("common:enabled") : t("common:disabled")
                        })
                    })
                );

                mutateTenantList();

                if (newLifecycleStatus.activated) {
                    onTenantEnableSuccess && onTenantEnableSuccess();
                } else {
                    onTenantDisableSuccess && onTenantDisableSuccess();
                }
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:editTenant.notifications.updateTenantStatus.error.description", {
                            operation: newLifecycleStatus.activated ? t("common:enable") : t("common:disable"),
                            tenantDomain: tenant.domain
                        }),
                        level: AlertLevels.ERROR,
                        message: t("tenants:editTenant.notifications.updateTenantStatus.error.message", {
                            operation: newLifecycleStatus.activated ? t("common:enable") : t("common:disable")
                        })
                    })
                );

                if (newLifecycleStatus.activated) {
                    onTenantEnableError && onTenantEnableError();
                } else {
                    onTenantDisableError && onTenantDisableError();
                }
            })
            .finally(() => {
                setShowDisableConfirmationModal(false);
                setIsTenantStatusUpdateRequestLoading(false);
            });
    };

    /**
     * Handles the tenant console navigation after the user confirms the action.
     * @param tenant - Tenant to navigate to.
     */
    const handleTenantConsoleNavigation = async (tenant: Tenant): Promise<void> => {
        const consoleURL: string = clientHost.replace(/\/t\/[^/]+\//, `/t/${tenant.domain}/`);

        setShowTenantConsoleNavigationConfirmationModal(false);

        await updateConfig({
            signOutRedirectURL: consoleURL
        });

        history.push(AppConstants.getAppLogoutPath());
    };

    return (
        <TenantContext.Provider
            value={ {
                deleteTenant: (tenant: Tenant): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingTenant(tenant);
                },
                disableTenant: (tenant: Tenant): void => {
                    setShowDisableConfirmationModal(true);
                    setDisablingTenant(tenant);
                },
                enableTenant: (tenant: Tenant): void => {
                    handleTenantStatusUpdateConfirmation(tenant);
                },
                isInitialRenderingComplete,
                isTenantListLoading,
                mutateTenantList,
                navigateToTenantConsole: (tenant: Tenant): void => {
                    setShowTenantConsoleNavigationConfirmationModal(true);
                    setConsoleNavigatingTenant(tenant);
                },
                searchQuery,
                searchQueryClearTrigger,
                setSearchQuery,
                setSearchQueryClearTrigger,
                setTenantListLimit,
                tenantList,
                tenantListLimit
            } }
        >
            { children }
            { showDeleteConfirmationModal && (
                <ConfirmationModal
                    primaryActionLoading={ isTenantDeleteRequestLoading }
                    data-componentid="tenant-delete-confirmation-modal"
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t("tenants:confirmationModals.deleteTenant.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("tenants:confirmationModals.deleteTenant.primaryAction") }
                    secondaryAction={ t("tenants:confirmationModals.deleteTenant.secondaryAction") }
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => handleTenantDeletionConfirmation(deletingTenant) }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid="tenant-delete-confirmation-modal-header">
                        { t("tenants:confirmationModals.deleteTenant.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid="tenant-delete-confirmation-modal-message"
                    >
                        { t("tenants:confirmationModals.deleteTenant.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid="tenant-delete-confirmation-modal-content">
                        { t("tenants:confirmationModals.deleteTenant.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { showDisableConfirmationModal && (
                <ConfirmationModal
                    primaryActionLoading={ isTenantStatusUpdateRequestLoading }
                    data-componentid="tenant-disable-confirmation-modal"
                    onClose={ (): void => setShowDisableConfirmationModal(false) }
                    type="negative"
                    open={ showDisableConfirmationModal }
                    assertionHint={ t("tenants:confirmationModals.disableTenant.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("tenants:confirmationModals.disableTenant.primaryAction") }
                    secondaryAction={ t("tenants:confirmationModals.disableTenant.secondaryAction") }
                    onSecondaryActionClick={ (): void => setShowDisableConfirmationModal(false) }
                    onPrimaryActionClick={ async () => await handleTenantStatusUpdateConfirmation(disablingTenant) }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid="tenant-disable-confirmation-modal-header">
                        { t("tenants:confirmationModals.disableTenant.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid="tenant-disable-confirmation-modal-message"
                    >
                        { t("tenants:confirmationModals.disableTenant.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid="tenant-disable-confirmation-modal-content">
                        { t("tenants:confirmationModals.disableTenant.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { showTenantConsoleNavigationConfirmationModal && (
                <ConfirmationModal
                    data-componentid="tenant-console-navigation-confirmation-modal"
                    onClose={ (): void => setShowTenantConsoleNavigationConfirmationModal(false) }
                    type="warning"
                    open={ showTenantConsoleNavigationConfirmationModal }
                    assertionHint={ t("tenants:confirmationModals.navigatingToTenantConsole.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("tenants:confirmationModals.navigatingToTenantConsole.primaryAction") }
                    secondaryAction={ t("tenants:confirmationModals.navigatingToTenantConsole.secondaryAction") }
                    onSecondaryActionClick={ (): void => setShowTenantConsoleNavigationConfirmationModal(false) }
                    onPrimaryActionClick={ async () => await handleTenantConsoleNavigation(consoleNavigatingTenant) }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid="tenant-disable-confirmation-modal-header">
                        { t("tenants:confirmationModals.navigatingToTenantConsole.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        warning
                        data-componentid="tenant-disable-confirmation-modal-message"
                    >
                        { t("tenants:confirmationModals.navigatingToTenantConsole.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid="tenant-disable-confirmation-modal-content">
                        <Trans
                            i18nKey="tenants:confirmationModals.navigatingToTenantConsole.content"
                            i18nOptions={ { domain: consoleNavigatingTenant?.domain } }
                        >
                            If you continue navigating to the <strong>{ consoleNavigatingTenant?.domain }
                            </strong>Console, you will be logged out from the current session.
                        </Trans>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </TenantContext.Provider>
    );
};

export default TenantProvider;
