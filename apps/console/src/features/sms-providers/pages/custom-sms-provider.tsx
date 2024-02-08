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

interface CustomSMSProviderPageInterface extends IdentifiableComponentInterface {
    isReadOnly: boolean;
    onSubmit: (values: any) => void;
}

const CustomSMSProvider: FunctionComponent<CustomSMSProviderPageInterface> = (
    props: CustomSMSProviderPageInterface
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
                        <h2>{ t("extensions:develop.smsProviders.form.custom.subHeading") }</h2>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="provider"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="provider"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-provider` }
                            name="provider"
                            type="text"
                            label={ t("extensions:develop.smsProviders.form.custom.providerName.label") }
                            placeholder={ t("extensions:develop.smsProviders.form.custom" +
                                ".providerName.placeholder") }
                            helperText={ (<Hint compact>
                                { t("extensions:develop.smsProviders.form.custom.providerName.hint") }
                            </Hint>) }
                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="providerURL"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="providerURL"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-providerURL` }
                            name="providerURL"
                            type="text"
                            label={ t("extensions:develop.smsProviders.form.custom.providerUrl.label") }
                            placeholder={ t("extensions:develop.smsProviders.form.custom.providerUrl.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.smsProviders.form.custom.providerUrl.hint") }
                                </Hint>
                            ) }

                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <FinalFormField
                            key="contentType"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="contentType"
                            readOnly={ isReadOnly }
                            required={ false }
                            data-componentid={ `${componentId}-contentType` }
                            name="contentType"
                            type="text"
                            label={ t("extensions:develop.smsProviders.form.custom.contentType.label") }
                            placeholder={ t("extensions:develop.smsProviders.form.custom.contentType.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.smsProviders.form.custom.contentType.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <FinalFormField
                            key="httpMethod"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="httpMethod"
                            readOnly={ isReadOnly }
                            required={ false }
                            data-componentid={ `${componentId}-httpMethod` }
                            name="httpMethod"
                            type="text"
                            label={ t("extensions:develop.smsProviders.form.custom.httpMethod.label") }
                            placeholder={ t("extensions:develop.smsProviders.form.custom.httpMethod.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.smsProviders.form.custom.httpMethod.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 } >
                    <Grid.Column>
                        <FinalFormField
                            key="headers"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="headers"
                            readOnly={ isReadOnly }
                            required={ false }
                            data-componentid={ `${componentId}-headers` }
                            name="headers"
                            type="text"
                            label={ t("extensions:develop.smsProviders.form.custom.headers.label") }
                            placeholder={ t("extensions:develop.smsProviders.form.custom.headers.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.smsProviders.form.custom.headers.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
                            autoComplete="new-password"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <FinalFormField
                            key="payload"
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="payload"
                            readOnly={ isReadOnly }
                            required={ true }
                            data-componentid={ `${componentId}-payload` }
                            name="payload"
                            type="text"
                            label={ t("extensions:develop.smsProviders.form.custom.payload.label") }
                            placeholder={ t("extensions:develop.smsProviders.form.custom.payload.placeholder") }
                            helperText={ (
                                <Hint compact>
                                    { t("extensions:develop.smsProviders.form.custom.payload.hint") }
                                </Hint>
                            ) }
                            component={ TextFieldAdapter }
                            maxLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_TEMPLATE_FIELD_MAX_LENGTH
                            }
                            minLength={
                                SMSProviderConstants.SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH
                            }
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

export default CustomSMSProvider;
