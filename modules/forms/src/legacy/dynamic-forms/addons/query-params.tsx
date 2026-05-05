/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import Grid from "@oxygen-ui/react/Grid";
import FormGroup from "@oxygen-ui/react/FormGroup";
import { FormInputLabel, Popup } from "@wso2is/react-components";
import filter from "lodash-es/filter";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import React, { ChangeEvent, FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { Button, Form, Icon, InputOnChangeData, Label, Message } from "semantic-ui-react";

interface QueryParametersPropsInterface {
    label?: string | ReactElement;
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface QueryParameter {
    name: string;
    value: string;
}

export const QueryParameters: FunctionComponent<QueryParametersPropsInterface> = (
    props: QueryParametersPropsInterface
) => {

    const { label, name, value, onChange } = props;

    const QUERY_PARAMETER_SEPARATOR: string = "&";
    const SPECIAL_CHARACTERS: string[] = [ ",", "&", "=", "?" ];

    const [ queryParamName, setQueryParamName ] = useState<string>("");
    const [ queryParamValue, setQueryParamValue ] = useState<string>("");
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ queryParams, setQueryParams ] = useState<QueryParameter[]>([]);

    /**
     * Called when `queryParams` is changed.
     */
    useEffect(() => {
        fireOnChangeEvent(queryParams, onChange);
    }, [ queryParams ]);

    /**
     * Build query parameter object from the given string form.
     * @param  Query - parameter in the string form.
     */
    const buildQueryParameter = (queryParameter: string): QueryParameter => {
        return {
            name: queryParameter?.split("=")[ 0 ],
            value: queryParameter?.split("=")[ 1 ]
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
     * @param queryParams - QueryParameters.
     * @param onChange - onChange handler.
     */
    const fireOnChangeEvent = (
        queryParams: QueryParameter[],
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    ) => {
        onChange({
            target: {
                value: buildQueryParametersString(queryParams)
            }
        } as React.ChangeEvent<HTMLInputElement>);
    };

    /**
     * Update input field values for query parameter.
     *
     * @param queryParam - QueryParameter.
     */
    const updateQueryParameterInputFields = (queryParam: QueryParameter) => {
        setQueryParamName(queryParam?.name);
        setQueryParamValue(queryParam?.value);
    };

    /**
     * Called when `initialValue` is changed.
     */
    useEffect(() => {
        if (isEmpty(value)) return;
        setQueryParams(value.split(QUERY_PARAMETER_SEPARATOR)?.map(buildQueryParameter));
    }, [ value ]);

    /**
     * Enter button option.
     *
     * @param e - keypress event.
     */
    const keyPressed = (e: KeyboardEvent) => {
        const key: number = e.which || e.charCode || e.keyCode;

        if (key === 13) {
            handleQueryParameterAdd(e);
        }
    };

    const handleQueryParameterAdd = (event: KeyboardEvent | SyntheticEvent) => {
        event.preventDefault();
        if (isEmpty(queryParamName) || isEmpty(queryParamValue)) {
            return;
        }
        setErrorMessage("");
        let isError: boolean = false;

        SPECIAL_CHARACTERS.map((c: string) => {
            if (queryParamValue.includes(c) || queryParamName.includes(c)) {
                setErrorMessage("Cannot include \"" + c + "\" as a query parameter.");
                isError = true;
            }
        });
        if (isError) return;
        const output: QueryParameter[] = [ {
            name: queryParamName,
            value: queryParamValue
        } ];

        queryParams.forEach(function (queryParam: QueryParameter) {
            const existing: QueryParameter[] = output.filter((item: QueryParameter) => {
                return item.name == queryParam.name;
            });

            if (existing.length) {
                const existingIndex: number = output.indexOf(existing[0]);

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

    const handleLabelRemove = (queryParameter: string) => {
        if (isEmpty(queryParameter)) {
            return;
        }
        setQueryParams(filter(queryParams, (queryParam: QueryParameter) => !isEqual(queryParam,
            buildQueryParameter(queryParameter))));
    };

    return (
        <React.Fragment>
            { label
                ? (<FormInputLabel htmlFor={ name }>
                    <span style={ { display: "flex", marginBottom: 10 } }>
                        { label }
                    </span>
                </FormInputLabel>)
                : null
            }
            <>
                <Grid container columnSpacing={ 1 } spacing={ 3 }>
                    <Grid xs={ 6 }>
                        <Form.Input
                            fluid
                            value={ queryParamName }
                            placeholder="name"
                            onChange={ (_event: ChangeEvent, data: InputOnChangeData) => setQueryParamName(data.value) }
                        />
                    </Grid>
                    <Grid xs={ 5 }>
                        <Form.Input
                            fluid
                            value={ queryParamValue }
                            placeholder="value"
                            onChange={ (_event: ChangeEvent, data: InputOnChangeData) => setQueryParamValue(data.value) }
                        />
                    </Grid>
                    <Grid xs={ 1 }>
                        <Popup
                            trigger={
                                (<Button
                                    onClick={ (e: SyntheticEvent) => handleQueryParameterAdd(e) }
                                    icon="add"
                                    type="button"
                                    disabled={ false }
                                />)
                            }
                            position="top center"
                            content="Add key value pair"
                            inverted
                        />
                    </Grid>
                </Grid>
            </>
            {
                errorMessage !== "" && (
                    <Message visible={ errorMessage !== "" } error content={ errorMessage } />
                )
            }
            {
                queryParams && queryParams?.map((eachQueryParam: QueryParameter, index: number) => {
                    const queryParameter: string = eachQueryParam.name + "=" + eachQueryParam.value;

                    return (
                        <Label key={ index }>
                            { queryParameter }
                            <Icon name="delete" onClick={ () => handleLabelRemove(queryParameter) } />
                        </Label>
                    );
                })
            }
        </React.Fragment>
    );

};
