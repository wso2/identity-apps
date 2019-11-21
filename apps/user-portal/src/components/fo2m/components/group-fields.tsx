/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React from "react";
import { Field, GroupFields, InnerField } from "../components";
import { FormField, FormValue } from "../models";

/**
 * prop types for the Group component
 */
interface InnerGroupFieldsProps {
    passedProps: {
        wrapper: React.ComponentType;
        wrapperProps: any;
    };
    formProps: {
        checkError: (inputField: FormField) => { isError: boolean, errorMessages: string[] };
        handleBlur: (event: React.KeyboardEvent, name: string) => void;
        handleChange: (value: string, name: string) => void;
        handleChangeCheckBox: (value: string, name: string) => void;
        handleReset: (event: React.MouseEvent) => void;
        form: Map<string, FormValue>;
    };
}
/**
 * This function generates a Group component
 * @param props
 */
export const InnerGroupFields = (props: React.PropsWithChildren<InnerGroupFieldsProps>): JSX.Element => {

    const { passedProps, children, formProps } = props;
    const { wrapper, wrapperProps } = passedProps;
    const Wrapper = wrapper;

    const mutatedChildren: React.ReactElement[] = React.Children.map(children, (child: React.ReactElement) => {
        if (child.type === Field) {
            return React.createElement(InnerField, {
                formProps: {
                    ...formProps
                },
                passedProps: { ...child.props }
            });
        } else if (child.type === GroupFields) {
            return React.createElement(InnerGroupFields, {
                formProps: {
                    ...formProps
                },
                passedProps: { ...child.props }
            });
        }
    });
    return (
        <Wrapper { ...wrapperProps } >
            { mutatedChildren }
        </Wrapper>
    );
};
