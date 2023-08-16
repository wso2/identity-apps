/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";

interface FormInputLabelProps extends IdentifiableComponentInterface, TestableComponentInterface {
    htmlFor: string;
    disabled?: boolean;

    [ key: string ]: any;
}

export const FormInputLabel: FunctionComponent<FormInputLabelProps> = (
    props: PropsWithChildren<FormInputLabelProps>
): ReactElement => {

    const {
        children,
        htmlFor,
        disabled,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    return (
        <label
            data-componentid={ componentId }
            data-testid={ testId }
            htmlFor={ htmlFor }
            className={ classNames({ disabled }) }
            { ...rest }
        >
            { children }
        </label>
    );

};

FormInputLabel.defaultProps = {
    "data-componentid": "form-input-label",
    "data-testid": "form-input-label"
};
