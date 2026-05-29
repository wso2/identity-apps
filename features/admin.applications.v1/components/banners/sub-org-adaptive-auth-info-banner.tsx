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
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import "./sub-org-adaptive-auth-info-banner.scss";

/**
 * Informational banner shown to sub-organization admins when adaptive
 * authentication is permitted but read-only — the script can only be
 * edited from the root organization's shared application.
 */
const SubOrgAdaptiveAuthInfoBanner = (): ReactElement => {

    const { t } = useTranslation();

    return (
        <Alert
            className="sub-org-adaptive-auth-info-banner"
            severity="warning"
            icon={ false }
        >
            {
                t("applications:edit.sections.signOnMethod.sections.authenticationFlow." +
                    "sections.scriptBased.subOrgInfoBanner")
            }
        </Alert>
    );
};

export default SubOrgAdaptiveAuthInfoBanner;
