/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, {
    FunctionComponent,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useState
} from "react";
import { Segment } from "semantic-ui-react";

interface StickyBarPropsInterface {
    updateButtonRef: MutableRefObject<HTMLElement>;
    isFormStale: boolean;
    containerRef: MutableRefObject<HTMLElement>;
}

/**
 * Sticks the children to the specified position.
 *
 * @param props - Props injected to the component.
 *
 * @returns StickyBar
 */
export const StickyBar: FunctionComponent<PropsWithChildren<
    StickyBarPropsInterface
>> = (props: PropsWithChildren<StickyBarPropsInterface>): ReactElement => {
    const { updateButtonRef, isFormStale, containerRef } = props;

    const [ stickyBarWidth, setStickyBarWidth ] = useState<number>(0);
    const [ padding, setPadding ] = useState<number>(0);
    const [ showStickyBar, setShowStickyBar ] = useState<boolean>(false);

    useEffect(() => {
        if (!updateButtonRef.current) {
            return;
        }

        const observer: IntersectionObserver = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                const entry: IntersectionObserverEntry = entries[ 0 ];

                if (entry.isIntersecting) {
                    setShowStickyBar(false);
                } else {
                    setShowStickyBar(true);
                }
            },
            {
                root: null,
                threshold: 0.1
            }
        );

        observer.observe(updateButtonRef.current);

        return () => {
            observer.disconnect();
        };
    }, [ updateButtonRef.current ]);

    useEffect(() => {
        setStickyBarWidth(containerRef?.current?.offsetWidth);

        const containerPadding: string = window.getComputedStyle(containerRef?.current, null)
            .getPropertyValue("padding-left");

        const containerPaddingValue: number = parseInt(containerPadding?.replace("px", ""), 10);

        setPadding(containerPaddingValue - 14);
    }, [ containerRef.current ]);

    return (
        showStickyBar &&
        isFormStale && (
            <Segment
                className="sticky-bar"
                style={ { marginLeft: `-${ padding }px`, width: `calc(${ stickyBarWidth - 2 ?? 0 }px` } }
            >
                { props.children }
            </Segment>
        )
    );
};
