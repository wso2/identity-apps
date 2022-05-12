/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment, Heading } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { identityProviderConfig } from "../../../../extensions";
import { IdentityProviderInterface, IdentityProviderListResponseInterface } from "../../models";
import { IdpCertificates } from "../settings";

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
    /**
     * List of available Idps.
     */
    idpList?: IdentityProviderListResponseInterface;
    /**
     * Why? to hide or show the IdP logo edit input field.
     * Introduced this for SAML and OIDC enterprise protocols.
     * By default the icon/logo for this is readonly from
     * extensions.
     */
    hideIdPLogoEditField?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Explicitly specifies whether the currently displaying
     * IdP is a SAML provider or not.
     */
    isSaml?: boolean;
    /**
     * Explicitly specifies whether the currently displaying
     * IdP is a OIDC provider or not.
     */
    isOidc?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

const IDP_NAME_MAX_LENGTH: number = 50;
const IDP_DESCRIPTION_MAX_LENGTH: number = 300;
const IDP_IMAGE_URL_MAX_LENGTH: number = 200;

/**
 * Form to edit general details of the identity provider.
 *
 * @param props GeneralDetailsFormPopsInterface.
 * @return {React.ReactElement}.
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (
    props: GeneralDetailsFormPopsInterface): ReactElement => {

    const {
        name,
        description,
        imageUrl,
        onSubmit,
        onUpdate,
        editingIDP,
        idpList,
        hideIdPLogoEditField,
        isReadOnly,
        isSaml,
        isOidc,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    // const [ modifiedName, setModifiedName ] = useState<string>(name);

    const { t } = useTranslation();

    /**
     * Check whether IDP name is already exist or not.
     * @param value IDP name
     * @returns error msg if name is already taken.
     */
    const idpNameValidation = (value: string): string => {
        if (!FormValidation.isValidResourceName(value)) {
            return t("console:develop.features.authenticationProvider." +
                "templates.enterprise.validation.name");
        }
        let nameExist: boolean = false;

        if (idpList?.count > 0) {
            idpList?.identityProviders.map((idp) => {
                if (idp?.name === value && name !== value) {
                    nameExist = true;
                }
            });
        }
        if (nameExist) {
            return t("console:develop.features." +
                "authenticationProvider.forms.generalDetails.name." +
                "validations.duplicate");
        }
    };

    // Temporarily comment out Idp name valiation logic per name.
    // /**
    //  * Called when name field is modified.
    //  */
    // useEffect(() => {
    //     if (!enableWizardMode) {
    //         return;
    //     }
    //     setIsNameValid(false);
    //     validateIdpName(modifiedName);
    // }, [ modifiedName ]);

    // /**
    //  * Retrieves the list of identity providers.
    //  */
    // const validateIdpName = (idpName: string) => {
    //     getIdentityProviderList(null, null, "name eq " + idpName)
    //         .then((response) => {
    //             setIsNameValid(response?.totalResults === 0);
    //         })
    //         .catch((error) => {
    //             handleGetIDPListCallError(error);
    //         });
    // };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfigurations = (values): void => {
        onSubmit({
            description: values.description?.toString(),
            image: values.image?.toString(),
            isPrimary: !!values.isPrimary,
            name: values.name?.toString()
        });
    };

    return (
        <React.Fragment>
            <EmphasizedSegment padded="very">
                <Form
                    uncontrolledForm={ false }
                    onSubmit={ (values): void => {
                        updateConfigurations(values);
                    } }
                    data-testid={ testId }
                >
                    <Field.Input
                        ariaLabel="name"
                        inputType="resource_name"
                        name="name"
                        label={ t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.name.label") }
                        required={ true }
                        message={ t("console:develop.features.authenticationProvider." +
                            "forms.generalDetails.name.validations.empty") }
                        placeholder={ name }
                        validation={ (value) => idpNameValidation(value) }
                        value={ name }
                        maxLength={ IDP_NAME_MAX_LENGTH }
                        minLength={ 3 }
                        data-testid={ `${ testId }-idp-name` }
                        hint={ t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.name.hint") }
                        readOnly={ isReadOnly }
                    />
                    <Field.Textarea
                        name="description"
                        ariaLabel="description"
                        label={ t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.description.label") }
                        required={ false }
                        placeholder={ t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.description.placeholder") }
                        value={ description }
                        data-testid={ `${ testId }-idp-description` }
                        maxLength={ IDP_DESCRIPTION_MAX_LENGTH }
                        minLength={ 3 }
                        hint={ t("console:develop.features.authenticationProvider.forms." +
                            "generalDetails.description.hint") }
                        readOnly={ isReadOnly }
                    />
                    { !hideIdPLogoEditField && (
                        <Field.Input
                            name="image"
                            ariaLabel="image"
                            inputType="url"
                            label={ t("console:develop.features.authenticationProvider." +
                                "forms.generalDetails.image.label") }
                            required={ false }
                            placeholder={ t("console:develop.features.authenticationProvider." +
                                "forms.generalDetails.image." +
                                "placeholder") }
                            value={ imageUrl }
                            data-testid={ `${ testId }-idp-image` }
                            maxLength={ IDP_IMAGE_URL_MAX_LENGTH }
                            minLength={ 3 }
                            hint={ t("console:develop.features.authenticationProvider.forms." +
                                "generalDetails.image.hint") }
                            readOnly={ isReadOnly }
                        />
                    ) }
                    { !isReadOnly && (
                        <Field.Button
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
            { identityProviderConfig.generalDetailsForm.showCertificate && (
                <React.Fragment>
                    <Divider hidden/>
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Heading as="h4">Certificates</Heading>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <IdpCertificates
                        enableJWKS={ !isSaml }
                        isReadOnly={ isReadOnly }
                        editingIDP={ editingIDP }
                        onUpdate={ onUpdate }
                    />
                </React.Fragment>
            ) }
        </React.Fragment>
    );
};

GeneralDetailsForm.defaultProps = {
    "data-testid": "idp-edit-general-settings-form",
    enableWizardMode: false,
    hideIdPLogoEditField: false,
    triggerSubmit: false
};
