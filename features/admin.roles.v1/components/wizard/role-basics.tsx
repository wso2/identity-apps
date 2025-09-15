/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { SharedUserStoreConstants } from "@wso2is/admin.core.v1/constants/user-store-constants";
import { SharedUserStoreUtils } from "@wso2is/admin.core.v1/utils/user-store-utils";
import { useUserStoreRegEx } from "@wso2is/admin.userstores.v1/api/use-get-user-store-regex";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { userstoresConfig } from "../../../admin.extensions.v1";
import { searchRoleList } from "../../api/roles";
import { CreateRoleFormData, SearchRoleInterface } from "../../models/roles";

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
 * @param props - Role Basic prop types
 */
export const RoleBasics: FunctionComponent<RoleBasicProps> = (props: RoleBasicProps): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        initialValues,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isRoleNamePatternValid, setIsRoleNamePatternValid ] = useState<boolean>(true);

    const {
        data: userStoreRegEx,
        isLoading: isUserStoreRegExLoading
    } = useUserStoreRegEx(
        userstoresConfig.primaryUserstoreName,
        SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.RolenameRegEx
    );

    /**
     * The following function validates role name against the user store regEx.
     *
     * @param roleName - User input role name
     */
    const validateRoleNamePattern = (roleName: string): void => {
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

                                const searchData: SearchRoleInterface = {
                                    filter: "displayName eq " + value.toString(),
                                    schemas: [
                                        "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                                    ],
                                    startIndex: 1
                                };
                                const response: AxiosResponse = await searchRoleList(searchData);

                                if (response?.data?.totalResults > 0) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("roles:addRoleWizard.forms.roleBasicDetails." +
                                            "roleName.validations.duplicate", { type: "Role" })
                                    );
                                }

                                validateRoleNamePattern(value.toString());

                                if (!isRoleNamePatternValid) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("roles:addRoleWizard.forms.roleBasicDetails." +
                                                "roleName.validations.invalid", { type: "role" })
                                    );
                                }
                            } }
                            value={ initialValues && initialValues.roleName }
                            loading={ isUserStoreRegExLoading }
                        />
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    );
};
