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
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
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
import useCustomPageEditor from "../hooks/use-custom-page-editor";

type CustomPageEditorPageLayoutPropsInterface = TestableComponentInterface;

interface RouteParams {
    templateTypeId: string;
    templateId: string;
}

interface UpdatedContent {
    html: string;
    css: string;
    js: string;
}

interface CustomPageEditorPageLayoutInterface extends IdentifiableComponentInterface{
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

const CustomPageEditorPageLayout: FunctionComponent<CustomPageEditorPageLayoutPropsInterface> = (
    props: CustomPageEditorPageLayoutPropsInterface &
    CustomPageEditorPageLayoutInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { setCustomLayoutMode } = useCustomPageEditor();

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
        <div>
            <div
                className = "back-button"
                data-testid = "user-mgt-edit-user-back-button"
                onClick = { handleBackButtonClick }
                style = { {
                    cursor: "pointer"
                } }
            >
                <i aria-hidden="true" className="arrow left icon"></i>
                    Go back
            </div>
            <div style = { { position: "relative" } }>
                <Segment style = { { paddingBottom: "0", paddingLeft: "0", paddingRight: "0" } }>
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
                            "data-testid": `${ testId }-save-button`,
                            isDisabled: false,
                            isLoading: false,
                            onClick: () => {
                                handleSaveAndPublish();
                            },
                            readOnly: false
                        } }
                        data-componentid="sticky-tab-action-panel"
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
    "data-testid": "layout-editor-page-layout"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CustomPageEditorPageLayout;
