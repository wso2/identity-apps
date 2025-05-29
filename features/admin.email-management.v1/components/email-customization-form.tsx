/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { Show } from "@wso2is/access-control";
import { I18nConstants } from "@wso2is/admin.core.v1/constants/i18n-constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, FormSpy, TextFieldAdapter } from "@wso2is/form";
import {
    CodeEditor,
    ContentLoader, DangerZone,
    DocumentationLink,
    Heading,
    Hint,
    Message,
    useDocumentation
} from "@wso2is/react-components";
import * as codemirror from "codemirror";
import React, {
    FunctionComponent,
    ReactElement
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { EmailTemplate } from "../models";

interface EmailCustomizationFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Is email templates list loading.
     */
    isEmailTemplatesListLoading: boolean;
    /**
     * Selected email template
     */
    selectedEmailTemplate: EmailTemplate;
    /**
     * Selected locale
     */
    selectedLocale: string;
    /**
     * Callback to be called when the template is changed.
     * @param template - Email template
     */
    onTemplateChanged: (updatedTemplateAttributes: Partial<EmailTemplate>) => void;
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

interface EmailCustomizationFormValuesInterface {
    emailSubject: string;
    emailFooter: string;
}

const FORM_ID: string = "email-customization-content-form";

/**
 * Email customization form.
 *
 * @param props - Props injected to the component.
 *
 * @returns Email template customization form.
 */
export const EmailCustomizationForm: FunctionComponent<EmailCustomizationFormPropsInterface> = (
    props: EmailCustomizationFormPropsInterface
): ReactElement => {

    const {
        isEmailTemplatesListLoading,
        selectedEmailTemplate,
        selectedLocale,
        onTemplateChanged,
        onSubmit,
        onDeleteRequested,
        readOnly,
        ["data-componentid"]: componentId = "email-customization-form"
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    if (isEmailTemplatesListLoading) {
        return (
            <ContentLoader/>
        );
    }

    return (
        <>
            <FinalForm
                keepDirtyOnReinitialize={ false }
                initialValues={ {
                    emailFooter: selectedEmailTemplate?.footer,
                    emailSubject: selectedEmailTemplate?.subject
                } }
                onSubmit={ onSubmit }
                data-componentid={ componentId }
                render={ ({ onSubmit }: FormRenderProps) => {

                    return (
                        <form
                            id={ FORM_ID }
                            onSubmit={ onSubmit }
                        >
                            <Grid rowSpacing={ 2 } container>
                                <Grid xs={ 8 }>
                                    <FinalFormField
                                        key="emailSubject"
                                        width={ 16 }
                                        ariaLabel="Email Subject Input"
                                        required={ true }
                                        data-componentid={ `${ componentId }-email-subject` }
                                        name="emailSubject"
                                        type="text"
                                        helperText={
                                            (<Hint>
                                                <Typography variant="inherit">
                                                    { t("extensions:develop.emailTemplates.form.inputs.subject.hint") }
                                                </Typography>
                                            </Hint>)
                                        }
                                        label={ t("extensions:develop.emailTemplates.form.inputs.subject.label") }
                                        placeholder={ t("extensions:develop.emailTemplates.form.inputs" +
                                            ".subject.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 255 }
                                        minLength={ 1 }
                                        readOnly={ readOnly }
                                    />
                                    <Heading as="h6">
                                        { t("extensions:develop.emailTemplates.form.inputs.body.label") }
                                    </Heading>
                                    <Message
                                        type="info"
                                        content={ (
                                            <>
                                                { t("extensions:develop.emailTemplates.form.inputs.body.hint") }
                                                <DocumentationLink
                                                    link={
                                                        getLink("develop.emailCustomization.form.emailBody.learnMore") }
                                                >
                                                    { t("common:learnMore") }
                                                </DocumentationLink>
                                            </>
                                        ) }
                                    />
                                </Grid>
                                <Grid xs={ 16 }>
                                    <CodeEditor
                                        lint
                                        allowFullScreen
                                        smart
                                        controlledFullScreenMode={ false }
                                        language="htmlmixed"
                                        sourceCode={ selectedEmailTemplate?.body }
                                        lineWrapping={ true }
                                        // Template Change event is fired up onBlur rather than onChange, because of the
                                        // reason that the onChange event is fired up on every keystroke, and it causes
                                        // the cursor to jump to the end of the editor with the state change and
                                        // rerender.
                                        onChange={ (editor: codemirror.Editor, _data: codemirror.EditorChange,
                                            _value: string) => {
                                            onTemplateChanged({
                                                body: editor.getValue()
                                            });
                                        } }
                                        height="500px"
                                        theme={ "light" }
                                        translations={ {
                                            copyCode: t("common:copyToClipboard"),
                                            exitFullScreen: t("common:exitFullScreen"),
                                            goFullScreen: t("common:goFullScreen")
                                        } }
                                        data-componentId={ `${ componentId }-email-body-editor` }
                                        readOnly={ readOnly }
                                    />
                                </Grid>
                                <Grid xs={ 8 }>
                                    <FinalFormField
                                        key="emailFooter"
                                        width={ 16 }
                                        ariaLabel="Email Footer Input"
                                        required={ false }
                                        data-componentid={ `${ componentId }-email-footer` }
                                        name="emailFooter"
                                        type="text"
                                        helperText={
                                            (<Hint>
                                                <Typography variant="inherit">
                                                    { t("extensions:develop.emailTemplates.form.inputs.footer.hint") }
                                                </Typography>
                                            </Hint>)
                                        }
                                        label={ t("extensions:develop.emailTemplates.form.inputs.footer.label") }
                                        placeholder={ t("extensions:develop.emailTemplates.form.inputs" +
                                            ".footer.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 255 }
                                        minLength={ 1 }
                                        readOnly={ readOnly }
                                    />
                                </Grid>
                            </Grid>
                            <FormSpy
                                subscription={ { values: true } }
                                onChange={ ({ values }: { values: EmailCustomizationFormValuesInterface }) => {
                                    onTemplateChanged({
                                        footer: values.emailFooter,
                                        subject: values.emailSubject
                                    });
                                } }
                            />
                        </form>
                    );
                } }
            />
            <Show
                when={ featureConfig?.emailTemplates?.scopes?.delete }
            >
                <DangerZone
                    data-componentid={ `${ componentId }-revert-email-provider-config` }
                    actionTitle={ t("extensions:develop.emailTemplates.dangerZone.action") }
                    header={ t("extensions:develop.emailTemplates.dangerZone.heading") }
                    subheader={ t("extensions:develop.emailTemplates.dangerZone.message") }
                    isButtonDisabled={ selectedLocale === I18nConstants.DEFAULT_FALLBACK_LANGUAGE }
                    buttonDisableHint={ t("extensions:develop.emailTemplates.dangerZone.actionDisabledHint") }
                    onActionClick={ onDeleteRequested }
                />
            </Show>
        </>
    );
};
