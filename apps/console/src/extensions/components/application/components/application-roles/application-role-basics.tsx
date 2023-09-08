/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { ApplicationRolesConstants } from "../../constants";
import {  RoleBasicDetailsInterface, RoleNameInterface } from "../../models";

/**
 * Interface to capture role basics props.
 */
interface ApplicationRoleBasicProps extends IdentifiableComponentInterface {
    triggerSubmit: boolean;
    initialValues: RoleBasicDetailsInterface;
    onSubmit: (values: RoleBasicDetailsInterface) => void;
}

/**
 * Component to capture basic details of a new application role.
 *
 * @param props - Role basic data and event handlers.
 */
export const ApplicationRoleBasics: FunctionComponent<ApplicationRoleBasicProps> = (
    props: ApplicationRoleBasicProps): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        initialValues,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    /**
     * Util method to collect form data for processing.
     *
     * @param values - Values from form elements.
     * 
     * @returns Role name.
     */
    const getFormValues = (values: Map<string, FormValue>): RoleNameInterface => {
        return {
            roleName: values.get("rolename").toString()
        };
    };

    return (
        <>
            <Forms
                data-componentid={ componentId }
                onSubmit={ (values: Map<string, FormValue>) => {
                    onSubmit({
                        basic: getFormValues(values)
                    });
                } }
                submitState={ triggerSubmit }
            >
                <Grid>
                    <GridRow>
                        <GridColumn mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Field
                                data-componentid={ `${ componentId }-role-name-input` }
                                type="text"
                                name="rolename"
                                label={
                                    t("extensions:develop.applications.edit.sections.roles.addRoleWizard.forms." +
                                        "roleBasicDetails.roleName.label")
                                }
                                placeholder={
                                    t("extensions:develop.applications.edit.sections.roles.addRoleWizard.forms." +
                                        "roleBasicDetails.roleName.placeholder")
                                }
                                required={ true }
                                requiredErrorMessage={
                                    t("extensions:develop.applications.edit.sections.roles.addRoleWizard.forms." +
                                        "roleBasicDetails.roleName.validations.empty")
                                }
                                validation={ async (value: string, validation: Validation) => {
                                    if (value) {
                                        if (!RegExp(ApplicationRolesConstants.
                                            APPLICATION_ROLE_NAME_REGEX_PATTERN).test(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("extensions:develop.applications.edit.sections.roles.addRoleWizard." +
                                                    "forms.roleBasicDetails.roleName.validations.invalid")
                                            );
                                        }
                                    }
                                } }
                                value={ initialValues && initialValues.basic.roleName }
                            />
                            <Hint>
                                { t("extensions:develop.applications.edit.sections.roles.addRoleWizard.forms." + 
                                    "roleBasicDetails.roleName.hint") }
                                { " " }
                                { t("extensions:develop.applications.edit.sections.roles.addRoleWizard.forms." + 
                                    "roleBasicDetails.roleName.validations.invalid") }
                            </Hint>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </Forms>
        </>
    );
};
