/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { URLUtils } from "@wso2is/core/utils";
import {
    Link,
    MarkdownCustomComponentPropsInterface,
    PrimaryButton
} from "@wso2is/react-components";
import { saveAs } from "file-saver";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import useGlobalMarkdown from "../../../../hooks/use-global-markdown";

const DEFAULT_DOWNLOAD_FILE_NAME: string = "download";

/**
 * Component types for rendering the link.
 */
enum ComponentTypes {
    LINK = "link",
    BUTTON = "button"
}

/**
 * Props interface for the `MarkdownLink` component.
 */
interface MarkdownLinkProps extends MarkdownCustomComponentPropsInterface<"a"> {
    /**
     * Custom attributes supplied by the 'rehype-attr' plugin.
     */
    "data-config"?: {
        /**
         * Flag to determine whether the link is an external link.
         */
        external?: boolean;
        /**
         * Flag to determine whether the link is a download link.
         */
        download?: boolean;
        /**
         * If the link is a download link, specify the name for the downloaded file.
         */
        fileName?: string;
        /**
         * Download the string content as a file.
         * This will take precedence over href.
         * Content should have a Base64 encoded string.
         */
        content?: string;
        /**
         * The type that should be assigned to the above content file.
         */
        type?: string;
        /**
         * Component type of the link element.
         */
        as?: ComponentTypes;
    };
}

/**
 * Markdown custom component for the link element.
 *
 * @param Props - Props to be injected into the component.
 */
const MarkdownLink: FunctionComponent<MarkdownLinkProps> = ({
    href,
    title,
    children,
    "data-config": dataConfig,
    "data-componentid": componentId = "custom-markdown-link"
}: MarkdownLinkProps): ReactElement => {

    const { onHandleInternalUrl } = useGlobalMarkdown();

    /**
     * Initiate the download process.
     */
    const initDownload = async (): Promise<void> => {
        if (dataConfig?.content && dataConfig?.type) {
            const blob: Blob = new Blob([ atob(dataConfig?.content) ], {
                type: dataConfig?.type
            });

            if (dataConfig?.fileName) {
                saveAs(blob, dataConfig?.fileName);
            } else {
                saveAs(blob, DEFAULT_DOWNLOAD_FILE_NAME);
            }

            return;
        }

        const response = await fetch(href);

        // Check if the response is ok (status is in the range 200-299).
        if (response.ok) {
            // Convert the response to a Blob.
            const blob = await response.blob();

            if (blob) {
                if (dataConfig?.fileName) {
                    saveAs(blob, dataConfig?.fileName);
                } else {
                    saveAs(blob, DEFAULT_DOWNLOAD_FILE_NAME);
                }
            }
        }
    };

    /**
     * Verify if the provided URL is relative.
     */
    const isInternalUrl: boolean = useMemo(() => {
        if (href && (URLUtils.isHttpsOrHttpUrl(href) || href.startsWith("#"))) {
            return false;
        }

        return true;
    }, [ href ]);

    if (typeof children !== "string") {
        return null;
    }

    return (
        dataConfig?.as === ComponentTypes.BUTTON && dataConfig?.download
            ? (
                <PrimaryButton
                    content={ children }
                    onClick={ initDownload }
                    data-componentid={ componentId }
                    icon="cloud download"
                />
            )
            : (
                <Link
                    link={ href }
                    onClick={
                        isInternalUrl
                            ? () => onHandleInternalUrl(href)
                            : dataConfig?.download && initDownload
                    }
                    external={ !(dataConfig?.external === false) }
                    target={ (dataConfig?.external === false) ? "_self" : "_blank" }
                    data-componentid={ componentId }
                    title={ title }
                    icon={ dataConfig?.download ? "arrow alternate circle down outline" : undefined }
                >
                    {  children }
                </Link>
            )
    );
};

export default MarkdownLink;
