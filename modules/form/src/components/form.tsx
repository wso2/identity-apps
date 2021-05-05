/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { ReactElement, cloneElement } from "react";
import { Form as FinalForm, FormProps } from "react-final-form";
import { Grid, Form as SemanticForm } from "semantic-ui-react";

export interface FormPropsInterface extends FormProps {
    /**
     * Function to trigger form submit externally.
     */
    triggerSubmit?: any;
    /**
     * Check whether form has uncontrolled elements.
     */
    uncontrolledForm: boolean;
}

/**
 * Implementation of the Form component.
 * @param props
 */
export const Form = (props: FormProps): ReactElement => {

    // eslint-disable-next-line prefer-const
    let { triggerSubmit, ...other } = props;
    const { children, onSubmit, uncontrolledForm, ...rest } = other;

    const childNodes = React.Children.toArray(children);

    const skipFinalTypes = (type :String): boolean => {
        let skip = false
        const typeToBeSkipped = ["Heading","FieldDropdown"]

        skip = typeToBeSkipped.some((skipType) =>{
            return type === skipType
        })
        
        return skip
    }

    const addPropsToChild =(childNodes,form, handleSubmit, pristine, submitting, values) => {
        return childNodes.map((child: any, index: number) => {
            if (!child) {
                return null;
            }

            if (!child.type) {
                return child;
            }

            const parentFormProps = { form, handleSubmit, pristine, submitting, values };
            const childFieldProps= child.props;
        

            const childProps:any = {
                childFieldProps,
                parentFormProps
            };

            const allProps: any ={
                ...props,
                childProps
            }
            
             if (uncontrolledForm) {
                if (child.props?.children &&  React.Children.count(child) > 0 && !skipFinalTypes(child.type.name)) {
                 
                        return React.createElement(child.type, {
                            ...allProps,
                            children: addPropsToChild(React.Children.toArray(child.props?.children), 
                                                        form, handleSubmit, pristine, submitting, values)
                        });
                       
                }
            } 
            return cloneElement(child, childProps)

        })
    }

    const renderComponents =(childNodes,form, handleSubmit, pristine, submitting, values) => { 
        let modifiedChildNodes = addPropsToChild(childNodes,form, handleSubmit, pristine, submitting, values);

        return modifiedChildNodes.map((child: any, index: number) => {
            if (!child) {
                return null;
            }
            if (child.props.childFieldProps && child.props?.childFieldProps?.hidden) {
                return null;
            }
            return (
                <Grid.Row key={ index }>
                    <Grid.Column width={ child.props.childFieldProps?.width }>
                        { child }
                    </Grid.Column>
                </Grid.Row>
            );
        })
    }

    return (
        <FinalForm
            onSubmit={ (values, form) => {
                onSubmit(values, form);
            } }
            keepDirtyOnReinitialize={ true }
            render={ ({ handleSubmit, form, submitting, pristine, values }) => {

                if (triggerSubmit && typeof triggerSubmit === "function") {
                    triggerSubmit(handleSubmit);
                }

                return (
                    <form
                        onSubmit={ handleSubmit }
                    >
                        <SemanticForm>
                            <Grid className="form-container with-max-width">
                                    { renderComponents(childNodes,form, handleSubmit, pristine, submitting, values) }  
                            </Grid>
                        </SemanticForm>
                    </form>
                );
            } }
            { ...rest }
        />
    );
};

/**
 * Default props for the component.
 */
 Form.defaultProps = {
    uncontrolledForm: false
};
