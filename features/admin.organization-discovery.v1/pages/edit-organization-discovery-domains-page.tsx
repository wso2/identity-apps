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

import { AppConstants, history } from "@wso2is/admin.core.v1";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetOrganization from "@wso2is/admin.organizations.v1/api/use-get-organization";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteChildrenProps } from "react-router-dom";
import { Dispatch } from "redux";
import useGetOrganizationDiscoveryAttributes from "../api/use-get-organization-discovery-attributes";
import EditOrganizationDiscoveryDomains from "../components/edit-organization-discovery-domains";
import { OrganizationIcon } from "../configs/ui";
import { OrganizationDiscoveryConstants } from "../constants/organization-discovery-constants";

/**
 * Props interface of {@link EditOrganizationDiscoveryDomainsPage}
 */
export type EditOrganizationDiscoveryDomainsPagePropsInterface = IdentifiableComponentInterface & RouteChildrenProps;

/**
 * This component renders the discovery email domain edit page for the organization.
 *
 * @param props - Props injected to the component.
 * @returns Discovery email domain edit page.
 */
const EditOrganizationDiscoveryDomainsPage: FunctionComponent<EditOrganizationDiscoveryDomainsPagePropsInterface> = (
    props: EditOrganizationDiscoveryDomainsPagePropsInterface
): ReactElement => {

    const {
        location,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state?.config?.ui?.features?.organizationDiscovery;
    });

    const organizationId: string = useMemo(() => {
        const path: string[] = location.pathname.split("/");

        return path[path.length - 1];
    }, [ location ]);

    const {
        data: organization,
        error: organizationFetchRequestError
    } = useGetOrganization(!!organizationId, organizationId);

    const {
        data: organizationDiscoveryAttributes,
        error: organizationDiscoveryAttributesFetchRequestError,
        mutate: mutateOrganizationDiscoveryAttributesFetchRequest
    } = useGetOrganizationDiscoveryAttributes(!!organizationId, organizationId);

    const [ isReadOnly, setIsReadOnly ] = useState<boolean>(true);

    /**
     * Set the isReadOnly state based on the feature config.
     */
    useEffect(() => {
        setIsReadOnly(
            !isFeatureEnabled(
                featureConfig,
                OrganizationDiscoveryConstants.FEATURE_DICTIONARY.get("ORGANIZATION_DISCOVERY_UPDATE")
            ) || !hasRequiredScopes(
                featureConfig,
                featureConfig.scopes?.update,
                allowedScopes
            )
        );
    }, [ featureConfig, organization ]);

    useEffect(() => {
        if (!organizationFetchRequestError) {
            return;
        }

        dispatch(addAlert({
            description: t("organizations:notifications.fetchOrganization." +
                "genericError.message"),
            level: AlertLevels.ERROR,
            message: t("organizations:notifications.fetchOrganization." +
                "genericError.message")
        }));
    }, [ organizationFetchRequestError ]);

    useEffect(() => {
        if (!organizationDiscoveryAttributesFetchRequestError) {
            return;
        }

        dispatch(addAlert({
            description: t("organizations:notifications.fetchOrganization." +
                "error.description"),
            level: AlertLevels.ERROR,
            message: t("organizations:notifications.fetchOrganization." +
                "error.message")
        }));
    }, [ organizationDiscoveryAttributesFetchRequestError ]);

    const goBackToOrganizationListWithDomains: () => void = useCallback(() =>
        history.push(AppConstants.getPaths().get("ORGANIZATION_DISCOVERY_DOMAINS")),[ history ]
    );

    return (
        <PageLayout
            title={ organization?.name ?? t("organizationDiscovery:title") }
            pageTitle={ organization?.name ?? t("organizationDiscovery:title") }
            description={ t("organizationDiscovery:edit.description") }
            image={ (
                <GenericIcon
                    defaultIcon
                    relaxed="very"
                    shape="rounded"
                    size="x50"
                    icon={ OrganizationIcon }
                />
            ) }
            backButton={ {
                "data-componentid": "org-email-domains-edit-org-back-button",
                onClick: goBackToOrganizationListWithDomains,
                text: t("organizationDiscovery:edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ componentId }
        >
            <EditOrganizationDiscoveryDomains
                organization={ organization }
                organizationDiscoveryAttributes = { organizationDiscoveryAttributes }
                isReadOnly={ isReadOnly }
                onOrganizationUpdate={ () => mutateOrganizationDiscoveryAttributesFetchRequest() }
            />
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
EditOrganizationDiscoveryDomainsPage.defaultProps = {
    "data-componentid": "edit-organization-discovery-domains-page"
};

export default EditOrganizationDiscoveryDomainsPage;
