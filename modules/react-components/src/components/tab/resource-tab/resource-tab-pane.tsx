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
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Tab, TabPaneProps } from "semantic-ui-react";

/**
 * Resource tab pane component Prop types.
 */
export interface ResourceTabPanePropsInterface extends TabPaneProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Is the content segmentation handled from outside.
     */
    controlledSegmentation?: boolean;
}


/**
 * Resource tab pane component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the React component for the resource tab pane
 */
export const ResourceTabPane: FunctionComponent<PropsWithChildren<ResourceTabPanePropsInterface>> = (
    props: PropsWithChildren<ResourceTabPanePropsInterface>
): ReactElement => {

    const {
        children,
        className,
        controlledSegmentation,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "resource-tab-pane",
        {
            "controlled-segments": controlledSegmentation
        },
        className
    );

    return (
        <Tab.Pane
            className={ classes }
            attached={ false }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </Tab.Pane>
    );
};

/**
 * Default props for the resource tab pane component.
 */
ResourceTabPane.defaultProps = {
    attached: false,
    controlledSegmentation: false,
    "data-componentid": "resource-tab-pane",
    "data-testid": "resource-tab-pane"
};
