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
import { Accordion, AccordionContentProps, Segment } from "semantic-ui-react";

/**
 * Proptypes for the segmented accordion content component.
 */
export interface SegmentedAccordionContentPropsInterface extends AccordionContentProps, IdentifiableComponentInterface,
    TestableComponentInterface {
        /**
         * Should the segment be rendered as an empasized segment.
         */
        emphasized?: boolean;
    }

/**
 * Segmented accordion content component.
 *
 * @param props - Props injected to the component.
 *
 * @returns a React component
 */
export const SegmentedAccordionContent: FunctionComponent<SegmentedAccordionContentPropsInterface> = (
    props: SegmentedAccordionContentPropsInterface
): ReactElement => {

    const {
        className,
        children,
        emphasized,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "segmented-accordion-content",
        "lighter-bg",
        {
            emphasized
        },
        className
    );

    return (
        <Accordion.Content
            as={ Segment }
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </Accordion.Content>
    );
};

/**
 * Default proptypes for the segmented accordion content component.
 */
SegmentedAccordionContent.defaultProps = {
    attached: "bottom",
    "data-componentid": "segmented-accordion-content",
    "data-testid": "segmented-accordion-content",
    secondary: true
};
