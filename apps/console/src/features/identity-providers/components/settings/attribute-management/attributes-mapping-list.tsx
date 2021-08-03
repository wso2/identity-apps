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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    Code,
    DataTable,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { Header, SemanticICONS } from "semantic-ui-react";
import { AttributeMappingListItem } from "./attribute-mapping-list-item";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../models";

export interface AttributeMappingListProps extends TestableComponentInterface {
    /**
     * This contains the mapped attributes list.
     */
    attributeMappingsListToShow: Array<IdentityProviderCommonClaimMappingInterface>;
    /**
     * A list of claims that is available for selecting. This list
     * mostly read only, used for dropdowns and such.
     */
    availableAttributesList: Array<IdentityProviderClaimInterface>;
    noDataPlaceholder?: ReactNode;
    onMappingDeleted: (mapping: IdentityProviderCommonClaimMappingInterface) => void;
    onMappingEdited: (
        oldMapping: IdentityProviderCommonClaimMappingInterface,
        mapping: IdentityProviderCommonClaimMappingInterface
    ) => void;
}

export const AttributeMappingList: FunctionComponent<AttributeMappingListProps> = (
    props: AttributeMappingListProps
): ReactElement => {

    const {
        availableAttributesList,
        attributeMappingsListToShow,
        onMappingDeleted,
        onMappingEdited,
        noDataPlaceholder
    } = props;

    const [ editingMappings, setEditingMappings ] = useState<string[]>([]);

    const createTableActions = (): TableActionsInterface[] => {
        return [ {
            hidden: ({ claim }: IdentityProviderCommonClaimMappingInterface) =>
                editingMappings.includes(claim.id),
            icon: (): SemanticICONS => "pencil alternate",
            onClick(e, mapping: IdentityProviderCommonClaimMappingInterface) {
                setEditingMappings([ ...editingMappings, mapping.claim.id ]);
            },
            popupText: (): string => "Edit",
            renderer: "semantic-icon"
        }, {
            hidden: ({ claim }: IdentityProviderCommonClaimMappingInterface) =>
                editingMappings.includes(claim.id),
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e, mapping: IdentityProviderCommonClaimMappingInterface) => {
                // In our interface, once user enter into editing mode they
                // cannot delete it unless its updated. So, no need to remove
                // or check for `editingMappings` in this function.
                onMappingDeleted(mapping);
            },
            popupText: (): string => "Delete",
            renderer: "semantic-icon"
        } ];
    };

    const createTableColumns = (): TableColumnInterface[] => {

        const attributePreviewTableColumn: TableColumnInterface = {
            dataIndex: "claim",
            id: "column-1",
            render(mapping: IdentityProviderCommonClaimMappingInterface): ReactNode {
                return editingMappings.includes(mapping.claim.id) ? (
                    <AttributeMappingListItem
                        editingMode
                        mapping={ mapping }
                        availableAttributeList={ availableAttributesList }
                        onSubmit={ (editedMapping) => {
                            // Remove it from currently editing mappings.
                            setEditingMappings([
                                ...editingMappings
                                    .filter(id => id !== mapping.claim.id)
                                    .filter(id => id !== editedMapping.claim.id)
                            ]);
                            // Once done, notify the parent that a mapping has been
                            // changed with the edited instance itself.
                            onMappingEdited(mapping, editedMapping);
                        } }
                    />
                ) : (
                    <Header image as="h6" className="header-with-icon">
                        <AppAvatar
                            image={
                                <AnimatedAvatar
                                    name={ mapping.mappedValue }
                                    size="mini"/>
                            }
                            size="mini"
                            spaced="right"
                        />
                        <Header.Content>
                            { mapping.mappedValue }
                            <Header.Subheader>
                                <Code compact withBackground={ false }>
                                    { mapping.claim.uri }
                                </Code>
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                );
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
        <DataTable<IdentityProviderCommonClaimMappingInterface[]>
            className="attributes-mapping-list"
            actions={ createTableActions() }
            columns={ createTableColumns() }
            data={ attributeMappingsListToShow }
            showHeader={ false }
            placeholders={ noDataPlaceholder }
            selectable={ () => false }
            isRowSelectable={ () => false }
            onRowClick={ () => ({ /*Noop*/ }) }
        />
    );

};
