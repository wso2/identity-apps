/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { ExtendedFeatureConfigInterface } from "@wso2is/admin.extensions.v1";
import { brandingConfig } from "@wso2is/admin.extensions.v1/configs/branding";
import { BrandingCustomLayoutContentInterface } from "@wso2is/common.branding.v1/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon, Segment } from "semantic-ui-react";
import {
    DEFAULT_LAYOUT_CSS_CONTENT,
    DEFAULT_LAYOUT_CSS_CONTENT_WITH_POLICY_PAGES,
    DEFAULT_LAYOUT_HTML_CONTENT,
    DEFAULT_LAYOUT_JS_CONTENT
} from "./data/default-content";
import { EditorViewTabs } from "./editor-view";
import useBrandingPreference from "../../hooks/use-branding-preference";
import { StickyTabPaneActionPanel } from "../sticky-tab-pane-action-panel";
import "./custom-page-editor.scss";

type CustomPageEditorInterface = IdentifiableComponentInterface;

export const CustomPageEditor: FunctionComponent<CustomPageEditorInterface> = ({
    [ "data-componentid" ]: componentId = "custom-page-editor"
}: CustomPageEditorInterface): ReactElement => {

    const { t } = useTranslation();

    const featureConfig: ExtendedFeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const hasBrandingUpdatePermissions: boolean = useRequiredScopes(featureConfig?.branding?.scopes?.update);

    const {
        setIsCustomLayoutEditorEnabled,
        preference: brandingPreference,
        updateBrandingCustomContent
    } = useBrandingPreference();

    const [ html, setHtml ] = useState<string>("");
    const [ css, setCss ] = useState<string>("");
    const [ js, setJs ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Effect to initialize the editor with the current custom content.
     */
    useEffect(() => {

        if (!brandingPreference?.preference) {
            return;
        }

        const content: BrandingCustomLayoutContentInterface | undefined =
            brandingPreference.preference.layout?.content;

        const isCustomContentConfigured: boolean = !!(content?.html || content?.css || content?.js);

        if (isCustomContentConfigured) {
            setHtml(content?.html ?? "");
            setCss(content?.css ?? "");
            setJs(content?.js ?? "");
        } else {
            setHtml(DEFAULT_LAYOUT_HTML_CONTENT);
            setCss(
                brandingConfig.usePolicyPagesInDefaultCustomContent
                    ? DEFAULT_LAYOUT_CSS_CONTENT_WITH_POLICY_PAGES
                    : DEFAULT_LAYOUT_CSS_CONTENT
            );
            setJs(DEFAULT_LAYOUT_JS_CONTENT);
        }
    }, [ brandingPreference ]);

    /**
     * Handles the save and publish button click event.
     */
    const handleSaveAndPublish = (): void => {

        setIsSubmitting(true);
        updateBrandingCustomContent({ css, html, js }, () => setIsSubmitting(false));
    };

    /**
     * Handles the back button click event to disable the custom layout editor.
     */
    const handleBackButtonClick = (): void => {
        setIsCustomLayoutEditorEnabled(false);
    };

    return (
        <div className="custom-page-editor">
            <div
                className = "back-button"
                data-componentid = { `${ componentId }-back-button` }
                onClick = { handleBackButtonClick }
            >
                <Icon name="arrow left"/>
                { t("branding:customPageEditor.backButton") }
            </div>
            <div className="main-container">
                <Segment className="editor-container">
                    <EditorViewTabs
                        html = { html }
                        setHtml = { setHtml }
                        css = { css }
                        setCss = { setCss }
                        js = { js }
                        setJs = { setJs }
                        readOnly = { !hasBrandingUpdatePermissions }
                    />
                    <StickyTabPaneActionPanel
                        formRef={ undefined }
                        saveButton={ {
                            "data-componentid": `${ componentId }-save-button`,
                            isDisabled: isSubmitting || !hasBrandingUpdatePermissions,
                            isLoading: isSubmitting,
                            onClick: handleSaveAndPublish,
                            readOnly: !hasBrandingUpdatePermissions
                        } }
                        data-componentid={ `${ componentId }-sticky-tab-action-panel` }
                    >
                    </StickyTabPaneActionPanel>
                </Segment>
            </div>
        </div>
    );
};
