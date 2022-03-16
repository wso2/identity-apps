/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode
} from "react";
import { Label, Segment, SegmentProps } from "semantic-ui-react";

/**
 * Image Preview component Prop types.
 */
export interface ImagePreviewPropsInterface extends IdentifiableComponentInterface, SegmentProps {

    /**
     * Whether to add the style node to the begining of the `head` element or to the end of the `head` element.
     */
    label?: ReactNode;
}

/**
 * Image Preview container component.
 *
 * @param {ImagePreviewPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ImagePreview: FunctionComponent<PropsWithChildren<ImagePreviewPropsInterface>> = (
    props: PropsWithChildren<ImagePreviewPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        label,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const classes = classNames(
        "image-preview",
        className
    );

    return (
        <Segment
            basic
            secondary
            className={ classes }
            data-componentid={ componentId }
            { ...rest }
        >
            { label && (
                <Label attached="top right" size="mini">
                    { label }
                </Label>
            ) }
            { children }
        </Segment>
    );
};

/**
 * Default props for the component.
 */
ImagePreview.defaultProps = {
    "data-componentid": "iframe"
};
