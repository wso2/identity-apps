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

import { AppState } from "@wso2is/admin.core.v1";
import { getOrganizationRoles } from "@wso2is/admin.organizations.v1/api";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import {
    OrganizationResponseInterface,
    OrganizationRoleListItemInterface,
    OrganizationRoleListResponseInterface
} from "@wso2is/admin.organizations.v1/models";
import { getRolesList } from "@wso2is/admin.roles.v2/api/roles";
import { RoleListInterface, RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { DynamicField, KeyValue } from "@wso2is/forms";
import { Heading, Hint } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import { ConnectionManagementConstants } from "../../../../constants/connection-constants";
import { ConnectionRoleMappingInterface } from "../../../../models/connection";
import { handleGetRoleListError } from "../../../../utils/connection-utils";

/**
 * Proptypes for the identity providers settings component.
 */
interface RoleMappingSettingsPropsInterface extends TestableComponentInterface {

    /**
     * Trigger submission.
     */
    triggerSubmit: boolean;

    /**
     *  Handle submission.
     */
    onSubmit?: (roleMappings: ConnectionRoleMappingInterface[]) => void;

    /**
     * Roles of the IDP
     */
    initialRoleMappings?: ConnectionRoleMappingInterface[];
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
}

/**
 *  Identity Provider and advance settings component.
 *
 * @param props - Props injected to the component.
 * @returns Role mapping settings component.
 */
export const RoleMappingSettings: FunctionComponent<RoleMappingSettingsPropsInterface> = (
    props: RoleMappingSettingsPropsInterface
): ReactElement => {

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization);
    const [ roleList, setRoleList ] = useState<RolesInterface[] | OrganizationRoleListItemInterface[]>();

    const {
        onSubmit,
        triggerSubmit,
        initialRoleMappings,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { isSuperOrganization } = useGetCurrentOrganizationType();

    /**
     * Filter out Application related and Internal roles
     */
    const getFilteredRoles = () => {
        const filterRole: RolesInterface[] | OrganizationRoleListItemInterface[] = roleList.filter(
            (role: RolesInterface) => {
                return !(role.displayName.includes("Application/") || role.displayName.includes("Internal/"));
            });

        return filterRole.map((role: OrganizationRoleListItemInterface) => {
            return {
                id: role.displayName,
                value: role.displayName
            };
        });
    };

    useEffect(() => {
        if (isSuperOrganization()) {
            getRolesList(null)
                .then((response: AxiosResponse) => {
                    if (response.status === 200) {
                        const allRole: RoleListInterface = response.data;

                        setRoleList(allRole.Resources);
                    }
                })
                .catch((error: AxiosError) => {
                    handleGetRoleListError(error);
                });
        } else {
            getOrganizationRoles(currentOrganization.id, null, null, null)
                .then((response: OrganizationRoleListResponseInterface) => {
                    setRoleList(response.Resources);
                });
        }
    }, [ initialRoleMappings ]);


    /**
     * Prepends `Internal/` to the role name if it does not have a domain prepended already.
     *
     * @param role - The role name as received from the API response.
     *
     * @returns Resolved role name.
     */
    const resolveRoleName = (role: string): string => {
        if (role.split("/").length === 1) {
            return `${ ConnectionManagementConstants.INTERNAL_DOMAIN }${ role }`;
        }

        return role;
    };

    /**
     * Removes `Internal/` part from the role name if it is present.
     *
     * @param role - The role name as received from the API response.
     *
     * @returns Resolved role display name.
     */
    const resolveRoleDisplayName = (role: string): string => {
        const roleParts: string[] = role.split("/");

        if (roleParts.length > 1) {
            if (roleParts[ 0 ] === ConnectionManagementConstants.INTERNAL_DOMAIN.slice(0, -1)) {
                return roleParts[ 1 ];
            }
        }

        return role;
    };

    return (
        <>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <Heading as="h4">
                        { t("authenticationProvider:forms.roleMapping.heading") }
                    </Heading>
                    <DynamicField
                        bottomMargin={ false }
                        data={
                            initialRoleMappings ?
                                initialRoleMappings.map((mapping: ConnectionRoleMappingInterface) => {
                                    return {
                                        key: resolveRoleDisplayName(mapping.localRole),
                                        value: mapping.idpRole
                                    };
                                }) : []
                        }
                        keyType="dropdown"
                        keyData={ roleList ? getFilteredRoles() : [] }
                        keyName={ t("authenticationProvider:forms.roleMapping.keyName") }
                        valueName={ t("authenticationProvider:forms.roleMapping.valueName") }
                        keyRequiredMessage={ t("authenticationProvider:forms.roleMapping." +
                            "validation.keyRequiredMessage") }
                        valueRequiredErrorMessage={ t("authenticationProvider:forms." +
                            "roleMapping.validation.valueRequiredErrorMessage") }
                        duplicateKeyErrorMsg={ t("authenticationProvider:forms.roleMapping." +
                            "validation.duplicateKeyErrorMsg") }
                        submit={ triggerSubmit }
                        listen={ (data: KeyValue[]) => {
                            if (data.length > 0) {
                                const finalData: ConnectionRoleMappingInterface[] = data.map(
                                    (mapping: KeyValue) => {
                                        return {
                                            idpRole: mapping.value,
                                            localRole: resolveRoleName(mapping.key)
                                        };
                                    });

                                onSubmit(finalData);
                            } else {
                                onSubmit([]);
                            }
                        } }
                        data-testid={ testId }
                        readOnly={ isReadOnly }
                    />
                    <Hint>{ t("authenticationProvider:forms.roleMapping.hint") }</Hint>
                </Grid.Column>
            </Grid.Row>
        </>
    );
};

/**
 * Default proptypes for the role mapping settings component.
 */
RoleMappingSettings.defaultProps = {
    "data-testid": "idp-edit-attribute-settings-role-mapping"
};
