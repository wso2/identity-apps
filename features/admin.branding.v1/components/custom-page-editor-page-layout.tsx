/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { RouteComponentProps } from "react-router";
import { EditorViewTabs } from "./custom-page-editor/editor-view";
import useCustomPageEditor from "../hooks/use-custom-page-editor";
import { Segment } from "semantic-ui-react";
import Select from '@oxygen-ui/react/Select';
import { MenuItem } from "@mui/material";
import Divider from '@oxygen-ui/react/Divider';
import { ArrowUpRightFromSquareIcon } from "@oxygen-ui/react-icons";

type CustomPageEditorPageLayoutPropsInterface = TestableComponentInterface;

interface RouteParams {
    templateTypeId: string;
    templateId: string;
}

const templateOptions = [
    { key: 'centered', value: 'centered', text: 'Centred' },
    { key: 'left', value: 'left', text: 'Left-aligned' },
    { key: 'right', value: 'right', text: 'Right-aligned' },
    { key: 'left-image', value: 'left-image', text: 'Left-image' },
    { key: 'right-image', value: 'right-image', text: 'Right-image' },
];

const CustomPageEditorPageLayout: FunctionComponent<CustomPageEditorPageLayoutPropsInterface> = (
    props: CustomPageEditorPageLayoutPropsInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const [template, setTemplate] = useState('centered');

    const {
        [ "data-testid" ]: testId
    } = props;

    const { customLayoutMode , setCustomLayoutMode } = useCustomPageEditor();

    const handleBackButtonClick = (): void => {
        setCustomLayoutMode(false);
    };

    const [html, setHtml] = useState("<div>Hello</div>");
    const [css, setCss] = useState("body { background: white; }");
    const [js, setJs] = useState("console.log('Hi');");

    const handleReset = () => {
        setHtml("<div>Hello</div>");
        setCss("body { background: white; }");
        setJs("console.log('Hi');");
    };

    return (
        <div>
            <div
                className="back-button"
                data-testid="user-mgt-edit-user-back-button"
                onClick={ handleBackButtonClick }
                style={ {
                    cursor: "pointer"
                } }
            >
                <i aria-hidden="true" className="arrow left icon"></i>
                    Go back
            </div>
            <div style={{ position: 'relative'}}>
                <div style={{ position: 'absolute', top: '0', right: '0', padding: '6px',zIndex: '5' }}>
                    <span style={{ marginRight: '1em' }}>Start With</span>
                    <Select
                        defaultValue={templateOptions[0].value}
                        variant="outlined"
                        onChange={ (event) => {
                            setTemplate(event.target.value as string);
                        } }
                        data-testid={ `${ testId }-template-select` }
                        style={{ marginRight: '1em' ,width: '200px', height: '40px'}}
                    >
                        {templateOptions.map((option) => (
                            <MenuItem key={option.key} value={option.value}>
                                {option.text}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="outlined">Preview <span className="ml-2"><ArrowUpRightFromSquareIcon /></span></Button>
                </div>
                <Segment style={{ paddingLeft: '0',paddingRight: '0'}}>
                    <EditorViewTabs
                        html={ html }
                        css={ css }
                        js={ js }
                        onContentUpdate={ (updated) => {
                            console.log("Updated content:", updated);
                        } }
                    />
                    <Divider/>
                    <div style={{ paddingLeft: '6px', paddingTop:'10px' }}>
                        <Button
                            variant="contained"
                            data-testid={ `${ testId }-save-button` }
                            onClick={ () => {
                                console.log("Save and publish clicked");
                            } }>
                            Save and Publish
                        </Button>
                        <Button
                            style={ { marginLeft: "4px" } }
                            color="secondary"
                            variant="contained"
                            onClick={handleReset}
                            data-testid={ `${ testId }-reset-button` }>
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
