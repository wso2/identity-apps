/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import classNames from "classnames";
import React, { FC, ReactElement, ReactNode } from "react";
import { Button, Icon, SemanticICONS } from "semantic-ui-react";

export type CardExpandedNavigationButtonProps = {
    text?: ReactNode;
    className?: string;
    icon?: SemanticICONS;
    primary?: boolean;
    iconPlacement?: "right" | "left";
} & IdentifiableComponentInterface & any;

export const CardExpandedNavigationButton: FC<CardExpandedNavigationButtonProps> = (
    props: CardExpandedNavigationButtonProps
): ReactElement => {

    const {
        text,
        icon,
        className,
        iconPlacement,
        primary,
        ["data-componentid"]: testId,
        ...rest
    } = props;

    return (
        <Button
            { ...rest }
            data-componentid={ testId }
            primary={ primary }
            className={
                classNames(
                    "card-expanded-navigation-button",
                    {
                        "card-rich-navigation-button": !primary
                    },
                    className
                )
            }>
            {
                (iconPlacement === "left" && icon)
                    ? <Icon name={ icon }/>
                    : null
            }
            <span>{ text }</span>
            {
                (iconPlacement === "right" && icon)
                    ? <Icon name={ icon }/>
                    : null
            }
        </Button>
    );
};

/**
 * Default props of {@link CardExpandedNavigationButton}
 */
CardExpandedNavigationButton.defaultProps = {
    "data-componentid": "card-expanded-navigation-button",
    iconPlacement: "right",
    primary: false
};
