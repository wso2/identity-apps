/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Grid } from "semantic-ui-react";
import { ConnectionAdvanceInterface } from "../../../models/connection";

/**
 *  Advance Configurations for the Identity Provider.
 */
interface AdvanceConfigurationsFormPropsInterface extends
    ConnectionAdvanceInterface, TestableComponentInterface {

    /**
     * IDP configuration details.
     */
    config: ConnectionAdvanceInterface;
    /**
     * Callback to update the idp details.
     */
    onSubmit: (values: any) => void;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Specifies if the form is being submitted.
     */
    isSubmitting?: boolean;
}

/**
 * Advance configurations form component.
 *
 * @param props - Props injected to the component.
 * @returns advance configurations form component.
 */
export const AdvanceConfigurationsForm: FunctionComponent<AdvanceConfigurationsFormPropsInterface> = (
    props: AdvanceConfigurationsFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit,
        isReadOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        return {
            homeRealmIdentifier: values.get("homeRealmIdentifier"),
            idpIssuerName: values.get("issuer"),
            isFederationHub: !!values.get("federationHub")?.includes("federationHub")
        };
    };

    return (
        <Forms onSubmit={ (values: Map<string, FormValue>) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="federationHub"
                            label=""
                            required={ false }
                            requiredErrorMessage={ t("authenticationProvider:forms.common." +
                                "requiredErrorMessage") }
                            value={ config?.isFederationHub ? [ "federationHub" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("authenticationProvider:forms.advancedConfigs." +
                                        "federationHub.label"),
                                    value: "federationHub"
                                }
                            ] }
                            toggle
                            data-testid={ `${ testId }-federation-hub` }
                            readOnly={ isReadOnly }
                        />
                        <Hint>
                            { t("authenticationProvider:forms." +
                                "advancedConfigs.federationHub.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="homeRealmIdentifier"
                            label={ t("authenticationProvider:forms.advancedConfigs." +
                                "homeRealmIdentifier.label") }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={
                                t("authenticationProvider:forms" +
                                    ".advancedConfigs.homeRealmIdentifier.placeholder")
                            }
                            type="text"
                            value={ config.homeRealmIdentifier }
                            data-testid={ `${ testId }-home-realm-identifier` }
                            readOnly={ isReadOnly }
                        />
                        <Hint>
                            { t("authenticationProvider:" +
                                "forms.advancedConfigs.homeRealmIdentifier.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                            <Button
                                primary
                                type="submit"
                                size="small"
                                className="form-button"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                data-testid={ `${ testId }-update-button` }
                            >
                                { t("common:update") }
                            </Button>
                        </Show>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};

/**
 * Default proptypes for the IDP advance settings form component.
 */
AdvanceConfigurationsForm.defaultProps = {
    "data-testid": "idp-edit-advance-settings"
};
