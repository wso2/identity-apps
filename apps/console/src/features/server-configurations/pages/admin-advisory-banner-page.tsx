/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { SettingsSection } from "../../../extensions/components/governance-connectors/settings";
import { AppConstants, history } from "../../core";
import { useAdminAdvisoryBannerConfigs } from "../api";

/**
 * Props for the Admin Advisory page.
 */
type AdminAdvisoryBannerPageInterface = IdentifiableComponentInterface;

/**
 * Admin Advisory page.
 *
 * @param props - Props injected to the component.
 * @returns Admin Advisory page.
 */
export const AdminAdvisoryBannerPage: FC<AdminAdvisoryBannerPageInterface> = (
    props: AdminAdvisoryBannerPageInterface
): ReactElement => {

    const { [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        data: adminAdvisoryConfigs,
        isLoading: isAdminAdvisoryConfigsGetRequestLoading,
        error: adminAdvisoryConfigsGetRequestError
    } = useAdminAdvisoryBannerConfigs();

    /**
     * Handle admin advisory banner configuration.
     */
    const handleAdminAdvisoryBannerConfiguration = () => {
        history.push(AppConstants.getPaths().get("ADMIN_ADVISORY_BANNER_EDIT"));
    };

    useEffect(() => {
        if (!adminAdvisoryConfigsGetRequestError) {

            return;
        }

        dispatch(addAlert<AlertInterface>({
            description: t("extensions:develop.branding.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("extensions:develop.branding.notifications.fetch.genericError.message")
        }));
    }, [ adminAdvisoryConfigsGetRequestError ]);

    return (
        <PageLayout
            title={ t("console:manage.features.serverConfigs.adminAdvisory.pageHeading") }
            pageTitle={ t("console:manage.features.serverConfigs.adminAdvisory.pageHeading") }
            description={ t("console:manage.features.serverConfigs.adminAdvisory.pageSubheading") }
            data-testid={ `${ componentId }-page-layout` }
            isLoading={ isAdminAdvisoryConfigsGetRequestLoading }
        >
            <SettingsSection
                data-testid={ `${ componentId }-settings-section` }
                description={ t("console:manage.features.serverConfigs.adminAdvisory." +
                    "configurationSection.description") }
                header={ t("console:manage.features.serverConfigs.adminAdvisory.configurationSection.heading") }
                onPrimaryActionClick={ handleAdminAdvisoryBannerConfiguration }
                primaryAction={ t("common:configure") }
                connectorEnabled={ adminAdvisoryConfigs?.enableBanner }
            >
            </SettingsSection>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
AdminAdvisoryBannerPage.defaultProps = {
    "data-componentid": "admin-advisory"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AdminAdvisoryBannerPage;
