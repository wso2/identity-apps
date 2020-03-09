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

import { Heading, LabeledCard } from "@wso2is/react-components";
import classNames from "classnames";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactPortal
} from "react";
import ReactDOM from "react-dom";
import {
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided
} from "react-beautiful-dnd";
import { AuthenticatorListItemInterface } from "../meta";

/**
 * Proptypes for the authenticators component.
 */
interface AuthenticatorsPropsInterface {
    /**
     * List of authenticators.
     */
    authenticators: AuthenticatorListItemInterface[];
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * ID for the droppable field.
     */
    droppableId: string;
    /**
     * Heading for the authenticators section.
     */
    heading?: string;
    /**
     * Is dropping allowed.
     */
    isDropDisabled?: boolean;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
}

const portal: HTMLElement = document.createElement("div");
portal.classList.add("draggable-portal");

if (!document.body) {
    throw new Error("document body is not ready for portal creation!");
}

document.body.appendChild(portal);

/**
 * Component to render the list of authenticators.
 *
 * @param {AuthenticatorsPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const Authenticators: FunctionComponent<AuthenticatorsPropsInterface> = (
    props: AuthenticatorsPropsInterface
): JSX.Element => {

    const {
        authenticators,
        className,
        droppableId,
        heading,
        isDropDisabled
    } = props;

    const classes = classNames("authenticators", className);

    /**
     * Add a wrapper portal so that the `transform` attributes in the parent
     * component won't affect the draggable position.
     *
     * @see {@link https://github.com/atlassian/react-beautiful-dnd/issues/128)}
     * @param {React.PropsWithChildren<{provided: DraggableProvided; snapshot: DraggableStateSnapshot}>} props
     * @return {React.ReactElement | React.ReactPortal}
     */
    const PortalAwareDraggable = (
        props: PropsWithChildren<{ provided: DraggableProvided; snapshot: DraggableStateSnapshot}>
    ): ReactElement | ReactPortal => {

        const { children, provided, snapshot } = props;

        const usePortal: boolean = snapshot.isDragging;

        const child: ReactElement = (
            <div
                ref={ provided.innerRef }
                { ...provided.draggableProps }
                { ...provided.dragHandleProps }
            >
                { children }
            </div>
        );

        if (!usePortal) {
            return child;
        }

        // if dragging - put the item in a portal.
        return ReactDOM.createPortal(child, portal);
    };

    return (
        (authenticators && authenticators instanceof Array && authenticators.length > 0)
            ? (
                <>
                    { heading && <Heading as="h6">{ heading }</Heading> }
                    <Droppable droppableId={ droppableId } direction="horizontal" isDropDisabled={ isDropDisabled }>
                        { (provided: DroppableProvided): React.ReactElement<HTMLElement> => (
                            <div ref={ provided.innerRef } { ...provided.droppableProps } className={ classes }>
                                { authenticators.map((authenticator, index) => (
                                    <Draggable
                                        key={ `${ authenticator.authenticator }-${ index }` }
                                        draggableId={ authenticator.authenticator }
                                        index={ index }
                                    >
                                        {
                                            (
                                                draggableProvided: DraggableProvided,
                                                draggableSnapshot: DraggableStateSnapshot
                                            ): React.ReactElement<HTMLElement> => (
                                                <PortalAwareDraggable
                                                    provided={ draggableProvided }
                                                    snapshot={ draggableSnapshot }
                                                >
                                                    <LabeledCard
                                                        image={ authenticator.image }
                                                        label={ authenticator.displayName }
                                                    />
                                                </PortalAwareDraggable>
                                            )
                                        }
                                    </Draggable>
                                ))
                                }
                                { provided.placeholder }
                            </div>
                        ) }
                    </Droppable>
                </>
            )
            : null
    );
};

/**
 * Default props for the authenticators component.
 */
Authenticators.defaultProps = {
    isDropDisabled: true
};
