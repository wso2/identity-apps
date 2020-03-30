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

import { Icon, SemanticICONS } from "semantic-ui-react";
import React, { PropsWithChildren, ReactElement } from "react";
import classNames from "classnames";

/**
 * Heading component prop types.
 */
export interface HintPropsInterface {
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Renders without any margins.
     */
    compact?: boolean;
    /**
     * Determines if the hint is in the disabled state.
     */
    disabled?: boolean;
    /**
     * Icon to be displayed
     */
    icon?: SemanticICONS;
    /**
     * Hides the component.
     */
    hidden?: boolean;
}

/**
 * Hint component.
 *
 * @param {React.PropsWithChildren<HintPropsInterface>} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const Hint: React.FunctionComponent<PropsWithChildren<HintPropsInterface>> = (
    props: PropsWithChildren<HintPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        compact,
        disabled,
        hidden,
        icon
    } = props;

    const classes = classNames(
        "ui-hint",
        {
            compact,
            disabled,
            hidden
        },
        className
    );

    return (
        <div className={ classes }>
            { icon && <Icon color="grey" floated="left" name={ icon }/> }
            { children }
        </div>
    );
};

/**
 * Default props for the hint component.
 */
Hint.defaultProps = {
    compact: false,
    icon: "info circle"
};
