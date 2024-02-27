/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import Code from "@oxygen-ui/react/Code";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { Heading } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, MutableRefObject, ReactElement, Ref, forwardRef, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Placeholder } from "semantic-ui-react";
import { BrandingPreferencesConstants } from "../../constants";
import { BrandingURLPreferenceConstants } from "../../constants/url-preference-constants";
import { BrandingPreferenceInterface } from "../../models";

/**
 * Interface for Branding Preference Advance Form props.
 */
interface AdvanceFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Broadcast realtime edited values to subscribers.
     * @param values - Form values.
     */
    broadcastValues: (values: AdvanceFormValuesInterface) => void;
    /**
     * Advance form initial values.
     */
    initialValues: AdvanceFormValuesInterface;
    /**
     * Is loading.
     */
    isLoading?: boolean;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: AdvanceFormValuesInterface) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
    /**
     * Ref for the form.
     */
    ref: Ref<FormPropsInterface>;
}

/**
 * Form initial values interface.
 */
export type AdvanceFormValuesInterface = Pick<BrandingPreferenceInterface, "urls">;

const FORM_ID: string = "branding-advanced-form";

/**
 * Branding Preference Advance Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AdvanceForm: FunctionComponent<AdvanceFormPropsInterface> = forwardRef((
    props: AdvanceFormPropsInterface,
    ref: MutableRefObject<FormPropsInterface>): ReactElement => {

    const {
        broadcastValues,
        initialValues,
        isLoading,
        onSubmit,
        readOnly,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ privacyPolicyURL, setPrivacyPolicyURL ] = useState<string>(initialValues.urls.privacyPolicyURL);
    const [ termsOfUseURL, setTermsOfUseURL ] = useState<string>(initialValues.urls.termsOfUseURL);
    const [ cookiePolicyURL, setCookiePolicyURL ] = useState<string>(initialValues.urls.cookiePolicyURL);
    const [ selfSignUpURL, setSelfSignUpURL ] = useState<string>(initialValues.urls.selfSignUpURL);

    /**
     * Broadcast values to the outside when internals change.
     */
    useEffect(() => {

        broadcastValues({
            ...initialValues,
            urls: {
                ...initialValues.urls,
                cookiePolicyURL: cookiePolicyURL,
                privacyPolicyURL: privacyPolicyURL,
                selfSignUpURL: selfSignUpURL,
                termsOfUseURL: termsOfUseURL
            }
        });
    }, [ cookiePolicyURL, privacyPolicyURL, termsOfUseURL ]);

    if (isLoading) {
        return (
            <>
                {
                    [ ...Array(3) ].map((key: number) => {
                        return (
                            <Placeholder key={ key }>
                                <Placeholder.Line length="very short" />
                                <Placeholder.Image style={ { height: "38px" } } />
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder>
                        );
                    })
                }
            </>
        );
    }

    /**
     * Templatable URLs may have placeholders like `{{lang}}`, `{{country}}`, or `{{locale}}`.
     * This function validates the URL after removing those placeholders.
     *
     * @param value - Value to be validated.
     * @returns Error message.
     */
    const validateTemplatableURLs = (value: string): string => {
        let moderatedValue: string = value?.trim();
        let errorMsg: string;

        const placeholdersPattern: string = `${
            BrandingURLPreferenceConstants.LANGUAGE_PLACEHOLDER
        }|${
            BrandingURLPreferenceConstants.COUNTRY_PLACEHOLDER
        }|${
            BrandingURLPreferenceConstants.LOCALE_PLACEHOLDER
        }`;

        // Use a regex to replace {{lang}}, {{country}}, and {{locale}} placeholders while preserving other characters
        moderatedValue = value?.trim().replace(new RegExp(placeholdersPattern, "g"), "");

        if (!URLUtils.isURLValid(moderatedValue) || !FormValidation.url(moderatedValue)) {
            errorMsg = t("extensions:develop.branding.forms.advance.links.fields.common.validations.invalid");
        }

        return errorMsg;
    };

    return (
        <Form
            id={ FORM_ID }
            ref={ ref }
            uncontrolledForm={ false }
            onSubmit={ onSubmit }
            initialValues={ initialValues }
        >
            <Heading as="h4">
                { t("extensions:develop.branding.forms.advance.links.heading") }
            </Heading>
            <Field.Input
                ariaLabel="Branding preference privacy policy URL"
                inputType="url"
                name="urls.privacyPolicyURL"
                label={ t("extensions:develop.branding.forms.advance.links.fields.privacyPolicyURL.label") }
                placeholder={
                    t("extensions:develop.branding.forms.advance.links.fields.privacyPolicyURL.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey="extensions:develop.branding.forms.advance.links.fields.privacyPolicyURL.hint"
                    >
                        Link to a statement or a legal document that states how your organization collects,
                        handles, and processes the data of your customers and visitors. You can use placeholders like
                        <Code>&#123;&#123;lang&#125;&#125;</Code>, <Code>&#123;&#123;country&#125;&#125;</Code>,
                        or <Code>&#123;&#123;locale&#125;&#125;</Code> to customize the URL for different
                        regions or languages.
                    </Trans>
                ) }
                required={ false }
                value={ initialValues.urls.privacyPolicyURL }
                readOnly={ readOnly }
                maxLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.PRIVACY_POLICY_URL_MAX_LENGTH }
                minLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.PRIVACY_POLICY_URL_MIN_LENGTH }
                listen={ (value: string) =>  setPrivacyPolicyURL(value) }
                width={ 16 }
                data-testid={ `${ componentId }-tos-url` }
                validation={ validateTemplatableURLs }
            />
            <Field.Input
                ariaLabel="Branding preference terms of service URL"
                inputType="url"
                name="urls.termsOfUseURL"
                label={ t("extensions:develop.branding.forms.advance.links.fields.termsOfUseURL.label") }
                placeholder={
                    t("extensions:develop.branding.forms.advance.links.fields.termsOfUseURL.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey="extensions:develop.branding.forms.advance.links.fields.termsOfUseURL.hint"
                    >
                        Link to an agreement that your customers must agree to and abide by in order to use your
                        organization&apos;s applications or other services. You can use placeholders like
                        <Code>&#123;&#123;lang&#125;&#125;</Code>, <Code>&#123;&#123;country&#125;&#125;</Code>,
                        or <Code>&#123;&#123;locale&#125;&#125;</Code> to customize the URL for different
                        regions or languages.
                    </Trans>
                ) }
                required={ false }
                value={ initialValues.urls.termsOfUseURL }
                readOnly={ readOnly }
                maxLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.TOS_URL_MAX_LENGTH }
                minLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.TOS_URL_MIN_LENGTH }
                listen={ (value: string) =>  setTermsOfUseURL(value) }
                width={ 16 }
                data-testid={ `${ componentId }-tos-url` }
                validation={ validateTemplatableURLs }
            />
            <Field.Input
                ariaLabel="Branding preference cookie policy URL"
                inputType="url"
                name="urls.cookiePolicyURL"
                label={ t("extensions:develop.branding.forms.advance.links.fields.cookiePolicyURL.label") }
                placeholder={
                    t("extensions:develop.branding.forms.advance.links.fields.cookiePolicyURL.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey="extensions:develop.branding.forms.advance.links.fields.cookiePolicyURL.hint"
                    >
                        Link to a document or a webpage with detailed information on all cookies used by your
                        applications and the purpose of each of them. You can use placeholders like
                        <Code>&#123;&#123;lang&#125;&#125;</Code>, <Code>&#123;&#123;country&#125;&#125;</Code>,
                        or <Code>&#123;&#123;locale&#125;&#125;</Code> to customize the URL for different
                        regions or languages.
                    </Trans>
                ) }
                required={ false }
                value={ initialValues.urls.cookiePolicyURL }
                readOnly={ readOnly }
                maxLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.COOKIE_POLICY_URL_MAX_LENGTH }
                minLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.COOKIE_POLICY_URL_MIN_LENGTH }
                listen={ (value: string) =>  setCookiePolicyURL(value) }
                width={ 16 }
                data-testid={ `${ componentId }-cookie-policy-url` }
                validation={ validateTemplatableURLs }
            />
            <Field.Input
                ariaLabel="Branding preference self signup URL"
                inputType="url"
                name="urls.selfSignUpURL"
                label={ t("extensions:develop.branding.forms.advance.links.fields.selfSignUpURL.label") }
                placeholder={
                    t("extensions:develop.branding.forms.advance.links.fields.selfSignUpURL.placeholder")
                }
                hint={ (
                    <Trans
                        i18nKey="extensions:develop.branding.forms.advance.links.fields.selfSignUpURL.hint"
                    >
                        Link to your organization&apos;s Self Signup webpage. You can use placeholders like
                        <Code>&#123;&#123;lang&#125;&#125;</Code>, <Code>&#123;&#123;country&#125;&#125;</Code>,
                        or <Code>&#123;&#123;locale&#125;&#125;</Code> to customize the URL for different
                        regions or languages.
                    </Trans>
                ) }
                required={ false }
                value={ initialValues.urls.selfSignUpURL }
                readOnly={ readOnly }
                maxLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.COOKIE_POLICY_URL_MAX_LENGTH }
                minLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.COOKIE_POLICY_URL_MIN_LENGTH }
                listen={ (value: string) =>  setSelfSignUpURL(value) }
                width={ 16 }
                data-testid={ `${ componentId }-self-signup-url` }
                validation={ validateTemplatableURLs }
            />
        </Form>
    );
});

/**
 * Default props for the component.
 */
AdvanceForm.defaultProps = {
    "data-componentid": "advance-form"
};
