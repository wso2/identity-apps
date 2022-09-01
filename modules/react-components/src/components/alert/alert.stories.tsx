/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 *
 */

import { AlertLevels } from "@wso2is/core/models";
import React, { ReactElement, useState } from "react";
import { Alert } from "./alert";
import { meta } from "./alert.stories.meta";

export default {
    parameters: {
        component: Alert,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Alert"
};

/**
 * Story to display all the alert variations.
 *
 * @return {React.ReactElement}
 */
export const AllAlertVariations = (): ReactElement => {
    const [ alertSystem, setAlertSystem ] = useState(null);

    const handleAlertSystemInitialize = (system) => {
        setAlertSystem(system);
    };

    return (
        <>
            <Alert
                absolute={ true }
                dismissInterval={ 100000 }
                alertsPosition="br"
                alertSystem={ alertSystem }
                alert={ {
                    description: "This is a success message.",
                    level: AlertLevels.SUCCESS,
                    message: "Success Message"
                } }
                onAlertSystemInitialize={ handleAlertSystemInitialize }
                withIcon={ true }
            />
            <Alert
                absolute={ true }
                dismissInterval={ 100000 }
                alertsPosition="br"
                alertSystem={ alertSystem }
                alert={ {
                    description: "This is an error message.",
                    level: AlertLevels.ERROR,
                    message: "Error Message"
                } }
                onAlertSystemInitialize={ handleAlertSystemInitialize }
                withIcon={ true }
            />
            <Alert
                absolute={ true }
                dismissInterval={ 100000 }
                alertsPosition="br"
                alertSystem={ alertSystem }
                alert={ {
                    description: "This is a warning message.",
                    level: AlertLevels.WARNING,
                    message: "Warning Message"
                } }
                onAlertSystemInitialize={ handleAlertSystemInitialize }
                withIcon={ true }
            />
            <Alert
                absolute={ true }
                dismissInterval={ 100000 }
                alertsPosition="br"
                alertSystem={ alertSystem }
                alert={ {
                    description: "This is an info message.",
                    level: AlertLevels.INFO,
                    message: "Warning Message"
                } }
                onAlertSystemInitialize={ handleAlertSystemInitialize }
                withIcon={ true }
            />
        </>
    );
};

AllAlertVariations.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display a success alert.
 *
 * @return {React.ReactElement}
 */
export const SuccessAlert = (): ReactElement => {
    const [ alertSystem, setAlertSystem ] = useState(null);

    const handleAlertSystemInitialize = (system) => {
        setAlertSystem(system);
    };

    return (
        <Alert
            absolute={ true }
            dismissInterval={ 100000 }
            alertsPosition="br"
            alertSystem={ alertSystem }
            alert={ {
                description: "This is a success message.",
                level: AlertLevels.SUCCESS,
                message: "Success Message"
            } }
            onAlertSystemInitialize={ handleAlertSystemInitialize }
            withIcon={ true }
        />
    );
};

SuccessAlert.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display an error alert.
 *
 * @return {React.ReactElement}
 */
export const ErrorAlert = (): ReactElement => {
    const [ alertSystem, setAlertSystem ] = useState(null);

    const handleAlertSystemInitialize = (system) => {
        setAlertSystem(system);
    };

    return (
        <Alert
            absolute={ true }
            dismissInterval={ 100000 }
            alertsPosition="br"
            alertSystem={ alertSystem }
            alert={ {
                description: "This is an error message.",
                level: AlertLevels.ERROR,
                message: "Error Message"
            } }
            onAlertSystemInitialize={ handleAlertSystemInitialize }
            withIcon={ true }
        />
    );
};

ErrorAlert.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to display a warning alert.
 *
 * @return {React.ReactElement}
 */
export const WarningAlert = (): ReactElement => {
    const [ alertSystem, setAlertSystem ] = useState(null);

    const handleAlertSystemInitialize = (system) => {
        setAlertSystem(system);
    };

    return (
        <Alert
            absolute={ true }
            dismissInterval={ 100000 }
            alertsPosition="br"
            alertSystem={ alertSystem }
            alert={ {
                description: "This is a warning message.",
                level: AlertLevels.WARNING,
                message: "Warning Message"
            } }
            onAlertSystemInitialize={ handleAlertSystemInitialize }
            withIcon={ true }
        />
    );
};

WarningAlert.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};

/**
 * Story to display an info alert.
 *
 * @return {React.ReactElement}
 */
export const InfoAlert = (): ReactElement => {
    const [ alertSystem, setAlertSystem ] = useState(null);

    const handleAlertSystemInitialize = (system) => {
        setAlertSystem(system);
    };

    return (
        <Alert
            absolute={ true }
            dismissInterval={ 100000 }
            alertsPosition="br"
            alertSystem={ alertSystem }
            alert={ {
                description: "This is an info message.",
                level: AlertLevels.INFO,
                message: "Info Message"
            } }
            onAlertSystemInitialize={ handleAlertSystemInitialize }
            withIcon={ true }
        />
    );
};

InfoAlert.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description
        }
    }
};
