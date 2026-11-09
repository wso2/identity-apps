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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStepData } from "../../hooks/use-step-data";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import { getStepDataValue, resolvePlaceholders } from "../../utils/placeholder-utils";
import "./qr-code-field-adapter.css";

const DEFAULT_SIZE = 220;
const MIN_SIZE = 96;
const MAX_SIZE = 480;
// Error correction level of the QR code generator (1 = L, 2 = M, 3 = Q, 4 = H).
const ERROR_CORRECTION_LEVEL = 2;
// Light modules around the code, as the QR code specification asks.
const QUIET_ZONE_MODULES = 4;
// Bytes the generator fits at the error correction level above (version 40); it truncates longer data.
const MAX_DATA_LENGTH = 2331;

/**
 * Checks that the generator can encode the text: it takes each character as one byte and truncates data that does
 * not fit.
 *
 * @param {string} text - The text to encode.
 * @returns {boolean} Whether the text can be encoded.
 */
const isEncodable = (text) => {
    if (text.length > MAX_DATA_LENGTH) {
        return false;
    }

    for (let index = 0; index < text.length; index++) {
        if (text.charCodeAt(index) > 127) {
            return false;
        }
    }

    return true;
};

/**
 * Builds the QR code modules with the generator the page loads (js/qrCodeGenerator.js).
 *
 * @param {string} text - The text to encode.
 * @returns {{ frame: number[], width: number } | null} The modules, row by row, or null without the generator.
 */
const generateQRFrame = (text) => {
    if (typeof window.genframe !== "function") {
        return null;
    }

    const previousLevel = window.ecclevel;

    try {
        window.ecclevel = ERROR_CORRECTION_LEVEL;
        // The generator reuses its buffer, so copy it.
        const frame = window.genframe(text).slice(0);

        return { frame, width: window.width };
    } finally {
        window.ecclevel = previousLevel;
    }
};

/**
 * Shows a QR code of `config.data`. Placeholders such as {{qrCodeData}} are read from the step's additional data.
 */
const QRCodeFieldAdapter = ({ component }) => {
    const { config } = component;
    const stepData = useStepData();
    const { translations } = useTranslations();
    const canvasRef = useRef(null);
    const [ hasError, setHasError ] = useState(false);

    const data = useMemo(() => {
        const resolved = resolvePlaceholders(config?.data || "", [ (key) => getStepDataValue(stepData, key) ]);

        // A placeholder the step did not send leaves nothing to encode.
        return resolved && !/\{\{[^}]+\}\}/.test(resolved) ? resolved : "";
    }, [ config?.data, stepData ]);

    const size = useMemo(() => {
        const parsed = parseInt(config?.size, 10);

        return isNaN(parsed) ? DEFAULT_SIZE : Math.min(Math.max(parsed, MIN_SIZE), MAX_SIZE);
    }, [ config?.size ]);

    useEffect(() => {
        if (!data || !canvasRef.current) {
            return;
        }

        if (!isEncodable(data)) {
            // eslint-disable-next-line no-console
            console.error("The QR code data can not be encoded.");
            setHasError(true);

            return;
        }

        try {
            const qr = generateQRFrame(data);

            if (!qr) {
                // eslint-disable-next-line no-console
                console.error("The QR code generator is not loaded.");
                setHasError(true);

                return;
            }

            const modules = qr.width + QUIET_ZONE_MODULES * 2;
            const moduleSize = Math.max(Math.floor(size / modules), 1);
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            canvas.width = modules * moduleSize;
            canvas.height = modules * moduleSize;
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "#000000";

            for (let x = 0; x < qr.width; x++) {
                for (let y = 0; y < qr.width; y++) {
                    if (qr.frame[y * qr.width + x]) {
                        context.fillRect((QUIET_ZONE_MODULES + x) * moduleSize,
                            (QUIET_ZONE_MODULES + y) * moduleSize, moduleSize, moduleSize);
                    }
                }
            }
            setHasError(false);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Unable to draw the QR code.", error);
            setHasError(true);
        }
    }, [ data, size ]);

    if (!data) {
        return null;
    }

    return (
        <div className="qr-code-container" data-componentid={ `qr-code-${ component.id }` }>
            { hasError && (
                <div className="ui warning message qr-code-error">
                    { resolveElementText(translations, "{{qr.code.error.generate}}") }
                </div>
            ) }
            <canvas
                ref={ canvasRef }
                className="qr-code-canvas"
                role="img"
                aria-label={ resolveElementText(translations, "{{qr.code.label}}") }
                style={ { display: hasError ? "none" : "block", height: `${ size }px`, width: `${ size }px` } }
            />
        </div>
    );
};

QRCodeFieldAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            data: PropTypes.string,
            size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
        }).isRequired,
        id: PropTypes.string
    }).isRequired
};

export default QRCodeFieldAdapter;
