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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { IdentityProviderAdvanceInterface } from "../../models";

/**
 *  Advance Configurations for the Identity Provider.
 */
interface AdvanceConfigurationsFormPropsInterface extends IdentityProviderAdvanceInterface, TestableComponentInterface {
    /**
     * IDP configuration details.
     */
    config: IdentityProviderAdvanceInterface;
    /**
     * Callback to update the idp details.
     */
    onSubmit: (values: any) => void;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
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
        onSubmit,
        isReadOnly,
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
            alias: values.get("alias"),
            homeRealmIdentifier: values.get("homeRealmIdentifier"),
            isFederationHub: !!values.get("federationHub")?.includes("federationHub")
        };
    };

    return (
        <Forms onSubmit={ (values) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="federationHub"
                            label=""
                            required={ false }
                            requiredErrorMessage={ t("console:develop.features.authenticationProvider.forms.common." +
                                "requiredErrorMessage") }
                            value={ config?.isFederationHub ? ["federationHub"] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("console:develop.features.authenticationProvider.forms.advancedConfigs." +
                                        "federationHub.label"),
                                    value: "federationHub"
                                }
                            ] }
                            toggle
                            data-testid={ `${ testId }-federation-hub` }
                            readOnly={ isReadOnly }
                        />
                        <Hint>
                            { t("console:develop.features.authenticationProvider.forms." +
                                "advancedConfigs.federationHub.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="homeRealmIdentifier"
                            label={ t("console:develop.features.authenticationProvider.forms.advancedConfigs." +
                                "homeRealmIdentifier.label") }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".advancedConfigs.homeRealmIdentifier.placeholder")
                            }
                            type="text"
                            value={ config.homeRealmIdentifier }
                            data-testid={ `${ testId }-home-realm-identifier` }
                            readOnly={ isReadOnly }
                        />
                        <Hint>
                            { t("console:develop.features.authenticationProvider" +
                                ".forms.advancedConfigs.homeRealmIdentifier.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="alias"
                            label={ t("console:develop.features.authenticationProvider" +
                                ".forms.advancedConfigs.alias.label") }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={
                                t("console:develop.features.authenticationProvider.forms" +
                                    ".advancedConfigs.alias.placeholder")
                            }
                            type="text"
                            value={ config.alias }
                            data-testid={ `${ testId }-alias` }
                            readOnly={ isReadOnly }
                        />
                        <Hint>
                            { t("console:develop.features.authenticationProvider.forms.advancedConfigs.alias.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Show when={ AccessControlConstants.IDP_EDIT }>
                            <Button primary type="submit" size="small" className="form-button"
                                    data-testid={ `${ testId }-update-button` }>
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
