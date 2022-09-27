/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AlertLevels, RoleListInterface, RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DynamicField, Heading, KeyValue } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { getRolesList } from "../../../../roles/api";
import { RoleMappingInterface } from "../../../models";

interface RoleMappingPropsInterface extends TestableComponentInterface {
    /**
     *  Trigger submission or not
     */
    submitState?: boolean;
    /**
     *  function to be called on submission
     * @param roleMappings
     */
    onSubmit?: (roleMappings: RoleMappingInterface[]) => void;
    /**
     * Initial values of the role mapping
     */
    initialMappings: RoleMappingInterface[];
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * function to be called on value changes.
     * @param data
     */
    onChange?: (data: RoleMappingInterface[]) => void;
}

/**
 * Role mapping component.
 *
 * @param {RoleMappingPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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

    const dispatch = useDispatch();

    const [ roleList, setRoleList ] = useState<RolesInterface[]>();

    /**
     * Filter out Application related and Internal roles
     */
    const getFilteredRoles = () => {
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
        getRolesList(null)
            .then((response) => {
                if (response.status === 200) {
                    const allRole: RoleListInterface = response.data;

                    setRoleList(allRole.Resources);
                }
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.roles.notifications.fetchRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.notifications.fetchRoles.genericError.message")
                }));
            });
    }, [ initialMappings ]);

    return (
        <>
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    <Heading as="h4">
                        { t("console:develop.features.applications.edit.sections.attributes.roleMapping.heading") }
                    </Heading>
                    <DynamicField
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
                            t("console:develop.features.applications.edit.sections.attributes.forms.fields.dynamic" +
                                ".localRole.label")
                        }
                        valueName={
                            t("console:develop.features.applications.edit.sections.attributes.forms.fields.dynamic" +
                                ".applicationRole.label")
                        }
                        keyRequiredMessage={
                            t("console:develop.features.applications.edit.sections.attributes.forms.fields.dynamic" +
                                ".localRole.validations.empty")
                        }
                        valueRequiredErrorMessage={
                            t("console:develop.features.applications.edit.sections.attributes.forms.fields.dynamic" +
                                ".applicationRole.validations.empty")
                        }
                        duplicateKeyErrorMsg={
                            t("console:develop.features.applications.edit.sections.attributes.forms.fields.dynamic" +
                                ".applicationRole.validations.duplicate")
                        }
                        readOnly={ readOnly }
                        data-testid={ `${ testId }-dynamic-field` } 
                        listen={ (data) => {
                            if (onChange) {
                                const finalData: RoleMappingInterface[] = data?.map((mapping: KeyValue) => {
                                    return {
                                        applicationRole: mapping.value,
                                        localRole: mapping.key.includes("/") ? mapping.key : "Internal/" + mapping.key
                                    };
                                }) ?? [];
    
                                onChange(finalData);
                            }
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
        </>
    );
};

/**
 * Default props for the application role mapping component.
 */
RoleMapping.defaultProps = {
    "data-testid": "application-role-mapping"
};
