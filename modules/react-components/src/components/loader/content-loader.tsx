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
import { Dimmer, Loader, LoaderProps } from "semantic-ui-react";

/**
 * Content loader component Prop types.
 */
export interface ContentLoaderPropsInterface extends LoaderProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Addition classes.
     */
    className?: string;
    /**
     * Text to be displayed.
     */
    text?: string;
    /**
     * If the dimmer should be visible or not.
     */
    dimmer?: boolean;
}

/**
 * Content loader component.
 *
 * @param props - Props injected to the global loader component.
 *
 * @returns the content loader component.
 */
export const ContentLoader: FunctionComponent<ContentLoaderPropsInterface> = (
    props: ContentLoaderPropsInterface
): ReactElement => {

    const {
        className,
        dimmer,
        text,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "loaders content-loader"
        , className
    );

    return (
        <div
            className={ classes }
            data-componentid={ `${ componentId }-wrapper` }
            data-testid={ `${ testId }-wrapper` }
        >
            <Dimmer
                active={ dimmer }
                data-componentid={ `${ componentId }-dimmer` }
                data-testid={ `${ testId }-dimmer` }
                inverted
            >
                <Loader
                    { ...rest }
                    data-componentid={ componentId }
                    data-testid={ testId }
                    inverted
                >
                    { text }
                </Loader>
            </Dimmer>
        </div>
    );
};

/**
 * Content loader component default props.
 */
ContentLoader.defaultProps = {
    "data-componentid": "content-loader",
    "data-testid": "content-loader",
    dimmer: true,
    text: null
};
