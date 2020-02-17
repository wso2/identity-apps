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

import { LabeledCard } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent } from "react";
import {
    Draggable,
    DraggableProvided,
    Droppable,
    DroppableProvided
} from "react-beautiful-dnd";
import { AuthenticatorListInterface } from "../meta";

/**
 * Proptypes for the authenticators component.
 */
interface AuthenticatorsPropsInterface {
    authenticators: AuthenticatorListInterface[];
    className?: string;
    droppableId: string;
    isDropDisabled?: boolean;
    isLoading?: boolean;
}

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
        isDropDisabled
    } = props;

    const classes = classNames("authenticators", className);

    return (
        <Droppable droppableId={ droppableId } direction="horizontal" isDropDisabled={ isDropDisabled }>
            { (provided: DroppableProvided) => (
                <div ref={ provided.innerRef } { ...provided.droppableProps } className={ classes }>
                    {
                        (authenticators && authenticators instanceof Array && authenticators.length > 0)
                            ? authenticators.map((authenticator, index) => (
                                <Draggable
                                    key={ authenticator.authenticator }
                                    draggableId={ authenticator.authenticator }
                                    index={ index }
                                >
                                    {
                                        (providedDraggable: DraggableProvided) => (
                                            <div
                                                ref={ providedDraggable.innerRef }
                                                { ...providedDraggable.draggableProps }
                                                { ...providedDraggable.dragHandleProps }
                                            >
                                                <LabeledCard
                                                    image={ authenticator.image }
                                                    label={ authenticator.displayName }
                                                />
                                            </div>
                                        ) }
                                </Draggable>
                            ))
                            : null
                    }
                    { provided.placeholder }
                </div>
            ) }
        </Droppable>

    );
};

/**
 * Default props for the authenticators component.
 */
Authenticators.defaultProps = {
    isDropDisabled: true
};
