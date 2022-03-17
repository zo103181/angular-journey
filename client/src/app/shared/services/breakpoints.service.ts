import { Injectable } from '@angular/core';

export const CustomBreakpointNames = {
    'sm': 'sm',
    'md': 'md',
    'lg': 'lg',
    'xl': 'xl',
    '2xl': '2xl'
};

@Injectable({
    providedIn: 'root'
})
export class BreakpointsService {
    breakpoints = {
        '(max-width: 639px)': 'sm',
        '(max-width: 767px)': 'md',
        '(max-width: 1023px)': 'lg',
        '(max-width: 1279px)': 'xl',
        '(max-width: 1535px)': '2xl'
    }

    getBreakpoints(): string[] {
        return Object.keys(this.breakpoints);
    }

    getBreakpointName(breakpointValue): string {
        return this.breakpoints[breakpointValue];
    }

    constructor() {
    }
}