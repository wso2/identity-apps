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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppConstants, FeatureConfigInterface, history } from "../../admin.core.v1";
import { AppState } from "../../admin.core.v1/store";
import AddOrganizationDiscoveryDomains from "../components/add-organization-discovery-domains";
import { OrganizationDiscoveryConstants } from "../constants/organization-discovery-constants";

/**
 * Props interface of {@link AssignOrganizationDiscoverDomainsPage}
 */
export type EmailDomainAssignPagePropsInterface = SBACInterface<FeatureConfigInterface>
    & IdentifiableComponentInterface;

/**
 * This component renders the email domain assign page for the organization.
 *
 * @param props - Props injected to the component.
 * @returns Email domain assign page.
 */
const AssignOrganizationDiscoverDomainsPage: FunctionComponent<EmailDomainAssignPagePropsInterface> = (
    props: EmailDomainAssignPagePropsInterface
): ReactElement => {

    const { ["data-componentid" ]: componentId } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.organizationDiscovery;
    });

    const isReadOnly: boolean = useMemo(() => {
        return (
            !isFeatureEnabled(
                featureConfig,
                OrganizationDiscoveryConstants.FEATURE_DICTIONARY.get("ORGANIZATION_DISCOVERY_UPDATE")
            ) || !hasRequiredScopes(
                featureConfig,
                featureConfig.scopes?.update,
                allowedScopes
            )
        );
    }, [ featureConfig ]);

    const goBackToOrganizationListWithDomains: () => void = useCallback(() =>
        history.push(AppConstants.getPaths().get("ORGANIZATION_DISCOVERY_DOMAINS")),[ history ]
    );

    return (
        <PageLayout
            title={ t("organizationDiscovery:assign.title") }
            pageTitle="Assign Email Domains"
            description={ t("organizationDiscovery:assign.description") }
            backButton={ {
                "data-componentid": "assign-discovery-domains-page-back-button",
                onClick: goBackToOrganizationListWithDomains,
                text: t("common:back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ componentId }
        >
            <AddOrganizationDiscoveryDomains isReadOnly={ isReadOnly } />
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
AssignOrganizationDiscoverDomainsPage.defaultProps = {
    "data-componentid": "assign-organization-discovery-domains-page"
};

export default AssignOrganizationDiscoverDomainsPage;
