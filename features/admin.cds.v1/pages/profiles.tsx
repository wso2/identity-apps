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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import ProfilesSection from "../components/profiles-section";
import { isCDSUnifiedProfileViewEnabled } from "../utils/ui-mode-utils";

const ProfilesPage: FunctionComponent = (): ReactElement => {

    const { t } = useTranslation();

    return (
        <PageLayout
            title={ t("customerDataService:profiles.page.title") }
            pageTitle={ t("customerDataService:profiles.page.pageTitle") }
            description={ t("customerDataService:profiles.page.description") }
            backButton={ isCDSUnifiedProfileViewEnabled()
                ? {
                    onClick: () => history.push(AppConstants.getPaths().get("CUSTOMER_DATA_PROFILE")),
                    text: t("customerDataService:landing.backButton")
                }
                : undefined
            }
            data-componentid="profiles-page-layout"
        >
            <ProfilesSection />
        </PageLayout>
    );
};

export default ProfilesPage;
