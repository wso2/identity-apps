/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
