/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FormApi } from "final-form";
import React, { 
    ForwardRefExoticComponent, 
    PropsWithChildren, 
    ReactElement, 
    ReactNode, 
    cloneElement, 
    forwardRef, 
    useImperativeHandle, 
    useRef 
} from "react";
import { Form as FinalForm, FormProps, FormRenderProps } from "react-final-form";
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

const FIELD_COMPACT_DESCRIPTION: string = "field-compact-description";

/**
 * The Dynamic Form component.
 */
export const DynamicForm: ForwardRefExoticComponent<PropsWithChildren<DynamicFormProps>> =
    forwardRef((props: PropsWithChildren<FormProps>, ref: React.ForwardedRef<unknown>): ReactElement => {

    const { id, noValidate, triggerSubmit, ...other } = props;
    const { children, onSubmit, uncontrolledForm, ...rest } = other;

    const formRef: React.MutableRefObject<any> = useRef(null);
    const childNodes: ReactNode[] = React.Children.toArray(children);

    const skipFinalTypes = (type: string): boolean => {

        const typeToBeSkipped: string[] = [ "FieldDropdown" ];

        return typeToBeSkipped.some((skipType: string) => {
            return type === skipType;
        });
    };

    const renderComponents = (childNodes: ReactNode[], formRenderProps: FormRenderProps) => {

        const modifiedChildNodes: ReactNode[] = addPropsToChild(childNodes, formRenderProps);

            return modifiedChildNodes.map((child: any, index: number) => {
                if (!child) {
                    return null;
                }
                if (child.props.childFieldProps && child.props?.childFieldProps?.hidden) {
                    return null;
                }

                if (child.props?.className?.split(" ")[0] === FIELD_COMPACT_DESCRIPTION ) {
                    return (
                        <div key={ index }>
                            { child }
                        </div>
                    );
                }

                return (
                    <div key={ index }>
                        { child }
                    </div>
                );
            });
    };

    useImperativeHandle(ref, () => ({
        triggerSubmit: () => {
            /**
             * What is this?
             *
             * Below this line we have the logic to trigger the native
             * form's submit event. Currently we don't maintain UI for
             * submit button, neither previous buttons.
             *
             * The parent wizard is only responsible for changing it's wizard
             * pages based on the current index. To facilitate external
             * submit handling we expose a imperative handler that uses
             * a react ref to trigger the onSubmit manually. This is
             * because, inherently react-final-form uses its form submission
             * to properly keep track of the redux state.
             *
             * We should be able to synthetically tell react final form
             * that a page has been changed and please trigger {@link handleSubmit}
             * to make sure values are saved.
             *
             * @see {@link onSubmit}
             * @see {@link https://final-form.org/docs/react-final-form/faq}
             */
            if (formRef) {
                const submission: Event = new Event("submit", {
                    bubbles: true,
                    cancelable: true
                });

                formRef.current?.dispatchEvent(submission);
            }
        }
    }));

    const addPropsToChild = (childNodes: ReactNode[], formRenderProps: FormRenderProps): ReactNode[] => {

        return childNodes.map((child: any) => {

            // Safety pre-conditions
            if (!child) return null;
            if (!child.type) return child;

            const { form, handleSubmit, pristine, submitting, values, initialValues } = formRenderProps;

            const parentFormProps: Partial<FormRenderProps> = { 
                form, handleSubmit,
                initialValues,
                pristine,
                submitting, 
                values 
            };
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

    const validateForm = (values: Record<string, any>) => {
        const errors = {};

        childNodes.forEach((child: any) => {
            if (child.props?.childFieldProps?.validate) {
                const childErrors = child.props.childFieldProps.validate(values[child.props.childFieldProps.name]);
                
                if (childErrors) {
                    errors[child.props.childFieldProps.name] = childErrors;
                }
            }
        });

        return errors;
    };

    return (
        <FinalForm 
            id={ id }
            onSubmit={ 
                (values: Record<string, any>, form: FormApi<Record<string, any>>) => 
                    onSubmit(values, form) 
            }
            validate={ validateForm }
            keepDirtyOnReinitialize={ true }
            render={ (formRenderProps: FormRenderProps) => {

                const { handleSubmit } = formRenderProps;

                if (triggerSubmit && typeof triggerSubmit === "function") {
                    triggerSubmit(handleSubmit);
                }

                return (
                    <form
                        className="dynamic-form"
                        id={ id }
                        noValidate={ noValidate }
                        onSubmit={ handleSubmit }
                        ref={ formRef }
                    >
                        { renderComponents(React.Children.toArray(children), formRenderProps) }
                    </form>
                );
            } }
            { ...rest }
        />
    );
});

export default DynamicForm;
