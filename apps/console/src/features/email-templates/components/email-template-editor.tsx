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
import { getBrandingPreferences } from "../api";
import { EmailTemplateManagementConstants } from "../constants";
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
            });
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

        let theme:string;
        let primaryColor:string;
        let backgroundColor:string;
        let font:string;
        let fontColor:string;
        let buttonFontColot:string;
        let logoUrl:string;
        let altText:string;
        let copyrightText:string;
        let themeBackgroundColor:string;

        if (isBrandingEnabled) {
            theme               = brandingPreference.theme.activeTheme;
            primaryColor        = brandingPreference.theme[theme].colors.primary;
            backgroundColor     = brandingPreference.theme[theme].page.background.backgroundColor;
            font                = brandingPreference.theme[theme].typography.font.fontFamily;
            fontColor           = brandingPreference.theme[theme].page.font.color;
            buttonFontColot     = brandingPreference.theme[theme].buttons.primary.base.font.color;
            logoUrl             = (brandingPreference.theme[theme].images.logo.imgURL)
                                ? brandingPreference.theme[theme].images.logo.imgURL
                                : EmailTemplateManagementConstants.DEFAULT_BRANDING_LOGO_URL;
            altText             = (brandingPreference.theme[theme].images.logo.altText)
                                ? brandingPreference.theme[theme].images.logo.altText
                                : "";
            copyrightText       = (brandingPreference.organizationDetails.copyrightText)
                                ? brandingPreference.organizationDetails.copyrightText
                                : EmailTemplateManagementConstants.DEFAULT_BRANDING_COPYRIGHT_TEXT.replace("YYYY", new Date().getFullYear().toString());
        } else {
            theme               = EmailTemplateManagementConstants.DEFAULT_BRANDING_ACTIVE_THEME;
            primaryColor        = EmailTemplateManagementConstants.DEFAULT_BRANDING_PRIMRY_COLOR;
            backgroundColor     = EmailTemplateManagementConstants.DEFAULT_BRANDING_BACKGROUND_COLOR;
            font                = EmailTemplateManagementConstants.DEFAULT_BRANDING_FONT;
            fontColor           = EmailTemplateManagementConstants.DEFAULT_BRANDING_FONT_COLOR;
            buttonFontColot     = EmailTemplateManagementConstants.DEFAULT_BRANDING_BUTTON_FONT_COLOR;
            logoUrl             = EmailTemplateManagementConstants.DEFAULT_BRANDING_LOGO_URL;
            altText             = "";
            copyrightText       = EmailTemplateManagementConstants.DEFAULT_BRANDING_COPYRIGHT_TEXT.replace("YYYY", new Date().getFullYear().toString());
        }
        themeBackgroundColor    = theme === EmailTemplateManagementConstants.DEFAULT_BRANDING_ACTIVE_THEME
                                ? EmailTemplateManagementConstants.DEFAULT_BRANDING_LIGHT_THEMED_BACKGROUND_COLOR
                                : EmailTemplateManagementConstants.DEFAULT_BRANDING_DARK_THEMED_BACKGROUND_COLOR;
        
        return templateContent
                .replace(/\{\{organization.logo.img\}\}/g, logoUrl)
                .replace(/\{\{organization.logo.altText\}\}/g, altText)
                .replace(/\{\{organization.copyright.text\}\}/g, copyrightText)
                .replace(/\{\{organization.color.primary\}\}/g, primaryColor)
                .replace(/\{\{organization.color.background\}\}/g, backgroundColor)
                .replace(/\{\{organization.theme.background.color\}\}/g, themeBackgroundColor)
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
