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

import React, { FunctionComponent, ReactElement } from "react";
import { Checkbox, Icon, Label, LabelProps, SemanticCOLORS, Table, TableRowProps } from "semantic-ui-react";

/**
 * Proptypes for the transfer list item label.
 */
interface ItemTypeLabelPropsInterface extends LabelProps {
    labelText: string;
    labelColor: SemanticCOLORS;
    name?: string;
}

/**
 * Proptypes for the transfer list item component.
 */
interface TransferListItemPropsInterface extends TableRowProps {
    listItem: string;
    listItemId: string;
    listItemIndex: number;
    listItemTypeLabel?: ItemTypeLabelPropsInterface;
    isItemChecked: boolean;
    handleItemCheck?: () => void;
    handleItemChange: () => void;
    showSecondaryActions: boolean;
}

/**
 * Transfer list item component.
 *
 * @param {TransferListItemPropsInterface} props - Props injected to the component.
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
        showSecondaryActions
    } = props;

    return (
        <Table.Row>
            <Table.Cell id={ listItemId } key={ listItemIndex } width={ 2 }>
                <Checkbox checked={ isItemChecked } onChange={ handleItemChange } onClick={ handleItemClick} />
            </Table.Cell>
            <Table.Cell id={ listItemId } key={ listItemIndex } width={ 4 }>{ listItem }</Table.Cell>
            {
                listItemTypeLabel && (
                    <Table.Cell
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
                showSecondaryActions && (
                    <Table.Cell key={listItemIndex} width={2}>
                        <Icon color="grey" name="ellipsis vertical"/>
                    </Table.Cell>
                )
            }
        </Table.Row>
    );
};
