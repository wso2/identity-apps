/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { HttpMethods } from "@wso2is/core/models";
import { useEffect, useState } from "react";
import { AppConstants } from "../../../../features/core/constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../features/core/hooks/use-request";
import { PreviewScreenType } from "../models/branding-preferences";

/**
 * Custom hook that retrieves a preview skeleton's markup of a given screen type.
 *
 * @param previewScreenType - The type of screen to retrieve the preview skeleton markup for.
 * @returns An object containing the preview skeleton markup request result.
 */
export const usePreviewContent = <Data = string, Error = RequestErrorInterface>(
    previewScreenType: PreviewScreenType
): RequestResultInterface<Data, Error> => {
    const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";
    const url: string = `https://${window.location.host}${
        basename
    }/resources/branding/preview-skeletons/${previewScreenType}/body.html`;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "text/html",
            "Content-Type": "text/html"
        },
        method: HttpMethods.GET,
        responseType: "blob",
        url
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, { attachToken: false });
    const [ content, setContent ] = useState<string>("");

    useEffect(() => {
        if (!data) {
            return;
        }

        (async () => {
            setContent(await (data as unknown as Blob).text());
        })();
    }, [ data ]);

    return {
        data: content as unknown as Data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Custom hook that retrieves a preview skeleton's styles of a given screen type.
 *
 * @param previewScreenType - The type of screen to retrieve the preview skeleton styles for.
 * @returns An object containing the preview skeleton styles request result.
 */
export const usePreviewStyle = <Data = string, Error = RequestErrorInterface>(
    previewScreenType: PreviewScreenType
): RequestResultInterface<Data, Error> => {
    const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";
    const url: string = `https://${window.location.host}${
        basename
    }/resources/branding/preview-skeletons/${previewScreenType}/styles.css`;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "text/css",
            "Content-Type": "text/css"
        },
        method: HttpMethods.GET,
        responseType: "blob",
        url
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, { attachToken: false });
    const [ styles, setStyles ] = useState<string>("");

    useEffect(() => {
        if (!data) {
            return;
        }

        (async () => {
            setStyles(await (data as unknown as Blob).text());
        })();
    }, [ data ]);

    return {
        data: styles as unknown as Data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};
