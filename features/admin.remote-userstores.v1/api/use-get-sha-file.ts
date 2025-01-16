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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { HttpMethods } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";

/**
 * Hook to get the checksum file content.
 *
 * @param filePath - File path to be fetched.
 * @param shouldFetch - If true, will fetch the data.
 *
 * @returns content of the file.
 */
const useGetCheckSum = <Data = string, Error = RequestErrorInterface>(
    filePath: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "text/plain",
            "Content-Type": "text/plain"
        },
        method: HttpMethods.GET,
        responseType: "text",
        url: filePath
    };

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    } = useRequest<Data, Error>(
        (shouldFetch && !isEmpty(filePath)) ? requestConfig : null,
        { attachToken: false }
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetCheckSum;
