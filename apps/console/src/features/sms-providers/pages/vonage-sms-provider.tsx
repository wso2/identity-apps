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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, TextFieldAdapter } from "@wso2is/form";
import {
    EmphasizedSegment,
    Hint,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { SMSProviderConstants } from "../constants";

interface VonageSMSProviderPageInterface extends IdentifiableComponentInterface {
    isReadOnly: boolean;
    onSubmit: (values: any) => void;
}

const VonageSMSProvider: FunctionComponent<VonageSMSProviderPageInterface> = (
    props: VonageSMSProviderPageInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId,
        isReadOnly,
        onSubmit
    } = props;

    const { t } = useTranslation();

    return (
        <EmphasizedSegment className="form-wrapper" padded={ "very" }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <h2>{ t("console:manage.features.smsProviders.form.vonage.subHeading") }</h2>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="vonageKey"
                            width={ 16 }
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="vonageKey"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-vonage-key` }
                            name="vonageKey"
                            type="text"
                            label={ t("console:manage.features.smsProviders.form.vonage.accountSID.label") }
                            placeholder={ t("console:manage.features.smsProviders.form.vonage.accountSID.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("console:manage.features.smsProviders.form.vonage.accountSID.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="vonageSecret"
                            width={ 16 }
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="vonageSecret"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-vonage-secret` }
                            name="vonageSecret"
                            inputType="password"
                            type="password"
                            label={ t("console:manage.features.smsProviders.form.vonage.authToken.label") }
                            placeholder={ t("console:manage.features.smsProviders.form.vonage.authToken.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("console:manage.features.smsProviders.form.vonage.authToken.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="vonageSender"
                            width={ 16 }
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="vonageSender"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-vonage-sender` }
                            name="vonageSender"
                            type="text"
                            label={ t("console:manage.features.smsProviders.form.vonage.sender.label") }
                            placeholder={ t("console:manage.features.smsProviders.form.vonage.sender.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("console:manage.features.smsProviders.form.vonage.sender.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH }
                            minLength={ SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                {
                    !isReadOnly && (
                        <>
                            <Divider hidden />
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <PrimaryButton
                                        size="small"
                                        onClick={ onSubmit }
                                        ariaLabel="SMS provider form update button"
                                        data-componentid={ `${componentId}-update-button` }
                                    >
                                        { "Submit" }
                                    </PrimaryButton>
                                </Grid.Column>
                            </Grid.Row>
                        </>
                    )
                }
            </Grid>
        </EmphasizedSegment>
    );
};

export default VonageSMSProvider;
