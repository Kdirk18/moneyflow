import { dispatch, Dispatch } from 'd3-dispatch';
import { select, pointer, Selection } from 'd3-selection';
import nodrag, { yesdrag } from './nodrag';
import noevent, { nonpassive, nonpassivecapture, nopropagation } from './noevent';
import constant from './constant';
import DragEvent from './event';

type DragEventListener = (event: DragEvent, d?: any) => void;

function defaultFilter(event: MouseEvent | TouchEvent): boolean {
    return !event.ctrlKey && !event.button;
}

function defaultContainer(this: any, event: Event, d: any): HTMLElement {
    return this.parentNode as HTMLElement;
}

function defaultSubject(event: MouseEvent | TouchEvent, d: any): { x: number, y: number } | null {
    return d == null ? { x: (event as MouseEvent).x, y: (event as MouseEvent).y } : d;
}

function defaultTouchable(): boolean {
    return navigator.maxTouchPoints || ("ontouchstart" in window);
}

export default function () {
    let filter: (event: MouseEvent | TouchEvent, d: any) => boolean = defaultFilter;
    let container: (this: any, event: Event, d: any) => HTMLElement = defaultContainer;
    let subject: (event: MouseEvent | TouchEvent, d: any) => { x: number, y: number } | null = defaultSubject;
    let touchable: () => boolean = defaultTouchable;
    const gestures: { [key: number]: (type: string, event: Event, touch?: Touch) => void } = {};
    const listeners: Dispatch<DragEventListener> = dispatch("start", "drag", "end");
    let active = 0;
    let mousedownx: number, mousedowny: number;
    let mousemoving = false;
    let touchending: NodeJS.Timeout | null = null;
    let clickDistance2 = 0;

    function drag(selection: Selection<HTMLElement, any, any, any>): void {
        selection
            .on("mousedown.drag", mousedowned)
            .filter(touchable)
            .on("touchstart.drag", touchstarted)
            .on("touchmove.drag", touchmoved, nonpassive)
            .on("touchend.drag touchcancel.drag", touchended)
            .style("touch-action", "none")
            .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }

    function mousedowned(event: MouseEvent, d: any): void {
        if (touchending || !filter.call(this, event, d)) return;
        const gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
        if (!gesture) return;
        select(event.view as Window)
            .on("mousemove.drag", mousemoved, nonpassivecapture)
            .on("mouseup.drag", mouseupped, nonpassivecapture);
        nodrag(event.view as Window);
        nopropagation(event);
        mousemoving = false;
        mousedownx = event.clientX;
        mousedowny = event.clientY;
        gesture("start", event);
    }

    function mousemoved(event: MouseEvent): void {
        noevent(event);
        if (!mousemoving) {
            const dx = event.clientX - mousedownx;
            const dy = event.clientY - mousedowny;
            mousemoving = dx * dx + dy * dy > clickDistance2;
        }
        gestures.mouse("drag", event);
    }

    function mouseupped(event: MouseEvent): void {
        select(event.view as Window).on("mousemove.drag mouseup.drag", null);
        yesdrag(event.view as Window, mousemoving);
        noevent(event);
        gestures.mouse("end", event);
    }

    function touchstarted(event: TouchEvent, d: any): void {
        if (!filter.call(this, event, d)) return;
        const touches = event.changedTouches;
        const c = container.call(this, event, d);
        const n = touches.length;
        let gesture: ((type: string, event: TouchEvent, touch?: Touch) => void) | undefined;

        for (let i = 0; i < n; ++i) {
            if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
                nopropagation(event);
                gesture("start", event, touches[i]);
            }
        }
    }

    function touchmoved(event: TouchEvent): void {
        const touches = event.changedTouches;
        const n = touches.length;
        let gesture: ((type: string, event: TouchEvent, touch?: Touch) => void) | undefined;

        for (let i = 0; i < n; ++i) {
            if (gesture = gestures[touches[i].identifier]) {
                noevent(event);
                gesture("drag", event, touches[i]);
            }
        }
    }

    function touchended(event: TouchEvent): void {
        const touches = event.changedTouches;
        const n = touches.length;
        let gesture: ((type: string, event: TouchEvent, touch?: Touch) => void) | undefined;

        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(() => { touchending = null; }, 500); // Ghost clicks are delayed!
        for (let i = 0; i < n; ++i) {
            if (gesture = gestures[touches[i].identifier]) {
                nopropagation(event);
                gesture("end", event, touches[i]);
            }
        }
    }

    function beforestart(that: any, container: HTMLElement, event: MouseEvent | TouchEvent, d: any, identifier?: number, touch?: Touch) {
        const dispatch = listeners.copy();
        let p = pointer(touch || event, container); // Changed from const to let
        let dx, dy;
        const s = subject.call(that, new DragEvent("beforestart", {
            sourceEvent: event,
            target: drag,
            identifier,
            active,
            x: p[0],
            y: p[1],
            dx: 0,
            dy: 0,
            dispatch
        }), d);

        if (s == null) return;

        dx = s.x - p[0] || 0;
        dy = s.y - p[1] || 0;

        return function gesture(type: string, event: MouseEvent | TouchEvent, touch?: Touch) {
            const p0 = p;
            let n;
            switch (type) {
                case "start": gestures[identifier!] = gesture, n = active++; break;
                case "end": delete gestures[identifier!], --active; // falls through
                case "drag": p = pointer(touch || event, container), n = active; break;
            }
            dispatch.call(
                type,
                that,
                new DragEvent(type, {
                    sourceEvent: event,
                    subject: s,
                    target: drag,
                    identifier,
                    active: n,
                    x: p[0] + dx,
                    y: p[1] + dy,
                    dx: p[0] - p0[0],
                    dy: p[1] - p0[1],
                    dispatch
                }),
                d
            );
        };
    }

    drag.filter = function (_: (event: MouseEvent | TouchEvent, d: any) => boolean): typeof drag {
        return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), drag) : filter;
    };

    drag.container = function (_: (this: any, event: Event, d: any) => HTMLElement): typeof drag {
        return arguments.length ? (container = typeof _ === "function" ? _ : constant(_), drag) : container;
    };

    drag.subject = function (_: (event: MouseEvent | TouchEvent, d: any) => { x: number, y: number } | null): typeof drag {
        return arguments.length ? (subject = typeof _ === "function" ? _ : constant(_), drag) : subject;
    };

    drag.touchable = function (_: () => boolean): typeof drag {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), drag) : touchable;
    };

    drag.on = function () {
        const value = listeners.on.apply(listeners, arguments as any);
        return value === listeners ? drag : value;
    };

    drag.clickDistance = function (_: number): typeof drag {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
    };

    return drag;
}
