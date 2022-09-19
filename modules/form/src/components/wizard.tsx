/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import React, { ReactElement, useState } from "react";
import { FormProps } from "react-final-form";
import { Form } from ".";
import { WizardPage } from "./wizardPage";


/**
 * Interface for the wizard steps.
 */
 interface WizardFormInterface extends FormProps {
    /**
     * Unique id for the form.
     * Required for event propagation.
     * @see {@link https://github.com/final-form/react-final-form/issues/878}
     */
    id: string;
    /**
     * Function to change to previous step.
     */
    triggerPrevious?: any;
    /**
     * Function to change external step state.
     */
    changePage?: any;
    /**
     * Child elements of the wizards
     */
    children?:any;
    /**
     * Set total pages back to wizard implementation
     */
    setTotalPage?:any;
}

/**
 * Implementation of wizard component.
 *
 * @param props - Wizard form based on react froms
 * @returns Functional component.
 */
export const Wizard= (props: WizardFormInterface ): ReactElement => {

    const {
        id,
        children,
        onSubmit,
        triggerPrevious,
        changePage,
        setTotalPage,
        ...rest
    } = props;


    const [ page, setPage ] = useState<number>(0);
    const [ values, setValues ] = useState<any>({});


    /**
     * Loads the identity provider authenticators on initial component load.
     */
    useEffect(() => {
        if(setTotalPage){
            setTotalPage(React.Children.count(children));
        }
    }, []);

    const handlNext = (values): void => {
        setPage(Math.min(page + 1,children.length-1));
        setValues(values);
        changePage(Math.min(page + 1,children.length-1));
    };

    const handlPrevious = () => {
        setPage(Math.max(page - 1,0));
        changePage(Math.max(page - 1,0));
    };

    const handleSubmit = (values,form )=> {
        const isLastPage = page === React.Children.count(children) - 1;

        if (isLastPage) {
            return onSubmit(values,form);
        } else {
            handlNext(values);
        }
    };

    if (triggerPrevious && typeof triggerPrevious === "function") {
        triggerPrevious(handlPrevious);
    }

    const  validate = values => {
        const activePage:any = React.Children.toArray(children)[page];

        return activePage.props.validate ? activePage.props.validate(values) : {};
    };

    const activePage = React.Children.toArray(children)[page];

    return (
        <Form
            id={ id }
            initialValues={ values }
            validate={ validate }
            onSubmit={ handleSubmit }
            keepDirtyOnReinitialize={ true }
            uncontrolledForm={ true }
            { ...rest }
        >
            { activePage }
        </Form>
    );

};

Wizard.Page= WizardPage;
