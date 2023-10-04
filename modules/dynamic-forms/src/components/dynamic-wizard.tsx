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
    MutableRefObject,
    ReactElement,
    RefAttributes,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import { FormProps } from "react-final-form";
import { DynamicForm } from "./dynamic-form";
import { DynamicWizardPage } from "./dynamic-wizard-page";

interface DynamicWizardProps extends FormProps {

    /**
     * Unique id for the form.
     * Required for event propagation.
     * @see {@link https://github.com/final-form/react-final-form/issues/878}
     */
    id: string;
    /**
     * child nodes of the wizard component.
     */
    children: any;
    /**
     * The callback to trigger on page change.
     */
    pageChanged?: (currentPageIndex: number) => void;
    /**
     * The callback to trigger to set the total page count.
     */
    setTotalPages?: (pageCount: number) => void;
}

/**
 * Wizard Component.
 *
 * @param props - Props injected to the component.
 * @param ref - Component ref.
 * @returns Functional component.
 */
const ImperativeWizard = (props: DynamicWizardProps, ref: React.ForwardedRef<unknown>): ReactElement => {

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
    const formRef: MutableRefObject<any> = useRef(null);

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
    }, [ currentPageIndex ]);

    useEffect((): void => {
        if (setTotalPages) {
            setTotalPages(absoluteChildCount);
        }
    }, []);

    const getValues = (): { [ key: string ]: any } => {
        return values;
    };

    const gotoNextPage = (): void => {
        const nextIndex: number = Math.min(currentPageIndex + 1, lastPageIndex);

        setCurrentPageIndex(nextIndex);
        if (formRef) {
            formRef.current.triggerSubmit();
        }
    };

    const gotoPreviousPage = (): void => {
        setCurrentPageIndex(Math.max(currentPageIndex - 1, 0));
    };

    const getCurrentPageNumber = () => currentPageIndex;

    const handleSubmit = (values: any, form: FormApi<Record<string, any>>) => {
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
        <DynamicForm
            id={ id }
            ref={ formRef }
            initialValues={ initialValues }
            validate={ validate }
            onSubmit={ handleSubmit }
            keepDirtyOnReinitialize={ true }
            uncontrolledForm={ uncontrolledForm ?? false }
            { ...rest }
        >
            { children }
        </DynamicForm>
    ); 

};

ImperativeWizard.Page = DynamicWizardPage;

export const DynamicWizard: ForwardRefExoticComponent<Pick<
    DynamicWizardProps,
    keyof DynamicWizardProps
> &
    RefAttributes<unknown>> = forwardRef(ImperativeWizard);
