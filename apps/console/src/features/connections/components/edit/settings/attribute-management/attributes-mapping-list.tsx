/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Code, Popup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Table } from "semantic-ui-react";
import { AttributeMappingListItem } from "./attribute-mapping-list-item";
import {
    ConnectionClaimInterface,
    ConnectionCommonClaimMappingInterface
} from "../../../../models/connection";

export interface AttributeMappingListProps extends TestableComponentInterface {
    /**
     * This contains the mapped attributes list.
     */
    attributeMappingsListToShow: Array<ConnectionCommonClaimMappingInterface>;
    /**
     * A list of claims that is available for selecting. This list
     * mostly read only, used for dropdowns and such.
     */
    availableAttributesList: Array<ConnectionClaimInterface>;
    alreadyMappedAttributesList: Array<ConnectionCommonClaimMappingInterface>;
    noDataPlaceholder?: ReactNode;
    onMappingDeleted: (mapping: ConnectionCommonClaimMappingInterface) => void;
    onMappingEdited: (
        oldMapping: ConnectionCommonClaimMappingInterface,
        mapping: ConnectionCommonClaimMappingInterface
    ) => void;
    readOnly?: boolean;
}

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

    const { t } = useTranslation();

    const [ editingMappings, setEditingMappings ] = useState<string[]>([]);

    const handleOnSubmit = (
        editedMapping: ConnectionCommonClaimMappingInterface,
        mapping: ConnectionCommonClaimMappingInterface
    ) => {
    // Remove it from currently editing mappings.
        setEditingMappings([
            ...editingMappings
                .filter((id: string) => id !== mapping.claim.id)
                .filter((id: string) => id !== editedMapping.claim.id)
        ]);
        // Once done, notify the parent that a mapping has been
        // changed with the edited instance itself.
        onMappingEdited(mapping, editedMapping);
    };

    if (attributeMappingsListToShow.length === 0) {
        return (
            <Table.Row>
                <Table.Cell colSpan="3">
                    { noDataPlaceholder }
                </Table.Cell>
            </Table.Row>
        );
    }

    return (
        <>
            { attributeMappingsListToShow.map(
                (
                    mapping: ConnectionCommonClaimMappingInterface,
                    index: number
                ) => (
                    mapping.mappedValue ? (
                        <Table.Row key={ index }>
                            { editingMappings.includes(mapping?.claim?.id)
                                ? (
                                    <Table.Cell colSpan="3">
                                        <AttributeMappingListItem
                                            mapping={ mapping }
                                            availableAttributeList={ availableAttributesList }
                                            alreadyMappedAttributesList={ alreadyMappedAttributesList }
                                            onSubmit={ (editedMapping: ConnectionCommonClaimMappingInterface) =>
                                                handleOnSubmit(editedMapping, mapping)
                                            }
                                        />
                                    </Table.Cell>
                                )
                                : (
                                    <>
                                        <Table.Cell>
                                            <div>{ mapping?.mappedValue }</div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div>{ mapping?.claim?.displayName }</div>
                                            <Popup
                                                content={ mapping?.claim?.uri }
                                                inverted
                                                trigger={ <Code>{ mapping?.claim?.uri }</Code> }
                                                position="bottom left"
                                            ></Popup>
                                        </Table.Cell>
                                        { !readOnly ? (
                                            <Table.Cell textAlign="right">
                                                <Popup
                                                    trigger={ (
                                                        <Icon
                                                            link={ true }
                                                            className="list-icon pr-4"
                                                            size="small"
                                                            color="grey"
                                                            name="pencil alternate"
                                                            onClick={ () =>
                                                                setEditingMappings([
                                                                    ...editingMappings,
                                                                    mapping?.claim?.id
                                                                ])
                                                            }
                                                        />
                                                    ) }
                                                    position="top right"
                                                    content={ t("common:edit") }
                                                    inverted
                                                />
                                                <Popup
                                                    trigger={ (
                                                        <Icon
                                                            link={ true }
                                                            className="list-icon pr-4"
                                                            size="small"
                                                            color="grey"
                                                            name="trash alternate"
                                                            onClick={ () => onMappingDeleted(mapping) }
                                                        />
                                                    ) }
                                                    position="top right"
                                                    content={ t("common:remove") }
                                                    inverted
                                                />
                                            </Table.Cell>
                                        ) : null }
                                    </>
                                )
                            }
                        </Table.Row>
                    ) : null
                )
            ) }
        </>
    );
};
