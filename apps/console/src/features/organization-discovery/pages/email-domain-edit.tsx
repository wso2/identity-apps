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

import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteChildrenProps } from "react-router-dom";
import { Dispatch } from "redux";
import { AppConstants, FeatureConfigInterface, history } from "../../core";
import { getOrganization, getOrganizationDiscoveryAttributes } from "../api";
import { EditOrganizationEmailDomains } from "../components/edit-organization/edit-organization-email-domains";
import { OrganizationIcon } from "../configs";
import { OrganizationManagementConstants } from "../constants";
import { OrganizationDiscoveryAttributeDataInterface, OrganizationResponseInterface } from "../models";

interface OrganizationEmailDomainEditPagePropsInterface extends SBACInterface<FeatureConfigInterface>,
    TestableComponentInterface, RouteChildrenProps{
}

const OrganizationEmailDomainEditPage: FunctionComponent<OrganizationEmailDomainEditPagePropsInterface> = (
    props: OrganizationEmailDomainEditPagePropsInterface
): ReactElement => {

    const {
        featureConfig,
        location
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ organization, setOrganization ] = useState<OrganizationResponseInterface>();
    const [ organizationDiscoveryData, setOrganizationDiscoveryData ] = useState
    <OrganizationDiscoveryAttributeDataInterface>();
    const [ isReadOnly, setIsReadOnly ] = useState(true);


    useEffect(() => {
        setIsReadOnly(
            !isFeatureEnabled(
                featureConfig?.organizationDiscovery,
                OrganizationManagementConstants.FEATURE_DICTIONARY.get("ORGANIZATION_EMAIL_DOMAIN_UPDATE")
            ));
    }, [ featureConfig, organization ]);

    const getOrganizationData: (organizationId: string) => void = useCallback((organizationId: string): void => {
        getOrganization(organizationId)
            .then((organization: OrganizationResponseInterface) => {
                setOrganization(organization);
            }).catch((error: any) => {
                if (error?.description) {
                    dispatch(addAlert({
                        description: error.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.organizations.notifications.fetchOrganization." +
                            "genericError.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.organizations.notifications.fetchOrganization." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.organizations.notifications.fetchOrganization." +
                        "genericError.message")
                }));
            });
    }, [ dispatch, t ]);

    const getOrganizationDiscoveryData: (organizationId: string) => void = useCallback(
        (organizationId: string): void => {
            getOrganizationDiscoveryAttributes(organizationId)
                .then((organizationDiscoveryData: OrganizationDiscoveryAttributeDataInterface) => {
                    setOrganizationDiscoveryData(organizationDiscoveryData);
                }).catch((error: any) => {
                    if (error?.description) {
                        dispatch(addAlert({
                            description: error.description,
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.organizationDiscovery.notifications." +
                                "fetchOrganizationDiscoveryAttributes.genericError.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("console:manage.features.organizationDiscovery.notifications." +
                            "fetchOrganizationDiscoveryAttributes.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.organizationDiscovery.notifications." +
                            "fetchOrganizationDiscoveryAttributes.genericError.message")
                    }));
                });
        }, [ dispatch, t ]);

    useEffect(() => {
        const path: string[] = location.pathname.split("/");
        const id: string = path[path.length - 1];

        getOrganizationData(id);
        getOrganizationDiscoveryData(id);
    }, [ location, getOrganizationData, getOrganizationDiscoveryData ]);

    const goBackToOrganizationListWithDomains: () => void = useCallback(() =>
        history.push(AppConstants.getPaths().get("EMAIL_DOMAIN_DISCOVERY")),[ history ]
    );


    return (
        <PageLayout
            title={ organization?.name ?? t("console:manage.features.organizationDiscovery.title") }
            pageTitle={ organization?.name ?? t("console:manage.features.organizationDiscovery.title") }
            description={ t("console:manage.features.organizationDiscovery.edit.description") }
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
                "data-testid": "org-email-domains-edit-org-back-button",
                onClick: goBackToOrganizationListWithDomains,
                text: t("console:manage.features.organizationDiscovery.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditOrganizationEmailDomains
                organization={ organization }
                organizationDiscoveryData = { organizationDiscoveryData }
                isReadOnly={ isReadOnly }
                onOrganizationUpdate={ getOrganizationData }
            />
        </PageLayout>
    );
};

export default OrganizationEmailDomainEditPage;
