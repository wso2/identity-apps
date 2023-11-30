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

import { CopyIcon } from "@oxygen-ui/react-icons";
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { PageLayout } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState } from "../../core/store";
import ConsoleSettingsTabs from "../components/console-settings-tabs";
import ConsoleSettingsProvider from "../providers/console-settings-provider";
import "./console-settings-page.scss";

/**
 * Props interface of {@link ConsoleSettingsPage}
 */
type ConsoleSettingsPageInterface = IdentifiableComponentInterface;

/**
 * Email Domain Discovery page.
 *
 * @param props - Props injected to the component.
 * @returns Email Domain Discovery page component.
 */
const ConsoleSettingsPage: FunctionComponent<ConsoleSettingsPageInterface> = (
    props: ConsoleSettingsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();

    const consoleUrl: string = useSelector((state: AppState) => state?.config?.deployment?.clientHost);

    return (
        <ConsoleSettingsProvider>
            <PageLayout
                pageTitle={ "Console Settings" }
                title={ "Console Settings" }
                description={ "Configure settings related to your Console" }
                data-componentid={ `${ componentId }-page-layout` }
                action={ (
                    <TextField
                        label="Console URL"
                        id="filled-start-adornment"
                        InputProps={ {
                            endAdornment: (
                                <Tooltip
                                    title="Copy"
                                >
                                    <div>
                                        <IconButton
                                            aria-label="Reset field to default"
                                            className="reset-field-to-default-adornment"
                                            onClick={ async () => {
                                                await CommonUtils.copyTextToClipboard(consoleUrl);
                                            } }
                                            edge="end"
                                        >
                                            <CopyIcon size={ 12 } />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            ),
                            readOnly: true
                        } }
                        value={ consoleUrl }
                        className="console-url-copy-field"
                    />
                ) }
            >
                <ConsoleSettingsTabs />
            </PageLayout>
        </ConsoleSettingsProvider>
    );
};

ConsoleSettingsPage.defaultProps = {
    "data-componentid": "console-settings-page"
};

export default ConsoleSettingsPage;
