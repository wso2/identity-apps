/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";
import "./rich-text-adapter.scss";

// Register DOMPurify hook once at module level to handle anchor tags.
DOMPurify.addHook("afterSanitizeAttributes", (node: Element) => {
    if (node.hasAttribute("target")) {
        const target: string | null = node.getAttribute("target");

        if (target === "_blank") {
            node.setAttribute("rel", "noopener noreferrer");
        }
    }
});

/**
 * Props interface of {@link RichTextAdapter}
 */
export type RichTextAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Rich Text component.
 *
 * @param props - Props injected to the component.
 * @returns The RichTextAdapter component.
 */
const RichTextAdapter: FunctionComponent<RichTextAdapterPropsInterface> = ({
    resource
}: RichTextAdapterPropsInterface): ReactElement => {
    /**
     * Check if the resource.config.text matches the i18n pattern.
     */
    const isI18nPattern: boolean = useMemo(() => {
        if (!resource?.config?.text) return false;

        const i18nPattern: RegExp = /^\{\{[^}]+\}\}$/;

        return i18nPattern.test(resource.config.text.trim());
    }, [ resource?.config?.text ]);

    const sanitizedHtml: string = DOMPurify.sanitize(resource?.config?.text || "", {
        ADD_ATTR: [ "target" ]
    });

    return (
        <div className="rich-text-content">
            { isI18nPattern ? (
                <div className="rich-text-i18n-placeholder">
                    <span className="rich-text-i18n-placeholder-key">
                        { resource.config.text }
                    </span>
                </div>
            ) : (
                parse(sanitizedHtml)
            ) }
        </div>
    );
};

export default RichTextAdapter;
