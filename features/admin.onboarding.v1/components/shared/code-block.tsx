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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Tab from "@oxygen-ui/react/Tab";
import Tabs from "@oxygen-ui/react/Tabs";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { CheckIcon, CopyIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";

/**
 * Props interface for CodeBlock component.
 */
export interface CodeBlockPropsInterface extends IdentifiableComponentInterface {
    /** Code content to display */
    code: string;
    /** Optional label for the code block */
    label?: string;
    /** Show package manager tabs */
    showPackageManagerTabs?: boolean;
    /** npm command */
    npmCommand?: string;
    /** yarn command */
    yarnCommand?: string;
    /** pnpm command */
    pnpmCommand?: string;
    /** Show copy button */
    showCopy?: boolean;
    /** Maximum height for scrollable content */
    maxHeight?: number | string;
}

/**
 * Package manager options.
 */
type PackageManager = "npm" | "yarn" | "pnpm";

/**
 * Container for the code block.
 */
const CodeBlockContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: "#1e1e1e",
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    position: "relative"
}));

/**
 * Header with optional tabs and copy button.
 */
const CodeBlockHeader = styled(Box)(() => ({
    alignItems: "center",
    backgroundColor: "#2d2d2d",
    borderBottom: "1px solid #3d3d3d",
    display: "flex",
    justifyContent: "space-between",
    minHeight: 40,
    paddingRight: 8
}));

/**
 * Styled tabs for package managers.
 */
const PackageManagerTabs = styled(Tabs)(() => ({
    "& .MuiTab-root": {
        color: "#9ca3af",
        fontSize: "0.75rem",
        minHeight: 40,
        minWidth: "auto",
        padding: "8px 12px",
        textTransform: "none",
        "&.Mui-selected": {
            color: "#ffffff"
        }
    },
    "& .MuiTabs-indicator": {
        backgroundColor: "#ff7300"
    },
    minHeight: 40
}));

/**
 * Label for simple code blocks without tabs.
 */
const CodeBlockLabel = styled(Box)(() => ({
    color: "#9ca3af",
    fontSize: "0.75rem",
    padding: "0 12px"
}));

/**
 * Code content area.
 */
const CodeContent = styled(Box)<{ maxHeight?: number | string }>(({ maxHeight }) => ({
    color: "#e4e4e7",
    fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
    fontSize: "0.8125rem",
    lineHeight: 1.6,
    maxHeight: maxHeight || "auto",
    overflow: "auto",
    padding: "12px 16px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
}));

/**
 * Copy button styling.
 */
const CopyButton = styled(IconButton)(() => ({
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)"
    },
    color: "#9ca3af",
    padding: 6
}));

/**
 * Code block component with syntax display and copy functionality.
 */
const CodeBlock: FunctionComponent<CodeBlockPropsInterface> = (props: CodeBlockPropsInterface): ReactElement => {
    const {
        code,
        label,
        showPackageManagerTabs = false,
        npmCommand,
        yarnCommand,
        pnpmCommand,
        showCopy = true,
        maxHeight,
        ["data-componentid"]: componentId = "code-block"
    } = props;

    const [ packageManager, setPackageManager ] = useState<PackageManager>("npm");
    const [ copied, setCopied ] = useState<boolean>(false);

    const getDisplayCode = useCallback((): string => {
        if (showPackageManagerTabs) {
            switch (packageManager) {
                case "npm":
                    return npmCommand || code;
                case "yarn":
                    return yarnCommand || code;
                case "pnpm":
                    return pnpmCommand || code;
                default:
                    return code;
            }
        }

        return code;
    }, [ showPackageManagerTabs, packageManager, npmCommand, yarnCommand, pnpmCommand, code ]);

    const handleCopy = useCallback(async (): Promise<void> => {
        await navigator.clipboard.writeText(getDisplayCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [ getDisplayCode ]);

    const handlePackageManagerChange = (_event: React.SyntheticEvent, newValue: PackageManager): void => {
        setPackageManager(newValue);
    };

    return (
        <CodeBlockContainer data-componentid={ componentId }>
            <CodeBlockHeader>
                { showPackageManagerTabs ? (
                    <PackageManagerTabs
                        onChange={ handlePackageManagerChange }
                        value={ packageManager }
                        data-componentid={ `${componentId}-tabs` }
                    >
                        <Tab label="npm" value="npm" />
                        <Tab label="yarn" value="yarn" />
                        <Tab label="pnpm" value="pnpm" />
                    </PackageManagerTabs>
                ) : (
                    <CodeBlockLabel>{ label }</CodeBlockLabel>
                ) }
                { showCopy && (
                    <Tooltip title={ copied ? "Copied!" : "Copy" }>
                        <CopyButton
                            onClick={ handleCopy }
                            size="small"
                            data-componentid={ `${componentId}-copy` }
                        >
                            { copied ? <CheckIcon size={ 16 } /> : <CopyIcon size={ 16 } /> }
                        </CopyButton>
                    </Tooltip>
                ) }
            </CodeBlockHeader>
            <CodeContent maxHeight={ maxHeight } data-componentid={ `${componentId}-content` }>
                { getDisplayCode() }
            </CodeContent>
        </CodeBlockContainer>
    );
};

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
