/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

// Disabling max-line-length for this file as it contains SVGs.
/* eslint-disable max-len */

import { Variants, motion } from "framer-motion";
import React, {
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";

interface AIBotAnimatedProps {
    shouldAnimate?: boolean;
}

const AIBotAnimatedWithBackGround = (props: AIBotAnimatedProps): ReactElement => {

    const {
        shouldAnimate
    } = props;

    const variants: Variants = {
        botAnimation: {
            rotate: 0,
            transition: {
                delay: 0.3,
                duration: 6,
                repeat: Infinity,
                repeatDelay: 0.2,
                repeatType: "reverse"
            },
            y: [ 0, 12 ]
        },
        iconAnimation: {
            rotate: [ 0, 360 ],
            transition: {
                delay: 0.5,
                duration: 10,
                repeat: Infinity,
                repeatDelay: 0.5,
                repeatType: "loop",
                type: "spring"
            }
        }
    };

    return (
        <>
            <svg
                className="ai-loading-screen-animation"
                width="728"
                height="500"
                viewBox="0 0 728 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <AIBotBackground />
                <g id="ai-bot-illustration">
                    <motion.g
                        id="ai-bot-icons"
                        animate="iconAnimation"
                        variants={ variants }
                    >
                        <AnimatedIcon>
                            <AnimatedMessageIcon />
                        </AnimatedIcon>
                        <AnimatedIcon>
                            <AnimatedCodeWindowIcon />
                        </AnimatedIcon>
                        <AnimatedIcon>
                            <AnimatedDBIcon />
                        </AnimatedIcon>
                        <AnimatedIcon>
                            <AnimatedBoxIcon />
                        </AnimatedIcon>
                        <AnimatedIcon>
                            <AnimatedHourGlassIcon />
                        </AnimatedIcon>
                        <AnimatedIcon>
                            <AnimatedCogWheelIcon />
                        </AnimatedIcon>
                    </motion.g>
                    <motion.g
                        id="ai-bot"
                        animate="botAnimation"
                        variants={ variants }
                    >
                        <AnimatedHead shouldAnimate={ shouldAnimate } />
                        <AnimatedTorso />
                    </motion.g>
                </g>
                <defs>
                    <linearGradient
                        id="paint0_linear_3948_1292"
                        x1="255"
                        y1="69.6272"
                        x2="263.856"
                        y2="104.051"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF9D44" />
                        <stop offset="1" stopColor="#F5C58D" />
                    </linearGradient>
                    <linearGradient
                        id="paint1_linear_3948_1292"
                        x1="346.518"
                        y1="151.441"
                        x2="346.518"
                        y2="180.89"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF9D44" />
                        <stop offset="1" stopColor="#F5C58D" />
                    </linearGradient>
                    <linearGradient
                        id="paint2_linear_3948_1292"
                        x1="131.25"
                        y1="57.0583"
                        x2="131.25"
                        y2="86.5896"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF9D44" />
                        <stop offset="1" stopColor="#F5C58D" />
                    </linearGradient>
                    <linearGradient
                        id="paint3_linear_3948_1292"
                        x1="105.832"
                        y1="281.659"
                        x2="112.881"
                        y2="319.081"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF9D44" />
                        <stop offset="1" stopColor="#F5C58D" />
                    </linearGradient>
                    <linearGradient
                        id="paint4_linear_3948_1292"
                        x1="70.9843"
                        y1="154.984"
                        x2="70.9843"
                        y2="187.052"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF9D44" />
                        <stop offset="1" stopColor="#F5C58D" />
                    </linearGradient>
                    <linearGradient
                        id="paint5_linear_3948_1292"
                        x1="55.4523"
                        y1="181.04"
                        x2="55.4523"
                        y2="199.078"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF9D44" />
                        <stop offset="1" stopColor="#F5C58D" />
                    </linearGradient>
                    <linearGradient
                        id="paint6_linear_3948_1292"
                        x1="287.932"
                        y1="306.304"
                        x2="287.932"
                        y2="345.387"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF9D44" />
                        <stop offset="1" stopColor="#F5C58D" />
                    </linearGradient>
                    <linearGradient
                        id="paint7_linear_3948_1292"
                        x1="208.268"
                        y1="205.09"
                        x2="208.268"
                        y2="277.344"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F67149" />
                        <stop offset="1" stopColor="#F05D58" />
                    </linearGradient>
                    <linearGradient
                        id="paint8_linear_3948_1292"
                        x1="208.268"
                        y1="205.09"
                        x2="208.268"
                        y2="277.344"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FCA959" />
                        <stop offset="1" stopColor="#FFB669" />
                    </linearGradient>
                    <linearGradient
                        id="paint9_linear_3948_1292"
                        x1="208.268"
                        y1="158.041"
                        x2="208.268"
                        y2="221.893"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FCA959" />
                        <stop offset="1" stopColor="#FFB669" />
                    </linearGradient>
                    <linearGradient
                        id="paint10_linear_3948_1292"
                        x1="209.27"
                        y1="120.912"
                        x2="209.27"
                        y2="201.082"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F75857" />
                        <stop offset="1" stopColor="#FF805B" />
                    </linearGradient>
                </defs>
            </svg>
        </>
    );
};

const AIBotBackground = (): ReactElement => {
    const variants: Variants = {
        animate: {
            d: "M 346 62 C 288 43 251 26 162 47 C 69 73 57 121 29 183 C 7 260 38.2351 317.396 93 341 C 141 352 157.434 450.013 276.75 393.12 C 396.067 336.228 394 429 544 375 C 690 310 678 189 640 138 C 524.66 29.1796 532 130 409 83 Z"
        },
        initial: {
            d: "M392.977 13.9464C302.035 -8.72303 239.862 -0.914526 155.959 22.3894C72.0554 45.6932 15.8244 91.819 2.35496 150.717C-11.1611 209.513 38.2351 287.396 65.6669 329.308C93.1398 371.066 157.434 420.013 276.75 363.12C396.067 306.228 389.659 344.301 488.403 305.249C587.147 266.197 574.867 148.208 561.846 103.181C524.66 -0.820409 483.918 36.6159 392.977 13.9464Z"
        }
    };

    return (
        <g>
            <motion.path
                opacity="0.06"
                initial="initial"
                animate="animate"
                variants={ variants }
                transition={ {
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                } }
                fill="url(#paint0_linear_3568_6057)"
            />
            <defs>
                <linearGradient id="paint0_linear_3568_6057" x1="413.377" y1="-27.8262" x2="152.311" y2="397.647" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EE575C" />
                    <stop offset="1" stopColor="#F67147" />
                </linearGradient>
            </defs>
        </g>
    );
};

const AnimatedHead = (props: AIBotAnimatedProps): ReactElement => {

    const {
        shouldAnimate
    } = props;

    const variants: Variants = {
        botAnimation: {
            rotate: 0,
            transition: {
                delay: 0.3,
                duration: 3,
                repeat: Infinity,
                repeatDelay: 0.5,
                repeatType: "reverse",
                type: "tween"
            },
            y: [ -5, 5 ]
        }
    };

    return (
        <motion.g
            id="bot-head"
            variants={ variants }
        >
            <g id="bot-headphones">
                <rect id="Rectangle 234" x="137.121" y="150.976" width="143.296" height="29.0615" rx="14.5307" fill="#506271" />
                <path
                    id="Rectangle 232"
                    d="M271.398 168.513V148.051C271.398 136.446 263.094 126.503 251.674 124.435L245.541 123.325C222.092 119.078 198.072 119.057 174.616 123.262L167.909 124.464C156.47 126.514 148.144 136.466 148.144 148.087V160.979"
                    stroke="#4F6170"
                    strokeWidth="2"
                    strokeLinecap="round" />
            </g>
            <g id="bot-face">
                <path
                    id="Rectangle 235"
                    d="M150.147 151.534C150.147 139.928 158.454 129.984 169.875 127.918L173.394 127.281C196.678 123.069 220.526 123.022 243.827 127.142L248.571 127.981C260.036 130.009 268.392 139.972 268.392 151.615V172.863C268.392 185.07 259.229 195.332 247.1 196.709L245.121 196.934C220.852 199.69 196.347 199.659 172.085 196.84L171.378 196.758C159.276 195.352 150.147 185.102 150.147 172.918V151.534Z"
                    fill="url(#paint10_linear_3948_1292)" />
                <g id="bot-face-inner">
                    <rect id="Rectangle 233" x="166.181" y="147.969" width="85.1758" height="34.0721" rx="17.036" fill="#F9B671" />
                    <AnimatedBotEyes shouldAnimate={ shouldAnimate } />
                </g>
            </g>
        </motion.g>
    );

};

const AnimatedBotEyes = (props: AIBotAnimatedProps): ReactElement => {
    const { shouldAnimate } = props;

    const leftEyeRef: MutableRefObject<SVGGElement> = useRef(null);
    const rightEyeRef: MutableRefObject<SVGGElement> = useRef(null);
    const [ leftPupilPosition, setLeftPupilPosition ] = useState({ x: 0, y: 0 });
    const [ rightPupilPosition, setRightPupilPosition ] = useState({ x: 0, y: 0 });

    const updateEyePosition = (event: MouseEvent) => {
        if (rightEyeRef.current) {
            const eyeRect: DOMRect = rightEyeRef.current.getBoundingClientRect(); // Get position and dimension of the eye
            const eyeCenterX: number = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY: number = eyeRect.top + eyeRect.height / 2;
            const mouseX: number = event.clientX - eyeCenterX;
            const mouseY: number = event.clientY - eyeCenterY;
            const angle: number = Math.atan2(mouseY, mouseX);
            const eyeRadius: number = Math.min(eyeRect.width, eyeRect.height) / 2; // Consider eye's physical dimension for radius
            const maxPupilMove: number = eyeRadius * 0.5; // Adjusting pupil move area to be inside the eye

            const distance: number = Math.min(maxPupilMove, Math.sqrt(mouseX ** 2 + mouseY ** 2));

            setRightPupilPosition({
                x: distance * Math.cos(angle),
                y: distance * Math.sin(angle)
            });
        }

        if (leftEyeRef.current) {
            const eyeRect: DOMRect  = leftEyeRef.current.getBoundingClientRect(); // Get position and dimension of the eye
            const eyeCenterX: number = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY: number = eyeRect.top + eyeRect.height / 2;
            const mouseX: number = event.clientX - eyeCenterX;
            const mouseY: number = event.clientY - eyeCenterY;
            const angle: number = Math.atan2(mouseY, mouseX);
            const eyeRadius: number = Math.min(eyeRect.width, eyeRect.height) / 2; // Consider eye's physical dimension for radius
            const maxPupilMove: number = eyeRadius * 0.5; // Adjusting pupil move area to be inside the eye

            const distance: number = Math.min(maxPupilMove, Math.sqrt(mouseX ** 2 + mouseY ** 2));

            setLeftPupilPosition({
                x: distance * Math.cos(angle),
                y: distance * Math.sin(angle)
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!shouldAnimate) {
                return;
            }

            updateEyePosition(event);
        };

        // Attach the event listener to the window
        window.addEventListener("mousemove", handleMouseMove);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [ shouldAnimate ]);

    return (
        <>
            <g ref={ leftEyeRef } id="bot-left-eye">
                <ellipse id="Ellipse 112" cx="184.719" cy="165.005" rx="9.51965" ry="9.01907" fill="white" />
                <motion.circle
                    cx={ 184.719 + leftPupilPosition.x }
                    cy={ 165.005 + leftPupilPosition.y }
                    r="2"
                    fill="black"
                    initial={ { scale: 0 } }
                    animate={ { scale: 1 } }
                    transition={ {
                        damping: 10 ,
                        stiffness: 100,
                        type: "spring"
                    } }
                />
            </g>
            <g ref={ rightEyeRef } id="bot-right-eye">
                <ellipse cx="231.817" cy="165.005" rx="9.51965" ry="9.01907" fill="white" />
                <motion.circle
                    cx={ 231.817 + rightPupilPosition.x }
                    cy={ 165.005 + rightPupilPosition.y }
                    r="2"
                    fill="black"
                    initial={ { scale: 0 } }
                    animate={ { scale: 1 } }
                    transition={ {
                        damping: 10 ,
                        stiffness: 100,
                        type: "spring"
                    } }
                />
            </g>
        </>
    );
};

const AnimatedTorso = () => {
    return (
        <g id="Group 339">
            <path
                id="Rectangle 229"
                d="M165.666 230.357C162.885 219.715 170.232 209.094 181.171 207.943L186.576 207.374C200.997 205.856 215.538 205.856 229.959 207.374L233.086 207.703C244.988 208.956 252.734 220.826 249.089 232.225L242.031 254.295C238.34 265.839 228.422 274.292 216.439 276.107V276.107C211.019 276.928 205.51 276.975 200.076 276.249L199.514 276.174C185.804 274.341 174.563 264.401 171.066 251.018L165.666 230.357Z"
                fill="url(#paint7_linear_3948_1292)" />
            <g id="Mask group">
                <mask
                    id="mask0_3948_1292"
                    maskUnits="userSpaceOnUse"
                    x="165"
                    y="206"
                    width="86"
                    height="70">
                    <path
                        id="Rectangle 231"
                        d="M165.647 230.281C162.876 219.679 170.195 209.098 181.093 207.951L181.738 207.883C199.376 206.026 217.159 206.026 234.797 207.883V207.883C245.816 209.043 252.988 220.033 249.613 230.586L238.595 265.039C237.008 270.003 232.744 273.637 227.591 274.418V274.418C214.774 276.359 201.745 276.472 188.896 274.754L186.905 274.488C180.822 273.675 175.834 269.264 174.282 263.326L165.647 230.281Z"
                        fill="url(#paint8_linear_3948_1292)" />
                </mask>
                <g mask="url(#mask0_3948_1292)">
                    <path
                        id="Rectangle 230"
                        d="M167.939 179.011C167.011 169.878 173.641 161.714 182.769 160.745L183.345 160.684C199.913 158.927 216.622 158.927 233.191 160.684V160.684C242.476 161.669 249.038 170.239 247.567 179.46L243.569 204.511C242.28 212.588 235.759 218.812 227.631 219.723V219.723C214.759 221.166 201.77 221.23 188.884 219.914L187.626 219.785C178.48 218.851 171.25 211.617 170.321 202.47L167.939 179.011Z"
                        fill="url(#paint9_linear_3948_1292)" />
                </g>
            </g>
        </g>
    );
};

const AnimatedIcon = (props: PropsWithChildren): ReactElement=> {
    const { children } = props;

    const variants: Variants = {
        animate: {
            rotate: [ 360, 0 ],
            transition: {
                rotate: {
                    delay: 0.5,
                    duration: 35,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    repeatType: "loop",
                    type: "spring"
                }
            }
        },
        grow: {
            scale: 1.2
        }
    };

    return (
        <motion.g
            animate="animate"
            whileHover="grow"
            variants={ variants }
        >
            { children }
        </motion.g>
    );
};

const AnimatedCodeWindowIcon = (): ReactElement  => (
    <g id="code-window">
        <path
            id="Vector"
            d="M277.682 63.7915L232.317 75.4629L241.164 109.889L286.529 98.2175L277.682 63.7915Z"
            fill="url(#paint0_linear_3948_1292)" />
        <path
            id="Vector_2"
            d="M243.398 72.6121L263.093 67.5449M273.233 101.638L286.529 98.2176L278.799 68.1371"
            stroke="#506271"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Vector 148"
            d="M235.744 89.9216L240.028 106.199"
            stroke="#506271"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Vector 100"
            d="M254.964 83.8203L251.875 89.0423L257.097 92.1314"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round" />
        <path
            id="Vector 101"
            d="M266.981 89.4102L270.07 84.1882L264.849 81.0991"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round" />
        <path
            id="Vector 102"
            d="M253.862 83.834L250.315 89.5451L256.464 93.2935"
            stroke="#506271"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Vector 103"
            d="M265.031 89.8003L268.12 84.5783L262.881 81.8296"
            stroke="#506271"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </g>
);

const AnimatedDBIcon = (): ReactElement => (
    <g id="Group 297">
        <path
            id="Union"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M365.987 167.424C366.185 166.972 366.288 166.507 366.288 166.032C366.288 165.552 366.345 164.808 366.409 163.959C366.595 161.507 366.848 158.174 366.004 157.743C365.239 157.353 364.468 156.829 363.613 156.248C360.402 154.062 356.02 151.081 346.4 151.477C332.215 152.061 330.53 153.735 328.699 155.553C328.222 156.027 327.735 156.512 327.013 156.989C326.306 156.989 326.428 162.175 326.489 164.805C326.502 165.343 326.512 165.774 326.512 166.032C326.512 166.479 326.603 166.917 326.779 167.344H326.481V172.988H326.494C326.485 173.082 326.481 173.176 326.481 173.27C326.481 177.478 335.324 180.89 346.234 180.89C357.143 180.89 365.987 177.478 365.987 173.27C365.987 173.176 365.983 173.082 365.974 172.988H365.987V167.424Z"
            fill="url(#paint1_linear_3948_1292)" />
        <ellipse
            id="Ellipse 94"
            cx="346.052"
            cy="158.492"
            rx="19.5403"
            ry="7.5159"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Ellipse 97"
            d="M326.512 173.022C326.512 177.45 335.261 181.039 346.052 181.039C356.844 181.039 365.593 177.45 365.593 173.022"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Ellipse 98"
            d="M326.512 180.037C326.512 181.733 328.188 183.289 330.978 184.501M365.593 180.037C365.593 183.912 356.844 187.052 346.052 187.052"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Vector 140"
            d="M326.512 158.993V180.037"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Vector 141"
            d="M365.593 157.991V180.037"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Ellipse 96"
            d="M326.512 166.008C326.512 168.308 328.872 170.381 332.653 171.843M365.593 166.008C365.593 170.435 356.844 174.025 346.052 174.025"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Vector 142"
            d="M347.556 188.054V195.069"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Vector 143"
            d="M358.578 198.075L350.562 198.075"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Vector 144"
            d="M344.55 198.075L337.535 198.075"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <ellipse
            id="Ellipse 102"
            cx="347.556"
            cy="197.574"
            rx="2.50517"
            ry="2.50529"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </g>
);

const AnimatedMessageIcon = (): ReactElement => (
    <g id="Group 295">
        <path
            id="Path"
            d="M151.064 57.0583V71.3417H151.151V86.5896L140.88 75.1987H111.35V57.0583H151.064Z"
            fill="url(#paint2_linear_3948_1292)" />
        <path
            id="Path_2"
            d="M110.065 63.4782V55.7744H131.892"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Path_3"
            d="M144.731 61.9124H116.485"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Path_4"
            d="M126.757 68.3323H116.485"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </g>
);

const AnimatedHourGlassIcon = (): ReactElement => (
    <g id="Group 294">
        <rect
            id="Rectangle 114"
            width="34.0704"
            height="6.01271"
            transform="matrix(-0.982718 0.185107 0.185088 0.982722 130.05 312.788)"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Union_2"
            d="M120.252 287.841C120.702 290.228 119.672 292.677 117.599 294.148L112.124 298.035C111.477 298.495 111.156 299.259 111.296 300.005C111.436 300.75 112.014 301.345 112.784 301.538L119.297 303.166C121.764 303.783 123.614 305.689 124.064 308.076L125.682 316.67L100.079 321.493L98.46 312.899C98.0104 310.512 99.0406 308.063 101.113 306.591L106.588 302.705C107.235 302.245 107.557 301.481 107.417 300.735C107.276 299.99 106.698 299.395 105.928 299.202L99.415 297.574C96.9489 296.957 95.0984 295.051 94.6488 292.664L93.0303 284.07L118.634 279.247L120.252 287.841Z"
            fill="url(#paint3_linear_3948_1292)" />
        <path
            id="Rectangle 116"
            d="M119.447 283.565L120.92 291.384L115.245 295.469M107.445 300.73L107.167 299.253L105.474 298.818L102.088 297.948L95.3161 296.207L93.0302 284.07L105.476 281.725"
            stroke="#F05E58"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Vector 122"
            d="M122.117 315.302L103.812 318.75C99.5643 315.551 104.578 311.207 105.106 311.108C107.893 310.423 110.27 308.202 111.11 307.178C111.431 307.917 112.912 308.038 114.605 308.319C118.586 308.169 120.285 309.448 120.71 309.768C124.026 312.663 123.029 314.663 122.117 315.302Z"
            fill="white" />
        <ellipse
            id="Ellipse 66"
            cx="0.501037"
            cy="1.00212"
            rx="0.501037"
            ry="1.00212"
            transform="matrix(0.982719 -0.185105 0.18509 0.982722 105.475 296.002)"
            fill="#40404B" />
        <ellipse
            id="Ellipse 67"
            cx="0.501036"
            cy="0.501057"
            rx="0.501036"
            ry="0.501057"
            transform="matrix(0.982719 -0.185106 0.185089 0.982722 112.438 305.908)"
            fill="#40404B" />
        <ellipse
            id="Ellipse 68"
            cx="0.501036"
            cy="0.501057"
            rx="0.501036"
            ry="0.501057"
            transform="matrix(0.982719 -0.185106 0.185089 0.982722 104.932 309.361)"
            fill="#40404B" />
        <ellipse
            id="Ellipse 69"
            cx="0.501036"
            cy="0.501057"
            rx="0.501036"
            ry="0.501057"
            transform="matrix(0.982719 -0.185106 0.185089 0.982722 107.7 307.82)"
            fill="#40404B" />
        <ellipse
            id="Ellipse 70"
            cx="0.501036"
            cy="0.501057"
            rx="0.501036"
            ry="0.501057"
            transform="matrix(0.982719 -0.185106 0.185089 0.982722 108.8 297.415)"
            fill="#40404B" />
        <ellipse
            id="Ellipse 71"
            cx="0.501036"
            cy="0.501057"
            rx="0.501036"
            ry="0.501057"
            transform="matrix(0.982719 -0.185106 0.185089 0.982722 109.542 301.355)"
            fill="#40404B" />
        <path
            id="Ellipse 72"
            d="M111.569 295.874C111.671 296.418 111.534 296.9 111.262 296.952C110.99 297.003 110.686 296.603 110.584 296.06C110.481 295.516 110.619 295.033 110.891 294.982C111.163 294.931 111.466 295.33 111.569 295.874Z"
            fill="#40404B" />
        <ellipse
            id="Ellipse 74"
            cx="0.501032"
            cy="0.501057"
            rx="0.501032"
            ry="0.501057"
            transform="matrix(0.982718 -0.185107 0.185088 0.982722 110.099 304.309)"
            fill="#40404B" />
    </g>
);

const AnimatedCogWheelIcon = (): ReactElement => (
    <g id="Group 293">
        <path
            id="Star 2"
            d="M68.3471 157.224C68.8687 154.238 73.0999 154.238 73.6214 157.224C73.9802 159.279 76.3999 160.171 77.9789 158.83C80.274 156.882 83.5152 159.637 82.0193 162.264C80.99 164.071 82.2775 166.33 84.3378 166.331C87.3325 166.332 88.0672 170.552 85.2537 171.591C83.318 172.306 82.8708 174.874 84.4485 176.216C86.7415 178.167 84.6259 181.877 81.8113 180.842C79.8749 180.129 77.9023 181.805 78.2591 183.86C78.7776 186.847 74.8015 188.313 73.3029 185.687C72.2718 183.881 69.6968 183.881 68.6657 185.687C67.167 188.313 63.191 186.847 63.7095 183.86C64.0662 181.805 62.0937 180.129 60.1572 180.842C57.3426 181.877 55.227 178.167 57.5201 176.216C59.0977 174.874 58.6506 172.306 56.7148 171.591C53.9013 170.552 54.636 166.332 57.6307 166.331C59.691 166.33 60.9785 164.071 59.9493 162.264C58.4533 159.637 61.6946 156.882 63.9896 158.83C65.5686 160.171 67.9883 159.279 68.3471 157.224Z"
            fill="url(#paint4_linear_3948_1292)" />
        <path
            id="Star 1"
            d="M53.8865 182.299C54.1961 180.62 56.7084 180.62 57.0181 182.299C57.2311 183.455 58.6678 183.957 59.6053 183.203C60.968 182.107 62.8925 183.656 62.0043 185.134C61.3932 186.151 62.1576 187.421 63.381 187.422C65.159 187.423 65.5953 189.797 63.9248 190.381C62.7754 190.783 62.5099 192.227 63.4466 192.982C64.8081 194.08 63.552 196.167 61.8808 195.584C60.7311 195.183 59.5599 196.126 59.7717 197.282C60.0795 198.962 57.7188 199.787 56.8289 198.31C56.2167 197.294 54.6878 197.294 54.0756 198.31C53.1858 199.787 50.825 198.962 51.1329 197.282C51.3447 196.126 50.1735 195.183 49.0237 195.584C47.3525 196.167 46.0964 194.08 47.4579 192.982C48.3946 192.227 48.1291 190.783 46.9798 190.381C45.3093 189.797 45.7455 187.423 47.5236 187.422C48.7469 187.421 49.5114 186.151 48.9002 185.134C48.012 183.656 49.9365 182.107 51.2992 183.203C52.2367 183.957 53.6734 183.455 53.8865 182.299Z"
            fill="url(#paint5_linear_3948_1292)" />
        <ellipse
            id="Ellipse 45"
            cx="70.4832"
            cy="171.519"
            rx="6.51345"
            ry="6.51378"
            fill="white"
            stroke="#506271"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <ellipse
            id="Ellipse 46"
            cx="55.4526"
            cy="190.56"
            rx="3.50724"
            ry="3.50742"
            fill="white"
            stroke="#506271"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </g>
);

const AnimatedBoxIcon = (): ReactElement => (
    <g id="Group 340">
        <path
            id="Polygon 22"
            d="M287.932 306.304L304.854 316.075V335.616L287.932 345.387L271.01 335.616V316.075L287.932 306.304Z"
            fill="url(#paint6_linear_3948_1292)" />
        <path
            id="Polygon 20"
            d="M291.44 300.292L272.4 311.315V333.361L281.92 338.873M291.44 344.385L310.479 333.361V311.315L300.959 305.803"
            stroke="#506271"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
        <path
            id="Polygon 21"
            d="M291.297 322.338L272.4 311.315M291.297 322.338L300.745 316.827L305.469 314.071M291.297 322.338V339.875"
            stroke="#506271"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </g>
);

AIBotAnimatedWithBackGround.defaultProps = {
    leftPupilPosition: { x: 0, y: 0 },
    rightPupilPosition: { x: 0, y: 0 },
    shouldAnimate: true
};

export default AIBotAnimatedWithBackGround;
