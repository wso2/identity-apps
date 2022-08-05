/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, Ref, forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState } from "../../../../../features/core";
import { BrandingPreferencesConstants } from "../../constants";
import { BrandingPreferenceInterface } from "../../models";

/**
 * Interface for Branding Preference Advance Form props.
 */
interface AdvanceFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Broadcast realtime edited values to subscribers.
     * @param {AdvanceFormValuesInterface} - Form values.
     */
    broadcastValues: (values: AdvanceFormValuesInterface) => void;
    /**
     * Advance form initial values.
     */
    initialValues: AdvanceFormValuesInterface;
    /**
     * Callback for form submit.
     * @param {AdvanceFormValuesInterface} values - Resolved Form Values.
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

/**
 * Branding Preference Advance Form.
 *
 * @param {AdvanceFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AdvanceForm: FunctionComponent<AdvanceFormPropsInterface> = forwardRef((
    props: AdvanceFormPropsInterface,
    ref: MutableRefObject<FormPropsInterface>): ReactElement => {

    const {
        broadcastValues,
        initialValues,
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

    return (
        <Form
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
