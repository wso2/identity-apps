/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography/Typography";
import { GlobeIcon } from "@oxygen-ui/react-icons";
import { AppState } from "@wso2is/admin.core.v1/store";
import { SharedUserStoreUtils } from "@wso2is/admin.core.v1/utils";
import { UserManagementConstants } from "@wso2is/admin.users.v1/constants/user-management-constants";
import { generatePassword, getConfiguration } from "@wso2is/admin.users.v1/utils/generate-password.utils";
import getUsertoreUsernameValidationPattern from "@wso2is/admin.users.v1/utils/get-usertore-usernam-validation-pattern";
import { getUsernameConfiguration } from "@wso2is/admin.users.v1/utils/user-management-utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api/validation-config";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models/validation-config";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    MutableState,
    TextFieldAdapter,
    Tools,
    composeValidators
} from "@wso2is/form";
import { Hint, PasswordValidation } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import getTenantDomainAvailability from "../../api/get-tenant-domain-availability";
import TenantConstants from "../../constants/tenant-constants";
import { AddTenantRequestPayload, Tenant, TenantOwner, TenantStatus } from "../../models/tenants";
import "./add-tenant-form.scss";

/**
 * Props interface of {@link AddTenantForm}
 */
export interface AddTenantFormProps extends IdentifiableComponentInterface {
    /**
     * Callback to trigger when the form is submitted.
     * @param payload - Payload values.
     */
    onSubmit?: (payload: AddTenantRequestPayload) => void;
}

export type AddTenantFormValues = Pick<Tenant, "domain" | "id"> & Omit<TenantOwner, "additionalDetails">;

export type AddTenantFromErrors = Partial<AddTenantFormValues>;

/**
 * Component to hold the form to add a tenant.
 *
 * @param props - Props injected to the component.
 * @returns Add Tenant Form component.
 */
const AddTenantForm: FunctionComponent<AddTenantFormProps> = ({
    ["data-componentid"]: componentId = "add-tenant-form",
    onSubmit,
    ...rest
}: AddTenantFormProps): ReactElement => {
    const { t } = useTranslation();

    const { data: validationData } = useValidationConfigData();

    const enableEmailDomain: boolean = useSelector((state: AppState) => state.config?.ui?.enableEmailDomain);

    const [ isPasswordValid, setIsPasswordValid ] = useState<boolean>(false);
    const [ isPasswordVisible, setIsPasswordVisible ] = useState(false);

    const userNameValidationConfig: ValidationFormInterface = useMemo((): ValidationFormInterface => {
        return getUsernameConfiguration(validationData);
    }, [ validationData ]);

    const passwordValidationConfig: ValidationFormInterface = useMemo((): ValidationFormInterface => {
        return getConfiguration(validationData);
    }, [ validationData ]);

    /**
     * Form validator to validate the username against the userstore regex.
     * @param value - Input value.
     * @returns An error if the value is not valid else undefined.
     */
    const validateUsernameAgainstUserstoreRegExp = async (value: string): Promise<string | undefined> => {
        if (!value) {
            return undefined;
        }

        const userRegex: string = await getUsertoreUsernameValidationPattern();

        if (!SharedUserStoreUtils.validateInputAgainstRegEx(value, userRegex) || !FormValidation.email(value)) {
            return t("tenants:common.form.fields.username.validations.regExViolation");
        }
    };

    /**
     * Form validator to validate the username against the alphanumeric regex.
     * @param value - Input value.
     * @returns An error if the value is not valid else undefined.
     */
    const validateAlphanumericUsername = (value: string): string | undefined => {
        if (!value) {
            return undefined;
        }

        // Regular expression to validate having alphanumeric characters.
        let regExpInvalidUsername: RegExp = new RegExp(UserManagementConstants.USERNAME_VALIDATION_REGEX);

        // Check if special characters enabled for username.
        if (!userNameValidationConfig?.isAlphanumericOnly) {
            regExpInvalidUsername = new RegExp(UserManagementConstants.USERNAME_VALIDATION_REGEX_WITH_SPECIAL_CHARS);
        }

        if (
            value.length < Number(userNameValidationConfig.minLength) ||
            value.length > Number(userNameValidationConfig.maxLength)
        ) {
            return t("tenants:common.form.fields.username.validations.usernameLength", {
                maxLength: userNameValidationConfig?.maxLength,
                minLength: userNameValidationConfig?.minLength
            });
        } else if (!regExpInvalidUsername.test(value)) {
            if (userNameValidationConfig?.isAlphanumericOnly) {
                return t("tenants:common.form.fields.username.validations.usernameSymbols");
            } else {
                return t("tenants:common.form.fields.username.validations.usernameSpecialCharSymbols");
            }
        }
    };

    /**
     * Form validator to validate the tenant domain availability.
     * @param value - Input value.
     * @returns An error if the value is not valid else undefined.
     */
    const validateTenantDomainAvailability = async (value: string): Promise<string | undefined> => {
        if (!value) {
            return undefined;
        }

        let isAvailable: boolean = true;

        try {
            isAvailable = await getTenantDomainAvailability(value);
        } catch (error) {
            isAvailable = false;
        }

        if (!isAvailable) {
            return t("tenants:common.form.fields.domain.validations.domainUnavailable");
        }
    };

    /**
     * Handles the form submit action.
     * @param values - Form values.
     */
    const handleSubmit = (values: AddTenantFormValues): void => {
        const { domain, ...rest } = values;

        const payload: AddTenantRequestPayload = {
            domain,
            owners: [
                {
                    ...rest,
                    provisioningMethod: TenantStatus.INLINE_PASSWORD
                }
            ]
        };

        onSubmit(payload);
    };

    /**
     * Handles the form level validation.
     * @param values - Form values.
     * @returns Form errors.
     */
    const handleValidate = (values: AddTenantFormValues): AddTenantFromErrors => {
        const errors: AddTenantFromErrors = {
            domain: undefined,
            email: undefined,
            firstname: undefined,
            lastname: undefined,
            password: undefined,
            username: undefined
        };

        if (!values.domain) {
            errors.domain = t("tenants:common.form.fields.domain.validations.required");
        }

        if (!values.firstname) {
            errors.firstname = t("tenants:common.form.fields.firstname.validations.required");
        }

        if (!values.lastname) {
            errors.lastname = t("tenants:common.form.fields.lastname.validations.required");
        }

        if (!values.email) {
            errors.email = t("tenants:common.form.fields.email.validations.required");
        }

        if (!values.password) {
            errors.password = t("tenants:common.form.fields.password.validations.required");
        } else if (!isPasswordValid) {
            errors.password = "";
        }

        if (!values.username) {
            errors.username = t("tenants:common.form.fields.username.validations.required");
        }

        return errors;
    };

    /**
     * Returns an appropriate username field based on the configuration.
     * @returns Username field.
     */
    const renderUsernameField = (): ReactElement => {
        if (userNameValidationConfig?.enableValidator === "false") {
            return (
                <FinalFormField
                    key="username"
                    width={ 16 }
                    className="text-field-container"
                    ariaLabel="username"
                    required={ true }
                    data-componentid={ `${componentId}-username` }
                    name="username"
                    type={ enableEmailDomain ? "email" : "text" }
                    helperText={
                        (<Hint>
                            <Typography variant="inherit">
                                { enableEmailDomain
                                    ? t("tenants:common.form.fields.emailUsername.helperText")
                                    : t("tenants:common.form.fields.username.helperText") }
                            </Typography>
                        </Hint>)
                    }
                    label={
                        enableEmailDomain
                            ? t("tenants:common.form.fields.emailUsername.label")
                            : t("tenants:common.form.fields.username.label")
                    }
                    placeholder={
                        enableEmailDomain
                            ? t("tenants:common.form.fields.emailUsername.placeholder")
                            : t("tenants:common.form.fields.username.placeholder")
                    }
                    component={ TextFieldAdapter }
                    validate={ composeValidators(validateUsernameAgainstUserstoreRegExp) }
                    maxLength={ 100 }
                    minLength={ 0 }
                />
            );
        }

        return (
            <FinalFormField
                key="username"
                width={ 16 }
                className="text-field-container"
                ariaLabel="username"
                required={ true }
                data-componentid={ `${componentId}-username` }
                name="username"
                type="text"
                helperText={
                    (<Hint>
                        <Typography variant="inherit">
                            { userNameValidationConfig?.isAlphanumericOnly
                                ? t("tenants:common.form.fields.alphanumericUsername." + "validations.usernameHint", {
                                    maxLength: userNameValidationConfig?.maxLength,
                                    minLength: userNameValidationConfig?.minLength
                                })
                                : t(
                                    "tenants:common.form.fields.alphanumericUsername." +
                                          "validations.usernameSpecialCharHint",
                                    {
                                        maxLength: userNameValidationConfig?.maxLength,
                                        minLength: userNameValidationConfig?.minLength
                                    }
                                ) }
                        </Typography>
                    </Hint>)
                }
                label={ t("tenants:common.form.fields.alphanumericUsername.label") }
                placeholder={ t("tenants:common.form.fields.alphanumericUsername.placeholder") }
                component={ TextFieldAdapter }
                validate={ composeValidators(validateAlphanumericUsername) }
                maxLength={ 100 }
                minLength={ 0 }
            />
        );
    };

    /**
     * Renders the password validation criteria with the help of `PasswordValidation` component.
     * @returns Password validation criteria.
     */
    const renderPasswordValidationCriteria = (): ReactElement => (
        <FormSpy subscription={ { values: true } }>
            { ({ values }: { values: AddTenantFormValues }) => (
                <PasswordValidation
                    password={ values?.password ?? "" }
                    minLength={ Number(passwordValidationConfig.minLength) }
                    maxLength={ Number(passwordValidationConfig.maxLength) }
                    minNumbers={ Number(passwordValidationConfig.minNumbers) }
                    minUpperCase={ Number(passwordValidationConfig.minUpperCaseCharacters) }
                    minLowerCase={ Number(passwordValidationConfig.minLowerCaseCharacters) }
                    minSpecialChr={ Number(passwordValidationConfig.minSpecialCharacters) }
                    minUniqueChr={ Number(passwordValidationConfig.minUniqueCharacters) }
                    maxConsecutiveChr={ Number(passwordValidationConfig.maxConsecutiveCharacters) }
                    onPasswordValidate={ (isValid: boolean): void => {
                        setIsPasswordValid(isValid);
                    } }
                    translations={ {
                        case:
                            Number(passwordValidationConfig?.minUpperCaseCharacters) > 0 &&
                            Number(passwordValidationConfig?.minLowerCaseCharacters) > 0
                                ? t("tenants:common.form.fields.password.validations.criteria.passwordCase", {
                                    minLowerCase: passwordValidationConfig.minLowerCaseCharacters,
                                    minUpperCase: passwordValidationConfig.minUpperCaseCharacters
                                })
                                : Number(passwordValidationConfig?.minUpperCaseCharacters) > 0
                                    ? t("tenants:common.form.fields.password.validations.criteria.upperCase", {
                                        minUpperCase: passwordValidationConfig.minUpperCaseCharacters
                                    })
                                    : t("tenants:common.form.fields.password.validations.criteria.lowerCase", {
                                        minLowerCase: passwordValidationConfig.minLowerCaseCharacters
                                    }),
                        consecutiveChr: t(
                            "tenants:common.form.fields.password.validations.criteria.consecutiveCharacters",
                            {
                                repeatedChr: passwordValidationConfig.maxConsecutiveCharacters
                            }
                        ),
                        length: t("tenants:common.form.fields.password.validations.criteria.passwordLength", {
                            max: passwordValidationConfig.maxLength,
                            min: passwordValidationConfig.minLength
                        }),
                        numbers: t("tenants:common.form.fields.password.validations.criteria.passwordNumeric", {
                            min: passwordValidationConfig.minNumbers
                        }),
                        specialChr: t("tenants:common.form.fields.password.validations.criteria.specialCharacter", {
                            specialChr: passwordValidationConfig.minSpecialCharacters
                        }),
                        uniqueChr: t("tenants:common.form.fields.password.validations.criteria.uniqueCharacters", {
                            uniqueChr: passwordValidationConfig.minUniqueCharacters
                        })
                    } }
                />
            ) }
        </FormSpy>
    );

    const renderInputAdornmentOfSecret = (showSecret: boolean, onClick: () => void): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !showSecret ? "eye" : "eye slash" }
                data-componentid={ `${ componentId }-password-view-button` }
                onClick={ onClick }
            />
        </InputAdornment>
    );

    return (
        <FinalForm
            initialValues={ {} }
            keepDirtyOnReinitialize={ true }
            onSubmit={ handleSubmit }
            validate={ handleValidate }
            mutators={ {
                setRandomPassword: (
                    [ name ]: [string],
                    state: MutableState<Record<string, any>, Partial<Record<string, any>>>,
                    { changeValue }: Tools<Record<string, any>, Partial<Record<string, any>>>
                ) => {
                    const randomPass: string = generatePassword(
                        Number(passwordValidationConfig.minLength),
                        Number(passwordValidationConfig.minLowerCaseCharacters) > 0,
                        Number(passwordValidationConfig.minUpperCaseCharacters) > 0,
                        Number(passwordValidationConfig.minNumbers) > 0,
                        Number(passwordValidationConfig.minSpecialCharacters) > 0,
                        Number(passwordValidationConfig.minLowerCaseCharacters),
                        Number(passwordValidationConfig.minUpperCaseCharacters),
                        Number(passwordValidationConfig.minNumbers),
                        Number(passwordValidationConfig.minSpecialCharacters),
                        Number(passwordValidationConfig.minUniqueCharacters)
                    );

                    changeValue(state, name, () => randomPass);
                }
            } }
            render={ ({ form, handleSubmit }: FormRenderProps) => {
                return (
                    <form
                        id={ TenantConstants.ADD_TENANT_FORM_ID }
                        onSubmit={ handleSubmit }
                        className="add-tenant-form"
                    >
                        <FinalFormField
                            key="domain"
                            width={ 16 }
                            className="text-field-container"
                            ariaLabel="domain"
                            required={ true }
                            data-componentid={ `${componentId}-domain` }
                            name="domain"
                            type="text"
                            helperText={
                                (<Hint>
                                    <Typography variant="inherit">
                                        <Trans i18nKey="tenants:common.form.fields.domain.helperText">
                                            Enter a unique domain name for your organization. The domain name should be
                                            in the format of
                                            <Typography component="span" variant="inherit" fontWeight="bold">
                                                example.com
                                            </Typography>
                                            .
                                        </Trans>
                                    </Typography>
                                </Hint>)
                            }
                            label={ t("tenants:common.form.fields.domain.label") }
                            placeholder={ t("tenants:common.form.fields.domain.placeholder") }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                            endAdornment={
                                (<InputAdornment position="end">
                                    <GlobeIcon />
                                </InputAdornment>)
                            }
                            validate={ validateTenantDomainAvailability }
                        />
                        <Typography variant="h5" className="add-tenant-form-sub-title">
                            { t("tenants:addTenant.form.adminDetails.title") }
                        </Typography>
                        <Stack spacing={ 1 } direction="column">
                            <Stack spacing={ { sm: 2, xs: 1 } } direction={ { sm: "row", xs: "column" } }>
                                <div className="inline-flex-field">
                                    <FinalFormField
                                        fullWidth
                                        key="firstname"
                                        width={ 16 }
                                        className="text-field-container"
                                        ariaLabel="firstname"
                                        required={ true }
                                        data-componentid={ `${componentId}-firstname` }
                                        name="firstname"
                                        type="text"
                                        label={ t("tenants:common.form.fields.firstname.label") }
                                        placeholder={ t("tenants:common.form.fields.firstname.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                    />
                                </div>
                                <div className="inline-flex-field">
                                    <FinalFormField
                                        fullWidth
                                        key="lastname"
                                        width={ 16 }
                                        className="text-field-container"
                                        ariaLabel="lastname"
                                        required={ true }
                                        data-componentid={ `${componentId}-lastname` }
                                        name="lastname"
                                        type="text"
                                        label={ t("tenants:common.form.fields.lastname.label") }
                                        placeholder={ t("tenants:common.form.fields.lastname.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                    />
                                </div>
                            </Stack>
                            { renderUsernameField() }
                            <FinalFormField
                                key="email"
                                width={ 16 }
                                className="text-field-container"
                                ariaLabel="email"
                                required={ true }
                                data-componentid={ `${componentId}-email` }
                                name="email"
                                type="text"
                                label={ t("tenants:common.form.fields.email.label") }
                                placeholder={ t("tenants:common.form.fields.email.placeholder") }
                                component={ TextFieldAdapter }
                                maxLength={ 100 }
                                minLength={ 0 }
                            />
                            <Stack
                                spacing={ { sm: 2, xs: 1 } }
                                direction={ { sm: "row", xs: "column" } }
                                alignItems="center"
                            >
                                <div className="inline-flex-field" style={ { height: "90px" } }>
                                    <FinalFormField
                                        key="password"
                                        width={ 16 }
                                        className="text-field-container"
                                        ariaLabel="password"
                                        required={ true }
                                        data-componentid={ `${componentId}-password` }
                                        name="password"
                                        type={ isPasswordVisible ? "text" : "password" }
                                        InputProps={ {
                                            endAdornment: renderInputAdornmentOfSecret(
                                                isPasswordVisible,
                                                () => setIsPasswordVisible(!isPasswordVisible))
                                        } }
                                        label={ t("tenants:common.form.fields.password.label") }
                                        placeholder={ t("tenants:common.form.fields.password.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                    />
                                </div>
                                { passwordValidationConfig && (
                                    <Button onClick={ () => form.mutators.setRandomPassword("password") }>
                                        { t("tenants:common.form.fields.password.actions.generate.label") }
                                    </Button>
                                ) }
                            </Stack>
                            { passwordValidationConfig && renderPasswordValidationCriteria() }
                        </Stack>
                    </form>
                );
            } }
            { ...rest }
        />
    );
};

export default AddTenantForm;
