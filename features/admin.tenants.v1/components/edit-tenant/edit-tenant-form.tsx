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

import Button from "@oxygen-ui/react/Button";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Stack from "@oxygen-ui/react/Stack";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography/Typography";
import { CopyIcon, GlobeIcon } from "@oxygen-ui/react-icons";
import { AppState } from "@wso2is/admin.core.v1/store";
import { generatePassword, getConfiguration } from "@wso2is/admin.users.v1/utils/generate-password.utils";
import { getUsernameConfiguration } from "@wso2is/admin.users.v1/utils/user-management-utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api/validation-config";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models/validation-config";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils } from "@wso2is/core/utils";
import {
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    MutableState,
    TextFieldAdapter,
    Tools
} from "@wso2is/form";
import { Hint, PasswordValidation } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import updateTenantOwner from "../../api/update-tenant-owner";
import useGetTenant from "../../api/use-get-tenant";
import useGetTenantOwner from "../../api/use-get-tenant-owner";
import TenantConstants from "../../constants/tenant-constants";
import { Tenant, TenantOwner } from "../../models/tenants";
import "./edit-tenant-form.scss";

/**
 * Props interface of {@link EditTenantForm}
 */
export type EditTenantFormProps = IdentifiableComponentInterface & {
    /**
     * Tenant object.
     */
    tenant: Tenant;
    /**
     * Callback to trigger when the form is submitted.
     */
    onSubmit?: () => void;
};

export type EditTenantFormValues = Pick<Tenant, "domain" | "id"> & Omit<TenantOwner, "additionalDetails">;

export type EditTenantFormErrors = Partial<EditTenantFormValues>;

/**
 * Component to hold the tenant details edit/update form.
 *
 * @param props - Props injected to the component.
 * @returns Tenant edit form component.
 */
const EditTenantForm: FunctionComponent<EditTenantFormProps> = ({
    tenant,
    ["data-componentid"]: componentId = "edit-tenant-form",
    ...rest
}: EditTenantFormProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const { mutate: mutateTenant } = useGetTenant(tenant?.id);
    const { mutate: mutateTenantOwner } = useGetTenantOwner(
        tenant?.id,
        tenant?.owners[0]?.id,
        !!tenant
    );
    const { data: validationData } = useValidationConfigData();

    const enableEmailDomain: boolean = useSelector((state: AppState) => state.config?.ui?.enableEmailDomain);

    const [ isPasswordValid, setIsPasswordValid ] = useState<boolean>(false);

    const userNameValidationConfig: ValidationFormInterface = useMemo((): ValidationFormInterface => {
        return getUsernameConfiguration(validationData);
    }, [ validationData ]);

    const passwordValidationConfig: ValidationFormInterface = useMemo((): ValidationFormInterface => {
        return getConfiguration(validationData);
    }, [ validationData ]);

    /**
     * Handles the form submit action.
     * @param values - Form values.
     */
    const handleSubmit = (values: EditTenantFormValues): void => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { domain, id, username, ...rest } = values;

        updateTenantOwner(tenant?.id, { id: tenant?.owners[0]?.id, ...rest } as TenantOwner)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:editTenant.notifications.updateTenant.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("tenants:editTenant.notifications.updateTenant.success.message")
                    })
                );

                mutateTenant();
                mutateTenantOwner();
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("tenants:editTenant.notifications.updateTenant.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("tenants:editTenant.notifications.updateTenant.error.message")
                    })
                );
            });
    };

    /**
     * Handles the form level validation.
     * @param values - Form values.
     * @returns Form errors.
     */
    const handleValidate = (values: EditTenantFormValues): EditTenantFormErrors => {
        const errors: EditTenantFormErrors = {
            email: undefined,
            firstname: undefined,
            lastname: undefined,
            password: undefined
        };

        if (!values.firstname) {
            errors.firstname = t("tenants:common.form.fields.firstname.validations.required");
        }

        if (!values.lastname) {
            errors.lastname = t("tenants:common.form.fields.lastname.validations.required");
        }

        if (!values.email) {
            errors.email = t("tenants:common.form.fields.email.validations.required");
        } else if (!FormValidation.email(values.email)) {
            errors.email = t("tenants:common.form.fields.email.validations.invalid");
        }

        if (!values.password) {
            errors.password = t("tenants:common.form.fields.password.validations.required");
        } else if (!isPasswordValid) {
            errors.password = "";
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
                    maxLength={ 100 }
                    minLength={ 0 }
                    readOnly={ true }
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
                label={ t("tenants:common.form.fields.alphanumericUsername.label") }
                placeholder={ t("tenants:common.form.fields.alphanumericUsername.placeholder") }
                component={ TextFieldAdapter }
                maxLength={ 100 }
                minLength={ 0 }
                readOnly={ true }
            />
        );
    };

    /**
     * Renders the password validation criteria with the help of `PasswordValidation` component.
     * @returns Password validation criteria.
     */
    const renderPasswordValidationCriteria = (): ReactElement => (
        <FormSpy subscription={ { values: true } }>
            { ({ values }: { values: EditTenantFormValues }) => (
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

    return (
        <FinalForm
            initialValues={ {
                domain: tenant?.domain,
                email: tenant?.owners[0]?.email,
                firstname: tenant?.owners[0]?.firstname,
                id: tenant?.id,
                lastname: tenant?.owners[0]?.lastname,
                password: "",
                username: tenant?.owners[0]?.username
            } }
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
                        <Typography variant="h5" className="edit-tenant-form-sub-title">
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
                            <FormSpy subscription={ { errors: true, modified: true } }>
                                { ({
                                    errors,
                                    modified
                                }: {
                                    errors: EditTenantFormErrors;
                                    modified?: { [key: string]: boolean };
                                }) => (
                                    <Stack
                                        spacing={ { sm: 2, xs: 1 } }
                                        direction={ { sm: "row", xs: "column" } }
                                        alignItems={ modified?.password && errors?.password ? "center" : "flex-end" }
                                    >
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
                                ) }
                            </FormSpy>
                            { passwordValidationConfig && renderPasswordValidationCriteria() }
                        </Stack>
                        <Button
                            autoFocus
                            className="edit-tenant-form-submit-button"
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

export default EditTenantForm;
