/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import React, { Dispatch, FunctionComponent, ReactElement, SetStateAction, useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Icon, Message, Segment } from "semantic-ui-react";
import { ContentLoader } from "@wso2is/react-components/src/components/loader/content-loader";
import isEmpty from "lodash-es/isEmpty";
import debounce from "lodash-es/debounce";
import { checkDuplicateTenants } from "../../api";
import { TenantManagementConstants } from "../../constants";
import { Hint } from "@wso2is/react-components";
import { AxiosResponse } from "axios";

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

/**
 * Form component to capture new tenant data.
 *
 * @param {AddTenantWizardFormPropsInterface} props - props required for new tenant form component
 * @return {React.ReactElement}
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

    const [newTenantName, setNewTenantName] = useState<string>(TenantManagementConstants.TENANT_URI_PLACEHOLDER);
    const [isTenantValid, setIsTenantValid] = useState<boolean>(false);

    const { t } = useTranslation();

    const checkTenantValidity = (tenantName: string): boolean => {
        const isValidTenantName =
            tenantName && !!tenantName.match(TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_PATTERN);
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
    const isDuplicateTenant = useCallback(debounce((data: string) => {
        checkDuplicateTenants(data)
            .then((response: AxiosResponse) => {
                if (response.status == 200) {
                    setTenantDuplicate(true);
                }
                setCheckingTenantExistence(false);
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    // Proceed if tenant does not exist.
                    setTenantDuplicate(false);
                }
                setCheckingTenantExistence(false);
            });
    }, 1000), []);

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
     * @param {AddTenantWizardFormValuesInterface} values - Form Values.
     *
     * @return {AddTenantWizardFormErrorValidationsInterface}
     */
    const validateForm = (values: AddTenantWizardFormValuesInterface):
        AddTenantWizardFormErrorValidationsInterface => {

        const error: AddTenantWizardFormErrorValidationsInterface = {
            tenantName: undefined
        };

        if (tenantDuplicate) {
            error.tenantName = (
                t("extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                    "tenantName.validations.duplicate",
                    { tenantName: values.toString() })
            );
        } else if (!values.tenantName) {
            error.tenantName = (
                t("extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.validations.empty")
            );
        }
        return error;
    };

    return (
        <>
            <Form
                onSubmit={ (values) => {
                    setSubmissionValue(values as AddTenantWizardFormValuesInterface);
                } }
                triggerSubmit={ (submitFunction) => triggerSubmission(submitFunction) }
                uncontrolledForm={ false }
                validate={
                    (tenantDuplicate || newTenantName === TenantManagementConstants.TENANT_URI_PLACEHOLDER)
                    && validateForm
                }
            >
                <Field.Input
                    ariaLabel="Tenant Name"
                    inputType="resource_name"
                    name="tenantName"
                    label={
                        t("extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.label")
                    }
                    placeholder={
                        t("extensions:manage.features.tenant.wizards.addTenant.forms.fields.tenantName.placeholder")
                    }
                    required={ true }
                    listen={ (value) => updateTenantUrl(value) }
                    maxLength={ TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_MAX_LENGTH }
                    minLength={ TenantManagementConstants.FORM_FIELD_CONSTRAINTS.TENANT_NAME_MIN_LENGTH }
                    validation={ (value: string) => {
                        if (!checkTenantValidity(value.toString())) {
                            if (value.length < TenantManagementConstants.FORM_FIELD_CONSTRAINTS
                                .TENANT_NAME_MIN_LENGTH) {
                                return (
                                    t("extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                                        "tenantName.validations.invalidLength",
                                        { characterLimit: TenantManagementConstants
                                                .FORM_FIELD_CONSTRAINTS.TENANT_NAME_MAX_LENGTH,
                                            characterLowerLimit: TenantManagementConstants
                                                .FORM_FIELD_CONSTRAINTS.TENANT_NAME_MIN_LENGTH }
                                    )
                                );
                            }
                            else {
                                return (
                                    t("extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                                        "tenantName.validations.invalid",
                                        { characterLimit: TenantManagementConstants
                                                .FORM_FIELD_CONSTRAINTS.TENANT_NAME_MAX_LENGTH }
                                    )
                                );
                            }
                        } else if (tenantDuplicate) {
                            return (
                                t("extensions:manage.features.tenant.wizards.addTenant.forms.fields." +
                                    "tenantName.validations.duplicate",
                                    { tenantName: value.toString() })
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
            <Divider className="mt-1" hidden/>
            { isCheckingTenantExistence
                ? (
                    <span className="display-flex">
                        https://console.asgardeo.io/t/
                        <Segment basic size="mini" >
                            <ContentLoader className="p-0" size="mini" active inline
                                           data-testid={ `${ testId }-name-loader` }
                            />
                        </Segment>
                    </span>
                ) : (
                    <span>
                        https://console.asgardeo.io/t/
                        <span className={ `${
                            newTenantName !== TenantManagementConstants.TENANT_URI_PLACEHOLDER
                                ? isTenantValid && !tenantDuplicate
                                ? "valid-tenant placeholder-uri-bold"
                                : "invalid-tenant placeholder-uri-bold"
                                : newTenantName == TenantManagementConstants.TENANT_URI_PLACEHOLDER
                                ? isTenantValid && !tenantDuplicate
                                    ? "valid-tenant placeholder-uri-bold"
                                    : "placeholder-uri"
                                : void 0
                        }` }>
                            { newTenantName }
                            <Hint icon="info circle" popup>
                                { t("extensions:manage.features.tenant.wizards.addTenant.tooltips.message") }
                            </Hint>
                        </span>
                    </span>
                )
            }
            <Divider className="mt-1" hidden/>
            <Message className="with-inline-icon" icon visible info>
                <Icon name="info" size="mini" />
                <Message.Content>
                    <Trans
                        i18nKey={ "extensions:manage.features.tenant.wizards.addTenant.forms.messages.info" }
                    >
                        Think of a good, unique organization name for your new Asgardeo workspace because
                        you&nbsp;won’t be able to change it later!
                    </Trans>
                </Message.Content>
            </Message>
        </>
    );
};

/**
 * Default props for the component.
 */
AddTenantWizardForm.defaultProps = {
    "data-testid": "add-tenant-wizard-form"
};
