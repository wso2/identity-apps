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

import Box from "@oxygen-ui/react/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Variants, motion } from "framer-motion";
import React, { FunctionComponent, ReactElement, useMemo } from "react";

/**
 * Props interface for SuccessConfetti component.
 */
export interface SuccessConfettiPropsInterface extends IdentifiableComponentInterface {
    /** Number of particles to generate */
    particleCount?: number;
    /** Primary color for particles */
    primaryColor?: string;
}

/**
 * Particle configuration interface.
 */
interface Particle {
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    color: string;
    shape: "circle" | "square";
    delay: number;
}

/**
 * Color palette for particles.
 */
const CONFETTI_COLORS: string[] = [
    "#ff7300",  // Primary orange
    "#ff9a4d",  // Light orange
    "#ffb380",  // Pale orange
    "#94a3b8",  // Slate gray
    "#cbd5e1",  // Light slate
    "#64748b"   // Dark slate
];

/**
 * Generate random particles with varied properties.
 */
const generateParticles = (count: number, primaryColor?: string): Particle[] => {
    const colors: string[] = primaryColor
        ? [ primaryColor, ...CONFETTI_COLORS.slice(1) ]
        : CONFETTI_COLORS;

    return Array.from({ length: count }, (_: unknown, i: number) => ({
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.2,
        id: i,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        shape: Math.random() > 0.5 ? "circle" : "square",
        // Spread particles in a circular pattern
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 150 - 50 // Bias upward
    }));
};

/**
 * Animation variants for particles.
 */
const particleVariants: Variants = {
    animate: (particle: Particle) => ({
        opacity: [ 0, 1, 1, 0 ],
        rotate: particle.rotation + (Math.random() > 0.5 ? 180 : -180),
        scale: [ 0, particle.scale, particle.scale, 0 ],
        transition: {
            delay: particle.delay,
            duration: 1.2,
            ease: "easeOut",
            times: [ 0, 0.2, 0.8, 1 ]
        },
        x: particle.x,
        y: particle.y
    }),
    initial: {
        opacity: 0,
        scale: 0,
        x: 0,
        y: 0
    }
};

/**
 * Confetti animation component for success states.
 */
const SuccessConfetti: FunctionComponent<SuccessConfettiPropsInterface> = (
    props: SuccessConfettiPropsInterface
): ReactElement => {
    const {
        particleCount = 18,
        primaryColor,
        ["data-componentid"]: componentId = "success-confetti"
    } = props;

    const particles: Particle[] = useMemo(
        () => generateParticles(particleCount, primaryColor),
        [ particleCount, primaryColor ]
    );

    return (
        <Box
            data-componentid={ componentId }
            sx={ {
                height: 0,
                left: "50%",
                pointerEvents: "none",
                position: "absolute",
                top: 24,
                transform: "translateX(-50%)",
                width: 0,
                zIndex: 10
            } }
        >
            { particles.map((particle: Particle) => (
                <motion.div
                    key={ particle.id }
                    animate="animate"
                    custom={ particle }
                    initial="initial"
                    style={ {
                        backgroundColor: particle.color,
                        borderRadius: particle.shape === "circle" ? "50%" : "2px",
                        height: 8,
                        position: "absolute",
                        width: 8
                    } }
                    variants={ particleVariants }
                />
            )) }
        </Box>
    );
};

SuccessConfetti.displayName = "SuccessConfetti";

export default SuccessConfetti;
