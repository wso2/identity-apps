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
    formRef: MutableRefObject<HTMLElement>;
    isFormPristine: boolean;
}

/**
 * Sticks the children to the specified position.
 *
 * @returns StickyBar
 */
export const StickyBar: FunctionComponent<PropsWithChildren<
    StickyBarPropsInterface
>> = (props: PropsWithChildren<StickyBarPropsInterface>): ReactElement => {
    const { updateButtonRef, formRef, isFormPristine } = props;

    const [ stickyBarWidth, setStickyBarWidth ] = useState<number>(0);
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
        setStickyBarWidth(formRef?.current?.offsetWidth);
    }, [ formRef.current ]);

    return (
        showStickyBar &&
        !isFormPristine && (
            <Segment
                className="sticky-bar"
                style={ { width: `calc(${ stickyBarWidth ?? 0 }px + 2em` } }
            >
                { props.children }
            </Segment>
        )
    );
};
