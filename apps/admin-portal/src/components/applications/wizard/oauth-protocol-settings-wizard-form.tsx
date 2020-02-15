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

import { Field, Forms } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useRef } from "react";
import { Grid } from "semantic-ui-react";
import { SupportedQuickStartTemplateTypes } from "../../../models";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface OAuthProtocolSettingsWizardFormPropsInterface {
    initialValues: any;
    triggerSubmit: boolean;
    templateType: SupportedQuickStartTemplateTypes;
    onSubmit: (values: any) => void;
}

/**
 * Oauth protocol settings wizard form component.
 *
 * @param {OAuthProtocolSettingsWizardFormPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const OAuthProtocolSettingsWizardForm: FunctionComponent<OAuthProtocolSettingsWizardFormPropsInterface> = (
    props: OAuthProtocolSettingsWizardFormPropsInterface
): JSX.Element => {

    const {
        initialValues,
        triggerSubmit,
        templateType,
        onSubmit
    } = props;

    const initialCallbackURLs = initialValues?.inboundProtocolConfiguration?.oidc?.callbackURLs;

    const form = useRef(null);

    /**
     * Submits the form programmatically if triggered from outside.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        form?.current?.props?.onSubmit(new Event("submit"));
    }, [ triggerSubmit ]);

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: any): object => {
        return {
            inboundProtocolConfiguration: {
                oidc: {
                    callbackURLs: values.get("callbackURLs"),
                    publicClient: values.get("publicClients").includes("supportPublicClients")
                }
            }
        };
    };

    return (
        <Forms
            ref={ form }
            onSubmit={ (values) => onSubmit(getFormValues(values)) }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="callbackURLs"
                            label="Callback URLs"
                            required={ true }
                            requiredErrorMessage="This field is required."
                            placeholder="Add callback URLs for the application"
                            type="text"
                            /*validation={ (value: string, validation: Validation) => {
                                const urlList = value.split(",");
                                urlList.map((singleUrl) => {
                                    if (!FormValidation.url(singleUrl)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            "Please add valid URLs with comma separation."
                                        );
                                    }
                                });
                            } }*/
                            value={ initialCallbackURLs }
                        />
                        <Hint>
                            After the authentication, we will only redirect to the above callback URLs.
                            You can specify multiple URLs by separating them using a comma.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="publicClients"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            type="checkbox"
                            disabled={ templateType === SupportedQuickStartTemplateTypes.SPA }
                            value={
                                templateType === SupportedQuickStartTemplateTypes.SPA
                                    ? [ "supportPublicClients" ]
                                    : initialValues?.inboundProtocolConfiguration?.oidc?.publicClient
                                    ? [ "supportPublicClients" ]
                                    : []
                            }
                            children={ [
                                {
                                    label: "Public Client",
                                    value: "supportPublicClients"
                                }
                            ] }
                        />
                        <Hint>
                            This option will allow the client to authenticate without a client secret.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
