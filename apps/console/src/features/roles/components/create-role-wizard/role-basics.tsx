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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
// TODO: use `getUserStores()` function from Userstores features.
import { getUserStoreList } from "../../../users";
import {
    PRIMARY_USERSTORE_PROPERTY_VALUES,
    USERSTORE_REGEX_PROPERTIES,
    getUserstoreRegEx,
    validateInputAgainstRegEx
} from "../../../userstores";
import { searchRoleList } from "../../api";
import {
    APPLICATION_DOMAIN,
    INTERNAL_DOMAIN,
    PRIMARY_DOMAIN
} from "../../constants";
import { CreateRoleFormData, SearchRoleInterface } from "../../models";

/**
 * Interface to capture role basics props.
 */
interface RoleBasicProps extends TestableComponentInterface {
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
        isAddGroup,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isValidRoleName, setIsValidRoleName ] = useState<boolean>(true);
    const [ isRoleNamePatternValid, setIsRoleNamePatternValid ] = useState<boolean>(true);
    const [ updatedRoleName, setUpdatedRoleName ] = useState<string>(initialValues?.roleName);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState<string>(PRIMARY_DOMAIN);
    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);

    /**
     * Triggers when updatedRoleName is changed.
     */
    useEffect(() => {
        setIsValidRoleName(false);
        validateRoleName(updatedRoleName);
    }, [ updatedRoleName ]);

    useEffect(() => {
        getUserStores();
    }, [ isAddGroup ]);

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
        };

        searchRoleList(searchData)
            .then((response) => {
                setIsValidRoleName(response?.data?.totalResults === 0);
            });
    };

    /**
     * The following function change of the user stores.
     *
     * @param values
     */
    const handleDomainChange = (values: Map<string, FormValue>) => {
        const domain: string = values.get("domain").toString();
        setUserStore(domain);
    };

    /**
     * The following function validates role name against the user store regEx.
     *
     * @param roleName - User input role name
     */
    const validateRoleNamePattern = async (roleName: string): Promise<void> => {
        let userStoreRegEx = "";
        if (userStore !== PRIMARY_DOMAIN) {
            await getUserstoreRegEx(userStore, USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
                .then((response) => {
                    setRegExLoading(true);
                    userStoreRegEx = response;
                })
        } else {
            userStoreRegEx = PRIMARY_USERSTORE_PROPERTY_VALUES.RolenameJavaScriptRegEx;
        }
        setIsRoleNamePatternValid(validateInputAgainstRegEx(roleName, userStoreRegEx));
    };

    /**
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions = [
                {
                    key: -1,
                    text: "Primary",
                    value: "primary"
                }
            ];
        let storeOption = {
            key: null,
            text: "",
            value: ""
        };
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
        const roleName: string = values?.get("rolename")?.toString();
        setUpdatedRoleName(roleName);
        validateRoleNamePattern(roleName)
            .finally(() => {
                setRegExLoading(false);
            })
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
            data-testid={ testId }
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
             <Grid>
                <GridRow columns={ 2 }>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid={ `${ testId }-domain-dropdown` }
                            type="dropdown"
                            label={
                                isAddGroup ?
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.domain.label." +
                                        "group") :
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.domain.label." +
                                        "role")
                            }
                            name="domain"
                            children={ isAddGroup ? userStoreOptions : roleDomains }
                            placeholder={ t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.domain." +
                                "placeholder") }
                            requiredErrorMessage={
                                isAddGroup ?
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.domain." +
                                        "validation.empty.group") :
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.domain." +
                                        "validation.empty.role")
                            }
                            required={ true }
                            element={ <div></div> }
                            listen={ handleDomainChange }
                            value={ initialValues?.domain ? 
                                    initialValues?.domain : 
                                        isAddGroup ? 
                                            userStoreOptions[0]?.value : roleDomains[0].value 
                            }
                        />
                    </GridColumn>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid={ `${ testId }-role-name-input` }
                            type="text"
                            name="rolename"
                            label={
                                isAddGroup ?
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.roleName.label",
                                        { type: "Group" }) :
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.roleName.label",
                                        { type: "Role" })
                            }
                            placeholder={
                                isAddGroup ?
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "placeholder", { type: "Group" }) :
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "placeholder", { type: "Role" })
                            }
                            required={ true }
                            requiredErrorMessage={ 
                                isAddGroup ?
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "validations.empty", { type: "Group" }) :
                                    t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "validations.empty", { type: "Role" })
                            }
                            validation={ (value: string, validation: Validation) => {
                                if (isValidRoleName === false) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        isAddGroup ?
                                            t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails." +
                                                "roleName.validations.duplicate", { type: "Group" }) :
                                            t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails." +
                                                "roleName.validations.duplicate", { type: "Role" })
                                    );
                                }
                                if (!isRoleNamePatternValid) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        isAddGroup ?
                                            t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails." +
                                                "roleName.validations.invalid", { type: "group" }) :
                                            t("adminPortal:components.roles.addRoleWizard.forms.roleBasicDetails." +
                                                "roleName.validations.invalid", { type: "role" })
                                    );
                                }
                            } }
                            value={ initialValues && initialValues.roleName }
                            listen={ roleNameChangeListener }
                            loading={ isRegExLoading }
                        />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    )
};
