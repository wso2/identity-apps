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

import { Button, Divider, Grid } from "semantic-ui-react";
import { Heading, Hint } from "@wso2is/react-components";
import {
    IdentityProviderRoleMappingInterface,
    RoleListInterface,
    RolesInterface
} from "../../../models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/dist/src/store";
import { AlertLevels } from "@wso2is/core/dist/src/models";
import { DynamicField } from "../../claims";
import { getRolesList } from "../../../api";
import { useDispatch } from "react-redux";

/**
 * Proptypes for the identity providers settings component.
 */
interface IdentityProviderSettingsPropsInterface {

    /**
     * Currently editing idp id.
     */
    idpId: string;

    /**
     * Claims of the IDP
     */
    claims: string;

    /**
     * Roles of the IDP
     */
    initialRoleMappings?: IdentityProviderRoleMappingInterface[];

    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;

    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 *  Identity Provider and advance settings component.
 *
 * @param {IdentityProviderSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AttributeSettings: FunctionComponent<IdentityProviderSettingsPropsInterface> = (
    props: IdentityProviderSettingsPropsInterface
): ReactElement => {

    const [roleList, setRoleList] = useState<RolesInterface[]>();

    const {
        idpId,
        claims,
        initialRoleMappings,
        isLoading,
        onUpdate
    } = props;

    const dispatch = useDispatch();

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
                    console.log(response)
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
    }, [initialRoleMappings]);

    const onSubmit = (data) => {
        console.log(data)
    };

    const updateValues = () => {
        console.log("updating...")
    };

    return (
        <Grid className="claim-mapping">
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    <Heading as="h5">Claim Configuration</Heading>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    <Divider />
                    <Heading as="h5">Role Mapping</Heading>
                    <Hint>Map local roles with the Identity Provider roles</Hint>
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
                        keyName="Local Role"
                        valueName="Identity Provider Role"
                        keyRequiredMessage="Please enter the local role"
                        valueRequiredErrorMessage="Please enter an IDP role to map to"
                        duplicateKeyErrorMsg="This role is already mapped. Please select another role"
                        submit={ true }
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
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 }>
                    <Button
                        primary
                        size="small"
                        onClick={ updateValues }
                    >
                        Update
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
