/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import React, { FC, ReactElement, ReactNode, cloneElement } from "react";
import { Form as FinalForm, FormProps, FormRenderProps } from "react-final-form";
import { FormApi } from "final-form";
import "./dynamic-form.scss";

interface DynamicFormProps extends FormProps {
    /**
     * child react nodes.
     */
    children: ReactNode[];
    /**
     * Check whether form has uncontrolled elements.
     */
    uncontrolledForm: boolean;
    /**
     * Function to trigger form submit externally.
     */
    triggerSubmit?: any;
}

/**
 * The Dynamic Form component.
 */
export const DynamicForm: FC<DynamicFormProps> = (
    props: DynamicFormProps
): ReactElement => {

    const { id, noValidate, triggerSubmit, ...other } = props;
    const { children, onSubmit, uncontrolledForm, ...rest } = other;

    const renderComponents = (childNodes: ReactNode[], formRenderProps: FormRenderProps) => {

        const modifiedChildNodes: ReactNode[] = addPropsToChild(childNodes, formRenderProps);

        return modifiedChildNodes.map((child: any, index: number) => {
            if (!child) {
                return null;
            }
            if (child?.props?.childFieldProps?.hidden) {
                return null;
            }

            return child;
        });

    };

    const addPropsToChild = (childNodes: ReactNode[], formRenderProps: FormRenderProps): ReactNode[] => {

        return childNodes.map((child: any) => {

            // Safety pre-conditions
            if (!child) return null;
            if (!child.type) return child;

            const { form, handleSubmit, pristine, submitting, values, initialValues } = formRenderProps;

            const parentFormProps: Partial<FormRenderProps> = { form, handleSubmit, initialValues, pristine, submitting, values };
            const childFieldProps: any = child.props;
            const childProps: any = { childFieldProps, parentFormProps };

            // Check whether children of this element is valid
            // and is type array.
            const hasValidChildElements: boolean = Array.isArray(child.props?.children) &&
            child.props?.children.every(React.isValidElement) &&
            child.props.children.length > 0;

            // If the react element has only 1 child, the react top level
            // API parses the children as a single object instead of type
            // array.
            const hasOnlyOneChild: boolean = (typeof child.props?.children === "object");

            if (uncontrolledForm) {
                if ((hasValidChildElements || hasOnlyOneChild)) {
                    return React.createElement(child.type, {
                        ...child.props,
                        children: addPropsToChild(
                            React.Children.toArray(child.props?.children),
                            formRenderProps
                        )
                    });
                }
            }

            return cloneElement(child, childProps);

        });

    };

    return (
        <FinalForm 
            onSubmit={ 
                (values: Record<string, any>, form: FormApi<Record<string, any>>) => 
                    onSubmit(values, form) 
            }
            keepDirtyOnReinitialize={ true }
            render={ (formRenderProps: FormRenderProps) => {

                const { handleSubmit } = formRenderProps;

                if (triggerSubmit && typeof triggerSubmit === "function") {
                    triggerSubmit(handleSubmit);
                }

                return (
                    <form
                        className="dynamic-form"
                        onSubmit={ handleSubmit }
                    >
                        { renderComponents(React.Children.toArray(children), formRenderProps) }
                    </form>
                );
            } }
            { ...rest }
        />
    );
};

export default DynamicForm;
