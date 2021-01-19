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
import { PrimaryButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";

/**
 * Proptypes for the add IDP JWKS endpoint form component.
 */
interface AddIDPJWKSUriFormPropsInterface extends TestableComponentInterface {
    initialUri: string;
    onSubmit: (values: any) => void;
}

/**
 * IDP JWKS endpoint form component.
 *
 * @param {AddIDPJWKSUriFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AddIDPJWKSUriFormComponent: FunctionComponent<AddIDPJWKSUriFormPropsInterface> = (
    props: AddIDPJWKSUriFormPropsInterface
): ReactElement => {

    const {
        initialUri,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    return (
        <>
            <Forms
                onSubmit={ (values) => {
                    onSubmit(values.get("jwksUrl").toString());
                } }
            >
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Field
                                name="jwksUrl"
                                label="JWKS Endpoint"
                                required={ true }
                                requiredErrorMessage={ t("console:develop.features.idp.forms." +
                                    "advancedConfigs.certificateType.certificateJWKS.validations.empty") }
                                placeholder={ t("console:develop.features.idp.forms.advancedConfigs." +
                                    "certificateType.certificateJWKS.placeholder") }
                                type="text"
                                validation={ (value: string, validation: Validation) => {
                                    if (!FormValidation.url(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("console:develop.features.idp.forms.common." +
                                                "invalidQueryParamErrorMessage")
                                        );
                                    }
                                } }
                                value={ initialUri && initialUri }
                                data-testid={ `${ testId }-certificate-jwks` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <PrimaryButton
                                type="submit"
                                data-testid={ `${ testId }-save-button` }
                            >
                                { t("common:update") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        </>
    );
};

/**
 * Default props for the add IDP JWKS endpoint form component.
 */
AddIDPJWKSUriFormComponent.defaultProps = {
    "data-testid": "add-idp-jwks-endpoint-form"
};
