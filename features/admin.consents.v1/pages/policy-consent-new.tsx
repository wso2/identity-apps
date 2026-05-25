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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { EditPolicyConsent } from "../components/edit-policy-consent";

/**
 * Props interface for the Policy Consent new page component.
 */
type PolicyConsentNewPageProps = IdentifiableComponentInterface;

/**
 * Policy Consent creation page.
 *
 * @param props - Props injected to the component.
 * @returns Policy Consent new page component.
 */
const PolicyConsentNewPage: FunctionComponent<PolicyConsentNewPageProps> = (
    props: PolicyConsentNewPageProps
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "policy-consent-new-page"
    } = props;

    const { t } = useTranslation();

    return (
        <PageLayout
            pageTitle={ t("consents:pages.new.title") }
            title={ t("consents:pages.new.title") }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ `${componentId}-layout` }
            backButton={ {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: (): void => {
                    history.push(AppConstants.getPaths().get("POLICY_CONSENTS"));
                },
                text: t("consents:pages.new.backButton")
            } }
        >
            <EditPolicyConsent
                data-componentid={ componentId }
            />
        </PageLayout>
    );
};

export default PolicyConsentNewPage;
