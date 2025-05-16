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

import { MenuItem } from "@mui/material";
import Button from "@oxygen-ui/react/Button";
import Select from "@oxygen-ui/react/Select";
import { ArrowUpRightFromSquareIcon } from "@oxygen-ui/react-icons";
import { BrandingPreferenceCustomContentInterface } from "@wso2is/common.branding.v1/models/branding-preferences";
import { IdentifiableComponentInterface, TestableComponentInterface} from "@wso2is/core/models";
import { FormPropsInterface } from "@wso2is/form/src/components/form";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useContext,
    useEffect,
    useRef,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import { Segment } from "semantic-ui-react";
import { EditorViewTabs } from "./custom-page-editor/editor-view";
import { StickyTabPaneActionPanel } from "./sticky-tab-pane-action-panel";
import BrandingPreferenceContext from "../context/branding-preference-context";
import useCustomPageEditor from "../hooks/use-custom-page-editor";
import { PredefinedLayouts } from "../meta/layouts";

type CustomPageEditorPageLayoutPropsInterface = TestableComponentInterface;

interface RouteParams {
    templateTypeId: string;
    templateId: string;
}

interface TemplateOptions {
    key: string;
    value: string;
    text: string;
}

interface UpdatedContent {
    html: string;
    css: string;
    js: string;
}

const templateOptions: TemplateOptions[] = [
    { key: PredefinedLayouts.CENTERED, text: "Centered", value: PredefinedLayouts.CENTERED },
    { key: "left", text: "Left-aligned", value: "left" },
    { key: "right", text: "Right-aligned", value: "right" },
    { key: "left-image", text: "Left-image", value: "left-image" },
    { key: "right-image", text: "Right-image", value: "right-image" }
];

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

    const [ , setTemplate ] = useState("centered");

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

    const handleReset = () => {
        setHtml("");
        setCss("");
        setJs("");
    };

    const { t } = useTranslation();

    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const { updateBrandingCustomContent } = useContext(BrandingPreferenceContext);

    const handleSaveAndPublish = (): void => {
        // TODO: Implement save logic (API call or context update)
        console.log("Saving...");
        console.log("HTML:", html);
        console.log("CSS:", css);
        console.log("JS:", js);
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
                <div style = { { padding: "6px", position: "absolute", right: "0", top: "0",zIndex: "5" } }>
                    <span style = { { marginRight: "1em" } }> Start With </span>
                    <Select
                        defaultValue = { templateOptions[0].value }
                        variant = "outlined"
                        onChange = { ( event: React.ChangeEvent<HTMLInputElement> ) => {
                            setTemplate(event.target.value as string);
                        } }
                        data-testid = { `${ testId }-template-select` }
                        style = { { height: "40px", marginRight: "1em" ,width: "200px" } }
                    >
                        { templateOptions.map(( option: TemplateOptions ) => (
                            <MenuItem key = { option.key } value = { option.value }>
                                { option.text }
                            </MenuItem>
                        ))
                        }
                    </Select>
                    <Button variant = "outlined">
                        Preview
                        <span className = "ml-2">
                            <ArrowUpRightFromSquareIcon />
                        </span>
                    </Button>
                </div>
                <Segment style = { { paddingLeft: "0", paddingRight: "0", paddingBottom: "0" } }>
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
                        <Button
                            onClick={ () =>  {
                                handleReset();
                                console.log("Reset all button clicked");
                            } }
                        >
                            { t("branding:form.actions.resetAll") }
                        </Button>
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
