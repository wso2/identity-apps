/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Heading, Tooltip } from "@wso2is/react-components";
import sortBy from "lodash-es/sortBy";
import React, {
    FunctionComponent,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    forwardRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Accordion, Icon, Menu, Popup, Segment, Sidebar } from "semantic-ui-react";
import { TemplateDescription } from "./template-description";
import { AdaptiveAuthTemplateInterface } from "../../../../models";

/**
 * Component ref type.
 */
export type ScriptTemplatesSidePanelRefType = HTMLDivElement;

/**
 * Proptypes for the adaptive scripts component.
 */
interface ScriptTemplatesSidePanelInterface extends TestableComponentInterface {
    /**
     * Fired on template selection.
     * @param {AdaptiveAuthTemplateInterface} template -Auth template.
     */
    onTemplateSelect: (template: AdaptiveAuthTemplateInterface) => void;
    /**
     * Adaptive script templates.
     */
    templates: any;
    /**
     * Side panel title.
     */
    title?: ReactNode;
    /**
     * Initial activeIndexes value.
     */
    defaultActiveIndexes?: number[];
    /**
     * Should the side panel be visible.
     */
    visible?: boolean;
    /**
     * Ref for the component.
     */
    ref?: React.Ref<ScriptTemplatesSidePanelRefType>;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Adaptive script templates side panel.
 *
 * @param {ScriptTemplatesSidePanelInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const ScriptTemplatesSidePanel: FunctionComponent<ScriptTemplatesSidePanelInterface> =
    forwardRef<ScriptTemplatesSidePanelRefType, ScriptTemplatesSidePanelInterface>((
        props: PropsWithChildren<ScriptTemplatesSidePanelInterface>,
        ref: MutableRefObject<ScriptTemplatesSidePanelRefType>
    ): ReactElement => {

        const {
            defaultActiveIndexes,
            onTemplateSelect,
            templates,
            title,
            visible,
            readOnly,
            [ "data-testid" ]: testId
        } = props;

        const { t } = useTranslation();

        const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>(defaultActiveIndexes);
        const [
            selectedTemplate,
            setSelectedTemplate
        ] = useState<AdaptiveAuthTemplateInterface>(null);

        /**
         * Handles accordion title click.
         *
         * @param {React.SyntheticEvent} e - Click event.
         * @param {number} index - Clicked on index.
         */
        const handleAccordionOnClick = (e: SyntheticEvent, { index }: { index: number }): void => {
            const newIndexes = [ ...accordionActiveIndexes ];

            if (newIndexes.includes(index)) {
                const removingIndex = newIndexes.indexOf(index);

                newIndexes.splice(removingIndex, 1);
            } else {
                newIndexes.push(index);
            }

            setAccordionActiveIndexes(newIndexes);
        };

        /**
         * Closes the template description modal
         */
        const closeTemplateDescriptionModal = (): void => {
            setSelectedTemplate(null);
        };

        return (
            <>
                {
                    selectedTemplate &&
                    (
                        <TemplateDescription
                            template={ selectedTemplate }
                            open={ !!selectedTemplate }
                            onClose={ closeTemplateDescriptionModal }
                        />
                    )
                }
                <Sidebar
                    as={ Segment }
                    ref={ ref as any }
                    className="script-templates-panel"
                    animation="overlay"
                    icon="labeled"
                    direction="right"
                    vertical
                    secondary
                    visible={ visible }
                    data-testid={ testId }
                >
                    { title && typeof title === "string" ? <Heading as="h6" bold>{ title }</Heading> : title }
                    {
                        (templates && templates instanceof Array && templates.length > 0)
                            ? (
                                <Accordion
                                    as={ Menu }
                                    className="template-category-menu"
                                    data-testid={ `${testId}-accordion` }
                                    fluid
                                    secondary
                                    vertical
                                >
                                    {
                                        sortBy(templates, "order").map((category, index) => (
                                            category?.templates && category.templates instanceof Array && (
                                                <Menu.Item key={ index }>
                                                    <Accordion.Title
                                                        active={ accordionActiveIndexes.includes(index) }
                                                        className="category-name"
                                                        content={ category.displayName }
                                                        index={ index }
                                                        icon={ <Icon className="angle right caret-icon" /> }
                                                        onClick={ handleAccordionOnClick }
                                                        data-testid={ `${testId}-accordion-title-${index}` }
                                                    />
                                                    <Accordion.Content
                                                        className="template-list"
                                                        active={ accordionActiveIndexes.includes(index) }
                                                        data-testid={ `${testId}-accordion-content-${index}` }
                                                    >
                                                        {
                                                            category.templates.map((template, index) => (
                                                                <Menu.Item
                                                                    key={ index }
                                                                    className="template-list-item"
                                                                    data-componentid={ template.name }
                                                                >
                                                                    <Popup
                                                                        trigger={ (
                                                                            <div className="template-name">
                                                                                { template.name }
                                                                            </div>
                                                                        ) }
                                                                        content={ template.title || template.name }
                                                                    />
                                                                    <div className="actions">
                                                                        <Tooltip
                                                                            compact
                                                                            trigger={ (
                                                                                <Icon
                                                                                    className="add-button"
                                                                                    name="info circle"
                                                                                    onClick={ () => {
                                                                                        setSelectedTemplate(template);
                                                                                    } }
                                                                                    data-componentid={
                                                                                        `${ template.name }-info`
                                                                                    }
                                                                                />
                                                                            ) }
                                                                            content={
                                                                                t("console:develop.features" +
                                                                                    ".applications" +
                                                                                    ".edit.sections.signOnMethod." +
                                                                                    "sections.templateDescription" +
                                                                                    ".popupContent")
                                                                            }
                                                                        />
                                                                        {
                                                                            !readOnly && (
                                                                                <Tooltip
                                                                                    compact
                                                                                    trigger={ (
                                                                                        <Icon
                                                                                            className="add-button"
                                                                                            name="add"
                                                                                            onClick={
                                                                                                () => onTemplateSelect(
                                                                                                    template
                                                                                                )
                                                                                            }
                                                                                            data-componentid={
                                                                                                `${ template.name }-add`
                                                                                            }
                                                                                        />
                                                                                    ) }
                                                                                    content={ t("common:add") }
                                                                                />
                                                                            )
                                                                        }
                                                                    </div>
                                                                </Menu.Item>
                                                            ))
                                                        }
                                                    </Accordion.Content>
                                                </Menu.Item>
                                            ))
                                        )
                                    }
                                </Accordion>
                            )
                            : null
                    }
                </Sidebar>
            </>
        );
    });

/**
 * Default props for the script templates side panel component.
 */
ScriptTemplatesSidePanel.defaultProps = {
    "data-testid": "script-templates-side-panel",
    defaultActiveIndexes: [ -1 ],
    visible: false
};
