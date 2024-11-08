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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, PageLayout, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import SystemSettingsTabs from "../components/system-settings/system-settings-tabs";

/**
 * Props interface of {@link SystemSettingsPage}
 */
export type SystemSettingsPageProps = IdentifiableComponentInterface;

/**
 * Page for maintaining system wide settings applicable to all the root organizations.
 *
 * @param props - Props injected to the component.
 * @returns System Settings page component.
 */
const SystemSettingsPage: FunctionComponent<SystemSettingsPageProps> = ({
    ["data-componentid"]: componentId = "root-organizations-page"
}: SystemSettingsPageProps): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    return (
        <PageLayout
            pageTitle={ "System Settings" }
            title={ t("tenants:systemSettings.title") }
            description={
                (<>
                    { t("tenants:systemSettings.subtitle") }
                    <DocumentationLink
                        link={ getLink("develop.multiTenancy.systemSettings.learnMore") }
                        showEmptyLink={ false }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>)
            }
            data-componentid={ `${componentId}-layout` }
            backButton={ {
                "data-componentid": `${componentId}-back-button`,
                onClick: () => history.push(AppConstants.getPaths().get("TENANTS")),
                text: t("tenants:systemSettings.backButton")
            } }
            className="system-settings-page"
        >
            <SystemSettingsTabs />
        </PageLayout>
    );
};

export default SystemSettingsPage;
