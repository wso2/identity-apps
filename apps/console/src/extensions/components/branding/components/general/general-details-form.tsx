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
import React, { FunctionComponent, MutableRefObject, ReactElement, Ref, forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState } from "../../../../../features/core/store";
import { BrandingPreferencesConstants } from "../../constants";
import { BrandingPreferenceInterface } from "../../models";

/**
 * Interface for Branding Preference General Details Form props.
 */
interface GeneralDetailsFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Broadcast realtime edited values to subscribers.
     * @param {GeneralDetailsFormValuesInterface} - Form values.
     */
    broadcastValues: (values: GeneralDetailsFormValuesInterface) => void;
    /**
     * General Details initial values.
     */
    initialValues: GeneralDetailsFormValuesInterface;
    /**
     * Are the preferences live?
     */
    isLive: boolean;
    /**
     * Callback for form submit.
     * @param {GeneralDetailsFormValuesInterface} values - Resolved Form Values.
     */
    onSubmit: (values: GeneralDetailsFormValuesInterface) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Ref for the form.
     */
    ref: Ref<FormPropsInterface>;
}

/**
 * Form initial values interface.
 */
export type GeneralDetailsFormValuesInterface = Pick<BrandingPreferenceInterface, "organizationDetails">;

/**
 * Branding Preference General Details Form.
 *
 * @param {GeneralDetailsFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPropsInterface> = forwardRef((
    props: GeneralDetailsFormPropsInterface,
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

    const [ copyrightText, setCopyrightText ] = useState<string>(initialValues.organizationDetails.copyrightText);

    /**
     * Broadcast values to the outside when internals change.
     */
    useEffect(() => {

        broadcastValues({
            ...initialValues,
            organizationDetails: {
                ...initialValues.organizationDetails,
                copyrightText
            }
        });
    }, [ copyrightText ]);

    return (
        <Form
            ref={ ref }
            uncontrolledForm={ false }
            onSubmit={ onSubmit }
            initialValues={ initialValues }
        >
            <Field.Input
                ariaLabel="Site title input field"
                inputType="default"
                name="organizationDetails.siteTitle"
                label={ t("extensions:develop.branding.forms.general.fields.siteTitle.label") }
                placeholder={ t("extensions:develop.branding.forms.general.fields.siteTitle.placeholder") }
                hint={
                    t("extensions:develop.branding.forms.general.fields.siteTitle.hint", { productName })
                }
                required={ false }
                readOnly={ readOnly }
                value={ initialValues.organizationDetails.siteTitle }
                maxLength={ BrandingPreferencesConstants.GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS.SITE_TITLE_MAX_LENGTH }
                minLength={ BrandingPreferencesConstants.GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS.SITE_TITLE_MIN_LENGTH }
                width={ 16 }
                data-componentid={ `${componentId}-site-title` }
            />
            <Field.Input
                ariaLabel="Copyright text input field"
                inputType="default"
                name="organizationDetails.copyrightText"
                label={ t("extensions:develop.branding.forms.general.fields.copyrightText.label") }
                placeholder={ t("extensions:develop.branding.forms.general.fields.copyrightText.placeholder") }
                hint={
                    t("extensions:develop.branding.forms.general.fields.copyrightText.hint", { productName })
                }
                required={ false }
                readOnly={ readOnly }
                value={ initialValues.organizationDetails.copyrightText }
                maxLength={
                    BrandingPreferencesConstants.GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS.COPYRIGHT_TEXT_MAX_LENGTH
                }
                minLength={
                    BrandingPreferencesConstants.GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS.COPYRIGHT_TEXT_MIN_LENGTH
                }
                width={ 16 }
                listen={ (value: string) => setCopyrightText(value) }
                data-componentid={ `${componentId}-copyright-text` }
            />
            <Field.Input
                ariaLabel="Contact email input field"
                inputType="email"
                name="organizationDetails.supportEmail"
                label={ t("extensions:develop.branding.forms.general.fields.supportEmail.label") }
                placeholder={ t("extensions:develop.branding.forms.general.fields.supportEmail.placeholder") }
                hint={
                    t("extensions:develop.branding.forms.general.fields.supportEmail.hint", { productName })
                }
                required={ false }
                readOnly={ readOnly }
                value={ initialValues.organizationDetails.supportEmail }
                maxLength={
                    BrandingPreferencesConstants.GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS.SUPPORT_EMAIL_MAX_LENGTH
                }
                minLength={
                    BrandingPreferencesConstants.GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS.SUPPORT_EMAIL_MIN_LENGTH
                }
                width={ 16 }
                data-componentid={ `${componentId}-support-email` }
            />
        </Form>
    );
});

/**
 * Default props for the component.
 */
GeneralDetailsForm.defaultProps = {
    "data-componentid": "general-details-form"
};
