/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React, { useRef, useEffect, useState } from "react";
import { Input, Popup, Button } from "semantic-ui-react";

interface CopyInputFieldPropsInterface{
    value: string;
    className?: string;
}
export const CopyInputField = (props:CopyInputFieldPropsInterface): React.ReactElement => {

    const claimURIText = useRef(null);
    const copyButton = useRef(null);
    
    const { value, className } = props;

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            copyButton.current.focus();
        }
    }, [copied]);
    
    return (
        <Input
            ref={claimURIText}
            value={value}
            labelPosition="right"
            readOnly
            action
            fluid
            className={className}
        >
            <input />
            <Popup
                trigger={
                    (
                        <Button
                            icon="copy"
                            type="button"
                            onMouseEnter={() => {
                                setCopied(false);
                            }}
                            ref={copyButton}
                            onClick={(event: React.MouseEvent) => {
                                claimURIText.current?.select();
                                setCopied(true);
                                document.execCommand("copy");
                                copyButton.current.ref.current.blur();
                                if (window.getSelection) {
                                    window.getSelection().removeAllRanges();
                                }
                            }}
                        />
                    )
                }
                openOnTriggerFocus
                closeOnTriggerBlur
                position="top center"
                content={copied ? "Copied!" : "Copy to clipboard"}
                inverted
            />
        </Input>
    )
};
