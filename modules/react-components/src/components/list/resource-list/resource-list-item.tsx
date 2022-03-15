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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import {
    Dropdown,
    DropdownItemProps,
    Grid,
    Icon,
    List,
    ListItemProps,
    Popup,
    SemanticFLOATS,
    SemanticICONS,
    SemanticWIDTHS,
    StrictGridRowProps
} from "semantic-ui-react";

/**
 * Proptypes for the resource list item component.
 */
export interface ResourceListItemPropsInterface extends ListItemProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * List items actions.
     */
    actions?: ResourceListActionInterface[];
    /**
     * Action panel float direction.
     */
    actionsFloated?: SemanticFLOATS;
    /**
     * Width of the action panel column.
     */
    actionsColumnWidth?: SemanticWIDTHS;
    /**
     * Avatar to be displayed on the list item.
     * Can be either {@link UserAvatar} or {@link AppAvatar}
     */
    avatar?: ReactNode;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * List item header.
     */
    itemHeader: string | ReactNode;
    /**
     * List item description
     */
    itemDescription?: string | ReactNode;
    /**
     * Width of the description area.
     */
    descriptionColumnWidth?: SemanticWIDTHS;
    /**
     * Meta info about the list item.
     */
    metaContent?: ReactNode | ReactNode[];
    /**
     * Width of the meta info area.
     */
    metaColumnWidth?: SemanticWIDTHS;
}

/**
 * Resource list action interface.
 */
export interface ResourceListActionInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    disabled?: boolean;
    hidden?: boolean;
    icon: SemanticICONS;
    popupHeader?: ReactNode;
    onClick?: () => void;
    popupText?: ReactNode;
    subActions?: DropdownItemProps[];
    type: "button" | "dropdown";
}

/**
 * Resource list item component.
 *
 * @param {ResourceListItemPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ResourceListItem: FunctionComponent<ResourceListItemPropsInterface> = (
    props: ResourceListItemPropsInterface
): ReactElement => {

    const {
        actions,
        actionsColumnWidth,
        actionsFloated,
        avatar,
        className,
        descriptionColumnWidth,
        itemDescription,
        itemHeader,
        metaContent,
        metaColumnWidth,
        popupHeader,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames("resource-list-item", className);

    return (
        <List.Item
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            <Grid>
                <Grid.Row
                    columns={
                        metaContent instanceof Array
                            ? (metaContent.length + 2) as StrictGridRowProps[ "columns" ]
                            : (itemHeader || itemDescription)
                                ? 3
                                : 2
                    }
                >
                    { (itemDescription || itemHeader)
                        ? (
                            <Grid.Column width={ descriptionColumnWidth } className="resource-item-column">
                                { avatar }
                                <List.Content>
                                    <List.Header
                                        className="list-item-name"
                                        data-componentid={ `${ componentId }-heading` }
                                        data-testid={ `${ testId }-heading` }
                                    >
                                        { itemHeader }
                                    </List.Header>
                                    { itemDescription && (
                                        <List.Description
                                            className="list-item-description"
                                            data-componentid={ `${ componentId }-description` }
                                            data-testid={ `${ testId }-description` }
                                        >
                                            { itemDescription }
                                        </List.Description>
                                    ) }
                                </List.Content>
                            </Grid.Column>
                        )
                        : null
                    }
                    {
                        metaContent instanceof Array
                            ? (
                                metaContent?.map((content, index) => {
                                    return (
                                        <Grid.Column key={ index } width={ metaColumnWidth } verticalAlign="middle">
                                            <List.Content
                                                data-componentid={ `${ componentId }-meta-content-${ index }` }
                                                data-testid={ `${ testId }-meta-content-${ index }` }
                                            >
                                                { content }
                                            </List.Content>
                                        </Grid.Column>
                                    );
                                })
                            )
                            : (
                                <Grid.Column width={ metaColumnWidth } verticalAlign="middle">
                                    <List.Content
                                        data-componentid={ `${ componentId }-meta-content` }
                                        data-testid={ `${ testId }-meta-content` }
                                    >
                                        { metaContent }
                                    </List.Content>
                                </Grid.Column>
                            )
                    }
                    <Grid.Column width={ actionsColumnWidth }>
                        <List.Content
                            floated={ actionsFloated }
                            className="list-item-action-panel"
                            data-componentid={ `${ componentId }-actions` }
                            data-testid={ `${ testId }-actions` }
                        >
                            {
                                (actions && actions.length && actions.length > 0)
                                    ? actions.map((action, index) => (
                                        !action.hidden && (
                                            <div className="list-item-action" key={ index }>
                                                {
                                                    action.type === "dropdown"
                                                        ? (
                                                            <Dropdown
                                                                direction="left"
                                                                icon={ null }
                                                                trigger={ (
                                                                    <Popup
                                                                        disabled={ action.disabled }
                                                                        trigger={ (
                                                                            <Icon
                                                                                data-componentid={
                                                                                    action[ "data-componentid" ]
                                                                                }
                                                                                data-testid={ action[ "data-testid" ] }
                                                                                link
                                                                                className="list-icon"
                                                                                disabled={ action.disabled }
                                                                                size="small"
                                                                                color="grey"
                                                                                name={ action.icon }
                                                                                onClick={ action.onClick }
                                                                            />
                                                                        ) }
                                                                        position="top center"
                                                                        content={ action.popupText }
                                                                        inverted
                                                                    />
                                                                ) }
                                                                options={ action.subActions }
                                                                data-componentid={
                                                                    `${ componentId }-action-${
                                                                        action.type
                                                                    }-${ index }`
                                                                }
                                                                data-testid={
                                                                    `${ testId }-action-${ action.type }-${ index }`
                                                                }
                                                            />
                                                        ) :
                                                        (
                                                            <Popup
                                                                header={ popupHeader }
                                                                trigger={ (
                                                                    <div>
                                                                        <Icon
                                                                            data-componentid={
                                                                                action[ "data-componentid" ]
                                                                            }
                                                                            data-testid={ action[ "data-testid" ] }
                                                                            link
                                                                            className="list-icon"
                                                                            disabled={ action.disabled }
                                                                            size="small"
                                                                            color="grey"
                                                                            name={ action.icon }
                                                                            onClick={
                                                                                action.disabled
                                                                                    ? (e: React.SyntheticEvent) => {
                                                                                        e?.preventDefault();
                                                                                    }
                                                                                    : action.onClick
                                                                            }
                                                                        />
                                                                    </div>
                                                                ) }
                                                                position="top center"
                                                                content={ action.popupText }
                                                                inverted
                                                            />
                                                        )
                                                }
                                            </div>
                                        )
                                    ))
                                    : null
                            }
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </List.Item>
    );
};

/**
 * Default proptypes for the resource list item component.
 */
ResourceListItem.defaultProps = {
    actionsColumnWidth: 5,
    actionsFloated: "left",
    "data-componentid": "resource-list-item",
    "data-testid": "resource-list-item",
    descriptionColumnWidth: 7,
    metaColumnWidth: 4,
    popupHeader: null
};
