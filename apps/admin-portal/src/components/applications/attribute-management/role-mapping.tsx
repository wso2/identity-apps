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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { useEffect, useState } from "react";
import { Divider, Grid } from "semantic-ui-react";
import { DynamicField } from "../../claims"
import { Heading } from "@wso2is/react-components";
import { RoleListInterface, RoleMappingInterface, RolesInterface } from "../../../models";
import { getRoleList } from "../../../api";
import { useDispatch } from "react-redux";

interface RoleMappingPropsInterface {
    /**
     *  Trigger submission or not
     */
    submitState: boolean;
    /**
     *  function to be called on submission
     * @param roleMappings
     */
    onSubmit?: (roleMappings: RoleMappingInterface[]) => void;
    /**
     * Initial values of the role mapping
     */
    initialMappings: RoleMappingInterface[];
}

export const RoleMapping = (props: RoleMappingPropsInterface): React.ReactElement => {

    const { onSubmit, submitState, initialMappings } = props;
    const [roleList, setRoleList] = useState<RolesInterface[]>();
    const dispatch = useDispatch();

    /**
     * Filter out Application related and Internal roles
     */
    const getFilteredRoles = () => {
        const filterRole: RolesInterface[] = roleList.filter(
            (role) => {
                return !(role.displayName.includes("Application/") || role.displayName.includes("Internal/"))
            });

        const finalRoles = filterRole.map(role => {
            return {
                value: role.displayName,
                id: role.displayName
            }
        });

        return finalRoles;
    };

    useEffect(() => {
        getRoleList(null)
            .then((response) => {
                if (response.status === 200) {
                    const allRole: RoleListInterface = response.data;
                    setRoleList(allRole.Resources);
                }
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred while retrieving roles.",
                    level: AlertLevels.ERROR,
                    message: "Get Error"
                }));
            });
    }, [initialMappings]);

    return (
        <>
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <Divider/>
                    <Divider hidden/>
                </Grid.Column>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    <Heading as="h5">Role Mapping</Heading>
                    <DynamicField
                        data={
                            initialMappings ?
                                initialMappings.map(mapping => {
                                    return {
                                        key: mapping.localRole,
                                        value: mapping.applicationRole
                                    }
                                }) : []
                        }
                        keyType="dropdown"
                        keyData={ roleList ? getFilteredRoles() : [] }
                        keyName="Local Role"
                        valueName="Application Role"
                        keyRequiredMessage="Please enter the local role"
                        valueRequiredErrorMessage="Please enter an attribute to map to"
                        duplicateKeyErrorMsg="This role is already mapped. Please select another role"
                        submit={ submitState }
                        update={ (data) => {
                            if (data.length > 0) {
                                const finalData: RoleMappingInterface[] = data.map(mapping => {
                                    return {
                                        localRole: mapping.key,
                                        applicationRole: mapping.value
                                    }
                                });
                                onSubmit(finalData);
                            } else {
                                onSubmit([]);
                            }
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
        </>
    )
};
