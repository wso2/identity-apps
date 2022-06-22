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
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { Checkbox, Icon, Label, LabelProps, Popup, SemanticCOLORS, Table, TableRowProps } from "semantic-ui-react";

/**
 * Proptypes for the transfer list item label.
 */
export interface ItemTypeLabelPropsInterface extends LabelProps {
    labelText: string;
    labelColor: SemanticCOLORS;
    name?: string;
}

/**
 * Proptypes for the transfer list item component.
 */
interface TransferListItemPropsInterface extends TableRowProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    listItem: string | ListItemPropsInterface;
    listItemId: string;
    listItemIndex: number | string;
    listItemTypeLabel?: ItemTypeLabelPropsInterface;
    isItemChecked: boolean;
    handleItemCheck?: () => void;
    handleItemChange: () => void;
    showSecondaryActions: boolean;
    handleOpenPermissionModal?: () => void;
    showListSubItem?: boolean;
    listSubItem?: ReactNode;
    readOnly?: boolean;
}

/**
 * Proptypes for the {@link listItem} when its type is not string.
 */
interface ListItemPropsInterface {
    listItemElement : ReactNode;
    listItemValue : string;
}

/**
 * Transfer list item component.
 *
 * @param {TransferListItemPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const TransferListItem: FunctionComponent<TransferListItemPropsInterface> = (
    props: TransferListItemPropsInterface
): ReactElement => {

    const {
        listItem,
        listItemId,
        listItemIndex,
        listItemTypeLabel,
        isItemChecked,
        handleItemChange,
        handleItemClick,
        showSecondaryActions,
        handleOpenPermissionModal,
        showListSubItem,
        listSubItem,
        readOnly,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const resolveDataTestID = (): string => {
        let listItemValue: string = "";

        if (typeof listItem === "string") {
            listItemValue = listItem;
        } else {
            listItemValue = listItem.listItemValue;
        }

        return listItemValue?.split(" ").length > 0
            ? listItemValue?.replace(" ", "-")
            : listItemValue;
    };

    return (
        <Table.Row key={ listItemIndex }>
            <Table.Cell id={ listItemId } collapsing>
                <Checkbox
                    data-componentid={ `${ componentId }-${ resolveDataTestID() }-checkbox` }
                    data-testid={ `${ testId }-${ resolveDataTestID() }-checkbox` }
                    checked={ isItemChecked }
                    onChange={ handleItemChange }
                    onClick={ handleItemClick }
                    readOnly={ readOnly }
                />
            </Table.Cell>
            {
                listItemTypeLabel && (
                    <Table.Cell
                        collapsing
                        key={ listItemIndex }
                    >
                        <Label
                            color={ listItemTypeLabel.labelColor }
                            content={ listItemTypeLabel.labelText }
                            size="mini"
                            className={ listItemTypeLabel.name }
                        />
                    </Table.Cell>
                )
            }
            {
                showListSubItem
                    ? (
                        <Table.Cell id={ listItemId }>
                            {
                                typeof listItem === "string"
                                    ? <div>{ listItem }</div>
                                    : listItem.listItemElement
                            }
                            <div className={ "transfer-list-sub-content" }>{ listSubItem }</div>
                        </Table.Cell>
                    )
                    : (
                        <Table.Cell id={ listItemId }>
                            {
                                typeof listItem === "string"
                                    ? <div>{ listItem }</div>
                                    : listItem.listItemElement
                            }
                        </Table.Cell>
                    )
            }
            {
                showSecondaryActions && (
                    <Table.Cell collapsing>
                        <Popup
                            inverted
                            basic
                            content="View permissions"
                            trigger={ (
                                <Icon
                                    data-componentid={ `${ componentId }-${ resolveDataTestID() }-icon` }
                                    data-testid={ `${ testId }-${ resolveDataTestID() }-icon` }
                                    color="grey"
                                    name="key"
                                    onClick={ handleOpenPermissionModal }
                                />
                            ) }
                        />
                    </Table.Cell>
                )
            }
        </Table.Row>
    );
};

/**
 * Default props for the transfer list item component.
 */
TransferListItem.defaultProps = {
    "data-componentid": "transfer-list-item",
    "data-testid": "transfer-list-item",
    showListSubItem: false
};
