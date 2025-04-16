/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Avatar from "@oxygen-ui/react/Avatar";
import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import IconButton from "@oxygen-ui/react/IconButton";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import className from "classnames";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import { Resource } from "../../models/resources";
import "./resource-panel-item.scss";

/**
 * Props interface of {@link ResourcePanelItem}
 */
export interface ResourcePanelItemProps
    extends IdentifiableComponentInterface,
        Omit<HTMLAttributes<HTMLDivElement>, "resource"> {
    /**
     * The resource item.
     */
    resource: Resource;
    /**
     * The type of the resource item.
     */
    type?: "draggable" | "static";
    /**
     * Callback to be triggered when a resource add button is clicked.
     * @param resource - Added resource.
     */
    onAdd?: (resource: Resource) => void;
}

/**
 * Resource panel item component.
 *
 * @param props - Props injected to the component.
 * @returns The ResourcePanelItem component.
 */
const ResourcePanelItem: FunctionComponent<ResourcePanelItemProps> = ({
    "data-componentid": componentId = "resource-panel-item",
    children,
    resource,
    type = "static",
    onAdd,
    ...rest
}: ResourcePanelItemProps): ReactElement => (
    <>
        {
            children || (
                <Card
                    className={ className("flow-builder-element-panel-item", { [type]: type }) }
                    variant="elevation"
                    data-componentid={ componentId }
                    { ...rest }
                >
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" gap={ 1 }>
                            <Stack direction="row" spacing={ 1 }>
                                <Avatar
                                    src={ resource?.display?.image }
                                    variant="square"
                                    className="flow-builder-element-panel-item-avatar"
                                />
                                <Stack direction="column" spacing={ 0.5 }>
                                    <Typography>{ resource?.display?.label }</Typography>
                                    { resource?.display?.description && (
                                        <Typography variant="body2">{ resource?.display?.description }</Typography>
                                    ) }
                                </Stack>
                            </Stack>
                            { type === "static" && onAdd && (
                                <IconButton
                                    className="flow-builder-element-panel-item-add-button"
                                    onClick={ () => onAdd(resource) }
                                >
                                    <PlusIcon size={ 14 } />
                                </IconButton>
                            ) }
                        </Box>
                    </CardContent>
                </Card>
            )
        }
    </>
);

export default ResourcePanelItem;
