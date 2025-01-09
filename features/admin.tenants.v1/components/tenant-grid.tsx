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

import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import TenantCard from "./tenant-card";
import WithTenantGridPlaceholders from "./with-tenant-grid-placeholders";
import useTenants from "../hooks/use-tenants";
import { Tenant } from "../models/tenants";
import "./tenant-grid.scss";

/**
 * Props interface of {@link TenantsPage}
 */
export interface TenantGridProps extends IdentifiableComponentInterface {
    onAddTenantModalTrigger: () => void;
}

/**
 * Grid layout for listing all the tenants.
 *
 * @param props - Props injected to the component.
 * @returns Tenant listing grid component.
 */
const TenantGrid: FunctionComponent<TenantGridProps> = ({
    onAddTenantModalTrigger,
    ["data-componentid"]: componentId = "tenant-grid"
}: TenantGridProps): ReactElement => {
    const { t } = useTranslation();

    const {
        tenantList,
        tenantListLimit,
        setTenantListLimit,
        isInitialRenderingComplete,
        searchQuery
    } = useTenants();

    /**
     * Handles the load more action in the infinite scroll component.
     */
    const handleLoadMore = (): void => {
        setTenantListLimit((prevLimit: number) => prevLimit + 10);
    };

    const resolveHasMore = (): boolean => {
        if (!isInitialRenderingComplete) {
            return false;
        }

        if (!tenantList?.totalResults || tenantList.totalResults <= 0) {
            return false;
        }

        if (searchQuery) {
            return false;
        }

        return tenantListLimit < tenantList.totalResults;
    };

    return (
        <div className="tenant-grid">
            <InfiniteScroll
                dataLength={ tenantList?.totalResults ?? 0 }
                next={ handleLoadMore }
                hasMore={ resolveHasMore() }
                loader={
                    (<Box
                        display="flex"
                        alignContent="center"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        gap={ 2 }
                        className="infinite-loader"
                    >
                        <CircularProgress size={ 22 } className="tenant-list-item-loader" />
                        <Typography variant="h6">{ t("common:loading") }...</Typography>
                    </Box>)
                }
                endMessage={ null }
            >
                <WithTenantGridPlaceholders
                    data-componentid={ componentId }
                    onAddTenantModalTrigger={ onAddTenantModalTrigger }
                >
                    { tenantList?.tenants?.map((tenant: Tenant) => (
                        <Grid key={ tenant.id } xs={ 12 } sm={ 12 } md={ 6 } lg={ 4 } xl={ 3 }>
                            <TenantCard tenant={ tenant } />
                        </Grid>
                    )) }
                </WithTenantGridPlaceholders>
            </InfiniteScroll>
        </div>
    );
};

export default TenantGrid;
