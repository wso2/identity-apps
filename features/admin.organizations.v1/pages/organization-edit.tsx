/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { BasicUserInfo } from "@asgardeo/auth-react";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants";
import useSignIn from "@wso2is/admin.authentication.v1/hooks/use-sign-in";
import { AppConstants, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Button, GenericIcon, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteChildrenProps } from "react-router-dom";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { getOrganization, useAuthorizedOrganizationsList } from "../api";
import { EditOrganization } from "../components/edit-organization/edit-organization";
import { OrganizationIcon } from "../configs";
import { OrganizationManagementConstants } from "../constants";
import useOrganizationSwitch from "../hooks/use-organization-switch";
import { OrganizationInterface, OrganizationResponseInterface } from "../models";

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
    const dispatch: Dispatch = useDispatch();

    const [ organization, setOrganization ] = useState<OrganizationResponseInterface>();
    const [ isReadOnly, setIsReadOnly ] = useState(true);
    const [ isAuthorizedOrganization, setIsAuthorizedOrganization ] = useState(false);
    const [ filterQuery, setFilterQuery ] = useState<string>("");

    const { switchOrganization } = useOrganizationSwitch();
    const { onSignIn } = useSignIn();

    useEffect(() => {
        setIsReadOnly(
            !isFeatureEnabled(
                featureConfig?.organizations,
                OrganizationManagementConstants.FEATURE_DICTIONARY.get("ORGANIZATION_UPDATE")
            ) || !isAuthorizedOrganization);
    }, [ featureConfig, organization, isAuthorizedOrganization ]);

    const {
        data: authorizedOrganizationList,
        isLoading: isAuthorizedOrganizationListRequestLoading,
        error: authorizedListFetchRequestError
    } = useAuthorizedOrganizationsList(filterQuery, 10, null, null,
        ApplicationManagementConstants.CONSOLE_APP_NAME, false);

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

        const isOrgAuthorized: boolean = !!authorizedOrganizationList.organizations
            ?.find((org: OrganizationInterface) => org.id === organization?.id);

        setIsAuthorizedOrganization(isOrgAuthorized);
    }, [ authorizedOrganizationList ]);

    const handleGetAuthoriziedListCallError = (error: any) => {
        if (error?.response?.data?.description) {
            dispatch(
                addAlert({
                    description: error?.response?.data?.description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "organizations:notifications." +
                        "getOrganizationList.error.message"
                    )
                })
            );

            return;
        }
        dispatch(
            addAlert({
                description: t(
                    "organizations:notifications.getOrganizationList" +
                    ".genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "organizations:notifications." +
                    "getOrganizationList.genericError.message"
                )
            })
        );

        return;
    };

    const getOrganizationData: (organizationId: string) => void = useCallback((organizationId: string): void => {
        getOrganization(organizationId)
            .then((organization: OrganizationResponseInterface) => {
                setOrganization(organization);
                setFilterQuery("name eq " + organization?.name);
            }).catch((error: any) => {
                if (error?.description) {
                    dispatch(addAlert({
                        description: error.description,
                        level: AlertLevels.ERROR,
                        message: t("organizations:notifications.fetchOrganization." +
                            "genericError.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("organizations:notifications.fetchOrganization." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("organizations:notifications.fetchOrganization." +
                        "genericError.message")
                }));
            });
    }, [ dispatch, t ]);

    useEffect(() => {
        const path: string[] = location.pathname.split("/");
        const id: string = path[path.length - 1];

        getOrganizationData(id);
    }, [ location, getOrganizationData ]);

    const goBackToOrganizationList: () => void = useCallback(() =>
        history.push(AppConstants.getPaths().get("ORGANIZATIONS")),[ history ]
    );

    /**
     * Method that handles the organization switch.
     */
    const handleOrganizationSwitch = async (): Promise<void> => {
        let response: BasicUserInfo = null;

        try {
            response = await switchOrganization(organization.id);
            await onSignIn(response, () => null, () => null, () => null);

            history.push(AppConstants.getPaths().get("GETTING_STARTED"));
        } catch(e) {
            dispatch(
                addAlert({
                    description: t(
                        "organizations:switching.notifications.switchOrganization" +
                        ".genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "organizations:switching.notifications.switchOrganization" +
                        ".genericError.message"
                    )
                })
            );
        }
    };

    return (
        <PageLayout
            isLoading={ isAuthorizedOrganizationListRequestLoading }
            title={ organization?.name ?? t("organizations:title") }
            pageTitle={ organization?.name ?? t("organizations:title") }
            description={ isReadOnly
                ? t("organizations:view.description")
                : t("organizations:edit.description") }
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
                "data-testid": "org-mgt-edit-org-back-button",
                onClick: goBackToOrganizationList,
                text: t("organizations:edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            action={ !isReadOnly && organization?.status === "ACTIVE" && (
                <Button
                    basic
                    primary
                    data-componentid="org-mgt-edit-org-switch-button"
                    type="button"
                    onClick={ handleOrganizationSwitch }
                >
                    <Icon name="exchange" />
                    { t("organizations:switching.switchButton") }
                </Button>
            ) }
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
