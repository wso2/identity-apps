/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppState } from "@wso2is/admin.core.v1/store";
import { getSharedOrganizations } from "@wso2is/admin.organizations.v1/api/organization";
import {
    OrganizationInterface,
    OrganizationResponseInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import ApplicationContext from "../context/application-context";
import M2MApplicationTemplate from "../data/application-templates/templates/m2m-application/m2m-application.json";
import MobileTemplate from "../data/application-templates/templates/mobile-application/mobile-application.json";
import OIDCWebApplicationTemplate from
    "../data/application-templates/templates/oidc-web-application/oidc-web-application.json";
import SinglePageApplicationTemplate from
    "../data/application-templates/templates/single-page-application/single-page-application.json";
import {
    ApplicationInterface,
    ApplicationTemplateListItemInterface,
    additionalSpProperty
} from "../models/application";

interface ApplicationProviderProps {
    children: React.ReactNode;
    template: ApplicationTemplateListItemInterface;
    application: ApplicationInterface
}

export default function ApplicationProvider (props: ApplicationProviderProps) {
    const { children, template, application } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const [ isSPAApplication, setSPAApplication ] = useState<boolean>(false);
    const [ isOIDCWebApplication, setOIDCWebApplication ] = useState<boolean>(false);
    const [ isMobileApplication, setMobileApplication ] = useState<boolean>(false);
    const [ isM2MApplication, setM2MApplication ] = useState<boolean>(false);
    const [ isAppShared, setIsAppShared ] = useState<boolean>(false);

    const [ sharedOrganizationsList, setSharedOrganizationsList ] = useState<Array<OrganizationInterface>>(undefined);

    const currentOrganization: OrganizationResponseInterface = useSelector((state: AppState) =>
        state.organization.organization);

    useEffect(() => {
        if (sharedOrganizationsList) {
            return;
        }

        getSharedOrganizations(
            currentOrganization.id,
            application.id
        ).then((response: AxiosResponse) => {
            setSharedOrganizationsList(response.data.organizations);
        }).catch((error: IdentityAppsApiException) => {
            if (error.response.data.description) {
                dispatch(
                    addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:edit.sections.shareApplication" +
                                    ".getSharedOrganizations.genericError.message")
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: t("applications:edit.sections.shareApplication" +
                                ".getSharedOrganizations.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.shareApplication" +
                                ".getSharedOrganizations.genericError.message")
                })
            );
        }
        );
    }, [ application, currentOrganization ]);

    useEffect(() => {
        if (template.id == SinglePageApplicationTemplate.id) {
            setSPAApplication(true);
        }

        if (template.id == OIDCWebApplicationTemplate.id) {
            setOIDCWebApplication(true);
        }

        if (template?.id == MobileTemplate?.id) {
            setMobileApplication(true);
        }

        if (template.id === M2MApplicationTemplate.id) {
            setM2MApplication(true);
        }
    }, [ template ]);

    useEffect(() => {
        const isSharedWithAll: additionalSpProperty[] = application?.advancedConfigurations
            ?.additionalSpProperties?.filter((property: additionalSpProperty) =>
                property?.name === "shareWithAllChildren");

        if ((sharedOrganizationsList?.length > 0) || (isSharedWithAll?.length > 0 &&
                JSON.parse(isSharedWithAll[ 0 ].value))) {

            setIsAppShared(true);
        }

    }, [ sharedOrganizationsList ]);

    return (
        <ApplicationContext.Provider
            value={ {
                isAppShared: isAppShared,
                isM2MApplication: isM2MApplication,
                isMobileApplication: isMobileApplication,
                isOIDCWebApplication: isOIDCWebApplication,
                isSpaApplication: isSPAApplication
            } }>
            { children }
        </ApplicationContext.Provider>
    );
}
