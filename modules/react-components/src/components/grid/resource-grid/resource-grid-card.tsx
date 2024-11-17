/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import IconButton from "@oxygen-ui/react/IconButton";
import { ChevronRightIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { ButtonProps } from "semantic-ui-react";
import { LinkButton } from "../../button";
import { InfoCard, InfoCardPropsInterface } from "../../card";
import "./resource-grid-card.scss";

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
        disabledHint,
        editButtonLabel,
        onClick,
        onDelete,
        onEdit,
        isResourceComingSoon,
        resourceCategory,
        resourceDescription,
        resourceDocumentationLink,
        resourceImage,
        resourceName,
        showActions,
        showResourceAction,
        showResourceDelete,
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

    /**
     * Handles the resource delete action.
     *
     * @param e - Click event.
     */
    const onDeleteResource = (e): void => {
        if (onDelete) {
            onDelete(e);
        }
    };

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
            disabledHint={ disabledHint }
            showTooltips={ !(isResourceComingSoon || disabled) && showTooltips }
            onClick={ onClick }
            action={
                showActions && (
                    <div className="actions">
                        <div className="left">
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
                                        <ChevronRightIcon className="info-card-inner-action-icon" />
                                    </LinkButton>
                                )
                            }
                        </div>
                        <div className="right">
                            {
                                showResourceDelete && onDelete && !(isResourceComingSoon || disabled) && (
                                    <IconButton
                                        onClick={ onDeleteResource }
                                        className="delete-button"
                                        data-componentid={ `${ componentId }-item-delete-button` }
                                        data-testid={ `${ testId }-item-delete-button` }
                                    >
                                        <TrashIcon />
                                    </IconButton>
                                )
                            }
                        </div>
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
