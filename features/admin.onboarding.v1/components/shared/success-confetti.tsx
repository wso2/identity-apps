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
interface ParticleInterface {
    id: number;
    x: number;
    y: number;
    rotation: number;
    finalRotation: number;
    scale: number;
    color: string;
    shape: "circle" | "square";
    delay: number;
    size: number;
}

/**
 * Color palette for particles.
 */
const CONFETTI_COLORS: string[] = [
    "#ff7300",
    "#ff9a4d",
    "#ffb380",
    "#fbbf24",
    "#34d399",
    "#60a5fa"
];

/**
 * CSS keyframes for the confetti burst animation.
 */
const CONFETTI_KEYFRAMES: string = `
@keyframes confetti-burst {
    0% {
        opacity: 0;
        transform: translate(0, 0) rotate(0deg) scale(0);
    }
    15% {
        opacity: 1;
        transform: translate(calc(var(--x) * 0.15), calc(var(--y) * 0.15))
            rotate(calc(var(--r) * 0.15)) scale(var(--s));
    }
    70% {
        opacity: 1;
        transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(var(--s));
    }
    100% {
        opacity: 0;
        transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(0);
    }
}`;

/**
 * Generate random particles with varied properties.
 */
const generateParticles: (count: number, primaryColor?: string) => ParticleInterface[] =
    (count: number, primaryColor?: string): ParticleInterface[] => {
        const colors: string[] = primaryColor
            ? [ primaryColor, ...CONFETTI_COLORS.slice(1) ]
            : CONFETTI_COLORS;

        return Array.from({ length: count }, (_: unknown, i: number) => {
            const rotation: number = Math.random() * 360;
            const extraRotation: number = Math.random() > 0.5 ? 180 : -180;

            return {
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.3,
                finalRotation: rotation + extraRotation,
                id: i,
                rotation,
                scale: 0.6 + Math.random() * 0.6,
                shape: Math.random() > 0.5 ? "circle" : "square",
                size: 6 + Math.floor(Math.random() * 7),
                x: (Math.random() - 0.5) * 500,
                y: (Math.random() - 0.5) * 250
            };
        });
    };

/**
 * Confetti animation component for success states.
 */
const SuccessConfetti: FunctionComponent<SuccessConfettiPropsInterface> = (
    props: SuccessConfettiPropsInterface
): ReactElement => {
    const {
        particleCount = 30,
        primaryColor,
        ["data-componentid"]: componentId = "success-confetti"
    } = props;

    const particles: ParticleInterface[] = useMemo(
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
                top: 20,
                width: 0,
                zIndex: 10
            } }
        >
            <style>{ CONFETTI_KEYFRAMES }</style>
            { particles.map((particle: ParticleInterface) => (
                <div
                    key={ particle.id }
                    style={ {
                        "--r": `${particle.finalRotation}deg`,
                        "--s": String(particle.scale),
                        "--x": `${particle.x}px`,
                        "--y": `${particle.y}px`,
                        animation: `confetti-burst 1.8s ease-out ${particle.delay}s forwards`,
                        backgroundColor: particle.color,
                        borderRadius: particle.shape === "circle" ? "50%" : "2px",
                        height: particle.size,
                        opacity: 0,
                        position: "absolute",
                        width: particle.size
                    } as React.CSSProperties }
                />
            )) }
        </Box>
    );
};

SuccessConfetti.displayName = "SuccessConfetti";

export default SuccessConfetti;
