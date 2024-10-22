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

import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal } from "@wso2is/react-components";
import React, { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import deleteTenantMetadata from "../api/delete-tenant-metadata";
import useGetTenants from "../api/use-get-tenants";
import TenantContext from "../context/tenant-context";
import { Tenant } from "../models/tenants";

/**
 * Props interface of {@link TenantProvider}
 */
export interface TenantProviderProps {
    /**
     * Callback to be fired on successful tenant deletion.
     */
    onDeleteTenantSuccess?: () => void;
};

/**
 * This component provides tenant-related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The TenantProvider component.
 */
const TenantProvider = ({
    children,
    onDeleteTenantSuccess
}: PropsWithChildren<TenantProviderProps>): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isInitialRenderingComplete, setIsInitialRenderingComplete ] = useState<boolean>(false);
    const [ tenantListLimit, setTenantListLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingTenant, setDeletingTenant ] = useState<Tenant>(null);
    const [ isTenantDeleteRequestLoading, setIsTenantDeleteRequestLoading ] = useState<boolean>(false);

    const { data: tenantList, isLoading: isTenantListLoading, mutate: mutateTenantList } = useGetTenants({
        limit: tenantListLimit,
        offset: 0,
        sortBy: "domainName",
        sortOrder: "asc"
    });

    useEffect(() => {
        if (tenantList && tenantList.tenants.length > 0) {
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
                onDeleteTenantSuccess();
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
            })
            .finally(() => {
                setShowDeleteConfirmationModal(false);
                setIsTenantDeleteRequestLoading(false);
            });
    };

    return (
        <TenantContext.Provider
            value={ {
                deleteTenant: (tenant: Tenant): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingTenant(tenant);
                },
                isInitialRenderingComplete,
                isTenantListLoading,
                mutateTenantList,
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
        </TenantContext.Provider>
    );
};

export default TenantProvider;
