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
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { GearIcon, PlusIcon } from "@oxygen-ui/react-icons";
import { Show } from "@wso2is/access-control";
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
    const { tenantList, mutateTenantList } = useTenants();

    useEffect(() => {
        mutateTenantList();
    }, []);

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
                    { tenantList?.totalResults > 1 && (
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
            <TenantGrid onAddTenantModalTrigger={ () => setAddTenantModalOpen(true) } />
            <AddTenantModal open={ addTenantModalOpen } onClose={ () => setAddTenantModalOpen(false) } />
        </PageLayout>
    );
};

export default TenantsPageLayout;
