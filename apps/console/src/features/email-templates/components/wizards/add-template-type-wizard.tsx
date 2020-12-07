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

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Modal } from "semantic-ui-react";
import { AppConstants, history } from "../../../core";
import { createNewTemplateType } from "../../api";
import { getAddEmailTemplateTypeWizardStepIcons } from "../../configs";
import { AddEmailTemplateTypeForm } from "../forms";

/**
 * Interface for add email template type wizard props.
 */
interface AddEmailTemplateTypeWizardPropsInterface extends TestableComponentInterface {
    onCloseHandler: () => void;
}

/**
 * Wizard component to add a new email template type.
 * TODO : This component is still WIP.
 *
 * @param {AddEmailTemplateTypeWizardPropsInterface} props - props required for the wizard component.
 * @return {React.ReactElement}
 */
export const AddEmailTemplateTypeWizard: FunctionComponent<AddEmailTemplateTypeWizardPropsInterface> = (
    props: AddEmailTemplateTypeWizardPropsInterface
): ReactElement => {

    const {
        onCloseHandler,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ currentStep, setCurrentWizardStep ] = useState<number>(0);
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const handleFormSubmit = (values: any): void => {
        createTemplateType(values.templateType);
    };

    const WIZARD_STEPS = [ {
        content: (
            <AddEmailTemplateTypeForm
                onSubmit={ (values) => handleFormSubmit(values) }
                triggerSubmit={ finishSubmit }
                data-testid={ `${ testId }-form` }
            />
        ),
        icon: getAddEmailTemplateTypeWizardStepIcons().general,
        title: t("console:manage.features.emailTemplateTypes.wizards.addTemplateType.steps.templateType.heading")
    } ];

    const createTemplateType = (templateTypeName: string): void => {
        createNewTemplateType(templateTypeName)
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("console:manage.features.emailTemplateTypes.notifications.createTemplateType" +
                            ".success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:manage.features.emailTemplateTypes.notifications.createTemplateType" +
                            ".success.message")
                    }));
                }

                history.push(
                    AppConstants.getPaths().get("EMAIL_TEMPLATES").replace(":templateTypeId", response.data?.id));
                onCloseHandler();
            })
            .catch(error => {
                setAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.emailTemplateTypes.notifications.createTemplateType" +
                        ".genericError.message")
                });
            });
    };

    return (
        <Modal
            open={ true }
            className="wizard create-template-type-wizard"
            dimmer="blurring"
            size="small"
            onClose={ onCloseHandler }
            closeOnDimmerClick={ false }
            closeOnEscape={ false }
            data-testid={ testId }
        >
            <Modal.Header className="wizard-header template-type-wizard">
                { t("console:manage.features.emailTemplateTypes.wizards.addTemplateType.heading") }
                <Heading as="h6">
                    { t("console:manage.features.emailTemplateTypes.wizards.addTemplateType.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { WIZARD_STEPS[ currentStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => {
                                    onCloseHandler();
                                } }
                                data-testid={ `${ testId }-cancel-button` }
                            >
                                { t("cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                onClick={ setFinishSubmit }
                                data-testid={ `${ testId }-create-button` }
                            >
                                { t("console:manage.features.emailTemplateTypes.buttons.createTemplateType") }
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
AddEmailTemplateTypeWizard.defaultProps = {
    "data-testid": "email-template-type-add-wizard"
};
