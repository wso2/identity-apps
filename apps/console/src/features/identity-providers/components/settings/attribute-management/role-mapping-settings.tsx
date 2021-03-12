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

import {getRolesList} from "@wso2is/core/api";
import {RoleListInterface, RolesInterface, TestableComponentInterface} from "@wso2is/core/models";
import {DynamicField, Heading, Hint} from "@wso2is/react-components";
import React, {FunctionComponent, ReactElement, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Grid} from "semantic-ui-react";
import {getGroupList} from "../../../../groups/api";
import {IdentityProviderRoleMappingInterface} from "../../../models";
import {GroupListInterface, GroupsInterface} from "../../../../groups/models";
import {useSelector} from "react-redux";
import {AppState} from "../../../../core/store";
import {handleGetRoleListError} from "../../utils";

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

    const [groupList, setGroupList] = useState<GroupsInterface[]>();
    const [roleList, setRoleList] = useState<RolesInterface[]>();

    const isGroupAndRoleSeparationEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isGroupAndRoleSeparationEnabled);

    const isGroupAndRoleSeparationImprovementsEnabledFlag = useSelector((state: AppState) =>
        state?.config?.ui?.isGroupAndRoleSeparationImprovementsEnabled);

    const getGroupAndRoleSeparationImprovementsEnabled = (
        groupRoleSeparationEnabledFlag: boolean, groupRoleSeparationImprovementsEnabledFlag: boolean): boolean => {
        return groupRoleSeparationEnabledFlag ? groupRoleSeparationImprovementsEnabledFlag : false;
    }

    const isGroupAndRoleSeparationImprovementsEnabled = getGroupAndRoleSeparationImprovementsEnabled(
        isGroupAndRoleSeparationEnabled, isGroupAndRoleSeparationImprovementsEnabledFlag);

    const roleOrGroupMapping = isGroupAndRoleSeparationImprovementsEnabled ? "groupMapping" : "roleMapping";

    const {
        onSubmit,
        triggerSubmit,
        initialRoleMappings,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const getGroups = () => {
        return groupList.map(group => {
            return {
                id: group.displayName,
                value: group.displayName
            };
        });
    };

    const getRoles = () => {
        const filterRole: RolesInterface[] = roleList.filter(
            (role) => {
                return !(role.displayName.includes("Application/") || role.displayName.includes("Internal/"));
            });

        return filterRole.map(role => {
            return {
                id: role.displayName,
                value: role.displayName
            };
        });
    };

    useEffect(() => {
        isGroupAndRoleSeparationImprovementsEnabled ?
            getGroupList(null)
                .then((response) => {
                    if (response.status === 200) {
                        const allGroup: GroupListInterface = response.data;
                        setGroupList(allGroup.Resources);
                    }
                })
            :
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
                    <Heading as="h4">{ t("console:develop.features.idp.forms." + roleOrGroupMapping + ".heading") }</Heading>
                    <DynamicField
                        bottomMargin={ false }
                        data={
                            initialRoleMappings ?
                                initialRoleMappings.map(mapping => {
                                    return {
                                        key: mapping.localRole,
                                        value: mapping.idpRole
                                    };
                                }) : []
                        }
                        keyType="dropdown"
                        keyData={ isGroupAndRoleSeparationImprovementsEnabled ?
                            ( groupList ? getGroups() : [] )
                            :
                            ( roleList ? getRoles() : [] )
                        }
                        keyName={ t("console:develop.features.idp.forms." + roleOrGroupMapping + ".keyName") }
                        valueName={ t("console:develop.features.idp.forms." + roleOrGroupMapping + ".valueName") }
                        keyRequiredMessage={ t("console:develop.features.idp.forms." + roleOrGroupMapping + "." +
                            "validation.keyRequiredMessage") }
                        valueRequiredErrorMessage={ t("console:develop.features.idp.forms." + roleOrGroupMapping + "." +
                            "validation.valueRequiredErrorMessage") }
                        duplicateKeyErrorMsg={ t("console:develop.features.idp.forms." + roleOrGroupMapping + "." +
                            "validation.duplicateKeyErrorMsg") }
                        submit={ triggerSubmit }
                        update={ (data) => {
                            if (data.length > 0) {
                                const finalData: IdentityProviderRoleMappingInterface[] = data.map(mapping => {
                                    return {
                                        idpRole: mapping.value,
                                        localRole: mapping.key
                                    };
                                });
                                onSubmit(finalData);
                            } else {
                                onSubmit([]);
                            }
                        } }
                        data-testid={ testId }
                    />
                    <Hint>{ t("console:develop.features.idp.forms." + roleOrGroupMapping + ".hint") }</Hint>
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
