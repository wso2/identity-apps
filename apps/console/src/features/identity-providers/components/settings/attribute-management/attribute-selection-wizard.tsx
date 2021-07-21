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

import React, { FC, useState } from "react";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../models";
import { TestableComponentInterface } from "@wso2is/core/models";
import { useTranslation } from "react-i18next";
import { CheckboxProps, InputOnChangeData, Modal } from "semantic-ui-react";
import {
    Code,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import lowerCase from "lodash-es/lowerCase";

interface AttributeSelectionWizardProps extends TestableComponentInterface {
    /**
     * This property contains the attributes which are available
     * both checked or unchecked.
     */
    attributesList: IdentityProviderClaimInterface[];
    /**
     * Contains only the selected attributes it will have both the
     * {@link IdentityProviderClaimInterface} and mapping {@link string}
     */
    selectedAttributeMappings: IdentityProviderCommonClaimMappingInterface[];
    onAttributesSelected?: (mappings: IdentityProviderCommonClaimMappingInterface[]) => void;
    show: boolean;
    onClose: () => void;
}

export const AttributeSelectionWizard: FC<AttributeSelectionWizardProps> = (
    props: AttributeSelectionWizardProps
) => {

    const {
        attributesList,
        selectedAttributeMappings,
        onAttributesSelected,
        show,
        onClose
    } = props;

    const { t } = useTranslation();
    const [ selectAllClaimsCheckboxChecked, setSelectAllClaimsCheckboxChecked ] = useState(false);
    const [ tempSelectedMappings, setTempSelectedMappings ] = useState<IdentityProviderCommonClaimMappingInterface[]>([]);
    const [ searchQuery, setSearchQuery ] = useState<string>("");

    const onSelectAllClaimsCheckboxChanged = (
        event: React.FormEvent<HTMLInputElement>,
        { checked }: CheckboxProps
    ): void => {
        setSelectAllClaimsCheckboxChecked(checked);
    };

    const onSearchInputChanged = (
        event: React.ChangeEvent<HTMLInputElement>,
        { value }: InputOnChangeData
    ): void => {
        setSearchQuery(value);
    };

    const onUpdateSelectedAttributes = (): void => {
        onAttributesSelected(tempSelectedMappings);
        onClose();
    };

    const getMatchingAttributesSorted = () => {
        return attributesList
            ?.filter((mapping) =>
                isEmpty(searchQuery)
                    ? true
                    : lowerCase(mapping.displayName)?.startsWith(lowerCase(searchQuery))
            )
            ?.sort(
                (a, b) =>
                    lowerCase(a.displayName)?.localeCompare(lowerCase(b.displayName))
            );
    };

    return (
        <Modal open={ show } size="large" className="user-roles attribute-modal">

            <Modal.Header>
                Update attribute selection
                <Heading subHeading ellipsis as="h6">
                    Add new attributes or remove existing attributes.
                </Heading>
            </Modal.Header>

            <Modal.Content image>
                <TransferComponent
                    selectionComponent
                    searchPlaceholder={ "Search attributes" }
                    handleHeaderCheckboxChange={ onSelectAllClaimsCheckboxChanged as any }
                    isHeaderCheckboxChecked={ selectAllClaimsCheckboxChecked }
                    handleUnelectedListSearch={ onSearchInputChanged }
                >
                    <TransferList
                        selectionComponent
                        isListEmpty={ attributesList.length === 0 }
                        listType="unselected"
                    >
                        {
                            /** If theres any search query. */
                            (searchQuery?.trim() ? getMatchingAttributesSorted() : attributesList)
                                ?.map((claim, index) => {
                                    return (
                                        <TransferListItem
                                            handleItemChange={ ((
                                                event: React.FormEvent<HTMLInputElement>,
                                                { checked }: CheckboxProps
                                            ) => {
                                                let newState;
                                                if (checked) {
                                                    newState = [
                                                        ...tempSelectedMappings,
                                                        { claim, mappedValue: claim.uri }
                                                    ];
                                                } else {
                                                    newState = [
                                                        ...tempSelectedMappings.filter(({ claim: c }) => {
                                                            return c.uri !== claim.uri;
                                                        }),
                                                    ];
                                                }
                                                setTempSelectedMappings(newState);
                                            }) as any }
                                            key={ index }
                                            listItem={ claim.displayName }
                                            listItemId={ claim.id }
                                            listItemIndex={ claim.uri }
                                            isItemChecked={
                                                tempSelectedMappings.map(({ claim }) => claim.uri).includes(claim.uri) ||
                                                selectedAttributeMappings.map(({ claim }) => claim.uri).includes(claim.uri)
                                            }
                                            showSecondaryActions={ false }
                                            showListSubItem={ true }
                                            listSubItem={ (
                                                <Code compact withBackground={ false }>{ claim.uri }</Code>
                                            ) }
                                        />
                                    );
                                })
                        }
                    </TransferList>
                </TransferComponent>
            </Modal.Content>

            <Modal.Actions>
                <LinkButton onClick={ onClose }>
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton onClick={ onUpdateSelectedAttributes }>
                    { t("common:save") }
                </PrimaryButton>
            </Modal.Actions>

        </Modal>
    );

};
