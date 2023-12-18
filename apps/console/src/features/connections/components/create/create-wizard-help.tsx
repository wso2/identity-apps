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

import useDeploymentConfig from "@wso2is/common/src/hooks/use-app-configs";
import { TestableComponentInterface } from "@wso2is/core/models";
import { CodeEditor, CopyInputField, Heading, Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider } from "semantic-ui-react";

/**
 * Wizard help message props interface.
 */
interface WizardHelpMessageInterface {
    /**
     * Help content code snippets.
     */
    codeSnippets?: { description: string, value: string }[];
    /**
     * Help content input value.
     */
    copyInputFields?: { description: string, value: string }[];
    /**
     * Help content header.
     */
    header?: string;
    /**
     * Help content paragraphs.
     */
    paragraphs?: string[];
    /**
     * Help content link.
     */
    link?: { text: string, url: string };
}

/**
 * Wizard help props interface.
 */
interface WizardHelpInterface {
    /**
     * Help content message.
     */
    message?: WizardHelpMessageInterface;
    /**
     * Help content fields.
     */
    fields?: { fieldName: string, hint: string }[];
}

/**
 * Prop types of the component.
 */
export interface CreateConnectionWizardHelpPropsInterface extends TestableComponentInterface {
    /**
     * Wizard help content.
     */
    wizardHelp: WizardHelpInterface;
}

/**
 * Help content for the connection template creation wizard.
 *
 * @param props - Props injected into the component.
 *
 *  @returns React Element
 */
const CreateConnectionWizardHelp: FunctionComponent<
CreateConnectionWizardHelpPropsInterface> = (
    props: CreateConnectionWizardHelpPropsInterface
): ReactElement => {

    const {
        wizardHelp,
        [ "data-testid" ]: testId
    } = props;

    const { deploymentConfig } = useDeploymentConfig();

    const overrideFieldValue = (value: string): string => {
        switch (value) {
            case "domain_name":
                return value.replace(value, new URL(deploymentConfig?.serverOrigin)?.hostname);
            case "site_url":
                return value.replace(value, deploymentConfig.customServerHost);
            case "redirect_uri":
                return value.replace(value, deploymentConfig.customServerHost + "/commonauth");
            default:
                return value;
        }
    };

    /**
     * This function overrides the code snippet values with the
     * deployment config values.
     *
     * @param value - code snippet
     * @returns - modified code snippet
     */
    const modifyCodeSnippet = (value: string): string => {

        if (value.includes("${redirect_uri}")) {
            return value.replace("${redirect_uri}", deploymentConfig.customServerHost + "/commonauth");
        }

        return value;
    };

    const renderPreRequisites = (): ReactElement => {
        return (
            <Message
                type="info"
                header={ wizardHelp.message.header }
                content={
                    (<>
                        {
                            wizardHelp.message.paragraphs?.map((paragraph: string, index: number) => (
                                <p
                                    key={ index }
                                    dangerouslySetInnerHTML={ { __html: paragraph } }
                                />
                            ))
                        }
                        {
                            wizardHelp.message.copyInputFields?.map(
                                (copyInputField: { description: string; value: string; }, index: number) => (
                                    <p key={ index }>
                                        <div dangerouslySetInnerHTML={ { __html: copyInputField.description } } />
                                        <CopyInputField
                                            className="copy-input-dark spaced"
                                            value={ overrideFieldValue(copyInputField.value) }
                                        />
                                    </p>
                                )
                            )
                        }
                        <a
                            href={ wizardHelp.message.link?.url }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            { wizardHelp.message.link?.text }
                        </a>
                        {
                            wizardHelp.message.codeSnippets?.map(
                                (codeSnippet: { description: string; value: string; }, index: number) => (
                                    <p key={ index }>
                                        <div dangerouslySetInnerHTML={ { __html: codeSnippet.description } } />
                                        <Divider hidden />
                                        <CodeEditor
                                            oneLiner
                                            readOnly="nocursor"
                                            withClipboardCopy
                                            showLineNumbers={ false }
                                            language="shell"
                                            options={ {
                                                lineWrapping: true
                                            } }
                                            height="100%"
                                            theme="dark"
                                            sourceCode={ modifyCodeSnippet(codeSnippet.value) }
                                        />
                                    </p>
                                )
                            )
                        }
                    </>)
                }
            />
        );
    };

    return (
        <div data-testid={ testId }>
            { renderPreRequisites() }
            <Divider hidden/>
            {
                wizardHelp?.fields?.map((field: { fieldName: string, hint: string }, index: number) => (
                    <div key={ index }>
                        <Heading as="h5">{ field.fieldName }</Heading>
                        <p dangerouslySetInnerHTML={ { __html: field.hint } }/>
                        <Divider />
                    </div>
                ))
            }
        </div>
    );
};

/**
 * Default props for the component
 */
CreateConnectionWizardHelp.defaultProps = {
    "data-testid": "idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CreateConnectionWizardHelp;
