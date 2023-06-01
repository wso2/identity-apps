/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import {
    AnimatedAvatar,
    AppAvatar,
    Code,
    DataTable,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { Header, SemanticICONS } from "semantic-ui-react";
import { AttributeMappingListItem } from "./attribute-mapping-list-item";
import { IDVPClaimMappingInterface, IDVPLocalClaimInterface } from "../../../models";

/**
 * Proptypes for the attribute mapping list component.
 */
export interface AttributeMappingListProps extends IdentifiableComponentInterface {
    /**
     * This contains the mapped attributes list.
     */
    attributeMappingsListToShow: Array<IDVPClaimMappingInterface>;
    /**
     * A list of claims that is available for selecting. This list
     * mostly read only, used for dropdowns and such.
     */
    availableAttributesList: Array<IDVPLocalClaimInterface>;
    /**
     * This contains the already mapped attributes list.
     */
    alreadyMappedAttributesList: Array<IDVPClaimMappingInterface>;
    /**
     * Callback to be called when a mapping is deleted.
     * @param mapping - The mapping that is deleted.
     */
    onMappingDeleted: (mapping: IDVPClaimMappingInterface) => void;
    /**
     * Callback to be called when a mapping is edited.
     * @param oldMapping - The mapping before editing.
     * @param mapping - The mapping after editing.
     */
    onMappingEdited: ( oldMapping: IDVPClaimMappingInterface, mapping: IDVPClaimMappingInterface) => void;
    /**
     * Placeholder to show when there is no data.
     */
    noDataPlaceholder?: ReactNode;
    /**
     * If the list is read only or not.
     */
    readOnly?: boolean;
}

/**
 * This component renders the attribute mappings as a list.
 *
 * @param props - Props injected to the component.
 * @returns - The attribute mapping list component.
 */
export const AttributeMappingList: FunctionComponent<AttributeMappingListProps> = (
    props: AttributeMappingListProps
): ReactElement => {

    const {
        availableAttributesList,
        attributeMappingsListToShow,
        alreadyMappedAttributesList,
        onMappingDeleted,
        onMappingEdited,
        noDataPlaceholder,
        readOnly
    } = props;

    const [ editingMappings, setEditingMappings ] = useState<string[]>([]);

    /**
     * This function is used to check whether actions for the component should be hidden or not.
     *
     * @param localClaim - The local claim that is being checked.
     * @returns Should action be hidden or not.
     */
    const shouldHideAction = ({ localClaim }: IDVPClaimMappingInterface): boolean => {
        return editingMappings.includes(localClaim.id) || readOnly;
    };

    /**
     * Renders the edit and delete actions for the attribute mapping list.
     *
     * @returns An array of table actions.
     */
    const createTableActions = (): TableActionsInterface[] => {
        return [
            {
                hidden: shouldHideAction,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, mapping: IDVPClaimMappingInterface) => {
                    setEditingMappings([ ...editingMappings, mapping.localClaim.id ]);
                },
                popupText: (): string => "Edit",
                renderer: "semantic-icon"
            },
            {
                hidden: shouldHideAction,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, mapping: IDVPClaimMappingInterface) => {
                // In our interface, once user enter into editing mode they
                // cannot delete it unless its updated. So, no need to remove
                // or check for `editingMappings` in this function.
                    onMappingDeleted(mapping);
                },
                popupText: (): string => "Delete",
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Renders the attribute mapping list item in view mode.
     *
     * @param mapping - The mapping to be rendered.
     * @returns The attribute list item in view mode.
     */
    const getAttributeMappingListItemInViewMode = (mapping: IDVPClaimMappingInterface) => {
        return (
            <Header image as="h6" className="header-with-icon">
                <AppAvatar
                    image={ (
                        <AnimatedAvatar
                            name={ mapping.idvpClaim }
                            size="mini"
                        />
                    ) }
                    size="mini"
                    spaced="right"
                />
                <Header.Content>
                    { mapping.idvpClaim }
                    <Header.Subheader>
                        <Code compact withBackground={ false }>
                            { mapping.localClaim.uri }
                        </Code>
                    </Header.Subheader>
                </Header.Content>
            </Header>
        );
    };

    /**
     * Renders the content as table columns.
     *
     * @returns An array of table columns.
     */
    const createTableColumns = (): TableColumnInterface[] => {

        const attributePreviewTableColumn: TableColumnInterface = {
            dataIndex: "claim",
            id: "column-1",
            render(mapping: IDVPClaimMappingInterface): ReactNode {
                return editingMappings.includes(mapping.localClaim.id)
                    ? (
                        <AttributeMappingListItem
                            editingMode
                            mapping={ mapping }
                            availableAttributeList={ availableAttributesList }
                            alreadyMappedAttributesList={ alreadyMappedAttributesList }
                            onSubmit={ (editedMapping: IDVPClaimMappingInterface) => {
                                // Remove it from currently editing mappings.
                                setEditingMappings([
                                    ...editingMappings
                                        .filter((id: string) => id !== mapping.localClaim.id)
                                        .filter((id: string) => id !== editedMapping.localClaim.id)
                                ]);
                                // Once done, notify the parent that a mapping has been
                                // changed with the edited instance itself.
                                onMappingEdited(mapping, editedMapping);
                            } }
                        />
                    ) : getAttributeMappingListItemInViewMode(mapping);
            },
            title: "Mapped Claim"
        };

        return [
            attributePreviewTableColumn,
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: "Actions"
            }
        ] as TableColumnInterface[];
    };

    return (
        <DataTable<IDVPClaimMappingInterface[]>
            className="attributes-mapping-list"
            actions={ createTableActions() }
            columns={ createTableColumns() }
            data={ attributeMappingsListToShow }
            showHeader={ false }
            placeholders={ noDataPlaceholder }
            selectable={ () => false }
            isRowSelectable={ () => false }
            onRowClick={ () => null }
        />
    );

};
