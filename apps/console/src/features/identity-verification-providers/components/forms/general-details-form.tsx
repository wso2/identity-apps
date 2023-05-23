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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useIdentityVerificationProviderList } from "../../api";
import { IdentityVerificationProviderConstants } from "../../constants/identity-verification-provider-constants";
import { IdentityVerificationProviderInterface } from "../../models";
import { validateIDVPName } from "../../utils/validation-utils";

/**
 * Proptypes for the identity provider general details form component.
 */
interface GeneralDetailsFormPopsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDVP.
     */
    identityVerificationProvider: IdentityVerificationProviderInterface;
    /**
     * On submit callback.
     */
    onSubmit: (values: any) => void;
    /**
     * Callback to update the idp details.
     */
    onUpdate?: (id: string) => void;
    /**
     * Externally trigger form submission.
     */
    triggerSubmit?: boolean;
    /**
     * Optimize for the creation wizard.
     */
    enableWizardMode?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}


const FORM_ID: string = "idvp-general-settings-form";

/**
 * Form to edit general details of the identity verification provider.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (
    props: GeneralDetailsFormPopsInterface): ReactElement => {

    const {
        onSubmit,
        identityVerificationProvider,
        isReadOnly,
        isSubmitting,
        ["data-testid"]: testId
    } = props;


    const { t } = useTranslation();
    const { data: idvpList } = useIdentityVerificationProviderList();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const updateConfigurations = (values: Record<string, any>): void => {
        onSubmit({
            Name: values.name?.toString(),
            description: values.description?.toString()
        });
    };


    return (
        <React.Fragment>
            <EmphasizedSegment padded="very">
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ false }
                    onSubmit={ (values: Record<string, any>): void => {
                        updateConfigurations(values);
                    } }
                    data-testid={ testId }
                >
                    <Field.Input
                        ariaLabel="name"
                        inputType="resource_name"
                        name="name"
                        label={ t("console:develop.features.idvp.forms.generalDetails.name.label") }
                        required={ true }
                        message={ t("console:develop.features.idvp.forms.generalDetails.name.validations.empty") }
                        placeholder={ identityVerificationProvider.Name }
                        validation={ (value: string) => {
                            return validateIDVPName(
                                value,
                                idvpList.identityVerificationProviders,
                                identityVerificationProvider
                            );
                        } }
                        value={ identityVerificationProvider.Name }
                        maxLength={ IdentityVerificationProviderConstants.IDVP_NAME_MAX_LENGTH }
                        minLength={ IdentityVerificationProviderConstants.IDVP_NAME_MIN_LENGTH }
                        data-testid={ `${ testId }-idp-name` }
                        hint={ t("console:develop.features.idvp.forms.generalDetails.name.hint") }
                        readOnly={ isReadOnly }
                    />
                    <Field.Textarea
                        name="description"
                        ariaLabel="description"
                        label={ t("console:develop.features.idvp.forms.generalDetails.description.label") }
                        required={ false }
                        placeholder={ t("console:develop.features.idvp.forms.generalDetails.description.placeholder") }
                        value={ identityVerificationProvider.description }
                        data-testid={ `${ testId }-idp-description` }
                        maxLength={ IdentityVerificationProviderConstants.IDVP_DESCRIPTION_MAX_LENGTH }
                        minLength={ IdentityVerificationProviderConstants.IDVP_DESCRIPTION_MIN_LENGTH }
                        hint={ t("console:develop.features.idvp.forms.generalDetails.description.hint") }
                        readOnly={ isReadOnly }
                    />
                    { !isReadOnly && (
                        <Field.Button
                            form={ FORM_ID }
                            ariaLabel="Update General Details"
                            size="small"
                            buttonType="primary_btn"
                            label={ t("common:update") }
                            name="submit"
                            disabled={ isSubmitting }
                            loading={ isSubmitting }
                        />
                    ) }
                </Form>
            </EmphasizedSegment>
        </React.Fragment>
    );
};

GeneralDetailsForm.defaultProps = {
    "data-testid": "idp-edit-general-settings-form",
    enableWizardMode: false,
    triggerSubmit: false
};
