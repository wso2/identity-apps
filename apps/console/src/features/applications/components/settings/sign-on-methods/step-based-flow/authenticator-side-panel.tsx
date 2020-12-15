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
import { EmptyPlaceholder, GenericIcon, Heading } from "@wso2is/react-components";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, ReactElement, Ref, SyntheticEvent, forwardRef, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { Accordion, Card, Icon, Popup } from "semantic-ui-react";
import { Authenticators } from "./authenticators";
import { getOperationIcons } from "../../../../../core";
import { GenericAuthenticatorInterface } from "../../../../../identity-providers";

/**
 * Proptypes for the authenticator side panel component.
 */
interface AuthenticatorSidePanelPropsInterface extends TestableComponentInterface {
    /**
     * Set of authenticators.
     */
    authenticatorGroup: AuthenticatorInterface[];
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Side panel heading.
     */
    heading?: string;
    /**
     * Called on visibility toggle.
     */
    onSidePanelVisibilityToggle: () => void;
    /**
     * Make the component read only.
     */
    readOnly?: boolean;
    /**
     * Reference.
     */
    ref: Ref<HTMLDivElement>;
    /**
     * Side panel visibility.
     */
    visibility?: boolean;
}

interface AuthenticatorInterface {
    /**
     * Set of authenticators.
     */
    authenticators: GenericAuthenticatorInterface[];
    /**
     * Droppable id.
     */
    droppableId: string;
    /**
     * Heading for the authenticator section
     */
    heading: string;
}

/**
 * Authenticator side panel component.
 *
 * @param {AuthenticatorSidePanelPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const AuthenticatorSidePanel: FunctionComponent<AuthenticatorSidePanelPropsInterface> =
    forwardRef((props: AuthenticatorSidePanelPropsInterface, ref): ReactElement => {

        const {
            authenticatorGroup,
            className,
            heading,
            onSidePanelVisibilityToggle,
            readOnly,
            visibility,
            [ "data-testid" ]: testId
        } = props;

        const { t } = useTranslation();

        const [
            authenticatorsAccordionActiveIndexes,
            setAuthenticatorsAccordionActiveIndexes
        ] = useState<number[]>([ 0 ]);

        const classes = classNames(
            "authenticators-panel",
            className
        );

        /**
         * Handles accordion title click.
         *
         * @param {React.SyntheticEvent} e - Click event.
         * @param {number} index - Clicked on index.
         */
        const handleAuthenticatorsAccordionOnClick = (e: SyntheticEvent, { index }: { index: number }): void => {
            const newIndexes = [ ...authenticatorsAccordionActiveIndexes ];

            if (authenticatorsAccordionActiveIndexes.includes(index)) {
                const removingIndex = authenticatorsAccordionActiveIndexes.indexOf(index);
                newIndexes.splice(removingIndex, 1);
            } else {
                newIndexes.push(index);
            }

            setAuthenticatorsAccordionActiveIndexes(newIndexes);
        };

        return (
            visibility && (
                <div className={ classes } ref={ ref } data-testid={ testId }>
                    <Draggable handle=".drag-handle" disabled={ readOnly }>
                        <Card>
                            <Card.Content>
                                { heading && <Heading as="h6" floated="left" compact>{ heading }</Heading> }
                                <Popup
                                    trigger={ (
                                        <div className="inline floated right mt-1">
                                            <GenericIcon
                                                className="drag-handle"
                                                icon={ getOperationIcons().drag }
                                                size="nano"
                                                transparent
                                            />
                                        </div>
                                    ) }
                                    position="top center"
                                    content={ t("common:drag") }
                                    inverted
                                />
                                <Popup
                                    trigger={ (
                                        <div
                                            className="inline floated right mr-2 mt-1"
                                            onClick={ onSidePanelVisibilityToggle }
                                        >
                                            <GenericIcon
                                                icon={
                                                    visibility
                                                        ? getOperationIcons().minimize
                                                        : getOperationIcons().maximize
                                                }
                                                size="nano"
                                                transparent
                                            />
                                        </div>
                                    ) }
                                    position="top center"
                                    content={ t("common:minimize") }
                                    inverted
                                />
                            </Card.Content>
                            <Card.Content>
                                <div className="authenticators-section">
                                    {
                                        authenticatorGroup
                                        && authenticatorGroup instanceof Array
                                        && authenticatorGroup.length > 0 && (
                                            <Accordion>
                                                {
                                                    authenticatorGroup.map((authenticator, index: number) => (
                                                        authenticator?.authenticators
                                                        && authenticator.authenticators instanceof Array
                                                        && authenticator.authenticators.length > 0 && (
                                                            <Fragment key={ index }>
                                                                <Accordion.Title
                                                                    active={
                                                                        authenticatorsAccordionActiveIndexes.includes(
                                                                            index)
                                                                    }
                                                                    index={ index }
                                                                    onClick={ handleAuthenticatorsAccordionOnClick }
                                                                >
                                                                    <div className="inline floated right">
                                                                        <Icon name="angle right"
                                                                              className="caret-icon"/>
                                                                    </div>
                                                                    { authenticator.heading }
                                                                </Accordion.Title>
                                                                <Accordion.Content
                                                                    active={
                                                                        authenticatorsAccordionActiveIndexes.includes(
                                                                            index)
                                                                    }
                                                                >
                                                                    <Authenticators
                                                                        authenticators={ authenticator.authenticators }
                                                                        droppableId={ authenticator.droppableId }
                                                                        readOnly={ readOnly }
                                                                        emptyPlaceholder={ (
                                                                            <EmptyPlaceholder
                                                                                subtitle={
                                                                                    [
                                                                                        t("console:develop.features" +
                                                                                            ".applications.placehold" +
                                                                                            "ers.emptyAuthenticators" +
                                                                                            "List.subtitles", {
                                                                                            type: authenticator.heading
                                                                                        })
                                                                                    ]
                                                                                }
                                                                            />
                                                                        ) }
                                                                        data-testid={ `${ testId }-authenticators` }
                                                                    />
                                                                </Accordion.Content>
                                                            </Fragment>
                                                        )
                                                    ))
                                                }
                                            </Accordion>
                                        )
                                    }
                                </div>
                            </Card.Content>
                        </Card>
                    </Draggable>
                </div>
            )
        );
    });

/**
 * Authenticator side panel component default props.
 */
AuthenticatorSidePanel.defaultProps = {
    "data-testid": "authenticator-side-panel",
    visibility: true
};
