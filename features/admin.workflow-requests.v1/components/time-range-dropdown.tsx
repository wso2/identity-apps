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

import React, { useRef, useState, useEffect } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import "../styles/workflow-requests.css";

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
}) => {
    const { t } = useTranslation(["workflow-requests"]);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const prevSelectedRangeRef = useRef(selectedRange);
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [customStartTime, setCustomStartTime] = useState("00:00");
    const [customEndTime, setCustomEndTime] = useState("23:59");

    const TIME_RANGE_OPTIONS = [
        { key: -2, text: t("timeRanges.all"), value: -2 },
        { key: 6, text: t("timeRanges.last6Hours"), value: 6 },
        { key: 12, text: t("timeRanges.last12Hours"), value: 12 },
        { key: 24, text: t("timeRanges.last24Hours"), value: 24 },
        { key: 48, text: t("timeRanges.last2Days"), value: 48 },
        { key: 168, text: t("timeRanges.last7Days"), value: 168 },
        { key: 336, text: t("timeRanges.last14Days"), value: 336 },
        { key: 720, text: t("timeRanges.last30Days"), value: 720 },
        { key: -1, text: t("timeRanges.customRange"), value: -1 }
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
        // Calculate time range
        const current = new Date().getTime();
        const fromTime = (current - 3600 * 1000 * value).toString();
        const toTime = current.toString();
        onCustomDateChange(fromTime, toTime);
    };

    const handleCustomSubmit = (e?: React.FormEvent) => {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        if (customStartDate && customEndDate && customStartTime && customEndTime) {
            const fromTime = new Date(`${customStartDate}T${customStartTime}`).getTime().toString();
            const toTime = new Date(`${customEndDate}T${customEndTime}`).getTime().toString();
            onCustomDateChange(fromTime, toTime);
            setShowCustomModal(false);
        }
    };

    const handleCancel = () => {
        onRangeChange(prevSelectedRangeRef.current);
        setShowCustomModal(false);
        setCustomStartDate("");
        setCustomEndDate("");
        setCustomStartTime("00:00");
        setCustomEndTime("23:59");
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showCustomModal) {
                handleCancel();
            }
        };

        if (showCustomModal) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [showCustomModal]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    const formatDateForInput = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return (
        <div className="time-range-dropdown">
            <Dropdown
                selection
                options={TIME_RANGE_OPTIONS}
                value={selectedRange}
                onChange={handleRangeChange}
                disabled={disabled}
                placeholder={label}
                text={label}
                style={style}
                data-componentid={componentId}
            />
            {showCustomModal && (
                <div
                    className="time-range-custom-modal"
                    onClick={handleBackdropClick}
                >
                    <div className="modal-content">
                        <h3 className="modal-title">
                            {t('workflow-requests:timeRanges.customRangeTitle', { label: label.replace('Time Range', t('workflow-requests:timeRanges.range')) })}
                        </h3>
                        <form onSubmit={handleCustomSubmit}>
                            <div className="form-group">
                                <label className="form-label">
                                    {t('common:from')}
                                </label>
                                <div className="input-group">
                                    <input
                                        type="date"
                                        value={customStartDate}
                                        min={formatDateForInput(thirtyDaysAgo)}
                                        max={formatDateForInput(now)}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                    <input
                                        type="time"
                                        value={customStartTime}
                                        onChange={(e) => setCustomStartTime(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    {t('common:to')}
                                </label>
                                <div className="input-group">
                                    <input
                                        type="date"
                                        value={customEndDate}
                                        min={customStartDate || formatDateForInput(thirtyDaysAgo)}
                                        max={formatDateForInput(now)}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                    <input
                                        type="time"
                                        value={customEndTime}
                                        onChange={(e) => setCustomEndTime(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    {t('common:cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    primary
                                    onClick={handleCustomSubmit}
                                >
                                    {t('common:apply')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeRangeDropdown;
