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

import Badge from "@mui/material/Badge";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useNodeId } from "@xyflow/react";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import { Element, ElementCategories } from "../../../../models/elements";
import Droppable from "../../../dnd/droppable";
import ReorderableElement from "../../steps/view/reorderable-element";
import Box from "@oxygen-ui/react/Box";
import { CollisionPriority } from "@dnd-kit/abstract";
import "./form-adapter.scss";

/**
 * Props interface of {@link FormAdapter}
 */
export interface FormAdapterPropsInterface extends IdentifiableComponentInterface {
    /**
     * The flow id of the resource.
     */
    resourceId: string;
    /**
     * The resource properties.
     */
    resource: Element;
}

/**
 * Adapter for the Form component.
 *
 * @param props - Props injected to the component.
 * @returns The FormAdapter component.
 */
export const FormAdapter: FunctionComponent<FormAdapterPropsInterface> = ({
    resource
}: FormAdapterPropsInterface): ReactElement => {
    const nodeId: string = useNodeId();

    const shouldShowFormFieldsPlaceholder: boolean = !resource?.components?.some((element: Element) => element.category === ElementCategories.Field);

    return (
            <Badge
                anchorOrigin={ {
                    horizontal: "left",
                    vertical: "top"
                } }
                badgeContent="Form"
                className="adapter form-adapter"
            >
                        <Droppable id={ VisualFlowConstants.FLOW_BUILDER_FORM_ID } data={ { nodeId, resource } } collisionPriority={ CollisionPriority.High }>
                { shouldShowFormFieldsPlaceholder && (
                    <Box className="form-adapter-placeholder">
                        <Typography variant="body2">DROP FORM FIELDS HERE</Typography>
                    </Box>
                ) }
                { (resource?.components as any)?.map((component: Element, index: number) => (
                    <ReorderableElement
                        key={ component.id }
                        id={  component.id }
                        index={ index }
                        element={ component }
                        className={ classNames(
                            "flow-builder-step-content-form-field"
                        ) }
                        group={ resource.id }
                        type={ component.id }
                        accept={ [component.id ]}
                    />
                )) }
        </Droppable>
            </Badge>
    );
};

export default FormAdapter;
