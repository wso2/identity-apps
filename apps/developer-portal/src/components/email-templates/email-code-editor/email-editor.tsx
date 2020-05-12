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
import { CodeEditor, ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { EMAIL_STARTER_TEMPLATE } from "../../../constants";

interface EmailTemplateEditorPropsInterface extends TestableComponentInterface {
    htmlContent: string;
    isReadOnly: boolean;
    isPreviewOnly?: boolean;
    customClass?: string;
    isAddFlow: boolean;
    isSignature: boolean;
    updateHtmlContent?: (value) => void;
}

/**
 * Util component to handle email template editing functionality and 
 * rendering the html content on an Iframe.
 * 
 * @param {EmailTemplateEditorPropsInterface} props - props required to edit email template.
 *
 * @return {React.ReactElement}
 */
export const EmailTemplateEditor: FunctionComponent<EmailTemplateEditorPropsInterface> = (
    props: EmailTemplateEditorPropsInterface
): ReactElement => {

    const {
        htmlContent,
        isReadOnly,
        updateHtmlContent,
        customClass,
        isPreviewOnly,
        isAddFlow,
        isSignature,
        [ "data-testid" ]: testId
    } = props;

    const [ content, setContent ] = useState<string>("");

    useEffect(() => {
        if (isAddFlow && isSignature) {
            setContent(EMAIL_STARTER_TEMPLATE);
        } else {
            setContent(htmlContent);
        }
    }, [htmlContent]);

    return (
        <div className={ "email-code-editor " + customClass } data-testid={ testId }>
            {
                isPreviewOnly ? 
                    <div className="render-view" data-testid={ `${ testId }-preview-only-render-view` }>
                        <iframe id="iframe" srcDoc={ content }>
                            <p data-testid={ `${ testId }-iframe-unsupported-error` }>
                                Your browser does not support iframes.
                            </p>
                        </iframe>
                    </div>
                :
                    <ResourceTab
                        defaultActiveTab={ isAddFlow ? 1 : 0  }
                        panes={ [
                            {
                                menuItem: "Preview",
                                render: () => (
                                    <ResourceTab.Pane
                                        className="render-view"
                                        attached={ false }
                                        data-testid={ `${ testId }-render-view` }
                                    >
                                        <iframe id="iframe" srcDoc={ content }>
                                            <p data-testid={ `${ testId }-iframe-unsupported-error` }>
                                                Your browser does not support iframes.
                                            </p>
                                        </iframe>
                                    </ResourceTab.Pane>
                                )
                            },
                            {
                                menuItem: "HTML Code",
                                render: () => (
                                    <ResourceTab.Pane attached={ false }>
                                        <CodeEditor
                                            lint
                                            language="htmlmixed"
                                            sourceCode={ content }
                                            options={ {
                                                lineWrapping: true
                                            } }
                                            onChange={ (editor, data, value) => {
                                                if (updateHtmlContent) {
                                                    updateHtmlContent(value);
                                                }
                                            } }
                                            readOnly={ isReadOnly }
                                            theme={  "dark" }
                                            data-testid={ `${ testId }-code-editor` }
                                        />
                                    </ResourceTab.Pane>
                                )
                            }
                        ] }
                        data-testid={ `${ testId }-tabs` }
                    />
            }
        </div>
    )
};

/**
 * Default props for the component.
 */
EmailTemplateEditor.defaultProps = {
    "data-testid": "email-template-editor",
    isPreviewOnly: false
};
