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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import {
    Link,
    MarkdownCustomComponentPropsInterface
} from "@wso2is/react-components";
import { saveAs } from "file-saver";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { useGetBlobResource } from "../../../../api/use-get-blob-resource";
import useGlobalMarkdown from "../use-global-markdown";

const DEFAULT_DOWNLOAD_FILE_NAME: string = "download";

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
    };
}

/**
 * Markdown custom component for the link element.
 *
 * @param Props - Props to be injected into the component.
 */
const MarkdownLink: FunctionComponent<MarkdownLinkProps> = (props: MarkdownLinkProps): ReactElement => {
    const {
        href,
        title,
        children,
        "data-config": dataConfig,
        "data-componentid": componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const { onHandleInternalUrl } = useGlobalMarkdown();

    const [ downloadLink, setDownloadLink ] = useState("");

    const {
        data: blobData,
        isLoading: blobFetchRequestIsLoading,
        error: blobFetchRequestError
    } = useGetBlobResource(downloadLink, !!downloadLink);

    /**
     * Initiate the download when the blob resource becomes available.
     */
    useEffect(() => {
        if (blobData) {
            if (dataConfig?.fileName) {
                saveAs(blobData, dataConfig?.fileName);
            } else {
                saveAs(blobData, DEFAULT_DOWNLOAD_FILE_NAME);
            }

            setDownloadLink("");
        }
    }, [ blobData ]);

    /**
     * Handles the blob resource fetch request error.
     */
    useEffect(() => {
        if (!blobFetchRequestError) {
            return;
        }

        if (blobFetchRequestError.response?.data?.description) {
            dispatch(addAlert({
                description: blobFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.fetchApplication.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchApplication" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.fetchApplication.genericError." +
                "message")
        }));
    }, [ blobFetchRequestError ]);

    /**
     * Initiate the download process.
     */
    const initDownload = (): void => {
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

        if (blobFetchRequestIsLoading) {
            return;
        }

        setDownloadLink(href);
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
    );
};

/**
 * Default props for the `MarkdownLink` component.
 */
MarkdownLink.defaultProps = {
    "data-componentid": "custom-markdown-link"
};

export { MarkdownLink as a };
