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

import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    CodeEditor,
    ContentLoader,
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
import { useSelector } from "react-redux";
import { EmailTemplate } from "../models";
import { FinalForm, FinalFormField, FormRenderProps, FormSpy, FormState, TextFieldAdapter } from "@wso2is/form/src";
import { Hint } from "@wso2is/react-components/src";
import Grid from "@oxygen-ui/react/Grid";

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
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const onFormUpdate = (state: FormState<Record<string, any>, Partial<Record<string, any>>>) => {
        onTemplateChanged({
            subject: state?.values?.emailSubject,
            footer: state?.values?.emailFooter
        });
    };

    const renderFormFields = (): ReactElement => {
        return (
            <>
            <Grid xs={ 12 } md={ 8 } lg={ 6 }>
                <FinalFormField
                    key="emailSubject"
                    FormControlProps={ {
                        margin: "dense"
                    } }
                    width={ 16 }
                    ariaLabel="Email Subject Input"
                    required={ true }
                    data-componentid={ `${ componentId }-email-subject` }
                    name="emailSubject"
                    type="text"
                    label={ t("extensions:develop.emailTemplates.form.inputs.subject.label") }
                    placeholder={ t("extensions:develop.emailTemplates.form.inputs" +
                        ".subject.placeholder") }
                    value={ selectedEmailTemplate?.subject }
                    defaultValue={ selectedEmailTemplate?.subject }
                    component={ TextFieldAdapter }
                    readOnly={ readOnly }
                />
                <Hint>{ t("extensions:develop.emailTemplates.form.inputs.subject.hint") }</Hint>
            </Grid>
            <Grid xs={ 12 } xl={ 6 } marginY={ 4 }>
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
                                { t("common:learnMore") }
                            </DocumentationLink>
                        </>
                    ) }
                />
            </Grid>
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
            <Grid xs={ 12 } md={ 8 } lg={ 6 } marginTop={ 2 }>
                <FinalFormField
                    key="emailFooter"
                    FormControlProps={ {
                        margin: "dense"
                    } }
                    ariaLabel="Email Subject Input"
                    required={ true }
                    data-componentid={ `${ componentId }-email-footer` }
                    name="emailFooter"
                    type="text"
                    label={ t("extensions:develop.emailTemplates.form.inputs.footer.label") }
                    placeholder={ t("extensions:develop.emailTemplates.form.inputs" +
                        ".footer.placeholder") }
                    value={ selectedEmailTemplate?.footer }
                    defaultValue={ selectedEmailTemplate?.footer }
                    component={ TextFieldAdapter }
                    readOnly={ readOnly }
                />
                <Hint>{ t("extensions:develop.emailTemplates.form.inputs.footer.hint") }</Hint>
            </Grid>
            </>
        );
    };

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
            <Grid container>
                <Grid xs={ 16 }>
                    <FinalForm
                            onSubmit={ onSubmit }
                            initialValues={ { 
                                emailSubject: selectedEmailTemplate?.subject,
                                emailFooter: selectedEmailTemplate?.footer
                            } }
                            render={ ({ handleSubmit }: FormRenderProps) => (
                                <>
                                    <FormSpy subscription={ { values: true } } onChange={ onFormUpdate } />
                                    <form onSubmit={ handleSubmit } data-componentid={ componentId }>
                                        { renderFormFields() }
                                    </form>
                                </>
                            ) }
                        />
                </Grid>
            </Grid>
        )
    );
};

/**
 * Default props for the component.
 */
EmailCustomizationForm.defaultProps = {
    "data-componentid": "email-customization-form"
};
