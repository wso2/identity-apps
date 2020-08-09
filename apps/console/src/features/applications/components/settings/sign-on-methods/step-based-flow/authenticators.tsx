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
import { Heading, LabeledCard } from "@wso2is/react-components";
import classNames from "classnames";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    ReactPortal
} from "react";
import {
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided
} from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import { GenericAuthenticatorInterface } from "../../../../../identity-providers";

/**
 * Proptypes for the authenticators component.
 */
interface AuthenticatorsPropsInterface extends TestableComponentInterface {
    /**
     * List of authenticators.
     */
    authenticators: GenericAuthenticatorInterface[];
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Default name for authenticators with no name.
     */
    defaultName?: string;
    /**
     * ID for the droppable field.
     */
    droppableId: string;
    /**
     * Empty placeholder.
     */
    emptyPlaceholder?: ReactNode;
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
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
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
 * @return {React.ReactElement}
 */
export const Authenticators: FunctionComponent<AuthenticatorsPropsInterface> = (
    props: AuthenticatorsPropsInterface
): ReactElement => {

    const {
        authenticators,
        className,
        defaultName,
        droppableId,
        emptyPlaceholder,
        heading,
        isDropDisabled,
        readOnly,
        [ "data-testid" ]: testId
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
        props: PropsWithChildren<{ provided: DraggableProvided; snapshot: DraggableStateSnapshot }>
    ): ReactElement | ReactPortal => {

        const {
            children,
            provided,
            snapshot
        } = props;

        const usePortal: boolean = snapshot.isDragging;

        const child: ReactElement = (
            <div
                ref={ provided.innerRef }
                { ...provided.draggableProps }
                { ...provided.dragHandleProps }
                className="inline"
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
                            <div
                                ref={ provided.innerRef }
                                { ...provided.droppableProps }
                                className={ classes }
                                data-testid={ testId }
                            >
                                {
                                    authenticators.map((authenticator, index) => (
                                        <Draggable
                                            key={ `${ authenticator.idp }-${ authenticator.id }` }
                                            draggableId={ authenticator.id }
                                            index={ index }
                                            isDragDisabled={ readOnly }
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
                                                            size="tiny"
                                                            image={ authenticator.image }
                                                            label={ authenticator.displayName || defaultName }
                                                            labelEllipsis={ true }
                                                            data-testid={
                                                                `${ testId }-authenticator-${ authenticator.name }`
                                                            }
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
            : <>{ emptyPlaceholder }</>
    );
};

/**
 * Default props for the authenticators component.
 */
Authenticators.defaultProps = {
    "data-testid": "authenticators",
    defaultName: "Unknown",
    isDropDisabled: true
};
