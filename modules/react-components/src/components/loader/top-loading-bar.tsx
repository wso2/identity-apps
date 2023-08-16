/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

/**
 * Top loading bar component Prop types.
 */
export interface TopLoadingBarPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Height of the loading bar.
     */
    height?: number;
    /**
     * If the loader is visible or not.
     */
    visibility?: boolean;
}

/**
 * Top loading bar component component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the top loading bar component.
 */
export const TopLoadingBar: FunctionComponent<TopLoadingBarPropsInterface> = (
    props: TopLoadingBarPropsInterface
): ReactElement => {

    const {
        height,
        visibility,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const [ loaderRef, setLoaderRef ] = useState(null);

    useEffect(() => {
        if (!loaderRef) {
            return;
        }
        if (visibility) {
            loaderRef.continuousStart();

            return;
        }
        loaderRef.complete();
    }, [ visibility ]);

    return (
        <LoadingBar
            className="app-top-loading-bar"
            onRef={ (ref) => setLoaderRef(ref) }
            height={ height }
            data-componentid={ componentId }
            data-testid={ testId }
        />
    );
};

/**
 * Top loading bar component default props.
 */
TopLoadingBar.defaultProps = {
    "data-componentid": "top-loading-bar",
    "data-testid": "top-loading-bar",
    height: 3,
    visibility: true
};
