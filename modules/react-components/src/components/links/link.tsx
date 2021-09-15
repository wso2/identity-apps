/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";

/**
 * Link component Prop types interface.
 */
interface LinkPropsInterface extends IdentifiableComponentInterface {
    /**
     * Does the link point to an external source.
     */
    external?: boolean;
    /**
     * Icon to be displayed.
     */
    icon?: SemanticICONS;
    /**
     * Icon position.
     */
    iconPosition?: "left" | "right";
    /**
     * Documentation URL.
     */
    link: string;
    /**
     * Documentation URL target property. Opens in a new window by default.
     */
    target?: string;
}

/**
 * Link component.
 *
 * @param {React.PropsWithChildren<LinkPropsInterface>} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const Link: FunctionComponent<PropsWithChildren<LinkPropsInterface>> = (
    props: PropsWithChildren<LinkPropsInterface>
): ReactElement => {

    const {
        children,
        external,
        icon,
        iconPosition,
        link,
        target
    } = props;

    const classes = classNames(
        "link pointing",
        {
            external
        }
    );

    if (!link) {
        return null;
    }

    return (
        <a
            href={ link }
            target={ target }
            rel="noopener noreferrer"
            className={ classes }
        >
            { icon && iconPosition === "left" && <Icon className="mr-1" name={ icon } /> }
            { children }
            { icon && iconPosition === "right" && <Icon className="ml-1" name={ icon } /> }
        </a>
    );
};

/**
 * Prop types for the component.
 */
Link.defaultProps = {
    "data-componentid": "link",
    external: true,
    icon: "external",
    iconPosition: "right",
    target: "_blank"
};
