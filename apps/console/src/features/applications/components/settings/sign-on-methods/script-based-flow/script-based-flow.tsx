/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { UIConstants } from "@wso2is/core/constants";
import { AlertLevels, StorageIdentityAppsSettingsInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { StringUtils } from "@wso2is/core/utils";
import {
    Button,
    Code,
    CodeEditor,
    ConfirmationModal,
    DocumentationLink,
    GenericIcon,
    Heading,
    SegmentedAccordion,
    Text,
    Tooltip,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import * as codemirror from "codemirror";
import beautify from "js-beautify";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import set from "lodash-es/set";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useDispatch } from "react-redux";
import { Checkbox, Dropdown, Header, Icon, Input, Menu, Popup, Sidebar } from "semantic-ui-react";
import { stripSlashes } from "slashes";
import { ScriptTemplatesSidePanel } from "./script-templates-side-panel";
import { AppUtils, EventPublisher, getOperationIcons } from "../../../../../core";
import { deleteSecret, getSecretList } from "../../../../../secrets/api/secret";
import AddSecretWizard from "../../../../../secrets/components/add-secret-wizard";
import { ADAPTIVE_SCRIPT_SECRETS } from "../../../../../secrets/constants/secrets.common";
import { GetSecretListResponse, SecretModel } from "../../../../../secrets/models/secret";
import { getAdaptiveAuthTemplates } from "../../../../api";
import { ApplicationManagementConstants } from "../../../../constants";
import {
    AdaptiveAuthTemplateInterface,
    AdaptiveAuthTemplatesListInterface,
    AuthenticationSequenceInterface
} from "../../../../models";
import { AdaptiveScriptUtils } from "../../../../utils";

/**
 * Proptypes for the adaptive scripts component.
 */
interface AdaptiveScriptsPropsInterface extends TestableComponentInterface {
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * Conditional auth content toggle state and its
     * mutation function.
     */
    showConditionalAuthContent: boolean;
    updateShowConditionalAuthContent: (next: boolean) => void;
    
    /**
     * The number of authentication steps.
     */
    authenticationSteps: number;
    /**
     * Specifies if the script is default or not.
     */
    isDefaultScript: boolean;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Toggle the accordion.
     */
    isMinimized?: boolean;
    /**
     * Delegates the event to the parent component. Once
     * called the resetting event will be notified to it
     * as well.
     */
    onAdaptiveScriptReset: () => void;
    /**
     * Callback when the script changes.
     * @param {string | string[]} script - Authentication script.
     */
    onScriptChange: (script: string | string[]) => void;
    /**
     * Fired when a template is selected.
     * @param {AdaptiveAuthTemplateInterface} template - Adaptive authentication template.
     */
    onTemplateSelect: (template: AdaptiveAuthTemplateInterface) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;

}

/**
 * Configure the authentication flow using an adaptive script.
 *
 * @param {AdaptiveScriptsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const ScriptBasedFlow: FunctionComponent<AdaptiveScriptsPropsInterface> = (
    props: AdaptiveScriptsPropsInterface
): ReactElement => {

    const {
        authenticationSequence,
        onTemplateSelect,
        onScriptChange,
        readOnly,
        authenticationSteps,
        isDefaultScript,
        showConditionalAuthContent,
        updateShowConditionalAuthContent,
        onAdaptiveScriptReset,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch = useDispatch();

    const authTemplatesSidePanelRef = useRef(null);
    const scriptEditorSectionRef = useRef(null);

    const [ scriptTemplates, setScriptTemplates ] = useState<AdaptiveAuthTemplatesListInterface>(undefined);
    const [
        selectedAdaptiveAuthTemplate,
        setSelectedAdaptiveAuthTemplate
    ] = useState<AdaptiveAuthTemplateInterface>(undefined);
    const [ showAuthTemplatesSidePanel, setAuthTemplatesSidePanelVisibility ] = useState<boolean>(true);
    const [ sourceCode, setSourceCode ] = useState<string | string[]>(undefined);
    const [ isEditorDarkMode, setIsEditorDarkMode ] = useState<boolean>(true);
    const [ internalScript, setInternalScript ] = useState<string | string[]>(undefined);
    const [ internalStepCount, setInternalStepCount ] = useState<number>(undefined);
    const [ isScriptFromTemplate, setIsScriptFromTemplate ] = useState<boolean>(false);
    const [ isNewlyAddedScriptTemplate, setIsNewlyAddedScriptTemplate ] = useState<boolean>(false);
    const [ showScriptResetWarning, setShowScriptResetWarning ] = useState<boolean>(false);
    const [ showScriptTemplateChangeWarning, setShowScriptTemplateChangeWarning ] = useState<boolean>(false);
    const [ isEditorFullScreen, setIsEditorFullScreen ] = useState<boolean>(false);
    const [ showAddSecretModal, setShowAddSecretModal ] = useState<boolean>(false);
    const [ editorInstance, setEditorInstance ] = useState<codemirror.Editor>(undefined);
    const [ isSecretsDropdownOpen, setIsSecretsDropdownOpen ] = useState<boolean>(false);

    /**
     * List of secrets for the selected {@code secretType}. It can hold secrets of
     * either a custom one or the static type "ADAPTIVE_AUTH_CALL_CHOREO"
     */
    const [ secretList, setSecretList ] = useState<SecretModel[]>([]);
    /**
     * List of secrets for facilitating secret list search function.
     */
    const [ filteredSecretList, setFilteredSecretList ] = useState<SecretModel[]>([]);
    const [ isSecretListLoading, setIsSecretListLoading ] = useState<boolean>(true);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingSecret, setDeletingSecret ] = useState<SecretModel>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Calls method to load secrets to secret list.
     */
    useEffect(() => {
        loadSecretListForSecretType();
    }, []);

    /**
     * Loads secret list for adaptive auth secrets.
     */
    const loadSecretListForSecretType = (): void => {

        setIsSecretListLoading(true);

        getSecretList({
            params: { secretType: ADAPTIVE_SCRIPT_SECRETS }
        }).then((axiosResponse: AxiosResponse<GetSecretListResponse>) => {
            setSecretList(axiosResponse.data);
            setFilteredSecretList(axiosResponse.data);
        }).catch((error) => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data?.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data?.message
                }));

                return;
            }
            dispatch(addAlert({
                description: t("console:develop.features.secrets.errors.generic.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.secrets.errors.generic.message")
            }));
        }).finally(() => {
            setIsSecretListLoading(false);
        });

    };

    /**
     * Calls method to load secrets to refresh secret list.
     */
    const refreshSecretList = () => {
        loadSecretListForSecretType();
    };

    /**
     * Add secret name to adaptive script.
     *
     * @param secret
     */
    const addSecretToScript = (secret:SecretModel): void => {
        const doc = editorInstance.getDoc();
        const secretNameString = `"${ secret.secretName }"`;

        //If a code segment is selected, the selected text is replaced with secret name as a string.
        if (doc.somethingSelected()) {
            doc.replaceSelection(secretNameString);
        } else {
            //If no selected text, secret name injected at the location of the cursor.
            const cursor = doc.getCursor();

            doc.replaceRange(secretNameString, cursor);
        }
    };

    /**
     * Handle secret delete operation.
     * @param secret
     */
    const handleSecretDelete = (secret:SecretModel) :void => {
        setDeletingSecret(secret);
        setShowDeleteConfirmationModal(true);
    };

    /**
     * This will be called when secret add wizard closed.
     * It will tell us to refresh the secret list or not.
     */
    const whenAddNewSecretModalClosed = (): void => {
        setShowAddSecretModal(false);
        refreshSecretList();
    };

    /**
     * This will be called when secret delete confirmation is closed.
     * It will tell us to refresh the secret list or not.
     * @param deletingSecret {SecretModel}
     * @param shouldRefresh {boolean}
     */
    const whenSecretDeleted = (deletingSecret:SecretModel, shouldRefresh: boolean): void => {
        if (shouldRefresh) {
            refreshSecretList();
        }
    };

    /**
     * Display Add Secret Modal.
     *
     * @return {React.ReactElement}
     */
    const renderAddSecretModal = (): ReactElement => {
        return(
            <AddSecretWizard
                onClose={ whenAddNewSecretModalClosed }
            />
        );
    };

    useEffect(() => {
        getAdaptiveAuthTemplates()
            .then((response) => {
                setScriptTemplates(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: UIConstants.API_RETRIEVAL_ERROR_ALERT_MESSAGE
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: ApplicationManagementConstants.ADAPTIVE_AUTH_TEMPLATES_FETCH_ERROR,
                    level: AlertLevels.ERROR,
                    message: UIConstants.API_RETRIEVAL_ERROR_ALERT_MESSAGE
                }));
            });
    }, []);

    const setScriptEditorWidth = () => {
        let width = "100%";

        if (showAuthTemplatesSidePanel) {
            width = `calc(100% - ${ authTemplatesSidePanelRef?.current?.ref?.current?.offsetWidth }px)`;
        }

        scriptEditorSectionRef.current.style.width = width;
    };

    /**
     * Triggered on `showAuthenticatorsSidePanel` change.
     */
    useEffect(() => {
        setScriptEditorWidth();
    }, [ showAuthTemplatesSidePanel ]);

    /**
     * Triggered after component mounted change.
     */
    useEffect(() => {
        setScriptEditorWidth();
    });

    /**
     * Checks for a script in auth sequence to handle content visibility.
     */
    useEffect(() => {

        // If the user has read only access, show the script editor.
        if (readOnly) {
            updateShowConditionalAuthContent(true);

            return;
        }

        // If there is a script and if the script is not a default script,
        // assume the user has modified the script and show the editor.
        if (!showConditionalAuthContent && authenticationSequence?.script
            && !AdaptiveScriptUtils.isDefaultScript(authenticationSequence.script,
                authenticationSequence?.steps?.length)) {

            updateShowConditionalAuthContent(true);

            return;
        }

        updateShowConditionalAuthContent(false);
    }, [ authenticationSequence ]);

    /**
     * Triggered on steps and script change.
     */
    useEffect(() => {
        resolveAdaptiveScript(authenticationSequence?.script);
    }, [ authenticationSequence?.steps, authenticationSequence?.script, authenticationSteps ]);

    /**
     * Resolves the adaptive script.
     *
     * @param {string} script - Script passed through props.
     * @return {string | string[]} Moderated script.
     */
    const resolveAdaptiveScript = (script: string): string | string[] => {
        // Check if there is no script defined and the step count is o.
        // If so, return the default script.
        if (showConditionalAuthContent && !script && authenticationSequence?.steps?.length === 0) {
            setSourceCode(AdaptiveScriptUtils.getDefaultScript());
            setIsScriptFromTemplate(false);

            return;
        }

        if (!script && authenticationSequence?.steps?.length > 0) {
            setSourceCode(AdaptiveScriptUtils.generateScript(authenticationSteps + 1));
            setIsScriptFromTemplate(false);

            return;
        }

        // Scripts from templates comes in the form of `"["script"]"`. `isValidJSONString` checks for that.
        if (StringUtils.isValidJSONString(script)) {

            // Checks if the script in the editor is from a template and if the editor content and the sent script
            // is different. If so, some edits have been made and we shouldn't touch the editor content.
            if (isScriptFromTemplate
                && !isNewlyAddedScriptTemplate
                && (AdaptiveScriptUtils.minifyScript(internalScript)
                    !== AdaptiveScriptUtils.minifyScript(JSON.parse(script)))) {

                return;
            }

            setIsScriptFromTemplate(true);
            setSourceCode(JSON.parse(script));
            setIsNewlyAddedScriptTemplate(false);

            return;
        }

        // If a script is defined, checks whether if it is a default. If so, generates the basic default script
        // based on the number of steps.
        if (script
            && AdaptiveScriptUtils.isDefaultScript(internalScript ?? script,
                internalStepCount ?? authenticationSteps)) {

            setInternalStepCount(authenticationSteps);
            setSourceCode(AdaptiveScriptUtils.generateScript(authenticationSteps + 1));
            setIsScriptFromTemplate(false);

            return;
        }

        // If a script is defined, checks whether if it is not a default.
        if (script
            && !AdaptiveScriptUtils.isDefaultScript(internalScript ?? script,
                internalStepCount ?? authenticationSteps)) {

            setInternalStepCount(authenticationSteps);

            // Checks if the editor content is different to the externally provided script.
            if (AdaptiveScriptUtils.minifyScript(internalScript) !== AdaptiveScriptUtils.minifyScript(script)) {
                setSourceCode(internalScript ?? script);

                return;
            }

            setSourceCode(beautify.js(stripSlashes(script)));
            setIsScriptFromTemplate(false);

            return;
        }

        if (isDefaultScript) {
            resetAdaptiveScriptTemplateToDefaultHandler();

            return;
        }

        setSourceCode(script);
        setIsScriptFromTemplate(false);
    };

    const resetAdaptiveScriptTemplateToDefaultHandler = () => {
        setSourceCode(AdaptiveScriptUtils.generateScript(authenticationSteps + 1));
        setIsScriptFromTemplate(false);
        onAdaptiveScriptReset();
        updateShowConditionalAuthContent(false);
    };

    /**
     * Handles the template sidebar toggle.
     */
    const handleScriptTemplateSidebarToggle = () => {
        setAuthTemplatesSidePanelVisibility(!showAuthTemplatesSidePanel);
    };

    /**
     * Handles template selection click event.
     *
     * @param {AdaptiveAuthTemplateInterface} template - Adaptive authentication template.
     */
    const handleTemplateSelection = (template: AdaptiveAuthTemplateInterface) => {
        eventPublisher.publish("application-sign-in-method-conditional-authentication-template", {
            type: kebabCase(template["name"])
        });
        setIsNewlyAddedScriptTemplate(true);
        onTemplateSelect(template);
    };

    /**
     * Toggles editor dark mode.
     */
    const handleEditorDarkModeToggle = () => {
        setIsEditorDarkMode(!isEditorDarkMode);
    };

    /**
     * Handles conditional authentication on/off swicth.
     */
    const handleConditionalAuthToggleChange = (): void => {
        
        if (showConditionalAuthContent) {
            setShowScriptResetWarning(true);

            return;
        }

        eventPublisher.publish("application-sign-in-method-enable-conditional-authentication");
        updateShowConditionalAuthContent(true);
    };

    /**
     * TLDR; This function should be called when switching between
     *       full-screen mode to track the source changes.
     *
     * Why implement this in the first place? When switching from full screen to
     * normal view it loses all user entered source code vice versa.
     *
     * That happens because, we pass {@code sourceCode={ sourceCode }} to
     * {@link CodeEditor}. We cannot alter it's depending state since it's
     * used in conditional script generators. We have checked the feasibility
     * of adding {@link useCallback} and mix it with a debounce handler to
     * track changes within onChange event. But the problem is it causes the
     * component to re-render multiple times and causes unforeseen side effects.
     *
     * In this function we read {@code internalScript} and {@code sourceCode}
     * and checks whether their state has been changed. If yes then simply
     * set the new {@code sourceCode} to what user entered. And place the cursor
     * back to where it was originally.
     */
    const preserveStateOnFullScreenChange = (): void => {

        const _modifiedScript = AdaptiveScriptUtils.sourceToString(internalScript);
        const _editorSourceCode = AdaptiveScriptUtils.sourceToString(sourceCode);

        if (_modifiedScript !== _editorSourceCode) {
            const cur = editorInstance.doc.getCursor();

            setSourceCode(_modifiedScript.split(ApplicationManagementConstants.LINE_BREAK));
            editorInstance.doc.setCursor(cur);
        }

    };

    /**
     * Steps for the conditional authentication toggle tour.
     *
     * @type {Array<Step>}
     */
    const conditionalAuthTourSteps: Array<Step> = [
        {
            content: (
                <div className="tour-step">
                    <Heading bold as="h6">
                        {
                            t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.0.heading")
                        }
                    </Heading>
                    <Text>
                        {
                            t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.0.content.0")
                        }
                    </Text>
                    <Text>
                        <Trans
                            i18nKey={
                                "console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.0.content.1"
                            }
                        >
                            Click on the <Code>Next</Code> button to learn about the process.
                        </Trans>
                    </Text>
                </div>
            ),
            disableBeacon: true,
            placement: "top",
            target: "[data-tourid=\"conditional-auth\"]"
        },
        {
            content: (
                <div className="tour-step">
                    <Heading bold as="h6">
                        {
                            t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.1.heading")
                        }
                    </Heading>
                    <Text>
                        {
                            t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.1.content.0")
                        }
                    </Text>
                </div>
            ),
            disableBeacon: true,
            placement: "right",
            target: "[data-tourid=\"add-authentication-options-button\"]"
        },
        {
            content: (
                <div className="tour-step">
                    <Heading bold as="h6">
                        {
                            t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.2.heading")
                        }
                    </Heading>
                    <Text>
                        <Trans
                            i18nKey={
                                "console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.2.content.0"
                            }
                        >
                            Click here if you need to add more steps to the flow.
                            Once you add a new step,<Code>executeStep(STEP_NUMBER);</Code> will appear on 
                            the script editor.
                        </Trans>
                    </Text>
                </div>
            ),
            disableBeacon: true,
            placement: "right",
            target: "[data-tourid=\"add-new-step-button\"]"
        }
    ];

    /**
     * Should the conditional auth tour open.
     *
     * @return {boolean}
     */
    const shouldConditionalAuthTourOpen = (): boolean => {

        if (!showConditionalAuthContent) {
            return false;
        }

        return getConditionalAuthTourViewedStatus() === false;
    };

    /**
     * Renders the Conditional Auth tour.
     *
     * @return {React.ReactElement}
     */
    const renderConditionalAuthTour = (): ReactElement => (
        <Joyride
            continuous
            disableOverlay
            showSkipButton
            callback={ (data: CallBackProps) => {
                // If the tour is `done` or `skipped`, set the viewed state in storage.
                if ((data.status === STATUS.FINISHED) || (data.status === STATUS.SKIPPED)) {
                    persistConditionalAuthTourViewedStatus();
                }
            } }
            run={ shouldConditionalAuthTourOpen() }
            steps={ conditionalAuthTourSteps }
            styles={ {
                buttonClose: {
                    display: "none"
                },
                tooltipContent: {
                    paddingBottom: 1
                }
            } }
            locale={ {
                back: t("common:back"),
                close: t("common:close"),
                last: t("common:done"),
                next: t("common:next"),
                skip: t("common:skip")
            } }
        />
    );

    /**
     * This will be only called when user gives their consent for deletion.
     * @see {@code SecretDeleteConfirmationModal}
     */
    const onSecretDeleteClick = async (): Promise<void> => {
        if (deletingSecret) {
            try {
                await deleteSecret({
                    params: {
                        secretName: deletingSecret.secretName,
                        secretType: deletingSecret.type
                    }
                });
                dispatch(addAlert({
                    description: t("console:develop.features.secrets.alerts.deleteSecret.description", {
                        secretName: deletingSecret.secretName,
                        secretType: deletingSecret.type
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.secrets.alerts.deleteSecret.message")
                }));
            } catch (error) {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: error.response.data.message
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("console:develop.features.secrets.errors.generic.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.secrets.errors.generic.message")
                }));
            } finally {
                const refreshSecretList = true;

                whenSecretDeleted(deletingSecret, refreshSecretList);
                setShowDeleteConfirmationModal(false);
                setDeletingSecret(undefined);
            }
        }
    };

    /**
     * Render the secret list dropdown.
     */
    const renderSecretListDropdown = (): ReactElement => {
        return(
            <Dropdown
                defaultOpen={ !isSecretListLoading }
                labeled
                button
                upward={ false }
                options={ filteredSecretList }
                onOpen={ () => setIsSecretsDropdownOpen(true) }
                onClose={ () => setIsSecretsDropdownOpen(false) }
                icon ={ (
                    <Popup
                        disabled={ isSecretsDropdownOpen }
                        trigger={ (
                            <div>
                                <GenericIcon
                                    hoverable
                                    transparent
                                    defaultIcon
                                    size="micro"
                                    hoverType="rounded"
                                    icon={ getOperationIcons().keyIcon }
                                    data-testid={
                                        `${ testId }-code-editor-secret-selection`
                                    }
                                />
                            </div>
                        ) }
                        content={ (
                            <Trans
                                i18nKey={
                                    "console:develop.features.applications.edit." +
                                    "sections.signOnMethod.sections.authenticationFlow." +
                                    "sections.scriptBased.secretsList.tooltips.keyIcon"
                                }
                            >
                                Securely store access keys as secrets. A secret can
                                replace the API key in <Code>callChoreo()</Code> function
                                in the conditional authentication scripts.
                            </Trans>
                        ) }
                        position="bottom left"
                        pinned={ true }
                    />
                ) }
            >
                <Dropdown.Menu>
                    {
                        secretList.length > 0 && (
                            <Input
                                data-testid={ `${testId}-secret-search` }
                                icon="search"
                                iconPosition="left"
                                className="search"
                                placeholder={ t("console:develop.features.applications.edit.sections.signOnMethod" +
                                    ".sections.authenticationFlow.sections.scriptBased.secretsList.search") }
                                onChange={ (data: ChangeEvent<HTMLInputElement>
                                ) => {
                                    if (!data.currentTarget?.value) {
                                        setFilteredSecretList(secretList);
                                    } else {
                                        setFilteredSecretList(secretList.filter((secret: SecretModel) => secret.
                                            secretName.toLowerCase().includes(data.currentTarget.value.toLowerCase())));
                                    }
                                } }
                                onClick={ e => e.stopPropagation() }
                            />
                        )
                    }
                    <Dropdown.Menu
                        data-testid={ `${ testId }-secret-list` }
                        scrolling
                        className={ "custom-dropdown" }
                    >
                        {
                            filteredSecretList.length>0 ? (
                                filteredSecretList.map((
                                    secret: SecretModel
                                ) => (
                                    <Dropdown.Item
                                        key={ secret.secretId }
                                    >
                                        <Header
                                            as={ "h6" }
                                            className={ "header-with-icon" }
                                            style={ { margin: "0.25rem auto" } }
                                        >
                                            <GenericIcon
                                                defaultIcon
                                                link={ true }
                                                linkType="primary"
                                                transparent
                                                floated="right"
                                                size="micro"
                                                style={ { paddingTop: 0 } }
                                                icon={ (
                                                    <Tooltip
                                                        trigger={ (
                                                            <Icon name="trash alternate"/>
                                                        ) }
                                                        content={ t("common:delete") }
                                                        size="mini"
                                                    />
                                                ) }
                                                onClick={ () => {
                                                    handleSecretDelete(secret);
                                                } }
                                                data-testid={ `${ testId }-secret-delete` }
                                            />
                                            <GenericIcon
                                                defaultIcon
                                                transparent
                                                link={ true }
                                                linkType="primary"
                                                floated="right"
                                                size="micro"
                                                style={ { paddingTop: 0 } }
                                                icon={ (
                                                    <Tooltip
                                                        trigger={ (
                                                            <Icon name="plus"/>
                                                        ) }
                                                        content={ t("console:develop.features.applications.edit." +
                                                            "sections.signOnMethod.sections.authenticationFlow." +
                                                            "sections.scriptBased.secretsList.tooltips.plusIcon") }
                                                        size="mini"
                                                    />
                                                ) }
                                                onClick={ () => {
                                                    addSecretToScript(secret);
                                                } }
                                                data-testid={ `${ testId }-secret-add` }
                                            />
                                            <Header.Content>
                                                { secret.secretName }
                                            </Header.Content>
                                            <Header.Subheader
                                                className="truncate ellipsis"
                                            >
                                                { secret.description }
                                            </Header.Subheader>
                                        </Header>
                                    </Dropdown.Item>
                                ))
                            ) : (
                                <Dropdown.Item
                                    data-testid={ `${ testId }-empty-placeholder` }
                                    key={ "secretEmptyPlaceholder" }
                                    text={ t("console:develop.features.applications.edit.sections.signOnMethod" +
                                        ".sections.authenticationFlow.sections.scriptBased.secretsList." +
                                        "emptyPlaceholder") }
                                    disabled
                                />
                            )
                        }
                    </Dropdown.Menu>
                    <Dropdown.Menu
                        className={ "create-button-item" }
                        scrolling
                    >
                        <Dropdown.Item
                            key={ "createSecret" }
                            text={ t("console:develop.features.applications.edit.sections.signOnMethod" +
                                ".sections.authenticationFlow.sections.scriptBased.secretsList.create") }
                            onClick={ () => {
                                setShowAddSecretModal(true);
                            } }
                        />
                    </Dropdown.Menu>
                </Dropdown.Menu>
            </Dropdown>
        );

    };

    /**
     * Persist the Conditional Auth Tour seen status in Local Storage.
     *
     * @param {boolean} status - Status to set.
     */
    const persistConditionalAuthTourViewedStatus = (status: boolean = true): void => {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences)) {
            return;
        }

        const newPref: StorageIdentityAppsSettingsInterface = cloneDeep(userPreferences);

        set(newPref?.identityAppsSettings?.devPortal,
            ApplicationManagementConstants.CONDITIONAL_AUTH_TOUR_STATUS_STORAGE_KEY, status);

        AppUtils.setUserPreferences(newPref);
    };

    /**
     * Check if the Conditional Auth Tour has already been seen by the user.
     *
     * @return {boolean}
     */
    const getConditionalAuthTourViewedStatus = (): boolean => {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences)) {
            return false;
        }

        return get(userPreferences?.identityAppsSettings?.devPortal,
            ApplicationManagementConstants.CONDITIONAL_AUTH_TOUR_STATUS_STORAGE_KEY, false);
    };

    /**
     * Renders API Documentation link.
     *
     * @return {React.ReactElement}
     */
    const resolveApiDocumentationLink = (): ReactElement => {
        const apiDocLink: string = getLink("develop.applications.editApplication.common." +
            "signInMethod.conditionalAuthenticaion.apiReference");

        if (apiDocLink === undefined) {
            return null;
        }

        return (
            <Menu.Item
                className="action p-3"
                href={ apiDocLink }
                target="_blank"
            >
                <Tooltip
                    compact
                    trigger={ (
                        <Button labelPosition="left">
                            <GenericIcon
                                className="p-1 mr-1"
                                transparent
                                defaultIcon
                                size="micro"
                                icon={ getOperationIcons().openBookIcon }
                                data-testid={
                                    `${ testId }-code-editor-open-documentation`
                                }
                            />
                            <p>
                                { t("console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.authenticationFlow.sections" +
                                            ".scriptBased.editor.apiDocumentation") }
                            </p>
                        </Button>
                    ) }
                    content={ t("console:develop.features.applications.edit.sections" +
                            ".signOnMethod.sections.authenticationFlow.sections" +
                            ".scriptBased.editor.goToApiDocumentation") }
                    size="mini"
                />
            </Menu.Item>
        );
    };

    /**
     * Renders a confirmation modal when the Adaptive auth template is being reset back to default.
     * @return {ReactElement}
     */
    const renderAdaptiveScriptResetWarning = (): ReactElement => {

        return (
            <ConfirmationModal
                onClose={ (): void => setShowScriptResetWarning(false) }
                type="warning"
                open={ showScriptResetWarning }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => setShowScriptResetWarning(false) }
                onPrimaryActionClick={ (): void => {
                    setShowScriptResetWarning(false);
                    resetAdaptiveScriptTemplateToDefaultHandler();
                } }
                data-testid={ `${ testId }-delete-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header data-testid={ `${ testId }-reset-confirmation-modal-header` }>
                    { t("console:develop.features.applications.edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.heading") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-testid={ `${ testId }-reset-confirmation-modal-message` }
                >
                    { t("console:develop.features.applications.edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-testid={ `${ testId }-reset-confirmation-modal-content` }>
                    <Trans
                        i18nKey={
                            "console:develop.features.applications.edit.sections.signOnMethod.sections" +
                            ".authenticationFlow.sections.scriptBased.editor.resetConfirmation.content"
                        }
                    >
                        This action will reset the adaptive authentication script back to default.
                        Click <Code>Confirm</Code> to proceed.
                    </Trans>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Renders a confirmation modal when the Adaptive auth template is being changed.
     * @return {ReactElement}
     */
    const renderAdaptiveAuthTemplateChangeWarning = (): ReactElement => {

        return (
            <ConfirmationModal
                onClose={ (): void => setShowScriptTemplateChangeWarning(false) }
                type="warning"
                open={ showScriptTemplateChangeWarning }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => {
                    setShowScriptTemplateChangeWarning(false);
                    setSelectedAdaptiveAuthTemplate(undefined);
                } }
                onPrimaryActionClick={ (): void => {
                    setShowScriptTemplateChangeWarning(false);
                    handleTemplateSelection(selectedAdaptiveAuthTemplate);
                    setSelectedAdaptiveAuthTemplate(undefined);
                } }
                data-testid={ `${ testId }-adaptive-script-template-change-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header data-testid={ `${ testId }-reset-confirmation-modal-header` }>
                    { t("console:develop.features.applications.edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.heading") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-testid={ `${ testId }-reset-confirmation-modal-message` }
                >
                    { t("console:develop.features.applications.edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-testid={ `${ testId }-reset-confirmation-modal-content` }>
                    <Trans
                        i18nKey={
                            "console:develop.features.applications.edit.sections.signOnMethod.sections" +
                            ".authenticationFlow.sections.scriptBased.editor.changeConfirmation.content"
                        }
                    >
                        The selected template will replace the existing script in the editor and the step
                        configuration. Your current progress will be lost. Click <Code>Confirm</Code> to proceed.
                    </Trans>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    const SecretDeleteConfirmationModal: ReactElement = (
        <ConfirmationModal
            onClose={ (): void => {
                setShowDeleteConfirmationModal(false);
                setDeletingSecret(undefined);
            } }
            onSecondaryActionClick={ (): void => {
                setShowDeleteConfirmationModal(false);
                setDeletingSecret(undefined);
            } }
            onPrimaryActionClick={ onSecretDeleteClick }
            open={ showDeleteConfirmationModal }
            type="warning"
            assertionHint={ t("console:develop.features.secrets.modals.deleteSecret.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("console:develop.features.secrets.modals.deleteSecret.primaryActionButtonText") }
            secondaryAction={ t("console:develop.features.secrets.modals.deleteSecret.secondaryActionButtonText") }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }>
            <ConfirmationModal.Header data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                { t("console:develop.features.secrets.modals.deleteSecret.title") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-delete-confirmation-modal-message` }>
                { t("console:develop.features.secrets.modals.deleteSecret.warningMessage") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-testid={ `${ testId }-delete-confirmation-modal-content` }>
                { t("console:develop.features.secrets.modals.deleteSecret.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    return (
        <>
            <div className="conditional-auth-section">
                <SegmentedAccordion
                    fluid
                    data-testid={ `${ testId }-accordion` }
                    className="conditional-auth-accordion"
                >
                    <SegmentedAccordion.Title
                        data-testid={ `${ testId }-accordion-title` }
                        active={ showConditionalAuthContent }
                        content={ (
                            <>
                                <div className="conditional-auth-accordion-title">
                                    {
                                        !readOnly && (
                                            <Checkbox
                                                toggle
                                                data-tourid="conditional-auth"
                                                onChange={ handleConditionalAuthToggleChange }
                                                checked={ showConditionalAuthContent }
                                                className="conditional-auth-accordion-toggle"
                                            />
                                        )
                                    }
                                    <div className="conditional-auth-accordion-title-text">
                                        <Heading as="h5" compact>
                                            {
                                                t("console:develop.features.applications.edit.sections.signOnMethod." +
                                                    "sections.authenticationFlow.sections.scriptBased.accordion." +
                                                    "title.heading")
                                            }
                                        </Heading>
                                        <Text muted compact>
                                            {
                                                t("console:develop.features.applications.edit.sections.signOnMethod." +
                                                    "sections.authenticationFlow.sections.scriptBased.accordion." +
                                                    "title.description")
                                            }
                                            <DocumentationLink
                                                link={ getLink("develop.applications.editApplication.common." +
                                                    "signInMethod.conditionalAuthenticaion.learnMore") }
                                            >
                                                { t("common:learnMore") }
                                            </DocumentationLink>
                                        </Text>
                                    </div>
                                </div>
                                { renderConditionalAuthTour() }
                            </>
                        ) }
                        hideChevron={ true }
                    />
                    <SegmentedAccordion.Content
                        active={ showConditionalAuthContent }
                        className="conditional-auth-accordion-content"
                        data-testid={ `${ testId }-accordion-content` }
                    >
                        <Sidebar.Pushable className="script-editor-with-template-panel no-border">
                            { !readOnly && (
                                <ScriptTemplatesSidePanel
                                    title={
                                        t("console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections" +
                                            ".authenticationFlow.sections.scriptBased.editor.templates.heading")
                                    }
                                    ref={ authTemplatesSidePanelRef }
                                    onTemplateSelect={ (template: AdaptiveAuthTemplateInterface) => {
                                        setSelectedAdaptiveAuthTemplate(template);
                                        setShowScriptTemplateChangeWarning(true);
                                    } }
                                    templates={
                                        scriptTemplates?.templatesJSON &&
                                        Object.values(scriptTemplates.templatesJSON)
                                    }
                                    visible={ showAuthTemplatesSidePanel }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-script-templates-side-panel` }
                                />
                            ) }
                            <Sidebar.Pusher>
                                <div className="script-editor-container" ref={ scriptEditorSectionRef }>
                                    <Menu attached="top" className="action-panel" secondary>
                                        <Menu.Menu position="right">
                                            { resolveApiDocumentationLink() }
                                            <Menu.Item 
                                                className={ `action ${isSecretsDropdownOpen ? "selected-secret" : "" }` }>
                                                <div>
                                                    { renderSecretListDropdown() }
                                                </div>
                                            </Menu.Item>
                                            <Menu.Item className="action">
                                                <Tooltip
                                                    compact
                                                    trigger={ (
                                                        <div>
                                                            <GenericIcon
                                                                hoverable
                                                                transparent
                                                                defaultIcon
                                                                size="micro"
                                                                hoverType="rounded"
                                                                icon={ getOperationIcons().maximize }
                                                                onClick={ () => {
                                                                    setIsEditorFullScreen(!isEditorFullScreen);
                                                                } }
                                                                data-testid={
                                                                    `${ testId }-code-editor-fullscreen-toggle`
                                                                }
                                                            />
                                                        </div>
                                                    ) }
                                                    content={ () => {
                                                        // Need to delay the `Exit Full Screen` text a bit.
                                                        let content: string = t("common:goFullScreen");

                                                        if (isEditorFullScreen) {
                                                            setTimeout(() => {
                                                                content = t("common:exitFullScreen");
                                                            }, 500);
                                                        }

                                                        return content;
                                                    } }
                                                    size="mini"
                                                />
                                            </Menu.Item>
                                            <Menu.Item className="action">
                                                <Tooltip
                                                    compact
                                                    trigger={ (
                                                        <div>
                                                            <GenericIcon
                                                                hoverable
                                                                defaultIcon
                                                                transparent
                                                                size="micro"
                                                                hoverType="rounded"
                                                                icon={
                                                                    isEditorDarkMode
                                                                        ? getOperationIcons().lightMode
                                                                        : getOperationIcons().darkMode
                                                                }
                                                                onClick={ handleEditorDarkModeToggle }
                                                                data-testid={ `${ testId }-code-editor-mode-toggle` }
                                                            />
                                                        </div>
                                                    ) }
                                                    content={
                                                        isEditorDarkMode
                                                            ? t("common:lightMode")
                                                            : t("common:darkMode")
                                                    }
                                                    size="mini"
                                                />
                                            </Menu.Item>
                                            { !readOnly && (
                                                <Menu.Item
                                                    onClick={ handleScriptTemplateSidebarToggle }
                                                    className="action hamburger"
                                                    data-testid={ `${ testId }-script-template-sidebar-toggle` }
                                                >
                                                    <Icon name="bars"/>
                                                </Menu.Item>
                                            ) }
                                        </Menu.Menu>
                                    </Menu>

                                    <div className="code-editor-wrapper">
                                        <CodeEditor
                                            editorDidMount={ (editor) => {
                                                setEditorInstance(editor);
                                            } }
                                            lint
                                            allowFullScreen
                                            controlledFullScreenMode={ false }
                                            triggerFullScreen={ isEditorFullScreen }
                                            language="javascript"
                                            sourceCode={ sourceCode }
                                            options={ {
                                                lineWrapping: true
                                            } }
                                            onChange={ (editor, data, value) => {
                                                setInternalScript(value);
                                                onScriptChange(value);
                                            } }
                                            onFullScreenToggle={ (isFullScreen: boolean) => {
                                                setIsEditorFullScreen(isFullScreen);
                                                preserveStateOnFullScreenChange();
                                            } }
                                            theme={ isEditorDarkMode ? "dark" : "light" }
                                            readOnly={ readOnly }
                                            translations={ {
                                                copyCode: t("common:copyToClipboard"),
                                                exitFullScreen: t("common:exitFullScreen"),
                                                goFullScreen: t("common:goFullScreen")
                                            } }
                                            data-testid={ `${ testId }-code-editor` }
                                        />
                                    </div>
                                </div>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                    </SegmentedAccordion.Content>
                </SegmentedAccordion>
                { showAddSecretModal && renderAddSecretModal() }
                { showDeleteConfirmationModal && SecretDeleteConfirmationModal }
            </div>
            { showScriptResetWarning && renderAdaptiveScriptResetWarning() }
            { showScriptTemplateChangeWarning && renderAdaptiveAuthTemplateChangeWarning() }
        </>
    );
};

/**
 * Default props for the script based flow component.
 */
ScriptBasedFlow.defaultProps = {
    "data-testid": "script-based-flow",
    isMinimized: true
};
