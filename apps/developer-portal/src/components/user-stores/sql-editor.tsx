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

import { CodeEditor, Heading, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, Checkbox, Icon, Menu, Popup, Segment, Sidebar } from "semantic-ui-react";
import { RequiredBinary } from "../../models";

interface SqlEditorPropsInterface {
    onChange: (name: string, value: string) => void;
    properties: RequiredBinary[ "optional" ][ "sql" ];
    values: Map<string, string>;
}

export const SqlEditor: FunctionComponent<SqlEditorPropsInterface> = (
    props: SqlEditorPropsInterface
): ReactElement => {

    const { onChange, properties, values } = props;

    const [ sideBarVisible, setSideBarVisible ] = useState(true);
    const [ accordionIndex, setAccordionIndex ] = useState(-1);
    const [ propertyName, setPropertyName ] = useState("");
    const [ propertyDefaultValue, setPropertyDefaultValue ] = useState("");
    const [ propertyValue, setPropertyValue ] = useState("");
    const [ isEditorDarkMode, setIsEditorDarkMode ] = useState(true);

    const sidebar = useRef(null);
    const editor = useRef(null);

    const { t } = useTranslation();

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

    const editorSideBar = (): ReactElement => (
        <Sidebar
            as={ Segment }
            className="script-templates-panel"
            animation="overlay"
            icon="labeled"
            direction="left"
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
                                        content={ t("devPortal:components.userstores.sqlEditor.create") }
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
                                                        setPropertyValue(values.get(property.name));
                                                        setPropertyDefaultValue(values.get(property.name));
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
                                    content={ t("devPortal:components.userstores.sqlEditor.read") }
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
                                                    setPropertyValue(values.get(property.name));
                                                    setPropertyDefaultValue(values.get(property.name));
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
                                    content={ t("devPortal:components.userstores.sqlEditor.update") }
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
                                                    setPropertyValue(values.get(property.name));
                                                    setPropertyDefaultValue(values.get(property.name));
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
                            </Menu.Item>)
                        }
                        { properties.delete.length > 0 &&
                            (<Menu.Item>
                                <Accordion.Title
                                    active={ accordionIndex === 3 }
                                    className="category-name"
                                    content={ t("devPortal:components.userstores.sqlEditor.delete") }
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
                                                    setPropertyValue(values.get(property.name));
                                                    setPropertyDefaultValue(values.get(property.name));
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
                    { editorSideBar() }
                    <Sidebar.Pusher>
                        <div className="script-editor-container" ref={ editor }>
                            <Menu attached="top" className="action-panel" secondary>
                                <Menu.Menu position="left">
                                    <Menu.Item
                                        onClick={
                                            () => setSideBarVisible(!sideBarVisible)
                                        }
                                        className="action"
                                    >
                                        <Icon name="bars" />
                                    </Menu.Item>
                                </Menu.Menu>
                                <Menu.Item position="right">
                                    <Checkbox
                                        label={ t("devPortal:components.userstores.sqlEditor.darkMode") }
                                        checked={ isEditorDarkMode }
                                        onChange={ () => { setIsEditorDarkMode(!isEditorDarkMode) } }
                                        slider
                                    />
                                </Menu.Item>
                            </Menu>
                            <div className="code-editor-wrapper">
                                <CodeEditor
                                    lint
                                    sourceCode={ propertyDefaultValue }
                                    options={ {
                                        lineWrapping: true,
                                        mode: "text/x-sql"
                                    } }
                                    showLineNumbers={ false }
                                    onChange={ (editor, data, value) => {
                                        setPropertyValue(value);
                                    } }
                                    theme={ isEditorDarkMode ? "dark" : "light" }
                                />
                            </div>
                            <Menu attached="bottom" className="action-panel" secondary>
                                <Menu.Item position="right">
                                    <LinkButton
                                        type="button"
                                        onClick={ () => {
                                            setPropertyValue(propertyDefaultValue);
                                            const defaultValue = propertyDefaultValue;
                                            setPropertyDefaultValue("");
                                            setTimeout(() => {
                                                setPropertyDefaultValue(defaultValue);
                                            }, 1);
                                        } }
                                    >
                                        { t("devPortal:components.userstores.sqlEditor.reset") }
                                    </LinkButton>
                                    <PrimaryButton
                                        type="button"
                                        onClick={ () => {
                                            onChange(propertyName, propertyValue);
                                        } }
                                    >
                                        { t("common:save") }
                                    </PrimaryButton>
                                </Menu.Item>
                            </Menu>
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable >
            </div>
        </div>
    )
}
