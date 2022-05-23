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
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    IframeHTMLAttributes,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useRef,
    useState
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
     * Styles to be injected in to a style tag.
     */
    styles?: string;
    /**
     * Whether to add the style node to the begining of the `head` element or to the end of the `head` element.
     */
    styleNodeInjectionStrategy?: "append" | "prepend";
    /**
     * Should the style node be injected after the parent stylesheets have been cloned.
     */
    injectStyleNodeAfterParentStyles?: boolean;
    /**
     * External style sheets to be injected in to the iframe.
     */
    stylesheets?: string[];
    /**
     * Is the iframe ready.
     */
    isReady?: (status: boolean) => void;
    /**
     * Is the iframe loading.
     */
    isLoading?: boolean;
    /**
     * The zoom percentage. By default will be 100%.
     */
    zoom?: number;
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
        injectStyleNodeAfterParentStyles,
        isReady,
        isLoading,
        responsive,
        styles,
        styleNodeInjectionStrategy,
        stylesheets,
        ["data-componentid"]: componentId,
        zoom,
        ...rest
    } = props;

    const contentRef: MutableRefObject<HTMLIFrameElement> = useRef<HTMLIFrameElement>(null);
    
    const [ isParentStylesheetsCloningCompleted, setIsParentStylesheetsCloningCompleted ] = useState<boolean>(false);
    const [ clonedStyleSheets, setClonedStyleSheets ] = useState<string[]>([]);
    const [ clonedParentStyleSheets, setClonedParentStyleSheets ] = useState<string[]>([]);

    const iFrameWindow: WindowProxy = contentRef?.current?.contentWindow;
    const iFrameBodyNode: HTMLElement = iFrameWindow?.document?.body;

    const classes = classNames(
        "ui",
        "iframe",
        {
            [ "loading" ]: isLoading,
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
        const _clonedParentStyleSheets: string[] = [];

        for (const styleSheet of parentNodeStyleSheets) {
            if (isEmpty(styleSheet.href)) {
                continue;
            }

            // Avoid cloning already cloned stylesheets.
            if (clonedParentStyleSheets.includes(styleSheet.href)) {
                return;
            } else {
                _clonedParentStyleSheets.push(styleSheet.href);
            }

            styleSheetPromises.push(injectStyleSheetToDOM(styleSheet, iFrameWindow.document));
        }

        Promise.all([ ...styleSheetPromises ])
            .then(() => {
                setClonedParentStyleSheets(_clonedParentStyleSheets);
            })
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            })
            .finally(() => {
                // If external stylesheets are not provided, mark as ready.
                if (!stylesheets) {
                    isReady(true);
                } else {
                    setIsParentStylesheetsCloningCompleted(true);
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
        
        // Check if the parent stylesheet cloning is completed.
        if (!isParentStylesheetsCloningCompleted) {
            isReady(false);

            return;
        }

        // Return if stylesheets are undefined or not an array.
        if (!stylesheets || !Array.isArray(stylesheets)) {
            isReady(true);

            return;
        }

        const styleSheetPromises: Promise<HTMLLinkElement>[] = [];
        const _clonedStyleSheets: string[] = [];

        for (const styleSheet of stylesheets) {
            if (isEmpty(styleSheet)) {
                continue;
            }

            // Avoid cloning already cloned stylesheets.
            if (clonedStyleSheets.includes(styleSheet)) {
                return;
            } else {
                _clonedStyleSheets.push(styleSheet);
            }

            styleSheetPromises.push(injectStyleSheetToDOM({ href: styleSheet }, iFrameWindow.document));
        }

        Promise.all([ ...styleSheetPromises ])
            .then(() => {
                setClonedStyleSheets(_clonedStyleSheets);
            })
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            })
            .finally(() => {
                isReady(true);
            });
    }, [ stylesheets, isParentStylesheetsCloningCompleted ]);

    /**
     * 
     */
    useEffect(() => {

        // Check if iframe node is loaded before proceeding.
        if (!iFrameWindow) {
            return;
        }

        // Check if the parent stylesheet cloning is completed.
        if (styles && !isParentStylesheetsCloningCompleted) {
            isReady(false);

            return;
        }

        // Remove the existing style nodes before adding the new styles to avoid adding the same
        // styles on `style` prop changes.
        const styleNodesCollection: HTMLCollectionOf<HTMLStyleElement> = iFrameWindow.document
            .getElementsByTagName("style");
        
        for (const node of styleNodesCollection) {
            node.remove();
        }

        const styleNode: HTMLStyleElement = iFrameWindow.document.createElement("style");

        styleNode.innerHTML = styles;
        
        // If the `injectStyleNodeAfterParentStyles` flag is set, change the inject strategy to append.
        if (injectStyleNodeAfterParentStyles) {
            iFrameWindow.document.head.appendChild(styleNode);
        } else if (styleNodeInjectionStrategy === "append") {
            iFrameWindow.document.head.appendChild(styleNode);
        } else {
            iFrameWindow.document.head.prepend(styleNode);
        }

        isReady(true);
    }, [ styles, iFrameWindow, isParentStylesheetsCloningCompleted, injectStyleNodeAfterParentStyles ]);

    /**
     * Add styling to the iframe body.
     */
    useEffect(() => {

        // Check if main body node is loaded before proceeding.
        if (!iFrameBodyNode || !zoom) {
            return;
        }

        // CSSStyleDeclaration doesn't have the `zoom` property.
        (iFrameBodyNode.style as CSSStyleDeclaration & { zoom: string }).zoom = `${ zoom }%`;
    }, [ iFrameBodyNode, zoom ]);

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
    responsive: true,
    styleNodeInjectionStrategy: "append"
};
