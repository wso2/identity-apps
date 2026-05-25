/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { PropsWithChildren, ReactElement } from "react";

/**
 * Dynamic wizard page component.
 * 
 * @param props - Props injected to the component.
 */
export const DynamicWizardPage = (props: PropsWithChildren<Record<string, any>>): ReactElement => {

    const { children } = props;

    return (
        <>{ children }</>
    );
};
