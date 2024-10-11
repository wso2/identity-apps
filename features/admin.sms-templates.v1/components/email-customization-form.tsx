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
import { AppState, FeatureConfigInterface, I18nConstants } from "@wso2is/admin.core.v1";
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
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import { SmsTemplate } from "../models";

interface SmsCustomizationFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Is SMS templates list loading.
     */
    isSmsTemplatesListLoading: boolean;

    /**
     * Selected SMS template
     */
    selectedSmsTemplate: SmsTemplate;

    /**
     * Selected locale
     */
    selectedLocale: string;

    /**
     * Callback to be called when the template is changed.
     * @param template - SMS template
     */
    onTemplateChanged: (updatedTemplateAttributes: Partial<SmsTemplate>) => void;

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

const FORM_ID: string = "sms-customization-content-form";

/**
 * Email customization form.
 *
 * @param props - Props injected to the component.
 *
 * @returns Email template customization form.
 */
export const SmsCustomizationForm: FunctionComponent<SmsCustomizationFormPropsInterface> = (
    props: SmsCustomizationFormPropsInterface
): ReactElement => {

    const {
        isSmsTemplatesListLoading,
        selectedSmsTemplate,
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

    /**
     * Following `key` state and the use of the useEffect are temporary
     * fixes for the issue of the input not re-rendering when the props change.
     * The ideal solution is to use Final Form directly without employing
     * the Final Form wrapper component.
     */
    const [ key, setKey ] = useState<number>(0);

    useEffect(() => {
        setKey((key + 1) % 100);
    }, [ selectedSmsTemplate ]);

    return (
        (isSmsTemplatesListLoading) ? (
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
                                computer={ 12 }
                            >
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
                                computer={ 12 }
                            >
                                <Field.Textarea
                                    ariaLabel="Email Subject Input"
                                    inputType="description"
                                    name="emailSubject"
                                    label={ t("extensions:develop.emailTemplates.form.inputs.subject.label") }
                                    placeholder={ t("extensions:develop.emailTemplates.form.inputs" +
                                        ".subject.placeholder") }
                                    required={ true }
                                    value={ selectedSmsTemplate?.body }
                                    maxLength={ 255 }
                                    minLength={ 1 }
                                    onKeyPress={ null }
                                    data-componentid={ `${ componentId }-email-subject` }
                                    listen={ (value: string) => {
                                        onTemplateChanged({
                                            body: value
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
                                computer={ 12 }
                            >
                                <Message
                                    type="warning"
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
                    </Grid>
                </Form>
            </>
        )
    );
};

/**
 * Default props for the component.
 */
SmsCustomizationForm.defaultProps = {
    "data-componentid": "sms-customization-form"
};
