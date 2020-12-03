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
import { Field, Forms } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { AdvancedConfigurationsInterface } from "../../models";

/**
 *  Advanced Configurations for the Application.
 */
interface AdvancedConfigurationsFormPropsInterface extends TestableComponentInterface {
    config: AdvancedConfigurationsInterface;
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Advanced configurations form component.
 *
 * @param {AdvancedConfigurationsFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AdvancedConfigurationsForm: FunctionComponent<AdvancedConfigurationsFormPropsInterface> = (
    props: AdvancedConfigurationsFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        return {
            advancedConfigurations: {
                enableAuthorization: !!values.get("enableAuthorization")?.includes("enableAuthorization"),
                returnAuthenticatedIdpList:
                    !!values.get("returnAuthenticatedIdpList")?.includes("returnAuthenticatedIdpList"),
                saas: !!values.get("saas")?.includes("saas"),
                skipLoginConsent: !!values.get("skipConsentLogin")?.includes("skipLoginConsent"),
                skipLogoutConsent: !!values.get("skipConsentLogout")?.includes("skipLogoutConsent")
            }
        };
    };

    return (
        <Forms onSubmit={ (values) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="saas"
                            label=""
                            required={ false }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.advancedConfig.fields.saas" +
                                    ".validations.empty")
                            }
                            value={ config?.saas ? [ "saas" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("console:develop.features.applications.forms.advancedConfig.fields" +
                                        ".saas.label"),
                                    value: "saas"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-sass-checkbox` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.advancedConfig.fields.saas.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="skipConsentLogin"
                            label=""
                            required={ false }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.advancedConfig.fields" +
                                    ".skipConsentLogin.validations.empty")
                            }
                            value={ config?.skipLoginConsent ? [ "skipLoginConsent" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("console:develop.features.applications.forms.advancedConfig.fields" +
                                        ".skipConsentLogin.label"),
                                    value: "skipLoginConsent"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-skip-login-consent-checkbox` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.advancedConfig.fields.skipConsentLogin" +
                                ".hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="skipConsentLogout"
                            label=""
                            required={ false }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.advancedConfig.fields" +
                                    ".skipConsentLogout.validations.empty")
                            }
                            value={ config?.skipLogoutConsent ? [ "skipLogoutConsent" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("console:develop.features.applications.forms.advancedConfig.fields" +
                                        ".skipConsentLogout.label"),
                                    value: "skipLogoutConsent"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-skip-logout-consent-checkbox` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.advancedConfig.fields.skipConsentLogout" +
                                ".hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="returnAuthenticatedIdpList"
                            label=""
                            required={ false }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.advancedConfig.fields" +
                                    ".returnAuthenticatedIdpList.validations.empty")
                            }
                            value={ config?.returnAuthenticatedIdpList ? [ "returnAuthenticatedIdpList" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("console:develop.features.applications.forms.advancedConfig.fields" +
                                        ".returnAuthenticatedIdpList.label"),
                                    value: "returnAuthenticatedIdpList"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-return-authenticated-idp-list-checkbox` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.advancedConfig.fields" +
                                ".returnAuthenticatedIdpList.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="enableAuthorization"
                            label=""
                            required={ false }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.advancedConfig.fields" +
                                    ".enableAuthorization.validations.empty")
                            }
                            value={ config?.enableAuthorization ? [ "enableAuthorization" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("console:develop.features.applications.forms.advancedConfig.fields" +
                                        ".enableAuthorization.label"),
                                    value: "enableAuthorization"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-enable-authorization-checkbox` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.advancedConfig.fields" +
                                ".enableAuthorization.hint") }
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
 * Default props for the application advanced configurations form component.
 */
AdvancedConfigurationsForm.defaultProps = {
    "data-testid": "application-advanced-configurations-form"
};
