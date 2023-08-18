/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { FormField } from "../models";

/**
 * This component renders Form elements based on the provided `type` prop.
 *
 * @param props - The form field.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Field = React.forwardRef((props: FormField, ref): JSX.Element => {
    return null;
});

/**
 * Prop types for the GroupFields component
 */
interface GroupFieldsPropsInterface {
    wrapper: React.ComponentType;
    wrapperProps: any;
}

/**
 * This component groups form elements together.
 *
 * @param props - The children to be grouped.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GroupFields = (props: React.PropsWithChildren<GroupFieldsPropsInterface>): JSX.Element => {
    return null;
};
