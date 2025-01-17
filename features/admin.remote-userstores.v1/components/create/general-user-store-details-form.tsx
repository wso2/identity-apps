/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, RadioGroupFieldAdapter, TextFieldAdapter } from "@wso2is/form";
import { RadioChild } from "@wso2is/forms";
import React, {
    ForwardRefExoticComponent,
    ForwardedRef,
    MutableRefObject,
    ReactElement,
    RefAttributes,
    forwardRef,
    useImperativeHandle,
    useRef
} from "react";
import { useTranslation } from "react-i18next";
import {
    ConnectedUserStoreTypes,
    RemoteUserStoreAccessTypes,
    RemoteUserStoreConstants,
    USERSTORE_VALIDATION_REGEX_PATTERNS
} from "../../constants/remote-user-stores-constants";
import { GeneralDetailsFormValuesInterface } from "../../models/ui";
import { validateInputWithRegex } from "../../utils/userstore-utils";

import "./general-user-store-details-form.scss";

/**
 * Prop types of the general user store details component
 */
interface GeneralUserStoreDetailsPropsInterface extends IdentifiableComponentInterface {
    /**
     * User store manager.
     */
    userStoreManager:
        | RemoteUserStoreManagerType.WSOutboundUserStoreManager
        | RemoteUserStoreManagerType.RemoteUserStoreManager;
    /**
     * Whether the form is read only or not.
     */
    isReadOnly: boolean;
    /**
     * Whether the read-write user stores feature is enabled or not.
     */
    isReadWriteUserStoresEnabled: boolean;
    /**
     * Callback to be called on form submit.
     * @param values - Form values.
     * @returns void
     */
    onSubmit: (values: GeneralDetailsFormValuesInterface) => void;
    /**
     * Initial values for the form.
     */
    initialValues?: Partial<GeneralDetailsFormValuesInterface>;
}

export interface GeneralUserStoreDetailsFormRef {
    triggerSubmit: () => void;
}

/**
 * This component renders the general user store details form component.
 *
 * @param props - Props injected to the component.
 *
 * @returns The general user store details form component.
 */
const GeneralUserStoreDetailsForm: ForwardRefExoticComponent<RefAttributes<GeneralUserStoreDetailsFormRef> &
    GeneralUserStoreDetailsPropsInterface> = forwardRef(
        (
            {
                userStoreManager,
                isReadOnly,
                isReadWriteUserStoresEnabled,
                onSubmit,
                initialValues,
                ["data-componentid"]: testId = "asgardeo-customer-userstore-general-details"
            }: GeneralUserStoreDetailsPropsInterface,
            ref: ForwardedRef<GeneralUserStoreDetailsFormRef>
        ): ReactElement => {
            const { t } = useTranslation();

            const triggerFormSubmit: MutableRefObject<() => void> = useRef<(() => void) | null>(null);

            // Expose triggerSubmit to the parent via the ref
            useImperativeHandle(
                ref,
                () => ({
                    triggerSubmit: () => {
                        if (triggerFormSubmit.current) {
                            triggerFormSubmit.current();
                        }
                    }
                }),
                []
            );

            const userStoreOptions: RadioChild[] = [
                {
                    "data-componentid": `${testId}-user-store-type-ldap-option-radio-button`,
                    label: t(
                        "extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form.fields." +
                        "userStoreType.types.ldap.label"
                    ),
                    value: ConnectedUserStoreTypes.LDAP
                },
                {
                    "data-componentid": `${testId}-user-store-type-ad-option-radio-button`,
                    label: t(
                        "extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form.fields." +
                        "userStoreType.types.ad.label"
                    ),
                    value: ConnectedUserStoreTypes.ActiveDirectory
                }
            ];

            const accessTypeOptions: RadioChild[] = [
                {
                    "data-componentid": `${testId}-access-type-read-only-option-radio-button`,
                    hint: {
                        content: t(
                            "extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form." +
                            "fields.accessType.types.readOnly.hint"
                        )
                    },
                    label: t(
                        "extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form.fields." +
                        "accessType.types.readOnly.label"
                    ),
                    value: RemoteUserStoreAccessTypes.ReadOnly
                },
                {
                    "data-componentid": `${testId}-access-type-read-write-option-radio-button`,
                    hint: {
                        content: t(
                            "extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form." +
                            "fields.accessType.types.readWrite.hint"
                        )
                    },
                    label: t(
                        "extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.form.fields." +
                        "accessType.types.readWrite.label"
                    ),
                    value: RemoteUserStoreAccessTypes.ReadWrite
                }
            ];

            const validateForm = (
                values: GeneralDetailsFormValuesInterface
            ): Partial<GeneralDetailsFormValuesInterface> => {
                const error: Partial<GeneralDetailsFormValuesInterface> = {};

                if (!values?.name) {
                    error.name = t("remoteUserStores:form.fields.name.validation.required");
                } else {
                    const nameValue: string = values?.name.toUpperCase();
                    // Regular expression to validate having no symbols in the user store name.
                    const regExpInvalidSymbols: RegExp = new RegExp("^[^_/]+$");
                    // Regular expression to validate having all symbols in the user store name.
                    const regExpAllSymbols: RegExp = new RegExp("^([^a-zA-Z0-9]+$)");

                    // Already created/restricted user store names.
                    const restrictedUserStores: string[] = [
                        RemoteUserStoreConstants.PRIMARY_USER_STORE_NAME,
                        RemoteUserStoreConstants.FEDERATION_USER_STORE_NAME,
                        RemoteUserStoreConstants.DEFAULT_USER_STORE_NAME
                    ];

                    // Reserved user store names.
                    const reservedUserStores: string[] = [
                        RemoteUserStoreConstants.INTERNAL_USER_STORE_NAME,
                        RemoteUserStoreConstants.APPLICATION_USER_STORE_NAME
                    ];

                    const validityResult: Map<string, string | boolean> = validateInputWithRegex(
                        nameValue,
                        USERSTORE_VALIDATION_REGEX_PATTERNS.EscapeRegEx
                    );
                    const validationMatch: boolean = validityResult.get("isMatch").toString() === "true";

                    if (!regExpInvalidSymbols.test(nameValue)) {
                        error.name = t(
                            "extensions:manage.features.userStores.edit." +
                            "general.form.validations.invalidSymbolsErrorMessage"
                        );
                    } else if (restrictedUserStores.includes(nameValue.trim().toUpperCase())) {
                        error.name = t(
                            "extensions:manage.features.userStores.edit." +
                            "general.form.validations.restrictedNamesErrorMessage",
                            { name: nameValue }
                        );
                    } else if (reservedUserStores.includes(nameValue.trim().toUpperCase())) {
                        error.name = t(
                            "extensions:manage.features.userStores.edit." +
                            "general.form.validations.reservedNamesErrorMessage",
                            { name: nameValue }
                        );
                    } else if (regExpAllSymbols.test(nameValue)) {
                        error.name = t(
                            "extensions:manage.features.userStores.edit." +
                            "general.form.validations.allSymbolsErrorMessage"
                        );
                    } else if (validationMatch) {
                        const invalidString: string = validityResult.get("invalidStringValue").toString();

                        error.name = t(
                            "userstores:forms.general.name.validationErrorMessages.invalidInputErrorMessage",
                            { invalidString }
                        );
                    }
                }

                if (values?.description) {
                    const validityResult: Map<string, string | boolean> = validateInputWithRegex(
                        values?.description,
                        USERSTORE_VALIDATION_REGEX_PATTERNS.EscapeRegEx
                    );
                    const validationMatch: boolean = validityResult.get("isMatch").toString() === "true";

                    if (validationMatch) {
                        const invalidString: string = validityResult.get("invalidStringValue").toString();

                        error.description = t(
                            "userstores:forms.general.description.validationErrorMessages.invalidInputErrorMessage",
                            { invalidString }
                        );
                    }
                }

                if (!values?.accessType) {
                    error.accessType = t("remoteUserStores:form.fields.accessType.validation.required");
                }

                if (
                    isReadWriteUserStoresEnabled &&
                    userStoreManager === RemoteUserStoreManagerType.WSOutboundUserStoreManager &&
                    !values?.connectedUserStoreType
                ) {
                    error.connectedUserStoreType = t(
                        "remoteUserStores:form.fields.connectedUserStoreType.validation.required");
                }

                return error;
            };

            return (
                <FinalForm
                    onSubmit={ (values: GeneralDetailsFormValuesInterface) => {
                        onSubmit({ ...values, name: values?.name?.toUpperCase() });
                    } }
                    validate={ validateForm }
                    initialValues={ initialValues }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        triggerFormSubmit.current = handleSubmit;

                        return (
                            <form onSubmit={ handleSubmit } className="general-user-store-details-form">
                                <FinalFormField
                                    className="text-field-container"
                                    FormControlProps={ {
                                        margin: "dense"
                                    } }
                                    data-componentid={ `${testId}-field-name` }
                                    name="name"
                                    type="text"
                                    label={ t("remoteUserStores:form.fields.name.label") }
                                    placeholder={ t("remoteUserStores:form.fields.name.placeholder") }
                                    component={ TextFieldAdapter }
                                    disabled={ isReadOnly }
                                    required
                                    uppercase
                                />

                                <FinalFormField
                                    className="text-field-container"
                                    FormControlProps={ {
                                        margin: "dense"
                                    } }
                                    ariaLabel="userStoreDescription"
                                    required={ false }
                                    data-componentid={ `${testId}-field-description` }
                                    name="description"
                                    type="text"
                                    label={ t("remoteUserStores:form.fields.description.label") }
                                    placeholder={ t("remoteUserStores:form.fields.description.placeholder") }
                                    component={ TextFieldAdapter }
                                    disabled={ isReadOnly }
                                />

                                <FinalFormField
                                    className="text-field-container"
                                    label={ t("remoteUserStores:form.fields.connectedUserStoreType.label") }
                                    name="connectedUserStoreType"
                                    FormControlProps={ {
                                        fullWidth: true,
                                        margin: "dense"
                                    } }
                                    data-componentid={ `${testId}-field-connectedUserStoreType` }
                                    component={ RadioGroupFieldAdapter }
                                    disabled={ isReadOnly }
                                    options={ userStoreOptions.map((option: RadioChild) => ({
                                        label: option.label,
                                        value: option.value
                                    })) }
                                    required
                                />

                                { isReadWriteUserStoresEnabled &&
                                        userStoreManager === RemoteUserStoreManagerType.WSOutboundUserStoreManager && (
                                    <FinalFormField
                                        className="text-field-container"
                                        label={ t("remoteUserStores:form.fields.accessType.label") }
                                        name="accessType"
                                        FormControlProps={ {
                                            fullWidth: true,
                                            margin: "dense"
                                        } }
                                        data-componentid={ `${testId}-field-accessType` }
                                        component={ RadioGroupFieldAdapter }
                                        disabled={ isReadOnly }
                                        options={ accessTypeOptions.map(({ label, value, ...rest }: RadioChild) => ({
                                            label,
                                            value,
                                            ...rest
                                        })) }
                                        required
                                    />
                                ) }
                            </form>
                        );
                    } }
                />
            );
        }
    );

export default GeneralUserStoreDetailsForm;
