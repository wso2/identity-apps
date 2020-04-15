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
import { Field } from "@wso2is/forms";

export const ComplexField: FunctionComponent = (props) => {

    const {
        children
    } = props;

    const [disable, setDisabled] = useState<boolean>(false);

    const handleLocalComponent = (value: string, name: string): void => {
        console.log(value, name);
        setDisabled(!!value);
    };

    const parseChildren = (elements: React.ReactNode): React.ReactElement[] => {
        return React.Children.map(elements, (element: React.FunctionComponentElement<any>) => {
            if (element) {
                if (element?.props?.formProps && element?.props?.passedProps) {
                    if (element?.props?.passedProps?.type === "checkbox") {
                        return React.createElement(element.type, {
                            ...element.props,
                            passedProps: {
                                ...element.props.passedProps,
                                notifyOnChange: handleLocalComponent
                            }
                        });
                    } else {
                        return React.createElement(element.type, {
                            ...element.props,
                            passedProps: {
                                ...element.props.passedProps,
                                disable: disable
                            }
                        });
                    }
                } else if (element?.props?.children && React.Children.count(element.props.children) > 0) {
                    return React.cloneElement(element, {
                        ...element.props,
                        children: parseChildren(element.props.children)
                    });
                } else {
                    return element;
                }
            }
        });
    };

    return (
        <>
            {
                parseChildren(children)
            }
        </>
    );
};
