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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder,
    Hint,
    LinkButton,
    Message,
    PrimaryButton } from "@wso2is/react-components";
import React, {
    MutableRefObject,
    ReactElement,
    UIEventHandler,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Icon, Label } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../../admin-core-v1";
import InfiniteScrollContainer from "../logs/components/infinite-scroll-container";
import TimeRangeSelector from "../logs/components/time-range-selector";
import { LogsConstants } from "../logs/constants";
import useFetch from "../logs/hooks/use-fetch";
import { InterfaceLogEntry, InterfaceLogsFilter, InterfaceLogsRequest, TabIndex } from "../logs/models/log-models";
import { getDateTimeWithOffset, getTimeFromTimestamp } from "../logs/utils";

/**
 * Proptypes for the logs page component.
 */
type AuditPagePropsInterface = IdentifiableComponentInterface;

/**
 * Logs monitoring page.
 *
 * @param props - {@link LogsPageInterface} Props injected to the component.
 *
 * @returns Logs Page {@link React.ReactElement}
 */
export const AuditLogsPage = (props: AuditPagePropsInterface) : ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const [ isPreviousEmpty, setIsPreviousEmpty ] = useState<boolean>(false);
    const [ isNextEmpty, setIsNextEmpty ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ filterQuery, setFilterQuery ] = useState<string>("");
    const [ inputQuery, setInputQuery ] = useState<string>("");
    const [ endTime, setEndTime ] = useState<string>("");
    const [ startTime, setStartTime ] = useState<string>("");
    const [ timeRange, setTimeRange ] = useState<number>(0.25);
    const [ filterMap, setFilterMap ] = useState<Map<string, string>>(new Map());
    const [ filterList, setFilterList ] = useState<{ key: string, value:string }[]>([]);
    const [ requestPayload, setRequestPayload ] = useState<InterfaceLogsRequest | null>(null);
    const [ showLastLogTime, setShowLastLogTime ] = useState<boolean>(false);
    const [ showDelayMessage, setShowDelayMessage ] = useState<boolean>(false);
    const [ lastAuditLogRequestTime, setLastAuditLogRequestTime ] = useState<string>("");
    const [ lastAuditLogRequestTimeRange, setLastAuditLogRequestTimeRange ] = useState<number>(0.25);
    const [ showRefreshButton, setShowRefreshButton ] = useState<boolean>(false);
    const [ timerRunning, setTimerRunning ] = useState<boolean>(false);
    const [ audiLogList, setAuditLogList ] = useState<InterfaceLogEntry[]>([]);

    const { t } = useTranslation();
    const timeZone: string = "GMT+0000 UTC";

    useEffect(() => {
        // Display a message if the logs are not fetched within 15 seconds of the request.
        setTimeout(() => {
            setShowDelayMessage(true);
        }, LogsConstants.DELAY_MESSEGE_TIMEOUT);

        // If the time range is custom don't show the last request time.
        // Show the refresh button 2 minutes after the last request. only if the time range is not custom.
        if (timeRange === -1) {
            setShowLastLogTime(false);
        } else {
            setShowLastLogTime(true);
            if (!timerRunning) {
                setTimerRunning(true);
                setTimeout(() => {
                    setShowRefreshButton(true);
                    setTimerRunning(false);
                }, LogsConstants.REFRESH_BUTTON_TIMEOUT);
            }
        }
    }, [ lastAuditLogRequestTime ]);

    useEffect(() => {
        setShowRefreshButton(false);
    }, [ endTime, startTime, inputQuery, filterQuery ]);

    useEffect(() => {
        const current: number = getDateTimeWithOffset(timeZone);
        const currentEndTime: string = current.toString();
        const currentStartTime: string = (current - 3600*1000*timeRange).toString();

        setEndTime(currentEndTime);
        setStartTime(currentStartTime);
        setLastAuditLogRequestTime(currentEndTime);

        // Fetch logs automatically during the first render.
        setRequestPayload({
            endTime: currentEndTime,
            filter: "",
            limit: LogsConstants.LOG_FETCH_COUNT,
            logType: TabIndex.AUDIT_LOGS,
            startTime: currentStartTime
        });
    }, []);

    const scrollRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const { error, list, loading, next, previous } = useFetch(requestPayload);

    useEffect (() => {
        setAuditLogList(list);
    }, [ list ]);

    /**
     * Handles the behavior of the infinite scroller.
     */
    const handleScroll: UIEventHandler<HTMLDivElement> = (e: React.UIEvent<HTMLElement>) => {
        const element: HTMLElement = e.target as HTMLElement;

        setShowDelayMessage(false);
        // When the at the top of the log container.
        if (element.scrollTop === 0) {
            if (previous) {
                setRequestPayload({
                    filter: searchQuery,
                    limit: LogsConstants.LOG_FETCH_COUNT,
                    previousToken: previous
                });
                setIsPreviousEmpty(false);
                setIsNextEmpty(false);
            } else {
                setIsPreviousEmpty(true);
            }
        }
        // When the at the bottom of the log container.
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            if (next) {
                setRequestPayload({
                    filter: searchQuery,
                    limit: LogsConstants.LOG_FETCH_COUNT,
                    nextToken: next
                });
                setIsNextEmpty(false);
                setIsPreviousEmpty(false);
            } else {
                setIsNextEmpty(true);
            }
        }
    };

    const renderAuditLogContent = () : ReactElement => {

        return (
            <div>
                <div className="top-action-bar">
                    { advancedSearchFilter() }
                    <TimeRangeSelector
                        setFromTime={ (value: string): void => setStartTime(value) }
                        setToTime={ (value: string): void => setEndTime(value) }
                        setTimeRange={ (value: number): void => setTimeRange(value) }
                        data-componentid={ `${ componentId }-audit` }
                    />
                    { showRefreshButton
                        ? (
                            <PrimaryButton
                                onClick={ () => fetchLatestLogs() }
                                data-componentid={ `${ componentId }-refresh-button` }
                            >
                                <Icon name="refresh" />
                                { t("extensions:develop.monitor.filter.refreshButton.label") }
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton
                                onClick={ () => handleSearch() }
                                data-componentid={ `${ componentId }-search-button` }
                            >
                                <Icon name="search" />
                                { t("extensions:develop.monitor.filter.queryButton.label") }
                            </PrimaryButton>
                        )
                    }
                </div>
                <div>
                    <div className="top-toolbar">
                        { renderRefreshTime() }
                        <Label.Group>
                            { filterList?.map(
                                (value: { key: string, value:string }, index: number) =>
                                    (<Label key={ index } className="filter-pill">
                                        { getLabelTextForFilterPill(value.key) }
                                        <Label.Detail>{ value.value }</Label.Detail>
                                        <Icon name="delete" onClick={ () => removeFilter(value.key) }></Icon>
                                    </Label>)
                            ) }
                            { resolveClearAllFilters() }
                        </Label.Group>
                    </div>
                    { resolveAuditLogs() }
                </div>
            </div> );
    };

    /**
     * Build filter query.
     */
    const buildFilterQuery = () => {
        let tempQuery: string = "";

        filterMap.forEach((val: string) => {
            if (tempQuery) {
                tempQuery = `${tempQuery} and logentry co '${val}'`;
            } else {
                tempQuery = `logentry co '${val}'`;
            }
        });
        setFilterQuery(tempQuery);
    };

    /**
     * Search logs.
     *
     * @param query - search query with filters.
     */
    const handleSearch = () => {
        let currentQuery: string = "";

        if (inputQuery.length === 0) {
            currentQuery = inputQuery;
        } else {
            currentQuery = `logentry co '${inputQuery}'`;
            if (filterQuery) {
                currentQuery = ` and ${currentQuery}`;
            }
        }
        setSearchQuery(currentQuery);

        // If the custom time range is not defined,
        // start, end times needs to be updated to account for the time it takes to click the search button.
        let currentStartTime: string = startTime;
        let currentEndTime: string = endTime;
        const currentTime: number = getDateTimeWithOffset(timeZone);

        if (timeRange !== -1) {
            currentEndTime = currentTime.toString();
            currentStartTime = (currentTime - 3600*1000*timeRange).toString();
        }
        setShowDelayMessage(false);
        setLastAuditLogRequestTime(currentTime.toString());
        setLastAuditLogRequestTimeRange(timeRange);

        setRequestPayload({
            endTime: currentEndTime,
            filter: `${filterQuery}${currentQuery}`,
            limit: LogsConstants.LOG_FETCH_COUNT,
            logType: TabIndex.AUDIT_LOGS,
            startTime: currentStartTime
        });
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setInputQuery("");
        setShowRefreshButton(false);
    };

    /**
     * Handles searching logs with multiple filters.
     */
    const handleFilter = (query: InterfaceLogsFilter): void => {
        const tempMap: Map<string, string> = filterMap;

        tempMap.set(query.property, query.value);
        setFilterMap(tempMap);
        buildFilterQuery();

        const arr: { key: string, value:string }[] = [];

        tempMap.forEach((value: string, key: string) => {
            arr.push({ key, value });
        });

        setFilterList(arr);
    };

    /**
     * Remove specific filter attributes on click delete button
     * in filter pills.
     */
    const removeFilter = (filterKey: string): void => {
        const tempMap: Map<string, string> = filterMap;

        tempMap.delete(filterKey);
        setFilterMap(tempMap);
        buildFilterQuery();

        const arr: { key: string, value:string }[] = [];

        tempMap.forEach((value: string, key: string) => {
            arr.push({ key, value });
        });

        setFilterList(arr);
    };

    /**
     * Clear all filter attributes.
     */
    const clearAllFilters = (): void => {
        const tempMap: Map<string, string> = filterMap;

        tempMap.clear();
        setFilterMap(tempMap);
        buildFilterQuery();
        setFilterList([]);
    };

    /**
     * Returns search component.
     */
    const advancedSearchFilter = (): ReactElement => (
        <form
            className="advance-search-form"
            onSubmit={ (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); } }>
            <div className="search-input-wrapper">
                <div className="search-box ui action left icon input advanced-search with-add-on">
                    <input
                        autoComplete="off"
                        placeholder={ t("extensions:develop.monitor.filter.searchBar.placeholderAudit") }
                        maxLength={ 120 }
                        name="query"
                        type="text"
                        className="search-input"
                        value={ inputQuery }
                        onChange={ (e: React.FormEvent<HTMLInputElement>) =>
                            setInputQuery((e.target as HTMLInputElement).value)
                        }
                        data-componentid={ `${componentId}-search-input` }
                    />
                    <Icon name="search" color="grey" />
                </div>
                <div className="search-box-addons" hidden={ !inputQuery }>
                    <Icon
                        name="close"
                        color="grey"
                        onClick={ handleSearchQueryClear }
                        className="icon-button"
                    />
                </div>
                <input
                    hidden
                    type="submit"
                    value="Submit"
                    data-componentid={ `${componentId}-search-input-submit` }
                />
            </div>
        </form>
    );

    const resolveAuditLogs = (): ReactElement => {
        if (error) {
            return (
                <EmptyPlaceholder
                    subtitle={ [
                        t("extensions:develop.monitor.notifications.genericError.subtitle.0"),
                        t("extensions:develop.monitor.notifications.genericError.subtitle.1")
                    ] }
                    title={ t("extensions:develop.monitor.notifications.genericError.title") }
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                    data-componentid={ `${ componentId }-generic-error-placeholder` }
                />
            );
        } else if (searchQuery && list.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>
                            { t("extensions:develop.monitor.notifications.emptySearchResult.actionLabel") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("extensions:develop.monitor.notifications.emptySearchResult.title") }
                    subtitle={ [
                        t("extensions:develop.monitor.notifications.emptySearchResult.subtitle.0"),
                        t("extensions:develop.monitor.notifications.emptySearchResult.subtitle.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        } else if (filterQuery && list?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ clearAllFilters }>
                            { t("extensions:develop.monitor.notifications.emptyFilterResult.actionLabel") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("extensions:develop.monitor.notifications.emptyFilterResult.title") }
                    subtitle={ [
                        t("extensions:develop.monitor.notifications.emptyFilterResult.subtitle.0"),
                        t("extensions:develop.monitor.notifications.emptyFilterResult.subtitle.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-filter-placeholder` }
                />
            );
        } else if (list?.length === 0 && (!next || !previous) && !loading) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("extensions:develop.monitor.notifications.emptyResponse.title") }
                    subtitle={ [
                        t("extensions:develop.monitor.notifications.emptyResponse.subtitle.0") +
                        `${ LogsConstants.TIMERANGE_DROPDOWN_OPTIONS.find(
                            (el: {key: number; text: string; value: number;}) =>
                                el.value === lastAuditLogRequestTimeRange)?.text.toLowerCase()
                        }`,
                        t("extensions:develop.monitor.notifications.emptyResponse.subtitle.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-data-placeholder` }
                />
            );
        } else {
            return (
                <>
                    { (loading && showDelayMessage) && (
                        <div className="audit-logs-delay-message">
                            <Message
                                type="info"
                                compact
                                content={ t("extensions:develop.monitor.filter.delayMessage.text") }
                            />
                        </div>
                    ) }
                    <InfiniteScrollContainer
                        handleScroll={ handleScroll }
                        scrollRef={ scrollRef }
                        logs={ audiLogList }
                        loading={ loading }
                        rowHeight= { LogsConstants.LOG_ROW_HEIGHT }
                        logCount={ LogsConstants.LOG_FETCH_COUNT }
                        isPreviousEmpty = { isPreviousEmpty }
                        isNextEmpty = { isNextEmpty }
                        logType={ TabIndex.AUDIT_LOGS }
                        setSearchQuery = { handleFilter }
                        data-componentid={ componentId }
                    />
                </>
            );
        }
    };

    const resolveClearAllFilters = (): ReactElement => {
        if (filterQuery) {
            return (
                <LinkButton
                    basic
                    compact
                    primary={ false }
                    data-componentid={ `${ componentId }-clear-filter-button` }
                    onClick={ clearAllFilters }
                    disabled={ !filterQuery }
                >
                    {
                        t("extensions:develop.monitor.filter.topToolbar" +
                            ".buttons.clearFilters.label")
                    }
                </LinkButton>
            );
        }
    };

    const fetchLatestLogs = (): void => {
        if (timeRange !== -1) {
            const current: number = getDateTimeWithOffset(timeZone);

            setEndTime(current.toString());
            setStartTime((current - 3600*1000*timeRange).toString());
        }
        handleSearch();
    };

    const renderRefreshTime = (): ReactElement => {
        const isoDateString: string = new Date(Number(lastAuditLogRequestTime)).toISOString();

        return (
            <div className="logs-refresh-component">
                { showLastLogTime && (
                    <Hint icon="warning sign" popup compact warning>
                        { t("extensions:develop.monitor.filter.refreshMessage.tooltipText") }
                    </Hint>
                ) }
                <p>
                    { showLastLogTime &&
                        t("extensions:develop.monitor.filter.refreshMessage.text") +
                        getTimeFromTimestamp(isoDateString)
                    }
                </p>
            </div>
        );
    };

    /**
     * This function is used to determine the label value for filter text. For now, the only difference is with traceId
     * Since BE haven't changed requestId to traceId yet. So we need to have this mapper function not to confuse user.
     * This needs to be removed when the BE done the needed migrations from requestId to traceId
     * Check https://github.com/wso2-enterprise/asgardeo-product/issues/14970 for more info.
     *
     * @param filterValue - Raw filter value to get the mapped label
     */
    const getLabelTextForFilterPill = (filterValue: string): string => {
        if (filterValue === "requestId") {
            return "traceId";
        }

        return filterValue;
    };

    return (
        <div>
            { renderAuditLogContent() }
        </div>
    );
};


/**
 * Default props for the component.
 */
AuditLogsPage.defaultProps = {
    "data-componentid": "audit-logs"
};

export default AuditLogsPage;
