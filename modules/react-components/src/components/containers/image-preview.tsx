/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
    /**
     * Should there be more padding inside?
     */
    relaxed?: boolean;
}

/**
 * Image Preview container component.
 *
 * @param props - Props injected to the component.
 * @returns the Image Preview container component.
 */
export const ImagePreview: FunctionComponent<PropsWithChildren<ImagePreviewPropsInterface>> = (
    props: PropsWithChildren<ImagePreviewPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        label,
        relaxed,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const classes = classNames(
        "image-preview",
        { relaxed },
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
