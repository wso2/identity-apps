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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Hint, Message } from "@wso2is/react-components";
import { ContentLoader } from "@wso2is/react-components/src/components/loader/content-loader";
import { AxiosError, AxiosResponse } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Dispatch,
    FunctionComponent,
    ReactElement,
    SetStateAction,
    useCallback,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Segment } from "semantic-ui-react";
import { AppState } from "@wso2is/admin.core.v1/store";
import { checkDuplicateTenants } from "../../api";
import { TenantManagementConstants } from "../../constants";

/**
 * Interface to capture add tenant wizard form props.
 */
interface AddTenantWizardFormPropsInterface extends TestableComponentInterface {
    setSubmissionValue: Dispatch<SetStateAction<any>>;
    triggerSubmission: any;
    tenantDuplicate: boolean;
    setTenantDuplicate: Dispatch<SetStateAction<boolean>>;
    isCheckingTenantExistence: boolean;
    setCheckingTenantExistence: Dispatch<SetStateAction<boolean>>;
}

/**
 * Interface to capture add tenant wizard form error messages.
 */
export interface AddTenantWizardFormErrorValidationsInterface {
    tenantName: string;
}

/**
 * Interface to capture add tenant wizard form values.
 */
export interface AddTenantWizardFormValuesInterface {
    tenantName: string;
}

const FORM_ID: string = "add-tenant-wizard-form";

/**
 * Form component to capture new tenant data.
 *
 * @param props - props required for new tenant form component
 * @returns Functional component.
 */
export const AddTenantWizardForm: FunctionComponent<AddTenantWizardFormPropsInterface> = (
    props: AddTenantWizardFormPropsInterface
): ReactElement => {
    const {
        setSubmissionValue,
        triggerSubmission,
        tenantDuplicate,
        setTenantDuplicate,
        isCheckingTenantExistence,
        setCheckingTenantExistence,
        [ "data-testid" ]: testId
    } = props;

    const [ newTenantName, setNewTenantName ] = useState<string>(
        TenantManagementConstants.TENANT_URI_PLACEHOLDER
    );
    const [ isTenantValid, setIsTenantValid ] = useState<boolean>(false);

    const regionQualifiedConsoleUrl: string = useSelector((state: AppState) => {
        return state.config?.deployment?.extensions?.regionQualifiedConsoleUrl as string;
    });

    const tenantPrefix: string = useSelector((state: AppState) => {
        return state.config?.deployment?.tenantPrefix as string;
    });

    const { t } = useTranslation();

    const checkTenantValidity = (tenantName: string): boolean => {
        const isValidTenantName: boolean =
            !!tenantName &&
            !!tenantName.match(
                TenantManagementConstants.FORM_FIELD_CONSTRAINTS
                    .TENANT_NAME_PATTERN
            );

        if (!isValidTenantName) {
            setCheckingTenantExistence(false);
            isDuplicateTenant.cancel();
        }

        return isValidTenantName;
    };

    /**
     * Function to check if the tenant name user entered is already taken. A debounced version of the function is used
     * to trigger the API call only after user stops typing for 1000ms.
     */
    const isDuplicateTenant: DebouncedFunc<(
        data: string
    ) => void> = useCallback(
        debounce((data: string) => {
            checkDuplicateTenants(data)
                .then((response: AxiosResponse) => {
                    if (response.status == 200) {
                        setTenantDuplicate(true);
                    }
                    setCheckingTenantExistence(false);
                })
                .catch((error: AxiosError) => {
                    if (error.response.status == 404) {
                        // Proceed if tenant does not exist.
                        setTenantDuplicate(false);
                    }
                    setCheckingTenantExistence(false);
                });
        }, 1000),
        []
    );

    const updateTenantUrl = (tenantName: any): void => {
        setTenantDuplicate(false);
        if (isEmpty(tenantName)) {
            setNewTenantName(TenantManagementConstants.TENANT_URI_PLACEHOLDER);
            setIsTenantValid(false);
        } else {
            setNewTenantName(tenantName);
            setIsTenantValid(checkTenantValidity(tenantName));
        }
    };

    /**
     * Validate input data.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (
        values: AddTenantWizardFormValuesInterface
    ): AddTenantWizardFormErrorValidationsInterface => {
        const error: AddTenantWizardFormErrorValidationsInterface = {
            tenantName: undefined
        };

        if (tenantDuplicate) {
            error.tenantName = t(
                "extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                "tenantName.validations.duplicate",
                { tenantName: values.toString() }
            );
        } else if (!values.tenantName) {
            error.tenantName = t(
                "extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.validations.empty"
            );
        }

        return error;
    };

    return (
        <>
            <Form
                id={ FORM_ID }
                onSubmit={ (values: Record<string, any>) => {
                    setSubmissionValue(values as AddTenantWizardFormValuesInterface);
                } }
                triggerSubmit={ (submitFunction: any) => triggerSubmission(submitFunction) }
                uncontrolledForm={ false }
                validate={
                    (tenantDuplicate ||
                        newTenantName ===
                        TenantManagementConstants.TENANT_URI_PLACEHOLDER) &&
                    validateForm
                }
            >
                <Field.Input
                    ariaLabel="Tenant Name"
                    inputType="resource_name"
                    name="tenantName"
                    label={ t(
                        "extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.label"
                    ) }
                    placeholder={ t(
                        "extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.placeholder"
                    ) }
                    required={ true }
                    listen={ (value: string) => updateTenantUrl(value) }
                    maxLength={
                        TenantManagementConstants.FORM_FIELD_CONSTRAINTS
                            .TENANT_NAME_MAX_LENGTH
                    }
                    minLength={
                        TenantManagementConstants.FORM_FIELD_CONSTRAINTS
                            .TENANT_NAME_MIN_LENGTH
                    }
                    validation={ (value: string) => {
                        if (!checkTenantValidity(value.toString())) {
                            if (
                                value.length <
                                TenantManagementConstants.FORM_FIELD_CONSTRAINTS
                                    .TENANT_NAME_MIN_LENGTH
                            ) {
                                return (
                                    <Message error>
                                        <Trans
                                            i18nKey={
                                                "extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                                                "tenantName.validations.invalidLength"
                                            }
                                            minLength={
                                                TenantManagementConstants
                                                    .FORM_FIELD_CONSTRAINTS
                                                    .TENANT_NAME_MIN_LENGTH
                                            }
                                            maxLength={
                                                TenantManagementConstants
                                                    .FORM_FIELD_CONSTRAINTS
                                                    .TENANT_NAME_MAX_LENGTH
                                            }
                                        >
                                            The name you entered is less than { { minLength: TenantManagementConstants
                                                .FORM_FIELD_CONSTRAINTS
                                                .TENANT_NAME_MIN_LENGTH } } characters. It must
                                            <ul>
                                                <li>be unique</li>
                                                <li>
                                                    <>
                                                    contain more than{ " " }
                                                        { {
                                                            minLength:
                                                            TenantManagementConstants
                                                                .FORM_FIELD_CONSTRAINTS
                                                                .TENANT_NAME_MIN_LENGTH
                                                        } }
                                                    and less than{ " " }
                                                        { {
                                                            maxLength:
                                                            TenantManagementConstants
                                                                .FORM_FIELD_CONSTRAINTS
                                                                .TENANT_NAME_MAX_LENGTH
                                                        } }
                                                    characters
                                                    </>
                                                </li>
                                                <li>
                                                    consist of only lowercase
                                                    alphanumeric characters
                                                </li>
                                                <li>
                                                    begin with an alphabetic
                                                    character
                                                </li>
                                            </ul>
                                        </Trans>
                                    </Message>
                                );
                            } else {
                                return (
                                    <Message error>
                                        <Trans
                                            i18nKey={
                                                "extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                                                "tenantName.validations.invalid"
                                            }
                                            minLength={
                                                TenantManagementConstants
                                                    .FORM_FIELD_CONSTRAINTS
                                                    .TENANT_NAME_MIN_LENGTH
                                            }
                                            maxLength={
                                                TenantManagementConstants
                                                    .FORM_FIELD_CONSTRAINTS
                                                    .TENANT_NAME_MAX_LENGTH
                                            }
                                        >
                                            Please enter a valid format for
                                            organization name. It must
                                            <ul>
                                                <li>be unique</li>
                                                <li>
                                                    <>
                                                    contain more than{ " " }
                                                        { {
                                                            minLength:
                                                            TenantManagementConstants
                                                                .FORM_FIELD_CONSTRAINTS
                                                                .TENANT_NAME_MIN_LENGTH
                                                        } }
                                                    and less than{ " " }
                                                        { {
                                                            maxLength:
                                                            TenantManagementConstants
                                                                .FORM_FIELD_CONSTRAINTS
                                                                .TENANT_NAME_MAX_LENGTH
                                                        } }
                                                    characters
                                                    </>
                                                </li>
                                                <li>
                                                    consist of only lowercase
                                                    alphanumeric characters
                                                </li>
                                                <li>
                                                    begin with an alphabetic
                                                    character
                                                </li>
                                            </ul>
                                        </Trans>
                                    </Message>
                                );
                            }
                        } else if (tenantDuplicate) {
                            return t(
                                "extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                                "tenantName.validations.duplicate",
                                {
                                    tenantName: value.toString()
                                }
                            );
                        } else {
                            setCheckingTenantExistence(true);
                            isDuplicateTenant(value.toString());
                        }
                    } }
                    width={ 16 }
                    data-testid={ `${ testId }-type-input` }
                />
            </Form>
            <Divider className="mt-1" hidden />
            { isCheckingTenantExistence ? (
                <span className="display-flex">
                    { `${regionQualifiedConsoleUrl ?? "https://console.asgardeo.io"}/${tenantPrefix ?? "t"}/` }
                    <Segment basic size="mini">
                        <ContentLoader
                            className="p-0"
                            size="mini"
                            active
                            inline
                            data-testid={ `${ testId }-name-loader` }
                        />
                    </Segment>
                </span>
            ) : (
                <span>
                    { `${regionQualifiedConsoleUrl ?? "https://console.asgardeo.io"}/${tenantPrefix ?? "t"}/` }
                    <span
                        className={ `${ newTenantName !==
                                TenantManagementConstants.TENANT_URI_PLACEHOLDER
                            ? isTenantValid && !tenantDuplicate
                                ? "valid-tenant placeholder-uri-bold"
                                : "invalid-tenant placeholder-uri-bold"
                            : newTenantName ==
                                    TenantManagementConstants.TENANT_URI_PLACEHOLDER
                                ? isTenantValid && !tenantDuplicate
                                    ? "valid-tenant placeholder-uri-bold"
                                    : "placeholder-uri"
                                : void 0
                        }` }
                    >
                        { newTenantName }
                        <Hint icon="info circle" popup>
                            { t(
                                "extensions:manage.features.tenant.wizards.addTenant.tooltips.message"
                            ) }
                        </Hint>
                    </span>
                </span>
            ) }
            <Divider className="mt-1" hidden />
            <Message
                type="info"
                content={
                    (<Trans
                        i18nKey={
                            "extensions:manage.features.tenant.wizards.addTenant.forms.messages.info"
                        }
                    >
                        Think of a good, unique organization name for your new
                        Asgardeo workspace because you&nbsp;won’t be able to
                        change it later!
                    </Trans>)
                }
            />
        </>
    );
};

/**
 * Default props for the component.
 */
AddTenantWizardForm.defaultProps = {
    "data-testid": "add-tenant-wizard-form"
};
