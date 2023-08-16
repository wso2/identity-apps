/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import {
    CodeEditor,
    ContentLoader, DangerZone,
    DocumentationLink,
    Heading,
    Message,
    useDocumentation
} from "@wso2is/react-components";
import * as codemirror from "codemirror";
import React, {
    FunctionComponent,
    ReactElement
} from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { I18nConstants } from "../../../../features/core";
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
    onTemplateChanged: (template: EmailTemplate) => void;

    /**
     * Callback to be called when the form is submitted.
     */
    onSubmit: () => void;

    /**
     * Callback to be called when the template delete requested
     */
    onDeleteRequested: () => void;
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
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    return (
        (isEmailTemplatesListLoading) ? (
            <ContentLoader/>
        ) : (
            <>
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ true }
                    onSubmit={ onSubmit }
                    data-componentid={ componentId }
                >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column
                                mobile={ 16 }
                                computer={ 8 }
                            >
                                <Field.Input
                                    ariaLabel="Email Subject Input"
                                    inputType="default"
                                    name="emailSubject"
                                    label={ t("extensions:develop.emailTemplates.form.inputs.subject.label") }
                                    placeholder={ t("extensions:develop.emailTemplates.form.inputs" +
                                        ".subject.placeholder") }
                                    hint={ t("extensions:develop.emailTemplates.form.inputs.subject.hint") }
                                    required={ true }
                                    value={ selectedEmailTemplate?.subject }
                                    maxLength={ 50 }
                                    minLength={ 1 }
                                    data-componentid={ `${ componentId }-email-subject` }
                                    listen={ (value: string) => {
                                        onTemplateChanged({
                                            ...selectedEmailTemplate,
                                            subject: value
                                        });
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column
                                mobile={ 16 }
                                computer={ 8 }
                            >
                                <Heading as="h6">
                                    { t("extensions:develop.emailTemplates.form.inputs.body.label") }
                                </Heading>
                                <Message
                                    type="info"
                                    content={ (
                                        <>
                                            { t("extensions:develop.emailTemplates.form.inputs.body.hint") }
                                            <DocumentationLink
                                                link={ getLink("develop.emailCustomization.form.emailBody.learnMore") }
                                            >
                                                { t("extensions:common.learnMore") }
                                            </DocumentationLink>
                                        </>
                                    ) }
                                />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column
                                mobile={ 16 }
                                computer={ 16 }
                            >
                                <div className="code-editor-wrapper">
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
                                                ...selectedEmailTemplate,
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
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column
                                mobile={ 16 }
                                computer={ 8 }
                            >
                                <Field.Input
                                    ariaLabel="Email Footer Input"
                                    inputType="default"
                                    name="emailFooter"
                                    label={ t("extensions:develop.emailTemplates.form.inputs.footer.label") }
                                    placeholder={ t("extensions:develop.emailTemplates.form.inputs" +
                                        ".footer.placeholder") }
                                    hint={ t("extensions:develop.emailTemplates.form.inputs.footer.hint") }
                                    required={ true }
                                    value={ selectedEmailTemplate?.footer }
                                    maxLength={ 255 }
                                    minLength={ 1 }
                                    data-componentid={ `${ componentId }-email-footer` }
                                    listen={ (value: string) => {
                                        onTemplateChanged({
                                            ...selectedEmailTemplate,
                                            footer: value
                                        });
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>

                <DangerZone
                    data-componentid={ `${ componentId }-revert-email-provider-config` }
                    actionTitle={ t("extensions:develop.emailTemplates.dangerZone.action") }
                    header={ t("extensions:develop.emailTemplates.dangerZone.heading") }
                    subheader={ t("extensions:develop.emailTemplates.dangerZone.message") }
                    isButtonDisabled={ selectedLocale === I18nConstants.DEFAULT_FALLBACK_LANGUAGE }
                    buttonDisableHint={ t("extensions:develop.emailTemplates.dangerZone.actionDisabledHint") }
                    onActionClick={ onDeleteRequested }
                />
            </>
        )
    );
};

/**
 * Default props for the component.
 */
EmailCustomizationForm.defaultProps = {
    "data-componentid": "email-customization-form"
};
