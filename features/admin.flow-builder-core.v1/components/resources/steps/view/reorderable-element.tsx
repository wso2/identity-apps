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
import { GridDotsVerticalIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useNodeId } from "@xyflow/react";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, MutableRefObject, ReactElement, SVGProps, useRef } from "react";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import useComponentDelete from "../../../../hooks/use-component-delete";
import { Element } from "../../../../models/elements";
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
    <svg width={ width } height={ height } viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
            <path
                // eslint-disable-next-line max-len
                d="M11.5091 1.45128C11.7279 1.23267 12.0245 1.10986 12.3338 1.10986C12.643 1.10986 12.9397 1.23267 13.1584 1.45128L14.8824 3.17528C15.101 3.39405 15.2238 3.69067 15.2238 3.99995C15.2238 4.30922 15.101 4.60585 14.8824 4.82461L13.0204 6.68661L13.0124 6.69528L5.79376 13.5853C5.66183 13.7113 5.50224 13.8047 5.32776 13.8579L1.64576 14.9779C1.55919 15.0042 1.46711 15.0064 1.37938 14.9843C1.29166 14.9622 1.21159 14.9167 1.14776 14.8526C1.08366 14.7888 1.03813 14.7087 1.01606 14.621C0.993978 14.5333 0.996179 14.4412 1.02242 14.3546L2.13776 10.6879C2.19625 10.496 2.30325 10.3224 2.44842 10.1839L9.65109 3.30861L11.5091 1.45128ZM3.13909 10.9073C3.11847 10.9272 3.10313 10.952 3.09442 10.9793L2.25176 13.7486L5.03642 12.9013C5.06139 12.8935 5.08422 12.88 5.10309 12.8619L11.9518 6.32461L9.99176 4.36528L3.13909 10.9073ZM12.6671 5.62661L14.1758 4.11861C14.1913 4.10313 14.2036 4.08474 14.212 4.06449C14.2204 4.04424 14.2247 4.02254 14.2247 4.00061C14.2247 3.97869 14.2204 3.95698 14.212 3.93674C14.2036 3.91649 14.1913 3.8981 14.1758 3.88261L12.4518 2.15861C12.4363 2.14309 12.4179 2.13078 12.3976 2.12238C12.3774 2.11397 12.3557 2.10965 12.3338 2.10965C12.3118 2.10965 12.2901 2.11397 12.2699 2.12238C12.2496 2.13078 12.2312 2.14309 12.2158 2.15861L10.7078 3.66661L12.6671 5.62661Z"
                fill="black" />
            <path
                // eslint-disable-next-line max-len
                d="M11.5091 1.45128L11.2735 1.2155L11.2734 1.21554L11.5091 1.45128ZM12.3338 1.10986V1.4432V1.10986ZM13.1584 1.45128L13.3941 1.21558L13.394 1.2155L13.1584 1.45128ZM14.8824 3.17528L15.1182 2.93966L15.1181 2.93958L14.8824 3.17528ZM14.8824 4.82461L15.1181 5.06032L15.1182 5.06023L14.8824 4.82461ZM13.0204 6.68661L12.7845 6.45072L12.7755 6.46051L13.0204 6.68661ZM13.0124 6.69528L13.2426 6.93641L13.2502 6.92913L13.2574 6.92138L13.0124 6.69528ZM5.79376 13.5853L5.56361 13.3442L5.56351 13.3442L5.79376 13.5853ZM5.32776 13.8579L5.42476 14.1769L5.42509 14.1768L5.32776 13.8579ZM1.64576 14.9779L1.74246 15.2969L1.74276 15.2969L1.64576 14.9779ZM1.14776 14.8526L1.38394 14.6174L1.38297 14.6164L1.14776 14.8526ZM1.02242 14.3546L0.703516 14.2576L0.703425 14.2579L1.02242 14.3546ZM2.13776 10.6879L1.8189 10.5908L1.81885 10.5909L2.13776 10.6879ZM2.44842 10.1839L2.67851 10.4251L2.67858 10.4251L2.44842 10.1839ZM9.65109 3.30861L9.88131 3.5498L9.88675 3.54436L9.65109 3.30861ZM3.13909 10.9073L2.90891 10.6662L2.90737 10.6677L3.13909 10.9073ZM3.09442 10.9793L2.77678 10.8781L2.77553 10.8822L3.09442 10.9793ZM2.25176 13.7486L1.93286 13.6516L1.75094 14.2494L2.34879 14.0675L2.25176 13.7486ZM5.03642 12.9013L5.13346 13.2202L5.13541 13.2196L5.03642 12.9013ZM5.10309 12.8619L4.87293 12.6208L4.87235 12.6214L5.10309 12.8619ZM11.9518 6.32461L12.1819 6.56573L12.4287 6.33012L12.1874 6.08887L11.9518 6.32461ZM9.99176 4.36528L10.2274 4.12954L9.99712 3.89932L9.76158 4.12418L9.99176 4.36528ZM12.6671 5.62661L12.4313 5.86228L12.667 6.09801L12.9027 5.86237L12.6671 5.62661ZM14.1758 4.11861L13.9404 3.88261L13.9401 3.88286L14.1758 4.11861ZM14.1758 3.88261L13.9401 4.11832L13.9404 4.11861L14.1758 3.88261ZM12.4518 2.15861L12.2158 2.39402L12.2161 2.39432L12.4518 2.15861ZM12.2158 2.15861L12.4515 2.39432L12.4518 2.39402L12.2158 2.15861ZM10.7078 3.66661L10.4721 3.43091L10.2364 3.66657L10.472 3.90228L10.7078 3.66661ZM11.7447 1.68707C11.901 1.53091 12.1128 1.4432 12.3338 1.4432V0.77653C11.9361 0.77653 11.5547 0.93442 11.2735 1.2155L11.7447 1.68707ZM12.3338 1.4432C12.5547 1.4432 12.7665 1.53091 12.9228 1.68707L13.394 1.2155C13.1128 0.93442 12.7314 0.77653 12.3338 0.77653V1.4432ZM12.9227 1.68698L14.6467 3.41098L15.1181 2.93958L13.3941 1.21558L12.9227 1.68698ZM14.6466 3.4109C14.8028 3.56716 14.8905 3.77904 14.8905 3.99995H15.5572C15.5572 3.60231 15.3993 3.22094 15.1182 2.93966L14.6466 3.4109ZM14.8905 3.99995C14.8905 4.22086 14.8028 4.43273 14.6466 4.589L15.1182 5.06023C15.3993 4.77896 15.5572 4.39759 15.5572 3.99995H14.8905ZM14.6467 4.58891L12.7847 6.45091L13.2561 6.92232L15.1181 5.06032L14.6467 4.58891ZM12.7755 6.46051L12.7675 6.46918L13.2574 6.92138L13.2654 6.91271L12.7755 6.46051ZM12.7823 6.45415L5.56361 13.3442L6.0239 13.8264L13.2426 6.93641L12.7823 6.45415ZM5.56351 13.3442C5.46922 13.4343 5.35514 13.5011 5.23043 13.5391L5.42509 14.1768C5.64934 14.1083 5.85445 13.9883 6.024 13.8263L5.56351 13.3442ZM5.23075 13.539L1.54875 14.659L1.74276 15.2969L5.42476 14.1769L5.23075 13.539ZM1.54905 14.6589C1.52035 14.6677 1.48982 14.6684 1.46074 14.6611L1.29803 15.3076C1.44439 15.3444 1.59802 15.3407 1.74246 15.2969L1.54905 14.6589ZM1.46074 14.6611C1.43165 14.6537 1.40511 14.6386 1.38394 14.6174L0.911571 15.0878C1.01807 15.1948 1.15166 15.2707 1.29803 15.3076L1.46074 14.6611ZM1.38297 14.6164C1.36172 14.5953 1.34663 14.5687 1.33931 14.5396L0.692803 14.7023C0.72964 14.8487 0.805596 14.9823 0.912537 15.0888L1.38297 14.6164ZM1.33931 14.5396C1.33199 14.5105 1.33272 14.48 1.34142 14.4513L0.703425 14.2579C0.659639 14.4023 0.655967 14.556 0.692803 14.7023L1.33931 14.5396ZM1.34133 14.4516L2.45666 10.785L1.81885 10.5909L0.703516 14.2576L1.34133 14.4516ZM2.45661 10.7851C2.49839 10.648 2.57482 10.5241 2.67851 10.4251L2.21833 9.94276C2.03169 10.1208 1.89411 10.344 1.8189 10.5908L2.45661 10.7851ZM2.67858 10.4251L9.88125 3.54973L9.42093 3.0675L2.21826 9.94283L2.67858 10.4251ZM9.88675 3.54436L11.7447 1.68703L11.2734 1.21554L9.41543 3.07287L9.88675 3.54436ZM2.90737 10.6677C2.84711 10.7259 2.80225 10.7982 2.77681 10.8781L3.41203 11.0804C3.404 11.1057 3.38983 11.1285 3.3708 11.1469L2.90737 10.6677ZM2.77553 10.8822L1.93286 13.6516L2.57065 13.8456L3.41332 11.0763L2.77553 10.8822ZM2.34879 14.0675L5.13346 13.2202L4.93939 12.5824L2.15472 13.4297L2.34879 14.0675ZM5.13541 13.2196C5.20973 13.1965 5.27766 13.1564 5.33383 13.1025L4.87235 12.6214C4.89077 12.6037 4.91306 12.5906 4.93744 12.583L5.13541 13.2196ZM5.33325 13.1031L12.1819 6.56573L11.7216 6.0835L4.87293 12.6208L5.33325 13.1031ZM12.1874 6.08887L10.2274 4.12954L9.75609 4.60102L11.7161 6.56036L12.1874 6.08887ZM9.76158 4.12418L2.90892 10.6662L3.36926 11.1484L10.2219 4.60639L9.76158 4.12418ZM12.9027 5.86237L14.4114 4.35437L13.9401 3.88286L12.4314 5.39086L12.9027 5.86237ZM14.4112 4.35461C14.4577 4.30817 14.4947 4.25299 14.5199 4.19225L13.9041 3.93674C13.9125 3.91649 13.9248 3.8981 13.9404 3.88261L14.4112 4.35461ZM14.5199 4.19225C14.5451 4.1315 14.5581 4.06638 14.5581 4.00061H13.8914C13.8914 3.97869 13.8957 3.95699 13.9041 3.93674L14.5199 4.19225ZM14.5581 4.00061C14.5581 3.93485 14.5451 3.86973 14.5199 3.80898L13.9041 4.06449C13.8957 4.04424 13.8914 4.02254 13.8914 4.00061H14.5581ZM14.5199 3.80898C14.4947 3.74824 14.4577 3.69306 14.4112 3.64661L13.9404 4.11861C13.9248 4.10313 13.9125 4.08474 13.9041 4.06449L14.5199 3.80898ZM14.4115 3.64691L12.6875 1.92291L12.2161 2.39432L13.9401 4.11832L14.4115 3.64691ZM12.6878 1.92321C12.6413 1.87665 12.5861 1.8397 12.5254 1.8145L12.2699 2.43026C12.2496 2.42185 12.2312 2.40954 12.2158 2.39402L12.6878 1.92321ZM12.5254 1.8145C12.4646 1.78929 12.3995 1.77632 12.3338 1.77632V2.44298C12.3118 2.44298 12.2901 2.43866 12.2699 2.43026L12.5254 1.8145ZM12.3338 1.77632C12.268 1.77632 12.2029 1.78929 12.1421 1.8145L12.3976 2.43026C12.3774 2.43866 12.3557 2.44298 12.3338 2.44298V1.77632ZM12.1421 1.8145C12.0814 1.8397 12.0262 1.87665 11.9798 1.92321L12.4518 2.39402C12.4363 2.40954 12.4179 2.42185 12.3976 2.43026L12.1421 1.8145ZM11.9801 1.92291L10.4721 3.43091L10.9435 3.90232L12.4515 2.39432L11.9801 1.92291ZM10.472 3.90228L12.4313 5.86228L12.9028 5.39095L10.9435 3.43095L10.472 3.90228Z"
                fill="black" />
        </g>
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
            >
                <Box className="flow-builder-dnd-actions">
                    <Handle label="Drag" cursor="grab" ref={ handleRef }>
                        <GridDotsVerticalIcon />
                    </Handle>
                    <Handle
                        label="Edit"
                        onClick={ (event: MouseEvent) => {
                            event.stopPropagation();
                            setLastInteractedStepId(stepId);
                            setLastInteractedResource(element);
                        } }
                    >
                        <PencilIcon />
                    </Handle>
                    <Handle
                        label="Delete"
                        onClick={ () => {
                            deleteComponent(stepId, element);
                            setIsOpenResourcePropertiesPanel(false);
                        } }
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
