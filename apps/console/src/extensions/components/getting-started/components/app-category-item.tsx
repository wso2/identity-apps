/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, GenericIconProps, Text } from "@wso2is/react-components";
import React, { CSSProperties, FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { DynamicTile } from "./dynamic-tile";

export type CategoryItemPropsInterface = {
    categoryName: string;
    onClick: (event: React.SyntheticEvent) => void;
    comingSoon?: boolean;
    techStackIcons?: [
        GenericIconProps["icon"],
        GenericIconProps["icon"]?,
        GenericIconProps["icon"]?
    ];
    iconSize?: GenericIconProps["size"];
    loading?: boolean;
    className?: string;
    style?: CSSProperties;
} & IdentifiableComponentInterface;

/**
 * A category item denotes top level application template type.
 * @param props {CategoryItemPropsInterface}
 * @constructor
 */
export const CategoryItem: FC<CategoryItemPropsInterface> = (
    props: CategoryItemPropsInterface
): ReactElement => {

    const {
        categoryName,
        iconSize,
        techStackIcons,
        onClick,
        comingSoon,
        className,
        style,
        ["data-componentid"]: testId,
    } = props;

    const { t } = useTranslation();

    const technologyLogoRowStyles = (): CSSProperties => ({
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: "5px"
    });

    return (
        <DynamicTile
            data-componentid={ testId }
            style={ style }
            className={ className }
            disabled={ comingSoon }
            grayedOut={ comingSoon }
            whiteBackground
            clipped
            onClick={ (event: React.SyntheticEvent) => {
                event?.preventDefault();
                onClick(event);
            } }
            body={
                (
                    <div
                        style={ {
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "5px"
                        } }>
                        {
                            comingSoon
                                ? (
                                    <div className="coming-soon-ribbon">
                                        { t("common:comingSoon") }
                                    </div>
                                )
                                : null
                        }
                        <div style={ technologyLogoRowStyles() }>
                            { techStackIcons.map((icon, index) => {
                                const uniqueId = `${ categoryName }-tech-stack-icon-${ index }`;

                                return (
                                    <GenericIcon
                                        disabled={ comingSoon }
                                        key={ uniqueId }
                                        fill="primary"
                                        data-componentid={ uniqueId }
                                        data-testid={ uniqueId }
                                        className="card-image"
                                        size={ iconSize }
                                        icon={ icon }
                                        square
                                        transparent
                                    />
                                );
                            }) }
                        </div>
                        <Text
                            muted={ comingSoon }
                            className="text-center px-2">
                            { categoryName }
                        </Text>
                    </div>
                )
            }
        />
    );

};

/**
 * Default props of {@link CategoryItem}
 */
CategoryItem.defaultProps = {
    comingSoon: false,
    iconSize: "default",
    loading: false,
    techStackIcons: undefined,
    "data-componentid": "category-item"
};
