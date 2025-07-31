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

import Box, { BoxProps } from "@oxygen-ui/react/Box";
import { GetDragItemProps } from "@oxygen-ui/react/dnd";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useNodeId } from "@xyflow/react";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, MutableRefObject, ReactElement, SVGProps, useRef } from "react";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import useComponentDelete from "../../../../hooks/use-component-delete";
import { Element } from "../../../../models/elements";
import { EventTypes } from "../../../../models/extension";
import PluginRegistry from "../../../../plugins/plugin-registry";
import Handle from "../../../dnd/handle";
import Sortable, { SortableProps } from "../../../dnd/sortable";

/**
 * Props interface of {@link ReorderableElement}
 */
export interface ReorderableComponentPropsInterface
    extends IdentifiableComponentInterface,
        Omit<SortableProps, "element">,
        Omit<BoxProps, "children" | "id"> {
    /**
     * The element to be rendered.
     */
    element: Element;
    /**
     * Additional props needed for the draggable functionality.
     */
    draggableProps?: Partial<GetDragItemProps>;
}

const PencilIcon = ({ width = 16, height = 16 }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg width={ width } height={ height } viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            // eslint-disable-next-line max-len
            d="M5.50798 2.41372C5.6738 2.20686 5.64052 1.90477 5.43361 1.73898C5.22676 1.5732 4.92468 1.60648 4.75892 1.81334L5.50798 2.41372ZM1.35873 6.82331L1.72227 7.13672C1.72602 7.13237 1.72968 7.12795 1.73328 7.12347L1.35873 6.82331ZM1.24929 7.09083L0.770222 7.05954L0.7698 7.06863L1.24929 7.09083ZM1.15969 9.02556L0.6802 9.00335C0.679099 9.02715 0.679771 9.05103 0.682222 9.07477L1.15969 9.02556ZM1.66337 9.46524L1.67906 9.94498C1.71107 9.94389 1.74289 9.93967 1.77406 9.93224L1.66337 9.46524ZM3.58337 9.0102L3.69409 9.47727L3.70151 9.47541L3.58337 9.0102ZM3.82977 8.85403L4.20007 9.15951L4.20423 9.15432L3.82977 8.85403ZM8.06983 4.33384C8.23566 4.12699 8.20244 3.82492 7.99566 3.65907C7.78887 3.49322 7.48673 3.52643 7.3209 3.73327L8.06983 4.33384ZM4.7609 1.81322C4.59508 2.02002 4.62823 2.32212 4.83508 2.48798C5.04186 2.65384 5.34394 2.62065 5.50983 2.41385L4.7609 1.81322ZM6.15169 0.84633L6.52615 1.14665C6.53242 1.13878 6.5385 1.13072 6.54433 1.12247L6.15169 0.84633ZM7.19425 0.64153L7.50132 0.272608C7.48602 0.259885 7.46996 0.248128 7.45326 0.237395L7.19425 0.64153ZM8.62593 1.83321L8.96564 1.49411C8.95521 1.48367 8.94433 1.47373 8.933 1.46429L8.62593 1.83321ZM8.62017 2.88153L8.28417 2.53872C8.2706 2.55206 8.2578 2.56619 8.24583 2.58104L8.62017 2.88153ZM7.3209 3.73327C7.15495 3.93999 7.18817 4.24188 7.39489 4.40783C7.60161 4.57378 7.90388 4.54056 8.06983 4.33384L7.3209 3.73327ZM5.61006 2.0424C5.57076 1.78023 5.32641 1.59955 5.06426 1.63884C4.80206 1.67812 4.62138 1.9225 4.66068 2.18467L5.61006 2.0424ZM7.76001 4.50914C8.02266 4.47349 8.20666 4.23157 8.17102 3.96892C8.1353 3.70622 7.89345 3.52221 7.63073 3.5579L7.76001 4.50914ZM4.75892 1.81334L0.984181 6.52309L1.73328 7.12347L5.50798 2.41372L4.75892 1.81334ZM0.995189 6.50984C0.862478 6.66376 0.783451 6.85672 0.770222 7.05954L1.72827 7.12207C1.72792 7.12744 1.72581 7.13263 1.72227 7.13672L0.995189 6.50984ZM0.7698 7.06863L0.6802 9.00335L1.63918 9.04776L1.72878 7.11304L0.7698 7.06863ZM0.682222 9.07477C0.734491 9.58159 1.16985 9.96162 1.67906 9.94498L1.64767 8.98549C1.64563 8.98555 1.64462 8.98524 1.64397 8.98498C1.64305 8.98466 1.64184 8.98402 1.64061 8.98293C1.63937 8.98184 1.63857 8.98075 1.63811 8.97992C1.63779 8.97928 1.63736 8.97832 1.63715 8.97627L0.682222 9.07477ZM1.77406 9.93224L3.69409 9.47727L3.47265 8.54312L1.55267 8.99816L1.77406 9.93224ZM3.70151 9.47541C3.89703 9.42575 4.07169 9.31515 4.20007 9.15951L3.45946 8.54856C3.461 8.54677 3.46298 8.54549 3.46522 8.54491L3.70151 9.47541ZM4.20423 9.15432L8.06983 4.33384L7.3209 3.73327L3.4553 8.55375L4.20423 9.15432ZM5.50983 2.41385L6.52615 1.14665L5.77722 0.546016L4.7609 1.81322L5.50983 2.41385ZM6.54433 1.12247C6.63303 0.996313 6.80538 0.962451 6.93524 1.04567L7.45326 0.237395C6.8905 -0.123219 6.14356 0.0235073 5.75905 0.570195L6.54433 1.12247ZM6.88718 1.01045L8.31886 2.20213L8.933 1.46429L7.50132 0.272608L6.88718 1.01045ZM8.28622 2.17231C8.33479 2.22101 8.36193 2.28712 8.36154 2.35594L9.32154 2.36121C9.32334 2.03628 9.19521 1.7241 8.96564 1.49411L8.28622 2.17231ZM8.36154 2.35594C8.36122 2.42475 8.33332 2.49055 8.28417 2.53872L8.95617 3.22435C9.18823 2.9969 9.31975 2.68614 9.32154 2.36121L8.36154 2.35594ZM8.24583 2.58104L7.3209 3.73327L8.06983 4.33384L8.9945 3.18202L8.24583 2.58104ZM4.66068 2.18467C4.88423 3.6767 6.26503 4.71227 7.76001 4.50914L7.63073 3.5579C6.65607 3.69034 5.75585 3.01516 5.61006 2.0424L4.66068 2.18467Z"
        />
    </svg>
);

const GridDotsVerticalIcon = ({ width = 16, height = 16 }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ width }
        height={ height }
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-grip-vertical-icon lucide-grip-vertical"
    >
        <circle cx="9" cy="12" r="2"/>
        <circle cx="9" cy="5" r="2"/>
        <circle cx="9" cy="19" r="2"/>
        <circle cx="15" cy="12" r="2"/>
        <circle cx="15" cy="5" r="2"/>
        <circle cx="15" cy="19" r="2"/>
    </svg>
);

/**
 * Re-orderable component inside a step node.
 *
 * @param props - Props injected to the component.
 * @returns ReorderableElement component.
 */
export const ReorderableElement: FunctionComponent<ReorderableComponentPropsInterface> = ({
    id,
    element,
    className,
    "data-componentid": componentId = "sortable-component",
    ...rest
}: ReorderableComponentPropsInterface): ReactElement => {
    const handleRef: MutableRefObject<HTMLButtonElement> = useRef<HTMLButtonElement | null>(null);
    const stepId: string = useNodeId();
    const { deleteComponent } = useComponentDelete();
    const {
        ElementFactory,
        setLastInteractedResource,
        setLastInteractedStepId,
        setIsOpenResourcePropertiesPanel
    } = useAuthenticationFlowBuilderCore();

    /**
     * Handles the opening of the property panel for the resource.
     *
     * @param event - MouseEvent triggered on element interaction.
     */
    const handlePropertyPanelOpen = (event: MouseEvent): void => {

        event.stopPropagation();
        setLastInteractedStepId(stepId);
        setLastInteractedResource(element);
    };

    /**
     * Handles the deletion of the element.
     */
    const handleElementDelete = async (): Promise<void> => {

        /**
         * Execute plugins for ON_NODE_ELEMENT_DELETE event.
         */
        await PluginRegistry.getInstance().executeAsync(EventTypes.ON_NODE_ELEMENT_DELETE, stepId, element);

        deleteComponent(stepId, element);
        setIsOpenResourcePropertiesPanel(false);
    };

    return (
        <Sortable
            id={ id }
            handleRef={ handleRef }
            data={ { isReordering: true, resource: element, stepId } }
            type={ VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID }
            accept={ [ VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID ] }
            { ...rest }
        >
            <Box
                display="flex"
                alignItems="center"
                className={ classNames("reorderable-component", className) }
                data-componentid={ `${componentId}-${element.type}` }
                onDoubleClick={ handlePropertyPanelOpen }
            >
                <Box className="flow-builder-dnd-actions">
                    <Handle label="Drag" cursor="grab" ref={ handleRef }>
                        <GridDotsVerticalIcon />
                    </Handle>
                    <Handle
                        label="Edit"
                        onClick={ handlePropertyPanelOpen }
                    >
                        <PencilIcon />
                    </Handle>
                    <Handle
                        label="Delete"
                        onClick={ handleElementDelete }
                    >
                        <TrashIcon />
                    </Handle>
                </Box>
                <div className="flow-builder-step-content-form-field-content">
                    <ElementFactory stepId={ stepId } resource={ element } />
                </div>
            </Box>
        </Sortable>
    );
};

export default ReorderableElement;
