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

import { FormProps } from "react-final-form";
import React, { forwardRef, ReactElement, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Form } from "./form";
import { WizardPage } from "./wizardPage";

interface ImperativeWizardProps extends FormProps {
    children: any;
    pageChanged?: (currentPageIndex: number) => void;
    setTotalPages?: (pageCount: number) => void;
}

const ImperativeWizard = (props: ImperativeWizardProps, ref): ReactElement => {

    const {
        children,
        onSubmit,
        setTotalPages,
        pageChanged,
        getController,
        initialValues,
        ...rest
    } = props;

    // Form reference to trigger the form submit externally
    // on each page submission.
    const formRef = useRef(null);

    const absoluteChildCount: number = React.Children.count(children);
    const lastPageIndex: number = absoluteChildCount - 1;

    const [ currentPageIndex, setCurrentPageIndex ] = useState<number>(0);
    const [ values, setValues ] = useState<any>(initialValues ?? {});

    useImperativeHandle(ref, () => ({
        gotoNextPage: gotoNextPage,
        gotoPreviousPage: gotoPreviousPage,
        getCurrentPageNumber: getCurrentPageNumber
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
            return onSubmit(values, form)
        } else {
            setValues(values);
        }
    };

    const validate = (values) => {
        const activePage: any = React.Children.toArray(children)[ currentPageIndex ];
        if (activePage?.props?.validate) {
            return activePage.props.validate(values);
        }
        return {};
    };

    return (
        <Form
            ref={ formRef }
            initialValues={ values }
            validate={ validate }
            onSubmit={ handleSubmit }
            keepDirtyOnReinitialize={ true }
            uncontrolledForm={ true }
            { ...rest }>
            { React.Children.toArray(children)[ currentPageIndex ] }
        </Form>
    );

};

ImperativeWizard.Page = WizardPage;

export const Wizard2 = forwardRef(ImperativeWizard);

