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
 * @param props - CategoryItemPropsInterface
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
        ["data-componentid"]: testId
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
                            { techStackIcons.map((icon: any, index: number) => {
                                const uniqueId: string = `${ categoryName }-tech-stack-icon-${ index }`;

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
    "data-componentid": "category-item",
    iconSize: "default",
    loading: false,
    techStackIcons: undefined
};
