/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * This removes the used props from passedProps.
 *
 * @param props - Props to be filtered.
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
