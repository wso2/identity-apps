/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    Code,
    CodeEditor,
    DocumentationLink,
    LinkButton,
    Message,
    useDocumentation
} from "@wso2is/react-components";
import isObject from "lodash-es/isObject";
import React, {
    FunctionComponent,
    ReactElement
} from "react";
import { useTranslation } from "react-i18next";
import { List, Modal, Table } from "semantic-ui-react";
import { AdaptiveAuthTemplateInterface, AdaptiveAuthTemplateTypes } from "../../../../models";

/**
 * Proptypes of `TemplateDescription` component.
 */
interface TemplateDescriptionPropsInterface {
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
 * The modal that contains template description.
 *
 * @param props - React component props.
 *
 * @returns Template Description component.
 */
export const TemplateDescription: FunctionComponent<TemplateDescriptionPropsInterface> = (
    props: TemplateDescriptionPropsInterface
): ReactElement => {

    const {
        template,
        open,
        onClose
    } = props;

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
            docLink = getLink("develop.applications.editApplication.common." + 
                "signInMethod.conditionalAuthenticaion.template.userAgeBased.learnMore");
        }

        if (templateName === AdaptiveAuthTemplateTypes.GROUP_BASED) {
            docLink = getLink("develop.applications.editApplication.common." + 
                "signInMethod.conditionalAuthenticaion.template.groupBased.learnMore");
        }

        if (templateName === AdaptiveAuthTemplateTypes.IP_BASED) {
            docLink = getLink("develop.applications.editApplication.common." + 
                "signInMethod.conditionalAuthenticaion.template.ipBased.learnMore");
        }

        if (templateName === AdaptiveAuthTemplateTypes.NEW_DEVICE_BASED) {
            docLink = getLink("develop.applications.editApplication.common." + 
                "signInMethod.conditionalAuthenticaion.template.deviceBased.learnMore");
        }

        if (docLink === undefined) {
            return null;
        }

        return (
            <DocumentationLink
                link={ docLink }
            >
                { t("common:learnMore") }
            </DocumentationLink>
        );

    };

    const getParameters = (): string[] => {
        const params : string[] = [];
        
        if (isObject(template.parametersDescription)) {
            Object.entries(template.parametersDescription).map(([ param ]: string[]) => {
                params.push(param);
            });
        }

        return params;
    };

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
        
        return (
            <p>
                { modified.map((element: ReactElement) => element) }
            </p>
        );
    };
    
    return (
        <Modal open={ open } onClose={ onClose } dimmer="blurring" size="small">
            <Modal.Header>{ template.title }</Modal.Header>
            <Modal.Content scrolling>
                <p>
                    { template.summary }
                    { resolveDocumentationLink() }
                </p>
                {
                    Array.isArray(template?.preRequisites) && template.preRequisites.length > 0 && (
                        <>
                            <h4>
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "templateDescription.description.prerequisites")
                                }
                            </h4>
                            <List>
                                { template.preRequisites.map((prerequisite: string, index: number) => {
                                    const params: string[] = getParameters();
                                    
                                    return (
                                        <List.Item key={ index }>
                                            <List.Icon name="check circle outline" color="green"/>
                                            <List.Content>{ generatePrerequisite(prerequisite, params) }</List.Content>
                                        </List.Item>
                                    );
                                }) }
                            </List>
                        </>
                    )
                }
                {
                    isObject(template.parametersDescription) && (
                        <>
                            <h4>
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "templateDescription.description.parameters")
                                }
                            </h4>
                            <Table definition>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell/>
                                        <Table.HeaderCell>{
                                            t("console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.templateDescription.description" +
                                                ".description")
                                        }</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    { Object.entries(template.parametersDescription)
                                        .map(([ param, description ]: [ string, string ], index: number) => {
                                            return (
                                                <Table.Row key={ index }>
                                                    <Table.Cell>
                                                        <Code>{ param }</Code>
                                                    </Table.Cell>
                                                    <Table.Cell>{ description }</Table.Cell>
                                                </Table.Row>
                                            );
                                        }) }
                                </Table.Body>
                            </Table>
                        </>
                    )
                }
                {
                    isObject(template.defaultStepsDescription) && (
                        <>
                            <h4>
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "templateDescription.description.defaultSteps")
                                }
                            </h4>
                            {
                                Object.entries(template.defaultStepsDescription)
                                    .map((
                                        [ step, description ]: [ string, string ], 
                                        index: number, 
                                        steps: [string, string][]
                                    ) => {
                                        return (
                                            <div className="stepper" key={ `${ index }-${ step }` }>
                                                <div className="step-number">{ index + 1 }</div>
                                                <div className="step-text">{ description }</div>
                                                { steps.length !== (index + 1) && (
                                                    <div className="step-connector">
                                                        <div className="step-line"></div>
                                                    </div>
                                                ) }
                                            </div>
                                        );
                                    })
                            }
                        </>
                    )
                }
                {
                    template.helpLink && (
                        <>
                            <h4>
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "templateDescription.description.helpReference")
                                }
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
                    )
                }
                {
                    template.code && (
                        <>
                            <h4>
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "templateDescription.description.code")
                                }
                            </h4>
                            <CodeEditor
                                lint
                                language="javascript"
                                sourceCode={ template.code }
                                options={ {
                                    lineWrapping: true
                                } }
                                readOnly={ true }
                                data-testid={ `${ template.title }-code-editor` }
                                getThemeFromEnvironment={ true }
                            />
                        </>
                    )
                }
            </Modal.Content>
            <Modal.Actions>
                <LinkButton onClick={ onClose }>{ t("common:cancel") }</LinkButton>
            </Modal.Actions>
        </Modal>
    );
};
