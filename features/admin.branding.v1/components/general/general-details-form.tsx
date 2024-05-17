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
import React, { FunctionComponent, MutableRefObject, ReactElement, Ref, forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Placeholder } from "semantic-ui-react";
import { AppState } from "@wso2is/admin.core.v1/store";
import { BrandingPreferenceInterface } from "@wso2is/common.branding.v1/models";
import { BrandingPreferencesConstants } from "../../constants";

/**
 * Interface for Branding Preference General Details Form props.
 */
interface GeneralDetailsFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Broadcast realtime edited values to subscribers.
     * @param values - Form values.
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
     * Is loading.
     */
    isLoading?: boolean;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
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

const FORM_ID: string = "branding-general-form";

/**
 * Branding Preference General Details Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPropsInterface> = forwardRef((
    props: GeneralDetailsFormPropsInterface,
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

    const [ displayName, setDisplayName ] = useState<string>(initialValues.organizationDetails.displayName);
    const [ supportEmail, setSupportEmail ] = useState<string>(initialValues.organizationDetails.supportEmail);

    /**
     * Broadcast values to the outside when internals change.
     */
    useEffect(() => {

        broadcastValues({
            ...initialValues,
            organizationDetails: {
                ...initialValues.organizationDetails,
                displayName,
                supportEmail
            }
        });
    }, [ supportEmail, displayName ]);

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
            <Field.Input
                ariaLabel="Display name input field"
                inputType="default"
                name="organizationDetails.displayName"
                label={ t("extensions:develop.branding.forms.general.fields.displayName.label") }
                placeholder={ t("extensions:develop.branding.forms.general.fields.displayName.placeholder") }
                hint={
                    t("extensions:develop.branding.forms.general.fields.displayName.hint", { productName })
                }
                required={ false }
                readOnly={ readOnly }
                value={ initialValues.organizationDetails.displayName }
                maxLength={
                    BrandingPreferencesConstants.GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS.DISPLAY_NAME_MAX_LENGTH
                }
                minLength={
                    BrandingPreferencesConstants.GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS.DISPLAY_NAME_MIN_LENGTH
                }
                width={ 16 }
                listen={ (value: string) => setDisplayName(value) }
                data-componentid={ `${componentId}-organization-display-name` }
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
                listen={ (value: string) => setSupportEmail(value) }
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
