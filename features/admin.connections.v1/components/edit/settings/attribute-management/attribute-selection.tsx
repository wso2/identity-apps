/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { AppState, FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { TestableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, Heading, Hint, PrimaryButton } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Divider, Grid, Icon, Input, Segment, Table } from "semantic-ui-react";
import { AttributeListItem } from "./attribute-list-item";
import { AttributeSelectionWizard } from "./attribute-selection-wizard";
import {
    ConnectionClaimInterface,
    ConnectionCommonClaimMappingInterface
} from "../../../../models/connection";

interface AttributeSelectionPropsInterface extends TestableComponentInterface {
    attributeList: ConnectionClaimInterface[];
    selectedAttributesWithMapping: ConnectionCommonClaimMappingInterface[];
    setSelectedAttributesWithMapping: (selectedAttributes: ConnectionCommonClaimMappingInterface[]) => void;
    uiProps: AttributeSelectionUIPropsInterface;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
}

export interface AttributeSelectionUIPropsInterface {
    hint: string;
    attributeColumnHeader: string;
    attributeMapColumnHeader: string;
    attributeMapInputPlaceholderPrefix: string;
    enablePrecedingDivider: boolean;
    componentHeading: string;
}

/**
 * Attribute selection component.
 *
 * @deprecated Please use {@link AttributesSelectionV2}
 */
export const AttributeSelection: FunctionComponent<AttributeSelectionPropsInterface> = (
    props: AttributeSelectionPropsInterface
): ReactElement => {

    const {
        attributeList,
        setSelectedAttributesWithMapping,
        selectedAttributesWithMapping,
        uiProps,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ showSelectionModal, setShowSelectionModal ] = useState<boolean>(false);

    const [ searchFilter, setSearchFilter ] = useState<string>("");

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const changedValue: string = event.target.value;

        setSearchFilter(changedValue);
    };

    const handleOpenSelectionModal = () => {
        setShowSelectionModal(true);
    };

    const addSelectionModal = (): ReactElement => {
        return (
            <AttributeSelectionWizard
                attributesList={ attributeList }
                selectedAttributes={ selectedAttributesWithMapping }
                setSelectedAttributes={ setSelectedAttributesWithMapping }
                showAddModal={ showSelectionModal }
                setShowAddModal={ setShowSelectionModal }
                data-testid={ `${ testId }-wizard` }
            />
        );
    };

    const updateAttributeMapping = (mapping: ConnectionCommonClaimMappingInterface): void => {
        setSelectedAttributesWithMapping(
            [
                ...selectedAttributesWithMapping.filter(
                    (element: ConnectionCommonClaimMappingInterface) => element.claim.uri !== mapping.claim.uri),
                mapping
            ]
        );
    };

    const renderMappingTable = (): ReactElement => (
        <Grid
            data-testid={ testId }
            className="user-role-edit-header-segment clearing attributes ml-0 mr-0"
        >
            <Grid.Row>
                <Table data-testid={ `${ testId }-action-bar` } basic="very" compact>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                <Input
                                    icon={ <Icon name="search"/> }
                                    onChange={ handleSearch }
                                    placeholder={
                                        t("authenticationProvider:forms." +
                                            "attributeSettings.attributeSelection." +
                                            "searchAttributes.placeHolder")
                                    }
                                    floated="left"
                                    size="small"
                                    data-testid={ `${ testId }-search` }
                                />
                            </Table.Cell>
                            <Table.Cell textAlign="right">
                                <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                                    <Button
                                        size="medium"
                                        icon="pencil"
                                        floated="right"
                                        onClick={ handleOpenSelectionModal }
                                        data-testid={ `${ testId }-edit-button` }
                                    />
                                </Show>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row>
                <Table data-testid={ `${ testId }-list` } singleLine compact>
                    <Table.Header>
                        {
                            (
                                <Table.Row>
                                    <Table.HeaderCell>
                                        <strong>
                                            { uiProps.attributeColumnHeader }
                                        </strong>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        <strong>
                                            { uiProps.attributeMapColumnHeader }
                                        </strong>
                                    </Table.HeaderCell>
                                </Table.Row>
                            )
                        }
                    </Table.Header>
                    <Table.Body>
                        {
                            selectedAttributesWithMapping?.filter(
                                (mapping:ConnectionCommonClaimMappingInterface) =>
                                    isEmpty(searchFilter)
                                        ? true
                                        : mapping?.claim?.displayName?.startsWith(searchFilter)
                            )?.sort((
                                a:ConnectionCommonClaimMappingInterface,
                                b:ConnectionCommonClaimMappingInterface
                            ) => a.claim.displayName.localeCompare(b.claim.displayName)
                            )?.map((mapping: ConnectionCommonClaimMappingInterface) => {
                                return (
                                    <AttributeListItem
                                        key={ mapping?.claim.id }
                                        attribute={ mapping?.claim }
                                        placeholder={
                                            uiProps.attributeMapInputPlaceholderPrefix
                                            + mapping?.claim.displayName
                                        }
                                        updateMapping={ updateAttributeMapping }
                                        mapping={ mapping?.mappedValue }
                                        data-testid={
                                            `${ testId }-attribute-list-item-${
                                                mapping?.claim.id }`
                                        }
                                        isReadOnly={ isReadOnly }
                                    />
                                );
                            }
                            )
                        }
                    </Table.Body>
                </Table>
            </Grid.Row>
        </Grid>
    );

    return (
        (selectedAttributesWithMapping || searchFilter)
            ? (
                <>
                    <Grid.Row data-testid={ `${ testId }-section` }>
                        <Grid.Column>
                            { uiProps.enablePrecedingDivider && <Divider/> }
                            <Heading as="h4">
                                { uiProps.componentHeading }
                            </Heading>
                            <Hint>
                                { uiProps.hint }
                            </Hint>
                            <Divider hidden/>
                            {
                                (selectedAttributesWithMapping?.length > 0)
                                    ? renderMappingTable()
                                    : (
                                        <Segment data-testid={ testId }>
                                            <EmptyPlaceholder
                                                title={ t("authenticationProvider:" +
                                                    "placeHolders.noAttributes." +
                                                    "title") }
                                                subtitle={ [
                                                    t("authenticationProvider:" +
                                                        "placeHolders.noAttributes." +
                                                        "subtitles.0")
                                                ] }
                                                action={ (
                                                    <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                                                        <PrimaryButton onClick={ handleOpenSelectionModal } icon="plus">
                                                            { t("authenticationProvider:" +
                                                                "buttons.addAttribute") }
                                                        </PrimaryButton>
                                                    </Show>
                                                ) }
                                                data-testid={ `${ testId }-empty-placeholder` }
                                            />
                                        </Segment>
                                    )
                            }
                        </Grid.Column>
                    </Grid.Row>
                    { addSelectionModal() }
                </>
            )
            : null
    );
};

/**
 * Default proptypes for the IDP attribute selection component.
 */
AttributeSelection.defaultProps = {
    "data-testid": "attribute-selection"
};
