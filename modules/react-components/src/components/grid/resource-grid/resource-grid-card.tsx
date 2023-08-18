/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { ButtonProps, Icon } from "semantic-ui-react";
import { LinkButton } from "../../button";
import { InfoCard, InfoCardPropsInterface } from "../../card";

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
     * @param e - Click event.
     */
    onDelete?: (e: MouseEvent<HTMLDivElement>) => void;
    /**
     * On resource edit callback.
     * @param e - Click event.
     * @param data - Button data.
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
    /**
     * Show resource actions.
     */
    showResourceAction?: boolean;
    /**
     * Show resource setup guide button.
     */
    showResourceSetupGuide?: boolean;
}

/**
 * Resource Grid Card component.
 *
 * @param props - Props injected to the component.
 * @returns the Resource grid card component.
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
        onClick,
        onEdit,
        isResourceComingSoon,
        resourceCategory,
        resourceDescription,
        resourceDocumentationLink,
        resourceImage,
        resourceName,
        showActions,
        showResourceAction,
        showSetupGuideButton,
        showResourceEdit,
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
            navigationLink ={ resourceDocumentationLink }
            disabled={ isResourceComingSoon || disabled }
            showTooltips={ !(isResourceComingSoon || disabled) && showTooltips }
            onClick={ onClick }
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
                                    <Icon name="chevron right"/>
                                </LinkButton>
                            )
                        }
                    </div>
                )
            }
            showCardAction={ showResourceAction }
            showSetupGuideButton= { showSetupGuideButton }
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
    editButtonLabel: "Edit",
    imageOptions: {
        floated: false,
        inline: true
    },
    imageSize: "mini",
    showResourceActions: true,
    showTooltips: true
};
