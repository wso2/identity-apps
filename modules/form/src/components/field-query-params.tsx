import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { QueryParamsAdapter } from "./adapters";
import { FormFieldPropsInterface } from "./field";

export interface FieldQueryParamsProps extends FormFieldPropsInterface {
    label: string | ReactElement;
    /**
     * A comma separated string. if not an empty string.
     */
    value?: string;
    hint?: string | ReactElement;
    /**
     * Pass through onChange(value)
     */
    listen?: (value: string) => void;
}

/**
 * @param {FieldQueryParamsProps} props
 * @return {ReactElement | ReactNode}
 */
export const FieldQueryParams: FunctionComponent<FieldQueryParamsProps> = (
    props: FieldQueryParamsProps
): ReactElement => {

    const { ["data-testid"]: testId, value, ...rest } = props;

    return (
        <React.Fragment>
            <FinalFormField
                key={ testId }
                name={ props.name }
                value={ value ?? "" }
                component={ QueryParamsAdapter }
                { ...rest }
            />
            { props.hint && <Hint compact>{ props.hint }</Hint> }
        </React.Fragment>
    );

};
