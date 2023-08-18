/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Code, Popup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Table } from "semantic-ui-react";
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
    alreadyMappedAttributesList: Array<IdentityProviderCommonClaimMappingInterface>;
    noDataPlaceholder?: ReactNode;
    onMappingDeleted: (mapping: IdentityProviderCommonClaimMappingInterface) => void;
    onMappingEdited: (
        oldMapping: IdentityProviderCommonClaimMappingInterface,
        mapping: IdentityProviderCommonClaimMappingInterface
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
        editedMapping: IdentityProviderCommonClaimMappingInterface,
        mapping: IdentityProviderCommonClaimMappingInterface
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
                    mapping: IdentityProviderCommonClaimMappingInterface,
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
                                            onSubmit={ (editedMapping: IdentityProviderCommonClaimMappingInterface) =>
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
                                        { (!readOnly || !editingMappings.includes(mapping?.claim?.id)) ? (
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
