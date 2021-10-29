/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { ContentLoader, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface PassiveStsSettingsWizardFormPropsInterface extends TestableComponentInterface {
    initialValues: any;
    templateValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * SAML protocol settings wizard form component.
 *
 * @param {PassiveStsSettingsWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const PassiveStsProtocolSettingsWizardForm: FunctionComponent<PassiveStsSettingsWizardFormPropsInterface> = (
    props: PassiveStsSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        templateValues,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: Map<string, FormValue>): any => {
        return {
            inboundProtocolConfiguration: {
                passiveSts: {
                    realm: values.get("realm"),
                    replyTo: values.get("replyTo")
                }
            }
        };
    };

    return (
        templateValues
            ? (
                <Forms
                    onSubmit={ (values: Map<string, FormValue>): void => {
                        onSubmit(getFormValues(values));
                    } }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="realm"
                                    label={
                                        t("console:develop.features.applications.forms.inboundSTS.fields.realm.label")
                                    }
                                    required={ true }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.inboundSTS.fields.realm" +
                                        ".validations.empty")
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundSTS.fields.realm" +
                                        ".placeholder")
                                    }
                                    type="text"
                                    value={ initialValues ? initialValues?.realm : templateValues?.realm }
                                    data-testid={ `${ testId }-realm-input` }
                                />
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundSTS.fields.realm.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="replyTo"
                                    label={
                                        t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.label")
                                    }
                                    required={ true }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.inboundSTS.fields.replyTo" +
                                        ".validations.empty")
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundSTS.fields.replyTo" +
                                        ".placeholder")
                                    }
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("console:develop.features.applications.forms" +
                                                    ".inboundSTS.fields.replyTo.validations.invalid")
                                            );
                                        }
                                    } }
                                    type="text"
                                    value={ initialValues ? initialValues?.replyTo : templateValues?.replyTo }
                                    data-testid={ `${ testId }-reply-url-input` }
                                />
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            )
            : <ContentLoader/>
    );
};

/**
 * Default props for the passive-sts protocol settings wizard form component.
 */
PassiveStsProtocolSettingsWizardForm.defaultProps = {
    "data-testid": "passive-sts-protocol-settings-wizard-form"
};
