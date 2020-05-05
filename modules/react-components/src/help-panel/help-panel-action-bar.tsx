/*
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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";

/**
 * Help side panel action bar Prop types.
 */
export interface HelpPanelActionBarInterface extends TestableComponentInterface {
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
 * @param {PropsWithChildren<HelpPanelActionBarInterface>} props
 *
 * @return {React.ReactElement}
 */
export const HelpPanelActionBar: FunctionComponent<PropsWithChildren<HelpPanelActionBarInterface>> = (
    props: PropsWithChildren<HelpPanelActionBarInterface>
): ReactElement => {

    const {
        children,
        clearing,
        className,
        floated,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames("help-panel-action-bar", {
        clearing,
        [ `floated-${ floated }` ]: floated
    }, className);

    return (
        <div className={ classes } data-testid={ testId }>
            <div className="actions-group" data-testid={ `${ testId }-action-group` }>
                {
                    React.Children.map((children),
                        (action: ReactElement<any>, index: number) => (
                            <div key={ index } className="action" data-testid={ `${ testId }-action-${ index }` }>
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
    "data-testid": "help-panel-action-bar",
    floated: "right"
};
