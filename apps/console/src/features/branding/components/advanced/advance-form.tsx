/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, Ref, forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Placeholder } from "semantic-ui-react";
import { AppState } from "../../../core/store";
import { BrandingPreferencesConstants } from "../../constants";
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

    const productName: string = useSelector((state: AppState) => state.config.ui.productName);

    const [ privacyPolicyURL, setPrivacyPolicyURL ] = useState<string>(initialValues.urls.privacyPolicyURL);
    const [ termsOfUseURL, setTermsOfUseURL ] = useState<string>(initialValues.urls.termsOfUseURL);
    const [ cookiePolicyURL, setCookiePolicyURL ] = useState<string>(initialValues.urls.cookiePolicyURL);

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
                hint={
                    t("extensions:develop.branding.forms.advance.links.fields.privacyPolicyURL.hint",
                        { productName })
                }
                required={ false }
                value={ initialValues.urls.privacyPolicyURL }
                readOnly={ readOnly }
                maxLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.PRIVACY_POLICY_URL_MAX_LENGTH }
                minLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.PRIVACY_POLICY_URL_MIN_LENGTH }
                listen={ (value: string) =>  setPrivacyPolicyURL(value) }
                width={ 16 }
                data-testid={ `${ componentId }-tos-url` }
            />
            <Field.Input
                ariaLabel="Branding preference terms of service URL"
                inputType="url"
                name="urls.termsOfUseURL"
                label={ t("extensions:develop.branding.forms.advance.links.fields.termsOfUseURL.label") }
                placeholder={
                    t("extensions:develop.branding.forms.advance.links.fields.termsOfUseURL.placeholder")
                }
                hint={
                    t("extensions:develop.branding.forms.advance.links.fields.termsOfUseURL.hint",
                        { productName })
                }
                required={ false }
                value={ initialValues.urls.termsOfUseURL }
                readOnly={ readOnly }
                maxLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.TOS_URL_MAX_LENGTH }
                minLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.TOS_URL_MIN_LENGTH }
                listen={ (value: string) =>  setTermsOfUseURL(value) }
                width={ 16 }
                data-testid={ `${ componentId }-tos-url` }
            />
            <Field.Input
                ariaLabel="Branding preference cookie policy URL"
                inputType="url"
                name="urls.cookiePolicyURL"
                label={ t("extensions:develop.branding.forms.advance.links.fields.cookiePolicyURL.label") }
                placeholder={
                    t("extensions:develop.branding.forms.advance.links.fields.cookiePolicyURL.placeholder")
                }
                hint={
                    t("extensions:develop.branding.forms.advance.links.fields.cookiePolicyURL.hint",
                        { productName })
                }
                required={ false }
                value={ initialValues.urls.cookiePolicyURL }
                readOnly={ readOnly }
                maxLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.COOKIE_POLICY_URL_MAX_LENGTH }
                minLength={ BrandingPreferencesConstants.ADVANCE_FORM_FIELD_CONSTRAINTS.COOKIE_POLICY_URL_MIN_LENGTH }
                listen={ (value: string) =>  setCookiePolicyURL(value) }
                width={ 16 }
                data-testid={ `${ componentId }-cookie-policy-url` }
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
