/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Popup } from "@wso2is/react-components";
import React, { MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon } from "semantic-ui-react";

const CopyButton = (props: { value: string }):ReactElement => {
    const { value } = props;
    const [ icon, setIcon ] = useState<string>("copy");
    const timeRef: MutableRefObject<NodeJS.Timeout> = useRef(null);
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
