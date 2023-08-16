/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { AppState, SharedUserStoreConstants, SharedUserStoreUtils } from "../../../core";
import { CreateRoleFormData } from "../../../roles/models/roles";
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
                                t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                                        "roleName.label",{ type: "Role" })
                            }
                            placeholder={
                                t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                                        "placeholder", { type: "Role" })
                            }
                            required={ true }
                            requiredErrorMessage={
                                t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
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
                                        t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                                            "roleName.validations.duplicate", { type: "Role" })
                                    );
                                }

                                await validateRoleNamePattern(value.toString());

                                if (!isRoleNamePatternValid) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
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
