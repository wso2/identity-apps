/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { CheckIcon, CopyIcon, EyeIcon, EyeSlashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";

/**
 * Props for the CopyableField component.
 */
export interface CopyableFieldPropsInterface extends IdentifiableComponentInterface {
    /** Field label */
    label: string;
    /** Field value */
    value: string;
    /** Whether to mask the value as a secret with show/hide toggle */
    secret?: boolean;
}

/**
 * Read-only text field with copy-to-clipboard button and optional secret masking.
 * Oxygen UI equivalent of the Console's CopyInputField component.
 */
const CopyableField: FunctionComponent<CopyableFieldPropsInterface> = (
    props: CopyableFieldPropsInterface
): ReactElement => {
    const {
        label,
        value,
        secret = false,
        ["data-componentid"]: componentId = "copyable-field"
    } = props;

    const [ copied, setCopied ] = useState<boolean>(false);
    const [ showSecret, setShowSecret ] = useState<boolean>(false);

    const handleCopy: () => Promise<void> = useCallback(async (): Promise<void> => {
        const success: boolean = await CommonUtils.copyTextToClipboard(value);

        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [ value ]);

    return (
        <TextField
            InputProps={ {
                endAdornment: (
                    <InputAdornment position="end">
                        { secret && (
                            <Tooltip title={ showSecret ? "Hide" : "Show" }>
                                <IconButton
                                    data-componentid={ `${componentId}-toggle-visibility` }
                                    disabled={ !value }
                                    onClick={ () => setShowSecret(!showSecret) }
                                    size="small"
                                >
                                    { showSecret ? <EyeSlashIcon size={ 16 } /> : <EyeIcon size={ 16 } /> }
                                </IconButton>
                            </Tooltip>
                        ) }
                        <Tooltip title={ copied ? "Copied!" : "Copy" }>
                            <IconButton
                                data-componentid={ `${componentId}-copy` }
                                disabled={ !value }
                                onClick={ handleCopy }
                                size="small"
                            >
                                { copied
                                    ? <CheckIcon size={ 16 } />
                                    : <CopyIcon size={ 16 } />
                                }
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                ),
                readOnly: true
            } }
            data-componentid={ componentId }
            fullWidth
            label={ label }
            size="small"
            type={ secret && !showSecret ? "password" : "text" }
            value={ value }
        />
    );
};

export default CopyableField;
