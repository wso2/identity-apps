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

import React, { ReactElement, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormProps } from "react-final-form";
import { Form } from "./form";
import { WizardPage } from "./wizardPage";

interface ImperativeWizardProps extends FormProps {
    /**
     * Unique id for the form.
     * Required for event propagation.
     * @see {@link https://github.com/final-form/react-final-form/issues/878}
     */
    id: string;
    children: any;
    pageChanged?: (currentPageIndex: number) => void;
    setTotalPages?: (pageCount: number) => void;
    uncontrolledForm?: boolean;
}

/**
 * Wizard Component.
 * TODO: If working on a refactor, consider exporting one wizard type.
 *
 * @param props - Props injected to the component.
 * @param ref - Component ref.
 * @returns Functional component.
 */
const ImperativeWizard = (props: ImperativeWizardProps, ref): ReactElement => {

    const {
        id,
        children,
        onSubmit,
        setTotalPages,
        pageChanged,
        initialValues,
        uncontrolledForm,
        ...rest
    } = props;

    // Form reference to trigger the form submit externally
    // on each page submission.
    const formRef = useRef(null);

    const absoluteChildCount: number = React.Children.count(children);
    const lastPageIndex: number = absoluteChildCount - 1;

    const [ currentPageIndex, setCurrentPageIndex ] = useState<number>(0);
    const [ values, setValues ] = useState<any>();

    useImperativeHandle(ref, () => ({
        getCurrentPageNumber: getCurrentPageNumber,
        getValues: getValues,
        gotoNextPage: gotoNextPage,
        gotoPreviousPage: gotoPreviousPage
    }));

    useEffect(() => {
        if (pageChanged)
            pageChanged(currentPageIndex);
    });

    useEffect((): void => {
        if (setTotalPages) {
            setTotalPages(absoluteChildCount);
        }
    }, []);

    const getValues = (): { [ key: string ]: any } => {
        return values;
    };

    const gotoNextPage = (): void => {
        const nextIndex = Math.min(currentPageIndex + 1, lastPageIndex);

        setCurrentPageIndex(nextIndex);
        if (formRef) {
            formRef.current.triggerSubmit();
        }
    };

    const gotoPreviousPage = (): void => {
        setCurrentPageIndex(Math.max(currentPageIndex - 1, 0));
    };

    const getCurrentPageNumber = () => currentPageIndex;

    const handleSubmit = (values, form) => {
        if (currentPageIndex === lastPageIndex) {
            return onSubmit(values, form);
        } else {
            setValues(values);
        }
    };

    const validate = (values: { [ key: string ]: any }) => {
        const activePage: any = React.Children.toArray(children)[ currentPageIndex ];

        if (activePage?.props?.validate) {
            return activePage.props.validate(values);
        }

        return {};
    };

    return (
        <Form
            id={ id }
            ref={ formRef }
            initialValues={ initialValues }
            validate={ validate }
            onSubmit={ handleSubmit }
            keepDirtyOnReinitialize={ true }
            uncontrolledForm={ uncontrolledForm ?? false }
            { ...rest }>
            { React.Children.toArray(children)[ currentPageIndex ] }
        </Form>
    );

};

ImperativeWizard.Page = WizardPage;

export const Wizard2 = forwardRef(ImperativeWizard);
