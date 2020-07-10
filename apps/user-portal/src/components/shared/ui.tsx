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

import { resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { Logo } from "@wso2is/react-components";
import classNames from "classnames";
import * as React from "react";
import { Image } from "semantic-ui-react";
import { UserImage } from "../../configs";
import { store } from "../../store";

interface ImageProps {
    classes?: any;
    size?: any;
    style?: any;
    floated?: "left" | "right";
}

interface TitleProps {
    classes?: any;
    style?: any;
    children?: any;
}

/**
 * TODO: Remove once `layouts/login` is removed.
 * @deprecated Use `ProductBrand` from `@wso2is/react-components`.
 */
export const Title = (props: TitleProps) => {
    const { classes, style, children } = props;

    return (
        <div className={ classNames(classes, "product-title") } style={ style }>
            <Logo
                className="portal-logo"
                image={
                    resolveAppLogoFilePath(window["AppUtils"].getConfig().ui.appLogoPath,
                        `${window["AppUtils"].getConfig().clientOrigin}/` +
                        `${window["AppUtils"].getConfig().appBase}/libs/themes/default`)
                }
            />
            <h1 className={ classNames(classes, "product-title-text") } style={ style }>
                { store.getState().config.ui.appName }
            </h1>
            { children }
        </div>
    );
};

export const UserImagePlaceHolder = (props: ImageProps) => {
    const { classes, size, floated } = props;

    return (
        <Image
            className={ classNames(classes, "user-image") }
            src={ UserImage }
            size={ size }
            floated={ floated }
            circular
            centered
        />
    );
};
