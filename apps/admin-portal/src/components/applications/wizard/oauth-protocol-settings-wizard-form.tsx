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
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Grid } from "semantic-ui-react";
import { SupportedQuickStartTemplateTypes } from "../../../models";
import { URLInputComponent } from "../components";
import { isEmpty } from "lodash";

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

    const [ callBackUrls, setCallBackUrls ] = useState("");
    const [showURLError, setShowURLError] = useState(false);

    const form = useRef(null);

    /**
     * Add regexp to multiple callbackUrls and update configs.
     *
     * @param {string} urls - Callback URLs.
     * @return {string} Prepared callback URL.
     */
    const buildCallBackUrlWithRegExp = (urls: string): string => {
        let callbackURL = urls.replace(/['"]+/g, "");
        if (callbackURL.split(",").length > 1) {
            callbackURL = "regexp=(" + callbackURL.split(",").join("|") + ")";
        }
        return callbackURL;
    };

    /**
     * Remove regexp from incoming data and show the callbackUrls.
     *
     * @param {string} url - Callback URLs.
     * @return {string} Prepared callback URL.
     */
    const buildCallBackURLWithSeparator = (url: string): string => {
        if (url && url.includes("regexp=(")) {
            url = url.replace("regexp=(", "");
            url = url.replace(")", "");
            url = url.split("|").join(",");
        }
        return url;
    };

    /**
     * Submits the form programmatically if triggered from outside.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        form?.current?.props?.onSubmit(new Event("submit"));
    }, [triggerSubmit]);

    useEffect(() => {
        setCallBackUrls("");
    }, []);
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
                    callbackURLs: buildCallBackUrlWithRegExp(callBackUrls),
                    publicClient: values.get("publicClients").includes("supportPublicClients")
                }
            }
        };
    };

    return (
        <Forms
            onSubmit={ (values) => {
                // check whether callback url is empty or not
                if (isEmpty(callBackUrls)) {
                    setShowURLError(true);
                } else {
                    onSubmit(getFormValues(values));
                }
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <URLInputComponent
                    urlState={ callBackUrls }
                    setURLState={ setCallBackUrls }
                    labelName={ "Callback URL" }
                    value={ buildCallBackURLWithSeparator(initialCallbackURLs) }
                    placeholder={ "Enter callbackUrl" }
                    validationErrorMsg={ "Please add valid URL." }
                    validation={ (value: string) => {
                        if (FormValidation.url(value)) {
                            return true;
                        }
                        return false;
                    } }
                    setShowError={ setShowURLError }
                    showError={ showURLError }
                    hint={ " After the authentication, we will only redirect to the above callback URLs " +
                    "and you can specify multiple URLs" }
                />
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
