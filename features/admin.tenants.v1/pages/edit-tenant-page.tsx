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

import Avatar from "@oxygen-ui/react/Avatar";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { CopyIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { Hint, PageLayout } from "@wso2is/react-components";
import classNames from "classnames";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useGetTenant from "../api/use-get-tenant";
import useGetTenantOwner from "../api/use-get-tenant-owner";
import EditTenant from "../components/edit-tenant/edit-tenant";
import useTenantConsoleURL from "../hooks/use-tenant-console-url";
import { Tenant, TenantOwner } from "../models/tenants";
import TenantProvider from "../providers/tenant-provider";
import "./edit-tenant-page.scss";

/**
 * Props interface of {@link EditTenantPage}
 */
export interface EditTenantPageProps extends IdentifiableComponentInterface {
    match: {
        params: {
            id: string;
        };
    };
}

/**
 * Component for editing a tenant.
 *
 * @param props - Props injected to the component.
 * @returns Tenant edit page component.
 */
const EditTenantPage: FunctionComponent<EditTenantPageProps> = ({
    match,
    ["data-componentid"]: componentId = "tenant-edit-page"
}: EditTenantPageProps): ReactElement => {
    const { t } = useTranslation();
    const { id } = match.params;

    const { data: tenant, isLoading: isTenantLoading, mutate: mutateTenant } = useGetTenant(id);
    const { data: tenantOwner, mutate: mutateTenantOwner } = useGetTenantOwner(
        tenant?.id,
        tenant?.owners[0]?.id,
        !!tenant
    );
    const consoleURL: string | undefined = useTenantConsoleURL(tenant);

    /**
     * Merges the tenant and tenant owner data.
     * @remarks Owner details in the tenant request is limited to just `id` & `username`.
     * Hence we need to aggregate the owner details from the tenant owner request.
     */
    const mergedTenant: Tenant = useMemo(() => {
        if (!tenant || !tenantOwner) {
            return null;
        }

        return {
            ...tenant,
            owners: tenant.owners?.map((owner: TenantOwner) => {
                if (owner.id === tenantOwner.id) {
                    return tenantOwner;
                }

                return owner;
            })
        };
    }, [ tenant, tenantOwner ]);

    return (
        <TenantProvider
            onTenantDeleteSuccess={ (): void => history.push(AppConstants.getPaths().get("TENANTS")) }
            onTenantDisableSuccess={ (): void => {
                mutateTenant();
                mutateTenantOwner();
            } }
            onTenantEnableSuccess={ (): void => {
                mutateTenant();
                mutateTenantOwner();
            } }
        >
            <PageLayout
                flex
                pageTitle="Edit Root Organizations"
                title={
                    (<div className="tenant-status">
                        { tenant?.domain }
                        <Tooltip
                            title={
                                tenant?.lifecycleStatus?.activated
                                    ? t("tenants:status.activated")
                                    : t("tenants:status.notActivated")
                            }
                        >
                            <span
                                className={ classNames("status-dot", {
                                    ["active"]: tenant?.lifecycleStatus?.activated,
                                    ["disabled"]: !tenant?.lifecycleStatus?.activated
                                }) }
                            />
                        </Tooltip>
                    </div>)
                }
                isLoading={ isTenantLoading }
                description={
                    (<Typography>
                        { t("tenants:edit.subtitle", { date: moment(tenant?.createdDate).format("MMM DD, YYYY") }) }
                    </Typography>)
                }
                image={
                    (<Avatar
                        alt={ tenant?.domain }
                        variant="rounded"
                        randomBackgroundColor
                        backgroundColorRandomizer={ tenant?.id }
                    >
                        { tenant?.domain?.charAt(0).toUpperCase() }
                    </Avatar>)
                }
                data-componentid={ `${componentId}-layout` }
                backButton={ {
                    "data-componentid": `${componentId}-back-button`,
                    onClick: () => history.push(AppConstants.getPaths().get("TENANTS")),
                    text: t("tenants:edit.backButton")
                } }
                className="tenant-edit-page"
                bottomMargin={ false }
                action={
                    (<TextField
                        label={
                            (<Box>
                                <span>{ t("tenants:edit.consoleURL.label") }</span>
                                <Hint popup>
                                    <Trans i18nKey="tenants:edit.consoleURL.hint" values={ { domain: tenant?.domain } }>
                                        If you try to login to <strong>{ tenant?.domain }</strong> organization&apos;s
                                        Console using the same browser, you will have to log out from this active
                                        session first.
                                    </Trans>
                                </Hint>
                            </Box>)
                        }
                        id="filled-start-adornment"
                        InputProps={ {
                            endAdornment: (
                                <Tooltip title="Copy">
                                    <div>
                                        <IconButton
                                            aria-label="Reset field to default"
                                            className="reset-field-to-default-adornment"
                                            onClick={ async () => {
                                                await CommonUtils.copyTextToClipboard(consoleURL);
                                            } }
                                            edge="end"
                                        >
                                            <CopyIcon size={ 12 } />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            ),
                            readOnly: true
                        } }
                        value={ consoleURL }
                        className="console-url-copy-field"
                    />)
                }
            >
                <EditTenant tenant={ mergedTenant } />
            </PageLayout>
        </TenantProvider>
    );
};

export default EditTenantPage;
