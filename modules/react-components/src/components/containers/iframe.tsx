/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    FunctionComponent,
    IframeHTMLAttributes,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useRef
} from "react";
import { createPortal } from "react-dom";

/**
 * Iframe component Prop types.
 */
export interface IframeProps extends IframeHTMLAttributes<HTMLIFrameElement>, IdentifiableComponentInterface {
    /**
     * Should the parent's stylesheets be copied to the iframe.
     */
    cloneParentStyleSheets?: boolean;
    /**
     * Additional CSS Classes
     */
    className?: string;
    /**
     * Should the iframe behave responsively?
     */
    responsive?: boolean;
    /**
     * External style sheets to be injected in to the iframe.
     */
    stylesheets?: string[];
    /**
     * Is the iframe ready.
     */
    isReady?: (status: boolean) => void;
}

/**
 * React Wrapper for HTML iframe element.
 *
 * @param {IframeProps} props - Props injected to the danger zone component.
 *
 * @return {React.ReactElement}
 */
export const Iframe: FunctionComponent<PropsWithChildren<IframeProps>> = (
    props: PropsWithChildren<IframeProps>
): ReactElement => {

    const {
        children,
        className,
        cloneParentStyleSheets,
        isReady,
        responsive,
        stylesheets,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const contentRef: MutableRefObject<HTMLIFrameElement> = useRef<HTMLIFrameElement>(null);

    const iFrameWindow: WindowProxy = contentRef?.current?.contentWindow;
    const iFrameBodyNode: HTMLElement = iFrameWindow?.document?.body;

    const classes = classNames(
        "ui",
        "iframe",
        {
            responsive
        },
        className
    );

    /**
     * Clones the parent node's stylesheets to the iframe.
     */
    useEffect(() => {

        // Check if main body node is loaded before proceeding.
        if (!iFrameBodyNode) {
            return;
        }

        if (!cloneParentStyleSheets) {

            isReady(true);

            return;
        }

        const parentNodeStyleSheets: StyleSheetList = contentRef.current.contentWindow.parent?.document?.styleSheets;

        if (!parentNodeStyleSheets || !parentNodeStyleSheets.length || parentNodeStyleSheets.length <= 0) {
            return;
        }
        
        const styleSheetPromises: Promise<HTMLLinkElement>[] = [];

        for (const styleSheet of parentNodeStyleSheets) {
            styleSheetPromises.push(injectStyleSheetToDOM(styleSheet, iFrameWindow.document));
        }

        Promise.all([ ...styleSheetPromises ])
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            })
            .finally(() => {
                // If external stylesheets are not provided, mark as ready.
                if (!stylesheets) {
                    isReady(true);
                }
            });
    }, [ iFrameBodyNode, cloneParentStyleSheets ]);

    /**
     * Injects externally provided stylesheets to the iframe.
     */
    useEffect(() => {

        // Check if iframe node is loaded before proceeding.
        if (!iFrameWindow) {
            return;
        }

        if (!(Array.isArray(stylesheets) && stylesheets.length > 0)) {

            isReady(true);

            return;
        }

        const styleSheetPromises: Promise<HTMLLinkElement>[] = [];

        for (const styleSheet of stylesheets) {
            styleSheetPromises.push(injectStyleSheetToDOM({ href: styleSheet }, iFrameWindow.document));
        }

        Promise.all([ ...styleSheetPromises ])
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            })
            .finally(() => {
                isReady(true);
            });
    }, [ stylesheets ]);

    /**
     * Injects the passed in stylesheet to the Head element of the document passed in as an argument.
     *
     * @param {Partial<StyleSheet>} styleSheet - Stylesheet object.
     * @param {Document} document - Document.
     * @return {Promise<HTMLLinkElement>}
     */
    const injectStyleSheetToDOM = (styleSheet: Partial<StyleSheet>, document: Document): Promise<HTMLLinkElement> => {

        return new Promise(function (resolve, reject) {
            const link: HTMLLinkElement = document.createElement("link");

            link.href = styleSheet.href;
            link.rel = "stylesheet";

            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error(`Could not load the stylesheet href: ${ styleSheet.href }`));

            document.head.append(link);
        });
    };

    /**
     * Renders the iframe element.
     *
     * @param {boolean} isWrapped - Is the iframe wrapped with a div.
     * @return {ReactElement}
     */
    const _iframe = (isWrapped: boolean = responsive): ReactElement => {
        return (
            <iframe
                className={ !isWrapped && classes }
                ref={ contentRef }
                data-componentid={ componentId }
                { ...rest }
            >
                { iFrameBodyNode && createPortal(children, iFrameBodyNode) }
            </iframe>
        );
    };

    // If not responsive, return the raw iframe element without wrappers.
    if (!responsive) {
        return _iframe();
    }

    return (
        <div className={ classes } data-componentid={ `${ componentId }-wrapper` }>
            { _iframe() }
        </div>
    );
};

/**
 * Default props for the component.
 */
Iframe.defaultProps = {
    "data-componentid": "iframe",
    responsive: true
};
