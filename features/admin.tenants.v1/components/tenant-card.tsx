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
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import IconButton from "@oxygen-ui/react/IconButton";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Menu from "@oxygen-ui/react/Menu/Menu";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography/Typography";
import {
    BanIcon,
    CircleCheckFilledIcon,
    EllipsisVerticalIcon,
    PenToSquareIcon,
    RectangleLineIcon,
    TrashIcon,
    UserIcon
} from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { LoadableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import TenantConstants from "../constants/tenant-constants";
import useTenants from "../hooks/use-tenants";
import { Tenant } from "../models/tenants";
import "./tenant-card.scss";

/**
 * Props interface of {@link TenantCard}
 */
export interface TenantCardProps extends LoadableComponentInterface {
    /**
     * Tenant object.
     */
    tenant: Tenant;
}

/**
 * Card component to display a tenant.
 *
 * @param props - Props injected to the component.
 * @returns Tenant Card component.
 */
const TenantCard: FunctionComponent<TenantCardProps> = ({ isLoading, tenant }: TenantCardProps): ReactElement => {
    const { t } = useTranslation();

    const isTenantDeletionEnabled: boolean = useSelector((state: AppState) => {
        return !state?.config?.ui?.features?.tenants?.disabledFeatures?.includes(
            TenantConstants.FEATURE_DICTIONARY.TENANT_DELETION
        );
    });

    const { deleteTenant, disableTenant, enableTenant } = useTenants();

    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);

    const open: boolean = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    if (isLoading) {
        return (
            <Card>
                <Stack spacing={ 2 }>
                    <Stack spacing={ 1 }>
                        <Skeleton variant="rectangular" width={ 123 } height={ 9 } />
                        <Skeleton variant="rectangular" width={ 246 } height={ 9 } />
                    </Stack>
                    <Stack spacing={ 1 }>
                        <Skeleton variant="rectangular" width={ 246 } height={ 7 } />
                        <Skeleton variant="rectangular" width={ 123 } height={ 7 } />
                    </Stack>
                </Stack>
            </Card>
        );
    }

    return (
        <Card
            key={ tenant.id }
            className="tenant-card"
            data-componentid={ `${tenant.id}-tenant-card` }
            onClick={ () => null }
        >
            <CardContent className="tenant-card-header">
                <Avatar variant="rounded" randomBackgroundColor backgroundColorRandomizer={ tenant.id }>
                    { tenant.domain?.charAt(0)?.toUpperCase() }
                </Avatar>
                <div>
                    <Typography variant="h6">{ tenant.domain }</Typography>
                    <Typography className="tenant-card-status" variant="body3">
                        <div
                            className={ classNames("status-dot", {
                                ["disabled"]: !tenant.lifecycleStatus?.activated,
                                ["enabled"]: tenant.lifecycleStatus?.activated
                            }) }
                        />
                        { tenant?.lifecycleStatus?.activated
                            ? t("tenants:status.activated")
                            : t("tenants:status.deActivated") }
                    </Typography>
                </div>
            </CardContent>
            <CardContent>
                <div className="tenant-card-footer">
                    <div>
                        <Typography variant="body3" color="text.secondary">
                            <div className="tenant-card-meta">
                                <UserIcon size={ 12 } />
                                <Trans
                                    i18nKey="tenants:listing.item.meta.owner.label"
                                    tOptions={ {
                                        owner: tenant.owners[0]?.username
                                    } }
                                >
                                    Owned by
                                    <span className="tenant-card-owner-name">{ tenant.owners[0]?.username }</span>
                                </Trans>
                            </div>
                        </Typography>
                        <Typography variant="body3" color="text.secondary">
                            <div className="tenant-card-meta">
                                <RectangleLineIcon size={ 12 } />
                                <Trans
                                    i18nKey="tenants:listing.item.meta.createdOn.label"
                                    tOptions={ {
                                        date: moment(tenant.createdDate).format("MMM DD, YYYY")
                                    } }
                                >
                                    Created on { moment(tenant.createdDate).format("MMM DD, YYYY") }
                                </Trans>
                            </div>
                        </Typography>
                    </div>
                    <div>
                        <Tooltip title={ t("tenants:listing.item.actions.edit.label") }>
                            <IconButton
                                aria-label="edit"
                                onClick={ () =>
                                    history.push(
                                        AppConstants.getPaths()
                                            .get("EDIT_TENANT")
                                            .replace(":id", tenant.id)
                                    )
                                }
                            >
                                <PenToSquareIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={ t("tenants:listing.item.actions.more.label") }>
                            <IconButton
                                aria-label="more"
                                id="more"
                                aria-controls={ open ? "more-menu" : undefined }
                                aria-expanded={ open ? "true" : undefined }
                                aria-haspopup="true"
                                onClick={ handleClick }
                            >
                                <EllipsisVerticalIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="more-menu"
                            MenuListProps={ {
                                "aria-labelledby": "long-button"
                            } }
                            anchorEl={ anchorEl }
                            open={ open }
                            onClose={ handleClose }
                            className="tenant-card-footer-dropdown"
                        >
                            <MenuItem
                                className={ classNames("tenant-card-footer-dropdown-item", {
                                    error: tenant?.lifecycleStatus?.activated,
                                    success: !tenant?.lifecycleStatus?.activated
                                }) }
                                onClick={ (): void => {
                                    if (tenant?.lifecycleStatus?.activated) {
                                        disableTenant(tenant);

                                        return;
                                    }

                                    enableTenant(tenant);
                                } }
                            >
                                <ListItemIcon>
                                    { tenant?.lifecycleStatus?.activated ? <BanIcon /> : <CircleCheckFilledIcon /> }
                                </ListItemIcon>
                                <ListItemText>
                                    { tenant?.lifecycleStatus?.activated
                                        ? t("tenants:status.deActivate")
                                        : t("tenants:status.activate") }
                                </ListItemText>
                            </MenuItem>
                            { isTenantDeletionEnabled && (
                                <MenuItem
                                    className="tenant-card-footer-dropdown-item error"
                                    onClick={ () => deleteTenant(tenant) }
                                >
                                    <ListItemIcon>
                                        <TrashIcon size={ 14 } />
                                    </ListItemIcon>
                                    <ListItemText>{ t("tenants:listing.item.actions.delete.label") }</ListItemText>
                                </MenuItem>
                            ) }
                        </Menu>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TenantCard;
