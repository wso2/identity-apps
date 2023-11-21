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

import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import "./console-login-security.scss";
import ConsoleLogin from "./console-login/console-login";
import Alert from "@oxygen-ui/react/Alert";
import ConsoleMFA from "./console-login/console-mfa";
import useConsoleSettings from "../../hooks/use-console-settings";

/**
 * Props interface of {@link ConsoleLoginSecurity}
 */
type ConsoleLoginSecurityInterface = IdentifiableComponentInterface;

/**
 * Component to render the login and security settings.
 *
 * @param props - Props injected to the component.
 * @returns Console login and security component.
 */
const ConsoleLoginSecurity: FunctionComponent<ConsoleLoginSecurityInterface> = (
    props: ConsoleLoginSecurityInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const [ activeSecurityMode, setActiveSecurityMode ] = useState("login");

    const { t } = useTranslation();

    const renderSecurityMode = (): ReactElement => {
        switch (activeSecurityMode) {
            case "login":
                return <ConsoleLogin />;
            case "multiFactorLogin":
                return <ConsoleMFA />;
            default:
                return null;
        }
    };

    return (
        <div className="console-login-security">
            <Alert severity="info">
                Enhance the security of your login flow by enabling either an Enterprise Identity Provider (IdP) as an additional option or by configuring a second-factor authentication method such as SMS OTP, Email OTP, etc. Choose the authentication mechanisms that best suit your organization&apos;s security requirements.
            </Alert>
            <RadioGroup
                row
                aria-labelledby="login-security-radio-group"
                className="multi-option-radio-group"
                defaultValue="login"
                name="login-security-radio-group"
                value={ activeSecurityMode }
                onChange={ (_: ChangeEvent<HTMLInputElement>, value: string) => setActiveSecurityMode(value) }
            >
                <FormControlLabel value="login" control={ <Radio /> } label="Enterprise Login" />
                <FormControlLabel value="multiFactorLogin" control={ <Radio /> } label="Second Factor Login" />
            </RadioGroup>
            { renderSecurityMode() }
        </div>
    );
};

/**
 * Default props for the component.
 */
ConsoleLoginSecurity.defaultProps = {
    "data-componentid": "console-login-security"
};

export default ConsoleLoginSecurity;
