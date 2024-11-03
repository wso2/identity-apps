/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid/Grid";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, FormSpy, FormState, TextFieldAdapter } from "@wso2is/form";
import { ContentLoader, DocumentationLink, Hint, Message, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { SMSTemplate } from "../models/sms-templates";

interface SMSCustomizationFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Is SMS templates list loading.
     */
    isSmsTemplatesListLoading: boolean;

    /**
     * Selected SMS template
     */
    selectedSmsTemplate: SMSTemplate;

    /**
     * Selected locale
     */
    selectedLocale: string;

    /**
     * Callback to be called when the template is changed.
     * @param template - SMS template
     */
    onTemplateChanged: (updatedTemplateAttributes: Partial<SMSTemplate>) => void;

    /**
     * Callback to be called when the form is submitted.
     */
    onSubmit: () => void;

    /**
     * Callback to be called when the template delete requested
     */
    onDeleteRequested: () => void;

    /**
     * Is readonly.
     */
    readOnly?: boolean;
}

/**
 * SMS customization form.
 *
 * @param props - Props injected to the component.
 *
 * @returns SMS template customization form.
 */
const SMSCustomizationForm: FunctionComponent<SMSCustomizationFormPropsInterface> = (
    props: SMSCustomizationFormPropsInterface
): ReactElement => {
    const {
        isSmsTemplatesListLoading,
        selectedSmsTemplate,
        onTemplateChanged,
        onSubmit,
        readOnly,
        ["data-componentid"]: componentId = "sms-customization-form"
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const onFormUpdate = (state: FormState<Record<string, any>, Partial<Record<string, any>>>) => {
        onTemplateChanged({
            body: state?.values?.smsBody
        });
    };

    const renderFormFields = (): ReactElement => {
        return (
            <FinalFormField
                key="smsBody"
                width={ 16 }
                FormControlProps={ {
                    margin: "dense"
                } }
                ariaLabel="SMS Body Input"
                required={ true }
                data-componentid={ `${componentId}-sms-body` }
                name="smsBody"
                type="text"
                label={ t("smsTemplates:form.inputs.body.label") }
                placeholder={ t("smsTemplates:form.inputs.body.placeholder") }
                value={ selectedSmsTemplate?.body }
                defaultValue={ selectedSmsTemplate?.body }
                component={ TextFieldAdapter }
                readOnly={ readOnly }
                multiline={ true }
                minRows={ 4 }
            />
        );
    };

    if (isSmsTemplatesListLoading) {
        return <ContentLoader />;
    }

    return (
        <>
            <Grid container>
                <Grid xs={ 12 } lg={ 11 } xl={ 10 }>
                    <Message
                        type="info"
                        content={
                            (<>
                                { t("smsTemplates:form.inputs.body.hint") }
                                <DocumentationLink link={ getLink("develop.smsCustomization.form.smsBody.learnMore") }>
                                    { t("smsTemplates:common.learnMore") }
                                </DocumentationLink>
                            </>)
                        }
                    />
                </Grid>
                <Grid xs={ 12 } lg={ 11 } xl={ 10 } marginTop={ 2 }>
                    <FinalForm
                        onSubmit={ onSubmit }
                        initialValues={ { smsBody: selectedSmsTemplate?.body } }
                        render={ ({ handleSubmit }: FormRenderProps) => (
                            <>
                                <FormSpy subscription={ { values: true } } onChange={ onFormUpdate } />
                                <form onSubmit={ handleSubmit } data-componentid={ componentId }>
                                    { renderFormFields() }
                                </form>
                            </>
                        ) }
                    />
                    <Hint>{ t("smsTemplates:form.inputs.body.charLengthWarning") }</Hint>
                </Grid>
            </Grid>
        </>
    );
};

export default SMSCustomizationForm;
