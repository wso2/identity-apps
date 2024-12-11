/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import PropTypes from "prop-types";
import React from "react";
import ButtonFieldAdapter from "./adapters/button-field-adapter";
import Field from "./field";
import Form from "./form";

const DynamicContent = ({ content, handleRequestBody }) => {
    const renderedElementIds = new Set();

    const renderBlock = (block) => {
        if (!block) return null;

        const blockElements = block.nodes
            .map((nodeId) => {
                const element = content.elements.find((el) => el.id === nodeId);

                if (element && !renderedElementIds.has(element.id)) {
                    renderedElementIds.add(element.id);

                    return element;
                }

                return null;
            })
            .filter(Boolean);

        if (blockElements.length > 0) {
            return (
                <Form
                    key={ block.id }
                    formSchema={ blockElements }
                    onSubmit={ (action, formValues) => handleRequestBody(action, formValues) }
                />
            );
        }

        return null;
    };

    // Render all elements
    const renderElements = () => {
        return content.elements.map((element, index) => {
            // Render DISPLAY elements
            if (element.category === "DISPLAY" && !renderedElementIds.has(element.id)) {
                renderedElementIds.add(element.id);

                return <Field key={ element.id } component={ element } />;
            }

            // Render BLOCK elements
            const block = content.blocks.find((blk) => blk.nodes.includes(element.id));

            if (block && !renderedElementIds.has(element.id)) {
                return renderBlock(block);
            }

            // Render ACTION elements that are not bound to any block
            if (
                element.category === "ACTION" &&
                !renderedElementIds.has(element.id)
            ) {
                renderedElementIds.add(element.id);

                if (!element) {
                    return null;
                }

                return (
                    <ButtonFieldAdapter
                        key={ index }
                        component={ element }
                        handleButtonAction={ handleRequestBody }
                    />
                );
            }

            return null;
        });
    };

    return <>{ renderElements() }</>;
};

DynamicContent.propTypes = {
    content: PropTypes.shape({
        blocks: PropTypes.array.isRequired,
        elements: PropTypes.array.isRequired
    }).isRequired,
    handleRequestBody: PropTypes.func.isRequired
};

export default DynamicContent;
