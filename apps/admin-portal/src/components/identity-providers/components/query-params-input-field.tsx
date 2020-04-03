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
import React, { FunctionComponent, useState } from "react";
import { Divider, Form, Input, Label } from "semantic-ui-react";
import { Button, Heading } from "@wso2is/react-components";
import _ from "lodash";


interface QueryParamsInputFieldPropsInterface {
    label: string;
    isRequired: boolean;
}

interface QueryParameter {
    name: string;
    value: string;
}

export const QueryParamsInputField: FunctionComponent<QueryParamsInputFieldPropsInterface> = (
    props: QueryParamsInputFieldPropsInterface) => {

    const {
        label,
        isRequired
    } = props;

    const [name, setName] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [queryParams, setQueryParams] = useState<QueryParameter[]>([]);

    const handleQueryParameterAdd = (event, data) => {
        event.preventDefault();
        if (_.isEmpty(name) || _.isEmpty(value)) {
            return;
        }
        setQueryParams(_.unionWith(queryParams, [{
            name: name,
            value: value
        }], _.isEqual));

        setName("");
        setValue("");
    };

    const handleLabelRemove = (event, data) => {
        event.preventDefault();
        if (_.isEmpty(data)) {
            return;
        }
        const selectedQueryParam: QueryParameter = {
            name: data.content?.split("=")[0],
            value: data.content?.split("=")[1]
        };
        setQueryParams(_.filter(queryParams, queryParam => !_.isEqual(queryParam, selectedQueryParam)));
    };

    const handleLabelClick = (event, data) => {
        event.preventDefault();
        if (_.isEmpty(data)) {
            return;
        }
        const queryParam: QueryParameter = {
            name: data.content?.split("=")[0],
            value: data.content?.split("=")[1]
        };
        setName(queryParam.name);
        setValue(queryParam.value);
    };

    return (
        <Form onSubmit={ (event, data) => { console.log("submitted with:", data) } }>
            <Form.Field label={ label } required={ isRequired }/>
            <Form.Group inline widths="equal" unstackable={ true }>
                <Form.Input
                    fluid
                    value={ name }
                    focus
                    placeholder="name"
                    onChange={ (event, data) => {
                        setName(data.value);
                    } }
                />

                <Form.Input
                    fluid
                    value={ value }
                    focus
                    placeholder="value"
                    onChange={ (event, data) => {
                        setValue(data.value);
                    } }
                />

                <Form.Button
                    fluid
                    onClick={ (event, data) => handleQueryParameterAdd(event, data) }
                    icon="plus square"
                    size="medium"
                    width="two"
                />
            </Form.Group>

            {
                queryParams && queryParams?.map((eachQueryParam, index) => {
                    return (
                        <Label
                            as='a'
                            tag
                            key={ index }
                            onRemove={ (event, data) => {
                                handleLabelRemove(event, data)
                            } }
                            onClick={ (event, data) => {
                                handleLabelClick(event, data)
                            } }
                            removeIcon="delete"
                            content={ eachQueryParam.name + "=" + eachQueryParam.value }
                        />
                    );
                })
            }
        </Form>
    );
};
