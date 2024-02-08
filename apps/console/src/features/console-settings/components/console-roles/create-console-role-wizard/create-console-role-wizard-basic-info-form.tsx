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

import Code from "@oxygen-ui/react/Code";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, TextFieldAdapter } from "@wso2is/form";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { RoleConstants } from "../../../../roles/constants";

/**
 * Prop types for the text customization fields component.
 */
export type CreateConsoleRoleWizardBasicInfoFormProps = IdentifiableComponentInterface;

/**
 * Text customization fields component.
 *
 * @param props - Props injected to the component.
 * @returns Text customization fields component.
 */
const CreateConsoleRoleWizardBasicInfoForm: FunctionComponent<CreateConsoleRoleWizardBasicInfoFormProps> = (
    props: CreateConsoleRoleWizardBasicInfoFormProps
): ReactElement => {
    const { "data-componentid": componentId } = props;

    return (
        <Field.Input
            fullWidth
            FormControlProps={ {
                margin: "dense"
            } }
            ariaLabel="Role name field"
            required={ true }
            data-componentid={ `${componentId}-form-role-name-field` }
            name="displayName"
            inputType="roleName"
            label={ "Role Name" }
            helperText={ (
                <Hint>
                    Provide a distinctive and meaningful display name for the role. This name should clearly
                    represent the purpose or responsibilities associated with this role within the Console
                    application. <br/>E.g.{ " " }
                    <Code>application read</Code>
                </Hint>
            ) }
            placeholder="Enter Role name"
            component={ TextFieldAdapter }
            maxLength={ RoleConstants.ROLE_NAME_MAX_LENGTH }
            minLength={ RoleConstants.ROLE_NAME_MIN_LENGTH }
        />
    );
};

/**
 * Default props for the component.
 */
CreateConsoleRoleWizardBasicInfoForm.defaultProps = {
    "data-componentid": "create-console-role-wizard-basic-info-form"
};

export default CreateConsoleRoleWizardBasicInfoForm;
