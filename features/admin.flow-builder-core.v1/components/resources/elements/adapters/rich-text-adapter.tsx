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
import { Encode } from "@wso2is/core/utils";
import parse, { DOMNode, Element, domToReact } from "html-react-parser";
import React, { FunctionComponent, ReactElement } from "react";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";
import "./rich-text-adapter.scss";

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
}: RichTextAdapterPropsInterface): ReactElement => (
    <div className="rich-text-content">
        { parse(Encode.forHtml(resource?.config?.text), {
            replace(domNode: DOMNode) {
                if (domNode.type === "tag") {
                    const element: Element = domNode as Element;
                    const tagName: string = element.name;
                    const className: string | undefined = element.attribs?.class;
                    const children: React.ReactNode = domToReact(element.children);

                    switch (tagName) {
                        case "p":
                            return <p className={ className }>{ children }</p>;
                        case "span":
                            return <span className={ className }>{ children }</span>;
                        case "h1":
                            return <h1 className={ className }>{ children }</h1>;
                        case "h2":
                            return <h2 className={ className }>{ children }</h2>;
                        case "h3":
                            return <h3 className={ className }>{ children }</h3>;
                        case "h4":
                            return <h4 className={ className }>{ children }</h4>;
                        case "h5":
                            return <h5 className={ className }>{ children }</h5>;
                        case "h6":
                            return <h6 className={ className }>{ children }</h6>;
                        case "b":
                            return <b className={ className }>{ children }</b>;
                        case "i":
                            return <i className={ className }>{ children }</i>;
                        case "em":
                            return <em className={ className }>{ children }</em>;
                        case "u":
                            return <u className={ className }>{ children }</u>;
                        default:
                            return undefined;
                    }
                }
            }
        }) }
    </div>
);

export default RichTextAdapter;
