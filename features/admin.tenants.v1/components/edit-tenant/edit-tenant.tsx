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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Collapse from "@oxygen-ui/react/Collapse";
import Stack from "@oxygen-ui/react/Stack";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import EditTenantForm from "./edit-tenant-form";
import deleteTenantMetadata from "../../api/delete-tenant-metadata";
import updateTenantActivationStatus from "../../api/update-tenant-activation-status";
import { Tenant, TenantLifecycleStatus } from "../../models/tenants";
import "./edit-tenant.scss";

/**
 * Props interface of {@link EditTenant}
 */
export type EditTenantProps = IdentifiableComponentInterface & {
    /**
     * Tenant object.
     */
    tenant: Tenant;
    /**
     * Callback to be fired on updates occur as side effects.
     */
    onUpdate?: () => void;
};

/**
 * Component to hold the tenant details view and edit capabilities.
 *
 * @param props - Props injected to the component.
 * @returns Tenant edit component.
 */
const EditTenant: FunctionComponent<EditTenantProps> = ({
    tenant,
    onUpdate,
    ["data-componentid"]: componentId = "edit-tenant"
}: EditTenantProps): ReactElement => {
    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const showDisabledAlert: boolean = useMemo(() => {
        if (!tenant) {
            return false;
        }

        return !tenant?.lifecycleStatus?.activated;
    }, [ tenant?.lifecycleStatus?.activated ]);

    /**
     * Handles the organization status update by invoking the updateTenantActivationStatus API.
     */
    const handleOrganizationStatusUpdate = (): void => {
        const newLifecycleStatus: TenantLifecycleStatus = {
            activated: !tenant.lifecycleStatus.activated
        };

        updateTenantActivationStatus(tenant.id, newLifecycleStatus)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:editTenant.notifications.updateTenantStatus.success.description", {
                            operation: newLifecycleStatus.activated ? t("common:enabled") : t("common:disabled")
                        }),
                        level: AlertLevels.SUCCESS,
                        message: t("tenants:editTenant.notifications.updateTenantStatus.success.message", {
                            operation: newLifecycleStatus.activated ? t("common:enabled") : t("common:disabled")
                        })
                    })
                );

                onUpdate && onUpdate();
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
            });
    };

    /**
     * Handles the organization delete by invoking the deleteTenantMetadata API.
     */
    const handleOrganizationDelete = (): void => {
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
            });
    };

    return (
        <Stack spacing={ 3 } className="edit-tenant">
            <Collapse in={ showDisabledAlert }>
                <Alert
                    severity="warning"
                    action={
                        (<Button onClick={ () => handleOrganizationStatusUpdate() } color="inherit" size="small">
                            { t("tenants:editTenant.disabledDisclaimer.actions.enable.label") }
                        </Button>)
                    }
                >
                    <AlertTitle>{ t("tenants:editTenant.disabledDisclaimer.title") }</AlertTitle>
                    <Trans i18nKey="tenants:editTenant.disabledDisclaimer.content">
                        This organization is currently in a <strong>disabled</strong> state. Users will not be able to
                        log in to any of the applications or perform any relevant tasks of the organization until it is
                        enabled again.
                    </Trans>
                </Alert>
            </Collapse>
            <Card
                data-componentid={ componentId }
                className="edit-tenant-content"
            >
                <EditTenantForm tenant={ tenant } onUpdate={ onUpdate } />
            </Card>
            <DangerZoneGroup sectionHeader={ t("tenants:editTenant.dangerZoneGroup.header") }>
                { tenant?.lifecycleStatus?.activated && (
                    <DangerZone
                        data-componentid={ `${componentId}-danger-zone-status` }
                        actionTitle={ t("tenants:editTenant.dangerZoneGroup.disable.actionTitle") }
                        header={ t("tenants:editTenant.dangerZoneGroup.disable.header") }
                        subheader={ t("tenants:editTenant.dangerZoneGroup.disable.subheader") }
                        onActionClick={ (): void => handleOrganizationStatusUpdate() }
                    />
                ) }
                <DangerZone
                    data-componentid={ `${componentId}-danger-zone-delete` }
                    actionTitle={ t("tenants:editTenant.dangerZoneGroup.delete.actionTitle") }
                    header={ t("tenants:editTenant.dangerZoneGroup.delete.header") }
                    subheader={ t("tenants:editTenant.dangerZoneGroup.delete.subheader") }
                    onActionClick={ (): void => handleOrganizationDelete() }
                />
            </DangerZoneGroup>
        </Stack>
    );
};

export default EditTenant;
