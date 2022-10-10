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
    /**
      * Initial value of the scopes field.
      * @example `openid profile`
    */
     value: string;
    /**
      * Default OIDC scope `openid`.
    */
     defaultValue: string;
    /**
      * Error message.
    */
     error: string;
    /**
      * On blur event handler.
    */
     onBlur: (event: React.KeyboardEvent) => void;
    /**
      * On change event handler.
    */
     onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
 }
 
 interface ScopeInterface {
    /**
      * Value of the scopes field.
      * @example `openid profile`
    */
     value: string;
 }

/**
 * OIDC Authenticator Scopes field component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const Scopes: FunctionComponent<ScopesPropsInterface> = (
    props: ScopesPropsInterface) => {
 
    const {
        value,
        defaultValue,
        error,
        onBlur,
        onChange
    } = props;
 
    const SCOPE_SEPARATOR: string = " ";
 
    const [ scopeValue, setScopeValue ] = useState<string>("");
    const [ scopes, setScopes ] = useState<ScopeInterface[]>([]);

    /**
      * Called when `initialValue` is changed.
      */
    useEffect(() => {
        if (isEmpty(value)) {
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
      * Build scope object from the given string form.
      *
      * @param scope - Scope in the string form.
      * @returns Scope as an object.
      */
    const buildScope = (scope: string): ScopeInterface => {
        return {
            value: scope
        };
    };
 
    /**
      * Build scope string value, from it's object form.
      */
    const buildScopeString = (scope: ScopeInterface) => scope.value;
 
    /**
      * Build scopes string value, from scopes object list.
      */
    const buildScopesString = (scopes: ScopeInterface[]): string =>
        scopes?.map(buildScopeString)?.join(SCOPE_SEPARATOR);
 
    /**
      * Trigger provided onChange handler with provided scopes.
      * 
      * @param scopes - Scopes.
      * @param onChange - onChange handler. 
      */
    const fireOnChangeEvent = (scopes: ScopeInterface[], onChange: (event: React.ChangeEvent<HTMLInputElement>) 
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
    const updateScopeInputFields = (scope: ScopeInterface) => {
        setScopeValue(scope?.value);
    };
 
    /**
      * Enter button option.
      * @param e - keypress event.
      */
    const keyPressed = (e: React.KeyboardEvent<HTMLInputElement>): void => {
 
        if (e.key === "Enter" ) {
            handleScopeAdd(e);
        }
    };
 
    const handleScopeAdd = (event) => {
        event.preventDefault();
        if (isEmpty(scopeValue)) {
            return;
        }
             
        const output: ScopeInterface[] = [ {
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
                        setScopeValue(data.value.trim());
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
                    content="Add scope"
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
