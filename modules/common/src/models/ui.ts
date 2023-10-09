/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FunctionComponent, ReactNode } from "react";

/**
 * Types of views supported by default in the application.
 * @readonly
 * @enum {string}
 */
export enum StrictAppViewTypes {
    DEVELOP = "DEVELOP",
    MANAGE = "MANAGE",
    QUICKSTART = "QUICKSTART"
}

/**
 * Typed interface of {@link getHelpPanelActionIcons}
 */
export type GetHelpPanelActionIconsInterface = {
    caretLeft: FunctionComponent | ReactNode,
    caretRight: FunctionComponent | ReactNode,
    close: FunctionComponent | ReactNode,
    pin: FunctionComponent | ReactNode,
    unpin: FunctionComponent | ReactNode
};

/**
 * Typed interface of {@link getCertificateIllustrations}
 */
export type GetCertificateIllustrationsInterface = {
    avatar: FunctionComponent | ReactNode,
    badge: FunctionComponent | ReactNode,
    file: FunctionComponent | ReactNode,
    ribbon: FunctionComponent | ReactNode,
    uploadPlaceholder: FunctionComponent | ReactNode
};

/**
 * Typed interface of {@link getEmptyPlaceholderIllustrations}
 */
export type GetEmptyPlaceholderIllustrationsInterface = {
    emptyList: FunctionComponent | ReactNode,
    emptySearch: FunctionComponent | ReactNode,
    newList: FunctionComponent | ReactNode
};

/**
 * Combination of views in the application with extensions.
 */
export type AppViewTypes = StrictAppViewTypes;

/**
 * Typed interface of {@link getAdvancedSearchIcons}
 */
export type GetAdvancedSearchIconsInterface = {
    clear: FunctionComponent | ReactNode,
};
