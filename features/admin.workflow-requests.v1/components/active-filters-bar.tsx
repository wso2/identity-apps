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

import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon } from "semantic-ui-react";
import "./active-filters-bar.scss";

export interface FilterTag {

    key: string;
    label: string;
    type: string;
    value: string;
}

interface ActiveFiltersBarProps {
    filters: FilterTag[];
    onClearAll: () => void;
    onRemove: (filter: FilterTag) => void;
    [ key: string ]: any;
}

const ActiveFiltersBar: React.FC<ActiveFiltersBarProps> = (
    { filters, onRemove, onClearAll, ..._rest }: ActiveFiltersBarProps
) => {
    const { t } = useTranslation();

    return (
        <div className="workflow-requests-active-filters-bar modern-active-filters-bar">
            <div className="filters-container">
                {filters && filters.length > 0 ? (
                    filters.map((filter) => (
                        <div
                            key={filter.key}
                            data-componentid={`active-filters-bar-filter-${filter.key}`}
                            className="filter-tag"
                        >
                            <span className="filter-type">
                                {filter.type}:
                            </span>
                            <span className="filter-value">
                                {filter.label}
                            </span>
                            <span
                                role="button"
                                tabIndex={0}
                                aria-label={t('approvalWorkflows:activeFiltersBar.removeFilter', { filter: filter.label })}
                                onClick={() => onRemove(filter)}
                                onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') onRemove(filter); }}
                                className="filter-remove-button"
                            >
                                <Icon name="close" size="small" className="icon" />
                            </span>
                        </div>
                    ))
                ) : (
                    <span className="no-filters-text">
                        {t("approvalWorkflows:activeFiltersBar.noActiveFilters")}
                    </span>
                )}
            </div>

            {filters && filters.length > 0 && (
                <Button
                    size="small"
                    onClick={ onClearAll }
                    data-componentid="active-filters-bar-clear-all"
                    className="clear-all-button"
                >
                    <Icon name="close" size="small" className="icon" />
                    {t("approvalWorkflows:activeFiltersBar.clearAll")}
                </Button>
            )}
        </div>
    );
};

export default ActiveFiltersBar;

