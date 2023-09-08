/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import Avatar from "@oxygen-ui/react/Avatar";
import { getGravatarImage } from "@wso2is/core/api";
import React, { ReactElement, useEffect, useState } from "react";

interface GravatarProps {
    /**
     * Gravatar email.
     */
    email: string;
}

export const Gravatar = (props: GravatarProps): ReactElement => {
    const { email } = props;
    const [ imageSrc, setImageSrc ] = useState<string>("");

    useEffect(() => {
        if (!email) {
            return;
        }

        getGravatarImage(email)
            .then((response: string) => {
                setImageSrc(response);
            })
            .catch(() => {
                setImageSrc("");
            });
    }, [ email ]);

    return <Avatar src={ imageSrc } />;
};
