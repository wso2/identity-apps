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

import { CodeEditor, Heading, Hint, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { Grid, Icon, Menu, Sidebar } from "semantic-ui-react";
import {
    AdaptiveAuthTemplatesInterface,
    AuthenticationSequenceInterface
} from "../../../../models";
import { AdaptiveScriptUtils } from "../../../../utils";
import { getAdaptiveAuthTemplates, updateAuthenticationSequence } from "../../../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { ApplicationManagementConstants } from "../../../../constants";
import { UIConstants } from "@wso2is/core/constants";
import { ScriptTemplatesSidePanel } from "./script-templates-side-panel";

/**
 * Proptypes for the adaptive scripts component.
 */
interface AdaptiveScriptsPropsInterface {
    /**
     * ID of the application.
     */
    appId: string;
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
}

/**
 * Configure the authentication flow using an adaptive script.
 *
 * @param {AdaptiveScriptsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AdaptiveScripts: FunctionComponent<AdaptiveScriptsPropsInterface> = (
    props: AdaptiveScriptsPropsInterface
): ReactElement => {

    const {
        appId,
        authenticationSequence,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const authTemplatesSidePanelRef = useRef(null);
    const scriptEditorSectionRef = useRef(null);

    const [ scriptTemplates, setScriptTemplates ] = useState<AdaptiveAuthTemplatesInterface>(undefined);
    const [ showAuthTemplatesSidePanel, setAuthTemplatesSidePanelVisibility ] = useState<boolean>(true);
    const [ sourceCode, setSourceCode ] = useState<string | string[]>(undefined);

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

    /**
     * Triggered on `showAuthenticatorsSidePanel` change.
     */
    useEffect(() => {
        let width = "100%";

        if (showAuthTemplatesSidePanel) {
            width = `calc(100% - ${ authTemplatesSidePanelRef?.current?.ref?.current?.clientWidth }px)`;
        }

        scriptEditorSectionRef.current.style.width = width;
    }, [ showAuthTemplatesSidePanel ]);

    useEffect(() => {
        resolveAdaptiveScript(authenticationSequence?.script);
    }, [ authenticationSequence?.steps, authenticationSequence?.script ]);

    const resolveAdaptiveScript = (script: string): string | string[] => {
        // Check if there is no script defined and the step count is o.
        // If so, return the default script.
        if (!script && authenticationSequence?.steps?.length === 0) {
            setSourceCode(AdaptiveScriptUtils.getDefaultScript());
            return;
        }

        if (!script && authenticationSequence?.steps?.length > 0) {
            setSourceCode(AdaptiveScriptUtils.generateScript(authenticationSequence.steps.length));
            return;
        }

        setSourceCode(JSON.parse(script));
    };

    const handleScriptTemplateSidebarToggle = () => {
        setAuthTemplatesSidePanelVisibility(!showAuthTemplatesSidePanel);
    };

    const handleTemplateSelection = (code: string[]) => {
        setSourceCode(code);
    };

    const handleAdaptiveScriptUpdate = () => {
        const requestBody = {
            authenticationSequence: {
                script: JSON.stringify(sourceCode)
            }
        };

        updateAuthenticationSequence(appId, requestBody)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating authentication steps of the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            });
    };

    return (
        <div className="adaptive-scripts-section">
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 16 }>
                        <Heading as="h4">Adaptive scripts</Heading>
                        <Hint>
                            Define the authentication flow via an adaptive script. You can select one of the
                            following templates to get started.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={ 16 }>
                        <Sidebar.Pushable className="script-editor-section">
                            <ScriptTemplatesSidePanel
                                title="Templates"
                                ref={ authTemplatesSidePanelRef }
                                onTemplateSelect={ handleTemplateSelection }
                                templates={
                                    scriptTemplates?.templatesJSON && Object.values(scriptTemplates.templatesJSON)
                                }
                                visible={ showAuthTemplatesSidePanel }
                            />
                            <Sidebar.Pusher>
                                <div className="script-editor-container" ref={ scriptEditorSectionRef }>
                                    <Menu attached="top" className="action-panel" secondary>
                                        <Menu.Menu position="right">
                                            <Menu.Item onClick={ handleScriptTemplateSidebarToggle } className="action">
                                                <Icon name="bars" />
                                            </Menu.Item>
                                        </Menu.Menu>
                                    </Menu>

                                    <div
                                        className="code-editor-wrapper"
                                    >
                                        <CodeEditor
                                            lint
                                            language="javascript"
                                            sourceCode={ sourceCode }
                                            options={ {
                                                lineWrapping: true
                                            } }
                                            onChange={ (editor, data, value) => {
                                                console.log(value);
                                            } }
                                        />
                                    </div>
                                </div>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <PrimaryButton onClick={ handleAdaptiveScriptUpdate }>Update</PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};
