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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { ContentLoader, DocumentationLink, Message, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { SmsTemplate } from "../models/sms-templates";

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
 * SMS customization form.
 *
 * @param props - Props injected to the component.
 *
 * @returns SMS template customization form.
 */
export const SmsCustomizationForm: FunctionComponent<SmsCustomizationFormPropsInterface> = (
    props: SmsCustomizationFormPropsInterface
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

    if (isSmsTemplatesListLoading) {
        return <ContentLoader />;
    }

    return (
        <>
            <Form id={ FORM_ID } uncontrolledForm={ true } onSubmit={ onSubmit } data-componentid={ componentId }>
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } computer={ 12 }>
                            <Message
                                type="info"
                                content={
                                    (<>
                                        { t("smsTemplates:form.inputs.body.hint") }
                                        <DocumentationLink
                                            link={ getLink("develop.smsCustomization.form.smsBody.learnMore") }
                                        >
                                            { t("smsTemplates:common.learnMore") }
                                        </DocumentationLink>
                                    </>)
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } computer={ 12 }>
                            <Field.Textarea
                                ariaLabel="SMS Body Input"
                                inputType="description"
                                name="smsBody"
                                label={ t("smsTemplates:form.inputs.body.label") }
                                placeholder={ t("smsTemplates:form.inputs" + ".body.placeholder") }
                                required={ true }
                                value={ selectedSmsTemplate?.body }
                                minLength={ 1 }
                                maxLength={ 1024 }
                                onKeyPress={ null }
                                data-componentid={ `${componentId}-sms-body` }
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
                        <Grid.Column mobile={ 16 } computer={ 12 }>
                            <Message
                                type="warning"
                                content={
                                    <>{ t("smsTemplates:form.inputs.body.charLengthWarning") }</>
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        </>
    );
};
