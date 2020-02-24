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

import classNames from "classnames";
import React, { FunctionComponent } from "react";
import {
    Dropdown,
    DropdownItemProps,
    Grid,
    Icon,
    List,
    ListItemProps,
    Popup,
    SemanticICONS,
    SemanticWIDTHS
} from "semantic-ui-react";

/**
 * Proptypes for the resource list item component.
 */
interface ResourceListItemPropsInterface extends ListItemProps {
    /**
     * List items actions.
     */
    actions?: ResourceListAction[];
    /**
     * Width of the action panel column.
     */
    actionsColumnWidth?: SemanticWIDTHS;
    /**
     * Avatar to be displayed on the list item.
     * Can be either {@link UserAvatar} or {@link AppAvatar}
     */
    avatar?: React.ReactNode;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * List item header.
     */
    itemHeader: string;
    /**
     * List item description
     */
    itemDescription?: string;
    /**
     * Width of the description area.
     */
    descriptionColumnWidth?: SemanticWIDTHS;
    /**
     * Meta info about the list item.
     */
    metaContent?: React.ReactNode;
    /**
     * Width of the meta info area.
     */
    metaColumnWidth?: SemanticWIDTHS;
}

/**
 * Resource list action interface.
 */
interface ResourceListAction {
    icon: SemanticICONS;
    onClick?: () => void;
    popupText?: string;
    subActions?: DropdownItemProps[];
    type: "button" | "dropdown";
}

/**
 * Resource list item component.
 *
 * @param {ResourceListItemPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const ResourceListItem: FunctionComponent<ResourceListItemPropsInterface> = (
    props: ResourceListItemPropsInterface
): JSX.Element => {

    const {
        actions,
        actionsColumnWidth,
        avatar,
        className,
        descriptionColumnWidth,
        itemDescription,
        itemHeader,
        metaContent,
        metaColumnWidth
    } = props;

    const classes = classNames("resource-list-item", className);

    return (
        <List.Item className={ classes }>
            <Grid>
                <Grid.Row columns={ 3 }>
                    <Grid.Column width={ descriptionColumnWidth }>
                        { avatar }
                        <List.Content>
                            <List.Header className="list-item-name">{ itemHeader }</List.Header>
                            <List.Description className="list-item-description">{ itemDescription }</List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column width={ metaColumnWidth }>
                        <List.Content>{ metaContent }</List.Content>
                    </Grid.Column>
                    <Grid.Column width={ actionsColumnWidth }>
                        <List.Content floated="right" className="list-item-action-panel">
                            {
                                (actions && actions.length && actions.length > 0)
                                    ? actions.map((action, index) => (
                                        <div className="list-item-action" key={ index }>
                                            {
                                                action.type === "dropdown"
                                                    ? (
                                                        <Dropdown
                                                            direction="left"
                                                            icon={ null }
                                                            trigger={ (
                                                                <Popup
                                                                    trigger={ (
                                                                        <Icon
                                                                            link
                                                                            className="list-icon"
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
                                                        />
                                                    ) :
                                                    (
                                                        <Popup
                                                            trigger={ (
                                                                <Icon
                                                                    link
                                                                    className="list-icon"
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
                                                    )
                                            }
                                        </div>
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
    descriptionColumnWidth: 7,
    metaColumnWidth: 4
};
