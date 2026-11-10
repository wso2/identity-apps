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

import Modal from "@mui/material/Modal";
import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormControl from "@oxygen-ui/react/FormControl";
import IconButton from "@oxygen-ui/react/IconButton";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import type MonacoEditorComponent from "@wso2is/admin.core.v1/components/monaco-editor/monaco-editor";
import { AppUtils } from "@wso2is/admin.core.v1/utils/app-utils";
import { IdentifiableComponentInterface, StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import React, {
    ChangeEvent,
    FunctionComponent,
    LazyExoticComponent,
    ReactElement,
    Suspense,
    lazy,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Label, Form as SemanticForm } from "semantic-ui-react";
import { SupportedEditorThemes } from "../models/content-editor";

/**
 * Props interface of {@link FunctionLibraryContentEditor}.
 */
interface FunctionLibraryContentEditorPropsInterface extends IdentifiableComponentInterface {
    /**
     * Current content of the function library.
     */
    value: string;
    /**
     * Called when the content is changed in the editor.
     */
    onChange: (value: string) => void;
    /**
     * Whether the editor should be read-only.
     */
    readOnly?: boolean;
    /**
     * Validation error shown below the editor, styled like the errors of the other form fields.
     */
    error?: string;
}

/**
 * Stacks the full-screen editor above the Console's Semantic UI dialogs (z-index 1500), such as the create wizard,
 * and its toolbar tooltip above the full-screen editor.
 */
const FULL_SCREEN_Z_INDEX: number = 1600;

const MonacoEditor: LazyExoticComponent<typeof MonacoEditorComponent> = lazy(() =>
    import("@wso2is/admin.core.v1/components/monaco-editor/monaco-editor")
);

const EditorPanel: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.grey[100],
    border: `1px solid ${ theme.palette.divider }`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2)
}));

const Toolbar: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1)
}));

const ToolbarActions: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(1)
}));

const EditorFrame: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    border: `1px solid ${ theme.palette.divider }`,
    height: theme.spacing(50)
}));

const FullScreenContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    height: "90%",
    left: "50%",
    padding: theme.spacing(2),
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%"
}));

const FullScreenEditorFrame: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    border: `1px solid ${ theme.palette.divider }`,
    flex: 1,
    minHeight: 0
}));

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const MaximizeIcon = (): ReactElement => (
    <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height={ 16 }
        width={ 16 }
        xmlns="http://www.w3.org/2000/svg"
    >
        <polyline points="15 3 21 3 21 9"></polyline>
        <polyline points="9 21 3 21 3 15"></polyline>
        <line x1="21" y1="3" x2="14" y2="10"></line>
        <line x1="3" y1="21" x2="10" y2="14"></line>
    </svg>
);

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const MinimizeIcon = (): ReactElement => (
    <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height={ 16 }
        width={ 16 }
        xmlns="http://www.w3.org/2000/svg"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M18 10h-4v-4"></path>
        <path d="M20 4l-6 6"></path>
        <path d="M6 14h4v4"></path>
        <path d="M10 14l-6 6"></path>
    </svg>
);

/**
 * Saves the editor theme in the same user preference as the conditional authentication script editor.
 *
 * @param theme - Selected theme.
 */
const persistEditorTheme = (theme: SupportedEditorThemes): void => {
    const preferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

    if (!preferences?.identityAppsSettings?.userPreferences) {
        return;
    }

    AppUtils.setUserPreferences({
        ...preferences,
        identityAppsSettings: {
            ...preferences.identityAppsSettings,
            userPreferences: {
                ...preferences.identityAppsSettings.userPreferences,
                [ ApplicationManagementConstants.CONDITIONAL_AUTH_EDITOR_THEME_STORAGE_KEY ]: theme
            }
        }
    });
};

/**
 * JavaScript editor for the content of a function library: the same Monaco editor, theme selection and full-screen
 * mode as the conditional authentication script editor.
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
        readOnly = false,
        error,
        ["data-componentid"]: componentId = "function-library-content-editor"
    } = props;

    const { t } = useTranslation();

    const [ editorTheme, setEditorTheme ] = useState<SupportedEditorThemes>(
        AppUtils.getUserPreferences()?.identityAppsSettings?.userPreferences
            ?.[ApplicationManagementConstants.CONDITIONAL_AUTH_EDITOR_THEME_STORAGE_KEY]
        ?? SupportedEditorThemes.DARK
    );
    const [ isFullScreen, setIsFullScreen ] = useState<boolean>(false);

    const renderEditor = (): ReactElement => (
        <MonacoEditor
            loading={ null }
            width="100%"
            height="100%"
            language="javascript"
            theme={ editorTheme }
            value={ value ?? "" }
            options={ {
                automaticLayout: true,
                readOnly
            } }
            onChange={ (newValue: string) => onChange(newValue ?? "") }
            data-componentid={ `${ componentId }-code-editor` }
        />
    );

    const renderToolbar = (): ReactElement => (
        <Toolbar>
            <Typography>{ t("authenticationFlow:scriptEditor.panelHeader") }</Typography>
            <ToolbarActions>
                { !isFullScreen && (
                    <FormControl size="small">
                        <Select
                            value={ editorTheme }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                setEditorTheme(event.target.value as SupportedEditorThemes);
                                persistEditorTheme(event.target.value as SupportedEditorThemes);
                            } }
                            data-componentid={ `${ componentId }-theme-select` }
                        >
                            <MenuItem value={ SupportedEditorThemes.LIGHT }>
                                { t("authenticationFlow:scriptEditor.themes.light.label") }
                            </MenuItem>
                            <MenuItem value={ SupportedEditorThemes.DARK }>
                                { t("authenticationFlow:scriptEditor.themes.dark.label") }
                            </MenuItem>
                            <MenuItem value={ SupportedEditorThemes.HIGH_CONTRAST }>
                                { t("authenticationFlow:scriptEditor.themes.highContrast.label") }
                            </MenuItem>
                        </Select>
                    </FormControl>
                ) }
                <Tooltip
                    title={ isFullScreen ? t("common:exitFullScreen") : t("common:goFullScreen") }
                    slotProps={ { popper: { sx: { zIndex: FULL_SCREEN_Z_INDEX + 1 } } } }
                >
                    <IconButton
                        size="small"
                        onClick={ () => setIsFullScreen(!isFullScreen) }
                        data-componentid={ `${ componentId }-full-screen-toggle` }
                    >
                        { isFullScreen ? <MinimizeIcon /> : <MaximizeIcon /> }
                    </IconButton>
                </Tooltip>
            </ToolbarActions>
        </Toolbar>
    );

    return (
        <div className="function-library-content-editor" data-componentid={ componentId }>
            <Suspense fallback={ <CircularProgress /> }>
                <EditorPanel>
                    { renderToolbar() }
                    <EditorFrame>
                        { renderEditor() }
                    </EditorFrame>
                </EditorPanel>
                <Modal
                    open={ isFullScreen }
                    onClose={ () => setIsFullScreen(false) }
                    // The create wizard's blurring dimmer blurs every element directly under <body> but itself, which
                    // includes this modal, so the blur is switched off here.
                    sx={ { filter: "none !important", zIndex: FULL_SCREEN_Z_INDEX } }
                >
                    <FullScreenContainer data-componentid={ `${ componentId }-full-screen` }>
                        { renderToolbar() }
                        <FullScreenEditorFrame>
                            { renderEditor() }
                        </FullScreenEditorFrame>
                    </FullScreenContainer>
                </Modal>
            </Suspense>
            { error && (
                // The error label styles of Semantic UI only apply inside a form field.
                <SemanticForm as="div">
                    <SemanticForm.Field error>
                        <Label
                            pointing="above"
                            prompt
                            role="alert"
                            data-componentid={ `${ componentId }-error` }
                        >
                            { error }
                        </Label>
                    </SemanticForm.Field>
                </SemanticForm>
            ) }
        </div>
    );
};

export default FunctionLibraryContentEditor;
