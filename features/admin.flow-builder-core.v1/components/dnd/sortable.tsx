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

import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { UseSortableInput, useSortable } from "@dnd-kit/react/sortable";
import Box from "@oxygen-ui/react/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FC, PropsWithChildren, ReactElement, RefObject } from "react";

/**
 * Props interface of {@link Sortable}
 */
export interface SortableProps extends IdentifiableComponentInterface, UseSortableInput {
    /**
     * Handle reference.
     */
    handleRef?: RefObject<HTMLElement>;
}

/**
 * Sortable component.
 *
 * @param props - Props injected to the component.
 * @returns Sortable component.
 */
const Sortable: FC<PropsWithChildren<SortableProps>> = ({
    "data-componentid": componentId = "sortable",
    id,
    index,
    children,
    handleRef,
    collisionDetector,
    ...rest
}: PropsWithChildren<SortableProps>): ReactElement => {
    const { ref, isDragging } = useSortable({
        collisionDetector,
        feedback: "default",
        handle: handleRef,
        id,
        index,
        modifiers: [ RestrictToVerticalAxis ],
        ...rest
    });

    return (
        <Box
            ref={ ref }
            data-componentid={ componentId }
            sx={ { height: "100%", width: "100%" } }
            className={ classNames("dnd-sortable", { "is-dragging": isDragging }) }
        >
            { children }
        </Box>
    );
};

export default Sortable;
