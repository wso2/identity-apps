/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import React from "react";
import { FormField } from "../models";

/**
 * This component renders Form elements based on the provided `type` prop
 * @param props
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
 * This component groups form elements together
 * @param props
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GroupFields = (props: React.PropsWithChildren<GroupFieldsPropsInterface>): JSX.Element => {
    return null;
};
