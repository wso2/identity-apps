/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { Header } from "semantic-ui-react";
import { ThemeIconSizes } from "./icon";

/**
 * Proptypes for the placeholder component. Also see
 * {@link EmptyPlaceholder.defaultProps}
 */
interface EmptyPlaceholderProps extends TestableComponentInterface {
    action?: React.ReactNode;
    image?: any;
    imageSize?: ThemeIconSizes;
    subtitle: string | string[];
    title: string;
}

/**
 * Placeholder component.
 *
 * @param {EmptyPlaceholderProps} props - Props injected in to the placeholder component.
 * @return {JSX.Element}
 */
export const EmptyPlaceholder: FunctionComponent<EmptyPlaceholderProps> = (
    props: EmptyPlaceholderProps
): JSX.Element => {

    const {
        action,
        image,
        imageSize,
        subtitle,
        title,
        ["data-testid"]: testId
    } = props;

    return (
        <div className="empty-placeholder" data-testid={ testId }>
            {
                image
                    ? (
                        <div className="image-container">
                            <GenericIcon icon={ image } size={ imageSize } transparent/>
                        </div>
                    )
                    : null
            }
            <Header as="h4" className="title">{ title }</Header>
            {
                (subtitle && subtitle.length && subtitle.length > 0)
                    ? typeof subtitle !== "string" && subtitle.map((line, index) => (
                    <div key={ index } className="subtitle">{ line }</div>
                ))
                    : <div className="subtitle">{ subtitle }</div>
            }
            {
                action
                    ? <div className="action-container">{ action }</div>
                    : null
            }
        </div>
    );
};

/**
 * Default proptypes for the empty placeholder component.
 * Also see {@link EmptyPlaceholderProps}
 */
EmptyPlaceholder.defaultProps = {
    action: null,
    "data-testid": "empty-placeholder",
    image: null,
    imageSize: "auto"
};
