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

import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Checkbox, Input, Label, Popup, Table } from "semantic-ui-react";
import { ExtendedClaimMappingInterface } from "./attribute-settings";

interface AttributeListItemPropInterface {
    displayName: string;
    mappedURI: string;
    claimURI: string;
    localDialect: boolean;
    updateMapping?: any;
    addToMapping?: any;
    selectMandatory?: (claimURI: string, mandatory: boolean) => void;
    selectRequested?: (claimURI: string, requested: boolean) => void;
    mapping?: ExtendedClaimMappingInterface;
    initialMandatory?: boolean;
    initialRequested?: boolean;
    claimMappingOn?: boolean;
    claimMappingError?: boolean;
}

/**
 * Selected Attribute list item component.
 *
 * @param {AttributeListItemPropInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AttributeListItem: FunctionComponent<AttributeListItemPropInterface> = (
    props: AttributeListItemPropInterface
): ReactElement => {

    const {
        claimURI,
        displayName,
        localDialect,
        mappedURI,
        updateMapping,
        addToMapping,
        selectMandatory,
        selectRequested,
        mapping,
        initialMandatory,
        initialRequested,
        claimMappingOn,
        claimMappingError
    } = props;

    const [mappingOn, setMappingOn] = useState(false);
    const [errorInClaimMapping, setErrorInClaimMapping] = useState(false);
    const [mandatory, setMandatory] = useState(false);
    const [requested, setRequested] = useState(true);


    const getClaimName = (claimURI: string): string => {
        if (typeof claimURI === "string") {
            const claimArray = claimURI.split("/");
            if (claimArray.length > 1) {
                return claimArray[claimArray.length - 1];
            } else {
                return claimArray[0];
            }
        }
        return claimURI;
    };

    const handleMandatoryCheckChange = () => {
        if (mandatory) {
            selectMandatory(claimURI, false);
            setMandatory(false);
        } else {
            setMandatory(true);
            selectMandatory(claimURI, true);
        }
    };

    const handleClaimMapping = (e) => {
        const mappingValue = e.target.value;
        updateMapping(claimURI, mappingValue);
        if (claimMappingError && !_.isEmpty(mappingValue)) {
            setErrorInClaimMapping(false);
        }
    };

    const handleRequestCheckChange = () => {
        if (requested) {
            selectRequested(claimURI, false);
            setRequested(false);
        } else {
            setRequested(true);
            selectRequested(claimURI, true);
        }
    };

    useEffect(() => {
        setMandatory(initialMandatory);
    }, [initialMandatory]);

    useEffect(() => {
        setRequested(initialRequested);
    }, [initialRequested]);

    useEffect(() => {
        if (_.isEmpty(mapping?.applicationClaim)) {
            setErrorInClaimMapping(claimMappingError);
        }
    }, [claimMappingError]);

    useEffect(() => {
        setMappingOn(claimMappingOn);
        if (mapping) {
            addToMapping(claimURI, claimMappingOn);
        }
    }, [claimMappingOn]);

    return (
        localDialect ?
            (
                <Table.Row>
                    <Table.Cell>
                        { displayName }
                    </Table.Cell>
                    {
                        <>
                            <Table.Cell error={ errorInClaimMapping }>
                                <Input
                                    placeholder={ "eg: custom" + displayName + ", new" + displayName }
                                    value={ mapping?.applicationClaim }
                                    onChange={ handleClaimMapping }
                                    disabled={ !mappingOn }
                                    required
                                />
                                { errorInClaimMapping &&
                                (<Label
                                        basic color='red'
                                        pointing='left'>
                                        Please enter a value
                                    </Label>
                                )
                                }
                            </Table.Cell>
                            <Table.Cell>
                                <Popup
                                    trigger={
                                        (
                                            <Checkbox
                                                defaultChecked={ initialRequested }
                                                onClick={ handleRequestCheckChange }
                                                disabled={ !mappingOn }
                                            />
                                        )
                                    }
                                    position="top right"
                                    content={ requested ? "Remove requested" : "Make requested" }
                                    inverted
                                    disabled={ !mappingOn }
                                />
                            </Table.Cell>
                        </>
                    }
                    <Table.Cell>
                        <Popup
                            trigger={
                                (
                                    <Checkbox
                                        defaultChecked={ initialMandatory }
                                        onClick={ handleMandatoryCheckChange }
                                        disabled={ mappingOn ? !requested : false }
                                    />
                                )
                            }
                            position="top right"
                            content={ mandatory ? "Remove mandatory" : "Make mandatory" }
                            inverted
                            disabled={ mappingOn ? !requested : false }
                        />
                    </Table.Cell>
                </Table.Row>
            ) :
            (
                <Table.Row>
                    <Table.Cell>
                        { displayName }
                    </Table.Cell>
                    <Table.Cell>
                        <Popup
                            trigger={
                                (
                                    <Checkbox
                                        defaultChecked={ initialMandatory }
                                        onClick={ handleMandatoryCheckChange }
                                    />
                                )
                            }
                            position="top right"
                            content={ mandatory ? "Remove mandatory" : "Make mandatory" }
                            inverted
                        />
                    </Table.Cell>
                </Table.Row>
            )
    );
};
