/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Container } from "semantic-ui-react";

/**
 * Default layout Prop types.
 */
export interface DefaultLayoutPropsInterface {
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Default layout.
 *
 * @param {React.PropsWithChildren<DefaultLayoutPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const DefaultLayout: FunctionComponent<PropsWithChildren<DefaultLayoutPropsInterface>> = (
    props: PropsWithChildren<DefaultLayoutPropsInterface>
): ReactElement => {

    const {
        children,
        fluid
    } = props;

    return (
        <Container fluid={ fluid }>
            { children }
        </Container>
    );
};


/**
 * Default props for the default layout.
 */
DefaultLayout.defaultProps = {
    fluid: true
};
