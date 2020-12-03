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
import { Field, Forms, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import _ from "lodash";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { PassiveStsConfigurationInterface } from "../../models";

/**
 * Proptypes for the inbound Passive Sts form component.
 */
interface InboundPassiveStsFormPropsInterface extends TestableComponentInterface {
    initialValues: PassiveStsConfigurationInterface;
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Inbound Passive Sts protocol configurations form.
 *
 * @param {InboundPassiveStsFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InboundPassiveStsForm: FunctionComponent<InboundPassiveStsFormPropsInterface> = (
    props: InboundPassiveStsFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {

        return {
            realm: values.get("realm"),
            replyTo: values.get("replyTo")
        };
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(updateConfiguration(values));
            } }
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
                                t("console:develop.features.applications.forms.inboundSTS.fields.realm.validations" +
                                    ".empty")
                            }
                            placeholder={
                                t("console:develop.features.applications.forms.inboundSTS.fields.realm.placeholder")
                            }
                            type="text"
                            value={ initialValues?.realm }
                            readOnly={ readOnly || !(_.isEmpty(initialValues?.realm)) }
                            data-testid={ `${ testId }-realm-input` }
                        />
                        <Hint disabled={ !(_.isEmpty(initialValues?.realm)) }>
                            { t("console:develop.features.applications.forms.inboundSTS.fields.realm.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="replyTo"
                            label={ t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.label") }
                            required={ true }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.validations" +
                                    ".empty")
                            }
                            placeholder={
                                t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.placeholder")
                            }
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("console:develop.features.applications.forms.inboundSTS.fields.replyTo" +
                                            ".validations.invalid")
                                    );
                                }
                            } }
                            type="text"
                            value={ initialValues?.replyTo }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-reply-to-url-input` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                {
                    !readOnly && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Button
                                    primary
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                    data-testid={ `${ testId }-submit-button` }
                                >
                                    { t("common:update") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the inbound passive-sts form component.
 */
InboundPassiveStsForm.defaultProps = {
    "data-testid": "inbound-passive-sts-form"
};
