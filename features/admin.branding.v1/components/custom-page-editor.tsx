/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { BrandingPreferenceCustomContentInterface } from "@wso2is/common.branding.v1/models/branding-preferences";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FormPropsInterface } from "@wso2is/form/src/components/form";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useContext,
    useEffect,
    useRef,
    useState } from "react";
import { RouteComponentProps } from "react-router";
import { Segment } from "semantic-ui-react";
import { EditorViewTabs } from "./custom-page-editor/editor-view";
import { StickyTabPaneActionPanel } from "./sticky-tab-pane-action-panel";
import BrandingPreferenceContext from "../context/branding-preference-context";
import "./custom-page-editor.scss";

type CustomPageEditorPropsInterface = IdentifiableComponentInterface;

interface RouteParams {
    templateTypeId: string;
    templateId: string;
}

interface UpdatedContent {
    html: string;
    css: string;
    js: string;
}

interface CustomPageEditorInterface extends IdentifiableComponentInterface{
    /**
     * Component id for the component.
     */
    "data-componentid": string;
    /**
     * Is the form is loading.
     */
    isLoading: boolean;
    /**
     * Is the form in a submitting state.
     */
    isSubmitting: boolean;
    /**
     * Is the form read only.
     */
    readOnly: boolean;
}

const CustomPageEditorPageLayout: FunctionComponent<CustomPageEditorPropsInterface> = (
    props: CustomPageEditorInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { setCustomLayoutMode } = useContext(BrandingPreferenceContext);

    const handleBackButtonClick = (): void => {
        setCustomLayoutMode(false);
    };

    const { preference: brandingPreference } = useContext(BrandingPreferenceContext);
    const customContent: BrandingPreferenceCustomContentInterface =
        brandingPreference?.preference?.customContent?? {};

    const [ html, setHtml ] = useState("");
    const [ css, setCss ] = useState("");
    const [ js, setJs ] = useState("");

    useEffect(() => {
        setHtml(customContent.htmlContent ?? "");
        setCss(customContent.cssContent ?? "");
        setJs(customContent.jsContent ?? "");
    }, [ customContent ]);

    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const { updateBrandingCustomContent } = useContext(BrandingPreferenceContext);

    const handleSaveAndPublish = (): void => {
        updateBrandingCustomContent({
            cssContent: css,
            htmlContent: html,
            jsContent: js
        });
    };

    return (
        <div className="custom-page-editor">
            <div
                className = "back-button"
                data-componentid = { `${ componentId }-back-button` }
                onClick = { handleBackButtonClick }
            >
                <i aria-hidden="true" className="arrow left icon"></i>
                    Go back
            </div>
            <div className="main-container">
                <Segment className="editor-container">
                    <EditorViewTabs
                        html = { html }
                        css = { css }
                        js = { js }
                        onContentUpdate = { ( updated: UpdatedContent ) => {
                            setHtml(updated.html);
                            setCss(updated.css);
                            setJs(updated.js);
                        } }
                    />
                    <StickyTabPaneActionPanel
                        formRef={ formRef }
                        saveButton={ {
                            "data-componentid": `${ componentId }-save-button`,
                            isDisabled: false,
                            isLoading: false,
                            onClick: () => {
                                handleSaveAndPublish();
                            },
                            readOnly: false
                        } }
                        data-componentid={ `${ componentId }-sticky-tab-action-panel` }
                    >
                    </StickyTabPaneActionPanel>
                </Segment>
            </div>
        </div>
    );
};

/**
 * Default props for the component.
 */
CustomPageEditorPageLayout.defaultProps = {
    "data-componentid": "custom-page-editor"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CustomPageEditorPageLayout;
