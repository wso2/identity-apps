/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import { ArrowUpIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CodeEditor, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * Props interface of {@link FunctionLibraryContentEditor}.
 */
interface FunctionLibraryContentEditorPropsInterface extends IdentifiableComponentInterface {
    /**
     * Current content of the function library.
     */
    value: string;
    /**
     * Called when the content is changed either by typing or by uploading a file.
     */
    onChange: (value: string) => void;
    /**
     * Whether the editor should be read-only.
     */
    readOnly?: boolean;
}

/**
 * Code editor used to author or upload the JavaScript content of a function library.
 *
 * @param props - Props injected to the component.
 * @returns Function library content editor.
 */
const FunctionLibraryContentEditor: FunctionComponent<FunctionLibraryContentEditorPropsInterface> = (
    props: FunctionLibraryContentEditorPropsInterface
): ReactElement => {
    const {
        value,
        onChange,
        readOnly,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const fileInputRef: React.MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const handleFileSelected: (event: React.ChangeEvent<HTMLInputElement>) => void = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const file: File = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader: FileReader = new FileReader();

        reader.onload = (): void => {
            onChange(reader.result as string);
        };
        reader.readAsText(file);

        // Reset so that selecting the same file again still triggers a change.
        event.target.value = "";
    };

    return (
        <div className="function-library-content-editor" data-componentid={ componentId }>
            <Hint>
                { t("functionLibraries:forms.content.hint") }
            </Hint>
            { !readOnly && (
                <>
                    <input
                        ref={ fileInputRef }
                        type="file"
                        accept=".js"
                        hidden
                        onChange={ handleFileSelected }
                        data-componentid={ `${ componentId }-file-input` }
                    />
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={ <ArrowUpIcon /> }
                        onClick={ () => fileInputRef.current?.click() }
                        data-componentid={ `${ componentId }-upload-button` }
                    >
                        { t("functionLibraries:forms.content.uploadButton") }
                    </Button>
                </>
            ) }
            <div className="code-editor-wrapper">
                <CodeEditor
                    lint
                    allowFullScreen
                    language="javascript"
                    sourceCode={ value }
                    readOnly={ readOnly }
                    options={ {
                        lineWrapping: true
                    } }
                    onChange={ (
                        editor: unknown,
                        data: unknown,
                        newValue: string
                    ) => onChange(newValue) }
                    translations={ {
                        copyCode: t("common:copyToClipboard"),
                        exitFullScreen: t("common:exitFullScreen"),
                        goFullScreen: t("common:goFullScreen")
                    } }
                    data-componentid={ `${ componentId }-code-editor` }
                />
            </div>
        </div>
    );
};

FunctionLibraryContentEditor.defaultProps = {
    "data-componentid": "function-library-content-editor",
    readOnly: false
};

export default FunctionLibraryContentEditor;
