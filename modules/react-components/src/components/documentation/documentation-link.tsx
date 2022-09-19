/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
import { useDocumentation } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Icon } from "semantic-ui-react";

/**
 * DocumentationLink component Prop types.
 */
interface DocumentationLinkPropsInterface extends IdentifiableComponentInterface {
    /**
     * Documentation URL.
     */
    link: string;
    /**
     * Is provided link a reference to link.
     */
    isLinkRef?: boolean;
    /**
     * Documentation URL target property. Opens in a new window by default.
     */
    target?: string;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Specifies if a link text with an empty link or a `#` should be shown.
     */
    showEmptyLink?: boolean;
}

/**
 * Documentation link anchor tag component.
 *
 * @param props - Props injected to the component.
 *
 * @returns DocumentationLink Component.
 */
export const DocumentationLink: FunctionComponent<PropsWithChildren<DocumentationLinkPropsInterface>> = (
    props: PropsWithChildren<DocumentationLinkPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        link,
        isLinkRef,
        target,
        showEmptyLink,
        [ "data-componentid" ]: componentId
    } = props;

    const { getLink } = useDocumentation();
    
    if (link === undefined) {
        return null;
    }

    const classes = classNames("documentation-link ml-1 link external no-wrap", className);
    const url = isLinkRef ? getLink(link) : link;

    return (
        !(!showEmptyLink && (!url || url === "#")) &&
        (<a
            href={ url }
            target={ target }
            rel="noopener noreferrer"
            className={ classes }
            data-componentid={ componentId }
        >
            { children }
            <Icon className="ml-1" name="external alternate"/>
        </a>)
    );
};

/**
 * Prop types for the DocumentationLink component.
 */
DocumentationLink.defaultProps = {
    "data-componentid": "documentation-link",
    showEmptyLink: true,
    target: "_blank"
};
