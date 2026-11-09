/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { Loader, Message } from "semantic-ui-react";
import DynamicContent from "./dynamic-content";
import { PollStatus, useFlowPolling } from "../hooks/use-flow-polling";
import { useTranslations } from "../hooks/use-translations";
import { getTranslationByKey } from "../utils/i18n-utils";
import "./poll-view.css";

/**
 * Formats the time left as m:ss.
 *
 * @param {number} remainingMs - Time left in milliseconds.
 * @returns {string} Formatted time.
 */
const formatRemainingTime = (remainingMs) => {
    const totalSeconds = Math.max(Math.ceil(remainingMs / 1000), 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${ minutes }:${ seconds < 10 ? "0" : "" }${ seconds }`;
};

/**
 * Page of a POLL step, which waits for something outside the flow. It shows the step's components and the polling
 * status: the time left, or on failure or expiry a message and "Start again". A QR code on the page is hidden once
 * it can not be used. The flow continues through `onSuccess` when the poll succeeds.
 */
const PollView = ({ contentData, pollUrl, busy, onSuccess, onRestart, onCancel, onError }) => {
    const { translations } = useTranslations();
    const pollData = contentData.additionalData || {};
    const { status, remainingMs } = useFlowPolling({
        expiresIn: pollData.expiresIn,
        onError,
        onSuccess,
        pollInterval: pollData.pollInterval,
        pollToken: pollData.pollToken,
        pollUrl
    });

    const isActive = status === PollStatus.WAITING || status === PollStatus.SUCCESS;
    const components = (contentData.components || [])
        .filter((component) => isActive || component.type !== "QR_CODE");

    const renderStatus = () => {
        if (isActive) {
            return (
                <div className="text-center">
                    { remainingMs !== null && (
                        <p className="poll-countdown" data-componentid="poll-countdown">
                            { getTranslationByKey(translations, "flow.poll.expires.in") } {
                                formatRemainingTime(remainingMs) }
                        </p>
                    ) }
                    <Loader active inline size="mini" className="poll-loader" />
                    <span>{ getTranslationByKey(translations, "flow.poll.waiting") }</span>
                </div>
            );
        }

        const isExpired = status === PollStatus.EXPIRED;

        return (
            <div className="text-center">
                <Message negative={ !isExpired } warning={ isExpired } role="alert">
                    <span>
                        { getTranslationByKey(translations, isExpired ? "flow.poll.expired" : "flow.poll.failed") }
                    </span>
                </Message>
                <button
                    type="button"
                    className={ `ui primary fluid large button${ busy ? " loading disabled" : "" }` }
                    disabled={ busy }
                    data-componentid="poll-restart-button"
                    onClick={ onRestart }
                >
                    { getTranslationByKey(translations, "flow.poll.restart") }
                </button>
            </div>
        );
    };

    return (
        <div className="segment-form" data-componentid="poll">
            { components.length > 0 && (
                <DynamicContent
                    contentData={ { ...contentData, components } }
                    state={ {} }
                    // A POLL step takes no actions; the flow continues when the poll succeeds.
                    handleFlowRequest={ () => {} }
                />
            ) }
            { renderStatus() }
            <div className="ui divider hidden" />
            <button
                type="button"
                className={ `ui secondary fluid large button${ busy ? " disabled" : "" }` }
                disabled={ busy }
                data-componentid="poll-cancel-button"
                onClick={ onCancel }
            >
                { getTranslationByKey(translations, "flow.poll.cancel") }
            </button>
        </div>
    );
};

PollView.propTypes = {
    busy: PropTypes.bool,
    contentData: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onRestart: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    pollUrl: PropTypes.string.isRequired
};

export default PollView;
