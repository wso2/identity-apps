/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import PropTypes from "prop-types";
import React from "react";
import { Button } from "semantic-ui-react";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";

const ResendButtonAdapter = ({ component, handleButtonAction }) => {

    const { translations } = useTranslations();

    return (
        <Button
            type={ component.config.type }
            className="ui secondary fluid large button mt-4"
            name={ component.id }
            onClick={ () => handleButtonAction(component.actionId, { "resend": "true" }) }
        >
            { resolveElementText(translations, component.config.text) }
        </Button>
    );
};

ResendButtonAdapter.propTypes = {
    component: PropTypes.shape({
        action: PropTypes.object.isOptional,
        actionId: PropTypes.string.isRequired,
        config: PropTypes.shape({
            text: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired
        }).isRequired,
        id: PropTypes.string,
        type: PropTypes.string,
        variant: PropTypes.string
    }).isRequired,
    handleButtonAction: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isOptional
};

export default ResendButtonAdapter;
