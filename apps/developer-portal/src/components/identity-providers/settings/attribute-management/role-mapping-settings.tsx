/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { getRolesList } from "../../../../api";
import { IdentityProviderRoleMappingInterface, RoleListInterface, RolesInterface } from "../../../../models";
import { DynamicField } from "../../../shared";
import { handleGetRoleListError } from "../../utils";

/**
 * Proptypes for the identity providers settings component.
 */
interface RoleMappingSettingsPropsInterface {

    /**
     * Trigger submission.
     */
    triggerSubmit: boolean;

    /**
     *  Handle submission.
     */
    onSubmit?: (roleMappings: IdentityProviderRoleMappingInterface[]) => void;

    /**
     * Roles of the IDP
     */
    initialRoleMappings?: IdentityProviderRoleMappingInterface[];
}

/**
 *  Identity Provider and advance settings component.
 *
 * @param {IdentityProviderSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const RoleMappingSettings: FunctionComponent<RoleMappingSettingsPropsInterface> = (
    props: RoleMappingSettingsPropsInterface
): ReactElement => {

    const [roleList, setRoleList] = useState<RolesInterface[]>();

    const {
        onSubmit,
        triggerSubmit,
        initialRoleMappings
    } = props;

    const { t } = useTranslation();

    /**
     * Filter out Application related and Internal roles
     */
    const getFilteredRoles = () => {
        const filterRole: RolesInterface[] = roleList.filter(
            (role) => {
                return !(role.displayName.includes("Application/") || role.displayName.includes("Internal/"))
            });

        return filterRole.map(role => {
            return {
                id: role.displayName,
                value: role.displayName
            }
        });
    };

    useEffect(() => {
        getRolesList(null)
            .then((response) => {
                if (response.status === 200) {
                    const allRole: RoleListInterface = response.data;
                    setRoleList(allRole.Resources);
                }
            })
            .catch((error) => {
                handleGetRoleListError(error);
            });
    }, [initialRoleMappings]);

    return (
        <>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <Divider/>
                    <Heading as="h5">{ t("devPortal:components.idp.forms.roleMapping.heading") }</Heading>
                    <DynamicField
                        data={
                            initialRoleMappings ?
                                initialRoleMappings.map(mapping => {
                                    return {
                                        key: mapping.localRole,
                                        value: mapping.idpRole
                                    }
                                }) : []
                        }
                        keyType="dropdown"
                        keyData={ roleList ? getFilteredRoles() : [] }
                        keyName={ t("devPortal:components.idp.forms.roleMapping.keyName") }
                        valueName={ t("devPortal:components.idp.forms.roleMapping.valueName") }
                        keyRequiredMessage={ t("devPortal:components.idp.forms.roleMapping." +
                            "validation.keyRequiredMessage") }
                        valueRequiredErrorMessage={ t("devPortal:components.idp.forms.roleMapping." +
                            "validation.valueRequiredErrorMessage") }
                        duplicateKeyErrorMsg={ t("devPortal:components.idp.forms.roleMapping." +
                            "validation.duplicateKeyErrorMsg") }
                        submit={ triggerSubmit }
                        update={ (data) => {
                            if (data.length > 0) {
                                const finalData: IdentityProviderRoleMappingInterface[] = data.map(mapping => {
                                    return {
                                        idpRole: mapping.value,
                                        localRole: mapping.key
                                    }
                                });
                                onSubmit(finalData);
                            } else {
                                onSubmit([]);
                            }
                        } }
                    />
                    <Hint>{ t("devPortal:components.idp.forms.roleMapping.hint") }</Hint>
                </Grid.Column>
            </Grid.Row>
        </>
    );
};
