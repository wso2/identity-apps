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

import Stack from "@mui/material/Stack";
import Button from "@oxygen-ui/react/Button";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography/Typography";
import { CopyIcon } from "@oxygen-ui/react-icons";
import { AppState } from "@wso2is/admin.core.v1/store";
import { SharedUserStoreUtils } from "@wso2is/admin.core.v1/utils";
import { UserManagementConstants } from "@wso2is/admin.users.v1/constants/user-management-constants";
import { generatePassword, getConfiguration } from "@wso2is/admin.users.v1/utils/generate-password.utils";
import getUsertoreUsernameValidationPattern from "@wso2is/admin.users.v1/utils/get-usertore-usernam-validation-pattern";
import { getUsernameConfiguration } from "@wso2is/admin.users.v1/utils/user-management-utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api/validation-config";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models/validation-config";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import {
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    TextFieldAdapter,
    composeValidators
} from "@wso2is/form";
import { Hint, PasswordValidation } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import TenantConstants from "../../constants/tenant-constants";
import { Tenant } from "../../models/tenants";
import "./edit-tenant-form.scss";

/**
 * Props interface of {@link EditTenantFormForm}
 */
export type EditTenantFormFormProps = IdentifiableComponentInterface & {
    /**
     * Tenant object.
     */
    tenant: Tenant;
        /**
     * Callback to trigger when the form is submitted.
     */
    onSubmit?: () => void;
};

const GlobeIcon = () => (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.0227 1.1851C10.5999 1.06098 10.1655 0.980046 9.7263 0.943529C8.75455 0.829241 7.76984 0.905829 6.82746 1.16899L6.77109 1.1851C5.08155 1.64903 3.5912 2.65517 2.52927 4.04876C1.46734 5.44235 0.892641 7.14621 0.893556 8.89829C0.894471 10.6504 1.47095 12.3536 2.53434 13.7461C3.59772 15.1386 5.08912 16.1432 6.77914 16.6053C7.39783 16.7796 8.03677 16.8717 8.67949 16.8791C8.75119 16.8922 8.82407 16.8976 8.89691 16.8952C9.61281 16.8966 10.3255 16.7991 11.0147 16.6053C12.7032 16.1416 14.1929 15.1364 15.2549 13.7441C16.317 12.3518 16.8926 10.6494 16.8936 8.89829C16.8945 7.14718 16.3206 5.44418 15.26 4.05079C14.1994 2.65739 12.7108 1.65063 11.0227 1.1851ZM10.8053 1.95812C11.8479 2.24673 12.812 2.76651 13.6262 3.47887C14.4403 4.19122 15.0834 5.07784 15.5079 6.07287H12.0776C11.6682 4.49199 10.9148 3.02099 9.87124 1.76487C10.1868 1.80683 10.499 1.87142 10.8053 1.95812ZM8.89691 1.88565C9.99701 3.07726 10.7999 4.51199 11.2401 6.07287H6.53757C6.97593 4.50822 7.78527 3.0724 8.89691 1.88726V1.88565ZM11.4414 6.87811C11.6991 8.2105 11.6991 9.57993 11.4414 10.9123H6.35237C6.21608 10.25 6.14862 9.57542 6.15106 8.89924C6.14902 8.22043 6.21648 7.54319 6.35237 6.87811H11.4414ZM6.93214 1.97423L6.9885 1.95812C7.29554 1.87632 7.60755 1.81445 7.92257 1.77292C6.87339 3.02403 6.11685 4.49365 5.70818 6.07448H2.28996C2.7127 5.09049 3.34827 4.21243 4.15095 3.50345C4.95364 2.79448 5.90347 2.27221 6.93214 1.97423ZM1.69811 8.89924C1.69824 8.2146 1.79862 7.53367 1.99605 6.87811H5.53103C5.40843 7.54485 5.34644 8.22132 5.34582 8.89924C5.34607 9.57452 5.40807 10.2483 5.53103 10.9123H1.99605C1.79804 10.2597 1.69764 9.58129 1.69811 8.89924ZM6.9885 15.8323C5.94485 15.546 4.97959 15.0271 4.16515 14.3144C3.3507 13.6018 2.70823 12.714 2.28593 11.7176H5.70013C6.11304 13.3019 6.87515 14.7739 7.93063 16.0256C7.61226 15.9844 7.29736 15.9198 6.9885 15.8323ZM6.53757 11.7176H11.2401C10.8052 13.283 10.0017 14.7215 8.89691 15.9128C7.79217 14.7189 6.98393 13.2817 6.53757 11.7176ZM10.8053 15.8323C10.4948 15.9129 10.1804 15.9774 9.86319 16.0256C10.9091 14.7699 11.6652 13.2989 12.0776 11.7176H15.5079C15.0844 12.7132 14.4415 13.6004 13.6273 14.3128C12.813 15.0253 11.8484 15.5447 10.8053 15.8323ZM12.2547 10.9123C12.5044 9.57917 12.5044 8.21126 12.2547 6.87811H15.7897C15.991 7.53279 16.0915 8.21431 16.0876 8.89924C16.0896 9.58081 15.992 10.259 15.7978 10.9123H12.2547Z" fill="black"/>
    </svg>
);

interface EditTenantFormValues {
    /**
     * Domain name of the tenant.
     */
    domain: string;
    /**
     * First name of the tenant admin.
     */
    firstname: string;
    /**
     * Last name of the tenant admin.
     */
    lastname: string;
    /**
     * Username of the tenant admin.
     */
    username: string;
    /**
     * Email of the tenant admin.
     */
    email: string;
    /**
     * Password of the tenant admin.
     */
    password: string;
}

type EditTenantFromErrors = Partial<EditTenantFormValues>;

/**
 * Component to hold the tenant details edit/update form.
 *
 * @param props - Props injected to the component.
 * @returns Tenant edit form component.
 */
const EditTenantFormForm: FunctionComponent<EditTenantFormFormProps> = ({
    tenant,
    ["data-componentid"]: componentId = "edit-tenant-form",
    ...rest
}: EditTenantFormFormProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const { data: validationData } = useValidationConfigData();

    const enableEmailDomain: boolean = useSelector((state: AppState) => state.config?.ui?.enableEmailDomain);

    const [ isPasswordValid, setIsPasswordValid ] = useState<boolean>(false);

    const userNameValidationConfig: ValidationFormInterface = useMemo((): ValidationFormInterface => {
        return getUsernameConfiguration(validationData);
    }, [ validationData ]);

    const passwordValidationConfig: ValidationFormInterface = useMemo((): ValidationFormInterface => {
        return getConfiguration(validationData);
    }, [ validationData ]);

    const validateUsernameAgainstUserstoreRegExp = async (value: string) => {
        if (!value) {
            return undefined;
        }

        const userRegex: string = await getUsertoreUsernameValidationPattern();

        if (!SharedUserStoreUtils.validateInputAgainstRegEx(value, userRegex) || !FormValidation.email(value)) {
            return t("tenants:common.form.fields.username.validations.regExViolation");
        }
    };

    const validateAlphanumericUsername = (value: string) => {
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
                                { enableEmailDomain ?
                                    t("tenants:common.form.fields.emailUsername.helperText")
                                    : t("tenants:common.form.fields.username.helperText")
                                }
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
                            { userNameValidationConfig?.isAlphanumericOnly ? t("tenants:common.form.fields.alphanumericUsername.validations.usernameHint", {
                                maxLength: userNameValidationConfig?.maxLength,
                                minLength: userNameValidationConfig?.minLength
                            }) : t("tenants:common.form.fields.alphanumericUsername.validations.usernameSpecialCharHint", {
                                maxLength: userNameValidationConfig?.maxLength,
                                minLength: userNameValidationConfig?.minLength
                            }) }
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

    const handleSubmit = (values: EditTenantFormValues): void => {
        const { domain, ...rest } = values;

        // const payload: AddTenantRequestPayload = {
        //     domain,
        //     owners: [ {
        //         ...rest,
        //         provisioningMethod: TenantStatus.INLINE_PASSWORD
        //     } ]
        // };

        // addTenant(payload)
        //     .then(() => {
        //         dispatch(
        //             addAlert({
        //                 description: "Successfully created the root  organization.",
        //                 level: AlertLevels.SUCCESS,
        //                 message: "Organization created"
        //             })
        //         );

        //         onSubmit && onSubmit();
        //     })
        //     .catch(() => {
        //         dispatch(
        //             addAlert({
        //                 description: "An error occurred while creating the organization.",
        //                 level: AlertLevels.ERROR,
        //                 message: "Couldn't create"
        //             })
        //         );
        //     });
    };

    const handleValidate = (values: EditTenantFormValues): EditTenantFromErrors => {
        const errors: EditTenantFromErrors = {
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

    return (
        <FinalForm
            initialValues={ {
                domain: tenant?.domain,
                email: tenant?.owners[ 0 ]?.email,
                firstname: tenant?.owners[ 0 ]?.firstname,
                id: tenant?.id,
                lastname: tenant?.owners[ 0 ]?.lastname,
                password: "",
                username: tenant?.owners[ 0 ]?.username
            } }
            keepDirtyOnReinitialize={ true }
            onSubmit={ handleSubmit }
            validate={ handleValidate }
            mutators={ {
                setRandomPassword: ([ name ]: [name: string], state, { changeValue }) => {
                    const randomPass: string = generatePassword(Number(passwordValidationConfig.minLength),
                        Number(passwordValidationConfig.minLowerCaseCharacters) > 0,
                        Number(passwordValidationConfig.minUpperCaseCharacters) > 0,
                        Number(passwordValidationConfig.minNumbers) > 0,
                        Number(passwordValidationConfig.minSpecialCharacters) > 0,
                        Number(passwordValidationConfig.minLowerCaseCharacters),
                        Number(passwordValidationConfig.minUpperCaseCharacters),
                        Number(passwordValidationConfig.minNumbers),
                        Number(passwordValidationConfig.minSpecialCharacters),
                        Number(passwordValidationConfig.minUniqueCharacters));

                    changeValue(state, name, () => randomPass);
                }
            } }
            render={ ({ form, handleSubmit }: FormRenderProps) => {
                return (
                    <form
                        id={ TenantConstants.ADD_TENANT_FORM_ID }
                        onSubmit={ handleSubmit }
                        className="edit-tenant-form"
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
                                            Enter a unique domain name for your organization. The domain name should be in the format of
                                            <Typography component="span" variant="inherit" fontWeight="bold">
                                                example.com
                                            </Typography>.
                                        </Trans>
                                    </Typography>
                                </Hint>)
                            }
                            label={ t("tenants:common.form.fields.domain.label") }
                            placeholder={ t("tenants:common.form.fields.domain.placeholder") }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                            endAdornment={ <InputAdornment position="end"><GlobeIcon /></InputAdornment> }
                            readOnly={ true }
                        />
                        <FinalFormField
                            key="id"
                            width={ 16 }
                            className="text-field-container"
                            ariaLabel="id"
                            required={ true }
                            data-componentid={ `${componentId}-id` }
                            InputProps={ {
                                endAdornment: (
                                    <Tooltip title="Copy">
                                        <div>
                                            <IconButton
                                                aria-label="Reset field to default"
                                                className="reset-field-to-default-adornment"
                                                onClick={ async () => {
                                                    await CommonUtils.copyTextToClipboard(tenant?.id);
                                                } }
                                                edge="end"
                                            >
                                                <CopyIcon size={ 12 } />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                ),
                                readOnly: true
                            } }
                            name="id"
                            type="text"
                            label={ t("tenants:common.form.fields.id.label") }
                            placeholder={ t("tenants:common.form.fields.id.placeholder") }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                            value={ tenant?.id }
                        />
                        <Typography variant="h5" sx={ { mb: 2, mt: 3 } }>
                            { t("tenants:addTenant.form.adminDetails.title") }
                        </Typography>
                        <Stack spacing={ 1 } direction="column">
                            <Stack spacing={ { sm: 2, xs: 1 } } direction={ { xs: "column", sm: "row" } }>
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
                            <Stack spacing={ { sm: 2, xs: 1 } } direction={ { xs: "column", sm: "row" } } alignItems="flex-end">
                                <div className="inline-flex-field">
                                    <FinalFormField
                                        key="password"
                                        width={ 16 }
                                        className="text-field-container"
                                        ariaLabel="password"
                                        required={ true }
                                        data-componentid={ `${componentId}-password` }
                                        name="password"
                                        type="password"
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
                            { passwordValidationConfig && (
                                <FormSpy subscription={ { values: true } }>
                                    { ({ values }: { values }) => (
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
                                                case: (Number(passwordValidationConfig?.minUpperCaseCharacters) > 0 &&
                                                Number(passwordValidationConfig?.minLowerCaseCharacters) > 0) ?
                                                    t("tenants:common.form.fields.password.validations.criteria.passwordCase", {
                                                        minLowerCase: passwordValidationConfig.minLowerCaseCharacters,
                                                        minUpperCase: passwordValidationConfig.minUpperCaseCharacters
                                                    }) : (
                                                        Number(passwordValidationConfig?.minUpperCaseCharacters) > 0 ?
                                                            t("tenants:common.form.fields.password.validations.criteria.upperCase", {
                                                                minUpperCase: passwordValidationConfig.minUpperCaseCharacters
                                                            }) : t("tenants:common.form.fields.password.validations.criteria.lowerCase", {
                                                                minLowerCase: passwordValidationConfig.minLowerCaseCharacters
                                                            })
                                                    ),
                                                consecutiveChr:
                                                t("tenants:common.form.fields.password.validations.criteria.consecutiveCharacters", {
                                                    repeatedChr: passwordValidationConfig.maxConsecutiveCharacters
                                                }),
                                                length: t("tenants:common.form.fields.password.validations.criteria.passwordLength", {
                                                    max: passwordValidationConfig.maxLength, min: passwordValidationConfig.minLength
                                                }),
                                                numbers:
                                                t("tenants:common.form.fields.password.validations.criteria.passwordNumeric", {
                                                    min: passwordValidationConfig.minNumbers
                                                }),
                                                specialChr:
                                                t("tenants:common.form.fields.password.validations.criteria.specialCharacter", {
                                                    specialChr: passwordValidationConfig.minSpecialCharacters
                                                }),
                                                uniqueChr:
                                                t("tenants:common.form.fields.password.validations.criteria.uniqueCharacters", {
                                                    uniqueChr: passwordValidationConfig.minUniqueCharacters
                                                })
                                            } }
                                        />
                                    ) }
                                </FormSpy>
                            ) }
                        </Stack>
                        <Button
                            sx={ { mt: "var(--wso2is-admin-form-submit-action-top-spacing)" } }
                            autoFocus
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            { t("tenants:editTenant.actions.save.label") }
                        </Button>
                    </form>
                );
            } }
            { ...rest }
        />
    );
};

export default EditTenantFormForm;
