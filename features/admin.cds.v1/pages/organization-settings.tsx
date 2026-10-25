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

import Alert from "@oxygen-ui/react/Alert";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import OrganizationAccess from "../components/organization-access";
import { OrganizationManagementScopes } from "../constants/organization-management-constants";
import useCDSConfig from "../hooks/use-config";
import useTreeSync from "../hooks/use-tree-sync";
import { TreeSyncStatus } from "../models/organization-management";
import { useIsOrganizationManagementEnabled, useIsSubOrganization } from "../utils/organization-management-utils";

/**
 * Organization settings of CDS: the organization access (the organizations that can use CDS).
 * The CDS enable toggle is on the Customer Data page. The organization access needs a completed
 * sync of the organization tree.
 */
const OrganizationSettingsPage: FunctionComponent<IdentifiableComponentInterface> = ({
    ["data-componentid"]: componentId = "cds-organization-settings-page"
}: IdentifiableComponentInterface): ReactElement => {

    const { t } = useTranslation();

    const cdsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.customerDataService
    );

    const hasOrganizationUpdateScope: boolean = useRequiredScopes([ OrganizationManagementScopes.ORGANIZATION_UPDATE ]);

    const { data: cdsConfig, isLoading: isConfigLoading } = useCDSConfig(cdsFeatureConfig?.enabled ?? false);

    const isCDSEnabled: boolean = cdsConfig?.cds_enabled ?? false;

    const isSubOrganization: boolean = useIsSubOrganization();
    const isOrganizationManagementEnabled: boolean = useIsOrganizationManagementEnabled();
    const isRootWithCDS: boolean = isCDSEnabled && !isSubOrganization && isOrganizationManagementEnabled;

    useEffect(() => {
        if (!isOrganizationManagementEnabled) {
            history.push(AppConstants.getPaths().get("CUSTOMER_DATA_PROFILE"));
        }
    }, [ isOrganizationManagementEnabled ]);

    const { data: syncStatus, isLoading: isSyncLoading, mutate: mutateSync } = useTreeSync(isRootWithCDS);

    const syncStatusData: TreeSyncStatus = syncStatus as TreeSyncStatus;
    // A new key after each completed sync loads the access again.
    const syncKey: string = syncStatusData?.last_synced_at ?? "not-synced";
    const isPageLoading: boolean = isConfigLoading || (isRootWithCDS && isSyncLoading);

    return (
        <PageLayout
            title={ t("customerDataService:organizationSettings.page.title") }
            pageTitle={ t("customerDataService:organizationSettings.page.title") }
            description={ t("customerDataService:organizationSettings.page.description") }
            backButton={ {
                onClick: (): void => history.push(AppConstants.getPaths().get("CUSTOMER_DATA_PROFILE")),
                text: t("customerDataService:landing.backButton")
            } }
            data-componentid={ `${ componentId }-layout` }
        >
            { isPageLoading && <ContentLoader inline="centered" active /> }
            { isRootWithCDS && !isPageLoading && (
                <OrganizationAccess
                    key={ `access-${ syncKey }` }
                    canUpdate={ hasOrganizationUpdateScope }
                    syncStatus={ syncStatusData }
                    onSyncStarted={ () => mutateSync() }
                    data-componentid={ `${ componentId }-organization-access` }
                />
            ) }
            { isSubOrganization && (
                <Alert severity="info" data-componentid={ `${ componentId }-child-organization` }>
                    { t("customerDataService:organizationSettings.childOrganization") }
                </Alert>
            ) }
            { !isSubOrganization && !isCDSEnabled && !isPageLoading && (
                <Alert severity="info" data-componentid={ `${ componentId }-disabled` }>
                    { t("customerDataService:organizationSettings.disabled") }
                </Alert>
            ) }
        </PageLayout>
    );
};

export default OrganizationSettingsPage;
