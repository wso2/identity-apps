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

import { Dimmer, Loader, LoaderProps } from "semantic-ui-react";
import React, { FunctionComponent } from "react";
import classNames from "classnames";

/**
 * Content loader component Prop types.
 */
export interface ContentLoaderPropsInterface extends LoaderProps {
    /**
     * Addition classes.
     */
    className?: string;
    /**
     * Text to be displayed.
     */
    text?: string;
    /**
     * If the dimmer should be visible or not.
     */
    dimmer?: boolean;
}

/**
 * Content loader component.
 *
 * @param {ContentLoaderPropsInterface} props - Props injected to the global loader component.
 * @return {JSX.Element}
 */
export const ContentLoader: FunctionComponent<ContentLoaderPropsInterface> = (
    props: ContentLoaderPropsInterface
): JSX.Element => {

    const {
        className,
        dimmer,
        text,
        rest
    } = props;

    const classes = classNames(
        "loaders content-loader"
        , className
    );

    return (
        <div className={ classes }>
            <Dimmer active={ dimmer } inverted>
                <Loader { ...rest } inverted>{ text }</Loader>
            </Dimmer>
        </div>
    );
};

/**
 * Content loader component default props.
 */
ContentLoader.defaultProps = {
    dimmer: true,
    text: null
};
