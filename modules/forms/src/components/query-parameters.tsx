/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

interface QueryParametersPropsInterface {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface QueryParameter {
    name: string;
    value: string;
}

export const QueryParameters: FunctionComponent<QueryParametersPropsInterface> = (
    props: QueryParametersPropsInterface) => {

    const {
        value,
        onChange
    } = props;

    const QUERY_PARAMETER_SEPARATOR = "&";
    const SPECIAL_CHARACTERS = [ ",", "&", "=", "?" ];

    const [ queryParamName, setQueryParamName ] = useState<string>("");
    const [ queryParamValue, setQueryParamValue ] = useState<string>("");
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ queryParams, setQueryParams ] = useState<QueryParameter[]>([]);

    /**
     * Build query parameter object from the given string form.
     *
     * @param queryParameter Query parameter in the string form.
     */
    const buildQueryParameter = (queryParameter: string): QueryParameter => {
        return {
            name: queryParameter?.split("=")[0],
            value: queryParameter?.split("=")[1]
        };
    };

    /**
     * Build query parameter string value, from it's object form.
     */
    const buildQueryParameterString = (queryParam: QueryParameter) => queryParam.name + "=" + queryParam.value;

    /**
     * Build query parameters string value, from it's object form.
     */
    const buildQueryParametersString = (queryParams: QueryParameter[]): string =>
        queryParams?.map(buildQueryParameterString)?.join("&");

    /**
     * Trigger provided onChange handler with provided query parameters.
     *
     * @param queryParams QueryParameters.
     * @param onChange onChange handler.
     */
    const fireOnChangeEvent = (queryParams: QueryParameter[], onChange: (event: React.ChangeEvent<HTMLInputElement>)
        => void) => {

        onChange(
            {
                target: {
                    value: buildQueryParametersString(queryParams)
                }
            } as React.ChangeEvent<HTMLInputElement>
        );
    };

    /**
     * Update input field values for query parameter.
     *
     * @param queryParam QueryParameter.
     */
    const updateQueryParameterInputFields = (queryParam: QueryParameter): void => {
        setQueryParamName(queryParam?.name);
        setQueryParamValue(queryParam?.value);
    };

    /**
     * Called when `initialValue` is changed.
     */
    useEffect(() => {
        if (isEmpty(value)) {
            return;
        }

        setQueryParams(value.split(QUERY_PARAMETER_SEPARATOR)?.map(buildQueryParameter));
    }, [ value ]);

    /**
     * Called when `queryParams` is changed.
     */
    useEffect(() => {

        fireOnChangeEvent(queryParams, onChange);
    }, [ queryParams ]);

    /**
     * Enter button option.
     * @param e keypress event.
     */
    const keyPressed = (e) => {
        const key = e.which || e.charCode || e.keyCode;

        if (key === 13) {
            handleQueryParameterAdd(e);
        }
    };

    const handleQueryParameterAdd = (event) => {
        event.preventDefault();
        if (isEmpty(queryParamName) || isEmpty(queryParamValue)) {
            return;
        }

        setErrorMessage("");
        let isError = false;

        SPECIAL_CHARACTERS.map((c) => {
            if (queryParamValue.includes(c) || queryParamName.includes(c)) {
                setErrorMessage("Cannot include \"" + c + "\" as a query parameter.");
                isError = true;
            }
        });

        if (isError) {
            return;
        }

        const output: QueryParameter[] = [ {
            name: queryParamName,
            value: queryParamValue
        } ];

        queryParams.forEach(function(queryParam) {
            const existing = output.filter((item) => {
                return item.name == queryParam.name;
            });

            if (existing.length) {
                const existingIndex = output.indexOf(existing[0]);

                output[existingIndex].value = queryParam.value + " " + output[existingIndex].value;
            } else {
                output.push(queryParam);
            }
        });

        setQueryParams(output);

        updateQueryParameterInputFields({
            name: "",
            value: ""
        });
    };

    const handleLabelRemove = (queryParameter: string): void => {

        if (isEmpty(queryParameter)) {
            return;
        }

        setQueryParams(filter(queryParams, queryParam => !isEqual(queryParam,
            buildQueryParameter(queryParameter))));
    };

    return (
        <>
            <Form.Group inline widths="equal" unstackable={ true }>
                <Form.Input
                    fluid
                    value={ queryParamName }
                    focus
                    placeholder="name"
                    onChange={ (event, data) => {
                        setQueryParamName(data.value);
                    } }
                    onKeyDown={ keyPressed }
                />

                <Form.Input
                    fluid
                    value={ queryParamValue }
                    focus
                    placeholder="value"
                    onChange={ (event, data) => {
                        setQueryParamValue(data.value);
                    } }
                    onKeyDown={ keyPressed }
                />

                <Popup
                    trigger={
                        (
                            <Button
                                onClick={ (e) => handleQueryParameterAdd(e) }
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

            <Message visible={ errorMessage !== "" } error content={ errorMessage } />

            {
                queryParams && queryParams?.map((eachQueryParam, index) => {
                    const queryParameter = eachQueryParam.name + "=" + eachQueryParam.value;

                    return (
                        <Label
                            key={ index }
                        >
                            { queryParameter }
                            <Icon
                                name="delete"
                                onClick={ () => handleLabelRemove(queryParameter) }
                            />
                        </Label>
                    );
                })
            }
        </>
    );
};
