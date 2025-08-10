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

import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dropdown, Form, Input, Portal, Segment } from "semantic-ui-react";
import "./time-range-dropdown.scss";

interface TimeRangeDropdownProps {
    label: string;
    selectedRange: number | undefined;
    onRangeChange: (range: number) => void;
    onCustomDateChange: (from: string, to: string) => void;
    componentId: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const TimeRangeDropdown: React.FC<TimeRangeDropdownProps> = ({
    label,
    selectedRange,
    onRangeChange,
    onCustomDateChange,
    componentId,
    disabled = false,
    style
}: TimeRangeDropdownProps) => {
    const { t } = useTranslation( [ "approvalWorkflows" ] );
    const [ showCustomModal, setShowCustomModal ] = useState(false);
    const prevSelectedRangeRef: React.MutableRefObject<number | undefined> = useRef<number | undefined>(selectedRange);
    const [ customStartDate, setCustomStartDate ] = useState("");
    const [ customEndDate, setCustomEndDate ] = useState("");
    const [ customStartTime, setCustomStartTime ] = useState("00:00");
    const [ customEndTime, setCustomEndTime ] = useState("23:59");

    const TIME_RANGE_OPTIONS: Array<{ key: number; text: string; value: number }> = [
        { key: -2, text: t("approvalWorkflows:timeRanges.all"), value: -2 },
        { key: 6, text: t("approvalWorkflows:timeRanges.last6Hours"), value: 6 },
        { key: 12, text: t("approvalWorkflows:timeRanges.last12Hours"), value: 12 },
        { key: 24, text: t("approvalWorkflows:timeRanges.last24Hours"), value: 24 },
        { key: 48, text: t("approvalWorkflows:timeRanges.last2Days"), value: 48 },
        { key: 168, text: t("approvalWorkflows:timeRanges.last7Days"), value: 168 },
        { key: 336, text: t("approvalWorkflows:timeRanges.last14Days"), value: 336 },
        { key: 720, text: t("approvalWorkflows:timeRanges.last30Days"), value: 720 },
        { key: -1, text: t("approvalWorkflows:timeRanges.customRange"), value: -1 }
    ];

    const handleRangeChange = (e: React.SyntheticEvent<HTMLElement>, { value }: { value: number }) => {
        if (value === -1) {
            prevSelectedRangeRef.current = selectedRange;
            onRangeChange(-1);
            setShowCustomModal(true);

            return;
        }
        else if (value === -2) {
            onRangeChange(-2);

            return;
        }
        onRangeChange(value);

        const current: number = new Date().getTime();
        const fromTime: string = (current - 3600 * 1000 * value).toString();
        const toTime: string = current.toString();

        onCustomDateChange(fromTime, toTime);
    };

    const handleCustomSubmit = (e?: React.FormEvent) => {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        if (customStartDate && customEndDate && customStartTime && customEndTime) {
            const fromTime: string = new Date(`${customStartDate}T${customStartTime}`).getTime().toString();
            const toTime: string = new Date(`${customEndDate}T${customEndTime}`).getTime().toString();

            onCustomDateChange(fromTime, toTime);
            setShowCustomModal(false);
        }
    };

    const handleExternalPortalClose = (): void => {
        if (!(customStartTime && customEndTime && customStartDate && customEndDate)) {
            onRangeChange(prevSelectedRangeRef.current);
        }
        setShowCustomModal(false);
    };

    const formatDateForInput = (date: Date): string => {
        return date.toISOString().split("T")[0];
    };

    const now: Date = new Date();
    const thirtyDaysAgo: Date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return (
        <div className="time-range-dropdown">
            <Dropdown
                selection
                options={ TIME_RANGE_OPTIONS }
                value={ selectedRange }
                onChange={ handleRangeChange }
                disabled={ disabled }
                placeholder={ label }
                text={ label }
                style={ style }
                data-componentid={ componentId }
            />
            { showCustomModal && (
                <Portal
                    open={ showCustomModal }
                    onClose={ handleExternalPortalClose }
                >
                    <div className="custom-portal-overlay" onClick={ handleExternalPortalClose }>
                        <Segment className="custom-portal-wrapper">
                            <div
                                className="main-container"
                                onClick={ (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                    e.stopPropagation()
                                }
                            >
                                <Form
                                    className="date-picker-form"
                                    onSubmit={ handleCustomSubmit }
                                >
                                    <Form.Group>
                                        <Form.Field width={ 16 }>
                                            <label>
                                                { t( "common:from" ) }
                                            </label>
                                            <div className="date-time-picker-row">
                                                <div>
                                                    <Input
                                                        className="date-input"
                                                        type="date"
                                                        value={ customStartDate }
                                                        min={ formatDateForInput(thirtyDaysAgo) }
                                                        max={ formatDateForInput(now) }
                                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                            setCustomStartDate(e.target.value)
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        className="time-input"
                                                        type="time"
                                                        value={ customStartTime }
                                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                            setCustomStartTime(e.target.value)
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </Form.Field>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Field width={ 16 }>
                                            <label>
                                                { t( "common:to" ) }
                                            </label>
                                            <div className="date-time-picker-row">
                                                <div>
                                                    <Input
                                                        className="date-input"
                                                        type="date"
                                                        min={
                                                            customStartDate ||
                                                                formatDateForInput(thirtyDaysAgo)
                                                        }
                                                        max={ formatDateForInput(now) }
                                                        value={ customEndDate }
                                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                            setCustomEndDate(e.target.value)
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        className="time-input"
                                                        type="time"
                                                        value={ customEndTime }
                                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                                            setCustomEndTime(e.target.value)
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Field width={ 8 }>
                                            <Button
                                                fluid
                                                icon="close"
                                                type="button"
                                                onClick={ handleExternalPortalClose }
                                            />
                                        </Form.Field>
                                        <Form.Field width={ 8 }>
                                            <Button fluid icon="check" type="submit" />
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            </div>
                        </Segment>
                    </div>
                </Portal>
            ) }
        </div>
    );
};

export default TimeRangeDropdown;
