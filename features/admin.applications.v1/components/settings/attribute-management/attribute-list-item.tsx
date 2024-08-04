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

import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Code, Hint, Popup } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, Icon, Input, Table } from "semantic-ui-react";
import { ExtendedClaimMappingInterface } from "./attribute-settings";

const READONLY_CLAIM_CONFIGS: string[] = [
    ClaimManagementConstants.GROUPS_CLAIM_NAME,
    ClaimManagementConstants.ROLES_CLAIM_NAME,
    ClaimManagementConstants.APPLICATION_ROLES_CLAIM_NAME,
    ClaimManagementConstants.GROUPS_CLAIM_URI,
    ClaimManagementConstants.ROLES_CLAIM_URI,
    ClaimManagementConstants.APPLICATION_ROLES_CLAIM_URI
];

interface AttributeListItemPropInterface extends TestableComponentInterface {
    displayName: string;
    localClaimDisplayName?: string;
    mappedURI: string;
    claimURI: string;
    localDialect: boolean;
    updateMapping?: any;
    addToMapping?: any;
    selectMandatory?: (claimURI: string, mandatory: boolean) => void;
    selectRequested?: (claimURI: string, requested: boolean) => void;
    isDefaultMappingChanged?: (isChanged: boolean) => void;
    mapping?: ExtendedClaimMappingInterface;
    initialMandatory?: boolean;
    initialRequested?: boolean;
    claimMappingOn?: boolean;
    claimMappingError?: boolean;
    deleteAttribute?: () => void;
    /**
     * Specify whether this is the selected subject attribute
     */
    subject?: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Add a label.
     */
    label?: ReactNode;
    /**
     * Specify whether there is an OIDC mapping.
     */
     isOIDCMapping?: boolean;
     /**
     * List of duplicated mapping values.
     */
     duplicatedMappingValues?: Array<string>;
     onlyOIDCConfigured?: boolean;
}

/**
 * Selected Attribute list item component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Attribute list item
 */
export const AttributeListItem: FunctionComponent<AttributeListItemPropInterface> = (
    props: AttributeListItemPropInterface
): ReactElement => {

    const {
        claimURI,
        displayName,
        localClaimDisplayName,
        localDialect,
        updateMapping,
        addToMapping,
        selectMandatory,
        selectRequested,
        isDefaultMappingChanged,
        mapping,
        initialMandatory,
        initialRequested,
        claimMappingOn,
        claimMappingError,
        readOnly,
        deleteAttribute,
        subject,
        label,
        isOIDCMapping,
        duplicatedMappingValues,
        onlyOIDCConfigured,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ mappingOn, setMappingOn ] = useState(false);
    const [ errorInClaimMapping, setErrorInClaimMapping ] = useState(false);
    const [ mandatory, setMandatory ] = useState(false);
    const [ requested, setRequested ] = useState(true);
    const [ mappedAttribute, setMappedAttribute ] = useState(claimURI);
    const [ defaultMappedAttribute ] = useState(mappedAttribute);
    const localDialectURI: string = "http://wso2.org/claims";

    /**
     * Mandatory state of an attribute will be handled here
     */
    const handleMandatoryCheckChange = () => {

        if (localDialect) {
            if (mandatory) {
                selectMandatory(claimURI, false);
                setMandatory(false);
            } else {
                setMandatory(true);
                selectMandatory(claimURI, true);
            }
        } else {
            if (mandatory) {
                selectMandatory(claimURI, false);
                setMandatory(false);
            } else {
                setMandatory(true);
                selectMandatory(claimURI, true);
                setRequested(true);
                selectRequested(claimURI, true);
            }
        }
    };

    /**
     * Requested state of an attribute will be handled here
     */
    const handleRequestedCheckChange = () => {
        if (!localDialect) {
            if (requested) {
                selectRequested(claimURI, false);
                setRequested(false);
                selectMandatory(claimURI, false);
                setMandatory(false);
            } else {
                setRequested(true);
                selectRequested(claimURI, true);
            }
        }
    };

    const handleClaimMapping = (e: React.ChangeEvent<HTMLInputElement>) => {
        const mappingValue: string = e.target?.value.replace(/[^\w+$:/.]/g, "");

        setMappedAttribute(mappingValue);
        updateMapping(claimURI, mappingValue, true);
        setErrorInClaimMapping(isEmpty(mappingValue));
        if (claimMappingError && !isEmpty(mappingValue)) {
            setErrorInClaimMapping(false);
        }
        isDefaultMappingChanged(true);
    };

    useEffect(() => {
        setMandatory(initialMandatory);
    }, [ initialMandatory ]);

    useEffect(() => {
        setRequested(initialRequested);
    }, [ initialRequested ]);

    useEffect(() => {
        if (isEmpty(mapping?.applicationClaim) && isEmpty(mapping)) {
            setErrorInClaimMapping(claimMappingError);
        }
    }, [ claimMappingError ]);

    useEffect(() => {
        setMappingOn(claimMappingOn);
        setMappedAttribute(claimURI);
        if (mapping) {
            addToMapping(claimURI, claimMappingOn);
            // If mapped value available then show that value.
            if (mapping?.applicationClaim){
                setMappedAttribute(mapping?.applicationClaim );
                updateMapping(claimURI,mapping?.applicationClaim);
                // If mapped value available then enable warning modal.
                isDefaultMappingChanged(true);
            } else {
                updateMapping(claimURI,defaultMappedAttribute);
            }
        }
    }, [ claimMappingOn ]);

    /**
     * This function will resolve whether the mandatory checkbox should be read only or not.
     */
    const isMandatoryCheckboxReadOnly = (): boolean => {
        // Mandatory checkbox should be read only if the claims are following.
        if (claimURI && READONLY_CLAIM_CONFIGS.includes(claimURI)) {
            return true;
        }

        if (onlyOIDCConfigured) {
            return (subject && mandatory) || readOnly || isOIDCMapping;
        }

        return subject || readOnly || isOIDCMapping;
    };

    return (
        <Table.Row data-testid={ testId }>
            {
                !localDialect && (<Table.Cell></Table.Cell>)
            }
            <Table.Cell>
                <div>
                    { !localDialect ? localClaimDisplayName : displayName }
                </div>
                {
                    isOIDCMapping ?
                        (<Hint warning={ true } popup>
                            {
                                t("applications:edit.sections.attributes" +
                                    ".selection.mappingTable.listItem.faultyAttributeMappingHint")
                            }
                        </Hint>)
                        : ""
                }
                {
                    <Popup
                        content={ isOIDCMapping && claimURI.startsWith(localDialectURI)
                            ? t("applications:edit.sections.attributes" +
                            ".selection.mappingTable.listItem.faultyAttributeMapping")
                            : claimURI }
                        inverted
                        trigger={ (
                            localDialect ? (
                                <Code compact withBackground={ false }>
                                    { isOIDCMapping && claimURI.startsWith(localDialectURI)
                                        ? t("applications:edit.sections.attributes" +
                                        ".selection.mappingTable.listItem.faultyAttributeMapping")
                                        : claimURI }
                                </Code>
                            ) : (
                                <Code>
                                    { isOIDCMapping && claimURI.startsWith(localDialectURI)
                                        ? t("applications:edit.sections.attributes" +
                                        ".selection.mappingTable.listItem.faultyAttributeMapping")
                                        : claimURI }
                                </Code>
                            )
                        ) }
                        position="bottom left">
                    </Popup>
                }
                <Hint warning={ true } hidden= { label ? false : true }>{ label }</Hint>
            </Table.Cell>
            {
                localDialect && mappingOn && (
                    <>
                        <Table.Cell error={ errorInClaimMapping }>
                            <Input
                                placeholder={
                                    t("applications:edit.sections.attributes" +
                                        ".selection.mappingTable.listItem.fields.claim.placeholder",
                                    { name: displayName })
                                }
                                value={ mappingOn ? mappedAttribute : defaultMappedAttribute }
                                onChange={ !readOnly && handleClaimMapping }
                                disabled={ !mappingOn }
                                readOnly={ readOnly }
                                required
                                error={ errorInClaimMapping || duplicatedMappingValues.includes(mappedAttribute)
                                         || duplicatedMappingValues.includes(defaultMappedAttribute) }
                            />
                        </Table.Cell>
                    </>
                )
            }
            {
                !localDialect && (
                    <Table.Cell
                        { ...(localDialect && !mappingOn && { textAlign: "center" }) }
                        { ...(localDialect && mappingOn && { textAlign: "center" }) }
                        { ...(!localDialect && { textAlign: "center" }) }
                    >
                        <Checkbox
                            checked={ initialRequested || requested || subject }
                            onClick={ (!readOnly && !subject) ? handleRequestedCheckChange : () => null }
                            disabled={ mappingOn ? !mandatory : false }
                            readOnly={ subject || readOnly || isOIDCMapping }
                        />
                    </Table.Cell>
                )
            }
            <Table.Cell
                { ...(localDialect && !mappingOn && { textAlign: "center" }) }
                { ...(localDialect && mappingOn && { textAlign: "center" }) }
                { ...(!localDialect && { textAlign: "center" }) }
            >
                <Checkbox
                    checked={ initialMandatory || mandatory || (subject && !onlyOIDCConfigured) }
                    onClick={ !isMandatoryCheckboxReadOnly() ? handleMandatoryCheckChange : () => null }
                    disabled={ mappingOn ? !requested : false }
                    readOnly={ isMandatoryCheckboxReadOnly() }
                />
            </Table.Cell>
            { (!readOnly || isOIDCMapping) && deleteAttribute ? (
                <Table.Cell textAlign="right">
                    <Popup
                        trigger={ (
                            <Icon
                                link={ true }
                                className="list-icon pr-4"
                                size="large"
                                color="grey"
                                name="trash alternate"
                                onClick={ deleteAttribute }
                            />
                        ) }
                        position="top right"
                        content={ t("common:remove") }
                        inverted
                    />
                </Table.Cell>
            ) : null }
        </Table.Row>
    );
};
