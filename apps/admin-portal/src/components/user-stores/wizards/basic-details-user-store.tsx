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

import { AlertLevels, TypeResponse } from "../../../models";
import { Field, Forms, FormValue } from "@wso2is/forms";
import React, { ReactElement, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { getTypes } from "../../../api";
import { useDispatch } from "react-redux";

/**
 * Prop types of `BasicDetailsUserStore` component
 */
interface BasicDetailsUserStorePropsInterface {
    /**
     * Trigger submit
     */
    submitState: boolean;
    /**
     * Submits the values
     */
    onSubmit: (values: Map<string, FormValue>) => void;
    /**
     * Saved values
     */
    values: Map<string, FormValue>;
}

/**
 * This component renders the Basic Details step of the wizard
 * @param {BasicDetailsUserStorePropsInterface} props
 * @return {ReactElement}
 */
export const BasicDetailsUserStore = (
    props: BasicDetailsUserStorePropsInterface
): ReactElement => {

    const { submitState, onSubmit, values } = props;

    const [types, setTypes] = useState<TypeResponse[]>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        getTypes().then((response) => {
            setTypes(response);
        }).catch((error) => {
            dispatch(addAlert({
                description: error?.description,
                level: AlertLevels.ERROR,
                message: error?.message || "Something went wrong"
            }))
        })
    }, []);

    return (
        <Forms
            onSubmit={
                (values: Map<string, FormValue>) => {
                    onSubmit(values);
                }
            }
            submitState={ submitState }
        >
            <Field
                label="Name"
                name="name"
                type="text"
                required={ true }
                requiredErrorMessage="Name is a required field"
                placeholder="Enter a name"
                value={ values?.get("name")?.toString() }
            />
            <Field
                label="Description"
                name="description"
                type="textarea"
                required={ false }
                requiredErrorMessage=""
                placeholder="Enter a description"
                value={ values?.get("description")?.toString() }
            />
            <Field
                search={ true }
                label="Type"
                name="type"
                type="dropdown"
                required={ true }
                requiredErrorMessage="Select a Type"
                value={ values?.get("type")?.toString() }
                children={
                    types?.map(type => {
                        return {
                            key: type.typeId,
                            text: type.typeName,
                            value: type.typeId
                        }
                    })
                }
            />
        </Forms>
    )
}
