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

import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Icon } from "semantic-ui-react";
/**
 * DocumentationLink component Prop types.
 */
interface DocumentationLinkPropsInterface { 
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
 * Documentation link anchor tag component.
 *
 * @param {React.PropsWithChildren<DocumentationLinkPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const DocumentationLink: FunctionComponent<PropsWithChildren<DocumentationLinkPropsInterface>> = (
    props: PropsWithChildren<DocumentationLinkPropsInterface>
): ReactElement => {

    const { 
        children,
        link,
        target
    } = props;

    if (link === undefined) {
        return null;
    }

    return (
        <strong>
            <a
                href={ link }
                target={ target }
                rel="noopener noreferrer"
                className="ml-1 link external no-wrap"
            >
                { children }
                <Icon className="ml-7" name="caret right"/>
            </a>
        </strong>
    );
};

/**
 * Prop types for the DocumentationLink component.
 */
DocumentationLink.defaultProps = {
    target: "_blank"
};
