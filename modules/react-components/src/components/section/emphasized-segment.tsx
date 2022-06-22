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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Segment, SegmentProps } from "semantic-ui-react";

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
 * @param {EmphasizedSegmentPropsInterface} props - Props injected in to the component.
 *
 * @return {React.ReactElement}
 */
export const EmphasizedSegment: FunctionComponent<EmphasizedSegmentPropsInterface> = (
    props: EmphasizedSegmentPropsInterface
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
        <Segment
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </Segment>
    );
};

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
