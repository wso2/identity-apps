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
import { EmphasizedSegment, Heading, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid } from "semantic-ui-react";
import { getIdentityProviderList } from "../../api";
import { IdentityProviderInterface } from "../../models";
import { IdpCertificates } from "../settings";
import { handleGetIDPListCallError } from "../utils";

/**
 * Proptypes for the identity provider general details form component.
 */
interface GeneralDetailsFormPopsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP?: IdentityProviderInterface;
    /**
     * Identity provider description.
     */
    description?: string;
    /**
     * Identity provider logo URL.
     */
    imageUrl?: string;
    /**
     * Name of the identity provider.
     */
    name: string;
    /**
     * Mark identity provider as primary.
     */
    isPrimary?: boolean;
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
}

/**
 * Form to edit general details of the identity provider.
 *
 * @param props GeneralDetailsFormPopsInterface.
 * @return {React.ReactElement}.
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (props): ReactElement => {

    const {
        name,
        description,
        imageUrl,
        onSubmit,
        onUpdate,
        triggerSubmit,
        enableWizardMode,
        editingIDP,
        [ "data-testid" ]: testId
    } = props;

    const [isNameValid, setIsNameValid] = useState<boolean>(true);
    const [modifiedName, setModifiedName] = useState<string>(name);

    const { t } = useTranslation();

    /**
     * Called when name field is modified.
     */
    useEffect(() => {
        if (!enableWizardMode) {
            return;
        }
        setIsNameValid(false);
        validateIdpName(modifiedName);
    }, [modifiedName]);

    /**
     * Retrieves the list of identity providers.
     */
    const validateIdpName = (idpName: string) => {
        getIdentityProviderList(null, null, "name eq " + idpName)
            .then((response) => {
                setIsNameValid(response?.totalResults === 0);
            })
            .catch((error) => {
                handleGetIDPListCallError(error);
            });
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfigurations = (values: Map<string, FormValue>): IdentityProviderInterface => {
        return {
            description: values.get("description").toString(),
            image: values.get("image").toString(),
            isPrimary: !!values.get("isPrimary"),
            name: values.get("name").toString()
        };
    };

    return (
        <>
            <EmphasizedSegment>
                <Forms
                    onSubmit={ (values): void => {
                        onSubmit(updateConfigurations(values));
                    } }
                    submitState={ triggerSubmit }
                    onChange={ (isPure, values) => {
                        if (!enableWizardMode) {
                            setModifiedName(values.get("name").toString());
                        }
                    } }
                    data-testid={ testId }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="name"
                                    label={ t("console:develop.features.idp.forms.generalDetails.name.label") }
                                    required={ true }
                                    requiredErrorMessage={ t("console:develop.features.idp.forms.generalDetails." +
                                        "name.validations.empty") }
                                    placeholder={ name }
                                    type="text"
                                    validation={ (value: string, validation: Validation) => {
                                        if (isNameValid === false) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(t("console:develop.features.idp.forms." +
                                                "generalDetails.name.validations.duplicate"));
                                        }
                                    } }
                                    value={ name }
                                    data-testid={ `${ testId }-idp-name` }
                                />
                                <Hint>
                                    { t("console:develop.features.idp.forms.generalDetails.name.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="description"
                                    label={ t("console:develop.features.idp.forms.generalDetails.description.label") }
                                    required={ false }
                                    requiredErrorMessage=""
                                    placeholder={ t("console:develop.features.idp.forms." +
                                        "generalDetails.description.placeholder") }
                                    type="textarea"
                                    value={ description }
                                    data-testid={ `${ testId }-idp-description` }
                                />
                                <Hint>
                                    { t("console:develop.features.idp.forms.generalDetails.description.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="image"
                                    label={ t("console:develop.features.idp.forms.generalDetails.image.label") }
                                    required={ false }
                                    requiredErrorMessage=""
                                    placeholder={ t("console:develop.features.idp.forms.generalDetails.image." + 
                                        "placeholder") }
                                    type="text"
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(t("console:develop.features.idp.forms." +
                                                "common.invalidURLErrorMessage"));
                                        }
                                    } }
                                    value={ imageUrl }
                                    data-testid={ `${ testId }-idp-image` }
                                />
                                <Hint>
                                    { t("console:develop.features.idp.forms.generalDetails.image.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        {
                            !enableWizardMode ? (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <Button primary type="submit" size="small" className="form-button"
                                                data-testid={ `${ testId }-update-button` }>
                                            { t("common:update") }
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            ) : null
                        }
                    </Grid>
                </Forms>
            </EmphasizedSegment>
            <Divider hidden />
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Heading as="h4">Certificates</Heading>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <EmphasizedSegment>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <IdpCertificates
                                editingIDP={ editingIDP }
                                onUpdate={ onUpdate }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EmphasizedSegment>
        </>
    );
};

GeneralDetailsForm.defaultProps = {
    "data-testid": "idp-edit-general-settings-form",
    enableWizardMode: false,
    triggerSubmit: false
};
