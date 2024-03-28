/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../core";
import { getOrganizationRoleById } from "../api";
import { EditOrganizationRole } from "../components/edit-organization-role";
import { OrganizationResponseInterface, OrganizationRoleInterface } from "../models";

/**
 * Organization Roles edit page
 *
 * @returns OrganizationRolesEdit component
 */
const OrganizationRolesEdit: FunctionComponent = (): ReactElement => {

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ roleId, setRoleId ] = useState<string>(undefined);
    const [ roleObject, setRoleObject ] = useState<OrganizationRoleInterface>();
    const [ isRoleDetailsRequestLoading, setIsRoleDetailsRequestLoading ] = useState<boolean>(false);
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const getRoleDetails = (roleId: string ): void => {
        setIsRoleDetailsRequestLoading(true);

        getOrganizationRoleById(currentOrganization.id, roleId)
            .then(response => {
                if (response.status === 200) {
                    setRoleObject(response.data);
                }
            }).catch(() => {
            // TODO: handle error
            })
            .finally(() => {
                setIsRoleDetailsRequestLoading(false);
            });
    };

    const onRoleUpdate = (): void => {
        getRoleDetails(roleId);
    };

    /**
     * Get Role data from URL id
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const roleId = path[ path.length - 1 ];

        setRoleId(roleId);
        getRoleDetails(roleId);
    }, []);

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("ORGANIZATION_ROLES"));
    };

    return (
        <PageLayout
            isLoading={ isRoleDetailsRequestLoading }
            pageTitle={
                roleObject && roleObject?.displayName ?
                    roleObject?.displayName :
                    t("pages:rolesEdit.title")
            }
            title="Edit Organization Role"
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("pages:rolesEdit.backButton", { type: "roles" })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditOrganizationRole
                roleObject={ roleObject }
                roleId={ roleId }
                onRoleUpdate={ onRoleUpdate }
                featureConfig={ featureConfig }
            />
        </PageLayout>
    );

};

export default OrganizationRolesEdit;
