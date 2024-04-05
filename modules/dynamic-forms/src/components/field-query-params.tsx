/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import { QueryParamsAdapter } from "./adapters";
import { DynamicFieldProps } from "./dynamic-form-field";

export interface FieldQueryParamsProps extends DynamicFieldProps {
    /**
     * A comma separated string. if not an empty string.
     */
    value?: string;
    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Pass through onChange(value)
     */
    listen?: (value: string) => void;
    /**
     * test id
     */
    "data-testid": string;
}

/**
 * @param props - Props injected to the component.
 *
 * @returns
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
