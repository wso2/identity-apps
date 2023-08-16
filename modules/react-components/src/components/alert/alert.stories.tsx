/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertLevels } from "@wso2is/core/models";
import React, { ReactElement, useState } from "react";
import { Alert } from "./alert";
import { meta } from "./alert.stories.meta";
import { STORYBOOK_HIERARCHY } from "../../storybook-helpers/hierarchy";

export default {
    component: Alert,
    title: STORYBOOK_HIERARCHY.ALERT
};

/**
 * Story to display all the alert variations.
 *
 * @returns Story.
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
 * @returns Story.
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
 * @returns Story.
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
 * @returns Story.
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
 * @returns Story.
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
