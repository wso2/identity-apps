/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { SBACInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { OrganizationAttributes } from "./organization-attributes";
import { OrganizationOverview } from "./organization-overview";
import { FeatureConfigInterface } from "../../../core";
import { OrganizationResponseInterface } from "../../models";

interface EditOrganizationPropsInterface extends SBACInterface<FeatureConfigInterface> {
    /**
     * Organization Info
     */
    organization: OrganizationResponseInterface;

    /**
     * Is Readonly access
     */
    isReadOnly: boolean;

    /**
     * on org update callback
     */
    onOrganizationUpdate: (orgId: string) => void;

    /**
     * on org delete callback
     */
    onOrganizationDelete: (orgId: string) => void;
}

export const EditOrganization: FunctionComponent<EditOrganizationPropsInterface> = (
    props: EditOrganizationPropsInterface
): JSX.Element => {

    const {
        organization,
        isReadOnly,
        onOrganizationUpdate,
        onOrganizationDelete
    } = props;

    const { t } = useTranslation();

    const panes = () => ([
        {
            menuItem: t("console:manage.features.organizations.edit.tabTitles.overview"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <OrganizationOverview
                        organization={ organization }
                        isReadOnly={ isReadOnly }
                        onOrganizationUpdate={ onOrganizationUpdate }
                        onOrganizationDelete={ onOrganizationDelete }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("console:manage.features.organizations.edit.tabTitles.attributes"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <OrganizationAttributes
                        organization={ organization }
                        isReadOnly={ isReadOnly }
                        onAttributeUpdate={ onOrganizationUpdate }
                    />
                </ResourceTab.Pane>
            )
        }
    ]);

    return (
        <ResourceTab
            panes={ panes() }
        />
    );

};
