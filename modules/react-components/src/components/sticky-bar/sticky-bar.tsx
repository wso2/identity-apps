/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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
        if (!containerRef) {
            return;
        }

        setStickyBarWidth(containerRef?.current?.offsetWidth);

        const containerPadding: string = window.getComputedStyle(containerRef?.current, null)
            .getPropertyValue("padding-left");

        const containerPaddingValue: number = parseInt(containerPadding?.replace("px", ""), 10);

        setPadding(containerPaddingValue - 14);
    }, [ containerRef?.current ]);

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
