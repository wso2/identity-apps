/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
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
    iconPlacement: "right",
    primary: false,
    "data-componentid": "card-expanded-navigation-button"
};
