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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { ButtonProps, Icon } from "semantic-ui-react";
import { LinkButton } from "../../button";
import { InfoCard, InfoCardPropsInterface } from "../../card";
import { GenericIcon } from "../../icon";

/**
 * Interface for the Resource Grid Card component.
 */
export interface ResourceGridCardPropsInterface extends InfoCardPropsInterface, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Is resource disabled.
     */
    disabled?: boolean;
    /**
     * Edit button label.
     */
    editButtonLabel?: ReactNode;
    /**
     * On resource delete callback.
     * @param {React.MouseEvent<HTMLDivElement>} e - Click event.
     */
    onDelete?: (e: MouseEvent<HTMLDivElement>) => void;
    /**
     * On resource edit callback.
     * @param {React.MouseEvent<HTMLButtonElement>} e - Click event.
     * @param {ButtonProps} data - Button data.
     */
    onEdit?: (e: MouseEvent<HTMLButtonElement>, data: ButtonProps) => void;
    /**
     * Name of the resource.
     */
    resourceCategory?: InfoCardPropsInterface[ "subHeader" ];
    /**
     * Description of the resource.
     */
    resourceDescription?: InfoCardPropsInterface[ "description" ];
    /**
     * Description of the resource.
     */
    resourceImage?: InfoCardPropsInterface[ "image" ];
    /**
     * Name of the resource.
     */
    resourceName?: InfoCardPropsInterface[ "header" ];
    /**
     * Should show actions panel.
     */
    showActions?: boolean;
    /**
     * Should show resource delete option.
     */
    showResourceDelete?: boolean;
    /**
     * Should show resource edit option.
     */
    showResourceEdit?: boolean;
    /**
     * Is resource a coming soon feature?.
     */
    isResourceComingSoon?: boolean;
    /**
     * Coming soon ribbon label.
     */
    comingSoonRibbonLabel?: ReactNode;
}

/**
 * Resource Grid Card component.
 *
 * @param {PropsWithChildren<ResourceGridCardPropsInterface>} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ResourceGridCard: FunctionComponent<PropsWithChildren<ResourceGridCardPropsInterface>> = (
    props: PropsWithChildren<ResourceGridCardPropsInterface>
): ReactElement => {

    const {
        className,
        children,
        comingSoonRibbonLabel,
        disabled,
        editButtonLabel,
        onDelete,
        onEdit,
        isResourceComingSoon,
        resourceCategory,
        resourceDescription,
        resourceImage,
        resourceName,
        showActions,
        showResourceEdit,
        showResourceDelete,
        showTooltips,
        testId,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const classes = classNames(
        "resource-grid-card",
        className
    );

    return (
        <InfoCard
            className={ classes }
            ribbon={ isResourceComingSoon && comingSoonRibbonLabel }
            header={ resourceName }
            subHeader={ resourceCategory }
            description={ resourceDescription }
            image={ resourceImage }
            disabled={ isResourceComingSoon || disabled }
            showTooltips={ !(isResourceComingSoon || disabled) && showTooltips }
            action={
                showActions && (
                    <div className="actions">
                        {
                            showResourceEdit && onEdit && (
                                <LinkButton
                                    disabled={ isResourceComingSoon || disabled }
                                    hoverType="underline"
                                    className="info-card-inner-action"
                                    onClick={ onEdit }
                                    data-componentid={ `${ componentId }-item-edit-button` }
                                    data-testid={ `${ testId }-item-edit-button` }
                                >
                                    { editButtonLabel }
                                    <Icon name="caret right"/>
                                </LinkButton>
                            )
                        }
                        {
                            showResourceDelete && onDelete && !(isResourceComingSoon || disabled) && (
                                <GenericIcon
                                    square
                                    hoverable
                                    transparent
                                    floated="right"
                                    className="delete-button"
                                    icon={ <Icon name="trash alternate"/> }
                                    data-componentid={ `${ componentId }-item-delete-button` }
                                    data-testid={ `${ testId }-item-delete-button` }
                                    onClick={ onDelete }
                                />
                            )
                        }
                    </div>
                )
            }
            data-componentid={ componentId }
            { ...rest }
        >
            { children }
        </InfoCard>
    );
};

/**
 * Default props for the component.
 */
ResourceGridCard.defaultProps = {
    comingSoonRibbonLabel: "Coming Soon",
    "data-componentid": "resource-grid-card",
    "data-testid": "resource-grid-card",
    editButtonLabel: "Configure",
    imageOptions: {
        floated: false,
        inline: true
    },
    imageSize: "micro",
    showTooltips: true
};
