
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const devMode = true;
    const currentContext = writable("SplashScreen");
    let _lastMajorContext = "MainMenu";
    const lastMajorContext = derived(currentContext, $currentContext => {
        if (majorContexts.includes($currentContext)) {
            _lastMajorContext = $currentContext;
        }
        return _lastMajorContext;
    });
    const contexts = [
        "SplashScreen",
        "MainMenu",
        "Gallery",
        "Map",
        "Options",
        "Credits",
        "GameView"
    ];
    const majorContexts = [
        "MainMenu",
        "GameView"
    ];

    /* src/Components/SplashScreen.svelte generated by Svelte v3.50.1 */
    const file$8 = "src/Components/SplashScreen.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "SplashScreen";
    			add_location(h2, file$8, 7, 4, 181);
    			toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			add_location(div, file$8, 6, 0, 147);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let visible;
    	let $currentContext;
    	validate_store(currentContext, 'currentContext');
    	component_subscribe($$self, currentContext, $$value => $$invalidate(1, $currentContext = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SplashScreen', slots, []);
    	let name = "SplashScreen";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SplashScreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		currentContext,
    		name,
    		visible,
    		$currentContext
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$currentContext*/ 2) {
    			$$invalidate(0, visible = $currentContext === name);
    		}
    	};

    	return [visible, $currentContext];
    }

    class SplashScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SplashScreen",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/Components/MainMenu.svelte generated by Svelte v3.50.1 */
    const file$7 = "src/Components/MainMenu.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Main Menu";
    			add_location(h2, file$7, 6, 4, 156);
    			toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			add_location(div, file$7, 5, 0, 122);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let visible;
    	let $currentContext;
    	validate_store(currentContext, 'currentContext');
    	component_subscribe($$self, currentContext, $$value => $$invalidate(1, $currentContext = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainMenu', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainMenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ currentContext, visible, $currentContext });

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$currentContext*/ 2) {
    			$$invalidate(0, visible = $currentContext === "MainMenu");
    		}
    	};

    	return [visible, $currentContext];
    }

    class MainMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainMenu",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/Components/CloseContextButton.svelte generated by Svelte v3.50.1 */

    const { console: console_1 } = globals;
    const file$6 = "src/Components/CloseContextButton.svelte";

    // (37:4) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./assets/ui/close-button.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Close current menu.");
    			attr_dev(img, "class", "svelte-zh9vxg");
    			add_location(img, file$6, 37, 8, 1058);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(37:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:23) 
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./assets/ui/close-button-active.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Close current menu.");
    			attr_dev(img, "class", "svelte-zh9vxg");
    			add_location(img, file$6, 35, 8, 964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(35:23) ",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if isHovered}
    function create_if_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./assets/ui/close-button-hover.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Close current menu.");
    			attr_dev(img, "class", "svelte-zh9vxg");
    			add_location(img, file$6, 33, 8, 859);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(33:4) {#if isHovered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let button;
    	let p;
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*isHovered*/ ctx[0]) return create_if_block;
    		if (/*isActive*/ ctx[1]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			p = element("p");
    			p.textContent = "Close menu.";
    			t1 = space();
    			if_block.c();
    			add_location(p, file$6, 31, 4, 812);
    			attr_dev(button, "id", "context-exit");
    			attr_dev(button, "class", "svelte-zh9vxg");
    			add_location(button, file$6, 22, 0, 498);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, p);
    			append_dev(button, t1);
    			if_block.m(button, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "mouseover", /*renderHover*/ ctx[2], false, false, false),
    					listen_dev(button, "mousedown", /*renderActive*/ ctx[3], false, false, false),
    					listen_dev(button, "mouseup", /*action*/ ctx[4], false, false, false),
    					listen_dev(button, "mouseleave", /*clear*/ ctx[5], false, false, false),
    					listen_dev(button, "focus", /*renderHover*/ ctx[2], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[6], false, false, false),
    					listen_dev(button, "keyup", /*keyup_handler*/ ctx[7], false, false, false),
    					listen_dev(button, "focusout", /*clear*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
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
    	let isHovered;
    	let isActive;
    	let $lastMajorContext;
    	validate_store(lastMajorContext, 'lastMajorContext');
    	component_subscribe($$self, lastMajorContext, $$value => $$invalidate(8, $lastMajorContext = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CloseContextButton', slots, []);

    	function renderHover() {
    		$$invalidate(0, isHovered = true);
    	}

    	function renderActive() {
    		$$invalidate(1, isActive = true);
    	}

    	function action() {
    		console.log("going to" + $lastMajorContext);
    		currentContext.update(c => $lastMajorContext);
    		clear();
    	}

    	function clear() {
    		$$invalidate(1, isActive = false);
    		$$invalidate(0, isHovered = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<CloseContextButton> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = e => {
    		e.key == "Enter" ? renderActive() : null;
    	};

    	const keyup_handler = e => {
    		e.key == "Enter" ? action() : null;
    	};

    	$$self.$capture_state = () => ({
    		currentContext,
    		lastMajorContext,
    		renderHover,
    		renderActive,
    		action,
    		clear,
    		isHovered,
    		isActive,
    		$lastMajorContext
    	});

    	$$self.$inject_state = $$props => {
    		if ('isHovered' in $$props) $$invalidate(0, isHovered = $$props.isHovered);
    		if ('isActive' in $$props) $$invalidate(1, isActive = $$props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, isHovered = false);
    	$$invalidate(1, isActive = false);

    	return [
    		isHovered,
    		isActive,
    		renderHover,
    		renderActive,
    		action,
    		clear,
    		keydown_handler,
    		keyup_handler
    	];
    }

    class CloseContextButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CloseContextButton",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/Components/FloatingUIFrame.svelte generated by Svelte v3.50.1 */
    const file$5 = "src/Components/FloatingUIFrame.svelte";

    function create_fragment$9(ctx) {
    	let closecontextbutton;
    	let t0;
    	let div;
    	let img;
    	let img_src_value;
    	let t1;
    	let current;
    	closecontextbutton = new CloseContextButton({ $$inline: true });
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			create_component(closecontextbutton.$$.fragment);
    			t0 = space();
    			div = element("div");
    			img = element("img");
    			t1 = space();
    			if (default_slot) default_slot.c();
    			if (!src_url_equal(img.src, img_src_value = "./assets/ui/overlay-frame-transparent.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-12kbc");
    			add_location(img, file$5, 6, 4, 118);
    			attr_dev(div, "class", "svelte-12kbc");
    			add_location(div, file$5, 5, 0, 108);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(closecontextbutton, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(closecontextbutton.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(closecontextbutton.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(closecontextbutton, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FloatingUIFrame', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FloatingUIFrame> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ CloseContextButton });
    	return [$$scope, slots];
    }

    class FloatingUIFrame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FloatingUIFrame",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/Components/FullscreenOverlay.svelte generated by Svelte v3.50.1 */

    const file$4 = "src/Components/FullscreenOverlay.svelte";

    function create_fragment$8(ctx) {
    	let main;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (default_slot) default_slot.c();
    			attr_dev(main, "class", "svelte-1ih5cma");
    			toggle_class(main, "hidden", /*hidden*/ ctx[0]);
    			add_location(main, file$4, 3, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*hidden*/ 1) {
    				toggle_class(main, "hidden", /*hidden*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (default_slot) default_slot.d(detaching);
    		}
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

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FullscreenOverlay', slots, ['default']);
    	let { hidden } = $$props;
    	const writable_props = ['hidden'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FullscreenOverlay> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hidden' in $$props) $$invalidate(0, hidden = $$props.hidden);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ hidden });

    	$$self.$inject_state = $$props => {
    		if ('hidden' in $$props) $$invalidate(0, hidden = $$props.hidden);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hidden, $$scope, slots];
    }

    class FullscreenOverlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { hidden: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullscreenOverlay",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hidden*/ ctx[0] === undefined && !('hidden' in props)) {
    			console.warn("<FullscreenOverlay> was created without expected prop 'hidden'");
    		}
    	}

    	get hidden() {
    		throw new Error("<FullscreenOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<FullscreenOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/OpaqueMenuOverlay.svelte generated by Svelte v3.50.1 */
    const file$3 = "src/Components/OpaqueMenuOverlay.svelte";

    // (11:4) <FloatingUiFrame>
    function create_default_slot_1(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			add_location(h1, file$3, 11, 8, 259);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*name*/ 2) set_data_dev(t0, /*name*/ ctx[1]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (default_slot) default_slot.d(detaching);
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

    			if (dirty & /*$$scope, name*/ 10) {
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

    function create_fragment$7(ctx) {
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

    			if (dirty & /*$$scope, name*/ 10) {
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpaqueMenuOverlay', slots, ['default']);
    	let { visible } = $$props;
    	let { name } = $$props;
    	const writable_props = ['visible', 'name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpaqueMenuOverlay> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		FullscreenOverlay,
    		FloatingUiFrame: FloatingUIFrame,
    		visible,
    		name
    	});

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [visible, name, slots, $$scope];
    }

    class OpaqueMenuOverlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { visible: 0, name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpaqueMenuOverlay",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*visible*/ ctx[0] === undefined && !('visible' in props)) {
    			console.warn("<OpaqueMenuOverlay> was created without expected prop 'visible'");
    		}

    		if (/*name*/ ctx[1] === undefined && !('name' in props)) {
    			console.warn("<OpaqueMenuOverlay> was created without expected prop 'name'");
    		}
    	}

    	get visible() {
    		throw new Error("<OpaqueMenuOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<OpaqueMenuOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<OpaqueMenuOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<OpaqueMenuOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Gallery.svelte generated by Svelte v3.50.1 */

    function create_fragment$6(ctx) {
    	let opaquemenuoverlay;
    	let current;

    	opaquemenuoverlay = new OpaqueMenuOverlay({
    			props: {
    				name: /*name*/ ctx[1],
    				visible: /*visible*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(opaquemenuoverlay.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(opaquemenuoverlay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const opaquemenuoverlay_changes = {};
    			if (dirty & /*visible*/ 1) opaquemenuoverlay_changes.visible = /*visible*/ ctx[0];
    			opaquemenuoverlay.$set(opaquemenuoverlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(opaquemenuoverlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(opaquemenuoverlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(opaquemenuoverlay, detaching);
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
    	let $currentContext;
    	validate_store(currentContext, 'currentContext');
    	component_subscribe($$self, currentContext, $$value => $$invalidate(2, $currentContext = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gallery', slots, []);
    	let name = "Gallery";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		currentContext,
    		lastMajorContext,
    		FloatingUiFrame: FloatingUIFrame,
    		FullscreenOverlay,
    		OpaqueMenuOverlay,
    		name,
    		visible,
    		$currentContext
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$currentContext*/ 4) {
    			$$invalidate(0, visible = $currentContext === name);
    		}
    	};

    	return [visible, name, $currentContext];
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

    function create_fragment$5(ctx) {
    	let opaquemenuoverlay;
    	let current;

    	opaquemenuoverlay = new OpaqueMenuOverlay({
    			props: {
    				name: /*name*/ ctx[1],
    				visible: /*visible*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(opaquemenuoverlay.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(opaquemenuoverlay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const opaquemenuoverlay_changes = {};
    			if (dirty & /*visible*/ 1) opaquemenuoverlay_changes.visible = /*visible*/ ctx[0];
    			opaquemenuoverlay.$set(opaquemenuoverlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(opaquemenuoverlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(opaquemenuoverlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(opaquemenuoverlay, detaching);
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
    	let $currentContext;
    	validate_store(currentContext, 'currentContext');
    	component_subscribe($$self, currentContext, $$value => $$invalidate(2, $currentContext = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MapViewer', slots, []);
    	let name = "Map";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MapViewer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		OpaqueMenuOverlay,
    		currentContext,
    		name,
    		visible,
    		$currentContext
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$currentContext*/ 4) {
    			$$invalidate(0, visible = $currentContext === name);
    		}
    	};

    	return [visible, name, $currentContext];
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

    function create_fragment$4(ctx) {
    	let opaquemenuoverlay;
    	let current;

    	opaquemenuoverlay = new OpaqueMenuOverlay({
    			props: {
    				name: /*name*/ ctx[1],
    				visible: /*visible*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(opaquemenuoverlay.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(opaquemenuoverlay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const opaquemenuoverlay_changes = {};
    			if (dirty & /*visible*/ 1) opaquemenuoverlay_changes.visible = /*visible*/ ctx[0];
    			opaquemenuoverlay.$set(opaquemenuoverlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(opaquemenuoverlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(opaquemenuoverlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(opaquemenuoverlay, detaching);
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
    	let $currentContext;
    	validate_store(currentContext, 'currentContext');
    	component_subscribe($$self, currentContext, $$value => $$invalidate(2, $currentContext = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OptionsMenu', slots, []);
    	let name = "Options";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OptionsMenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		OpaqueMenuOverlay,
    		currentContext,
    		name,
    		visible,
    		$currentContext
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$currentContext*/ 4) {
    			$$invalidate(0, visible = $currentContext === name);
    		}
    	};

    	return [visible, name, $currentContext];
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

    function create_fragment$3(ctx) {
    	let opaquemenuoverlay;
    	let current;

    	opaquemenuoverlay = new OpaqueMenuOverlay({
    			props: {
    				name: /*name*/ ctx[1],
    				visible: /*visible*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(opaquemenuoverlay.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(opaquemenuoverlay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const opaquemenuoverlay_changes = {};
    			if (dirty & /*visible*/ 1) opaquemenuoverlay_changes.visible = /*visible*/ ctx[0];
    			opaquemenuoverlay.$set(opaquemenuoverlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(opaquemenuoverlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(opaquemenuoverlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(opaquemenuoverlay, detaching);
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
    	let $currentContext;
    	validate_store(currentContext, 'currentContext');
    	component_subscribe($$self, currentContext, $$value => $$invalidate(2, $currentContext = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreditsPage', slots, []);
    	let name = "Credits";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreditsPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		OpaqueMenuOverlay,
    		currentContext,
    		name,
    		visible,
    		$currentContext
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$currentContext*/ 4) {
    			$$invalidate(0, visible = $currentContext === name);
    		}
    	};

    	return [visible, name, $currentContext];
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
    			add_location(h2, file$2, 6, 4, 156);
    			toggle_class(div, "hidden", !/*visible*/ ctx[0]);
    			add_location(div, file$2, 5, 0, 122);
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
    	let $currentContext;
    	validate_store(currentContext, 'currentContext');
    	component_subscribe($$self, currentContext, $$value => $$invalidate(1, $currentContext = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameView', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameView> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ currentContext, visible, $currentContext });

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$currentContext*/ 2) {
    			$$invalidate(0, visible = $currentContext === "GameView");
    		}
    	};

    	return [visible, $currentContext];
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
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (8:4) {#each contexts as x}
    function create_each_block(ctx) {
    	let button;
    	let t_value = /*x*/ ctx[2] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[1](/*x*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-1vuraat");
    			add_location(button, file$1, 8, 8, 200);
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
    		source: "(8:4) {#each contexts as x}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let nav;
    	let h3;
    	let t1;
    	let each_value = contexts;
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

    			add_location(h3, file$1, 6, 4, 137);
    			attr_dev(nav, "class", "svelte-1vuraat");
    			toggle_class(nav, "hidden", !devMode === true);
    			add_location(nav, file$1, 5, 0, 94);
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
    			if (dirty & /*$currentContext, contexts*/ 1) {
    				each_value = contexts;
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
    	let $currentContext;
    	validate_store(currentContext, 'currentContext');
    	component_subscribe($$self, currentContext, $$value => $$invalidate(0, $currentContext = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DevNavigator', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DevNavigator> was created with unknown prop '${key}'`);
    	});

    	const click_handler = x => set_store_value(currentContext, $currentContext = x, $currentContext);

    	$$self.$capture_state = () => ({
    		currentContext,
    		contexts,
    		devMode,
    		$currentContext
    	});

    	return [$currentContext, click_handler];
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
