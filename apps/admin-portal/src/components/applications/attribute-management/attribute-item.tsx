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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Checkbox, Grid, Input, List, Popup } from "semantic-ui-react";
import { ExtendedClaimMappingInterface } from "./attribute-settings";


interface AttributeItemPropInterface {
    scope: string;
    onClick: any;
    claimSelected: boolean;
    id: string;
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
}

export const AttributeItem: FunctionComponent<AttributeItemPropInterface> = (
    props
): ReactElement => {

    const {
        claimSelected,
        id,
        claimURI,
        displayName,
        onClick,
        mappedURI,
        localDialect,
        updateMapping,
        addToMapping,
        selectMandatory,
        selectRequested,
        mapping,
        initialMandatory,
        initialRequested
    } = props;

    const [mappingOn, setMappingOn] = useState(false);
    const [mandatory, setMandatory] = useState(false);
    const [requested, setRequested] = useState(true);

    const capitalizeFirstLetter = (appName) => {
        return appName[0].toUpperCase() + appName.slice(1);
    };

    const findSelected = () => {
        if (claimSelected) {
            return "claim-list-item dark";
        } else {
            return "claim-list-item";
        }
    };

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

    const handelMapButtonClick = () => {
        const mapping = mappingOn;
        setMappingOn(!mapping);
        addToMapping(claimURI, !mapping);
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
        if (mapping?.addMapping) {
            setMappingOn(mapping.addMapping)
        }
    }, [mapping]);

    return (
        <List.Item key={ id } className={ findSelected() }>
            <Grid className={ "claim-mapping-item" }>
                <Grid.Row
                    verticalAlign="middle"
                    className={
                        claimSelected ? "claim-mapping-row selected" : "claim-mapping-row"
                    }
                >
                    { claimSelected &&
                    <Grid.Column mobile={ 1 } tablet={ 2 } computer={ 1 }>
                        <List.Content floated={ "left" } className="action-bar">
                            <Popup
                                trigger={
                                    (
                                        <Button
                                            toggle
                                            onClick={ () => onClick(claimURI) }
                                            className={ "claim-mapping-button" }
                                            circular
                                            icon='angle double left'
                                        />
                                    )
                                }
                                position="top right"
                                content={ "Remove attribute" }
                                inverted
                            />
                        </List.Content>
                    </Grid.Column>
                    }
                    { claimSelected ?
                        localDialect ?
                            <Grid.Column mobile={ 14 } tablet={ 4 } computer={ 5 }>
                                <List.Content className="claim-list-content">
                                    <div className="main-content">{ capitalizeFirstLetter(displayName) }</div>
                                    <div className="sub-content">{ getClaimName(mappedURI) }</div>
                                </List.Content>
                            </Grid.Column>
                            : <Grid.Column mobile={ 10 } tablet={ 12 } computer={ 12 }>
                                <List.Content className="claim-list-content">
                                    <div className="main-content">{ capitalizeFirstLetter(displayName) }</div>
                                    <div className="sub-content">{ getClaimName(mappedURI) }</div>
                                </List.Content>
                            </Grid.Column>
                        :
                        <Grid.Column mobile={ 14 } tablet={ 14 } computer={ 14 }>

                            <List.Content className="claim-list-content">
                                <div className="main-content">{ capitalizeFirstLetter(displayName) }</div>
                                <div className="sub-content">{ getClaimName(mappedURI) }</div>
                            </List.Content>
                        </Grid.Column>
                    }
                    { localDialect && claimSelected &&
                    <Grid.Column mobile={ 14 } tablet={ 6 } computer={ 6 }>
                        { mappingOn &&
                        <List.Content className="action-bar-mapping" floated={ "right" }>
                            <label>Map To </label>
                            <Input
                                placeholder='Enter  value'
                                value={ mapping?.applicationClaim }
                                onChange={ (event) => updateMapping(claimURI, event.target.value) }
                            />
                        </List.Content>
                        }
                    </Grid.Column>
                    }
                    { localDialect && claimSelected &&
                    <Grid.Column mobile={ 10 } tablet={ 1 } computer={ 1 }>
                        { mappingOn &&
                        <List.Content floated={ "right" } className="action-bar">
                            <Popup
                                trigger={
                                    (
                                        <Checkbox
                                            defaultChecked={ initialRequested }
                                            onClick={ handleRequestCheckChange }
                                        />
                                    )
                                }
                                position="top right"
                                content={ requested ? "Remove requested" : "Make requested" }
                                inverted
                            />
                        </List.Content>
                        }
                    </Grid.Column>
                    }
                    { claimSelected && localDialect &&
                    <>
                        <Grid.Column mobile={ 2 } tablet={ 2 } computer={ 2 }
                                     className={ "claim-mapping-edit-column" } floated={ "left" }>
                            <List.Content>
                                <Popup
                                    trigger={
                                        (
                                            <Button
                                                toggle
                                                active={ mappingOn }
                                                onClick={ handelMapButtonClick }
                                                className={ "claim-mapping-button" }
                                                circular
                                                icon='pencil'
                                            />
                                        )
                                    }
                                    position="top right"
                                    content={ mappingOn ? "Disable mapping" : " Enable mapping" }
                                    inverted
                                />
                            </List.Content>
                            <List.Content floated={ "right" } className="action-bar">
                                <Popup
                                    trigger= {
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
                            </List.Content>
                        </Grid.Column>
                    </>
                    }
                    { claimSelected && !localDialect &&
                    <>
                        <Grid.Column mobile={ 1 } tablet={ 1 } computer={ 1 }
                                     className={ "claim-mapping-edit-column" }/>
                        <Grid.Column mobile={ 3 } tablet={ 2 } computer={ 2 } className={ "claim-mapping-edit-column" }>
                            <List.Content floated={ "right" } className="action-bar">
                                <Popup
                                    trigger= {
                                        (
                                            <Checkbox
                                                defaultChecked={ initialMandatory }
                                                // onChange={ handleMandatoryCheckChange }
                                                onClick={ handleMandatoryCheckChange }
                                            />
                                        )
                                    }
                                    position="top right"
                                    content={ mandatory ? "Remove mandatory" : "Make mandatory" }
                                    inverted
                                />
                            </List.Content>
                        </Grid.Column>
                    </>
                    }
                    { !claimSelected &&
                    <Grid.Column mobile={ 2 } tablet={ 2 } computer={ 2 } onClick={ () => onClick(claimURI) }>
                        <List.Content floated={ "right" } className="action-bar">
                            <Popup
                                trigger= {
                                    (
                                        <Button
                                            toggle
                                            active={ mappingOn }
                                            onClick={ () => onClick(claimURI) }
                                            className={ "claim-selection-add-button" }
                                            circular
                                            icon='angle double right'
                                        />
                                    )
                                }
                                position="top right"
                                content={ "Select attribute" }
                                inverted
                            />
                        </List.Content>
                    </Grid.Column>
                    }
                </Grid.Row>
            </Grid>
        </List.Item>
    );
};
