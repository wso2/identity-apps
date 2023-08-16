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
import React, { FunctionComponent, MutableRefObject, ReactElement, forwardRef } from "react";
import { Ref, Segment, SegmentProps } from "semantic-ui-react";

/**
 * Prop types for the emphasized segment component.
 */
export interface EmphasizedSegmentPropsInterface extends SegmentProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Should the segment be bordered.
     */
    bordered?: boolean;
    /**
     * Should the segment be emphasised. The foreground color(light background) will be applied to the background.
     */
    emphasized?: boolean;
}

/**
 * Emphasized segment component.
 *
 * @param props - Props injected in to the component.
 *
 * @returns React Component
 */
export const EmphasizedSegment: FunctionComponent<EmphasizedSegmentPropsInterface> = forwardRef((
    props: EmphasizedSegmentPropsInterface,
    ref: MutableRefObject<HTMLElement>
): ReactElement => {

    const {
        bordered,
        className,
        children,
        emphasized,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        {
            bordered,
            emphasized
        },
        className
    );

    return (
        <Ref innerRef={ ref }>
            <Segment
                className={ classes }
                data-componentid={ componentId }
                data-testid={ testId }
                { ...rest }
            >
                { children }
            </Segment>
        </Ref>
    );
});

/**
 * Prop types for the component.
 */
EmphasizedSegment.defaultProps =  {
    basic: true,
    bordered: true,
    "data-componentid": "emphasized-segment",
    "data-testid": "emphasized-segment",
    emphasized: true
};
