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

/**
 * Help side panel action bar Prop types.
 */
export interface HelpPanelActionBarInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Float clearing.
     */
    clearing?: boolean;
    /**
     * Floated direction.
     */
    floated?: "left" | "right";
}

/**
 * Help side panel action bar.
 *
 * @param props - props injected to component
 *
 * @returns the help panel action bar
 */
export const HelpPanelActionBar: FunctionComponent<PropsWithChildren<HelpPanelActionBarInterface>> = (
    props: PropsWithChildren<HelpPanelActionBarInterface>
): ReactElement => {

    const {
        children,
        clearing,
        className,
        floated,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames("help-panel-action-bar", {
        clearing,
        [ `floated-${ floated }` ]: floated
    }, className);

    return (
        <div
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            <div
                className="actions-group"
                data-componentid={ `${ componentId }-action-group` }
                data-testid={ `${ testId }-action-group` }
            >
                {
                    React.Children.map((children),
                        (action: ReactElement<any>, index: number) => (
                            <div
                                key={ index }
                                className="action"
                                data-componentid={ `${ componentId }-action-${ index }` }
                                data-testid={ `${ testId }-action-${ index }` }
                            >
                                { action }
                            </div>
                        ))
                }
            </div>
        </div>
    );
};

/**
 * Default props for the help panel action bar.
 */
HelpPanelActionBar.defaultProps = {
    clearing: true,
    "data-componentid": "help-panel-action-bar",
    "data-testid": "help-panel-action-bar",
    floated: "right"
};
