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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Header } from "semantic-ui-react";
import { GenericIcon, GenericIconSizes } from "../icon";

/**
 * Proptypes for the placeholder component.
 */
export interface PlaceholderProps extends TestableComponentInterface {
    /**
     * Action of the placeholder.
     */
    action?: React.ReactNode;
    /**
     * Image for the placeholder.
     */
    image?: any;
    /**
     * Size of the placeholder image.
     */
    imageSize?: GenericIconSizes;
    /**
     * Placeholder subtitle.
     */
    subtitle: string | string[];
    /**
     * Placeholder title.
     */
    title?: string;
}

/**
 * Placeholder component.
 *
 * @param {PlaceholderProps} props - Props injected in to the placeholder component.
 *
 * @return {React.ReactElement}
 */
export const EmptyPlaceholder: FunctionComponent<PlaceholderProps> = (props: PlaceholderProps): ReactElement => {

    const {
        action,
        image,
        imageSize,
        subtitle,
        title,
        [ "data-testid" ]: testId
    } = props;

    return (
        <div className="empty-placeholder" data-testid={ testId }>
            {
                image
                    ? (
                        <div className="image-container">
                            <GenericIcon
                                fill="default"
                                icon={ image }
                                size={ imageSize }
                                data-testid={ `${ testId }-icon` }
                                transparent
                            />
                        </div>
                    )
                    : null
            }
            { title && <Header as="h4" className="title" data-testid={ `${ testId }-header` }>{ title }</Header> }
            {
                (subtitle && subtitle.length && subtitle.length > 0)
                    ? typeof subtitle !== "string" && subtitle.map((line, index) => (
                        <div
                            key={ index }
                            className="subtitle"
                            data-testid={ `${ testId }-sub-header-line-${ index }` }
                        >
                            { line }
                        </div>
                    ))
                    : <div className="subtitle" data-testid={ `${ testId }-sub-header` }>{ subtitle }</div>
            }
            {
                action
                    ? (
                        <div className="action-container" data-testid={ `${ testId }-action-container` }>
                            { action }
                        </div>
                    )
                    : null
            }
        </div>
    );
};

/**
 * Default proptypes for the empty placeholder component.
 */
EmptyPlaceholder.defaultProps = {
    action: null,
    "data-testid": "empty-placeholder",
    image: null,
    imageSize: "auto"
};
