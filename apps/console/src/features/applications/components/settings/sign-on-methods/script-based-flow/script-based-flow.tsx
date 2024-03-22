/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { GearIcon } from "@oxygen-ui/react-icons";
import Chip from "@oxygen-ui/react/Chip";
import { FeatureStatus, FeatureTags, useCheckFeatureStatus, useCheckFeatureTags } from "@wso2is/access-control";
import { UIConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
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
    Link,
    Popup,
    SegmentedAccordion,
    Text,
    Tooltip,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import * as codemirror from "codemirror";
import beautify from "js-beautify";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import set from "lodash-es/set";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    RefObject,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, Dropdown, Header, Icon, Input, Menu, Sidebar } from "semantic-ui-react";
import { stripSlashes } from "slashes";
import { ScriptTemplatesSidePanel, ScriptTemplatesSidePanelRefInterface } from "./script-templates-side-panel";
import { ELK_RISK_BASED_TEMPLATE_NAME } from "../../../../../authentication-flow-builder/constants/template-constants";
import useAuthenticationFlow from "../../../../../authentication-flow-builder/hooks/use-authentication-flow";
import { AppState, AppUtils, EventPublisher, FeatureConfigInterface, getOperationIcons } from "../../../../../core";
import { OrganizationType } from "../../../../../organizations/constants";
import { OrganizationUtils } from "../../../../../organizations/utils";
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
import { AdaptiveScriptUtils } from "../../../../utils/adaptive-script-utils";

/**
 * Proptypes for the adaptive scripts component.
 */
interface AdaptiveScriptsPropsInterface extends IdentifiableComponentInterface {
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
     * Delegates the event to the parent component. Once
     * called the resetting event will be notified to it
     * as well.
     */
    onAdaptiveScriptReset: () => void;
    /**
     * Callback when the script changes.
     * @param script - Authentication script.
     */
    onScriptChange: (script: string | string[]) => void;
    /**
     * Fired when a template is selected.
     * @param template - Adaptive authentication template.
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
 * @param props - Props injected to the component.
 *
 * @returns
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
        onAdaptiveScriptReset,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch: Dispatch = useDispatch();

    const authTemplatesSidePanelRef: RefObject<ScriptTemplatesSidePanelRefInterface> = useRef(null);
    const scriptEditorSectionRef: RefObject<HTMLDivElement> = useRef(null);

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
    const adaptiveFeatureStatus : FeatureStatus = useCheckFeatureStatus("console.application.signIn.adaptiveAuth");
    const adaptiveFeatureTags: string[] = useCheckFeatureTags("console.application.signIn.adaptiveAuth");
    const [ isPremiumFeature, setIsPremiumFeature ] = useState<boolean>(false);
    const [ isELKConfigureClicked, setIsELKConfigureClicked ] = useState<boolean>(false);

    /**
     * List of secrets for the selected `secretType`. It can hold secrets of
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

    const { isConditionalAuthenticationEnabled, onConditionalAuthenticationToggle } = useAuthenticationFlow();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);

    /**
     * Calls method to load secrets to secret list.
     */
    useEffect(() => {
        hasRequiredScopes(featureConfig?.secretsManagement,
            featureConfig?.secretsManagement?.scopes?.read, allowedScopes) && loadSecretListForSecretType();
    }, []);

    /**
     * Loads secret list for adaptive auth secrets.
     */
    const loadSecretListForSecretType = (): void => {

        if (OrganizationUtils.getOrganizationType() === OrganizationType.SUPER_ORGANIZATION ||
            OrganizationUtils.getOrganizationType() === OrganizationType.FIRST_LEVEL_ORGANIZATION ||
            OrganizationUtils.getOrganizationType() === OrganizationType.TENANT) {
            setIsSecretListLoading(true);

            getSecretList({
                params: { secretType: ADAPTIVE_SCRIPT_SECRETS }
            }).then((axiosResponse: AxiosResponse<GetSecretListResponse>) => {
                setSecretList(axiosResponse.data);
                setFilteredSecretList(axiosResponse.data);
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data?.description,
                        level: AlertLevels.ERROR,
                        message: error.response.data?.message
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("secrets:errors.generic.description"),
                    level: AlertLevels.ERROR,
                    message: t("secrets:errors.generic.message")
                }));
            }).finally(() => {
                setIsSecretListLoading(false);
            });
        }

    };

    /**
     * Check if the feature is a premium.
     */
    useEffect(() => {
        if (adaptiveFeatureStatus === FeatureStatus.ENABLED
            && adaptiveFeatureTags?.includes(FeatureTags.PREMIUM)) {
            setIsPremiumFeature(true);
        }
    }, []);

    /**
     * Calls method to load secrets to refresh secret list.
     */
    const refreshSecretList = () => {
        loadSecretListForSecretType();
    };

    /**
     * Add secret name to adaptive script.
     *
     * @param secret - Secret
     */
    const addSecretToScript = (secret:SecretModel): void => {
        const doc: codemirror.Doc = editorInstance?.getDoc();
        const secretNameString: string = `"${ secret.secretName }"`;

        //If a code segment is selected, the selected text is replaced with secret name as a string.
        if (doc.somethingSelected()) {
            doc.replaceSelection(secretNameString);
        } else {
            //If no selected text, secret name injected at the location of the cursor.
            const cursor: codemirror.Pos  = doc.getCursor();

            doc.replaceRange(secretNameString, cursor);
        }
    };

    /**
     * Handle secret delete operation.
     * @param secret - Secret
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
     * @param deletingSecret - SecretModel
     * @param shouldRefresh - boolean
     */
    const whenSecretDeleted = (deletingSecret:SecretModel, shouldRefresh: boolean): void => {
        if (shouldRefresh) {
            refreshSecretList();
        }
    };

    /**
     * Display Add Secret Modal.
     *
     * @returns
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
            .then((response: AdaptiveAuthTemplatesListInterface) => {
                setScriptTemplates(response);
            })
            .catch((error: IdentityAppsApiException) => {
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
        let width: string = "100%";

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
            onConditionalAuthenticationToggle(true);

            return;
        }

        // If there is a script and if the script is not a default script,
        // assume the user has modified the script and show the editor.
        if (authenticationSequence?.script && !AdaptiveScriptUtils.isDefaultScript(
            authenticationSequence.script,
            authenticationSequence?.steps?.length
        )) {

            onConditionalAuthenticationToggle(true);

            return;
        }

        onConditionalAuthenticationToggle(false);
    }, [ authenticationSequence ]);

    /**
     * Triggered on steps and script change.
     */
    useEffect(() => {
        resolveAdaptiveScript(authenticationSequence?.script);
    }, [ authenticationSequence?.steps, authenticationSequence?.script, authenticationSteps ]);

    /**
     * Check whether the script is a user untouched default script.
     *
     * @param script - Script passed through props.
     *
     * @returns whether the script is a user untouched default script.
     */
    const isScriptUntouchedDefaultOne = (script: string): boolean => {
        let isDefault: boolean = false;
        const stepsCount: number = internalStepCount > authenticationSteps ? internalStepCount : authenticationSteps;

        for (let localStepsCount: number = stepsCount; localStepsCount > 0; localStepsCount--) {
            if (AdaptiveScriptUtils.isDefaultScript(script, localStepsCount)) {
                isDefault = true;

                break;
            }
        }

        return isDefault;
    };

    /**
     * Resolves the adaptive script.
     *
     * @param script - Script passed through props.
     *
     * @returns
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

        // If the script is untouched, then the script will be generated according to the current
        // authentication steps.
        if (script && isScriptUntouchedDefaultOne(script)
                && AdaptiveScriptUtils.minifyScript(internalScript) === AdaptiveScriptUtils.minifyScript(sourceCode)) {
            setInternalStepCount(authenticationSteps);
            setSourceCode(AdaptiveScriptUtils.generateScript(authenticationSteps + 1));
            setIsScriptFromTemplate(false);

            return;
        }

        // If a script is defined, checks whether if it is a default. If so, generates the basic default script
        // based on the number of steps.
        if (script
            && AdaptiveScriptUtils.isDefaultScript(internalScript ?? script,
                internalStepCount ?? authenticationSteps)
            && AdaptiveScriptUtils.minifyScript(internalScript) !== AdaptiveScriptUtils.minifyScript(sourceCode)) {

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
            if (AdaptiveScriptUtils.minifyScript(internalScript) !== AdaptiveScriptUtils.minifyScript(script)
                && AdaptiveScriptUtils.minifyScript(internalScript) !== AdaptiveScriptUtils.minifyScript(sourceCode)) {
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
        onConditionalAuthenticationToggle(false);
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
     * @param template - Adaptive authentication template.
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

        if (isConditionalAuthenticationEnabled) {
            setShowScriptResetWarning(true);

            return;
        }

        eventPublisher.publish("application-sign-in-method-enable-conditional-authentication");
        onConditionalAuthenticationToggle(true);
    };

    /**
     * TLDR; This function should be called when switching between
     *       full-screen mode to track the source changes.
     *
     * Why implement this in the first place? When switching from full screen to
     * normal view it loses all user entered source code vice versa.
     *
     * That happens because, we pass `sourceCode={ sourceCode }` to
     * {@link CodeEditor}. We cannot alter it's depending state since it's
     * used in conditional script generators. We have checked the feasibility
     * of adding {@link useCallback} and mix it with a debounce handler to
     * track changes within onChange event. But the problem is it causes the
     * component to re-render multiple times and causes unforeseen side effects.
     *
     * In this function we read `internalScript` and `sourceCode`
     * and checks whether their state has been changed. If yes then simply
     * set the new `sourceCode` to what user entered. And place the cursor
     * back to where it was originally.
     */
    const preserveStateOnFullScreenChange = (): void => {
        const _modifiedScript: string = AdaptiveScriptUtils.sourceToString(internalScript);
        const _editorSourceCode: string = AdaptiveScriptUtils.sourceToString(sourceCode);

        if (_modifiedScript !== _editorSourceCode) {
            const cur: codemirror.Pos = editorInstance?.doc.getCursor();

            setSourceCode(_modifiedScript.split(ApplicationManagementConstants.LINE_BREAK));
            editorInstance?.doc.setCursor(cur);
        }

    };

    /**
     * Steps for the conditional authentication toggle tour.
     *
     */
    const conditionalAuthTourSteps: Array<Step> = [
        {
            content: (
                <div className="tour-step">
                    <Heading bold as="h6">
                        {
                            t("applications:edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.0.heading")
                        }
                    </Heading>
                    <Text>
                        {
                            t("applications:edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.0.content.0")
                        }
                    </Text>
                    <Text>
                        <Trans
                            i18nKey={
                                "applications:edit.sections.signOnMethod.sections." +
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
                            t("applications:edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.1.heading")
                        }
                    </Heading>
                    <Text>
                        {
                            t("applications:edit.sections.signOnMethod.sections." +
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
                            t("applications:edit.sections.signOnMethod.sections." +
                                "authenticationFlow.sections.scriptBased.conditionalAuthTour.steps.2.heading")
                        }
                    </Heading>
                    <Text>
                        <Trans
                            i18nKey={
                                "applications:edit.sections.signOnMethod.sections." +
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
     * @returns
     */
    const shouldConditionalAuthTourOpen = (): boolean => {

        if (!isConditionalAuthenticationEnabled) {
            return false;
        }

        return getConditionalAuthTourViewedStatus() === false;
    };

    /**
     * Renders the Conditional Auth tour.
     *
     * @returns
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
     * @see `SecretDeleteConfirmationModal`
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
                    description: t("secrets:alerts.deleteSecret.description", {
                        secretName: deletingSecret.secretName,
                        secretType: deletingSecret.type
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("secrets:alerts.deleteSecret.message")
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
                    description: t("secrets:errors.generic.description"),
                    level: AlertLevels.ERROR,
                    message: t("secrets:errors.generic.message")
                }));
            } finally {
                const refreshSecretList: boolean = true;

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
                                    data-componentid={
                                        `${ componentId }-code-editor-secret-selection`
                                    }
                                />
                            </div>
                        ) }
                        content={ (
                            <Trans
                                i18nKey={
                                    "applications:edit." +
                                    "sections.signOnMethod.sections.authenticationFlow." +
                                    "sections.scriptBased.secretsList.tooltips.keyIcon"
                                }
                            >
                                Securely store access keys as secrets. A secret can
                                replace the consumer secret in <Code>callChoreo()</Code> function
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
                                data-componentid={ `${ componentId }-secret-search` }
                                icon="search"
                                iconPosition="left"
                                className="search"
                                placeholder={ t("applications:edit.sections.signOnMethod" +
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
                                onClick={ (e: React.MouseEvent<HTMLElement>) => e.stopPropagation() }
                            />
                        )
                    }
                    <Dropdown.Menu
                        data-componentid={ `${ componentId }-secret-list` }
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
                                                data-componentid={ `${ componentId }-secret-delete` }
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
                                                        content={ t("applications:edit." +
                                                            "sections.signOnMethod.sections.authenticationFlow." +
                                                            "sections.scriptBased.secretsList.tooltips.plusIcon") }
                                                        size="mini"
                                                    />
                                                ) }
                                                onClick={ () => {
                                                    addSecretToScript(secret);
                                                } }
                                                data-componentid={ `${ componentId }-secret-add` }
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
                                    data-componentid={ `${ componentId }-empty-placeholder` }
                                    key={ "secretEmptyPlaceholder" }
                                    text={ t("applications:edit.sections.signOnMethod" +
                                        ".sections.authenticationFlow.sections.scriptBased.secretsList." +
                                        "emptyPlaceholder") }
                                    disabled
                                />
                            )
                        }
                    </Dropdown.Menu>
                    { featureConfig?.secretsManagement?.enabled && hasRequiredScopes(featureConfig?.secretsManagement,
                        featureConfig?.secretsManagement?.scopes?.create, allowedScopes) &&
                        (OrganizationUtils.getOrganizationType() === OrganizationType.SUPER_ORGANIZATION ||
                        OrganizationUtils.getOrganizationType() === OrganizationType.FIRST_LEVEL_ORGANIZATION ||
                        OrganizationUtils.getOrganizationType() === OrganizationType.TENANT) && (
                        <Dropdown.Menu
                            className={ "create-button-item" }
                            scrolling
                        >
                            <Dropdown.Item
                                key={ "createSecret" }
                                text={ t("applications:edit.sections.signOnMethod" +
                                    ".sections.authenticationFlow.sections.scriptBased.secretsList.create") }
                                onClick={ () => {
                                    setShowAddSecretModal(true);
                                } }
                            />
                        </Dropdown.Menu>
                    ) }
                </Dropdown.Menu>
            </Dropdown>
        );

    };

    /**
     * Persist the Conditional Auth Tour seen status in Local Storage.
     *
     * @param status - Status to set.
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
     * @returns
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
     * @returns
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
                                data-componentid={
                                    `${ componentId }-code-editor-open-documentation`
                                }
                            />
                            <p>
                                { t("applications:edit.sections" +
                                            ".signOnMethod.sections.authenticationFlow.sections" +
                                            ".scriptBased.editor.apiDocumentation") }
                            </p>
                        </Button>
                    ) }
                    content={ t("applications:edit.sections" +
                            ".signOnMethod.sections.authenticationFlow.sections" +
                            ".scriptBased.editor.goToApiDocumentation") }
                    size="mini"
                />
            </Menu.Item>
        );
    };

    /**
     * Renders a confirmation modal when the Adaptive auth template is being reset back to default.
     *
     * @returns
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
                data-componentid={ `${ componentId }-delete-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header data-componentid={ `${ componentId }-reset-confirmation-modal-header` }>
                    { t("applications:edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.heading") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-componentid={ `${ componentId }-reset-confirmation-modal-message` }
                >
                    { t("applications:edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-componentid={ `${ componentId }-reset-confirmation-modal-content` }>
                    <Trans
                        i18nKey={
                            "applications:edit.sections.signOnMethod.sections" +
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
     *
     * @returns
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
                data-componentid={ `${ componentId }-adaptive-script-template-change-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header data-componentid={ `${ componentId }-reset-confirmation-modal-header` }>
                    { t("applications:edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.heading") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-componentid={ `${ componentId }-reset-confirmation-modal-message` }
                >
                    { t("applications:edit." +
                        "sections.signOnMethod.sections.authenticationFlow." +
                        "sections.scriptBased.editor.resetConfirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-componentid={ `${ componentId }-reset-confirmation-modal-content` }>
                    {
                        selectedAdaptiveAuthTemplate.name === ELK_RISK_BASED_TEMPLATE_NAME && (
                            <>
                                <Text>
                                    <Trans
                                        i18nKey={
                                            "governanceConnectors:connectorCategories." +
                                            "otherSettings.connectors.elasticAnalyticsEngine.warningModal.configure"
                                        }
                                    >
                                        (<Link
                                            onClick={ () => setIsELKConfigureClicked(true) }
                                            external={ false }
                                        >
                                            Configure
                                        </Link>
                                            ELK Analytics settings for proper functionality.)
                                    </Trans>
                                </Text>
                                <Text>
                                    <Trans
                                        i18nKey={
                                            "governanceConnectors:connectorCategories." +
                                            "otherSettings.connectors.elasticAnalyticsEngine.warningModal.reassure"
                                        }
                                    >
                                        You can update your settings anytime.
                                    </Trans> (<Code><GearIcon size={ 14 } /></Code>)
                                </Text>
                            </>
                        )
                    }
                    <Trans
                        i18nKey={
                            "applications:edit.sections.signOnMethod.sections" +
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
            type="negative"
            assertionHint={ t("secrets:modals.deleteSecret.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("secrets:modals.deleteSecret.primaryActionButtonText") }
            secondaryAction={ t("secrets:modals.deleteSecret.secondaryActionButtonText") }
            data-componentid={ `${ componentId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }>
            <ConfirmationModal.Header data-componentid={ `${ componentId }-delete-confirmation-modal-header` }>
                { t("secrets:modals.deleteSecret.title") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-componentid={ `${ componentId }-delete-confirmation-modal-message` }>
                { t("secrets:modals.deleteSecret.warningMessage") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${ componentId }-delete-confirmation-modal-content` }>
                { t("secrets:modals.deleteSecret.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    return (
        <>
            <div className="conditional-auth-section">
                <SegmentedAccordion
                    fluid
                    data-componentid={ `${ componentId }-accordion` }
                    className="conditional-auth-accordion"
                >
                    <SegmentedAccordion.Title
                        data-componentid={ `${ componentId }-accordion-title` }
                        active={ isConditionalAuthenticationEnabled }
                        content={ (
                            <>
                                <div className="conditional-auth-accordion-title">
                                    {
                                        !readOnly && (
                                            <Checkbox
                                                toggle
                                                data-tourid="conditional-auth"
                                                onChange={ handleConditionalAuthToggleChange }
                                                checked={ isConditionalAuthenticationEnabled }
                                                className="conditional-auth-accordion-toggle"
                                            />
                                        )
                                    }
                                    <div className="conditional-auth-accordion-title-text">
                                        <Heading as="h5" compact  className="heading">
                                            {
                                                t("applications:edit.sections.signOnMethod." +
                                                    "sections.authenticationFlow.sections.scriptBased.accordion." +
                                                    "title.heading")
                                            }
                                            {
                                                isPremiumFeature && (
                                                    <Popup
                                                        basic
                                                        inverted
                                                        position="top center"
                                                        content={
                                                            (<p>
                                                                {
                                                                    t("console:featureGate.enabledFeatures.tags." +
                                                                    "premium.warning")
                                                                }
                                                            </p>)
                                                        }
                                                        trigger={ (
                                                            <Chip
                                                                label="PREMIUM"
                                                                className="oxygen-menu-item-chip oxygen-chip-premium"
                                                                style={ { height: "fit-content" } }
                                                            />
                                                        ) }
                                                    />
                                                )
                                            }
                                        </Heading>
                                        <Text muted compact>
                                            {
                                                t("applications:edit.sections.signOnMethod." +
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
                        active={ isConditionalAuthenticationEnabled }
                        className="conditional-auth-accordion-content"
                        data-componentid={ `${ componentId }-accordion-content` }
                    >
                        <Sidebar.Pushable className="script-editor-with-template-panel no-border">
                            { !readOnly && (
                                <ScriptTemplatesSidePanel
                                    onELKModalClose={ () => setIsELKConfigureClicked(false) }
                                    isELKConfigureClicked={ isELKConfigureClicked }
                                    title={
                                        t("applications:edit.sections" +
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
                                    data-componentid={ `${ componentId }-script-templates-side-panel` }
                                />
                            ) }
                            <Sidebar.Pusher>
                                <div className="script-editor-container" ref={ scriptEditorSectionRef }>
                                    <Menu attached="top" className="action-panel" secondary>
                                        <Menu.Menu position="right">
                                            { resolveApiDocumentationLink() }
                                            { featureConfig?.secretsManagement?.enabled &&
                                                hasRequiredScopes(featureConfig?.secretsManagement,
                                                    featureConfig?.secretsManagement?.scopes?.read, allowedScopes) && (
                                                <Menu.Item
                                                    className={ `action ${ isSecretsDropdownOpen
                                                        ? "selected-secret"
                                                        : ""
                                                    }` }>
                                                    <div>
                                                        { renderSecretListDropdown() }
                                                    </div>
                                                </Menu.Item>
                                            ) }
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
                                                                data-componentid={
                                                                    `${ componentId }-code-editor-fullscreen-toggle`
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
                                                                data-componentid={
                                                                    `${ componentId }-code-editor-mode-toggle`
                                                                }
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
                                                    data-componentid={
                                                        `${ componentId }-script-template-sidebar-toggle`
                                                    }
                                                >
                                                    <Icon name="bars"/>
                                                </Menu.Item>
                                            ) }
                                        </Menu.Menu>
                                    </Menu>
                                    <div className="code-editor-wrapper">
                                        <CodeEditor
                                            editorDidMount={ (editor: codemirror.Editor) => {
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
                                            onChange={ (editor: codemirror.Editor,
                                                data: codemirror.EditorChange,
                                                value: string) => {
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
                                            data-componentid={ `${ componentId }-code-editor` }
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
    "data-componentid": "script-based-flow"
};
