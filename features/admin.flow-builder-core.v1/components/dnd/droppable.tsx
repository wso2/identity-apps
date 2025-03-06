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

import { UseDroppableInput, useDroppable } from "@dnd-kit/react";
import Box, { BoxProps } from "@oxygen-ui/react/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FC, PropsWithChildren, ReactElement } from "react";
import {
    closestCenter,
    pointerIntersection,
    directionBiased
  } from '@dnd-kit/collision';

/**
 * Props interface of {@link Droppable}
 */
export type DroppableProps = IdentifiableComponentInterface & UseDroppableInput & BoxProps;

/**
 * Droppable component.
 *
 * @param props - Props injected to the component.
 * @returns Droppable component.
 */
const Droppable: FC<PropsWithChildren<DroppableProps>> = ({
    "data-componentid": componentId = "droppable",
    id,
    children,
    sx = {},
    className,
    collisionDetector = pointerIntersection,
    ...rest
}: PropsWithChildren<DroppableProps>): ReactElement => {
    const { ref, isDropTarget } = useDroppable({ id, collisionDetector, ...rest });

    return (
        <Box
            ref={ ref }
            data-componentid={ componentId }
            className={ classNames("dnd-droppable", { "is-dropping": isDropTarget }, className) }
            sx={ { height: "100%", width: "100%", display: "inline-flex", flexDirection: "column", gap: "10px", ...sx } }
        >
            { children }
        </Box>
    );
};

export default Droppable;
