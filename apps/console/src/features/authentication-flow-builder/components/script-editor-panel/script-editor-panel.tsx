/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { DiffOnMount, Monaco, MonacoDiffEditor } from "@monaco-editor/react";
import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormControl from "@oxygen-ui/react/FormControl";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import Toolbar from "@oxygen-ui/react/Toolbar";
import Typography from "@oxygen-ui/react/Typography";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    ChangeEvent,
    HTMLAttributes,
    LazyExoticComponent,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    Suspense,
    lazy,
    useCallback,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SecretSelectionDropdown from "./secret-selection-dropdown";
import { AdaptiveScriptUtils } from "../../../applications/utils/adaptive-script-utils";
import { FeatureConfigInterface } from "../../../core/models";
import { AppState } from "../../../core/store";
import { SecretModel } from "../../../secrets/models/secret";
import useAuthenticationFlow from "../../hooks/use-authentication-flow";
import { SupportedEditorThemes } from "../../models/script-editor";
import "./script-editor-panel.scss";

/**
 * Proptypes for the Script editor panel component.
 */
export type ScriptEditorPanelPropsInterface = IdentifiableComponentInterface & HTMLAttributes<HTMLDivElement>;

const MonacoEditor: LazyExoticComponent<any> = lazy(() =>
    import("@monaco-editor/react" /* webpackChunkName: "MDMonacoEditor" */)
);

/**
 * Script editor panel component.
 *
 * @param props - Props injected to the component.
 * @returns Script editor panel component.
 */
const ScriptEditorPanel = (props: PropsWithChildren<ScriptEditorPanelPropsInterface>): ReactElement => {
    const { className, "data-componentid": componentId } = props;

    const { t } = useTranslation();

    const monacoEditorRef: MutableRefObject<any> = useRef(null);

    const { authenticationSequence, updateAuthenticationSequence } = useAuthenticationFlow();

    const [ editorTheme, setEditorTheme ] = useState<SupportedEditorThemes>(SupportedEditorThemes.DARK);
    const [ isSecretSelectionDropdownOpen, setIsSecretSelectionDropdownOpen ] = useState<boolean>(false);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);

    /**
     * Callback function to handle the editor theme change.
     *
     * @param editor - The Monaco editor instance.
     */
    const handleEditorOnMount: DiffOnMount = useCallback(
        (editor: MonacoDiffEditor): void => {
            monacoEditorRef.current = editor;
        },
        [ monacoEditorRef ]
    );

    /**
     * Callback function to handle changes in the script editor.
     *
     * @param value - The new value of the script editor.
     */
    const handleScriptChange: (value: string) => void = useCallback(
        (value: string): void => {
            updateAuthenticationSequence({
                script: value
            });
        },
        [ updateAuthenticationSequence ]
    );

    /**
     * Function to replace a code block in the Monaco editor.
     *
     * @param toReplace - The new text to replace the selected code block with.
     */
    const replaceCodeBlock = (toReplace: string): void => {
        if (!monacoEditorRef.current) {
            return;
        }

        const selection: Monaco["Selection"] = monacoEditorRef.current.getSelection();

        if (!selection) {
            return;
        }

        monacoEditorRef.current.executeEdits("replaceCodeBlock", [
            {
                range: selection,
                text: toReplace
            }
        ]);

        setIsSecretSelectionDropdownOpen(false);
    };

    /**
     * Get the adaptive script from authentication sequence.
     * If the script is empty then default script will be returned.
     *
     * @returns Adaptive script.
     */
    const getAdaptiveScript = (): string => {
        if (AdaptiveScriptUtils.isEmptyScript(authenticationSequence?.script)) {
            return AdaptiveScriptUtils.generateScript(authenticationSequence?.steps?.length + 1).join("\n");
        }

        return authenticationSequence?.script;
    };

    return (
        <Suspense fallback={ <CircularProgress /> }>
            <div className={ classNames("script-editor-panel", className) } data-componentid={ componentId }>
                <Box className="toolbar-container">
                    <Toolbar variant="dense">
                        <Box>
                            <Typography>{ t("console:loginFlow.scriptEditor.panelHeader") }</Typography>
                        </Box>
                        <div className="actions">
                            <div className="editor-theme-select">
                                <FormControl size="small">
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={ editorTheme }
                                        onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                            setEditorTheme(event.target.value as SupportedEditorThemes);
                                        } }
                                    >
                                        <MenuItem value={ SupportedEditorThemes.LIGHT }>
                                            { t("console:loginFlow.scriptEditor.themes.light.label") }
                                        </MenuItem>
                                        <MenuItem value={ SupportedEditorThemes.DARK }>
                                            { t("console:loginFlow.scriptEditor.themes.dark.label") }
                                        </MenuItem>
                                        <MenuItem value={ SupportedEditorThemes.HIGH_CONTRAST }>
                                            { t("console:loginFlow.scriptEditor.themes.highContrast.label") }
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="secret-selection-menu-wrapper">
                                {
                                    hasRequiredScopes(featureConfig?.secretsManagement,
                                        featureConfig?.secretsManagement?.scopes?.read, allowedScopes) && (
                                        <SecretSelectionDropdown
                                            open={ isSecretSelectionDropdownOpen }
                                            onClose={ () => setIsSecretSelectionDropdownOpen(false) }
                                            onOpen={ () => setIsSecretSelectionDropdownOpen(true) }
                                            onSecretSelect={ (secret: SecretModel) =>
                                                replaceCodeBlock(secret.secretName) }
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </Toolbar>
                </Box>
                <MonacoEditor
                    loading={ null }
                    className="script-editor"
                    width="100%"
                    height="100%"
                    language="javascript"
                    theme={ editorTheme }
                    value={ getAdaptiveScript() }
                    options={ {
                        automaticLayout: true
                    } }
                    onChange={ handleScriptChange }
                    onMount={ handleEditorOnMount }
                    data-componentid={ `${componentId}-code-editor` }
                />
            </div>
        </Suspense>
    );
};

/**
 * Default props for the script editor panel component.
 */
ScriptEditorPanel.defaultProps = {
    "data-componentid": "script-editor-panel"
};

export default ScriptEditorPanel;
