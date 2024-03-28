/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
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
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { AccessControlConstants } from "../../admin-access-control-v1/constants/access-control";
import { I18nConstants } from "../../core";
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
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    /**
     * Following `key` state and the use of the useEffect are temporary
     * fixes for the issue of the input not re-rendering when the props change.
     * The ideal solution is to use Final Form directly without employing
     * the Final Form wrapper component.
     */
    const [ key, setKey ] = useState<number>(0);

    useEffect(() => {
        setKey((key + 1) % 100);
    }, [ selectedEmailTemplate ]);

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
                                    maxLength={ 255 }
                                    minLength={ 1 }
                                    data-componentid={ `${ componentId }-email-subject` }
                                    listen={ (value: string) => {
                                        onTemplateChanged({
                                            subject: value
                                        });
                                    } }
                                    readOnly={ readOnly }
                                    key={ key }
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
                                    required={ false }
                                    value={ selectedEmailTemplate?.footer }
                                    maxLength={ 255 }
                                    minLength={ 1 }
                                    data-componentid={ `${ componentId }-email-footer` }
                                    listen={ (value: string) => {
                                        onTemplateChanged({
                                            footer: value
                                        });
                                    } }
                                    readOnly={ readOnly }
                                    key={ key }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>

                <Show when={ AccessControlConstants.EMAIL_TEMPLATES_DELETE }>
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
        )
    );
};

/**
 * Default props for the component.
 */
EmailCustomizationForm.defaultProps = {
    "data-componentid": "email-customization-form"
};
