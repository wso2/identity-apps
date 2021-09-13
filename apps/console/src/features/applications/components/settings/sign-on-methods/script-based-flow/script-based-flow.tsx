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
import beautify from "js-beautify";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import set from "lodash-es/set";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useDispatch } from "react-redux";
import { Checkbox, Icon, Menu, Sidebar } from "semantic-ui-react";
import { stripSlashes } from "slashes";
import { ScriptTemplatesSidePanel } from "./script-templates-side-panel";
import { getOperationIcons } from "../../../../../core/configs";
import { AppUtils, EventPublisher } from "../../../../../core/utils";
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
        isMinimized,
        onAdaptiveScriptReset,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch = useDispatch();

    const authTemplatesSidePanelRef = useRef(null);
    const scriptEditorSectionRef = useRef(null);

    const [ scriptTemplates, setScriptTemplates ] = useState<AdaptiveAuthTemplatesListInterface>(undefined);
    const [ showAuthTemplatesSidePanel, setAuthTemplatesSidePanelVisibility ] = useState<boolean>(true);
    const [ sourceCode, setSourceCode ] = useState<string | string[]>(undefined);
    const [ isEditorDarkMode, setIsEditorDarkMode ] = useState<boolean>(true);
    const [ internalScript, setInternalScript ] = useState<string | string[]>(undefined);
    const [ internalStepCount, setInternalStepCount ] = useState<number>(undefined);
    const [ isScriptFromTemplate, setIsScriptFromTemplate ] = useState<boolean>(false);
    const [ isNewlyAddedScriptTemplate, setIsNewlyAddedScriptTemplate ] = useState<boolean>(false);
    const [ showScriptResetWarning, setShowScriptResetWarning ] = useState<boolean>(false);
    const [ showConditionalAuthContent, setShowConditionalAuthContent ] = useState<boolean>(isMinimized);
    const [ isEditorFullScreen, setIsEditorFullScreen ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

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
            setShowConditionalAuthContent(true);
            return;
        }

        // If there is a script and if the script is not a default script,
        // assume the user has modified the script and show the editor.
        if (authenticationSequence?.script
            && !AdaptiveScriptUtils.isDefaultScript(authenticationSequence.script,
                authenticationSequence?.steps?.length)) {

            setShowConditionalAuthContent(true);
            return;
        }

        setShowConditionalAuthContent(false);
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
        if (!script && authenticationSequence?.steps?.length === 0) {
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
        setShowConditionalAuthContent(false);
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
            "type": kebabCase(template["name"])
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

        setShowConditionalAuthContent(true);
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
            <Menu.Menu position="left">
                <Menu.Item
                    className="action ml-2"
                    href={ apiDocLink }
                    target="_blank"
                >
                    <Tooltip
                        compact
                        trigger={ (
                            <Button>
                                { t("console:develop.features.applications.edit.sections" +
                                        ".signOnMethod.sections.authenticationFlow.sections" +
                                        ".scriptBased.editor.apiDocumentation") }
                                <Icon name="external alternate" className="ml-2" />
                            </Button>
                        ) }
                        content={ t("console:develop.features.applications.edit.sections" +
                            ".signOnMethod.sections.authenticationFlow.sections" +
                            ".scriptBased.editor.goToApiDocumentation") }
                        size="mini"
                    />
                </Menu.Item>
            </Menu.Menu>
        );
    };

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
                                    onTemplateSelect={ handleTemplateSelection }
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
                                        { resolveApiDocumentationLink() }
                                        <Menu.Menu position="right">
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
            </div>
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
                    data-testid={ `${ testId }-reset-confirmation-modal-message` }>
                    { t("console:develop.features.applications.edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-testid={ `${ testId }-reset-confirmation-modal-content` }>
                    { t("console:develop.features.applications.edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
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
