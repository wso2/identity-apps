/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Popup } from "@wso2is/react-components";
import React, { MutableRefObject, ReactElement, UIEventHandler, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, Icon } from "semantic-ui-react";
import CopyButton from "./copy-button";
import LoaderPlaceholder from "./loader-placeholder";
import { InterfaceDiagnosticLogEntry, InterfaceLogsFilter } from "../models";
import { formatTimestampToDateTime, getDateFromTimestamp, getTimeFromTimestamp } from "../utils/datetime-utils";

interface InfiniteScrollContainerPropsInterface
    extends IdentifiableComponentInterface {
    handleScroll: UIEventHandler<HTMLDivElement>,
    scrollRef: MutableRefObject<HTMLDivElement>,
    logs: InterfaceDiagnosticLogEntry[] | [],
    loading: boolean,
    rowHeight: number,
    logCount: number,
    isPreviousEmpty?: boolean,
    isNextEmpty?: boolean,
    setSearchQuery?: (query: InterfaceLogsFilter) => void
}

/**
 * Infinite scrolling component for diagnostic logs
 * @param props - InfiniteScrollContainer props
 * @returns React functional component
 */
const InfiniteScrollContainer = (props: InfiniteScrollContainerPropsInterface): ReactElement => {
    const {
        ["data-componentid"]: componentId,
        handleScroll,
        scrollRef,
        logs,
        loading,
        rowHeight,
        logCount,
        setSearchQuery
    } = props;

    const { t } = useTranslation();
    const [ activeIndex, setActiveIndex ] = useState<number[]>([ -1 ]);

    useEffect(() => {
        /**
         * scroll the container to the first log
         */
        if (logs.length > 0 && logs.length <= logCount) {
            scrollRef.current.scrollTop = rowHeight * (logCount - (logCount-1));
        }
        /**
         * Collapse detailed log view
         */
        setActiveIndex([ -1 ]);
    }, [ logs ]);

    const handleClick = (e: React.MouseEvent<HTMLElement>, titleProps: any) => {
        const { index } = titleProps;
        let tempIndexArr: number[];

        if (activeIndex.indexOf(index) > -1) {
            tempIndexArr = activeIndex.filter((i: number) => i !== index);
        } else {
            tempIndexArr = [ ...activeIndex, index ];
        }

        setActiveIndex(tempIndexArr);
    };

    const handleExpandedView = (logObject: InterfaceDiagnosticLogEntry): Array<ReactElement> => {
        const propertyElements: Array<ReactElement> = [];

        for (const property in logObject) {
            if (property === "id" || property === "componentId") continue;
            if (logObject[property]) {
                if (typeof logObject[property] === "string") {
                    if (property === "recordedAt") {
                        propertyElements.push(
                            <tr>
                                <td className="log-property">{ property }:</td>
                                <td>
                                    { formatTimestampToDateTime(logObject[property]) }
                                </td>
                            </tr>
                        );
                    } else if (property === "resultStatus") {
                        propertyElements.push(
                            <tr>
                                <td className="log-property">{ property }:</td>
                                <td>
                                    { logObject[property] }
                                </td>
                            </tr>
                        );
                    } else if (property === "requestId") {
                        propertyElements.push(
                            <tr>
                                <td className="log-property">traceId:</td>
                                <td>
                                    <Popup
                                        trigger={ <span>{ logObject[property].slice(0,32) }</span> }
                                        content={ <small>{ logObject[property] }</small> }
                                    />
                                    ...&nbsp;&nbsp;
                                    <Icon.Group
                                        className="icon-button"
                                        onClick={ () => {
                                            setSearchQuery({ property: "traceId", value: logObject[property] });
                                        } }
                                    >
                                        <Icon name="filter" color="green" />
                                        <Icon corner name="add" color="green" />
                                    </Icon.Group>
                                    <CopyButton value={ logObject[property] } />
                                </td>
                            </tr>
                        );
                    }
                    else {
                        propertyElements.push(
                            <tr>
                                <td className="log-property">{ property }:</td>
                                <td>
                                    { logObject[property] }
                                    &nbsp;&nbsp;
                                    <Icon.Group
                                        className="icon-button"
                                        onClick={ () => {
                                            setSearchQuery({ property: property, value: logObject[property] });
                                        } }
                                    >
                                        <Icon name="filter" color="green" />
                                        <Icon corner name="add" color="green" />
                                    </Icon.Group>
                                </td>
                            </tr>
                        );
                    }
                } else if (typeof logObject[property] === "object") {
                    for (const childProp in logObject[property])
                        if (typeof logObject[property][childProp] === "string") {
                            propertyElements.push(
                                <tr>
                                    <td className="log-property">{ childProp }:</td>
                                    <td>
                                        { logObject[property][childProp] }
                                        &nbsp;&nbsp;
                                        <Icon.Group
                                            className="icon-button"
                                            onClick={ () => {
                                                setSearchQuery({
                                                    property: childProp, value: logObject[property][childProp]
                                                });
                                            } }
                                        >
                                            <Icon name="filter" color="green" />
                                            <Icon corner name="add" color="green" />
                                        </Icon.Group>
                                    </td>
                                </tr>
                            );
                        } else {
                            propertyElements.push(
                                <tr>
                                    <td className="log-property">{ childProp }:</td>
                                    <td>{ JSON.stringify(logObject[property][childProp], null, 10) }</td>
                                </tr>
                            );
                        }
                }
            }
        }

        return propertyElements;
    };

    return (
        <div
            className="main-container"
            data-componentid={ `${componentId}-main-container` }
        >
            <div
                className="ui fluid container scroll-container"
                onScroll={ handleScroll }
                ref={ scrollRef }
            >
                <div className="edge-container"></div>
                { loading && (
                    <LoaderPlaceholder />
                ) }
                <Accordion data-componentid={ `${componentId}-log-entries-wrapper` } exclusive={ false } fluid>
                    { logs.map((log: InterfaceDiagnosticLogEntry, key: number) => (
                        <div key={ key }>
                            <Accordion.Title
                                active={ activeIndex.includes(key) }
                                index={ key }
                                onClick={ handleClick }
                                style={ { padding: "0px" } }
                            >
                                <div className="log-row">
                                    <Icon name="dropdown" />
                                    <div className="log-time-container">
                                        { getDateFromTimestamp(log.recordedAt) }
                                        <span className="log-time">
                                            &nbsp;|&nbsp;
                                            { getTimeFromTimestamp(log.recordedAt) }
                                        </span>
                                    </div>
                                    <div className="log-description-container">
                                        <div className="log-message-container">
                                            { log.resultStatus === "SUCCESS" &&
                                                <Icon name="check circle" color="green" />
                                            }
                                            { log.resultStatus === "FAILED" &&
                                                <Icon name="close" color="red" />
                                            }
                                            { log.actionId === "auth-script-logging" &&
                                                <Icon name="code" />
                                            }
                                            {
                                                log.resultMessage.length > 60 ? (
                                                    <Popup
                                                        inverted
                                                        trigger={
                                                            <span>{ `${log.resultMessage.slice(0,60)}...` }</span>
                                                        }
                                                        content={ (
                                                            <small>
                                                                {
                                                                    t("extensions:develop.monitor.logView." +
                                                                        "toolTips.seeMore")
                                                                }
                                                            </small>
                                                        ) }
                                                        position="bottom right"
                                                        size="mini"
                                                    />
                                                ) : log.resultMessage
                                            }
                                        </div>
                                        { log.actionId && (
                                            <div className="log-actionid-container">
                                                { log.actionId }
                                            </div>
                                        ) }
                                    </div>
                                </div>
                            </Accordion.Title>
                            <Accordion.Content active={ activeIndex.includes(key) }>
                                { handleExpandedView(log).map((el: ReactElement, key: number) => (
                                    <table className="log-expanded-view" key={ key }>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { el }
                                        </tbody>
                                    </table>
                                )) }
                            </Accordion.Content>
                        </div>
                    )) }
                </Accordion>
                { loading && (
                    <LoaderPlaceholder />
                ) }
                <div className="edge-container"></div>
            </div>
        </div>
    );
};

export default InfiniteScrollContainer;
