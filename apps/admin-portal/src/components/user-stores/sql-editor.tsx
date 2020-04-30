/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { CodeEditor, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { Accordion, Checkbox, Icon, Menu, Popup, Segment, Sidebar } from "semantic-ui-react";
import { RequiredBinary } from "../../models";

interface SqlEditorPropsInterface {
    onChange: (name: string, value: string) => void;
    properties: RequiredBinary[ "optional" ][ "sql" ];
}

export const SqlEditor: FunctionComponent<SqlEditorPropsInterface> = (
    props: SqlEditorPropsInterface
): ReactElement => {

    const { onChange, properties } = props;

    const [ sideBarVisible, setSideBarVisible ] = useState(true);
    const [ accordionIndex, setAccordionIndex ] = useState(-1);
    const [ propertyName, setPropertyName ] = useState("");
    const [ propertyValue, setPropertyValue ] = useState("");
    const [ isEditorDarkMode, setIsEditorDarkMode ] = useState(true);

    const sidebar = useRef(null);
    const editor = useRef(null);

    /**
     * Triggered on `sideBarVisible` change.
     */
    useEffect(() => {
        let width = "100%";

        if (sideBarVisible) {
            width = `calc(100% - ${sidebar?.current?.ref?.current?.clientWidth}px)`;
        }

        editor.current.style.width = width;
    }, [ sideBarVisible ]);

    const EditorSideBar = (): ReactElement => (
        <Sidebar
            as={ Segment }
            className="script-templates-panel"
            animation="overlay"
            icon="labeled"
            direction="right"
            vertical
            secondary
            visible={ sideBarVisible }
            ref={ sidebar }
        >
            <Heading as="h6" bold>SQL Query Types</Heading>
            {
                (properties)
                && (
                    <Accordion
                        as={ Menu }
                        className="template-category-menu"
                        fluid
                        secondary
                        vertical
                    >
                        {
                            properties.insert.length > 0 && (
                                <Menu.Item>
                                    <Accordion.Title
                                        active={ accordionIndex === 0 }
                                        className="category-name"
                                        content="Create"
                                        index={ accordionIndex }
                                        icon={ <Icon className="angle right caret-icon" /> }
                                        onClick={ () => setAccordionIndex(accordionIndex === 0 ? -1 : 0) }
                                    />
                                    <Accordion.Content
                                        className="template-list"
                                        active={ accordionIndex === 0 }
                                    >
                                        {
                                            properties.insert.map((property, index) => (
                                                <Menu.Item
                                                    key={ index }
                                                    onClick={ () => {
                                                        setPropertyName(property.name);
                                                        setPropertyValue(property.value ?? property.defaultValue);
                                                    } }
                                                    active={ property.name === propertyName }
                                                >
                                                    <Popup
                                                        trigger={ (
                                                            <div className="template-name">
                                                                { property.name }
                                                            </div>
                                                        ) }
                                                        position="top center"
                                                        content={ property.name }
                                                        inverted
                                                    />
                                                </Menu.Item>
                                            ))
                                        }
                                    </Accordion.Content>
                                </Menu.Item>
                            )
                        }
                        { properties.select.length > 0 &&
                            (<Menu.Item>
                                <Accordion.Title
                                    active={ accordionIndex === 1 }
                                    className="category-name"
                                    content="Read"
                                    index={ accordionIndex }
                                    icon={ <Icon className="angle right caret-icon" /> }
                                    onClick={ () => setAccordionIndex(accordionIndex === 1 ? -1 : 1) }
                                />
                                <Accordion.Content
                                    className="template-list"
                                    active={ accordionIndex === 1 }
                                >
                                    {
                                        properties.select.map((property, index) => (
                                            <Menu.Item
                                                key={ index }
                                                onClick={ () => {
                                                    setPropertyName(property.name);
                                                    setPropertyValue(property.value ?? property.defaultValue);
                                                } }
                                                active={ property.name === propertyName }
                                            >
                                                <Popup
                                                    trigger={ (
                                                        <div className="template-name">
                                                            { property.name }
                                                        </div>
                                                    ) }
                                                    position="top center"
                                                    content={ property.name }
                                                    inverted
                                                />
                                            </Menu.Item>
                                        ))
                                    }
                                </Accordion.Content>
                            </Menu.Item>
                            ) }
                        { properties.update.length > 0 &&
                            (<Menu.Item>
                                <Accordion.Title
                                    active={ accordionIndex === 2 }
                                    className="category-name"
                                    content="Update"
                                    index={ accordionIndex }
                                    icon={ <Icon className="angle right caret-icon" /> }
                                    onClick={ () => setAccordionIndex(accordionIndex === 2 ? -1 : 2) }
                                />
                                <Accordion.Content
                                    className="template-list"
                                    active={ accordionIndex === 2 }
                                >
                                    {
                                        properties.update.map((property, index) => (
                                            <Menu.Item
                                                key={ index }
                                                onClick={ () => {
                                                    setPropertyName(property.name);
                                                    setPropertyValue(property.value ?? property.defaultValue);
                                                } }
                                                active={ property.name === propertyName }
                                            >
                                                <Popup
                                                    trigger={ (
                                                        <div className="template-name">
                                                            { property.name }
                                                        </div>
                                                    ) }
                                                    position="top center"
                                                    content={ property.name }
                                                    inverted
                                                />
                                            </Menu.Item>
                                        ))
                                    }
                                </Accordion.Content>
                            </Menu.Item>
                            ) }
                        { properties.delete.length > 0 &&
                            (<Menu.Item>
                                <Accordion.Title
                                    active={ accordionIndex === 3 }
                                    className="category-name"
                                    content="Delete"
                                    index={ accordionIndex }
                                    icon={ <Icon className="angle right caret-icon" /> }
                                    onClick={ () => setAccordionIndex(accordionIndex === 3 ? -1 : 3) }
                                />
                                <Accordion.Content
                                    className="template-list"
                                    active={ accordionIndex === 3 }
                                >
                                    {
                                        properties.delete.map((property, index) => (
                                            <Menu.Item
                                                key={ index }
                                                onClick={ () => {
                                                    setPropertyName(property.name);
                                                    setPropertyValue(property.value ?? property.defaultValue);
                                                } }
                                                active={ property.name === propertyName }
                                            >
                                                <Popup
                                                    trigger={ (
                                                        <div className="template-name">
                                                            { property.name }
                                                        </div>
                                                    ) }
                                                    position="top center"
                                                    content={ property.name }
                                                    inverted
                                                />
                                            </Menu.Item>
                                        ))
                                    }
                                </Accordion.Content>
                            </Menu.Item>
                            ) }
                    </Accordion>
                )
            }
        </Sidebar>
    );

    return (
        <div className="sign-on-methods-tab-content">
            <div className="adaptive-scripts-section">
                <Sidebar.Pushable className="script-editor-section" >
                    <EditorSideBar />
                    <Sidebar.Pusher>
                        <div className="script-editor-container" ref={ editor }>
                            <Menu attached="top" className="action-panel" secondary>
                                <Menu.Item>
                                    <Checkbox
                                        label="Dark mode"
                                        checked={ isEditorDarkMode }
                                        onChange={ () => { setIsEditorDarkMode(!isEditorDarkMode) } }
                                        slider
                                    />
                                </Menu.Item>
                                <Menu.Menu position="right">
                                    <Menu.Item
                                        onClick={
                                            () => setSideBarVisible(!sideBarVisible)
                                        }
                                        className="action"
                                    >
                                        <Icon name="bars" />
                                    </Menu.Item>
                                </Menu.Menu>
                            </Menu>

                            <div className="code-editor-wrapper">
                                <CodeEditor
                                    lint
                                    sourceCode={ propertyValue }
                                    options={ {
                                        lineWrapping: true,
                                        mode: "x-sql"
                                    } }
                                    onChange={ (editor, data, value) => {
                                        onChange(propertyName, value);
                                    } }
                                    theme={ isEditorDarkMode ? "dark" : "light" }
                                />
                            </div>
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable >
            </div>
        </div>
    )
}
