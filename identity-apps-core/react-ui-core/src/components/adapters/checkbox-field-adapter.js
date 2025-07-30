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
import { Checkbox } from "semantic-ui-react";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import Hint from "../hint";

const CheckboxFieldAdapter = ({ component, formStateHandler }) => {

    const { identifier, label, hint } = component.config;
    const { translations } = useTranslations();

    return (
        <>
            <Checkbox
                name={ identifier }
                label={ resolveElementText(translations, label) }
                onChange={ (e, data) => formStateHandler(identifier, data.checked) }
            />
            {
                hint && ( <Hint hint={ hint } /> )
            }
        </>
    );
};

CheckboxFieldAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            hint: PropTypes.string,
            identifier: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        }).isRequired,
        id: PropTypes.string,
        type: PropTypes.string,
        variant: PropTypes.string
    }).isRequired,
    formStateHandler: PropTypes.func.isRequired
};

export default CheckboxFieldAdapter;
