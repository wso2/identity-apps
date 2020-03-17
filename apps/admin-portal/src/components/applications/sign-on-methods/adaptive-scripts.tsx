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

import { CodeEditor, Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Grid } from "semantic-ui-react";
import {
    AuthenticationSequenceInterface
} from "../../../models";
import { AdaptiveScriptUtils } from "../../../utils";

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
        authenticationSequence
    } = props;

    const resolveAdaptiveScript = (script: string): string | string[] => {
        // Check if there is no script defined and the step count is o.
        // If so, return the default script.
        if (!script && authenticationSequence?.steps?.length === 0) {
            return AdaptiveScriptUtils.getDefaultScript();
        }

        if (!script && authenticationSequence?.steps?.length > 0) {
            return AdaptiveScriptUtils.generateScript(authenticationSequence.steps.length);
        }

        return script;
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
                        <CodeEditor
                            beautify
                            language="javascript"
                            lint={ true }
                            sourceCode={
                                resolveAdaptiveScript(authenticationSequence?.script)
                                    ? resolveAdaptiveScript(authenticationSequence.script)
                                    : null
                            }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};
