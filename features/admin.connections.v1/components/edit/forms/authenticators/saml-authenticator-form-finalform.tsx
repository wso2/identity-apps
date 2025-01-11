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

import { ConfigReducerStateInterface } from "@wso2is/admin.core.v1";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FinalForm, FinalFormField, FormRenderProps } from "@wso2is/form/src";
import { Code, FormInputLabel } from "@wso2is/react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { SERVICE_PROVIDER_ENTITY_ID_LENGTH } from "../../../../utils/saml-idp-utils";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { AuthenticatorSettingsFormModes, CommonAuthenticatorFormInitialValuesInterface } from "../../../../models/authenticators";
import { FederatedAuthenticatorWithMetaInterface } from "../../../../models/connection";

/**
 * The i18n namespace entry key for this component's contents.
 * Optionally you can pass this key to {@link useTranslation}
 * to avoid concatenate strings.
 */
const I18N_TARGET_KEY: string = "authenticationProvider:forms.authenticatorSettings.saml";

/**
 * SamlSettingsForm Properties interface. The data-testid is added in
 * {@link SamlAuthenticatorSettingsForm.defaultProps}.
 */
interface SamlSettingsFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    authenticator: FederatedAuthenticatorWithMetaInterface;
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
    readOnly?: boolean;
    /**
     * Specifies if the form is submitted.
     */
    isSubmitting?: boolean;
}

export default function SamlAuthenticatorSettingsForm(props: SamlSettingsFormPropsInterface) {

    const {
        authenticator,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-componentid" ]: componentId = "saml-authenticator-settings-form"
    } = props;

    const handleSubmit = () => {};

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    return (
        <FinalForm
            onSubmit={ (values: any) => {
                console.log(values);
            } }
            initialValues={ {
                SPEntityId: ""
            } }
            render={ ({ handleSubmit }: FormRenderProps) => (
                <form onSubmit={ handleSubmit }>
                    <FinalFormField
                        required={ true }
                        name="SPEntityId"
                        placeholder={ t(`${ I18N_TARGET_KEY }.SPEntityId.placeholder`) }
                        ariaLabel={ t(`${ I18N_TARGET_KEY }.SPEntityId.ariaLabel`) }
                        inputType="default"
                        maxLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.max }
                        minLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.min }
                        label={ (
                            <FormInputLabel htmlFor="SPEntityId">
                                { t(`${ I18N_TARGET_KEY }.SPEntityId.label`) }
                            </FormInputLabel>
                        ) }
                        hint={ (
                            <>
                                            This value will be used as the <Code>&lt;saml2:Issuer&gt;</Code> in
                                            the SAML requests initiated from { config.ui.productName } to external
                                            Identity Provider (IdP). You need to provide a unique value
                                            as the service provider <Code>entityId</Code>.
                            </>
                        ) }
                        readOnly={ readOnly }

                    />

                    <FinalFormField name="" />

                    <FinalFormField name="" />

                    <FinalFormField name="" />

                    <FinalFormField name="" type="dropdown" />

                    <FinalFormField name="" />
                </form>
            ) }
        ></FinalForm>
    );
}
