/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, Heading, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import { getTemplateDetails } from "../../api";
import { getViewLocaleTemplateWizardStepIcons } from "../../configs";
import { EmailTemplate } from "../../models";
import { EmailTemplateEditor } from "../email-template-editor";

interface ViewLocaleTemplatePropsInterface extends TestableComponentInterface {
    onCloseHandler: () => void;
    onEditHandler: () => void;
    templateTypeId: string;
    templateId: string;
}

/**
 * Component will render an output of the selected email template.
 * 
 * @param {ViewLocaleTemplatePropsInterface} props - props required to render html email template
 *
 * @return {React.ReactElement}
 */
export const ViewLocaleTemplate: FunctionComponent<ViewLocaleTemplatePropsInterface> = (
    props: ViewLocaleTemplatePropsInterface
): ReactElement => {

    const {
        onCloseHandler,
        onEditHandler,
        templateTypeId,
        templateId,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ templateData, setTemplateData ] = useState<EmailTemplate>(null);

    useEffect(() => {
        getTemplateDetails(templateTypeId, templateId)
            .then((response: AxiosResponse<EmailTemplate>) => {
                if (response.status === 200) {
                    setTemplateData(response.data);
                }
            })
            .catch(() => {
                // Handle the error.
            });
    },[ templateData !== undefined ]);

    const WIZARD_STEPS = [ {
        content: templateData?.body
            ? (
                <EmailTemplateEditor
                    htmlContent={ templateData.body }
                    isPreviewOnly
                    isReadOnly
                    isAddFlow={ false }
                    isSignature={ false }
                    data-testid={ `${ testId }-email-template-editor` }
                />
            ) : <ContentLoader/>,
        icon: getViewLocaleTemplateWizardStepIcons().general
    } ];

    return (
        <Modal
            open={ true }
            className="wizard create-template-type-wizard"
            dimmer="blurring"
            size="small"
            onClose={ onCloseHandler }
            closeOnDimmerClick={ false }
            closeOnEscape={ false }
            data-testid={ `${ testId }-modal` }
        >
            <Modal.Header className="wizard-header template-type-wizard">
                { templateData?.subject }
                <Heading as="h6">
                    { t("console:manage.features.emailTemplates.viewTemplate.heading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container template-view-content" scrolling>
                { WIZARD_STEPS[0].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => { onCloseHandler(); } }
                                data-testid={ `${ testId }-modal-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                onClick={ () => { onEditHandler(); } }
                                data-testid={ `${ testId }-modal-edit-button` }
                            >
                                { t("console:manage.features.emailTemplates.buttons.editTemplate") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
ViewLocaleTemplate.defaultProps = {
    "data-testid": "view-locale-template"
};
