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
import React, { useEffect, useState } from "react";
import { Container, Header } from "semantic-ui-react";
import { useTranslations } from "../../hooks/use-translations";
import { getTranslationByKey } from "../../utils/i18n-utils";

const CountDownAdapter = ({ redirection }) => {
    const { translations } = useTranslations();
    const [ timeLeft, setTimeLeft ] = useState(5); // Default to 5 seconds.

    useEffect(() => {
        // Only show countdown if redirection URL exists
        if (!redirection) {
            return;
        }

        // Start the countdown
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    // Redirect to the specified URL
                    window.location.href = redirection;

                    return 0;
                }

                return prevTime - 1;
            });
        }, 1000);

        // Cleanup timer on unmount
        return () => clearInterval(timer);
    }, [ redirection ]);

    // Don't render anything if there's no redirection URL
    if (!redirection) {
        return null;
    }

    return (
        <Container textAlign="center">
            <Header as="h3" color="green">
                { getTranslationByKey(translations, "flow.execution.success.message") }
            </Header>
            <p>
                { getTranslationByKey(translations, "flow.execution.success.redirect.message") } <span id="countdown">{
                    timeLeft
                }</span> { timeLeft === 1
                    ? getTranslationByKey(translations, "flow.execution.success.redirect.seconds.singular")
                    : getTranslationByKey(translations, "flow.execution.success.redirect.seconds.plural")
                }
            </p>
        </Container>
    );
};

CountDownAdapter.propTypes = {
    redirection: PropTypes.string.isRequired
};

export default CountDownAdapter;
