/**
 * Copyright (c) 2020, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmailTemplateManagementConstants } from "../constants";
import { getBrandingPreferences } from "../api";
import { BrandingPreference } from "../models";

/**
 * Interface for the email template editor props.
 */
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

    const { t } = useTranslation();

    const [ content, setContent ] = useState<string>("");
    const [ brandingPreferences, setBrandingPreferences ] = useState<BrandingPreference>(null);

    const updatedContent = useRef<string>("");
    const iframe = useRef<HTMLIFrameElement>();

    useEffect(() => {
        writeToIframe();
    }, [ updatedContent.current, brandingPreferences ]);

    useEffect(() => {
        if (isAddFlow && isSignature) {
            setContent(EmailTemplateManagementConstants.EMAIL_STARTER_TEMPLATE);
            updatedContent.current = EmailTemplateManagementConstants.EMAIL_STARTER_TEMPLATE;
        } else {
            setContent(htmlContent);
            updatedContent.current = htmlContent;
        }
    }, [ htmlContent ]);

    useEffect(() => {
        getBrandingPreferences()
            .then((response) => {
                if (response.status == 200) {
                    setBrandingPreferences(response.data["preference"]);
                }
            })
            .catch((error) => {
                // Handle Error.
            })
    }, [ ]);

    /**
     * Write content to iFrame.
     */
    const writeToIframe = (): void => {
        const iframeDoc = iframe?.current?.contentDocument || iframe?.current?.contentWindow?.document;
        if (iframeDoc) {
            /*
             * Trigger a page load in order to update the content
             * to the iframe document. This is a generic issue with firefox
             * which doesn't update content when the initial content is null in 
             * an iframe.
             * 
             * See also
             * {@link 
             * https://stackoverflow.com/questions/7828502/cannot-set-document-body-innerhtml-of-iframe-in-firefox}
             */
            iframeDoc.open();
            iframeDoc.close();
            iframeDoc.body.innerHTML = replaceBrandingPlaceholders(updatedContent.current, brandingPreferences);
        }
    };

    /**
     * Replace branding related placeholders in email templates.
     *
     * @param   {string} templateContent    - template content
     * @param   {string} brandingPreference - branding preference object
     * @return  {string}                    - preview content
     */
    const replaceBrandingPlaceholders = (
        templateContent: string,
        brandingPreference: BrandingPreference
    ): string => {

        const isBrandingEnabled:boolean = (brandingPreference != null && brandingPreference.configs.isBrandingEnabled);
        const theme:string = isBrandingEnabled ? brandingPreference.theme.activeTheme : "LIGHT";
        const primaryColor:string = isBrandingEnabled ? brandingPreference.theme[theme].colors.primary : "#FF5000";
        const backgroundColor:string = isBrandingEnabled ? brandingPreference.theme[theme].page.background.backgroundColor : "#F0F0F0";
        const font:string = isBrandingEnabled ? brandingPreference.theme[theme].typography.font.fontFamily : "Nunito Sans";
        const fontColor:string = isBrandingEnabled ? brandingPreference.theme[theme].page.font.color : "#333333";
        const buttonFontColot:string = isBrandingEnabled ? brandingPreference.theme[theme].buttons.primary.base.font.color : "#FFFFFF";
        
        const logoUrl:string = (isBrandingEnabled && brandingPreference.theme[theme].images.logo.imgURL)
                                ? brandingPreference.theme[theme].images.logo.imgURL
                                : "http://cdn.wso2.com/wso2/newsletter/images/nl-2017/wso2-logo-transparent.png";
        
        const altText:string = (isBrandingEnabled && brandingPreference.theme[theme].images.logo.altText)
                                ? brandingPreference.theme[theme].images.logo.altText
                                : "";
        
        const copyrightText:string = (isBrandingEnabled && brandingPreference.organizationDetails.copyrightText)
                                ? brandingPreference.organizationDetails.copyrightText
                                : "&#169; YYYY WSO2 LLC.".replace("YYYY", new Date().getFullYear().toString());
        
        return templateContent
                .replace(/\{\{organization.logo.img\}\}/g, logoUrl ? logoUrl : "http://cdn.wso2.com/wso2/newsletter/images/nl-2017/wso2-logo-transparent.png")
                .replace(/\{\{organization.logo.altText\}\}/g, altText ? altText : "")
                .replace(/\{\{organization.copyright.text\}\}/g, copyrightText)
                .replace(/\{\{organization.color.primary\}\}/g, primaryColor)
                .replace(/\{\{organization.color.background\}\}/g, backgroundColor)
                .replace(/\{\{organization.theme.background.color\}\}/g, theme === "LIGHT" ? "#FFFFFF" : "#181818")
                .replace(/\{\{organization.font\}\}/g, font)
                .replace(/\{\{organization.font.color\}\}/g, fontColor)
                .replace(/\{\{organization.button.font.color\}\}/g, buttonFontColot);

    };

    return (
        <div className={ "email-code-editor " + customClass } data-testid={ testId }>
            {
                isPreviewOnly
                    ? (
                        <div className="render-view" data-testid={ `${ testId }-preview-only-render-view` }>
                            <iframe
                                id="iframe"
                                ref={ (ref) => {
                                    iframe.current = ref;
                                    iframe.current && writeToIframe();
                                } }>
                                <p data-testid={ `${ testId }-iframe-unsupported-error` }>
                                    { t("console:manage.features.emailTemplates.notifications.iframeUnsupported" +
                                        ".genericError.description") }
                                </p>
                            </iframe>
                        </div>)
                    : (
                        <ResourceTab
                            onTabChange={ () => {
                                if (updateHtmlContent) {
                                    updateHtmlContent(updatedContent.current);
                                }
                            } }
                            defaultActiveTab={ isAddFlow ? 1 : 0 }
                            panes={ [
                                {
                                    menuItem: t("console:manage.features.emailTemplates.editor.tabs.preview.tabName"),
                                    render: () => (
                                        <ResourceTab.Pane
                                            className="render-view"
                                            attached={ false }
                                            data-testid="preview-tab-pane"
                                        >
                                            <iframe
                                                id="iframe"
                                                ref={ (ref) => {
                                                    iframe.current = ref;
                                                    iframe.current && writeToIframe();
                                                } }>
                                                <p data-testid={ `${ testId }-iframe-unsupported-error` }>
                                                    { t("console:manage.features.emailTemplates.notifications" +
                                                        ".iframeUnsupported.genericError.description") }
                                                </p>
                                            </iframe>
                                        </ResourceTab.Pane>
                                    )
                                },
                                {
                                    menuItem: t("console:manage.features.emailTemplates.editor.tabs.code.tabName"),
                                    render: () => (
                                        <ResourceTab.Pane
                                            attached={ false }
                                            data-testid="html-code-tab-pane"
                                        >
                                            <CodeEditor
                                                lint
                                                language="htmlmixed"
                                                sourceCode={ content }
                                                options={ {
                                                    lineWrapping: true
                                                } }
                                                onChange={ (editor, data, value) => {
                                                    updatedContent.current = value;
                                                } }
                                                onBlur={ () => {
                                                    if (updateHtmlContent) {
                                                        updateHtmlContent(updatedContent.current);
                                                    }
                                                } }
                                                readOnly={ isReadOnly }
                                                theme={ "dark" }
                                                data-testid={ `${ testId }-code-editor` }
                                            />
                                        </ResourceTab.Pane>
                                    )
                                }
                            ] }
                            data-testid={ `${ testId }-tabs` }
                        />
                    )
            }
        </div>
    );
};

/**
 * Default props for the component.
 */
EmailTemplateEditor.defaultProps = {
    "data-testid": "email-template-editor",
    isPreviewOnly: false
};
