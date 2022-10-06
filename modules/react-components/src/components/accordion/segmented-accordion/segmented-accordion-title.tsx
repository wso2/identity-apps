/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FormEvent, FunctionComponent, MouseEvent, ReactElement } from "react";
import {
    Accordion,
    AccordionTitleProps,
    Checkbox,
    CheckboxProps,
    Grid,
    Icon,
    Popup,
    Segment,
    SemanticICONS
} from "semantic-ui-react";
import { GenericIcon, GenericIconProps } from "../../icon";
import { EmphasizedSegment } from "../../section";

/**
 * Proptypes for the segmented accordion title component.
 */
export interface SegmentedAccordionTitlePropsInterface extends AccordionTitleProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Unique identifier for the element to be used in action callbacks.
     */
    id?: string;
    /**
     * Set of actions for the panel.
     */
    actions?: SegmentedAccordionTitleActionInterface[];
    /**
     * Clearing
     */
    clearing?: boolean;
    /**
     * Hides the chevron icon.
     */
    hideChevron?: boolean;
    /**
     * Flag to determine if emphasized segments should be used.
     */
    useEmphasizedSegments?: boolean;
    /**
     * Handle accordion on click method.
     */
    handleAccordionOnClick?:
        (e: MouseEvent<HTMLDivElement>, SegmentedAuthenticatedAccordion: AccordionTitleProps) => void;
}

/**
 * Segmented accordion title action interface.
 */
export interface SegmentedAccordionTitleActionInterface extends StrictSegmentedAccordionTitleActionInterface {
    [ key: string ]: any;
}

/**
 * Strict Segmented accordion title action interface.
 */
export interface StrictSegmentedAccordionTitleActionInterface {
    /**
     * Type of the action to render the component.
     */
    type: "checkbox" | "toggle" | "icon" | "checkbox popup";
    /**
     * On change callback.
     *
     * @param e - Change event.
     * @param data - Other arguments.
     */
    onChange?: (e: FormEvent<HTMLInputElement>, ...data) => void;
    /**
     * On click callback for the action.
     *
     * @param e - Click event.
     * @param data - Other arguments.
     */
    onClick?: (e: MouseEvent<HTMLDivElement>, ...data) => void;
    /**
     * Icon for the action. Only applicable for `type="icon"`.
     */
    icon?: SemanticICONS | GenericIconProps;
    /**
     * Label for the action.
     */
    label?: string;
    /**
     * Text for the popover.
     */
    popoverText?: string;
    /**
     * Inactive status of this action element.
     * Default value is always false {@link SegmentedAccordionTitle.defaultProps}
     */
    disabled?: boolean;
}

/**
 * Segmented accordion title component.
 *
 * @param props - Props injected to the component.
 *
 * @returns
 */
export const SegmentedAccordionTitle: FunctionComponent<SegmentedAccordionTitlePropsInterface> = (
    props: SegmentedAccordionTitlePropsInterface
): ReactElement => {

    const {
        active,
        actions,
        attached,
        children,
        className,
        clearing,
        content,
        hideChevron,
        id,
        useEmphasizedSegments,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "segmented-accordion-title",
        {
            clearing
        },
        className
    );

    /**
     * Interferes the click events to stop default propagation.
     *
     * @param callback - onClick or onChange callback.
     * @param e - Event.
     * @param args - Other arguments.
     */
    const handleActionOnClick = (
        callback: (e: FormEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>, ...data) => void,
        e: FormEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>,
        ...args): void => {

        e.stopPropagation();
        callback(e, ...args);
    };

    /**
     * Resolve the action.
     *
     * @param action - Passed in action.
     * @param index - Array Index.
     *
     * @returns Resolved action.
     */
    const resolveAction = (action: SegmentedAccordionTitleActionInterface, index: number): ReactElement => {

        const {
            icon,
            label,
            onChange,
            onClick,
            popoverText,
            type,
            disabled,
            ...actionsRest
        } = action;

        switch (type) {
            case "toggle": {
                return (
                    <Checkbox
                        toggle
                        label={ label }
                        disabled={ disabled }
                        onChange={
                            (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => handleActionOnClick(
                                onChange, e, data, id
                            )
                        }
                        data-componentid={ `${ componentId }-${ action.type }-action-${ index }` }
                        data-testid={ `${ testId }-${ action.type }-action-${ index }` }
                        { ...actionsRest }
                    />
                );
            }
            case "checkbox": {
                return (
                    <Checkbox
                        label={ label }
                        disabled={ disabled }
                        onChange={
                            (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => handleActionOnClick(
                                onChange, e, data, id)
                        }
                        data-componentid={ `${ componentId }-${ action.type }-action-${ index }` }
                        data-testid={ `${ testId }-${ action.type }-action-${ index }` }
                        { ...actionsRest }
                    />
                );
            }

            case "icon": {
                if (typeof icon === "string") {
                    return (
                        <Popup
                            disabled={ disabled || !popoverText }
                            trigger={ (
                                <div>
                                    <GenericIcon
                                        size="default"
                                        defaultIcon
                                        link
                                        inline
                                        disabled={ disabled }
                                        transparent
                                        verticalAlign="middle"
                                        icon={ (
                                            <Icon
                                                name={ icon as SemanticICONS }
                                                color="grey"
                                                className={ classNames({ "disabled": disabled }, "") }
                                            />
                                        ) }
                                        onClick={
                                            (e: MouseEvent<HTMLDivElement>) => handleActionOnClick(onClick, e, id)
                                        }
                                        data-componentid={ `${ componentId }-${ action.type }-action-${ index }` }
                                        data-testid={ `${ testId }-${ action.type }-action-${ index }` }
                                    />
                                </div>
                            ) }
                            position="top center"
                            content={ popoverText }
                            inverted
                        />
                    );
                }

                return (
                    <Popup
                        disabled={ disabled || !popoverText }
                        trigger={ (
                            <div>
                                <GenericIcon
                                    size="default"
                                    defaultIcon
                                    link
                                    inline
                                    disabled={ disabled }
                                    transparent
                                    verticalAlign="middle"
                                    onClick={ (e: MouseEvent<HTMLDivElement>) => handleActionOnClick(onClick, e, id) }
                                    data-componentid={ `${ componentId }-${ action.type }-action-${ index }` }
                                    data-testid={ `${ testId }-${ action.type }-action-${ index }` }
                                    { ...icon }
                                />
                            </div>
                        ) }
                        position="top center"
                        content={ popoverText }
                        inverted
                    />
                );
            }

            case "checkbox popup": {
                return (
                    <Popup
                        disabled={ disabled || !popoverText }
                        trigger={ (
                            <Checkbox
                                label={ label }
                                disabled={ disabled }
                                onChange={
                                    (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => handleActionOnClick(
                                        onChange, e, data, id)
                                }
                                data-componentid={ `${ componentId }-${ action.type }-action-${ index }` }
                                data-testid={ `${ testId }-${ action.type }-action-${ index }` }
                                { ...actionsRest }
                            />
                        ) }
                        position="top center"
                        content={ popoverText }
                        inverted
                    />

                    
                );
            }

            default: {
                return null;
            }
        }
    };

    return (
        <Accordion.Title
            as={ useEmphasizedSegments ? EmphasizedSegment : Segment }
            attached={ attached && (active ? "top" : false) }
            active={ active }
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 10 } tablet={ 8 } mobile={ 16 } verticalAlign="middle">
                        { content || children }
                    </Grid.Column>
                    <Grid.Column computer={ 6 } tablet={ 8 } mobile={ 16 } verticalAlign="middle">
                        <div className="flex floated right">
                            {
                                (actions && actions instanceof Array && actions.length > 0)
                                    ? actions.map((action, index) => (
                                        <div
                                            key={ index }
                                            className="mr-3 m-auto"
                                            onClick={ (e: MouseEvent<HTMLDivElement>) => e.stopPropagation() }
                                            data-componentid={
                                                `${ componentId }-${ action.type }-action-container-${ index }`
                                            }
                                            data-testid={ `${ testId }-${ action.type }-action-container-${ index }` }
                                        >
                                            { resolveAction(action, index) }
                                        </div>
                                    ))
                                    : null
                            }
                            {
                                !hideChevron && (
                                    <GenericIcon
                                        size="default"
                                        defaultIcon
                                        link
                                        inline
                                        transparent
                                        verticalAlign="middle"
                                        floated="right"
                                        data-componentid={ `${ componentId }-chevron` }
                                        data-testid={ `${ testId }-chevron` }
                                        icon={ <Icon name="angle right" className="chevron"/> }
                                    />
                                )
                            }
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Accordion.Title>
    );
};

/**
 * Default props for the segmented accordion title component.
 */
SegmentedAccordionTitle.defaultProps = {
    attached: true,
    clearing: false,
    "data-componentid": "segmented-accordion-title",
    "data-testid": "segmented-accordion-title",
    disabled: false,
    hideChevron: false,
    useEmphasizedSegments: true
};
