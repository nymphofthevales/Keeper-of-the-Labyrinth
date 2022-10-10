
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const GameState = {
        devMode: readable(true),
        currentContext: writable("SplashScreen"),
        contexts: [
            "SplashScreen",
            "MainMenu",
            "Gallery",
            "MapViewer",
            "OptionsMenu",
            "CreditsPage",
            "GameView"
        ]
    };

    /* src/Components/SplashScreen.svelte generated by Svelte v3.50.1 */
    const file$8 = "src/Components/SplashScreen.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "SplashScreen";
    			add_location(h2, file$8, 7, 4, 191);
    			toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			add_location(div, file$8, 6, 0, 157);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visible*/ 1) {
    				toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let visible;
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SplashScreen', slots, []);
    	let context = GameState.currentContext;
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(2, $context = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SplashScreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ GameState, context, visible, $context });

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(1, context = $$props.context);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context*/ 4) {
    			$$invalidate(0, visible = $context === "SplashScreen");
    		}
    	};

    	return [visible, context, $context];
    }

    class SplashScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SplashScreen",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/Components/MainMenu.svelte generated by Svelte v3.50.1 */
    const file$7 = "src/Components/MainMenu.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Main Menu";
    			add_location(h2, file$7, 7, 4, 187);
    			toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			add_location(div, file$7, 6, 0, 153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visible*/ 1) {
    				toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let visible;
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainMenu', slots, []);
    	let context = GameState.currentContext;
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(2, $context = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainMenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ GameState, context, visible, $context });

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(1, context = $$props.context);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context*/ 4) {
    			$$invalidate(0, visible = $context === "MainMenu");
    		}
    	};

    	return [visible, context, $context];
    }

    class MainMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainMenu",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/Components/FloatingUIFrame.svelte generated by Svelte v3.50.1 */

    function create_fragment$8(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FloatingUIFrame', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FloatingUIFrame> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FloatingUIFrame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FloatingUIFrame",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/Components/FullscreenOverlay.svelte generated by Svelte v3.50.1 */

    function create_fragment$7(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FullscreenOverlay', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FullscreenOverlay> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FullscreenOverlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullscreenOverlay",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Components/Gallery.svelte generated by Svelte v3.50.1 */
    const file$6 = "src/Components/Gallery.svelte";

    // (11:4) <FloatingUiFrame>
    function create_default_slot_1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = `${/*name*/ ctx[1]}`;
    			add_location(h2, file$6, 11, 8, 363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(11:4) <FloatingUiFrame>",
    		ctx
    	});

    	return block;
    }

    // (10:0) <FullscreenOverlay hidden={!visible}>
    function create_default_slot(ctx) {
    	let floatinguiframe;
    	let current;

    	floatinguiframe = new FloatingUIFrame({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(floatinguiframe.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(floatinguiframe, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const floatinguiframe_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				floatinguiframe_changes.$$scope = { dirty, ctx };
    			}

    			floatinguiframe.$set(floatinguiframe_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(floatinguiframe.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(floatinguiframe.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(floatinguiframe, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(10:0) <FullscreenOverlay hidden={!visible}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let fullscreenoverlay;
    	let current;

    	fullscreenoverlay = new FullscreenOverlay({
    			props: {
    				hidden: !/*visible*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fullscreenoverlay.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fullscreenoverlay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fullscreenoverlay_changes = {};
    			if (dirty & /*visible*/ 1) fullscreenoverlay_changes.hidden = !/*visible*/ ctx[0];

    			if (dirty & /*$$scope*/ 16) {
    				fullscreenoverlay_changes.$$scope = { dirty, ctx };
    			}

    			fullscreenoverlay.$set(fullscreenoverlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fullscreenoverlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fullscreenoverlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fullscreenoverlay, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let visible;
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gallery', slots, []);
    	let name = "Gallery";
    	let context = GameState.currentContext;
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(3, $context = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		GameState,
    		FloatingUiFrame: FloatingUIFrame,
    		FullscreenOverlay,
    		name,
    		context,
    		visible,
    		$context
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('context' in $$props) $$invalidate(2, context = $$props.context);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context*/ 8) {
    			$$invalidate(0, visible = $context === name);
    		}
    	};

    	return [visible, name, context, $context];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Components/MapViewer.svelte generated by Svelte v3.50.1 */
    const file$5 = "src/Components/MapViewer.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Map Viewer";
    			add_location(h2, file$5, 7, 4, 188);
    			toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			add_location(div, file$5, 6, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visible*/ 1) {
    				toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let visible;
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MapViewer', slots, []);
    	let context = GameState.currentContext;
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(2, $context = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MapViewer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ GameState, context, visible, $context });

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(1, context = $$props.context);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context*/ 4) {
    			$$invalidate(0, visible = $context === "MapViewer");
    		}
    	};

    	return [visible, context, $context];
    }

    class MapViewer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MapViewer",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Components/OptionsMenu.svelte generated by Svelte v3.50.1 */
    const file$4 = "src/Components/OptionsMenu.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Options Menu";
    			add_location(h2, file$4, 7, 4, 190);
    			toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			add_location(div, file$4, 6, 0, 156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visible*/ 1) {
    				toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let visible;
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OptionsMenu', slots, []);
    	let context = GameState.currentContext;
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(2, $context = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OptionsMenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ GameState, context, visible, $context });

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(1, context = $$props.context);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context*/ 4) {
    			$$invalidate(0, visible = $context === "OptionsMenu");
    		}
    	};

    	return [visible, context, $context];
    }

    class OptionsMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OptionsMenu",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Components/CreditsPage.svelte generated by Svelte v3.50.1 */
    const file$3 = "src/Components/CreditsPage.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Credits";
    			add_location(h2, file$3, 7, 4, 190);
    			toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			add_location(div, file$3, 6, 0, 156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visible*/ 1) {
    				toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let visible;
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreditsPage', slots, []);
    	let context = GameState.currentContext;
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(2, $context = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreditsPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ GameState, context, visible, $context });

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(1, context = $$props.context);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context*/ 4) {
    			$$invalidate(0, visible = $context === "CreditsPage");
    		}
    	};

    	return [visible, context, $context];
    }

    class CreditsPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreditsPage",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Components/GameView.svelte generated by Svelte v3.50.1 */
    const file$2 = "src/Components/GameView.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Game View";
    			add_location(h2, file$2, 7, 4, 187);
    			toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			add_location(div, file$2, 6, 0, 153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visible*/ 1) {
    				toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let visible;
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameView', slots, []);
    	let context = GameState.currentContext;
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(2, $context = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameView> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ GameState, context, visible, $context });

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(1, context = $$props.context);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context*/ 4) {
    			$$invalidate(0, visible = $context === "GameView");
    		}
    	};

    	return [visible, context, $context];
    }

    class GameView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameView",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Components/DevNavigator.svelte generated by Svelte v3.50.1 */
    const file$1 = "src/Components/DevNavigator.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (11:4) {#each contexts as x}
    function create_each_block(ctx) {
    	let button;
    	let t_value = /*x*/ ctx[6] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*x*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-1vuraat");
    			add_location(button, file$1, 11, 8, 304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:4) {#each contexts as x}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let nav;
    	let h3;
    	let t1;
    	let each_value = /*contexts*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			h3 = element("h3");
    			h3.textContent = "Developer Navigator";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 9, 4, 241);
    			attr_dev(nav, "class", "svelte-1vuraat");
    			toggle_class(nav, "hidden", !/*$devMode*/ ctx[0] === true);
    			add_location(nav, file$1, 8, 0, 197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, h3);
    			append_dev(nav, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currentContext, contexts*/ 18) {
    				each_value = /*contexts*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(nav, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$devMode*/ 1) {
    				toggle_class(nav, "hidden", !/*$devMode*/ ctx[0] === true);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $devMode;
    	let $currentContext;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DevNavigator', slots, []);
    	let currentContext = GameState.currentContext;
    	validate_store(currentContext, 'currentContext');
    	component_subscribe($$self, currentContext, value => $$invalidate(1, $currentContext = value));
    	let devMode = GameState.devMode;
    	validate_store(devMode, 'devMode');
    	component_subscribe($$self, devMode, value => $$invalidate(0, $devMode = value));
    	let contexts = GameState.contexts;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DevNavigator> was created with unknown prop '${key}'`);
    	});

    	const click_handler = x => set_store_value(currentContext, $currentContext = x, $currentContext);

    	$$self.$capture_state = () => ({
    		GameState,
    		currentContext,
    		devMode,
    		contexts,
    		$devMode,
    		$currentContext
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentContext' in $$props) $$invalidate(2, currentContext = $$props.currentContext);
    		if ('devMode' in $$props) $$invalidate(3, devMode = $$props.devMode);
    		if ('contexts' in $$props) $$invalidate(4, contexts = $$props.contexts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$devMode, $currentContext, currentContext, devMode, contexts, click_handler];
    }

    class DevNavigator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DevNavigator",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/Labyrinth.svelte generated by Svelte v3.50.1 */
    const file = "src/Labyrinth.svelte";

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let splashscreen;
    	let t4;
    	let mainmenu;
    	let t5;
    	let gallery;
    	let t6;
    	let mapviewer;
    	let t7;
    	let optionsmenu;
    	let t8;
    	let creditspage;
    	let t9;
    	let gameview;
    	let t10;
    	let devnavigator;
    	let current;
    	splashscreen = new SplashScreen({ $$inline: true });
    	mainmenu = new MainMenu({ $$inline: true });
    	gallery = new Gallery({ $$inline: true });
    	mapviewer = new MapViewer({ $$inline: true });
    	optionsmenu = new OptionsMenu({ $$inline: true });
    	creditspage = new CreditsPage({ $$inline: true });
    	gameview = new GameView({ $$inline: true });
    	devnavigator = new DevNavigator({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text("Welcome to the ");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = text(" Svelte build!");
    			t3 = space();
    			create_component(splashscreen.$$.fragment);
    			t4 = space();
    			create_component(mainmenu.$$.fragment);
    			t5 = space();
    			create_component(gallery.$$.fragment);
    			t6 = space();
    			create_component(mapviewer.$$.fragment);
    			t7 = space();
    			create_component(optionsmenu.$$.fragment);
    			t8 = space();
    			create_component(creditspage.$$.fragment);
    			t9 = space();
    			create_component(gameview.$$.fragment);
    			t10 = space();
    			create_component(devnavigator.$$.fragment);
    			add_location(h1, file, 12, 1, 506);
    			add_location(main, file, 11, 0, 498);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(main, t3);
    			mount_component(splashscreen, main, null);
    			append_dev(main, t4);
    			mount_component(mainmenu, main, null);
    			append_dev(main, t5);
    			mount_component(gallery, main, null);
    			append_dev(main, t6);
    			mount_component(mapviewer, main, null);
    			append_dev(main, t7);
    			mount_component(optionsmenu, main, null);
    			append_dev(main, t8);
    			mount_component(creditspage, main, null);
    			append_dev(main, t9);
    			mount_component(gameview, main, null);
    			append_dev(main, t10);
    			mount_component(devnavigator, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(splashscreen.$$.fragment, local);
    			transition_in(mainmenu.$$.fragment, local);
    			transition_in(gallery.$$.fragment, local);
    			transition_in(mapviewer.$$.fragment, local);
    			transition_in(optionsmenu.$$.fragment, local);
    			transition_in(creditspage.$$.fragment, local);
    			transition_in(gameview.$$.fragment, local);
    			transition_in(devnavigator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(splashscreen.$$.fragment, local);
    			transition_out(mainmenu.$$.fragment, local);
    			transition_out(gallery.$$.fragment, local);
    			transition_out(mapviewer.$$.fragment, local);
    			transition_out(optionsmenu.$$.fragment, local);
    			transition_out(creditspage.$$.fragment, local);
    			transition_out(gameview.$$.fragment, local);
    			transition_out(devnavigator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(splashscreen);
    			destroy_component(mainmenu);
    			destroy_component(gallery);
    			destroy_component(mapviewer);
    			destroy_component(optionsmenu);
    			destroy_component(creditspage);
    			destroy_component(gameview);
    			destroy_component(devnavigator);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Labyrinth', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Labyrinth> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		SplashScreen,
    		MainMenu,
    		Gallery,
    		MapViewer,
    		OptionsMenu,
    		CreditsPage,
    		GameView,
    		DevNavigator,
    		name
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class Labyrinth extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Labyrinth",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Labyrinth> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Labyrinth>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Labyrinth>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const game = new Labyrinth({
        target: document.body,
        props: {
            name: 'Keeper of the Labyrinth'
        }
    });

    return game;

})();
//# sourceMappingURL=bundle.js.map
