/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteChildrenProps } from "react-router-dom";
import { organizationConfigs } from "../../../extensions";
import { AppConstants, FeatureConfigInterface, history } from "../../core";
import { getOrganization, useAuthorizedOrganizationsList } from "../api";
import { EditOrganization } from "../components/edit-organization/edit-organization";
import { OrganizationIcon } from "../configs";
import { OrganizationManagementConstants } from "../constants";
import { OrganizationResponseInterface } from "../models";


interface OrganizationEditPagePropsInterface extends SBACInterface<FeatureConfigInterface>,
    TestableComponentInterface, RouteChildrenProps{
}

const OrganizationEditPage: FunctionComponent<OrganizationEditPagePropsInterface> = (
    props: OrganizationEditPagePropsInterface
): ReactElement => {

    const {
        featureConfig,
        location
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ organization, setOrganization ] = useState<OrganizationResponseInterface>();
    const [ isReadOnly, setIsReadOnly ] = useState(true);
    const [ isAuthorizedOrganization, setIsAuthorizedOrganization ] = useState(false);
    const [ filterQuery, setFilterQuery ] = useState<string>("");


    useEffect(() => {
        setIsReadOnly(
            !isFeatureEnabled(
                featureConfig?.organizations,
                OrganizationManagementConstants.FEATURE_DICTIONARY.get("ORGANIZATION_UPDATE")
            ) || organization?.status !== "ACTIVE" || !isAuthorizedOrganization);
    }, [ featureConfig, organization, isAuthorizedOrganization ]);

    const {
        data: authorizedOrganizationList,
        isLoading: isAuthorizedOrganizationListRequestLoading,
        error: authorizedListFetchRequestError
    } = useAuthorizedOrganizationsList(filterQuery, 10, null, null, false);

    /**
     * Handles the authorized list fetch request error.
     */
    useEffect(() => {
        if (!authorizedListFetchRequestError) {
            return;
        }

        handleGetAuthoriziedListCallError(authorizedListFetchRequestError);
    }, [ authorizedListFetchRequestError ]);

    /**
     * Handle check for authorized organization.
     */
    useEffect(() => {
        if (!authorizedOrganizationList) {
            return;
        }

        setIsAuthorizedOrganization(authorizedOrganizationList.organizations?.length === 1);
    }, [ authorizedOrganizationList ]);

    const handleGetAuthoriziedListCallError = (error) => {
        if (error?.response?.data?.description) {
            dispatch(
                addAlert({
                    description: error.description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.organizations.notifications." +
                        "getOrganizationList.error.message"
                    )
                })
            );

            return;
        }
        dispatch(
            addAlert({
                description: t(
                    "console:manage.features.organizations.notifications.getOrganizationList" +
                    ".genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.organizations.notifications." +
                    "getOrganizationList.genericError.message"
                )
            })
        );
        return;
    };

    const getOrganizationData = useCallback((organizationId: string) => {
        getOrganization(organizationId)
            .then((organization) => {
                setOrganization(organization);
                setFilterQuery("name eq " + organization?.name);
            }).catch((error) => {
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

    useEffect(() => {
        const path = location.pathname.split("/");
        const id = path[path.length - 1];

        getOrganizationData(id);
    }, [ location, getOrganizationData ]);

    const goBackToOrganizationList = useCallback(() =>
        history.push(AppConstants.getPaths().get("ORGANIZATIONS")),[ history ]
    );


    return (
        <PageLayout
            isLoading={ isAuthorizedOrganizationListRequestLoading }
            title={ organization?.name ?? t("console:manage.features.organizations.title") }
            pageTitle={ organization?.name ?? t("console:manage.features.organizations.title") }
            description={ t("console:manage.features.organizations.edit.description") }
            image={ (
                <GenericIcon
                    defaultIcon
                    relaxed="very"
                    shape="rounded"
                    size="x50"
                    icon={ OrganizationIcon }
                />
            ) }
            backButton={ organizationConfigs.canCreateOrganization() && {
                "data-testid": "org-mgt-edit-org-back-button",
                onClick: goBackToOrganizationList,
                text: t("console:manage.features.organizations.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditOrganization
                organization={ organization }
                isReadOnly={ isReadOnly }
                featureConfig={ featureConfig }
                onOrganizationUpdate={ getOrganizationData }
                onOrganizationDelete={ goBackToOrganizationList }
            />
        </PageLayout>
    );
};

export default OrganizationEditPage;
