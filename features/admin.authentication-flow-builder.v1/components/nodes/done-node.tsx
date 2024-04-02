/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import Fab from "@oxygen-ui/react/Fab";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, MutableRefObject, ReactElement, SVGAttributes, useEffect, useRef } from "react";
import { Handle, Node, Position } from "reactflow";
import useAuthenticationFlow from "../../hooks/use-authentication-flow";
import "./done-node.scss";
 
/**
 * Prop types for the done node component.
 */
export type DoneNodePropsInterface = IdentifiableComponentInterface;

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const CheckIcon = ({ ...rest }: SVGAttributes<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" { ...rest }>
        { /* eslint-disable-next-line max-len */ }
        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
    </svg>
);

/**
 * Done Node component.
 * This is a custom node supported by react flow renderer library.
 * See {@link https://reactflow.dev/docs/api/node-types/} for its documentation
 * and {@link https://reactflow.dev/examples/custom-node/} for an example
 *
 * @param props - Props injected to the component.
 * @returns Done node component.
 */
const DoneNode: FunctionComponent = (props: DoneNodePropsInterface & Node): ReactElement => {
    const {
        id,
        ["data-componentid"]: componentId
    } = props;

    const { updateVisualEditorFlowNodeMeta } = useAuthenticationFlow();

    const ref: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    /**
     * Update the node meta when the component is mounted.
     */
    useEffect(() => {
        if (ref && ref.current) {
            updateVisualEditorFlowNodeMeta(id, {
                height: ref.current.clientHeight,
                width: ref.current.clientWidth
            });
        }
    }, [ ref?.current?.clientHeight ]);

    return (
        <div
            ref={ ref }
            className="done-node-wrapper"
            data-componentid={ componentId }
        >
            <Fab
                aria-label="done"
                className="done-node"
                variant="circular"
                data-componentid={ `${ componentId }-circular-fab` }
            >
                <CheckIcon data-componentid={ `${ componentId }-check-icon` } />
            </Fab>
            <Handle className="hidden-handle" id="targetLeft" type="target" position={ Position.Left } />
        </div>
    );
};

/**
 * Default props for the done node component.
 */
DoneNode.defaultProps = {
    "data-componentid": "done-node"
};

export default DoneNode;
