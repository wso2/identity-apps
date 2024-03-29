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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code, CodeEditor, DocumentationLink, LinkButton, Message, useDocumentation } from "@wso2is/react-components";
import isObject from "lodash-es/isObject";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { List, Modal, ModalProps, Table } from "semantic-ui-react";
import { AdaptiveAuthTemplateInterface, AdaptiveAuthTemplateTypes } from "../../../admin-applications-v1/models";

/**
 * Proptypes for the adaptive auth template info modal component.
 */
export interface AdaptiveAuthTemplateInfoModalPropsInterface extends ModalProps, IdentifiableComponentInterface {
    /**
     * The template object.
     */
    template: AdaptiveAuthTemplateInterface;
    /**
     * The boolean value used to open the modal.
     */
    open: boolean;
    /**
     * The method to be called on modal close.
     */
    onClose: () => void;
}

/**
 * Adaptive auth template info modal component.
 *
 * @param props - React component props.
 * @returns Template Description component.
 */
const AdaptiveAuthTemplateInfoModal: FunctionComponent<AdaptiveAuthTemplateInfoModalPropsInterface> = (
    props: AdaptiveAuthTemplateInfoModalPropsInterface
): ReactElement => {
    const { template, open, onClose, ["data-componentid"]: componentId, ...rest } = props;

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    /**
     * Resolves the documentation link when a template is selected.
     * @returns the resolved documentation link.
     */
    const resolveDocumentationLink = (): ReactElement => {
        const templateName: string = template?.name;
        let docLink: string = undefined;

        if (templateName === AdaptiveAuthTemplateTypes.USER_AGE_BASED) {
            docLink = getLink(
                "develop.applications.editApplication.common." +
                    "signInMethod.conditionalAuthenticaion.template.userAgeBased.learnMore"
            );
        }

        if (templateName === AdaptiveAuthTemplateTypes.GROUP_BASED) {
            docLink = getLink(
                "develop.applications.editApplication.common." +
                    "signInMethod.conditionalAuthenticaion.template.groupBased.learnMore"
            );
        }

        if (templateName === AdaptiveAuthTemplateTypes.IP_BASED) {
            docLink = getLink(
                "develop.applications.editApplication.common." +
                    "signInMethod.conditionalAuthenticaion.template.ipBased.learnMore"
            );
        }

        if (templateName === AdaptiveAuthTemplateTypes.NEW_DEVICE_BASED) {
            docLink = getLink(
                "develop.applications.editApplication.common." +
                    "signInMethod.conditionalAuthenticaion.template.deviceBased.learnMore"
            );
        }

        if (docLink === undefined) {
            return null;
        }

        return (
            <DocumentationLink link={ docLink } data-componentid={ `${componentId}-learn-more-link` }>
                { t("common:learnMore") }
            </DocumentationLink>
        );
    };

    /**
     * Returns the parameters of the template.
     *
     * @returns The parameters of the template.
     */
    const getParameters = (): string[] => {
        const params: string[] = [];

        if (isObject(template.parametersDescription)) {
            Object.entries(template.parametersDescription).map(([ param ]: string[]) => {
                params.push(param);
            });
        }

        return params;
    };

    /**
     * Generates the prerequisite sentence.
     *
     * @param prerequisite - The prerequisite sentence.
     * @param params - The parameters of the template.
     * @returns The prerequisite sentence.
     */
    const generatePrerequisite = (prerequisite: string, params: string[]): ReactElement => {
        const sentenceArray: string[] = prerequisite.split(" ");
        const modified: ReactElement[] = [];
        let content: string = "";

        sentenceArray.map((word: string, index: number) => {
            if (params.includes(word)) {
                modified.push(<span key={ index }>{ content } </span>);
                modified.push(
                    <span key={ index }>
                        <Code>{ word }</Code>
                    </span>
                );
                content = "";
            } else {
                content = content.concat(word + " ");
            }
        });
        modified.push(<span>{ content }</span>);

        return <p>{ modified.map((element: ReactElement) => element) }</p>;
    };

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
            data-componentid={ componentId }
            { ...rest }
        >
            <Modal.Header>{ template.title }</Modal.Header>
            <Modal.Content scrolling>
                <p>
                    { template.summary }
                    { resolveDocumentationLink() }
                </p>
                { Array.isArray(template?.preRequisites) && template.preRequisites.length > 0 && (
                    <>
                        <h4>
                            { t(
                                "applications:edit.sections.signOnMethod.sections." +
                                    "templateDescription.description.prerequisites"
                            ) }
                        </h4>
                        <List>
                            { template.preRequisites.map((prerequisite: string, index: number) => {
                                const params: string[] = getParameters();

                                return (
                                    <List.Item key={ index }>
                                        <List.Icon name="check circle outline" color="green" />
                                        <List.Content>{ generatePrerequisite(prerequisite, params) }</List.Content>
                                    </List.Item>
                                );
                            }) }
                        </List>
                    </>
                ) }
                { isObject(template.parametersDescription) && (
                    <>
                        <h4>
                            { t(
                                "applications:edit.sections.signOnMethod.sections." +
                                    "templateDescription.description.parameters"
                            ) }
                        </h4>
                        <Table definition>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell>
                                        { t(
                                            "applications:edit.sections" +
                                                ".signOnMethod.sections.templateDescription.description" +
                                                ".description"
                                        ) }
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { Object.entries(template.parametersDescription).map(
                                    ([ param, description ]: [string, string], index: number) => {
                                        return (
                                            <Table.Row key={ index }>
                                                <Table.Cell>
                                                    <Code>{ param }</Code>
                                                </Table.Cell>
                                                <Table.Cell>{ description }</Table.Cell>
                                            </Table.Row>
                                        );
                                    }
                                ) }
                            </Table.Body>
                        </Table>
                    </>
                ) }
                { isObject(template.defaultStepsDescription) && (
                    <>
                        <h4>
                            { t(
                                "applications:edit.sections.signOnMethod.sections." +
                                    "templateDescription.description.defaultSteps"
                            ) }
                        </h4>
                        { Object.entries(template.defaultStepsDescription).map(
                            ([ step, description ]: [string, string], index: number, steps: [string, string][]) => {
                                return (
                                    <div className="stepper" key={ `${index}-${step}` }>
                                        <div className="step-number">{ index + 1 }</div>
                                        <div className="step-text">{ description }</div>
                                        { steps.length !== index + 1 && (
                                            <div className="step-connector">
                                                <div className="step-line"></div>
                                            </div>
                                        ) }
                                    </div>
                                );
                            }
                        ) }
                    </>
                ) }
                { template.helpLink && (
                    <>
                        <h4>
                            { t(
                                "applications:edit.sections.signOnMethod.sections." +
                                    "templateDescription.description.helpReference"
                            ) }
                        </h4>
                        <Message
                            type="info"
                            content={
                                (<a target="_blank" href={ template.helpLink } rel="noopener noreferrer">
                                    { template.helpLink }
                                </a>)
                            }
                        />
                    </>
                ) }
                { template.code && (
                    <>
                        <h4>
                            { t(
                                "applications:edit.sections.signOnMethod.sections." +
                                    "templateDescription.description.code"
                            ) }
                        </h4>
                        <CodeEditor
                            lint
                            language="javascript"
                            sourceCode={ template.code }
                            options={ {
                                lineWrapping: true
                            } }
                            readOnly={ true }
                            data-testid={ `${template.title}-code-editor` }
                            getThemeFromEnvironment={ true }
                        />
                    </>
                ) }
            </Modal.Content>
            <Modal.Actions>
                <LinkButton onClick={ onClose }>{ t("common:cancel") }</LinkButton>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
AdaptiveAuthTemplateInfoModal.defaultProps = {
    "data-componentid": "adaptive-auth-template-info-modal"
};

export default AdaptiveAuthTemplateInfoModal;
