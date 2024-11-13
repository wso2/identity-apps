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
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import Grid from "@oxygen-ui/react/Grid";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { GearIcon, PlusIcon } from "@oxygen-ui/react-icons";
import { FeatureAccessConfigInterface, Show } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import TenantCard from "./tenant-card";
import useTenants from "../hooks/use-tenants";
import "./with-tenant-grid-placeholders.scss";

/**
 * Props interface of {@link WithTenantGridPlaceholders}
 */
export type WithTenantGridPlaceholdersProps = IdentifiableComponentInterface &
    PropsWithChildren<{
        /**
         * Callback to be fired on add tenant modal trigger.
         */
        onAddTenantModalTrigger: () => void;
    }>;

/**
 * HOC component to decorate the tenant grid with placeholders.
 *
 * @param props - Props injected to the component.
 * @returns Decorated tenant grid component.
 */
const WithTenantGridPlaceholders: FunctionComponent<WithTenantGridPlaceholdersProps> = ({
    children,
    onAddTenantModalTrigger,
    ["data-componentid"]: componentId = "with-tenant-grid-placeholders"
}: WithTenantGridPlaceholdersProps): ReactElement => {
    const { t } = useTranslation();
    const {
        searchQuery,
        setSearchQuery,
        tenantList,
        isTenantListLoading,
        setSearchQueryClearTrigger,
        searchQueryClearTrigger
    } = useTenants();

    const tenantFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config?.ui?.features?.tenants
    );

    /**
     * This function returns loading placeholders.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        const cards: ReactElement[] = [];
        const COUNT: number = 8;

        Array.from(Array(COUNT)).map((key: number) => {
            cards.push(
                <Grid key={ key } xs={ 12 } sm={ 12 } md={ 6 } lg={ 4 } xl={ 3 }>
                    <TenantCard tenant={ null } isLoading={ true } />
                </Grid>
            );
        });

        return <>{ cards }</>;
    };

    /**
     * Clears the search query and toggles the search query clear trigger.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setSearchQueryClearTrigger(!searchQueryClearTrigger);
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React element.
     */
    const showPlaceholders = (): ReactElement => {
        if (isTenantListLoading) {
            return null;
        }

        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={
                        (<Button variant="text" onClick={ handleSearchQueryClear }>
                            { t("tenants:listing.emptySearchResult.actions.clearSearchQuery.label") }
                        </Button>)
                    }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("tenants:listing.emptySearchResult.title") }
                    subtitle={ [
                        t("tenants:listing.emptySearchResult.subtitles.0", {
                            searchQuery: searchQuery
                        }),
                        t("tenants:listing.emptySearchResult.subtitles.1")
                    ] }
                    data-componentid={ `${componentId}-empty-search-placeholder` }
                />
            );
        }

        return (
            <EmptyPlaceholder
                className="list-placeholder"
                action={
                    (<Stack direction="row" alignItems="center" justifyContent="center" gap={ 2 }>
                        <Show when={ tenantFeatureConfig?.scopes?.create }>
                            <Button
                                startIcon={ <PlusIcon /> }
                                variant="contained"
                                color="primary"
                                autoFocus
                                onClick={ () => onAddTenantModalTrigger() }
                            >
                                { t("tenants:listing.emptyPlaceholder.actions.new.label") }
                            </Button>
                        </Show>
                        <Divider orientation="vertical" variant="middle" flexItem>
                            { t("tenants:listing.emptyPlaceholder.actions.divider") }
                        </Divider>
                        <Button
                            aria-label="system-settings-button"
                            data-componentid="system-settings-button"
                            variant="text"
                            startIcon={ <GearIcon /> }
                            onClick={ () => history.push(AppConstants.getPaths().get("SYSTEM_SETTINGS")) }
                        >
                            { t("tenants:listing.emptyPlaceholder.actions.configure.label") }
                        </Button>
                    </Stack>)
                }
                image={ getEmptyPlaceholderIllustrations().newList }
                imageSize="tiny"
                subtitle={ [
                    t("tenants:listing.emptyPlaceholder.subtitles.0"),
                    t("tenants:listing.emptyPlaceholder.subtitles.1")
                ] }
                data-componentid={ `${componentId}-empty-placeholder` }
            />
        );
    };

    if (isTenantListLoading) {
        return (
            <Grid container spacing={ 3 } data-componentid={ componentId }>
                { renderLoadingPlaceholder() }
            </Grid>
        );
    }

    // Sometimes, `tenants` array is undefined but `totalResults` is available.
    // TODO: Tracker: https://github.com/wso2/product-is/issues/21459
    if (!tenantList?.tenants || tenantList?.totalResults <= 0) {
        return <Box className="with-tenant-grid-placeholders">{ showPlaceholders() }</Box>;
    }

    return (
        <>
            <Typography
                align="right"
                className={ classNames("tenants-grid-display-count", {
                    hidden: !isTenantListLoading && tenantList?.tenants?.length > 0 && searchQuery
                }) }
                variant="body2"
            >
                { t("tenants:listing.count", {
                    results: tenantList?.tenants?.length,
                    totalResults: tenantList?.totalResults
                }) }
            </Typography>
            <Grid container spacing={ 3 } data-componentid={ componentId }>
                { children }
            </Grid>
        </>
    );
};

export default WithTenantGridPlaceholders;
