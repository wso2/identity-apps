/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Accordion, AccordionProps } from "semantic-ui-react";
import { SegmentedAccordionContent } from "./segmented-accordion-content";
import { SegmentedAccordionTitle } from "./segmented-accordion-title";

/**
 * Interface for the segmented accordion sub components.
 */
export interface SegmentedAccordionSubComponentsInterface {
    Content: typeof SegmentedAccordionContent;
    Title: typeof SegmentedAccordionTitle;
}

/**
 * Proptypes for the segmented accordion component.
 */
export interface SegmentedAccordionPropsInterface extends AccordionProps, IdentifiableComponentInterface,
    TestableComponentInterface {
    /**
     * Type of final view of the list of accordion components.
     */
    viewType?: "list-view" | "table-view";
}

/**
 * Segmented accordion component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Segmented Accordion React Component.
 */
export const SegmentedAccordion: FunctionComponent<SegmentedAccordionPropsInterface>
    & SegmentedAccordionSubComponentsInterface = (
        props: SegmentedAccordionPropsInterface
    ): ReactElement => {

        const {
            className,
            children,
            [ "data-componentid" ]: componentId,
            [ "data-testid" ]: testId,
            viewType,
            ...rest
        } = props;

        let classes;

        switch (viewType) {
            case "list-view": {
                classes = classNames(
                    "segmented-accordion",
                    className
                );

                break;
            }
            case "table-view": {
                classes = classNames(
                    "segmented-accordion-table-view",
                    className
                );

                break;
            }
            default: {
                classes = classNames(
                    "segmented-accordion",
                    className
                );
            }
        }

        return (
            <Accordion
                className={ classes }
                data-componentid={ componentId }
                data-testid={ testId }
                { ...rest }
            >
                { children }
            </Accordion>
        );
    };

/**
 * Default proptypes for the segmented accordion component.
 */
SegmentedAccordion.defaultProps = {
    "data-componentid": "segmented-accordion",
    "data-testid": "segmented-accordion",
    viewType: "list-view"
};

SegmentedAccordion.Title = SegmentedAccordionTitle;
SegmentedAccordion.Content = SegmentedAccordionContent;
