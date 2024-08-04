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

import { AppState, SharedUserStoreConstants, SharedUserStoreUtils } from "@wso2is/admin.core.v1";
import { CreateRoleFormData } from "@wso2is/admin.roles.v2/models/roles";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { getOrganizationRoles } from "../../api";
import {
    PRIMARY_DOMAIN
} from "../../constants";
import { OrganizationResponseInterface, OrganizationRoleListResponseInterface } from "../../models";

/**
 * Interface to capture role basics props.
 */
interface OrganizationRoleBasicProps extends TestableComponentInterface {
    dummyProp?: string;
    triggerSubmit: boolean;
    initialValues: any;
    isAddGroup: boolean;
    onSubmit: (values: any) => void;
}

/**
 * Component to capture basic details of a new organizatiion role.
 *
 * @param props - Organization Role Basic prop types
 */
export const OrganizationRoleBasics: FunctionComponent<OrganizationRoleBasicProps> = (
    props: OrganizationRoleBasicProps
): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        initialValues,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isRoleNamePatternValid, setIsRoleNamePatternValid ] = useState<boolean>(true);
    const [ userStore ] = useState<string>(SharedUserStoreConstants.PRIMARY_USER_STORE);
    const [ isRegExLoading, setRegExLoading ] = useState<boolean>(false);

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    /**
     * The following function validates role name against the user store regEx.
     *
     * @param roleName - User input role name
     */
    const validateRoleNamePattern = async (roleName: string): Promise<void> => {
        let userStoreRegEx: string = "";

        if (userStore !== PRIMARY_DOMAIN) {
            await SharedUserStoreUtils.getUserStoreRegEx(userStore,
                SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.RolenameRegEx)
                .then((response: string) => {
                    setRegExLoading(true);
                    userStoreRegEx = response;
                });
        } else {
            userStoreRegEx = SharedUserStoreConstants.PRIMARY_USERSTORE_PROPERTY_VALUES.RolenameJavaScriptRegEx;
        }
        setIsRoleNamePatternValid(SharedUserStoreUtils.validateInputAgainstRegEx(roleName, userStoreRegEx));
    };

    /**
     * Util method to collect form data for processing.
     *
     * @param values - contains values from form elements
     */
    const getFormValues = (values: any): CreateRoleFormData => {
        return {
            roleName: values.get("rolename").toString()
        };
    };

    return (
        <Forms
            data-testid={ testId }
            onSubmit={ (values: Map<string, FormValue>) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <GridRow>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid={ `${ testId }-role-name-input` }
                            type="text"
                            name="rolename"
                            label={
                                t("roles:addRoleWizard.forms.roleBasicDetails." +
                                        "roleName.label",{ type: "Role" })
                            }
                            placeholder={
                                t("roles:addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "placeholder", { type: "Role" })
                            }
                            required={ true }
                            requiredErrorMessage={
                                t("roles:addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "validations.empty", { type: "Role" })
                            }
                            validation={ async (value: string, validation: Validation) => {
                                const response: OrganizationRoleListResponseInterface = await getOrganizationRoles(
                                    currentOrganization.id,
                                    `name eq ${value}`,
                                    null,
                                    null
                                );

                                if (response?.totalResults > 0) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("roles:addRoleWizard.forms.roleBasicDetails." +
                                            "roleName.validations.duplicate", { type: "Role" })
                                    );
                                }

                                await validateRoleNamePattern(value.toString());

                                if (!isRoleNamePatternValid) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("roles:addRoleWizard.forms.roleBasicDetails." +
                                                "roleName.validations.invalid", { type: "role" })
                                    );
                                }
                            } }
                            value={ initialValues && initialValues.roleName }
                            loading={ isRegExLoading }
                        />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    );
};
