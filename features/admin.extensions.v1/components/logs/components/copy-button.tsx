/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Popup } from "@wso2is/react-components";
import React, { MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon } from "semantic-ui-react";

const CopyButton = (props: { value: string }):ReactElement => {
    const { value } = props;
    const [ icon, setIcon ] = useState<string>("copy");
    const timeRef: MutableRefObject<ReturnType<typeof setInterval>> = useRef(null);
    const { t } = useTranslation();

    const handleCopy: () => void = () => {
        setIcon("check");
        navigator.clipboard.writeText(value);
        timeRef.current = setTimeout(() => setIcon("copy"), 3000);
    };

    useEffect(() => {
        return () => clearTimeout(timeRef.current);
    }, []);

    return (
        <Popup
            trigger={
                (<Button
                    size="mini"
                    basic
                    icon
                    compact
                    onClick={ handleCopy }
                >
                    { icon === "copy" ? (
                        <Icon name="copy outline" />
                    ) : (
                        <Icon name="check" />
                    ) }
                </Button>)
            }
            inverted
            content={ (
                <small>
                    { t("extensions:develop.monitor.tooltips.copy") }
                </small>
            ) }
        />
    );
};

export default CopyButton;
