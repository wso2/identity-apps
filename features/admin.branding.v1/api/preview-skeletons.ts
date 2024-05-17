/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { HttpMethods } from "@wso2is/core/models";
import { useEffect, useState } from "react";
import { AppConstants } from "@wso2is/admin.core.v1/constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";

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

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, {
        attachToken: false,
        shouldRetryOnError: false
    });
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

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, {
        attachToken: false,
        shouldRetryOnError: false
    });
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
