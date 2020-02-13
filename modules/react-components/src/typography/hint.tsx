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

import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";

/**
 * Heading component prop types.
 */
interface HintPropsInterface {
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Renders without any margins.
     */
    compact?: boolean;
    /**
     * Icon to be displayed
     */
    icon?: SemanticICONS;
}

/**
 * Hint component.
 *
 * @param {React.PropsWithChildren<HintPropsInterface>} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const Hint: React.FunctionComponent<PropsWithChildren<HintPropsInterface>> = (
    props: PropsWithChildren<HintPropsInterface>
): JSX.Element => {

    const {
        children,
        className,
        compact,
        icon
    } = props;

    const classes = classNames(
        "ui-hint",
        {
            compact
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
