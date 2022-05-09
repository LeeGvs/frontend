
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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

    /* src\components\Input.svelte generated by Svelte v3.48.0 */

    const file$7 = "src\\components\\Input.svelte";

    // (11:4) {#if message}
    function create_if_block(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*message*/ ctx[3]);
    			attr_dev(p, "class", "msg-text svelte-15epcr5");
    			add_location(p, file$7, 10, 17, 204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 8) set_data_dev(t, /*message*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(11:4) {#if message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let h4;
    	let t0;
    	let t1;
    	let t2;
    	let input;
    	let input_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*message*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			input = element("input");
    			attr_dev(h4, "class", "svelte-15epcr5");
    			add_location(h4, file$7, 9, 4, 169);
    			attr_dev(div0, "class", "title svelte-15epcr5");
    			add_location(div0, file$7, 8, 2, 144);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", input_class_value = "inp" + (/*message*/ ctx[3] ? ' msg' : '') + " svelte-15epcr5");
    			set_style(input, "background-image", "url(" + /*icon*/ ctx[2] + ")");
    			add_location(input, file$7, 12, 2, 256);
    			attr_dev(div1, "class", "input-group");
    			add_location(div1, file$7, 7, 0, 115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h4);
    			append_dev(h4, t0);
    			append_dev(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div1, t2);
    			append_dev(div1, input);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(input, "input", /*input_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (/*message*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*message*/ 8 && input_class_value !== (input_class_value = "inp" + (/*message*/ ctx[3] ? ' msg' : '') + " svelte-15epcr5")) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*icon*/ 4) {
    				set_style(input, "background-image", "url(" + /*icon*/ ctx[2] + ")");
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('Input', slots, []);
    	let { title } = $$props;
    	let { icon } = $$props;
    	let { value } = $$props;
    	let { message = null } = $$props;
    	const writable_props = ['title', 'icon', 'value', 'message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('icon' in $$props) $$invalidate(2, icon = $$props.icon);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('message' in $$props) $$invalidate(3, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ title, icon, value, message });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('icon' in $$props) $$invalidate(2, icon = $$props.icon);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('message' in $$props) $$invalidate(3, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, title, icon, message, input_handler, input_input_handler];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { title: 1, icon: 2, value: 0, message: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<Input> was created without expected prop 'title'");
    		}

    		if (/*icon*/ ctx[2] === undefined && !('icon' in props)) {
    			console.warn("<Input> was created without expected prop 'icon'");
    		}

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<Input> was created without expected prop 'value'");
    		}
    	}

    	get title() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
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

    const tip_store = writable({ bill: 0, people: 0, tip_percentage: 0, reset_disabled: true });

    /* src\components\PercentageButton.svelte generated by Svelte v3.48.0 */

    const file$6 = "src\\components\\PercentageButton.svelte";

    function create_fragment$6(ctx) {
    	let input;
    	let input_id_value;
    	let t0;
    	let label;
    	let t1;
    	let t2;
    	let label_for_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(/*amount*/ ctx[0]);
    			t2 = text("%");
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", /*group_name*/ ctx[1]);
    			input.value = /*amount*/ ctx[0];
    			attr_dev(input, "id", input_id_value = `per_${/*amount*/ ctx[0]}`);
    			attr_dev(input, "class", "svelte-8fioic");
    			add_location(input, file$6, 5, 0, 71);
    			attr_dev(label, "for", label_for_value = `per_${/*amount*/ ctx[0]}`);
    			attr_dev(label, "class", "btn svelte-8fioic");
    			add_location(label, file$6, 6, 0, 159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*group_name*/ 2) {
    				attr_dev(input, "name", /*group_name*/ ctx[1]);
    			}

    			if (dirty & /*amount*/ 1) {
    				prop_dev(input, "value", /*amount*/ ctx[0]);
    			}

    			if (dirty & /*amount*/ 1 && input_id_value !== (input_id_value = `per_${/*amount*/ ctx[0]}`)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*amount*/ 1) set_data_dev(t1, /*amount*/ ctx[0]);

    			if (dirty & /*amount*/ 1 && label_for_value !== (label_for_value = `per_${/*amount*/ ctx[0]}`)) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PercentageButton', slots, []);
    	let { amount } = $$props;
    	let { group_name } = $$props;
    	const writable_props = ['amount', 'group_name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PercentageButton> was created with unknown prop '${key}'`);
    	});

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('amount' in $$props) $$invalidate(0, amount = $$props.amount);
    		if ('group_name' in $$props) $$invalidate(1, group_name = $$props.group_name);
    	};

    	$$self.$capture_state = () => ({ amount, group_name });

    	$$self.$inject_state = $$props => {
    		if ('amount' in $$props) $$invalidate(0, amount = $$props.amount);
    		if ('group_name' in $$props) $$invalidate(1, group_name = $$props.group_name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [amount, group_name, change_handler];
    }

    class PercentageButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { amount: 0, group_name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PercentageButton",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*amount*/ ctx[0] === undefined && !('amount' in props)) {
    			console.warn("<PercentageButton> was created without expected prop 'amount'");
    		}

    		if (/*group_name*/ ctx[1] === undefined && !('group_name' in props)) {
    			console.warn("<PercentageButton> was created without expected prop 'group_name'");
    		}
    	}

    	get amount() {
    		throw new Error("<PercentageButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amount(value) {
    		throw new Error("<PercentageButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group_name() {
    		throw new Error("<PercentageButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group_name(value) {
    		throw new Error("<PercentageButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\CustomPercentage.svelte generated by Svelte v3.48.0 */

    const file$5 = "src\\components\\CustomPercentage.svelte";

    function create_fragment$5(ctx) {
    	let input0;
    	let input0_checked_value;
    	let t;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t = space();
    			input1 = element("input");
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", /*group_name*/ ctx[1]);
    			attr_dev(input0, "id", "cust");
    			input0.value = /*value*/ ctx[0];
    			input0.checked = input0_checked_value = !!/*value*/ ctx[0];
    			attr_dev(input0, "class", "svelte-c0msvf");
    			add_location(input0, file$5, 5, 0, 75);
    			attr_dev(input1, "class", "btn svelte-c0msvf");
    			attr_dev(input1, "placeholder", "Custom");
    			add_location(input1, file$5, 6, 0, 153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input1, "change", /*change_handler*/ ctx[2], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[3])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*group_name*/ 2) {
    				attr_dev(input0, "name", /*group_name*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 1) {
    				prop_dev(input0, "value", /*value*/ ctx[0]);
    			}

    			if (dirty & /*value*/ 1 && input0_checked_value !== (input0_checked_value = !!/*value*/ ctx[0])) {
    				prop_dev(input0, "checked", input0_checked_value);
    			}

    			if (dirty & /*value*/ 1 && input1.value !== /*value*/ ctx[0]) {
    				set_input_value(input1, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(input1);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CustomPercentage', slots, []);
    	let { value = '' } = $$props;
    	let { group_name } = $$props;
    	const writable_props = ['value', 'group_name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CustomPercentage> was created with unknown prop '${key}'`);
    	});

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input1_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('group_name' in $$props) $$invalidate(1, group_name = $$props.group_name);
    	};

    	$$self.$capture_state = () => ({ value, group_name });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('group_name' in $$props) $$invalidate(1, group_name = $$props.group_name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, group_name, change_handler, input1_input_handler];
    }

    class CustomPercentage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { value: 0, group_name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomPercentage",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*group_name*/ ctx[1] === undefined && !('group_name' in props)) {
    			console.warn("<CustomPercentage> was created without expected prop 'group_name'");
    		}
    	}

    	get value() {
    		throw new Error("<CustomPercentage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<CustomPercentage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group_name() {
    		throw new Error("<CustomPercentage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group_name(value) {
    		throw new Error("<CustomPercentage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\PercentageSelect.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;
    const file$4 = "src\\components\\PercentageSelect.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (14:2) {#each options as amount}
    function create_each_block(ctx) {
    	let percentagebutton;
    	let current;

    	percentagebutton = new PercentageButton({
    			props: {
    				amount: /*amount*/ ctx[5],
    				group_name: "percent"
    			},
    			$$inline: true
    		});

    	percentagebutton.$on("change", /*changed*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(percentagebutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(percentagebutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(percentagebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(percentagebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(percentagebutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(14:2) {#each options as amount}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let h4;
    	let t1;
    	let div;
    	let t2;
    	let custompercentage;
    	let updating_value;
    	let current;
    	let each_value = /*options*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function custompercentage_value_binding(value) {
    		/*custompercentage_value_binding*/ ctx[3](value);
    	}

    	let custompercentage_props = { group_name: "percent" };

    	if (/*custom_amount*/ ctx[0] !== void 0) {
    		custompercentage_props.value = /*custom_amount*/ ctx[0];
    	}

    	custompercentage = new CustomPercentage({
    			props: custompercentage_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(custompercentage, 'value', custompercentage_value_binding));
    	custompercentage.$on("change", /*changed*/ ctx[2]);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Select Tip %";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(custompercentage.$$.fragment);
    			add_location(h4, file$4, 11, 0, 342);
    			attr_dev(div, "class", "pc-buttons svelte-1excx");
    			add_location(div, file$4, 12, 0, 365);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t2);
    			mount_component(custompercentage, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options, changed*/ 6) {
    				each_value = /*options*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const custompercentage_changes = {};

    			if (!updating_value && dirty & /*custom_amount*/ 1) {
    				updating_value = true;
    				custompercentage_changes.value = /*custom_amount*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			custompercentage.$set(custompercentage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(custompercentage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(custompercentage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			destroy_component(custompercentage);
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
    	let $tip_store;
    	validate_store(tip_store, 'tip_store');
    	component_subscribe($$self, tip_store, $$value => $$invalidate(4, $tip_store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PercentageSelect', slots, []);
    	const options = [5, 10, 15, 25, 50];
    	let custom_amount = '';
    	const changed = e => console.log(set_store_value(tip_store, $tip_store.tip_percentage = e.target.value, $tip_store));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<PercentageSelect> was created with unknown prop '${key}'`);
    	});

    	function custompercentage_value_binding(value) {
    		custom_amount = value;
    		$$invalidate(0, custom_amount);
    	}

    	$$self.$capture_state = () => ({
    		tip_store,
    		PercentageButton,
    		CustomPercentage,
    		options,
    		custom_amount,
    		changed,
    		$tip_store
    	});

    	$$self.$inject_state = $$props => {
    		if ('custom_amount' in $$props) $$invalidate(0, custom_amount = $$props.custom_amount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [custom_amount, options, changed, custompercentage_value_binding];
    }

    class PercentageSelect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PercentageSelect",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\ControlPanel.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$3 = "src\\components\\ControlPanel.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let input0;
    	let updating_value;
    	let t0;
    	let percentageselect;
    	let t1;
    	let input1;
    	let updating_value_1;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[3](value);
    	}

    	let input0_props = {
    		title: "Bill",
    		icon: "./images/icon-dollar.svg"
    	};

    	if (/*$tip_store*/ ctx[1].bill !== void 0) {
    		input0_props.value = /*$tip_store*/ ctx[1].bill;
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));
    	input0.$on("input", /*checkInput*/ ctx[2]);
    	percentageselect = new PercentageSelect({ $$inline: true });

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[4](value);
    	}

    	let input1_props = {
    		title: "Number of People",
    		icon: "./images/icon-person.svg",
    		placeholder: "0",
    		message: /*message*/ ctx[0]
    	};

    	if (/*$tip_store*/ ctx[1].people !== void 0) {
    		input1_props.value = /*$tip_store*/ ctx[1].people;
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'value', input1_value_binding));
    	input1.$on("input", /*checkInput*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(input0.$$.fragment);
    			t0 = space();
    			create_component(percentageselect.$$.fragment);
    			t1 = space();
    			create_component(input1.$$.fragment);
    			attr_dev(div, "class", "control svelte-17i2fn0");
    			add_location(div, file$3, 18, 0, 413);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(input0, div, null);
    			append_dev(div, t0);
    			mount_component(percentageselect, div, null);
    			append_dev(div, t1);
    			mount_component(input1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const input0_changes = {};

    			if (!updating_value && dirty & /*$tip_store*/ 2) {
    				updating_value = true;
    				input0_changes.value = /*$tip_store*/ ctx[1].bill;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};
    			if (dirty & /*message*/ 1) input1_changes.message = /*message*/ ctx[0];

    			if (!updating_value_1 && dirty & /*$tip_store*/ 2) {
    				updating_value_1 = true;
    				input1_changes.value = /*$tip_store*/ ctx[1].people;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(percentageselect.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(percentageselect.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(input0);
    			destroy_component(percentageselect);
    			destroy_component(input1);
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
    	let $tip_store;
    	validate_store(tip_store, 'tip_store');
    	component_subscribe($$self, tip_store, $$value => $$invalidate(1, $tip_store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ControlPanel', slots, []);
    	let message = null;

    	const checkInput = e => {
    		if ($tip_store.people == 0) {
    			$$invalidate(0, message = `can't be zero`);
    		} else {
    			$$invalidate(0, message = null);
    			set_store_value(tip_store, $tip_store.reset_disabled = false, $tip_store);
    		}

    		console.log(message);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ControlPanel> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		if ($$self.$$.not_equal($tip_store.bill, value)) {
    			$tip_store.bill = value;
    			tip_store.set($tip_store);
    		}
    	}

    	function input1_value_binding(value) {
    		if ($$self.$$.not_equal($tip_store.people, value)) {
    			$tip_store.people = value;
    			tip_store.set($tip_store);
    		}
    	}

    	$$self.$capture_state = () => ({
    		Input,
    		PercentageSelect,
    		tip_store,
    		message,
    		checkInput,
    		$tip_store
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message, $tip_store, checkInput, input0_value_binding, input1_value_binding];
    }

    class ControlPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ControlPanel",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\OutputPanel.svelte generated by Svelte v3.48.0 */
    const file$2 = "src\\components\\OutputPanel.svelte";

    function create_fragment$2(ctx) {
    	let div9;
    	let div8;
    	let div3;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let span0;
    	let t4;
    	let br0;
    	let t5;
    	let div7;
    	let div6;
    	let div4;
    	let t7;
    	let div5;
    	let t9;
    	let span1;
    	let t10;
    	let br1;
    	let t11;
    	let button;
    	let t12;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Tip Amount";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "/ person";
    			t3 = space();
    			span0 = element("span");
    			t4 = text(/*tip_per_person*/ ctx[2]);
    			br0 = element("br");
    			t5 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			div4.textContent = "Total";
    			t7 = space();
    			div5 = element("div");
    			div5.textContent = "/ person";
    			t9 = space();
    			span1 = element("span");
    			t10 = text(/*total_per_person*/ ctx[1]);
    			br1 = element("br");
    			t11 = space();
    			button = element("button");
    			t12 = text("RESET");
    			attr_dev(div0, "class", "label-title svelte-1kcz7bt");
    			add_location(div0, file$2, 22, 8, 645);
    			attr_dev(div1, "class", "label-person svelte-1kcz7bt");
    			add_location(div1, file$2, 23, 8, 696);
    			attr_dev(div2, "class", "label");
    			add_location(div2, file$2, 21, 6, 616);
    			attr_dev(span0, "class", "amount svelte-1kcz7bt");
    			add_location(span0, file$2, 25, 6, 758);
    			add_location(br0, file$2, 25, 50, 802);
    			attr_dev(div3, "class", "amount-line svelte-1kcz7bt");
    			add_location(div3, file$2, 20, 4, 583);
    			attr_dev(div4, "class", "label-title svelte-1kcz7bt");
    			add_location(div4, file$2, 29, 8, 888);
    			attr_dev(div5, "class", "label-person svelte-1kcz7bt");
    			add_location(div5, file$2, 30, 8, 934);
    			attr_dev(div6, "class", "label");
    			add_location(div6, file$2, 28, 6, 859);
    			attr_dev(span1, "class", "amount svelte-1kcz7bt");
    			add_location(span1, file$2, 32, 6, 996);
    			add_location(br1, file$2, 32, 52, 1042);
    			attr_dev(div7, "class", "amount-line svelte-1kcz7bt");
    			add_location(div7, file$2, 27, 4, 826);
    			attr_dev(div8, "class", "amount-outputs");
    			add_location(div8, file$2, 19, 2, 549);
    			attr_dev(button, "class", "reset svelte-1kcz7bt");
    			button.disabled = button_disabled_value = /*$tip_store*/ ctx[0].reset_disabled;
    			add_location(button, file$2, 35, 2, 1074);
    			attr_dev(div9, "class", "panel svelte-1kcz7bt");
    			add_location(div9, file$2, 18, 0, 526);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div3, t3);
    			append_dev(div3, span0);
    			append_dev(span0, t4);
    			append_dev(div3, br0);
    			append_dev(div8, t5);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div7, t9);
    			append_dev(div7, span1);
    			append_dev(span1, t10);
    			append_dev(div7, br1);
    			append_dev(div9, t11);
    			append_dev(div9, button);
    			append_dev(button, t12);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*reset*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tip_per_person*/ 4) set_data_dev(t4, /*tip_per_person*/ ctx[2]);
    			if (dirty & /*total_per_person*/ 2) set_data_dev(t10, /*total_per_person*/ ctx[1]);

    			if (dirty & /*$tip_store*/ 1 && button_disabled_value !== (button_disabled_value = /*$tip_store*/ ctx[0].reset_disabled)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			mounted = false;
    			dispose();
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
    	let tip_per_person;
    	let total_per_person;
    	let $tip_store;
    	validate_store(tip_store, 'tip_store');
    	component_subscribe($$self, tip_store, $$value => $$invalidate(0, $tip_store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OutputPanel', slots, []);

    	const reset = () => {
    		tip_store.set({
    			bill: 0,
    			people: 0,
    			tip_percentage: null,
    			reset_disabled: true
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OutputPanel> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		tip_store,
    		reset,
    		total_per_person,
    		tip_per_person,
    		$tip_store
    	});

    	$$self.$inject_state = $$props => {
    		if ('total_per_person' in $$props) $$invalidate(1, total_per_person = $$props.total_per_person);
    		if ('tip_per_person' in $$props) $$invalidate(2, tip_per_person = $$props.tip_per_person);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$tip_store*/ 1) {
    			$$invalidate(2, tip_per_person = '$' + ($tip_store.people != 0
    			? $tip_store.bill * $tip_store.tip_percentage / 100 / $tip_store.people
    			: 0).toFixed(2));
    		}

    		if ($$self.$$.dirty & /*$tip_store*/ 1) {
    			$$invalidate(1, total_per_person = '$' + ($tip_store.people != 0
    			? $tip_store.bill * (1 + $tip_store.tip_percentage / 100) / $tip_store.people
    			: 0).toFixed(2));
    		}
    	};

    	return [$tip_store, total_per_person, tip_per_person, reset];
    }

    class OutputPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OutputPanel",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\TipCalc.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\components\\TipCalc.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let controlpanel;
    	let t;
    	let outputpanel;
    	let current;
    	controlpanel = new ControlPanel({ $$inline: true });
    	outputpanel = new OutputPanel({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(controlpanel.$$.fragment);
    			t = space();
    			create_component(outputpanel.$$.fragment);
    			attr_dev(div, "class", "calc svelte-817tek");
    			add_location(div, file$1, 5, 0, 127);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(controlpanel, div, null);
    			append_dev(div, t);
    			mount_component(outputpanel, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(controlpanel.$$.fragment, local);
    			transition_in(outputpanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(controlpanel.$$.fragment, local);
    			transition_out(outputpanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(controlpanel);
    			destroy_component(outputpanel);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TipCalc', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TipCalc> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ControlPanel, OutputPanel });
    	return [];
    }

    class TipCalc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TipCalc",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let br;
    	let t1;
    	let t2;
    	let tipcalc;
    	let t3;
    	let footer;
    	let div;
    	let t4;
    	let a0;
    	let t6;
    	let a1;
    	let t8;
    	let current;
    	tipcalc = new TipCalc({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text("SPLI");
    			br = element("br");
    			t1 = text("TTER");
    			t2 = space();
    			create_component(tipcalc.$$.fragment);
    			t3 = space();
    			footer = element("footer");
    			div = element("div");
    			t4 = text("Challenge by ");
    			a0 = element("a");
    			a0.textContent = "Frontend Mentor";
    			t6 = text(". Coded by\n    ");
    			a1 = element("a");
    			a1.textContent = "Lee Greaves";
    			t8 = text(".");
    			add_location(br, file, 5, 24, 122);
    			attr_dev(h1, "class", "title svelte-9pe66z");
    			add_location(h1, file, 5, 2, 100);
    			attr_dev(main, "class", "container");
    			add_location(main, file, 4, 0, 73);
    			attr_dev(a0, "href", "https://www.frontendmentor.io?ref=challenge");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file, 10, 17, 214);
    			attr_dev(a1, "href", "https://github.com/LeeGvs");
    			add_location(a1, file, 11, 4, 318);
    			attr_dev(div, "class", "attribution");
    			add_location(div, file, 9, 2, 171);
    			add_location(footer, file, 8, 0, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(h1, br);
    			append_dev(h1, t1);
    			append_dev(main, t2);
    			mount_component(tipcalc, main, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, t4);
    			append_dev(div, a0);
    			append_dev(div, t6);
    			append_dev(div, a1);
    			append_dev(div, t8);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tipcalc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tipcalc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(tipcalc);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(footer);
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
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ TipCalc });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
