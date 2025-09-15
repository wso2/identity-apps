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

import { CollisionPriority } from "@dnd-kit/abstract";
import Badge from "@mui/material/Badge";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import { Element, ElementCategories } from "../../../../models/elements";
import { EventTypes } from "../../../../models/extension";
import PluginRegistry from "../../../../plugins/plugin-registry";
import generateResourceId from "../../../../utils/generate-resource-id";
import Droppable from "../../../dnd/droppable";
import ReorderableElement from "../../steps/view/reorderable-element";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";
import "./form-adapter.scss";

/**
 * Props interface of {@link FormAdapter}
 */
export type FormAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Form component.
 *
 * @param props - Props injected to the component.
 * @returns The FormAdapter component.
 */
const FormAdapter: FunctionComponent<FormAdapterPropsInterface> = ({
    resource,
    stepId
}: FormAdapterPropsInterface): ReactElement => {
    const shouldShowFormFieldsPlaceholder: boolean = !resource?.components?.some(
        (element: Element) => element.category === ElementCategories.Field
    );

    return (
        <Badge
            anchorOrigin={ {
                horizontal: "left",
                vertical: "top"
            } }
            badgeContent="Form"
            className="adapter form-adapter"
        >
            <Droppable
                id={ generateResourceId(`${ VisualFlowConstants.FLOW_BUILDER_FORM_ID }_${ stepId }`) }
                data={ { droppedOn: resource, stepId } }
                collisionPriority={ CollisionPriority.High }
                type={ VisualFlowConstants.FLOW_BUILDER_DROPPABLE_FORM_ID }
                accept={ [
                    VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID,
                    ...VisualFlowConstants.FLOW_BUILDER_FORM_ALLOWED_RESOURCE_TYPES
                ] }
            >
                { shouldShowFormFieldsPlaceholder && (
                    <Box className="form-adapter-placeholder">
                        <Typography variant="body2">DROP FORM COMPONENTS HERE</Typography>
                    </Box>
                ) }
                { (resource?.components as any)?.map((component: Element, index: number) => PluginRegistry
                    .getInstance().executeSync(EventTypes.ON_NODE_ELEMENT_FILTER, component) && (
                    <ReorderableElement
                        key={ component.id }
                        id={ component.id }
                        index={ index }
                        element={ component }
                        className={ classNames("flow-builder-step-content-form-field") }
                        group={ resource.id }
                        type={ VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID }
                        accept={ [ VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID ] }
                    />
                )) }
            </Droppable>
        </Badge>
    );
};

export default FormAdapter;
