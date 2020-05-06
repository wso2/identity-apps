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

import { Field, Forms, Validation } from "@wso2is/forms";
import { Heading, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid } from "semantic-ui-react";
import { IdentityProviderAdvanceInterface } from "../../../models";

/**
 *  Advance Configurations for the Identity Provider.
 */
interface AdvanceConfigurationsFormPropsInterface extends IdentityProviderAdvanceInterface {
    config: IdentityProviderAdvanceInterface;
    onSubmit: (values: any) => void;
}

/**
 * Advance configurations form component.
 *
 * @param {AdvanceConfigurationsFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AdvanceConfigurationsForm: FunctionComponent<AdvanceConfigurationsFormPropsInterface> = (
    props: AdvanceConfigurationsFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit
    } = props;

    const [isPEMSelected, setPEMSelected] = useState<boolean>(false);

    const { t } = useTranslation();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        return {
            alias: values.get("alias"),
            certificate: {
                certificates: values.get("type") === "PEM" ? [values.get("value")] : config?.certificate?.certificates,
                jwksUri: values.get("type") === "JWKS" ? values.get("value") : config?.certificate?.jwksUri
            },
            homeRealmIdentifier: values.get("homeRealmIdentifier"),
            isFederationHub: !!values.get("federationHub")?.includes("federationHub")
        };
    };

    useEffect(() => {
        setPEMSelected(config?.certificate && config?.certificate.certificates
            && config?.certificate?.certificates.length > 0);
    }, []);

    return (
        <Forms onSubmit={ (values) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="federationHub"
                            label=""
                            required={ false }
                            requiredErrorMessage={ t("devPortal:components.idp.forms.common.requiredErrorMessage") }
                            value={ config?.isFederationHub ? ["federationHub"] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("devPortal:components.idp.forms.advancedConfigs.federationHub.label"),
                                    value: "federationHub"
                                }
                            ] }
                            toggle
                        />
                        <Hint>
                            { t("devPortal.components.idp.forms.advancedConfigs.federationHub.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="homeRealmIdentifier"
                            label={ t("devPortal:components.idp.forms.advancedConfigs.homeRealmIdentifier.label") }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={ name }
                            type="text"
                            value={ config.homeRealmIdentifier }
                        />
                        <Hint>
                            { t("devPortal:components.idp.forms.advancedConfigs.homeRealmIdentifier.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="alias"
                            label={ t("devPortal:components.idp.forms.advancedConfigs.alias.label") }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={ name }
                            type="text"
                            value={ config.alias }
                        />
                        <Hint>
                            { t("devPortal:components.idp.forms.advancedConfigs.alias.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Heading as="h5">Certificate</Heading>
                        <Divider hidden/>
                        <Field
                            label={ t("devPortal:components.idp.forms.advancedConfigs.certificateType.label") }
                            name="type"
                            default={ config?.certificate && config?.certificate.certificates
                            && config?.certificate?.certificates.length > 0 ? "PEM" : "JWKS" }
                            listen={
                                (values) => {
                                    setPEMSelected(values.get("type") === "PEM");
                                }
                            }
                            type="radio"
                            children={ [
                                {
                                    label: t("devPortal:components.idp.forms.advancedConfigs.certificateType." +
                                        "certificateJWKS.label"),
                                    value: "JWKS"
                                },
                                {
                                    label: t("devPortal:components.idp.forms.advancedConfigs.certificateType." +
                                        "certificatePEM.label"),
                                    value: "PEM"
                                }
                            ] }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        {
                            isPEMSelected ?
                                (
                                    <Field
                                        name="value"
                                        label="Value"
                                        required={ false }
                                        requiredErrorMessage={ t("devPortal:components.idp.forms." +
                                            "advancedConfigs.certificateType.certificateJWKS.validations.empty") }
                                        placeholder={ t("devPortal:components.idp.forms.advancedConfigs." +
                                            "certificateType.certificateJWKS.placeholder") }
                                        type="textarea"
                                        value={ config?.certificate && config?.certificate.certificates
                                        && config?.certificate?.certificates.length > 0 &&
                                        _.first(config.certificate?.certificates) }
                                    />
                                ) : (
                                    <Field
                                        name="value"
                                        label="Value"
                                        required={ false }
                                        requiredErrorMessage={ t("devPortal:components.idp.forms." +
                                            "advancedConfigs.certificateType.certificatePEM.validations.empty") }
                                        placeholder={ t("devPortal:components.idp.forms.advancedConfigs." +
                                            "certificateType.certificatePEM.placeholder") }
                                        type="text"
                                        validation={ (value: string, validation: Validation) => {
                                            if (!FormValidation.url(value)) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(
                                                    t("devPortal:components.idp.forms.common." +
                                                        "invalidQueryParamErrorMessage")
                                                );
                                            }
                                        } }
                                        value={ config?.certificate && config?.certificate?.jwksUri }
                                    />
                                )
                        }
                        <Hint>
                            { t("devPortal:components.idp.forms.advancedConfigs.certificateType.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Button primary type="submit" size="small" className="form-button">
                            { t("common:update") }
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
