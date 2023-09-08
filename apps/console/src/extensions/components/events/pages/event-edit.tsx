/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import {
    DocumentationLink,
    EmphasizedSegment,
    PageLayout,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useMemo,
    useRef ,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
import {
    AppState,
    FeatureConfigInterface
} from "../../../../features/core";
import { ChoreoButton } from "../../shared/button/choreo-navigation-button";
import { updateEventConfigurations, useEventConfig } from "../api";
import { EventManagementConstants } from "../constants";
import {
    EventPublishingAPIResponseInterface,
    EventsConfigPageInterface,
    eventIconInterface
} from "../models";

const FORM_ID: string = "event-configuration-edit-form";

/**
 * Events Config page.
 *
 * @param props - Props injected to the component.
 * @returns Events config edit page component.
 */
const EventsEditPage: FunctionComponent<EventsConfigPageInterface> = (
    props : EventsConfigPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;
    const dispatch : Dispatch<any> = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const [ eventCategories, setEventCategories ] = useState<string[]>(undefined);
    const [ eventList , setEventList ] = useState<EventPublishingAPIResponseInterface[]>(undefined);
    const [ selectedEvents , setSelectedEvents ] = useState<string[]>(undefined);
    const [ isSubmitting , setIsSubmitting ] = useState<boolean>(undefined);
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes : string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const pageContextRef : MutableRefObject<HTMLElement> = useRef(null);
    const checkboxRef : MutableRefObject<HTMLElement> = useRef<HTMLElement>();

    const isReadOnly : boolean = useMemo(() => !hasRequiredScopes(
        featureConfig?.eventPublishing,
        featureConfig?.eventPublishing?.scopes?.update,
        allowedScopes
    ), [ featureConfig, allowedScopes ]);
    const {
        data: originalEventList,
        isLoading: isEventConfigFetchRequestLoading,
        error: eventConfigFetchRequestError
    } = useEventConfig();

    useEffect(() => {
        if (!originalEventList) {
            return;
        }
    }, [ originalEventList ]);

    /**
     * Displays the error banner when unable to fetch event configurations.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("extensions:develop.eventPublishing." +
                "notifications.getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.eventPublishing." +
                "notifications.getConfiguration.error.message")
            })
        );
    };

    // TODO: Remove duplicated setStates.
    // Derive the category list directly from the event list (Without using state).
    // https://github.com/wso2-enterprise/asgardeo-product/issues/16362
    useEffect(() => {
        if (!originalEventList) {
            return;
        }

        if (originalEventList instanceof IdentityAppsApiException) {
            handleRetrieveError();

            return;
        }

        if (eventConfigFetchRequestError){
            return;
        }

        setEventList(originalEventList);
        setEventList(originalEventList);

        const categories : string[] = [];
        const selectedEventsList : string[] = [];

        for (const eventType of originalEventList){
            if (!categories.includes(eventType.category)) {
                categories.push(eventType.category);
            }
            if (eventType.publish) {
                selectedEventsList.push(eventType.displayName);
            }
        }
        setSelectedEvents(selectedEventsList);
        setEventCategories(categories);
    },[ originalEventList ]);

    useEffect(() => {
        if (eventConfigFetchRequestError) {
            handleRetrieveError();
        }
    },[ eventConfigFetchRequestError ]);

    /**
     * Handles the event selection when checkboxes are ticked.
     */
    const handleEventChange = (values: Map<string, FormValue>) => {
        const events: string[] = values.get("events-configuration") as string[];

        setSelectedEvents(events);
    };

    /**
     * Displays the error banner when event configurations are updated.
     */
    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t("extensions:develop.eventPublishing." +
                "notifications.updateConfiguration.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("extensions:develop.eventPublishing." +
                "notifications.updateConfiguration.success.message")
            })
        );
    };

    /**
     * Displays the error banner when unable to update event configurations.
     */
    const handleUpdateError = (error: IdentityAppsApiException) => {
        const errorType : string = error.code === EventManagementConstants
            .EVENT_UPDATE_ACTIVE_SUBS_ERROR_CODE_BE ? "activeSubs" : "generic";

        dispatch(
            addAlert({
                description: t("extensions:develop.eventPublishing." +
                `notifications.updateConfiguration.error.${errorType}.description`),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.eventPublishing." +
                `notifications.updateConfiguration.error.${errorType}.message`)
            })
        );
    };

    /**
     * Handles updating the event configurations.
     */
    const handleSubmit = (values : Map<string, FormValue>) => {

        const events: string[] = values.get("events-configuration") as string[];

        const updatedEventList: EventPublishingAPIResponseInterface[] = [];

        for (const event of eventList) {

            let enabledEvent : EventPublishingAPIResponseInterface;

            try {
                enabledEvent= JSON.parse(JSON.stringify(event));
            } catch (ex: any) {
                return;
            }

            if (events.includes(event.displayName)) {
                enabledEvent.publish = true;
            } else {
                enabledEvent.publish = false;
            }
            updatedEventList.push(enabledEvent);
        }

        setIsSubmitting(true);
        updateEventConfigurations(updatedEventList)
            .then(() => {
                handleUpdateSuccess();
            })
            .catch((error: IdentityAppsApiException) => {
                handleUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Get events belonging to a given category.
     *
     * @param category - The event category.
     * @param eventList - The event configuration list.
     * @returns the events belonging to the given category.
     */
    const getEventsofCategory = (
        category : string,
        eventList : EventPublishingAPIResponseInterface[]
    ): eventIconInterface[] => {
        const eventsInCategory : eventIconInterface[] = [];

        for (const eventType of eventList){
            if (eventType.category == category) {

                const event : eventIconInterface = {
                    label: eventType.displayName,
                    value: eventType.displayName
                };

                eventsInCategory.push(event);
            }
        }

        return eventsInCategory;
    };

    const resolvePageDescription = () : ReactElement => {
        return (
            <div>
                <div style={ { whiteSpace: "pre-line" } }>
                    {
                        t("extensions:develop.eventPublishing.eventsConfiguration.subHeading")
                    }
                    <DocumentationLink
                        link={ getLink("develop.eventPublishing.learnMore") }
                    >
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </div>
                <br/>
                <div style={ { whiteSpace: "pre-line" } }>
                    {
                        t("extensions:develop.eventPublishing.eventsConfiguration.formHeading")
                    }
                </div>
            </div>
        );
    };

    /**
     * Renders the loading placeholder.
     */
    const renderLoadingPlaceholder = () => {
        return (
            <div data-componentid={ `${ componentId }-form-loading` }>
                {
                    [ ...Array(3) ].map((key: number) => {
                        return (
                            <Placeholder key={ key }>
                                <Placeholder.Line length="very short" />
                                <div>
                                    <Placeholder.Line length="long" />
                                    <Placeholder.Line length="medium" />
                                </div>
                            </Placeholder>
                        );
                    })
                }
            </div>
        );
    };

    return (
        <PageLayout
            title={ t("extensions:develop.eventPublishing.eventsConfiguration.heading") }
            description={ resolvePageDescription() }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ componentId }-form-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <Grid className={ "mt-2" } >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                { isEventConfigFetchRequestLoading 
                                    ? renderLoadingPlaceholder() 
                                    : (
                                        <Forms
                                            id={ FORM_ID }
                                            uncontrolledForm={ false }
                                            onSubmit={ handleSubmit }
                                        >
                                            {
                                                eventCategories?.map((category: string, index: number ) => {
                                                    return (
                                                        <div key={ index }>
                                                            <Text className="mb-1"> { category } </Text>
                                                            <Field
                                                                ref={ checkboxRef }
                                                                className="mb-3 ml-3"
                                                                name="events-configuration"
                                                                type="checkbox"
                                                                required={ false }
                                                                children= { getEventsofCategory(category,eventList) }
                                                                value= { selectedEvents }
                                                                readOnly={ isReadOnly }
                                                                enableReinitialize={ true }
                                                                listen={ (
                                                                    values: Map<string, FormValue>
                                                                ) => handleEventChange(values) }
                                                                data-componentid={ `${ category }-edit-section` }
                                                            />
                                                        </div>
                                                    );
                                                })
                                            }
                                            <Divider hidden />
                                            <Grid.Row columns={ 1 }>
                                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                    <Button
                                                        primary
                                                        type="submit"
                                                        size="small"
                                                        className="form-button"
                                                        data-componentid = { `${ componentId }-update-button` }
                                                        disabled={ isReadOnly }
                                                        loading={ isSubmitting }
                                                    >
                                                        { t("extensions:develop.eventPublishing." +
                                                "eventsConfiguration.form.updateButton") }
                                                    </Button>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Forms>
                                    )
                                }
                            </EmphasizedSegment>
                            { !isEventConfigFetchRequestLoading && (<ChoreoButton />) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
EventsEditPage.defaultProps = {
    "data-componentid": "events-config-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default EventsEditPage;
