/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * This removes the used props frm passedProps
 * @param props
 */
export const filterPassedProps = (props: Record<string, any>): any => {
    delete props.type;
    delete props.name;
    delete props.label;
    delete props.listen;
    delete props.autoFocus;
    delete props.readOnly;
    delete props.disabled;
    delete props.required;
    delete props.requiredErrorMessage;
    delete props.validation;
    delete props.value;
    delete props.placeholder;
    delete props.children;
    delete props.default;
    delete props.showPassword;
    delete props.hidePassword;
    delete props.width;
    delete props.placeholder;
    delete props.className;
    delete props.size;
    delete props.onClick;
    delete props.startIndex;
    delete props.endIndex;
    delete props.wrapper;
    delete props.wrapperProps;
    delete props.hidden;
    delete props.displayErrorOn;
    delete props.icon;

    return props;
};
