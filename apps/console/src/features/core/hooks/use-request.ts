/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

export type GetRequest = AxiosRequestConfig | null

interface Return<Data, Error>
    extends Pick<
        SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
        "isValidating" | "error" | "mutate"
    > {
    data: Data | undefined
    response: AxiosResponse<Data> | undefined
}

export interface Config<Data = unknown, Error = unknown>
    extends Omit<
        SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
        "fallbackData"
    > {
    fallbackData?: Data
}

const globalConfig: SWRConfiguration = {
    dedupingInterval: 360000
};

export default function useRequest<Data = unknown, Error = unknown>(
    request: GetRequest,
    { fallbackData, ...config }: Config<Data, Error> = {}
): Return<Data, Error> {

    const _config = {
        ...globalConfig,
        ...config
    };

    const {
        data: response,
        error,
        isValidating,
        mutate
    } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
        request && JSON.stringify(request),
        /**
         * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
         * function is actually only called by `useSWR` when it isn't.
         */
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        () => httpClient(request!),
        {
            // Revalidates data on document focus.
            // Sends unnecessary request so disabling globally.
            // If needed, can pass in as a special option for selected requests.
            revalidateOnFocus: false,
            ..._config,
            fallbackData: fallbackData && {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                config: request!,
                data: fallbackData,
                headers: {},
                status: 200,
                statusText: "InitialData"
            }
        }
    );

    return {
        data: response && response.data,
        error,
        isValidating,
        mutate,
        response
    };
}
