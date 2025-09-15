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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Forms, Validation } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "semantic-ui-react";

interface MobileInputStepPropsInterface extends IdentifiableComponentInterface {}

interface MobileInputStepHeaderPropsInterface extends MobileInputStepPropsInterface {}

const MobileInputStepHeader: FunctionComponent<MobileInputStepHeaderPropsInterface> = (
    {
        ["data-componentid"]: componentId = "mobile-input-step-header"
    }: MobileInputStepHeaderPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    return (
        <div data-componentid={ componentId }>
            { t("myAccount:components.mobileUpdateWizard.verifySmsOtp.heading") }
        </div>
    );
};

interface MobileInputStepContentPropsInterface extends MobileInputStepPropsInterface {
    initialValue: string;
    isRequired: boolean;
    fieldLabel: string;
    triggerUpdate: boolean;
    onUpdate: (value: string) => void;
}

const MobileInputStepContent: FunctionComponent<MobileInputStepContentPropsInterface> = (
    {
        initialValue,
        isRequired,
        fieldLabel,
        onUpdate,
        triggerUpdate,
        ["data-componentid"]: componentId = "mobile-input-step-content"
    }: MobileInputStepContentPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    return (
        <div data-componentid={ componentId }>
            <Forms
                onSubmit={ (values: Map<string, string>) => {
                    onUpdate(values.get("mobileNumber"));
                } }
                submitState={ triggerUpdate }
            >
                <div className="modal-input">
                    <Field
                        autoFocus={ true }
                        name="mobileNumber"
                        label={ t("myAccount:components.mobileUpdateWizard.submitMobile.heading") }
                        required={ isRequired }
                        requiredErrorMessage={ t(
                            "myAccount:components.profile.forms.generic.inputs.validations.empty",
                            { fieldName: fieldLabel }) }
                        type="text"
                        validation={ (value: string, validation: Validation) => {
                            if (!FormValidation.mobileNumber(value)) {
                                validation.errorMessages.push(
                                    t("myAccount:components.profile.forms.generic.inputs.validations.invalidFormat",
                                        { fieldName: fieldLabel })
                                );
                                validation.isValid = false;
                            }
                        } }
                        value={ initialValue }
                    />
                </div>
            </Forms>
        </div>
    );
};

interface MobileInputStepActionsPropsInterface extends MobileInputStepPropsInterface {
    onSubmit: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

const MobileInputStepActions: FunctionComponent<MobileInputStepActionsPropsInterface> = (
    {
        onSubmit,
        onCancel,
        isLoading,
        ["data-componentid"]: testId = "mobile-input-step-actions"
    }: MobileInputStepActionsPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    return (
        <>
            <Button
                onClick={ onCancel }
                className="link-button"
                disabled={ isLoading }
                data-testid={ `${ testId }-modal-actions-cancel-button` }
            >
                { t("common:cancel") }
            </Button>
            <Button
                primary
                type="submit"
                onClick={ onSubmit }
                data-testid={ `${testId}-modal-actions-primary-button` }
                // disabled={ isLoading }
                loading={ isLoading }
            >
                { t("common:continue") }
            </Button>
        </>
    );
};

export {
    MobileInputStepContent,
    MobileInputStepActions,
    MobileInputStepHeader
};
