/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { SharedUserStoreUtils } from "@wso2is/admin.core.v1/utils/user-store-utils";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, FormApi, FormSpy, TextFieldAdapter } from "@wso2is/form/src";
import { Button, PasswordValidation } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { FormSpyRenderProps, useForm } from "react-final-form";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { generatePassword } from "../../../../utils/generate-password.utils";

/**
 * User add wizard create password field component props interface.
 */
interface CreatePasswordOptionPropsInterface extends IdentifiableComponentInterface {
    /**
     * Password validation configuration.
     */
    passwordConfig: ValidationFormInterface;
    /**
     * Password regular expression.
     */
    passwordRegex: string;
}

/**
 * User add wizard create password field component.
 * This renders the password input field and the password validation component.
 * And handles the password generation and validation.
 *
 * If the `passwordConfig` is provided,
 * then the password validation component will be rendered and handle the validation.
 * Else, the password will be validated against the `passwordRegex`.
 */
const CreatePasswordOption: FunctionComponent<CreatePasswordOptionPropsInterface> = ({
    passwordConfig,
    passwordRegex,
    ["data-componentid"]: componentId = "create-password-option"
}: CreatePasswordOptionPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const formInstance: FormApi<Record<string, any>, Partial<Record<string, any>>> = useForm();

    const newPasswordFieldName: string = "newPassword";
    const newPasswordValidityFieldName: string = "newPasswordValidity";

    /**
     * Validates the new password field.
     *
     * @param value - The value of the password field.
     */
    const validateNewPassword = (value: string) => {

        if (isEmpty(value)) {
            return t("user:forms.addUserForm.inputs.newPassword.validations.empty");
        }

        const { values } = formInstance.getState();
        const isNewPasswordValid: boolean = values[newPasswordValidityFieldName] ?? false;

        if (passwordConfig && !isNewPasswordValid) {
            return t("extensions:manage.features.user.addUser.validation.error.passwordValidation");
        }

        if (!SharedUserStoreUtils.validateInputAgainstRegEx(value, passwordRegex)) {
            return t("extensions:manage.features.user.addUser.validation.password");
        }

        return undefined;
    };

    return (
        <Grid.Row columns={ 2 } data-componentid={ componentId }>
            <Grid.Column mobile={ 16 } computer={ 10 }>
                <div className={ "generate-password" }>
                    <FinalFormField
                        component={ TextFieldAdapter }
                        type="password"
                        className="addon-field-wrapper full-width"
                        name={ newPasswordFieldName }
                        label={ t("user:forms.addUserForm.inputs.newPassword.label") }
                        placeholder={ t("user:forms.addUserForm.inputs.newPassword.placeholder") }
                        required={ true }
                        validate={ validateNewPassword }
                        validateFields={ [ newPasswordValidityFieldName ] }
                        data-testid="user-mgt-add-user-form-newPassword-input"
                        data-componentid="user-mgt-add-user-form-newPassword-input"
                    />
                    { /* This hidden field maintains the validity of the new password which is calculated
                        by the `PasswordValidation` component. */ }
                    <FinalFormField
                        component="input"
                        type="hidden"
                        name={ newPasswordValidityFieldName }
                    />
                    { passwordConfig && (
                        <Button
                            basic
                            primary
                            size="tiny"
                            type="button"
                            className="info add-user-step-button"
                            onClick={ () => {
                                const randomPass: string = generatePassword(Number(passwordConfig.minLength),
                                    Number(passwordConfig.minLowerCaseCharacters) > 0,
                                    Number(passwordConfig.minUpperCaseCharacters) > 0,
                                    Number(passwordConfig.minNumbers) > 0,
                                    Number(passwordConfig.minSpecialCharacters) > 0,
                                    Number(passwordConfig.minLowerCaseCharacters),
                                    Number(passwordConfig.minUpperCaseCharacters),
                                    Number(passwordConfig.minNumbers),
                                    Number(passwordConfig.minSpecialCharacters),
                                    Number(passwordConfig.minUniqueCharacters));

                                formInstance.change(newPasswordFieldName, randomPass);
                            } }
                            data-testid="user-mgt-password-generate-button"
                            data-componentid="user-mgt-password-generate-button"
                        >
                            Generate
                        </Button>
                    ) }
                </div>
                { passwordConfig && (
                    <FormSpy subscription={ { values: true } }>
                        { ({ values }: FormSpyRenderProps) => (
                            <PasswordValidation
                                password={ values[newPasswordFieldName] ?? "" }
                                minLength={ Number(passwordConfig.minLength) }
                                maxLength={ Number(passwordConfig.maxLength) }
                                minNumbers={ Number(passwordConfig.minNumbers) }
                                minUpperCase={ Number(passwordConfig.minUpperCaseCharacters) }
                                minLowerCase={ Number(passwordConfig.minLowerCaseCharacters) }
                                minSpecialChr={ Number(passwordConfig.minSpecialCharacters) }
                                minUniqueChr={ Number(passwordConfig.minUniqueCharacters) }
                                maxConsecutiveChr={ Number(passwordConfig.maxConsecutiveCharacters) }
                                onPasswordValidate={ (isValid: boolean) => {
                                    // Update the hidden field, so that the form validation can be triggered.
                                    formInstance.change(newPasswordValidityFieldName, isValid);
                                } }
                                translations={ {
                                    case: (Number(passwordConfig?.minUpperCaseCharacters) > 0 &&
                                            Number(passwordConfig?.minLowerCaseCharacters) > 0) ?
                                        t("extensions:manage.features.user.addUser.validation.passwordCase", {
                                            minLowerCase: passwordConfig.minLowerCaseCharacters,
                                            minUpperCase: passwordConfig.minUpperCaseCharacters
                                        }) : (
                                            Number(passwordConfig?.minUpperCaseCharacters) > 0 ?
                                                t("extensions:manage.features.user.addUser.validation.upperCase", {
                                                    minUpperCase: passwordConfig.minUpperCaseCharacters
                                                }) : t("extensions:manage.features.user.addUser.validation" +
                                                        ".lowerCase", {
                                                    minLowerCase: passwordConfig.minLowerCaseCharacters
                                                })
                                        ),
                                    consecutiveChr:
                                            t("extensions:manage.features.user.addUser." +
                                                "validation.consecutiveCharacters", {
                                                repeatedChr: passwordConfig.maxConsecutiveCharacters
                                            }),
                                    length: t("extensions:manage.features.user.addUser.validation.passwordLength", {
                                        max: passwordConfig.maxLength, min: passwordConfig.minLength
                                    }),
                                    numbers:
                                            t("extensions:manage.features.user.addUser.validation.passwordNumeric", {
                                                min: passwordConfig.minNumbers
                                            }),
                                    specialChr:
                                            t("extensions:manage.features.user.addUser.validation.specialCharacter", {
                                                specialChr: passwordConfig.minSpecialCharacters
                                            }),
                                    uniqueChr:
                                            t("extensions:manage.features.user.addUser.validation.uniqueCharacters", {
                                                uniqueChr: passwordConfig.minUniqueCharacters
                                            })
                                } }
                            />
                        ) }
                    </FormSpy>
                ) }
            </Grid.Column>
        </Grid.Row>
    );
};

export default CreatePasswordOption;
