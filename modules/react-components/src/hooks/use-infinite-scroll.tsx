/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { MutableRefObject, useEffect } from "react";

export const useInfiniteScroll = (
    container: MutableRefObject<Element>,
    lastItem: MutableRefObject<Element>,
    hasMore: boolean,
    fetcher: () => void
): void => {
    useEffect(() => {
        if (!container.current || !lastItem.current) {
            return;
        }
        const options: IntersectionObserverInit = {
            root: container.current,
            threshold: 0.1
        };
        const observer = new IntersectionObserver(entries => {
            if (entries[ 0 ].isIntersecting && hasMore) {
                fetcher();
            }
        }, options);

        observer.observe(lastItem.current);

        return () => {
            lastItem.current && observer.unobserve(lastItem.current);
        };
    }, [ container, lastItem, hasMore ]);
};
