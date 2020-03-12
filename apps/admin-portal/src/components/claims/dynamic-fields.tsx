/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React, { useState, useEffect, useRef } from "react";
import { Grid, Label, Icon, Popup } from "semantic-ui-react";
import { Forms, Field, useTrigger, FormValue, Validation } from "@wso2is/forms";

export interface KeyValue {
    key: string;
    value: string;
}

interface KeyData {
    id: string;
    value: string;
}

interface DynamicFieldPropsInterface {
    data: KeyValue[];
    keyType: "text" | "dropdown";
    keyData?: KeyData[];
    submit: boolean;
    keyName: string;
    valueName: string;
    keyRequiredMessage: string;
    valueRequiredErrorMessage: string;
    listen?: (data: KeyValue[]) => void;
    update: (data: KeyValue[]) => void;
}
export const DynamicField = (props: DynamicFieldPropsInterface): React.ReactElement => {

    const {
        data,
        keyType,
        keyData,
        submit,
        update,
        keyName,
        valueName,
        keyRequiredMessage,
        valueRequiredErrorMessage,
        listen
    } = props;

    const [fields, setFields] = useState<Map<number, KeyValue>>();
    const [editIndex, setEditIndex] = useState<number>(null);
    const [editValue, setEditValue] = useState("");
    const [editKey, setEditKey] = useState("");
    const [updateMapIndex, setUpdateMapIndex] = useState<number>(null);

    const initRender = useRef(true);

    const [add, setAdd] = useTrigger();
    const [reset, setReset] = useTrigger();
    const [updateTrigger, setUpdateTrigger] = useTrigger();

    useEffect(() => {
        if (editIndex === null) {
            setEditKey("");
            setEditValue("");
        }
    }, [editIndex]);

    useEffect(() => {
        const tempFields = new Map<number, KeyValue>();
        data?.forEach((field, index) => {
            tempFields.set(index, field);
        });
        setFields(tempFields);
    }, []);

    useEffect(() => {
        if (initRender.current) {
            initRender.current = false;
        } else if (fields) {
            update(Array.from(fields.values()));
        }
    }, [submit]);

    useEffect(() => {
        if (updateMapIndex !== null) {
            setUpdateTrigger();
        }
    }, [updateMapIndex]);

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 16 }>
                    {
                        keyData?.length !== fields?.size
                            ? (
                                <Forms
                                    onSubmit={ (values: Map<string, FormValue>) => {
                                        const tempFields = new Map<number, KeyValue>(fields);
                                        const newIndex: number = tempFields.size > 0
                                            ? Array.from(tempFields.keys())[tempFields.size - 1] + 1
                                            : 0;
                                        tempFields.set(newIndex, {
                                            key: values.get("key").toString(),
                                            value: values.get("value").toString()
                                        });
                                        setFields(tempFields);
                                        if (listen) {
                                            listen(Array.from(tempFields.values()));
                                        }
                                        setReset();
                                    } }
                                    submitState={ add }
                                    resetState={ reset }
                                >
                                    <Grid>
                                        < Grid.Row columns={ 3 } verticalAlign="top">
                                            <Grid.Column width={ 7 }>
                                                {keyType === "dropdown"
                                                    ? (
                                                        <Field
                                                            type={ keyType }
                                                            placeholder=""
                                                            required={ true }
                                                            requiredErrorMessage={ keyRequiredMessage }
                                                            label={ keyName }
                                                            name="key"
                                                            fluid
                                                            children={
                                                                keyType === "dropdown"
                                                                    ? (
                                                                        keyData?.map((key: KeyData) => {
                                                                            return {
                                                                                text: key.value,
                                                                                value: key.value,
                                                                                key: key.id
                                                                            }
                                                                        })
                                                                    )
                                                                    : []
                                                            }
                                                            displayErrorOn="blur"
                                                            validation={
                                                                (
                                                                    value: string,
                                                                    validation: Validation
                                                                ) => {
                                                                    let isSameUserStore = false;
                                                                    for (const mapping of fields) {
                                                                        if (mapping[1].key === value) {
                                                                            isSameUserStore = true;
                                                                            break;
                                                                        }
                                                                    }
                                                                    if (isSameUserStore) {
                                                                        validation.isValid = false;
                                                                        validation.errorMessages.push(
                                                                            "This User Store has been selected twice. " +
                                                                            "A User Store can only be selected once."
                                                                        )
                                                                    }
                                                                }
                                                            }
                                                        />
                                                    )
                                                    : (
                                                        < Field
                                                            type={ keyType }
                                                            placeholder=""
                                                            required={ true }
                                                            label={ keyName }
                                                            requiredErrorMessage={ keyRequiredMessage }
                                                            name="key"
                                                        />
                                                    )
                                                }
                                            </Grid.Column>
                                            <Grid.Column width={ 6 }>
                                                <Field
                                                    type="text"
                                                    placeholder=""
                                                    required={ true }
                                                    label={ valueName }
                                                    requiredErrorMessage={ valueRequiredErrorMessage }
                                                    name="value"
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={ 3 } verticalAlign="middle">
                                                <Popup
                                                    trigger={ (
                                                        <Icon
                                                            link
                                                            className="list-icon"
                                                            size="small"
                                                            color="grey"
                                                            name="add"
                                                            onClick={ () => {
                                                                setAdd();
                                                            } }
                                                        />
                                                    ) }
                                                    position="top center"
                                                    content="Add"
                                                    inverted
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Forms>
                            )
                            : null
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 16 }>
                    {
                        fields
                            ? (
                                <Forms
                                    onSubmit={ (values: Map<string, FormValue>) => {
                                        const tempFields = new Map(fields);
                                        tempFields.set(updateMapIndex, {
                                            key: values.get("editKey").toString(),
                                            value: values.get("editValue").toString()
                                        });

                                        setFields(tempFields);
                                        setEditIndex(null);
                                        setUpdateMapIndex(null);
                                    }
                                    }
                                    submitState={ updateTrigger }
                                >
                                    <Grid>
                                        {
                                            Array.from(fields).map(([mapIndex, field], index: number) => {
                                                return (
                                                    <Grid.Row key={ index } columns={ 3 } verticalAlign="top">
                                                        <Grid.Column width={ 6 }>
                                                            {editIndex === index
                                                                ? (
                                                                    keyType === "dropdown"
                                                                        ? (
                                                                            <Field
                                                                                type={ keyType }
                                                                                placeholder=""
                                                                                required={ true }
                                                                                requiredErrorMessage={
                                                                                    keyRequiredMessage
                                                                                }
                                                                                name={ "editKey" }
                                                                                children={
                                                                                    keyType === "dropdown"
                                                                                        ? (
                                                                                            keyData?.map(
                                                                                                (key: KeyData) => {
                                                                                                    return {
                                                                                                        text: key.value,
                                                                                                        value: key.value,
                                                                                                        key: key.id
                                                                                                    }
                                                                                                })
                                                                                        )
                                                                                        : []
                                                                                }
                                                                                value={ editKey }
                                                                                displayErrorOn="blur"
                                                                                validation={
                                                                                    (
                                                                                        value: string,
                                                                                        validation: Validation
                                                                                    ) => {
                                                                                        let isSameUserStore = false;
                                                                                        for (const mapping of fields) {
                                                                                            if (
                                                                                                mapping[1].key === value
                                                                                                && mapping[1] !== field
                                                                                            ) {
                                                                                                isSameUserStore = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                        if (isSameUserStore) {
                                                                                            validation.isValid = false;
                                                                                            validation
                                                                                                .errorMessages
                                                                                                .push(
                                                                                                    "This User Store has" +
                                                                                                    " been selected" +
                                                                                                    " twice. A User Store" +
                                                                                                    " can only be " +
                                                                                                    "selected once."
                                                                                                )
                                                                                        }
                                                                                    }
                                                                                }
                                                                            />
                                                                        )
                                                                        : (
                                                                            <Field
                                                                                type={ keyType }
                                                                                placeholder=""
                                                                                required={ true }
                                                                                requiredErrorMessage={
                                                                                    valueRequiredErrorMessage
                                                                                }
                                                                                name={ "editKey" }
                                                                                value={ editKey }
                                                                            />
                                                                        )
                                                                )
                                                                : (
                                                                    <Label
                                                                        size="large"
                                                                        className="properties-label"
                                                                    >
                                                                        {field.key}
                                                                    </Label>
                                                                )
                                                            }
                                                        </Grid.Column>
                                                        <Grid.Column width={ 6 }>
                                                            {editIndex === index
                                                                ? (
                                                                    <Field
                                                                        name={ "editValue" }
                                                                        required={ true }
                                                                        requiredErrorMessage=""
                                                                        type="text"
                                                                        value={ editValue }
                                                                        placeholder=""
                                                                    />
                                                                )
                                                                : (
                                                                    <Label
                                                                        size="large"
                                                                        className="properties-label">
                                                                        {field.value}
                                                                    </Label>
                                                                )
                                                            }
                                                        </Grid.Column>
                                                        <Grid.Column width={ 4 } verticalAlign="middle">
                                                            {editIndex === index
                                                                ? (
                                                                    <Popup
                                                                        trigger={ (
                                                                            <Icon
                                                                                link
                                                                                className="list-icon"
                                                                                size="small"
                                                                                color="grey"
                                                                                name="checkmark"
                                                                                onClick={ () => {
                                                                                    setUpdateMapIndex(mapIndex);
                                                                                } }
                                                                            />
                                                                        ) }
                                                                        position="top center"
                                                                        content="Update"
                                                                        inverted
                                                                    />
                                                                )
                                                                : (
                                                                    <Popup
                                                                        trigger={ (
                                                                            <Icon
                                                                                link
                                                                                className="list-icon"
                                                                                size="small"
                                                                                color="grey"
                                                                                name="pencil"
                                                                                onClick={ () => {
                                                                                    setEditIndex(index);
                                                                                    setEditKey(field.key);
                                                                                    setEditValue(field.value);
                                                                                } }
                                                                            />
                                                                        ) }
                                                                        position="top center"
                                                                        content="Edit"
                                                                        inverted
                                                                    />
                                                                )
                                                            }
                                                            {editIndex === index
                                                                ? (
                                                                    <Popup
                                                                        trigger={ (
                                                                            <Icon
                                                                                link
                                                                                className="list-icon"
                                                                                size="small"
                                                                                color="grey"
                                                                                name="close"
                                                                                onClick={ () => {
                                                                                    setEditIndex(null);
                                                                                } }
                                                                            />
                                                                        ) }
                                                                        position="top center"
                                                                        content="Cancel"
                                                                        inverted
                                                                    />
                                                                )
                                                                : null
                                                            }
                                                            <Popup
                                                                trigger={ (
                                                                    <Icon
                                                                        link
                                                                        className="list-icon"
                                                                        size="small"
                                                                        color="grey"
                                                                        name="trash"
                                                                        onClick={ () => {
                                                                            setEditIndex(null);
                                                                            const tempFields = new Map(fields);
                                                                            tempFields.delete(mapIndex);
                                                                            setFields(tempFields);
                                                                        } }
                                                                    />
                                                                ) }
                                                                position="top center"
                                                                content="Delete"
                                                                inverted
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Forms>
                            )
                            : null
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>

    )
};
