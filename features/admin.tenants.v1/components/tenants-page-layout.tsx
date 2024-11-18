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

import Button from "@oxygen-ui/react/Button";
import Grid from "@oxygen-ui/react/Grid";
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { GearIcon, PlusIcon } from "@oxygen-ui/react-icons";
import { Show } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, PageLayout, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AddTenantModal from "./add-tenant/add-tenant-modal";
import TenantGrid from "./tenant-grid";
import useTenants from "../hooks/use-tenants";
import "./tenants-page-layout.scss";

/**
 * Props interface of {@link TenantsPageLayout}
 */
type TenantsPageLayoutProps = IdentifiableComponentInterface;

/**
 * Component to wrap the page layout of the tenant listing page that can access the tenant context.
 *
 * @param props - Props injected to the component.
 * @returns Tenant page layout.
 */
const TenantsPageLayout: FunctionComponent<TenantsPageLayoutProps> = ({
    ["data-componentid"]: componentId = "tenants-page-layout"
}: TenantsPageLayoutProps): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const { tenantList, mutateTenantList, searchQueryClearTrigger, setSearchQuery } = useTenants();

    const tenantFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config?.ui?.features?.tenants
    );
    const adminAdvisory: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config?.ui?.features?.adminAdvisoryBanner
    );
    const remoteLogPublishing: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config?.ui?.features?.remoteLogging
    );

    const [ addTenantModalOpen, setAddTenantModalOpen ] = useState<boolean>(false);

    /**
     * Effect hook that triggers the mutation of the tenant list.
     */
    useEffect(() => {
        mutateTenantList();
    }, []);

    /**
     * Handles the list filter by setting the search query.
     *
     * @param query - The search query string.
     */
    const handleListFilter = (query: string): void => {
        setSearchQuery(query);
    };

    return (
        <PageLayout
            pageTitle={ "Root Organizations" }
            title={ t("tenants:title") }
            description={
                (<>
                    { t("tenants:subtitle") }
                    <DocumentationLink link={ getLink("develop.multiTenancy.learnMore") } showEmptyLink={ false }>
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>)
            }
            data-componentid={ componentId }
            action={
                (<div className="tenants-page-actions">
                    { /* Sometimes, `tenants` array is undefined but `totalResults` is available. */ }
                    { /* TODO: Tracker: https://github.com/wso2/product-is/issues/21459 */ }
                    { tenantList?.tenants && tenantList?.totalResults >= 1 && (
                        <>
                            <Show when={ adminAdvisory?.scopes?.read || remoteLogPublishing?.scopes?.read }>
                                <Tooltip title={ t("tenants:actions.systemSettings.tooltip") }>
                                    <IconButton
                                        variant="contained"
                                        aria-label="system-settings-button"
                                        data-componentid="system-settings-button"
                                        size="large"
                                        onClick={ (): void => {
                                            history.push(AppConstants.getPaths().get("SYSTEM_SETTINGS"));
                                        } }
                                    >
                                        <GearIcon size={ 16 } />
                                    </IconButton>
                                </Tooltip>
                            </Show>
                            <Show when={ tenantFeatureConfig?.scopes?.create }>
                                <Button
                                    data-componentid="tenant-create-button"
                                    variant="contained"
                                    startIcon={ <PlusIcon /> }
                                    onClick={ () => setAddTenantModalOpen(true) }
                                >
                                    { t("tenants:actions.newTenant.title") }
                                </Button>
                            </Show>
                        </>
                    ) }
                </div>)
            }
            className="tenants-page"
        >
            { /* Sometimes, `tenants` array is undefined but `totalResults` is available. */ }
            { /* TODO: Tracker: https://github.com/wso2/product-is/issues/21459 */ }
            { tenantList?.tenants && tenantList?.totalResults >= 1 && (
                <Grid container>
                    <Grid xs={ 12 } sm={ 12 } md={ 6 } lg={ 6 } xl={ 4 }>
                        <AdvancedSearchWithBasicFilters
                            fill="white"
                            onFilter={ handleListFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t(
                                        "tenants:listing.advancedSearch.form.dropdown.filterAttributeOptions.domain"
                                    ),
                                    value: "domainName"
                                }
                            ] }
                            filterAttributePlaceholder={ t(
                                "tenants:listing.advancedSearch.form.inputs.filterAttribute.placeholder"
                            ) }
                            filterConditionsPlaceholder={ t(
                                "tenants:listing.advancedSearch.form.inputs.filterCondition.placeholder"
                            ) }
                            filterValuePlaceholder={ t(
                                "tenants:listing.advancedSearch.form.inputs.filterValue.placeholder"
                            ) }
                            placeholder={ t("tenants:listing.advancedSearch.placeholder") }
                            defaultSearchAttribute={ "domainName" }
                            defaultSearchOperator="co"
                            triggerClearQuery={ searchQueryClearTrigger }
                        />
                    </Grid>
                </Grid>
            ) }
            <TenantGrid onAddTenantModalTrigger={ () => setAddTenantModalOpen(true) } />
            <AddTenantModal open={ addTenantModalOpen } onClose={ () => setAddTenantModalOpen(false) } />
        </PageLayout>
    );
};

export default TenantsPageLayout;
