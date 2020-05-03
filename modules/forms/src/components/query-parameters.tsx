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
import { Button, Form, Icon, Label, Popup } from "semantic-ui-react";
import React, { FunctionComponent, useEffect, useState } from "react";
import _ from "lodash";


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

    const QUERY_PARAMETER_SEPARATOR = ",";

    const [queryParamName, setQueryParamName] = useState<string>("");
    const [queryParamValue, setQueryParamValue] = useState<string>("");
    const [queryParams, setQueryParams] = useState<QueryParameter[]>([]);

    /**
     * Build query parameter object from the given string form.
     *
     * @param queryParameter Query parameter in the string form.
     */
    const buildQueryParameter = (queryParameter: string): QueryParameter => {
        return {
            name: queryParameter?.split("=")[0],
            value: queryParameter?.split("=")[1]
        }
    };

    /**
     * Build query parameter string value, from it's object form.
     */
    const buildQueryParameterString = (queryParam: QueryParameter) => queryParam.name + "=" + queryParam.value;

    /**
     * Build query parameters string value, from it's object form.
     */
    const buildQueryParametersString = (queryParams: QueryParameter[]): string =>
        queryParams?.map(buildQueryParameterString)?.join(",");

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
    const updateQueryParameterInputFields = (queryParam: QueryParameter) => {
        setQueryParamName(queryParam?.name);
        setQueryParamValue(queryParam?.value);
    };

    /**
     * Called when `initialValue` is changed.
     */
    useEffect(() => {
        if (_.isEmpty(value)) {
            return;
        }

        setQueryParams(value.split(QUERY_PARAMETER_SEPARATOR)?.map(buildQueryParameter));
    }, [ value ]);

    /**
     * Called when `queryParams` is changed.
     */
    useEffect(() => {
        
        fireOnChangeEvent(queryParams, onChange);
    }, [queryParams]);

    const handleQueryParameterAdd = (event) => {
        event.preventDefault();
        if (_.isEmpty(queryParamName) || _.isEmpty(queryParamValue)) {
            return;
        }

        const inputQueryParameter = {
            name: queryParamName,
            value: queryParamValue
        };
        const constructedQueryParameters = _.unionWith(queryParams, [ inputQueryParameter ], _.isEqual);

        setQueryParams(constructedQueryParameters);

        updateQueryParameterInputFields({
            name: "",
            value: ""
        })
    };

    const handleLabelRemove = (queryParameter: string) => {
        
        if (_.isEmpty(queryParameter)) {
            return;
        }
        
        setQueryParams(_.filter(queryParams, queryParam => !_.isEqual(queryParam,
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
                />

                <Form.Input
                    fluid
                    value={ queryParamValue }
                    focus
                    placeholder="value"
                    onChange={ (event, data) => {
                        setQueryParamValue(data.value);
                    } }
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
