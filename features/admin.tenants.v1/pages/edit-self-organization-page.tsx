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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Card } from "semantic-ui-react";
import EditSelfOrganizationForm from "../components/edit-self-organization/edit-self-organization-form";
import "./edit-self-organization-page.scss";

/**
 * Props type of {@link EditSelfOrganizationPage}
 */
export type EditSelfOrganizationPageProps = IdentifiableComponentInterface;

/**
 * Component for editing an organization.
 *
 * @param props - Props injected to the component.
 * @returns Organization edit page component.
 */
const EditSelfOrganizationPage: FunctionComponent<EditSelfOrganizationPageProps> = ({
    ["data-componentid"]: componentId = "organization-edit-page"
}: EditSelfOrganizationPageProps): ReactElement => {

    const { t } = useTranslation();

    const organizationsFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state?.config?.ui?.features?.organizations
    );
    const hasOrganizationUpdatePermissions: boolean = useRequiredScopes(organizationsFeatureConfig?.scopes?.update);

    return (
        hasOrganizationUpdatePermissions ? (
            <PageLayout
                pageTitle={ t("tenants:editSelfOrganization.title") }
                title={ t("tenants:editSelfOrganization.title") }
                description={ t("tenants:editSelfOrganization.subtitle") }
                data-componentid={ `${componentId}-page-layout` }
                bottomMargin={ false }
                className="edit-self-organization-page"
            >
                <Card
                    data-componentid={ componentId }
                    className="edit-self-organization-content"
                >
                    <EditSelfOrganizationForm data-componentid={ `${componentId}-form` } readOnly={ false } />
                </Card>
            </PageLayout>
        ) : (
            <PageLayout
                pageTitle={ t("tenants:editSelfOrganization.readOnly.title") }
                title={ t("tenants:editSelfOrganization.readOnly.title") }
                description={ t("tenants:editSelfOrganization.readOnly.subtitle") }
                data-componentid={ `${componentId}-page-layout` }
                bottomMargin={ false }
                className="edit-self-organization-page"
            >
                <Card
                    data-componentid={ componentId }
                    className="edit-self-organization-content"
                >
                    <EditSelfOrganizationForm data-componentid={ `${componentId}-form` } />
                </Card>
            </PageLayout>
        )
    );
};

export default EditSelfOrganizationPage;
