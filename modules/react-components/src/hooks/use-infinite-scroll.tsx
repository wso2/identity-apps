/**
 * Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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

import { MutableRefObject, useCallback, useEffect, useRef } from "react";

export function useInfiniteScroll(
    hasMore: boolean,
    loadMore: () => void,
    container?: MutableRefObject<Element | null>,
    lastItem?: MutableRefObject<Element | null>,
    isLoading?: boolean
) {
    const observerRef: MutableRefObject<IntersectionObserver | null> = useRef(null);
    const sentinelRef: MutableRefObject<Element | null> = useRef(null);

    const observe = useCallback((node: Element | null) => {
        if (!node || isLoading || !hasMore) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const options: IntersectionObserverInit = {
            root: container?.current || null,
            rootMargin: "50px",
            threshold: 0.1
        };

        observerRef.current = new IntersectionObserver(([ entry ]) => {
            if (entry.isIntersecting) {
                loadMore();
            }
        }, options);

        observerRef.current.observe(node);
        sentinelRef.current = node;
    }, [ container, hasMore, isLoading, loadMore ]);

    useEffect(() => {
        if (!lastItem?.current || isLoading || !hasMore) return;

        observe(lastItem.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [ lastItem?.current, isLoading, hasMore, observe ]);

    return { observe };
}
