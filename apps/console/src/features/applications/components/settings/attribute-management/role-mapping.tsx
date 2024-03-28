/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, RoleListInterface, RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DynamicField, KeyValue } from "@wso2is/forms";
import { Heading } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { getRolesList } from "../../../../roles/api";
import { RoleMappingInterface } from "../../../models";

interface RoleMappingPropsInterface extends TestableComponentInterface {
    /**
     * Trigger submission or not.
     */
    submitState?: boolean;
    /**
     * Function to be called on submission.
     *
     * @param roleMappings - list of role mappings.
     */
    onSubmit?: (roleMappings: RoleMappingInterface[]) => void;
    /**
     * Initial values of the role mapping.
     */
    initialMappings: RoleMappingInterface[];
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Function to be called on value changes.
     *
     * @param data - list of role mappings.
     */
    onChange?: (data: RoleMappingInterface[]) => void;
}

/**
 * Role mapping component.
 *
 * @param props - Props injected to the component.
 *
 * @returns RoleMapping component.
 */
export const RoleMapping: FunctionComponent<RoleMappingPropsInterface> = (
    props: RoleMappingPropsInterface
): React.ReactElement => {

    const {
        initialMappings,
        readOnly,
        onChange,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();
    const dispatch: Dispatch = useDispatch();

    const [ roleList, setRoleList ] = useState<RolesInterface[]>();

    /**
     * Filter out Application related and Internal roles.
     */
    const getFilteredRoles = () => {
        const filterRole: RolesInterface[] = roleList.filter(
            (role: RolesInterface) => {
                return !(role.displayName.includes("Application/") || role.displayName.includes("Internal/"));
            });

        return filterRole.map((role: RolesInterface) => {
            return {
                id: role.displayName,
                value: role.displayName
            };
        });
    };

    useEffect(() => {
        getRolesList(null)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    const allRole: RoleListInterface = response.data;

                    setRoleList(allRole.Resources);
                }
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("roles:notifications.fetchRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:notifications.fetchRoles.genericError.message")
                }));
            });
    }, [ initialMappings ]);

    return (
        <>
            { (UIConfig?.legacyMode?.roleMapping) && (
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Heading as="h5">
                            { t("applications:edit.sections.attributes.roleMapping." +
                                "heading") }
                        </Heading>
                        <DynamicField
                            bottomMargin={ false }
                            data={
                                initialMappings ?
                                    initialMappings.map((mapping: RoleMappingInterface) => {
                                        return {
                                            key: mapping.localRole.includes("/")
                                                ? mapping.localRole.split("/")[1]
                                                : mapping.localRole,
                                            value: mapping.applicationRole
                                        };
                                    }) : []
                            }
                            keyType="dropdown"
                            keyData={ roleList ? getFilteredRoles() : [] }
                            keyName={
                                t("applications:edit.sections.attributes.forms.fields." +
                                "dynamic.localRole.label")
                            }
                            valueName={
                                t("applications:edit.sections.attributes.forms.fields." +
                                "dynamic.applicationRole.label")
                            }
                            keyRequiredMessage={
                                t("applications:edit.sections.attributes.forms.fields." +
                                "dynamic.localRole.validations.empty")
                            }
                            valueRequiredErrorMessage={
                                t("applications:edit.sections.attributes.forms.fields." +
                                "dynamic.applicationRole.validations.empty")
                            }
                            duplicateKeyErrorMsg={
                                t("applications:edit.sections.attributes.forms.fields." +
                                "dynamic.applicationRole.validations.duplicate")
                            }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-dynamic-field` }
                            listen={ (data: KeyValue[]) => {
                                if (onChange) {
                                    const finalData: RoleMappingInterface[] = data?.map((mapping: KeyValue) => {
                                        return {
                                            applicationRole: mapping.value,
                                            localRole: mapping.key.includes("/")
                                                ? mapping.key
                                                : "Internal/" + mapping.key
                                        };
                                    }) ?? [];

                                    onChange(finalData);
                                }
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
            ) }
        </>
    );
};

/**
 * Default props for the application role mapping component.
 */
RoleMapping.defaultProps = {
    "data-testid": "application-role-mapping"
};
