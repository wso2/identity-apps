/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import filter from "lodash-es/filter";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Form, Icon, Label, Message, Popup } from "semantic-ui-react";
 
 interface ScopesPropsInterface {
     value: string;
     defaultValue: string;
     isQueryParamScopesDefined: boolean;
     error: string;
     onBlur: (event: React.KeyboardEvent) => void;
     onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
 }
 
 interface Scope {
     value: string;
 }
 
export const Scopes: FunctionComponent<ScopesPropsInterface> = (
    props: ScopesPropsInterface) => {
 
    const {
        value,
        defaultValue,
        isQueryParamScopesDefined,
        error,
        onBlur,
        onChange
    } = props;
 
    const SCOPE_SEPARATOR = " ";
 
    const [ scopeValue, setScopeValue ] = useState<string>("");
    const [ scopes, setScopes ] = useState<Scope[]>([]);
 
    /**
      * Build scope object from the given string form.
      *
      * @param scope - Scope in the string form.
      */
    const buildScope = (scope: string): Scope => {
        return {
            value: scope
        };
    };
 
    /**
      * Build scope string value, from it's object form.
      */
    const buildScopeString = (scope: Scope) => scope.value;
 
    /**
      * Build scopes string value, from scopes object list.
      */
    const buildScopesString = (scopes: Scope[]): string =>
        scopes?.map(buildScopeString)?.join(SCOPE_SEPARATOR);
 
    /**
      * Trigger provided onChange handler with provided scopes.
      * 
      * @param scopes - Scopes.
      * @param onChange - onChange handler. 
      */
    const fireOnChangeEvent = (scopes: Scope[], onChange: (event: React.ChangeEvent<HTMLInputElement>) 
         => void) => {
 
        onChange(
             {
                 target: {
                     value: buildScopesString(scopes)
                 }
             } as React.ChangeEvent<HTMLInputElement>
        );
    };
 
    /**
      * Update input field values for scope.
      * 
      * @param scope - Scope.
      */
    const updateScopeInputFields = (scope: Scope) => {
        setScopeValue(scope?.value);
    };
 
    /**
      * Called when `initialValue` is changed.
      */
    useEffect(() => {
        if (isEmpty(value)) {

            if (!isQueryParamScopesDefined) {
                const output: Scope[] = [ {
                    value: defaultValue
                } ];
    
                setScopes(output);
            }

            return;
        } 
 
        setScopes(value.split(SCOPE_SEPARATOR)?.map(buildScope));
    }, [ value ]);
 
    /**
      * Called when `scopes` is changed.
      */
    useEffect(() => {
         
        fireOnChangeEvent(scopes, onChange);
    }, [ scopes ]);
 
    /**
      * Enter button option.
      * @param e - keypress event.
      */
    const keyPressed = (e) => {
        const key = e.which || e.charCode || e.keyCode;
 
        if (key === 13) {
            handleScopeAdd(e);
        }
    };
 
    const handleScopeAdd = (event) => {
        event.preventDefault();
        if (isEmpty(scopeValue)) {
            return;
        }
             
        const output: Scope[] = [ {
            value: scopeValue
        } ];
 
        scopes.forEach(function(scope) {
            const existing = output.filter((item) => {
                return item.value == scope.value;
            });
 
            if (existing.length) {
                return;
            } else {
                output.push(scope);
            }
        });
 
        setScopes(output);
 
        updateScopeInputFields({
            value: ""
        });
    };
 
    const handleLabelRemove = (scopeParam: string) => {
         
        if (isEmpty(scopeParam)) {
            return;
        }
         
        setScopes(filter(scopes, scope => !isEqual(scope,
            buildScope(scopeParam))));
    };
 
    return (
        <>
            <Form.Group inline widths="equal" unstackable={ true }>
 
                <Form.Input
                    fluid
                    value={ scopeValue }
                    onBlur={ onBlur }
                    focus
                    onChange={ (event, data) => {
                        setScopeValue(data.value);
                    } }
                    onKeyDown={ keyPressed }
                />
 
                <Popup
                    trigger={
                        (
                            <Button
                                onClick={ (e) => handleScopeAdd(e) }
                                icon="add"
                                type="button"
                                disabled={ false }
                            />
                        )
                    }
                    position="top center"
                    content="Add key value pair"
                    inverted
                />
            </Form.Group>

            <Message visible={ !isEmpty(error) } error content={ error } />

            {
                scopes && scopes?.map((eachScope, index) => {
                    const scope = eachScope.value;

                    if (scope == defaultValue) {
                        return (
                            <Label
                                key={ index }
                            >
                                { scope } 
                            </Label>
                        );
                    } else {
                        return (
                            <Label
                                key={ index }
                            >
                                { scope }
                                <Icon
                                    name="delete"
                                    onClick={ () => handleLabelRemove(scope) }
                                />
                            </Label>
                        );
                    }
                })
            }
        </>
    );
};
