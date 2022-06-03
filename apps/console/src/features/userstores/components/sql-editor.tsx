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

import { TestableComponentInterface } from "@wso2is/core/models";
import { CodeEditor, GenericIcon, Heading, LinkButton, PrimaryButton, Tooltip } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, Icon, Menu, Popup, Segment, Sidebar } from "semantic-ui-react";
import { getOperationIcons } from "../../core/configs";
import { RequiredBinary } from "../models";

interface SqlEditorPropsInterface extends TestableComponentInterface {
    onChange: (name: string, value: string) => void;
    properties: RequiredBinary[ "optional" ][ "sql" ];
    values: Map<string, string>;
}

/**
 * SQL Editor component.
 *
 * @param {SqlEditorPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SqlEditor: FunctionComponent<SqlEditorPropsInterface> = (
    props: SqlEditorPropsInterface
): ReactElement => {

    const {
        onChange,
        properties,
        values,
        [ "data-testid" ]: testId
    } = props;

    const [ sideBarVisible, setSideBarVisible ] = useState(true);
    const [ accordionIndex, setAccordionIndex ] = useState(-1);
    const [ propertyName, setPropertyName ] = useState("");
    const [ propertyDefaultValue, setPropertyDefaultValue ] = useState("");
    const [ propertyValue, setPropertyValue ] = useState("");
    const [ isEditorDarkMode, setIsEditorDarkMode ] = useState(true);
    const [ isResetButtonEnabled, setIsResetButtonEnabled ] = useState(false);

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
            data-testid={ `${ testId }-sidebar` }
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
                        data-testid={ `${ testId }-query-types-accordion` }
                    >
                        {
                            properties.insert.length > 0 && (
                                <Menu.Item>
                                    <Accordion.Title
                                        active={ accordionIndex === 0 }
                                        className="category-name"
                                        content={ t("console:manage.features.userstores.sqlEditor.create") }
                                        index={ accordionIndex }
                                        icon={ <Icon className="angle right caret-icon" /> }
                                        onClick={ () => setAccordionIndex(accordionIndex === 0 ? -1 : 0) }
                                        data-testid={ `${ testId }-insert-query-accordion-title` }
                                    />
                                    <Accordion.Content
                                        className="template-list"
                                        active={ accordionIndex === 0 }
                                        data-testid={ `${ testId }-insert-query-accordion-content` }
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
                                                    data-testid={ `${ testId }-insert-query` }
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
                                    content={ t("console:manage.features.userstores.sqlEditor.read") }
                                    index={ accordionIndex }
                                    icon={ <Icon className="angle right caret-icon" /> }
                                    onClick={ () => setAccordionIndex(accordionIndex === 1 ? -1 : 1) }
                                    data-testid={ `${ testId }-select-query-accordion-title` }
                                />
                                <Accordion.Content
                                    className="template-list"
                                    active={ accordionIndex === 1 }
                                    data-testid={ `${ testId }-select-query-accordion-content` }
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
                                                data-testid={ `${ testId }-select-query` }
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
                                    content={ t("console:manage.features.userstores.sqlEditor.update") }
                                    index={ accordionIndex }
                                    icon={ <Icon className="angle right caret-icon" /> }
                                    onClick={ () => setAccordionIndex(accordionIndex === 2 ? -1 : 2) }
                                    data-testid={ `${ testId }-update-query-accordion-title` }
                                />
                                <Accordion.Content
                                    className="template-list"
                                    active={ accordionIndex === 2 }
                                    data-testid={ `${ testId }-update-query-accordion-content` }
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
                                                data-testid={ `${ testId }-update-query` }
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
                                    content={ t("console:manage.features.userstores.sqlEditor.delete") }
                                    index={ accordionIndex }
                                    icon={ <Icon className="angle right caret-icon" /> }
                                    onClick={ () => setAccordionIndex(accordionIndex === 3 ? -1 : 3) }
                                    data-testid={ `${ testId }-delete-query-accordion-title` }
                                />
                                <Accordion.Content
                                    className="template-list"
                                    active={ accordionIndex === 3 }
                                    data-testid={ `${ testId }-delete-query-accordion-content` }
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
                                                data-testid={ `${ testId }-delete-query` }
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
        <div className="script-editor-with-template-panel">
            <Sidebar.Pushable className="script-editor-section">
                { editorSideBar() }
                <Sidebar.Pusher>
                    <div className="script-editor-container" ref={ editor }>
                        <Menu attached="top" className="action-panel" secondary>
                            <Menu.Menu position="left">
                                <Menu.Item
                                    onClick={
                                        () => setSideBarVisible(!sideBarVisible)
                                    }
                                    className="action hamburger ml-3"
                                    data-testid={ `${ testId }-sidebar-toggle` }
                                >
                                    <Icon name="bars"/>
                                </Menu.Item>
                            </Menu.Menu>
                            <Menu.Item className="action mr-3" position="right">
                                <Tooltip
                                    compact
                                    trigger={ (
                                        <div>
                                            <GenericIcon
                                                hoverable
                                                defaultIcon
                                                transparent
                                                size="micro"
                                                hoverType="rounded"
                                                icon={
                                                    isEditorDarkMode
                                                        ? getOperationIcons().lightMode
                                                        : getOperationIcons().darkMode
                                                }
                                                onClick={ () => setIsEditorDarkMode(!isEditorDarkMode) }
                                                data-testid={ `${ testId }-code-editor-theme-toggle` }
                                            />
                                        </div>
                                    ) }
                                    content={
                                        isEditorDarkMode
                                            ? t("common:lightMode")
                                            : t("common:darkMode")
                                    }
                                    size="mini"
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
                                    if (value !== propertyDefaultValue) {
                                        setIsResetButtonEnabled(true);
                                    } else {
                                        setIsResetButtonEnabled(false);
                                    }
                                } }
                                theme={ isEditorDarkMode ? "dark" : "light" }
                                data-testid={ `${ testId }-code-editor` }
                            />
                        </div>
                        <Menu attached="bottom" className="action-panel" secondary>
                            <Menu.Item position="right">
                                <LinkButton
                                    type="button"
                                    disabled= {!isResetButtonEnabled}
                                    onClick={ () => {
                                        setPropertyValue(propertyDefaultValue);
                                        const defaultValue = propertyDefaultValue;
                                        setPropertyDefaultValue("");
                                        setTimeout(() => {
                                            setPropertyDefaultValue(defaultValue);
                                            setIsResetButtonEnabled(false);
                                        }, 1);
                                    } }
                                    data-testid={ `${ testId }-reset-button` }
                                >
                                    { t("console:manage.features.userstores.sqlEditor.reset") }
                                </LinkButton>
                                <PrimaryButton
                                    type="button"
                                    onClick={ () => {
                                        onChange(propertyName, propertyValue);
                                    } }
                                    data-testid={ `${ testId }-save-button` }
                                >
                                    { t("common:save") }
                                </PrimaryButton>
                            </Menu.Item>
                        </Menu>
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
};

/**
 * Default props for the component.
 */
SqlEditor.defaultProps = {
    "data-testid": "sql-editor"
};
