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
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon, Input, Label } from "semantic-ui-react";
import { useGlobalContext } from "../../hooks/use-global-context";
import { useTranslations } from "../../hooks/use-translations";
import { resolveElementText } from "../../utils/i18n-utils";
import Hint from "../hint";

const ORG_HANDLE_SANITIZATION_REGEX = /^[^a-z]*|[^a-z0-9]/g;
const SAMPLE_ORG_HANDLE_DOMAIN_EXTENSION = ".com";
const ORG_HANDLE_MIN_LENGTH = 4;
const ORG_HANDLE_MAX_LENGTH = 30;
const ORG_HANDLE_FIRST_ALPHABET = /^[a-zA-Z0-9]/;
const ORG_HANDLE_ALPHANUMERIC = /^[a-z0-9._-]+$/;
const DEBOUNCE_DELAY_MS = 1000;

/**
 * Calls the configured organization handle availability endpoint via
 * `checkHandleUrl` and returns whether the handle is available.
 *
 * When the backend call isn't reachable or is unauthorized, the result is
 * flagged `uncertain` so callers can degrade gracefully.
 *
 * @param {string} checkHandleUrl
 * @param {string} orgHandle
 * @returns {Promise<{available: boolean, uncertain: boolean}>}
 */
const checkOrgHandleAvailability = async (checkHandleUrl, orgHandle) => {
    try {
        const response = await fetch(checkHandleUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ orgHandle })
        });

        if (!response.ok) {
            return { available: false, uncertain: true };
        }

        const data = await response.json();
        return { available: !!data.available, uncertain: false };
    } catch (error){
        return { available: false, uncertain: true };
    }
};

/**
 * Generate a random suffix and append it to the sanitized value.
 *
 * @param {string} sanitizedValue
 * @param {boolean} dotExtensionMandatory
 * @returns {string}
 */
const buildRandomHandle = (sanitizedValue, dotExtensionMandatory) => {
    const randomSuffix = Math.random().toString(36).substring(2, 5);
    const base = sanitizedValue + randomSuffix;
    return dotExtensionMandatory ? base + SAMPLE_ORG_HANDLE_DOMAIN_EXTENSION : base;
};

/**
 * Synchronous format-only validation (before the async duplicate check).
 *
 * @param {string} value
 * @returns {string} error message, or "" if valid.
 */
const getValidationError = (value) => {
    if (!value) return "";
    if (!ORG_HANDLE_FIRST_ALPHABET.test(value)) {
        return "Organization handle must start with a letter or number.";
    }
    if (value.length < ORG_HANDLE_MIN_LENGTH || value.length >= ORG_HANDLE_MAX_LENGTH) {
        return `Organization handle must be between ${ORG_HANDLE_MIN_LENGTH} and ${ORG_HANDLE_MAX_LENGTH - 1} characters.`;
    }
    if (!ORG_HANDLE_ALPHANUMERIC.test(value)) {
        return "Organization handle can only contain lowercase letters, numbers, hyphens, underscores, and dots.";
    }
    return "";
};

/**
 * OrgHandleFieldAdapter renders an editable org-handle field that is:
 *  - Auto-generated from the linked org-name field value (via `config.linkedTo`).
 *  - Editable by the user (with debounced duplicate check on manual change).
 *  - Shows inline validation status (first char, length, alphanumeric, unique).
 *
 * @param {{ component: object, formState: object, formStateHandler: function, fieldErrorHandler: function }} props
 */
const OrgHandleFieldAdapter = ({ component, formState, formStateHandler, fieldErrorHandler }) => {
    const {
        identifier,
        label,
        hint,
        linkedTo,
        dotExtensionMandatory = false
    } = component.config;

    const { contextData } = useGlobalContext();
    const { translations } = useTranslations();
    const checkHandleUrl = contextData && contextData.organizations
        ? contextData.organizations.checkHandleUrl
        : undefined;

    const [orgHandle, setOrgHandle] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    // True when availability couldn't be confirmed (endpoint unreachable/unauthorized).
    // We allow the value through but suppress the "unique" confirmation icon.
    const [isUncertain, setIsUncertain] = useState(false);
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);

    const debounceTimerRef = useRef(null);
    const requestIdRef = useRef(0);
    const hasManuallyEditedRef = useRef(false);

    useEffect(() => {
        return () => {
            requestIdRef.current += 1;
            clearTimeout(debounceTimerRef.current);
        };
    }, []);

    /**
     * Try to set an org handle, falling back to random suffixes if the
     * sanitized value is already taken (up to maxAttempts times).
     *
     * @param {string} sanitizedValue
     * @param {number} requestId
     * @param {number} maxAttempts
     * @param {number} currentAttempt
     */
    const tryWithRandomCharacters = useCallback(
        async (sanitizedValue, requestId, maxAttempts = 10, currentAttempt = 0) => {
            if (requestId !== requestIdRef.current) return;
            if (currentAttempt >= maxAttempts) {
                setError("Could not auto-generate a unique organization handle. Please enter one manually.");
                return;
            }
            const candidate = buildRandomHandle(sanitizedValue, dotExtensionMandatory);
            try {
                const result = await checkOrgHandleAvailability(checkHandleUrl, candidate);
                if (requestId !== requestIdRef.current) return;
                // Only keep searching when the candidate is *definitively* taken.
                // If availability is uncertain, accept it and let the server decide.
                if (result.available || result.uncertain) {
                    setOrgHandle(candidate);
                    setError("");
                    setIsDuplicate(false);
                    setIsUncertain(!!result.uncertain);
                    if (fieldErrorHandler) {
                        fieldErrorHandler(identifier, null);
                    }
                } else {
                    tryWithRandomCharacters(sanitizedValue, requestId, maxAttempts, currentAttempt + 1);
                }
            } catch (error) {
                if (requestId !== requestIdRef.current) return;
                tryWithRandomCharacters(sanitizedValue, requestId, maxAttempts, currentAttempt + 1);
            }
        },
        [ checkHandleUrl, dotExtensionMandatory, fieldErrorHandler, identifier ]
    );

    /**
     * Given a sanitized org name, check if it's available; if not, fall back
     * to random-character variants.
     *
     * @param {string} sanitizedValue
     * @param {number} requestId
     */
    const setAutoGeneratedOrgHandle = useCallback(
        async (sanitizedValue, requestId) => {
            const baseHandle = dotExtensionMandatory
                ? sanitizedValue + SAMPLE_ORG_HANDLE_DOMAIN_EXTENSION
                : sanitizedValue;
            try {
                const result = await checkOrgHandleAvailability(checkHandleUrl, baseHandle);
                if (requestId !== requestIdRef.current) return;
                if (result.available || result.uncertain) {
                    setOrgHandle(baseHandle);
                    setError("");
                    setIsDuplicate(false);
                    setIsUncertain(!!result.uncertain);
                    if (fieldErrorHandler) {
                        fieldErrorHandler(identifier, null);
                    }
                } else {
                    tryWithRandomCharacters(sanitizedValue, requestId);
                }
            } catch (error) {
                if (requestId !== requestIdRef.current) return;
                tryWithRandomCharacters(sanitizedValue, requestId);
            }
        },
        [ checkHandleUrl, dotExtensionMandatory, tryWithRandomCharacters, fieldErrorHandler, identifier ]
    );

    /**
     * Generate an org handle from the org name, mirroring the logic in
     * add-organization-modal.tsx#generateOrgHandle.
     *
     * @param {string} orgName
     * @param {number} requestId
     */
    const generateOrgHandleFromName = useCallback(
        (orgName, requestId) => {
            if (!orgName || orgName.trim() === "") {
                setOrgHandle("");
                setError("");
                setIsDuplicate(false);
                setIsUncertain(false);
                if (fieldErrorHandler) {
                    fieldErrorHandler(identifier, null);
                }
                return;
            }
            const sanitizedValue = orgName.trim().toLowerCase()
                .replace(ORG_HANDLE_SANITIZATION_REGEX, "");
            if (!sanitizedValue) {
                // Org name sanitized down to nothing (e.g. symbols/spaces only) —
                // reset instead of leaving a stale handle from a prior name on screen.
                setOrgHandle("");
                setError("");
                setIsDuplicate(false);
                setIsUncertain(false);
                if (fieldErrorHandler) {
                    fieldErrorHandler(identifier, null);
                }
                return;
            }
            setAutoGeneratedOrgHandle(sanitizedValue, requestId);
        },
        [ setAutoGeneratedOrgHandle, fieldErrorHandler, identifier ]
    );

    // Watch for org-name changes in formState (via linkedTo) and auto-generate.
    // Stops once the user has manually edited the handle, so their edit isn't
    // silently overwritten if they go back and tweak the organization name.
    useEffect(() => {
        if (!linkedTo || !formState || !checkHandleUrl || hasManuallyEditedRef.current) return;
        const orgName = formState && formState.values && formState.values[linkedTo]
            ? formState.values[linkedTo]
            : "";
        const requestId = ++requestIdRef.current;
        // Small debounce so it doesn't fire on every keystroke.
        const timer = setTimeout(() => {
            if (requestId !== requestIdRef.current) return;
            generateOrgHandleFromName(orgName, requestId);
        }, 400);
        return () => clearTimeout(timer);
    }, [ formState && formState.values ? formState.values[linkedTo] : undefined, checkHandleUrl ]);

    // Sync orgHandle value into formState.
    useEffect(() => {
        formStateHandler(identifier, orgHandle);
    }, [ orgHandle ]);

    const debouncedCheckValidity = useCallback(
        (value, requestId) => {
            clearTimeout(debounceTimerRef.current);
            if (!value) {
                setIsChecking(false);
                setIsDuplicate(false);
                return;
            }
            setIsChecking(true);
            debounceTimerRef.current = setTimeout(async () => {
                if (requestId !== requestIdRef.current) return;
                try {
                    const result = await checkOrgHandleAvailability(checkHandleUrl, value);
                    if (requestId !== requestIdRef.current) return;

                    if (result.uncertain) {
                        // Couldn't confirm availability — allow the value through but
                        // don't assert uniqueness. Only surface a format error, if any.
                        setIsUncertain(true);
                        setIsDuplicate(false);
                        const validationError = getValidationError(value);
                        setError(validationError);
                        if (fieldErrorHandler) {
                            fieldErrorHandler(identifier, validationError ? [validationError] : null);
                        }
                    } else {
                        setIsUncertain(false);
                        setIsDuplicate(!result.available);
                        if (!result.available) {
                            setError("This organization handle is already taken.");
                            if (fieldErrorHandler) {
                                fieldErrorHandler(identifier, ["This organization handle is already taken."]);
                            }
                        } else {
                            const validationError = getValidationError(value);
                            setError(validationError);
                            if (fieldErrorHandler) {
                                fieldErrorHandler(identifier, validationError ? [validationError] : null);
                            }
                        }
                    }
                } catch (error) {
                    // Ignore network errors silently.
                } finally {
                    if (requestId === requestIdRef.current) {
                        setIsChecking(false);
                    }
                }
            }, DEBOUNCE_DELAY_MS);
        },
        [ checkHandleUrl, identifier, fieldErrorHandler ]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        // Invalidate older generation and validation requests before accepting the new input.
        const requestId = ++requestIdRef.current;
        hasManuallyEditedRef.current = true;
        setOrgHandle(value);
        setTouched(true);
        setIsUncertain(false);

        const formatError = getValidationError(value);
        setError(formatError);

        if (formatError) {
            setIsChecking(false);
            setIsDuplicate(false);
            clearTimeout(debounceTimerRef.current);
            if (fieldErrorHandler) {
                fieldErrorHandler(identifier, [formatError]);
            }
        } else if (checkHandleUrl) {
            // Format is valid; clear any prior error and let the debounced
            // availability check re-assert a duplicate error if needed.
            if (fieldErrorHandler) {
                fieldErrorHandler(identifier, null);
            }
            debouncedCheckValidity(value, requestId);
        } else {
            setIsChecking(false);
            setIsDuplicate(false);
            if (fieldErrorHandler) {
                fieldErrorHandler(identifier, null);
            }
        }
    };

    const handleBlur = () => {
        setTouched(true);
        const validationError = getValidationError(orgHandle);
        if (validationError) {
            setError(validationError);
            fieldErrorHandler(identifier, [validationError]);
        }
    };

    const criteriaStatus = useMemo(() => ({
        firstAlphabet: !orgHandle ? "neutral" : ORG_HANDLE_FIRST_ALPHABET.test(orgHandle) ? "pass" : "fail",
        length: !orgHandle
            ? "neutral"
            : orgHandle.length >= ORG_HANDLE_MIN_LENGTH && orgHandle.length < ORG_HANDLE_MAX_LENGTH
                ? "pass"
                : "fail",
        alphanumeric: !orgHandle ? "neutral" : ORG_HANDLE_ALPHANUMERIC.test(orgHandle) ? "pass" : "fail",
        // Neutral while checking or when availability couldn't be confirmed —
        // don't assert a green "unique" state we can't stand behind.
        unique: !orgHandle || isChecking || isUncertain ? "neutral" : isDuplicate ? "fail" : "pass"
    }), [orgHandle, isChecking, isUncertain, isDuplicate]);

    const renderStatusIcon = (status) => {
        if (status === "pass") return <Icon name="check circle" color="green" />;
        if (status === "fail") return <Icon name="remove circle" color="red" />;
        return <Icon name="circle" className="validation-icon" />;
    };

    const uniqueIconName = criteriaStatus.unique === "fail"
        ? "remove"
        : criteriaStatus.unique === "pass"
            ? "check"
            : null;

    const resolvedLabel = resolveElementText(translations, label) || "Organization Handle";

    return (
        <>
            <label htmlFor={identifier}>{resolvedLabel}</label>
            <Input
                fluid
                id={identifier}
                name={identifier}
                value={orgHandle}
                onChange={handleChange}
                onBlur={handleBlur}
                loading={isChecking}
                error={touched && !!error}
                placeholder="e.g. acmecorp"
                icon={uniqueIconName || undefined}/>
            {touched && error && (
                <Label basic color="red" pointing>
                    {error}
                </Label>
            )}
            {hint && <Hint hint={hint} />}
            <div className="org-handle-validation-criteria" style={{ marginTop: "0.5em", fontSize: "0.85em" }}>
                <div>{renderStatusIcon(criteriaStatus.firstAlphabet)} Must start with a letter or number</div>
                <div>{renderStatusIcon(criteriaStatus.length)} Must be {ORG_HANDLE_MIN_LENGTH}–{ORG_HANDLE_MAX_LENGTH - 1} characters</div>
                <div>{renderStatusIcon(criteriaStatus.alphanumeric)} Only lowercase letters, numbers, hyphens, underscores, dots</div>
                <div>{renderStatusIcon(criteriaStatus.unique)} Must be unique</div>
            </div>
        </>
    );
};

OrgHandleFieldAdapter.propTypes = {
    component: PropTypes.object.isRequired,
    fieldErrorHandler: PropTypes.func,
    formState: PropTypes.object,
    formStateHandler: PropTypes.func.isRequired
};

export default OrgHandleFieldAdapter;
