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

import { Field, Forms, FormValue, Validation } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useState, useEffect } from "react";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN, PRIMARY_DOMAIN } from "../../../constants";
import { CreateRoleFormData, SearchRoleInterface } from "../../../models";
import { searchRoleList, getUserStoreList } from "../../../api";

/**
 * Interface to capture role basics props.
 */
interface RoleBasicProps {
    dummyProp?: string;
    triggerSubmit: boolean;
    initialValues: any;
    isAddGroup: boolean;
    onSubmit: (values: any) => void;
}

/**
 * Component to capture basic details of a new role.
 * 
 * @param props Role Basic prop types
 */
export const RoleBasics: FunctionComponent<RoleBasicProps> = (props: RoleBasicProps): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        initialValues,
        isAddGroup
    } = props;

    const [ isValidRoleName, setIsValidRoleName ] = useState<boolean>(true);
    const [ updatedRoleName, setUpdatedRoleName ] = useState<string>(initialValues?.roleName);
    const [ userStoreOptions, setUserStoresList ] = useState([]);

    /**
     * Triggers when updatedRoleName is changed.
     */
    useEffect(() => {
        setIsValidRoleName(false);
        validateRoleName(updatedRoleName);
    }, [ updatedRoleName ]);

    useEffect(() => {
        getUserStores();
    }, [isAddGroup])

    /**
     * Contains domains needed for role creation.
     * 
     * Note : Since primary domain is available all time, 
     *        hardcoded in the dropdown elements.
     * 
     * TODO : Discuss and add or remove the Hybrid domains 
     *        to the dropdown.
    */
    const groupDomains = [{
        key: -1, text: PRIMARY_DOMAIN, value: PRIMARY_DOMAIN
    }];

    const roleDomains = [{
        key: -1, text: APPLICATION_DOMAIN, value: APPLICATION_DOMAIN
    },{
        key: 0, text: INTERNAL_DOMAIN, value: INTERNAL_DOMAIN
    }];

    /**
     * Util method to validate if the provided role name exists in the system.
     * 
     * @param roleName - new role name user entered.
     */
    const validateRoleName = (roleName: string): void => {
        const searchData: SearchRoleInterface = {
            filter: "displayName eq " + roleName,
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
            ],
            startIndex: 1
        }

        searchRoleList(searchData)
            .then((response) => {
                setIsValidRoleName(response?.data?.totalResults === 0);
            });
    };

    /**
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions = [
                { text: "Primary", key: -1, value: "primary" }
            ];
        let storeOption = { text: "", key: null, value: "" };
        getUserStoreList()
            .then((response) => {
                if (storeOptions === []) {
                    storeOptions.push(storeOption);
                }
                response.data.map((store, index) => {
                        storeOption = {
                            key: index,
                            text: store.name,
                            value: store.name
                        };
                        storeOptions.push(storeOption);
                    }
                );
                setUserStoresList(storeOptions);
            });

        setUserStoresList(storeOptions);
    };

    /**
     * The following function handles the change of the username.
     *
     * @param values - form values from the listen event.
     */
    const roleNameChangeListener = (values: Map<string, FormValue>): void => {
        setUpdatedRoleName(values?.get("rolename")?.toString());
    };

    /**
     * Util method to collect form data for processing.
     * 
     * @param values - contains values from form elements
     */
    const getFormValues = (values: any): CreateRoleFormData => {
        return {
            domain: values.get("domain").toString(),
            roleName: values.get("rolename").toString()
        };
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
             <Grid>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="dropdown"
                            label={ isAddGroup ? "Userstore" : "Role Type" }
                            name="domain"
                            children={ isAddGroup ? userStoreOptions : roleDomains }
                            placeholder="Domain"
                            requiredErrorMessage={ isAddGroup ? "Select user store" : "Select Role Type" }
                            required={ true }
                            element={ <div></div> }
                            value={ initialValues?.domain ? 
                                    initialValues?.domain : 
                                        isAddGroup ? 
                                            userStoreOptions[0]?.value : roleDomains[0].value 
                            }
                        />
                    </GridColumn>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="rolename"
                            label={ isAddGroup ? "Group Name" : "Role Name" }
                            placeholder={ isAddGroup ? "Enter Group Name" : "Enter Role Name" }
                            required={ true }
                            requiredErrorMessage={ 
                                isAddGroup ? 
                                    "Group Name is required to proceed." : 
                                    "Role Name is required to proceed." 
                            }
                            validation={ (value: string, validation: Validation) => {
                                if (isValidRoleName === false) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        isAddGroup ? 
                                            "A group already exists with the given group name." : 
                                            "A role already exists with the given role name."
                                    );
                                }
                            } }
                            value={ initialValues && initialValues.roleName }
                            listen={ roleNameChangeListener }
                        />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    )
}
