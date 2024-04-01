/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, RolesInterface } from "@wso2is/core/models";
import { TabPageLayout } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppConstants, AppState, history } from "../../admin-core-v1";
import { getRoleById } from "../api/roles";
import { EditRole } from "../components/edit-role/edit-role";
import { RoleConstants } from "../constants/role-constants";

const RoleEditPage: FunctionComponent<any> = (): ReactElement => {

    const { t } = useTranslation();

    const featureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userV1Roles);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const isReadOnly: boolean = useMemo(() => {
        return !isFeatureEnabled(featureConfig,
            RoleConstants.FEATURE_DICTIONARY.get("ROLE_UPDATE")) ||
            !hasRequiredScopes(featureConfig,
                featureConfig?.scopes?.update, allowedScopes);
    }, [ featureConfig, allowedScopes ]);

    const [ roleId, setRoleId ] = useState<string>(undefined);
    const [ roleObject, setRoleObject ] = useState<RolesInterface>();
    const [ isRoleDetailsRequestLoading, setIsRoleDetailsRequestLoading ] = useState<boolean>(false);

    const getRoleDetails = (roleId: string ): void => {
        setIsRoleDetailsRequestLoading(true);

        getRoleById(roleId)
            .then((response: AxiosResponse) => {
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
        const path: string[] = history.location.pathname.split("/");
        const roleId: string = path[ path.length - 1 ];

        setRoleId(roleId);
        getRoleDetails(roleId);
    }, []);

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("ROLES"));
    };

    return (
        <TabPageLayout
            isLoading={ isRoleDetailsRequestLoading }
            title={
                roleObject && roleObject?.displayName ?
                    roleObject?.displayName :
                    t("pages:rolesEdit.title")
            }
            pageTitle={ t("pages:rolesEdit.title") }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("pages:rolesEdit.backButton", { type: "roles" })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditRole
                isLoading={ isRoleDetailsRequestLoading }
                roleObject={ roleObject }
                roleId={ roleId }
                onRoleUpdate={ onRoleUpdate }
                readOnly={ isReadOnly }
            />
        </TabPageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RoleEditPage;
