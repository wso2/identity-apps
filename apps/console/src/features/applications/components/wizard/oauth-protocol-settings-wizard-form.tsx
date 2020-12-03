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
import { URLUtils } from "@wso2is/core/utils";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { ContentLoader, Hint, URLInput } from "@wso2is/react-components";
import intersection from "lodash/intersection";
import isEmpty from "lodash/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Label } from "semantic-ui-react";
import { getAuthProtocolMetadata } from "../../api";
import {
    ApplicationTemplateListItemInterface,
    DefaultProtocolTemplate,
    GrantTypeMetaDataInterface,
    MainApplicationInterface,
    OIDCMetadataInterface
} from "../../models";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface OAuthProtocolSettingsWizardFormPropsInterface extends TestableComponentInterface {
    /**
     * Set of fields to be displayed.
     */
    fields?: ("callbackURLs" | "publicClient" | "RefreshToken")[];
    /**
     * Flag to hide the hints.
     */
    hideFieldHints?: boolean;
    /**
     * Initial form values.
     */
    initialValues?: any;
    /**
     * Values from the template.
     */
    templateValues: MainApplicationInterface;
    /**
     * Trigger to invoke submit.
     */
    triggerSubmit: boolean;
    /**
     * On submit callback.
     * @param values - Form values.
     */
    onSubmit: (values: any) => void;
    /**
     * Flag to show/hide callback URL.
     */
    showCallbackURL: boolean;
    /**
     * CORS allowed origin list for the tenant.
     */
    allowedOrigins?: string[];
    /**
     * Tenant domain
     */
    tenantDomain?: string;
    /**
     * Template meta data.
     */
    selectedTemplate?: ApplicationTemplateListItemInterface;
    /**
     * Flag to identify whether the form is used in protocol
     * creation modal.
     */
    isProtocolConfig?: boolean;
}

/**
 * Oauth protocol settings wizard form component.
 *
 * @param {OAuthProtocolSettingsWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const OauthProtocolSettingsWizardForm: FunctionComponent<OAuthProtocolSettingsWizardFormPropsInterface> = (
    props: OAuthProtocolSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        selectedTemplate,
        isProtocolConfig,
        allowedOrigins,
        fields,
        hideFieldHints,
        initialValues,
        triggerSubmit,
        onSubmit,
        templateValues,
        showCallbackURL,
        tenantDomain,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ callBackUrls, setCallBackUrls ] = useState("");
    const [ publicClient, setPublicClient ] = useState<string[]>([]);
    const [ refreshToken, setRefreshToken ] = useState<string[]>([]);
    const [ showRefreshToken, setShowRefreshToken ] = useState(false);
    const [ showURLError, setShowURLError ] = useState(false);
    const [ callbackURLsErrorLabel, setCallbackURLsErrorLabel ] = useState<ReactElement>(null);
    const [ showCallbackURLField, setShowCallbackURLField ] = useState<boolean>(true);
    const [ OIDCMeta, setOIDCMeta ] = useState<OIDCMetadataInterface>(undefined);
    const [ selectedGrantTypes, setSelectedGrantTypes ] = useState<string[]>(undefined);
    const [ isGrantChanged, setGrantChanged ] = useState<boolean>(false);
    const [ showGrantTypes, setShowGrantTypes ] = useState<boolean>(false);

    // Maintain the state if the user allowed the CORS for the
    // origin of the configured callback URL(s).
    const [ allowCORSUrls, setAllowCORSUrls ] = useState<string[]>([]);

    /**
     * Show the grant types only for the custom protocol template.
     */
    useEffect(() => {
        if (selectedTemplate?.id === DefaultProtocolTemplate.OIDC) {
            setShowGrantTypes(true);
        }
    }, [ selectedTemplate ]);

    /**
     * Check whether to show the callback url or not
     */
    useEffect(() => {
        if (selectedGrantTypes?.includes("authorization_code") || selectedGrantTypes?.includes("implicit")) {
            setShowCallbackURLField(true);
        } else {
            setShowCallbackURLField(false);
        }

    }, [ selectedGrantTypes, isGrantChanged ]);

    useEffect(() => {
        if (selectedGrantTypes !== undefined) {
            return;
        }

        if (templateValues?.inboundProtocolConfiguration?.oidc?.grantTypes) {
            setSelectedGrantTypes([ ...templateValues?.inboundProtocolConfiguration?.oidc?.grantTypes ]);
        }

    }, [ templateValues ]);

    useEffect(() => {
        if (OIDCMeta !== undefined || !selectedTemplate?.authenticationProtocol) {
            return;
        }

        getAuthProtocolMetadata(selectedTemplate.authenticationProtocol)
            .then((response) => {
                setOIDCMeta(response);
            });
    }, [ OIDCMeta ]);

    useEffect(() => {
        const allowedGrantTypes = templateValues?.inboundProtocolConfiguration?.oidc?.grantTypes;
        if (intersection(allowedGrantTypes, [ "refresh_token" ]).length > 0) {
            setShowRefreshToken(true);
        }
    }, [ templateValues ]);

    /**
     * Add regexp to multiple callbackUrls and update configs.
     *
     * @param {string} urls - Callback URLs.
     * @return {string} Prepared callback URL.
     */
    const buildCallBackUrlWithRegExp = (urls: string): string => {
        let callbackURL = urls?.replace(/['"]+/g, "");
        if (callbackURL?.split(",").length > 1) {
            callbackURL = "regexp=(" + callbackURL?.split(",").join("|") + ")";
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

    useEffect(() => {
        if (isEmpty(initialValues?.inboundProtocolConfiguration?.oidc)) {

            if (!isEmpty(templateValues?.inboundProtocolConfiguration?.oidc?.callbackURLs)) {
                setCallBackUrls(
                    buildCallBackURLWithSeparator(
                        templateValues?.inboundProtocolConfiguration?.oidc?.callbackURLs[ 0 ]
                    )
                );
            } else {
                setCallBackUrls("");
            }
            if (templateValues?.inboundProtocolConfiguration?.oidc?.publicClient) {
                setPublicClient([ "supportPublicClients" ]);
            }
            if (templateValues?.inboundProtocolConfiguration?.oidc?.refreshToken?.renewRefreshToken) {
                setRefreshToken([ "refreshToken" ]);
            }
        } else {
            setCallBackUrls(
                buildCallBackURLWithSeparator(initialValues?.inboundProtocolConfiguration?.oidc?.callbackURLs[ 0 ]
                )
            );
            if (initialValues?.inboundProtocolConfiguration?.oidc?.publicClient) {
                setPublicClient([ "supportPublicClients" ]);
            }
            if (initialValues?.inboundProtocolConfiguration?.oidc?.refreshToken?.renewRefreshToken) {
                setRefreshToken([ "refreshToken" ]);
            }
        }
    }, [ initialValues ]);

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @param {string} urls - Callback URLs.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: any, urls?: string): object => {
        const config = {
            inboundProtocolConfiguration: {
                oidc: { }
            }
        };

        if (showCallbackURLField && (showCallbackURL || !fields || fields.includes("callbackURLs"))) {
            config.inboundProtocolConfiguration.oidc[ "callbackURLs" ]
                = [ buildCallBackUrlWithRegExp(urls ? urls : callBackUrls) ];
        }

        if (!fields || fields.includes("publicClient")) {
            config.inboundProtocolConfiguration.oidc[ "publicClient" ]
                = values.get("publicClients").includes("supportPublicClients");
        }

        if (showRefreshToken || (!fields || fields.includes("RefreshToken"))) {
            config.inboundProtocolConfiguration.oidc[ "refreshToken" ] = {
                renewRefreshToken: values.get("RefreshToken").includes("refreshToken")
            };
        }

        if (showCallbackURLField && (showCallbackURL || !fields || fields.includes("callbackURLs"))) {
            config.inboundProtocolConfiguration.oidc[ "allowedOrigins" ] = allowCORSUrls;
        }

        if (!showCallbackURLField && selectedGrantTypes) {
            config.inboundProtocolConfiguration.oidc[ "grantTypes" ] = selectedGrantTypes;
            config.inboundProtocolConfiguration.oidc[ "allowedOrigins" ] = allowCORSUrls;
        }

        return config;
    };

    /**
     * The following function handles allowing CORS for a new origin.
     *
     * @param {string} url - Allowed origin
     */
    const handleAllowOrigin = (url: string): void => {
        const allowedURLs = [ ...allowCORSUrls ];
        allowedURLs.push(url);
        setAllowCORSUrls(allowedURLs);
    };

    /**
     * Creates options for Radio GrantTypeMetaDataInterface options.
     *
     * @param {GrantTypeMetaDataInterface} metadataProp - Metadata.
     *
     * @return {any[]}
     */
    const getAllowedGranTypeList = (metadataProp: GrantTypeMetaDataInterface): any[] => {
        const allowedList = [];
        if (metadataProp) {
            metadataProp.options.map((grant) => {
                allowedList.push({ label: grant.displayName, value: grant.name });
            });

        }

        return allowedList;
    };

    /**
     * Handle grant type change.
     *
     * @param {Map<string, FormValue>} values - Form values
     */
    const handleGrantTypeChange = (values: Map<string, FormValue>) => {
        const grants: string[] = values.get("grant") as string[];
        setSelectedGrantTypes(grants);
        setGrantChanged(!isGrantChanged);
    };

    /**
     * submitURL function.
     */
    let submitUrl: (callback: (url?: string) => void) => void;

    return (
        templateValues
            ? (
                <Forms
                    onSubmit={ (values) => {
                        if (showCallbackURLField || !isProtocolConfig) {
                            submitUrl((url: string) => {
                                if (isEmpty(callBackUrls) && isEmpty(url)) {
                                    setShowURLError(true);
                                } else {
                                    onSubmit(getFormValues(values, url));
                                }
                            });
                        } else {
                            onSubmit(getFormValues(values));
                        }
                    } }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        {
                            (isProtocolConfig && showGrantTypes) && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <Field
                                            name="grant"
                                            label={
                                                t("console:develop.features.applications.forms.inboundOIDC.fields." +
                                                    "grant.label")
                                            }
                                            type="checkbox"
                                            required={ true }
                                            requiredErrorMessage={
                                                t("console:develop.features.applications.forms.inboundOIDC.fields." +
                                                    "grant.validations.empty")
                                            }
                                            children={ getAllowedGranTypeList(OIDCMeta?.allowedGrantTypes) }
                                            value={ templateValues?.inboundProtocolConfiguration?.oidc?.grantTypes }
                                            data-testid={ `${ testId }-grant-type-checkbox-group` }
                                            listen={ (values) => handleGrantTypeChange(values) }
                                        />
                                        <Hint>
                                            {
                                                t("console:develop.features.applications.forms.inboundOIDC.fields." +
                                                    "grant.hint")
                                            }
                                        </Hint>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        { ((!fields || fields.includes("callbackURLs")) && showCallbackURLField ) && (
                            <Grid.Row column={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                    <URLInput
                                        labelEnabled={ true }
                                        handleAddAllowedOrigin={ (url) => handleAllowOrigin(url) }
                                        tenantDomain={ tenantDomain }
                                        allowedOrigins={ allowedOrigins }
                                        urlState={ callBackUrls }
                                        setURLState={ setCallBackUrls }
                                        labelName={
                                            t("console:develop.features.applications.forms.inboundOIDC." +
                                                "fields.callBackUrls.label")
                                        }
                                        placeholder={
                                            t("console:develop.features.applications.forms.inboundOIDC." +
                                                "fields.callBackUrls" +
                                                ".placeholder")
                                        }
                                        validationErrorMsg={
                                            t("console:develop.features.applications.forms.inboundOIDC." +
                                                "fields.callBackUrls.validations.empty")
                                        }
                                        validation={ (value: string) => {

                                            let label: ReactElement = null;

                                            if (URLUtils.isHttpUrl(value)) {
                                                label = (
                                                    <Label basic color="orange" className="mt-2">
                                                        { t("console:common.validations.inSecureURL.description") }
                                                    </Label>
                                                );
                                            }

                                            if (!URLUtils.isHttpsOrHttpUrl(value)) {
                                                label = (
                                                    <Label basic color="orange" className="mt-2">
                                                        { t("console:common.validations.unrecognizedURL.description") }
                                                    </Label>
                                                );
                                            }

                                            if (!URLUtils.isMobileDeepLink(value)) {
                                                return false;
                                            }

                                            setCallbackURLsErrorLabel(label);

                                            return true;
                                        } }
                                        computerWidth={ 10 }
                                        setShowError={ setShowURLError }
                                        showError={ showURLError }
                                        hint={
                                            !hideFieldHints && t("console:develop.features.applications.forms.inboundOIDC" +
                                                ".fields.callBackUrls.hint")
                                        }
                                        addURLTooltip={ t("common:addURL") }
                                        duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                        data-testid={ `${ testId }-callback-url-input` }
                                        getSubmit={ (submitFunction: (callback: (url?: string) => void) => void) => {
                                            submitUrl = submitFunction;
                                        } }
                                        required={ true }
                                        showPredictions={ false }
                                        customLabel={ callbackURLsErrorLabel }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        ) }
                        { !fields || fields.includes("publicClient") && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                    <Field
                                        name="publicClients"
                                        label=""
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        type="checkbox"
                                        value={ publicClient }
                                        children={ [
                                            {
                                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                                    ".fields.public.label"),
                                                value: "supportPublicClients"
                                            }
                                        ] }
                                        data-testid={ `${ testId }-public-client-checkbox` }
                                    />
                                    { !hideFieldHints && (
                                        <Hint>
                                            { t("console:develop.features.applications.forms.inboundOIDC.fields.public" +
                                                ".hint") }
                                        </Hint>
                                    ) }
                                </Grid.Column>
                            </Grid.Row>
                        ) }
                        { !fields || fields.includes("RefreshToken") || showRefreshToken && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                    <Field
                                        name="RefreshToken"
                                        label=""
                                        required={ false }
                                        requiredErrorMessage={
                                            t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                                ".refreshToken.fields.renew.validations.empty")
                                        }
                                        type="checkbox"
                                        value={ refreshToken }
                                        children={ [
                                            {
                                                label: t("console:develop.features.applications.forms.inboundOIDC" +
                                                    ".sections.refreshToken.fields.renew.label"),
                                                value: "refreshToken"
                                            }
                                        ] }
                                        data-testid={ `${ testId }-renew-refresh-token-checkbox` }
                                    />
                                    { !hideFieldHints && (
                                        <Hint>
                                            { t("console:develop.features.applications.forms.inboundOIDC.sections" +
                                                ".refreshToken.fields.renew.hint") }
                                        </Hint>
                                    ) }
                                </Grid.Column>
                            </Grid.Row>
                        ) }
                    </Grid>
                </Forms>
            )
        : <ContentLoader />
    );
};

/**
 * Default props for the oauth protocol settings wizard form component.
 */
OauthProtocolSettingsWizardForm.defaultProps = {
    "data-testid": "oauth-protocol-settings-wizard-form",
    hideFieldHints: false,
    showCallbackURL: false
};
