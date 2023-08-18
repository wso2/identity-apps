/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

/**
 * prop types for the Group component
 */
interface InnerGroupFieldsPropsInterface {
        wrapper: React.ComponentType;
        wrapperProps: any;
        children: React.ReactNode;
}

/**
 * This function generates a Group component.
 *
 * @param props - The children to be grouped.
 */
export const InnerGroupFields = (props: React.PropsWithChildren<InnerGroupFieldsPropsInterface>): JSX.Element => {

    const { wrapper, wrapperProps, children } = props;
    const Wrapper = wrapper;

    return (
        <Wrapper { ...wrapperProps } >
            { children }
        </Wrapper>
    );
};
