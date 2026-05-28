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

import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import React, {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { getMoesifDashboardInfo } from "../api/get-moesif-dashboard-info";
import { MoesifDashboardInfoInterface } from "../models/moesif-analytics";

/**
 * PostMessage event type constants used by the Moesif Embedded Canvas portal.
 */
const EMBEDDED_POST_MESSAGE_TYPES: {
    CANVAS_INIT: string;
    CANVAS_READY: string;
    ORG_LOAD_FINISHED: string;
    REFRESH_TOKEN: string;
    SCHEMA_GEN_FINISHED: string;
    SET_TOKEN: string;
} = {
    CANVAS_INIT: "CANVAS_INIT",
    CANVAS_READY: "CANVAS_READY",
    ORG_LOAD_FINISHED: "ORG_LOAD_FINISHED",
    REFRESH_TOKEN: "REFRESH_TOKEN",
    SCHEMA_GEN_FINISHED: "SCHEMA_GEN_FINISHED",
    SET_TOKEN: "SET_TOKEN"
};

/**
 * Interval (ms) between token refreshes. Moesif id_tokens expire in ~1 hour;
 * refresh every 50 minutes to keep the embedded canvas authenticated.
 */
const TOKEN_REFRESH_INTERVAL_MS: number = 50 * 60 * 1000;

/**
 * Props for the MoesifCanvasIframe component.
 */
interface MoesifCanvasIframeProps {
    /**
     * Unique identifier for the component (for testing).
     */
    "data-componentid"?: string;
    /**
     * Base URL of the Moesif Embedded Portal, e.g. `https://www.moesif.com`.
     * The iframe is loaded at `{embeddingDomain}/wrap/app/{orgId}-{appId}/canvas#auth=post`.
     */
    embeddingDomain: string;
}

/**
 * Renders the Moesif Canvas embedded dashboard inside an iframe.
 *
 * Handshake order (mirrors Canvas.jsx):
 *  1. Dashboard info (token, orgId, appId) fetched from tenant-mgt on mount.
 *  2. Static canvas template loaded from public assets.
 *  3. iframe.onLoad fires            → parent sends SET_TOKEN.
 *  4. iframe auths, loads orgs       → iframe sends ORG_LOAD_FINISHED (parent hides spinner).
 *  5. iframe Canvas component mounts → iframe sends CANVAS_READY.
 *  6. parent sends CANVAS_INIT with template → canvas renders.
 *
 * Steps 4 and 5 can arrive in either order. CANVAS_INIT is only sent after BOTH
 * ORG_LOAD_FINISHED AND CANVAS_READY are received, preventing dropped messages.
 */
const MoesifCanvasIframe: FunctionComponent<MoesifCanvasIframeProps> = (
    props: MoesifCanvasIframeProps
): ReactElement => {
    const { "data-componentid": componentId = "moesif-canvas-iframe", embeddingDomain } = props;

    const [ dashboardInfo, setDashboardInfo ] = useState<MoesifDashboardInfoInterface | null>(null);
    const [ template, setTemplate ] = useState<Record<string, unknown> | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string>("");
    const [ isIframeDomLoaded, setIsIframeDomLoaded ] = useState<boolean>(false);
    const [ hasAuthCompleted, setHasAuthCompleted ] = useState<boolean>(false);
    const [ isChildReady, setIsChildReady ] = useState<boolean>(false);

    const iframeRef: React.MutableRefObject<HTMLIFrameElement | null> = useRef<HTMLIFrameElement | null>(null);
    const isMounted: React.MutableRefObject<boolean> = useRef<boolean>(true);

    // Derive the allowed origin from embeddingDomain for postMessage security.
    const embeddedOrigin: string = embeddingDomain ? new URL(embeddingDomain).origin : "";

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * Fetches fresh dashboard info (token, orgId, appId) from the tenant-mgt service.
     */
    const fetchDashboardInfo: () => Promise<void> = useCallback(async (): Promise<void> => {
        try {
            const info: MoesifDashboardInfoInterface = await getMoesifDashboardInfo();

            if (!isMounted.current) {
                return;
            }

            setDashboardInfo(info);
        } catch (_err: unknown) {
            if (!isMounted.current) {
                return;
            }
            setError("Failed to load the analytics dashboard. Please try again later.");
            // setIsLoading(false);
        }
    }, []);

    /**
     * Sends SET_TOKEN to the Moesif iframe via postMessage.
     */
    const sendTokenToIframe: () => void = useCallback((): void => {
        if (iframeRef.current && dashboardInfo?.token && embeddedOrigin) {
            iframeRef.current.contentWindow?.postMessage(
                { type: EMBEDDED_POST_MESSAGE_TYPES.SET_TOKEN, token: dashboardInfo.token },
                embeddedOrigin
            );
        }
    }, [ dashboardInfo?.token, embeddedOrigin ]);

    /**
     * Sends CANVAS_INIT with the static canvas template to the iframe.
     */
    const sendCanvasInit: () => void = useCallback((): void => {
        if (iframeRef.current && template && embeddedOrigin) {
            iframeRef.current.contentWindow?.postMessage(
                {
                    type: EMBEDDED_POST_MESSAGE_TYPES.CANVAS_INIT,
                    template,
                    theme: {
                        "brandColor": "#FB7B45",
                        "brandTextColor": "#C13E00",
                        "chartColors": ["#FB7B45", "#FF9A6F"],
                        "navigation": { "type": "tabs", "showIcons": false }
                    }
                },
                embeddedOrigin
            );
        }
    }, [ template, embeddedOrigin ]);

    // Fetch dashboard info on mount and refresh periodically.
    useEffect(() => {
        if (!embeddingDomain) {
            setError("Moesif Embedded Portal URL is not configured.");
            setIsLoading(false);

            return;
        }

        fetchDashboardInfo();

        const intervalId: ReturnType<typeof setInterval> = setInterval(fetchDashboardInfo, TOKEN_REFRESH_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [ fetchDashboardInfo, embeddingDomain ]);

    // Fetch the static canvas template from the console's public assets on mount.
    useEffect(() => {
        const basename: string = AppConstants.getAppBasename() ? `/${ AppConstants.getAppBasename() }` : "";
        const templateUrl: string =
            `${ window.location.origin }${ basename }/resources/assets/canvas_wso2_identity_platform.json`;

        fetch(templateUrl)
            .then((res: Response) => res.json())
            .then((json: Record<string, unknown>) => {
                if (!isMounted.current) {
                    return;
                }
                setTemplate(json);
            })
            .catch(() => {
                // Non-fatal: canvas will render but without a preconfigured template.
            });
    }, []);

    // 1. Send SET_TOKEN when the iframe DOM is ready or when the token refreshes.
    useEffect(() => {
        if (isIframeDomLoaded && dashboardInfo?.token) {
            sendTokenToIframe();
        }
    }, [ dashboardInfo?.token, isIframeDomLoaded, sendTokenToIframe ]);

    // 2. Send CANVAS_INIT only when BOTH auth has completed AND child Canvas is mounted.
    //    Re-fires when the template changes so dashboards can be swapped live.
    useEffect(() => {
        if (hasAuthCompleted && isChildReady && template) {
            sendCanvasInit();
        }
    }, [ hasAuthCompleted, isChildReady, template, sendCanvasInit ]);

    // 3. Listen for postMessages from the Moesif Canvas iframe.
    useEffect(() => {
        if (!embeddedOrigin) {
            return;
        }

        const handleMessage: (event: MessageEvent) => void = (event: MessageEvent): void => {
            if (event.origin !== embeddedOrigin) {
                return;
            }
            switch (event.data?.type) {
                case EMBEDDED_POST_MESSAGE_TYPES.ORG_LOAD_FINISHED:
                    // Auth + org load done — reveal the iframe.
                    setHasAuthCompleted(true);

                    break;
                case EMBEDDED_POST_MESSAGE_TYPES.CANVAS_READY:
                    // Child Canvas component has mounted and its postMessage listener
                    // is attached — safe to send CANVAS_INIT without losing it to a
                    // mount race.
                    setIsChildReady(true);
                    setIsLoading(false);

                    break;
                case EMBEDDED_POST_MESSAGE_TYPES.REFRESH_TOKEN:
                    // Iframe requested a token refresh.
                    fetchDashboardInfo();

                    break;
                case EMBEDDED_POST_MESSAGE_TYPES.SCHEMA_GEN_FINISHED:
                case EMBEDDED_POST_MESSAGE_TYPES.SET_TOKEN:
                    // Not applicable / shouldn't be sent by Canvas — ignore.
                    break;

                default:
                    break;
            }
        };

        window.addEventListener("message", handleMessage);

        return () => window.removeEventListener("message", handleMessage);
    }, [ embeddedOrigin, fetchDashboardInfo ]);

    if (error) {
        return (
            <div
                data-componentid={ `${ componentId }-error` }
                style={ {
                    alignItems: "center",
                    display: "flex",
                    height: "60vh",
                    justifyContent: "center",
                    width: "100%"
                } }
            >
                <Typography color="error" variant="body1">
                    { error }
                </Typography>
            </div>
        );
    }

    const iframeSrc: string = dashboardInfo
        ? `${ embeddingDomain }/wrap/app/${ dashboardInfo.moesifOrgId }-${ dashboardInfo.moesifAppId }/canvas#auth=post`
        : "";

    return (
        <div
            data-componentid={ componentId }
            style={ { height: "100%", minHeight: "600px", position: "relative", width: "100%" } }
        >
            { (isLoading || !dashboardInfo) && (
                <div
                    data-componentid={ `${ componentId }-loader` }
                    style={ {
                        alignItems: "center",
                        backgroundColor: "rgb(255, 255, 255)",
                        display: "flex",
                        height: "100%",
                        justifyContent: "center",
                        left: 0,
                        position: "absolute",
                        top: 0,
                        width: "100%",
                        zIndex: 10
                    } }
                >
                    <CircularProgress size={ 40 } />
                </div>
            ) }
            { dashboardInfo && (
                <iframe
                    ref={ iframeRef }
                    data-componentid={ `${ componentId }-frame` }
                    src={ iframeSrc }
                    style={ {
                        border: "none",
                        height: "100%",
                        minHeight: "600px",
                        width: "100%"
                    } }
                    title="Moesif Analytics Dashboard"
                    onLoad={ () => {
                        setIsIframeDomLoaded(true);
                    } }
                />
            ) }
        </div>
    );
};

export default MoesifCanvasIframe;
