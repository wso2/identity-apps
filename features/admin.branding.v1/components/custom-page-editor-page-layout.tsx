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
import Divider from "@oxygen-ui/react/Divider";
import Select from "@oxygen-ui/react/Select";
import { ArrowUpRightFromSquareIcon } from "@oxygen-ui/react-icons";
import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Segment } from "semantic-ui-react";
import { EditorViewTabs } from "./custom-page-editor/editor-view";
import useCustomPageEditor from "../hooks/use-custom-page-editor";

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
    { key: "centered", text: "Centered", value: "centered" },
    { key: "left", text: "Left-aligned", value: "left" },
    { key: "right", text: "Right-aligned", value: "right" },
    { key: "left-image", text: "Left-image", value: "left-image" },
    { key: "right-image", text: "Right-image", value: "right-image" }
];

const CustomPageEditorPageLayout: FunctionComponent<CustomPageEditorPageLayoutPropsInterface> = (
    props: CustomPageEditorPageLayoutPropsInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const [ , setTemplate ] = useState("centered");

    const {
        [ "data-testid" ]: testId
    } = props;

    const { setCustomLayoutMode } = useCustomPageEditor();

    const handleBackButtonClick = (): void => {
        setCustomLayoutMode(false);
    };

    const [ html, setHtml ] = useState("<div>Hello</div>");
    const [ css, setCss ] = useState("body { background: white; }");
    const [ js, setJs ] = useState("console.log('Hi');");

    const handleReset = () => {
        setHtml("<div>Hello</div>");
        setCss("body { background: white; }");
        setJs("console.log('Hi');");
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
                <Segment style = { { paddingLeft: "0", paddingRight: "0" } }>
                    <EditorViewTabs
                        html = { html }
                        css = { css }
                        js = { js }
                        onContentUpdate = { ( updated: UpdatedContent ) => {
                            console.log("Updated content:", updated);
                        } }
                    />
                    <Divider/>
                    <div style = { { paddingLeft: "6px", paddingTop:"10px" } }>
                        <Button
                            variant = "contained"
                            data-testid = { `${ testId }-save-button` }
                            onClick = { () => {
                                console.log("Save and publish clicked");
                            } }>
                            Save and Publish
                        </Button>
                        <Button
                            style = { { marginLeft: "4px" } }
                            color = "secondary"
                            variant = "contained"
                            onClick = { handleReset }
                            data-testid = { `${ testId }-reset-button` }>
                            Reset to Default
                        </Button>
                    </div>
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
