'use strict';
window.Mogo = {};
window.Mogo.vars = {};
window.Mogo.methods = {};

window.Mogo.vars = {
    $header: $('.tt-header'),
    $options: $('.tt-header__options'),
    $tonyMenu_top: $('.TonyM.TonyM--header'),
    $btn_menu_toggle: $('.tt-header__btn-menu'),
    $settings: $('.tt-header__settings'),
    $settings_btn: $('.tt-header__btn-settings'),
    $user: $('.tt-header__user'),
    $user_btn: $('.tt-header__btn-user'),
    $cart: $('.tt-header__cart'),
    $cart_btn: $('.tt-header__btn-cart'),
    $search_btn: $('.tt-header__btn-open-search'),
    $search_close_btn: $('.tt-header__btn-close-search'),
    $search_input: $('.tt-header__search-form input'),
    $search_dropdown: $('.tt-header__search-dropdown')
};

window.Mogo.logoCurtain = function() {
    var $logo = $('.tt-logo.tt-logo__curtain');

    if ($logo) {
        $(window).on('load', function() {
            $logo.addClass('tt-logo__curtain-hide');
        });
    }
};

window.Mogo.lazyLoad = function() {
    var $images = $('img[data-srcset]');

    $images.Lazy({
        effect: 'fadeIn',
        scrollDirection: 'vertical'
    });
};




window.Mogo.headerDropdowns = function() {
    var $body = $('body'),
        scrollW,
        $scrlBl = $('<div>').css({
            overflowY: 'scroll',
            width: '50px',
            height: '50px',
            visibility: 'hidden'
        });

    $body.append($scrlBl);
    scrollW = $scrlBl[0].offsetWidth - $scrlBl[0].clientWidth;
    $scrlBl.remove();

    $.fn.toggleList = function(options) {
        var $elem = $(this),
            breakpoint = 1024,
            duration = options.duration || 500,
            animate = false;

        options.$btn.on('click', function(e) {
            if (animate) return;
            animate = true;

            var wind_w = window.innerWidth,
                mobile = wind_w <= breakpoint;

            $elem.toggleClass('tt-header__option-open');

            if ($elem.hasClass('tt-header__option-open')) {
                var wind_h = window.innerHeight;

                if (options.beforeOpen) options.beforeOpen();

                $elem.removeAttr('style');

                function open() {
                    $elem.perfectScrollbar();

                    options.$btn.addClass('active');

                    $elem.velocity('stop').velocity('slideDown', {
                        duration: duration,
                        complete: function() {
                            $(window).on('resize.popupclose', function() {
                                closeList();
                            });

                            if (options.afterOpen) options.afterOpen();
                            animate = false;
                        }
                    });
                };

                if (mobile) {
                    var $options = $('.tt-header__options');

                    $elem.height(wind_h - $options[0].getBoundingClientRect().bottom);

                    $body.addClass('ttg-ovf-hidden').css({
                        'padding-right': scrollW
                    });
                    $('.tt-header__sticky .tt-header__sidebar').css({
                        'padding-right': scrollW
                    });

                    open();
                } else {
                    var options_b = $('.tt-header__options').get(0).getBoundingClientRect().bottom;

                    $elem.css({
                        'max-height': wind_h - options_b
                    });

                    open();
                }

            } else {
                if (options.beforeClose) options.beforeClose();

                $elem.perfectScrollbar('destroy').removeClass('ps');

                options.$btn.removeClass('active');

                $(window).unbind('resize.popupclose');

                $elem.velocity('stop').velocity('slideUp', {
                    duration: duration,
                    complete: function() {
                        if (mobile) {
                            $body.removeClass('ttg-ovf-hidden').removeAttr('style');
                            $('.tt-header__sticky .tt-header__sidebar').removeAttr('style');
                        }

                        if (options.afterClose) options.afterClose();
                        animate = false;
                    }
                });
            }

            e.preventDefault();
            return false;
        });

        function closeList() {
            if ($elem.hasClass('tt-header__option-open')) {
                $elem.removeAttr('style').removeClass('tt-header__option-open');
                $body.removeClass('ttg-ovf-hidden').removeAttr('style');
                options.$btn.removeClass('active');
            }
        };

        options.$btn.on('togglelist.close', function() {
            closeList();
        });
    };

    Mogo.vars.$settings.toggleList({
        $btn: Mogo.vars.$settings_btn,
        duration: 400,
        beforeOpen: function() {
            Mogo.vars.$user_btn.trigger('togglelist.close');
            Mogo.vars.$cart_btn.trigger('togglelist.close');
            Mogo.vars.$search_close_btn.trigger('search.close');
            Mogo.vars.$tonyMenu_top.TonyM('hideTM', false, false, true);
        }
    });

    Mogo.vars.$user.toggleList({
        $btn: Mogo.vars.$user_btn,
        duration: 400,
        beforeOpen: function() {
            Mogo.vars.$settings_btn.trigger('togglelist.close');
            Mogo.vars.$cart_btn.trigger('togglelist.close');
            Mogo.vars.$search_close_btn.trigger('search.close');
            Mogo.vars.$tonyMenu_top.TonyM('hideTM', false, false, true);
        }
    });

    Mogo.vars.$cart.toggleList({
        $btn: Mogo.vars.$cart_btn,
        duration: 400,
        beforeOpen: function() {
            Mogo.vars.$settings_btn.trigger('togglelist.close');
            Mogo.vars.$user_btn.trigger('togglelist.close');
            Mogo.vars.$search_close_btn.trigger('search.close');
            Mogo.vars.$tonyMenu_top.TonyM('hideTM', false, false, true);
            Mogo.vars.$cart.find('ul').addClass('ttg-loading');
        },
        afterOpen: function() {
            Mogo.vars.$cart.find('ul').removeClass('ttg-loading');
        },
        afterClose: function() {
            Mogo.vars.$cart.find('ul').removeClass('ttg-loading');
        }
    });
};




window.Mogo.revolutionSlider = {
    resizeRev: function(options, new_rev_obj, bp_arr) {
        if (!options.wrapper || !options.slider || !options.breakpoints) return false;

        var wrapper = options.wrapper,
            slider = options.slider,
            breakpoints = options.breakpoints,
            fullscreen_BP = options.fullscreen_BP || false,
            new_rev_obj = new_rev_obj || {},
            bp_arr = bp_arr || [],
            rev_obj = {
                jsFileLocation: "vendor/revolution/js/"
            };

        $.extend(rev_obj, new_rev_obj);

        var get_Slider = function() {
            return $sliderWrapp.find(slider);
        };

        var get_current_bp = function() {
            var wind_W = window.innerWidth;

            for (var i = 0; i < breakpoints.length; i++) {
                var bp = breakpoints[i];

                if (!breakpoints.length) return false;

                if (wind_W <= bp) {
                    if (i === 0) {
                        return bp;
                    } else {
                        if (bp > breakpoints[i - 1])
                            return bp;
                    }
                } else if (wind_W > bp && i === breakpoints.length - 1)
                    return Infinity;
            }
            return false;
        };

        var $sliderWrapp = $(wrapper),
            $sliderInit = get_Slider(),
            $sliderCopy = $sliderWrapp.clone(),
            bp = get_current_bp();

        if (!$sliderInit.length) return false;

        var start_Rev = function($sliderInit, bp) {
            var wind_W = window.innerWidth,
                rev_settings_obj = {},
                rev_screen_obj = {},
                set_rev_obj = {};

            if (fullscreen_BP) {
                var full_width = (wind_W >= fullscreen_BP) ? 'off' : 'on',
                    full_screen = (wind_W >= fullscreen_BP) ? 'on' : 'off',
                    sliderLayout = (wind_W >= fullscreen_BP) ? 'fullscreen' : 'fullwidth';

                rev_screen_obj = {
                    fullWidth: full_width,
                    fullScreen: full_screen,
                    sliderLayout: sliderLayout
                };
            }

            if (bp_arr.length) {
                for (var i = 0; i < bp_arr.length; i++) {
                    var this_obj = bp_arr[i];

                    if (this_obj.bp && this_obj.bp.length === 2 && this_obj.bp[0] < this_obj.bp[1]) {
                        var from = this_obj.bp[0],
                            to = this_obj.bp[1];

                        if (from <= bp && to >= bp) {
                            for (var key in this_obj) {
                                if (key !== 'bp')
                                    rev_settings_obj[key] = this_obj[key];
                            }
                        }
                    }
                }
            }

            $.extend(set_rev_obj, rev_obj, rev_settings_obj, rev_screen_obj);

            var local_revolution = $($sliderInit).revolution(set_rev_obj);

            local_revolution.one('revolution.slide.onloaded', function() {
                $($sliderInit).css({
                    visibility: 'visible'
                });
            });

            $(options.functions).each(function() {
                this.call($sliderInit);
            });
        };

        start_Rev($sliderInit, bp);

        var restart_Rev = function(current_bp) {
            if (!$($sliderInit).hasClass('revslider-initialised')) return;
            bp = current_bp || 0;
            var $slider_kill = $sliderInit.parents('.forcefullwidth_wrapper_tp_banner').replaceWith($sliderCopy);
            $slider_kill.revkill();
            $slider_kill.empty();
            $sliderWrapp = $sliderCopy;
            $sliderCopy = $sliderWrapp.clone();
            $sliderInit = get_Slider();
            start_Rev($sliderInit, bp);
        };

        function endResize(func) {
            var windWidth = window.innerWidth,
                interval;

            interval = setInterval(function() {
                var windWidthInterval = window.innerWidth;
                if (windWidth === windWidthInterval) {
                    setTimeout(function() {
                        func();
                    }, 200);
                }
                clearInterval(interval);
            }, 100);
        };

        $(window).on('resize', function() {
            endResize(function() {
                var current_bp = get_current_bp();
                if (current_bp !== bp)
                    restart_Rev(current_bp);
            })
        });
    },
    init: function() {
        var $slider = $('.tt-sr'),
            $header = $('.tt-header'),
            layout = $slider.attr('data-layout'),
            offset_top = !$header.hasClass('tt-header__transparent'),
            rtl = $('body').attr('dir') === 'rtl';

        if ($slider.length) {
            var rev_bullets = {},
                rev_arrows = {},
                revolution_obj = {
                    sliderLayout: layout || 'fullscreen',
                    fullScreenOffsetContainer: (offset_top) ? 'header' : false,
                    delay: 118000,
                    startwidth: 1920,
                    gridwidth: 1920,
                    gridheight: 960,
                    shadow: 0,
                    spinner: 'off',
                    shuffle: "off",
                    startWithSlide: 0,
                    dottedOverlay: "none",
                    disableProgressBar: 'on',
                    navigation: {
                        onHoverStop: "on",
                        keyboardNavigation: "on",
                        keyboard_direction: "horizontal",
                        mouseScrollNavigation: "off",
                        bullets: {
                            enable: true,
                            style: 'ares',
                            tmp: '',
                            direction: 'horizontal',
                            rtl: false,
                            container: 'slider',
                            h_align: 'right',
                            v_align: 'bottom',
                            h_offset: 200,
                            v_offset: 92,
                            space: 16,
                            hide_onleave: false,
                            hide_onmobile: false,
                            hide_under: 0,
                            hide_over: 9999,
                            hide_delay: 200,
                            hide_delay_mobile: 1200
                        },
                        arrows: {
                            enable: true,
                            style: 'uranus',
                            tmp: '',
                            rtl: $('body').attr('dir') === 'rtl' ? true : false,
                            hide_onleave: false,
                            hide_onmobile: true,
                            hide_under: 0,
                            hide_over: 9999,
                            hide_delay: 200,
                            hide_delay_mobile: 1200,
                            left: {
                                container: 'slider',
                                h_align: 'right',
                                v_align: 'bottom',
                                h_offset: 130,
                                v_offset: 70
                            },
                            right: {
                                container: 'slider',
                                h_align: 'right',
                                v_align: 'bottom',
                                h_offset: 76,
                                v_offset: 70
                            }
                        },
                        touch: {
                            touchenabled: "on",
                            swipe_threshold: 75,
                            swipe_min_touches: 1,
                            swipe_direction: "horizontal",
                            drag_block_vertical: false
                        },
                    },
                    viewPort: {
                        enable: true,
                        outof: "pause",
                        visible_area: "80%",
                        presize: false
                    },
                    lazyType: "smart",
                    parallax: {
                        type: "mouse",
                        origo: "slidercenter",
                        speed: 2000,
                        levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50, 46, 47, 48, 49, 50, 55],
                        disable_onmobile: 'on',
                    }
                };

            if ($slider.hasClass('tt-sr__nav-v2')) {
                rev_bullets = {
                    h_align: 'center',
                    v_align: 'bottom',
                    h_offset: 0,
                    v_offset: 120,
                };

                rev_arrows = {
                    left: {
                        h_align: 'left',
                        v_align: 'center',
                        h_offset: 60,
                        v_offset: 0
                    },
                    right: {
                        h_align: 'right',
                        v_align: 'center',
                        h_offset: 60,
                        v_offset: 0
                    }
                };

            } else if ($slider.hasClass('tt-sr__nav-vertical')) {
                rev_bullets = {
                    h_align: 'right',
                    v_align: 'center',
                    h_offset: 100,
                    v_offset: -60,
                    direction: 'vertical',
                };

                rev_arrows = {
                    left: {
                        h_align: 'right',
                        v_align: 'center',
                        h_offset: 80,
                        v_offset: 40
                    },
                    right: {
                        h_align: 'right',
                        v_align: 'center',
                        h_offset: 80,
                        v_offset: 100
                    }
                };
            }

            $.extend(revolution_obj['navigation']['bullets'], rev_bullets);
            $.extend(revolution_obj['navigation']['arrows'], rev_arrows);

            this.resizeRev({
                    wrapper: '.tt-sr',
                    slider: '.tt-sr__content',
                    breakpoints: [767, 1024]
                },
                revolution_obj, [{
                        bp: [769, 1024],
                        navigation: {
                            onHoverStop: "on",
                            keyboardNavigation: "on",
                            keyboard_direction: "horizontal",
                            mouseScrollNavigation: "off",
                            bullets: {
                                enable: true,
                                style: 'ares',
                                tmp: '',
                                direction: 'horizontal',
                                rtl: $('body').attr('dir') === 'rtl' ? true : false,

                                container: 'slider',
                                h_align: 'center',
                                v_align: 'bottom',
                                h_offset: 0,
                                v_offset: 92,
                                space: 16,

                                hide_onleave: false,
                                hide_onmobile: false,
                                hide_under: 0,
                                hide_over: 9999,
                                hide_delay: 200,
                                hide_delay_mobile: 1200

                            },
                            arrows: {
                                enable: false
                            },
                            touch: {
                                touchenabled: "on",
                                swipe_threshold: 75,
                                swipe_min_touches: 1,
                                swipe_direction: "horizontal",
                                drag_block_vertical: false
                            },
                        },
                        parallax: {},
                    },
                    {
                        bp: [0, 768],
                        navigation: {
                            onHoverStop: "on",
                            keyboardNavigation: "on",
                            keyboard_direction: "horizontal",
                            mouseScrollNavigation: "off",
                            bullets: {
                                enable: true,
                                style: 'ares',
                                tmp: '',
                                direction: 'horizontal',
                                rtl: $('body').attr('dir') === 'rtl' ? true : false,

                                container: 'slider',
                                h_align: 'center',
                                v_align: 'bottom',
                                h_offset: 0,
                                v_offset: 38,
                                space: 16,

                                hide_onleave: false,
                                hide_onmobile: false,
                                hide_under: 0,
                                hide_over: 9999,
                                hide_delay: 200,
                                hide_delay_mobile: 1200

                            },
                            arrows: {
                                enable: false
                            },
                            touch: {
                                touchenabled: "on",
                                swipe_threshold: 75,
                                swipe_min_touches: 1,
                                swipe_direction: "horizontal",
                                drag_block_vertical: false
                            },
                        },
                        parallax: {},
                    }
                ]
            );
        };
    }
};




window.Mogo.btnAjax = {
    quickView: {
        class: 'tt-product__buttons_qv',
        ajax_settings: {
            type: 'POST',
            url: 'extensions/ajax/product-ajax.php'
        },
        beforeSend: function($this_btn) {
            var $product = $this_btn.parents('.tt-product'),
                index = $product.attr('data-index') || '';

            this.ajax_settings.data = 'product=' + index + '&skin=' + $('html').attr('data-page-skin');
        },
        afterSend: function(data, $this_btn) {
            $this_btn.trigger('blur');

            $.magnificPopup.open({
                mainClass: 'mfp-with-zoom',
                removalDelay: 300,
                closeMarkup: '<button title="%title%" type="button" class="mfp-close icon-cancel"></button>',
                items: [{
                    //src: '.tt-qv',
                    src: $(data),
                    type: 'inline',
                }],
                callbacks: {
                    beforeOpen: function() {
                        var $body = $('body'),
                            $pd_images = $('.tt-product-page .tt-product-head__images'),
                            is_zoom = $pd_images.find('.tt-product-head__image-main').hasClass('fotorama--zoom'),
                            scrollW,
                            $scrlBl = $('<div>').css({
                                overflowY: 'scroll',
                                width: '50px',
                                height: '50px',
                                visibility: 'hidden'
                            });

                        this.is_zoom = is_zoom;

                        if (is_zoom) $pd_images.productGallery('zoomToggle', 'off');

                        $body.append($scrlBl);
                        scrollW = $scrlBl[0].offsetWidth - $scrlBl[0].clientWidth;
                        $scrlBl.remove();

                        $body.addClass('tt-qv-open');
                        $('.tt-header.tt-header__sticky').css({
                            paddingRight: scrollW
                        });
                    },
                    open: function() {
                        var timeout = 500,
                            $qv_images = $('.tt-qv .tt-product-head__images');



                        setTimeout(function() {
                            $qv_images.productGallery({
                                slick: {
                                    slidesToShow: 4,
                                    vertical: false,
                                    verticalSwiping: false,
                                }
                            });
                        }, timeout);


                        window.Mogo.countdown('.tt-qv .tt-product-head__countdown');
                    },
                    afterClose: function() {
                        var $qv_images = $('.tt-qv .tt-product-head__images'),
                            $pd_images = $('.tt-product-page .tt-product-head__images');

                        $('body').removeClass('tt-qv-open');
                        $('.tt-header').removeAttr('style');

                        $qv_images.productGallery('destroy');

                        if (this.is_zoom) $pd_images.productGallery('zoomToggle', 'on');
                    },
                }
            });

            $this_btn.removeClass('tt-btn__state--wait');
        }
    },
    addToCart: {
        class: [
            'tt-product__buttons_cart',
            'tt-product-head__cart'
        ],
        ajax_settings: {
            type: 'POST',
            url: 'extensions/ajax/answer.php'
        },
        beforeSend: function($this_btn) {
            var $product = $this_btn.parents('.tt-product'),
                index = $product.attr('data-index') || '';

            this.ajax_settings.data = 'product=' + index;

            if (!$this_btn.hasClass('tt-btn__state--active')) this.ajax_settings.data += '&answer=true';
            else this.ajax_settings.data += '&answer=false';
        },
        afterSend: function(data, $this_btn) {
            var add_to_cart = '.tt-add-to-cart',
                $add_to_cart = $(add_to_cart),
                show_popup = $add_to_cart.attr('data-active');

            if (data == 1) {
                if ($add_to_cart.length && show_popup === 'true') {
                    $this_btn.trigger('blur');

                    $.magnificPopup.open({
                        mainClass: 'mfp-with-zoom',
                        removalDelay: 300,
                        closeMarkup: '<button title="%title%" type="button" class="mfp-close icon-cancel"></button>',
                        items: [{
                            src: add_to_cart,
                            type: 'inline',
                        }]
                    });
                }

                $this_btn.addClass('tt-btn__state--active');
            } else if (data == 0) {
                $this_btn.removeClass('tt-btn__state--active');
            }

            $this_btn.removeClass('tt-btn__state--wait');
        }
    },
    init: function() {
        var btn_ajax =
            '.tt-btn-type--ajax, ' +
            '.tt-product__buttons_cart, ' +
            '.tt-product__buttons_like, ' +
            '.tt-product__buttons_compare, ' +
            '.tt-product__buttons_qv, ' +
            '.tt-product-head__cart, ' +
            '.tt-product-head__like, ' +
            '.tt-product-head__compare',
            handlers = [
                this.quickView,
                this.addToCart
            ];

        function send_ajax(ajax_obj, successFunc, $this_btn) {
            var ajax_settings = {
                timeout: 5000,
                cache: false,
                success: function(data) {
                    successFunc(data, $this_btn);
                },
                error: function(jqXHR, exception) {

                    if (jqXHR.status === 0) {
                        console.log('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        console.log('Requested page not found. [404]');
                    } else if (jqXHR.status == 500) {
                        console.log('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        console.log(jqXHR.responseText);
                    } else if (exception === 'timeout') {
                        console.log('Time out error.');
                    } else if (exception === 'abort') {
                        console.log('Ajax request aborted.');
                    } else {
                        console.log('Uncaught Error.\n' + jqXHR.responseText);
                    }

                    $this_btn.removeClass('tt-btn__state--wait');
                }
            };

            ajax_obj = ajax_obj || {};

            $.extend(ajax_settings, ajax_obj);

            $.ajax(ajax_settings);
        };

        $(document).on('click', btn_ajax, function(e) {
            var $this = $(this),
                $this_btn = $this,
                ajax_obj = {
                    type: 'POST'
                },
                successFunc;

            $this_btn.addClass('tt-btn__state--wait');

            $(handlers).each(function() {
                var handler = this,
                    has_class = false;

                if (Array.isArray(handler.class)) {
                    $(handler.class).each(function() {
                        if ($this_btn.hasClass(this)) {
                            has_class = true;
                            return false;
                        }
                    });
                } else {
                    if ($this_btn.hasClass(handler.class)) has_class = true;
                }

                if (has_class) {
                    handler.beforeSend($this_btn);

                    $.extend(ajax_obj, handler.ajax_settings);

                    successFunc = function(data, $this_btn) {
                        handler.afterSend(data, $this_btn);
                    };
                }
            });

            if (!successFunc) {
                if (!$this_btn.hasClass('tt-btn__state--active')) ajax_obj.data = 'answer=true';
                else ajax_obj.data = 'answer=false';

                ajax_obj.url = 'extensions/ajax/answer.php';

                successFunc = function(data, $this_btn) {
                    if (data == 1) {
                        $this_btn.addClass('tt-btn__state--active');
                    } else if (data == 0) {
                        $this_btn.removeClass('tt-btn__state--active');
                    }

                    $this_btn.removeClass('tt-btn__state--wait');
                };
            }

            send_ajax(ajax_obj, successFunc, $this_btn);

            e.preventDefault();
            return false;
        });
    }
};

window.Mogo.sidebarMobile = function() {
    var _self = this,
        $sidebar = $('.tt-sidebar'),
        $sidebar_content = $sidebar.find('.tt-sidebar__content'),
        $bg = $('.tt-sidebar__bg'),
        $btn = $('.tt-sidebar__btn'),
        $body = $('body'),
        scrollW,
        breakpoint = 1024;

    var $scrlBl = $('<div>').css({
        overflowY: 'scroll',
        width: '50px',
        height: '50px',
        visibility: 'hidden'
    });

    $body.append($scrlBl);
    scrollW = $scrlBl[0].offsetWidth - $scrlBl[0].clientWidth;
    $scrlBl.remove();

    function close(is_fast) {
        $sidebar.removeClass('tt-sidebar--open');
        $bg.removeClass('tt-sidebar__bg--visible');

        $sidebar.unbind('transitionend').one('transitionend', function() {
            var t = parseInt($body.css('top'), 10) * -1;

            $body.removeClass('ttg-ovf-hidden').removeAttr('style').scrollTop(t);

            $sidebar.removeClass('tt-sidebar--ready').removeAttr('style');
            $bg.removeClass('tt-sidebar__bg--ready');

            $sidebar_content.perfectScrollbar('destroy').removeClass('ps');
        });

        if (is_fast) $sidebar.trigger('transitionend');

        $(window).unbind('resize.sidebar');
    };

    $btn.on('click', function() {
        if (!$sidebar.hasClass('tt-sidebar--open')) {
            _self.vars.$settings_btn.trigger('togglelist.close');
            _self.vars.$user_btn.trigger('togglelist.close');
            _self.vars.$cart_btn.trigger('togglelist.close');
            _self.vars.$search_close_btn.trigger('search.close');
            _self.vars.$tonyMenu_top.TonyM('hideTM', false, false, true);

            var t = -$body.scrollTop();

            $body.css({
                top: t
            }).addClass('ttg-ovf-hidden').css({
                'padding-right': scrollW
            });

            $sidebar_content.perfectScrollbar();

            $sidebar.addClass('tt-sidebar--ready');
            $bg.addClass('tt-sidebar__bg--ready');

            setTimeout(function() {
                $sidebar.addClass('tt-sidebar--open');
                $bg.addClass('tt-sidebar__bg--visible');
            }, 0);

            $(window).on('resize.sidebar', function() {
                if (window.innerWidth > breakpoint) close(true);
            });
        } else {
            close();
        }
    });

    $bg.on('click', function() {
        $sidebar.filter('.tt-sidebar--open').find($btn).trigger('click');
    });
};




window.Mogo.carouselBrands = function() {
    var $carousel_brands = $('.tt-carousel-brands');

    $carousel_brands.slick({
        dots: false,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2500,
        infinite: true,
        slidesToShow: 8,
        rtl: $('body').attr('dir') === 'rtl' ? true : false,
        responsive: [{
                breakpoint: 1400,
                settings: {
                    slidesToShow: 6
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3
                },
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 2
                },
            },
        ]
    });
};




window.Mogo.sliderBlogSingle = function() {
    var $post_slider = $('.tt-post-slider');

    $post_slider.slick({
        rtl: $('body').attr('dir') === 'rtl' ? true : false,
        arrows: true,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 2500,
        prevArrow: '<i class="slick-prev icon-left-open-big"></i>',
        nextArrow: '<i class="slick-next icon-right-open-big"></i>',
    }).addClass('tt-post-slider__init').hide().fadeIn();
};

window.Mogo.sliderScroll = function() {
    $.fn.sliderScroll = function() {
        var $slider = this;

        if (!$slider.length) return false;

        var $nav = $slider.find('.tt-slider-scroll__nav'),
            $nav_ul = $nav.find('ul'),
            $nav_arrows = $nav.find('.tt-slider-scroll__nav_arrows span'),
            scroll_is_act = false;

        $nav_ul.on('click', 'li', function(e) {
            if (!scroll_is_act) {
                scroll_is_act = true;

                var wind_H = window.innerHeight,
                    $li = $nav_ul.children(),
                    $item,
                    item_top,
                    item_H,
                    scroll_to,
                    eq = 0,
                    i = 0;

                for (; i < $li.length; i++) {
                    if ($li.get(i) === this)
                        eq = i;
                }

                $item = $slider.find('.tt-slider-scroll__item').eq(eq),
                    item_top = $item.offset().top,
                    item_H = $item.outerHeight(),
                    scroll_to = item_top - wind_H / 2 + item_H / 2;

                $('html, body').animate({
                    scrollTop: scroll_to
                }, {
                    duration: 500,
                    complete: function() {
                        scroll_is_act = false;
                    }
                });
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        $nav_arrows.on('click', function(e) {
            var index = $nav_arrows.index(this),
                $nav_li_act = $nav.find('li.active');

            if (index === 0) {
                $nav_li_act.prev().trigger('click');
            } else if (index === 1) {
                $nav_li_act.next().trigger('click');
            }
        });

        function moveAction() {
            var wind_H = window.innerHeight,
                wind_W = window.innerWidth,
                $items = $slider.find('.tt-slider-scroll__item');

            $items.height(wind_H);

            var nav_H = $nav.innerHeight(),
                nav_top = $nav_ul.offset().top,
                $last_item = $slider.find('.tt-slider-scroll__item:last-child'),
                last_item_top = $last_item.offset().top,
                last_item_H = $last_item.outerHeight(),
                last_item_max = last_item_top + last_item_H / 2,
                $first_item = $slider.find('.tt-slider-scroll__item').eq(0),
                first_item_top = $first_item.offset().top,
                first_item_H = $first_item.outerHeight(),
                first_item_max = first_item_top + first_item_H / 2,
                pos_top = 0,
                i = 0;

            if (last_item_max < pageYOffset + wind_H / 2) {
                pos_top = last_item_max - nav_H / 2 - pageYOffset;
            } else if (first_item_max > pageYOffset + wind_H / 2) {
                pos_top = first_item_max - nav_H / 2 - pageYOffset;
            } else {
                pos_top = wind_H / 2 - nav_H / 2;
            }

            $nav.css({
                'top': pos_top
            });

            for (; i < $items.length; i++) {
                var $item = $items.eq(i),
                    this_bottom = $item.offset().top + $item.outerHeight();

                if (this_bottom > nav_top + nav_H / 2) {
                    $nav_ul.find('li').removeClass('active').eq(i).addClass('active');
                    break;
                }
            }
        };

        $(window).on('resize.scrollslider scroll.scrollslider load.scrollslider ', function() {
            moveAction();
        });

        if (this.firstLoad) {
            this.firstLoad = false;
        } else {
            moveAction();
        }

        $slider.velocity({
            opacity: 1
        }, 1000);
    };

    $('.tt-slider-scroll').sliderScroll();
};

window.Mogo.tabs = function() {
    $.fn.ttTabs = function(options) {
        function ttTabs(tabs) {
            var $tabs = $(tabs),
                trl = $('body').attr('dir') === 'rtl' ? true : false,
                tabs_type = $tabs.attr('data-tt-type'),
                $head = $tabs.find('.tt-tabs__head'),
                $head_slider = $head.find('.tt-tabs__slider'),
                $head_btn = $head_slider.find('.tt-tabs__btn'),
                $border = $head.find('.tt-tabs__border'),
                $body = $tabs.find('.tt-tabs__body'),
                $body_tab = $body.find('> div'),
                anim_tab_duration = options.anim_tab_duration || 500,
                anim_scroll_duration = options.anim_scroll_duration || 500,
                breakpoint = 1024,
                scrollToOpenMobile = (options.scrollToOpenMobile !== undefined) ? options.scrollToOpenMobile : true,
                singleOpen = (options.singleOpen !== undefined) ? options.singleOpen : true,
                toggleOnDesktop = (options.toggleOnDesktop !== undefined) ? options.toggleOnDesktop : true,
                effect = (options.effect !== undefined) ? options.effect : 'slide',
                offsetTop = (options.offsetTop !== undefined) ? options.offsetTop : '',
                goToTab = options.goToTab,
                $btn_prev = $head.find('.tt-tabs__btn-prev'),
                $btn_next = $head.find('.tt-tabs__btn-next');

            function _closeTab($li, desktop) {
                var $animElem,
                    anim_obj = {
                        duration: anim_tab_duration,
                        complete: function() {
                            $(this).removeAttr('style');
                        }
                    };

                function _anim_func($animElem) {
                    switch (effect) {
                        case 'toggle':
                            $animElem.hide().removeAttr('style');
                            break;
                        case 'slide':
                            $animElem.velocity('slideUp', anim_obj);
                            break;
                        default:
                            $animElem.velocity('slideUp', anim_obj);
                    }
                };

                /*function _anim_func($animElem) {
                 if(effect === 'toggle') {
                 $animElem.hide().removeAttr('style');
                 } else if(effect === 'slide') {
                 $animElem.slideUp(anim_obj);
                 } else {
                 $animElem.slideUp(anim_obj);
                 }
                 };*/

                if (desktop || singleOpen) {
                    $head_btn.removeClass('active');
                    $animElem = $body_tab.filter('.active').removeClass('active').find('> div').stop();

                    _anim_func($animElem);
                } else {
                    var index = $head_btn.index($li);

                    $li.removeClass('active');
                    $animElem = $body_tab.eq(index).removeClass('active').find('> div').stop();

                    _anim_func($animElem);
                }
            };

            function _openTab($li, desktop, beforeOpen, afterOpen, trigger) {
                var index = $head_btn.index($li),
                    $body_li_act = $body_tab.eq(index),
                    $animElem,
                    anim_obj = {
                        duration: anim_tab_duration,
                        complete: function() {
                            if (afterOpen) afterOpen($body_li_act);
                        }
                    };

                function _anim_func($animElem) {
                    if ($head_slider.hasClass('slick-initialized')) {
                        var btn_l = $li.last().get(0).getBoundingClientRect().left,
                            btn_r = $li.last().get(0).getBoundingClientRect().right,
                            head_l = $head.get(0).getBoundingClientRect().left,
                            head_r = $head.get(0).getBoundingClientRect().right;

                        if (btn_r > head_r) $head_slider.slick('slickNext');
                        else if (btn_l < head_l) $head_slider.slick('slickPrev');
                    }

                    if (beforeOpen) beforeOpen($li.find('> span'));

                    switch (effect) {
                        case 'toggle':
                            $animElem.show();
                            if (afterOpen) afterOpen($body_li_act);
                            break;
                        case 'slide':
                            $animElem.velocity('slideDown', anim_obj);
                            break;
                        default:
                            $animElem.velocity('slideDown', anim_obj);
                    }

                    /*if(effect === 'toggle') {
                     $animElem.show();
                     if(afterOpen) afterOpen($body_li_act);
                     } else if(effect === 'slide') {
                     $animElem.slideDown(anim_obj);
                     } else {
                     $animElem.slideDown(anim_obj);
                     }*/
                };

                $li.addClass('active');
                $animElem = $body_li_act.addClass('active').find('> div').stop();

                _anim_func($animElem);
            };

            function _replaceBorder($this, animate) {
                var $btns_body = ($head_slider.hasClass('slick-initialized')) ? $head_slider.find('.slick-track') : $head;

                if (tabs_type === 'horizontal') {
                    var position = {},
                        side = trl ? 'right' : 'left';

                    if ($this.length) {
                        var span_l = $this.get(0).getBoundingClientRect()[side],
                            head_l = $btns_body.get(0).getBoundingClientRect()[side],
                            left = span_l - head_l;

                        if (trl) left *= -1;

                        position['width'] = $this.innerWidth();
                        position[side] = left;
                    } else {
                        position['width'] = 0;
                        position[side] = 0;
                    }

                } else if (tabs_type === 'vertical') {
                    if ($this.length) {
                        var span_t = $this.get(0).getBoundingClientRect().top,
                            head_t = $head.get(0).getBoundingClientRect().top,
                            position = {
                                top: span_t - head_t,
                                height: $this.innerHeight()
                            };
                    } else {
                        var position = {
                            top: 0,
                            height: 0
                        };
                    }
                }

                if (animate) $border.velocity('stop').velocity(position, anim_tab_duration);
                else $border.velocity('stop').css(position);
            };

            $head_btn.on('click', '> span', function(e, trigger) {
                var $this = $(this),
                    $li = $this.parent(),
                    wind_w = window.innerWidth,
                    desktop = wind_w > breakpoint,
                    trigger = (trigger === 'trigger') ? true : false;

                if ($li.hasClass('active')) {
                    if (desktop && !toggleOnDesktop) return;

                    _closeTab($li, desktop);

                    _replaceBorder('', true);
                } else {
                    _closeTab($li, desktop);

                    _openTab($li, desktop,
                        function($li_act) {
                            if (desktop) {
                                var animate = !trigger;

                                _replaceBorder($li_act, animate);
                            }
                        },
                        function($body_li_act) {
                            if (!desktop && !trigger && scrollToOpenMobile) {
                                var tob_t = $body_li_act.offset().top;
                                $('html, body').velocity('stop').velocity('scroll', {
                                    offset: tob_t,
                                    duration: anim_scroll_duration
                                });
                            }
                        }
                    );
                }
            });

            $body.on('click', '> div > span', function(e) {
                var $this = $(this),
                    $li = $this.parent(),
                    index = $body_tab.index($li);

                $head_btn.eq(index).find('> span').trigger('click');
            });

            function _toTab(tab, scrollTo, focus) {
                var wind_w = window.innerWidth,
                    desktop = wind_w > breakpoint,
                    header_h = 0,
                    $sticky = $(offsetTop),
                    $openTab = $head_btn.filter('[data-tab="' + tab + '"]'),
                    $scrollTo = $(scrollTo);

                if (desktop && $sticky.length) {
                    header_h = $sticky.height();
                }

                function srlToBlock() {
                    if ($scrollTo.length) {
                        $('html, body').velocity('scroll', {
                            offset: $scrollTo.offset().top - header_h,
                            duration: anim_scroll_duration,
                            complete: function() {
                                var $focus = $(focus);

                                if ($focus.length) $focus.focus();
                            }
                        });
                    }
                };

                if (!$openTab.hasClass('active')) {
                    $('html, body').velocity('stop').velocity('scroll', {
                        offset: $tabs.offset().top - header_h,
                        duration: anim_scroll_duration,
                        complete: function() {
                            _closeTab($openTab, desktop);

                            _openTab($openTab, desktop,
                                function($li_act) {
                                    _replaceBorder($li_act, true);
                                },
                                function() {
                                    srlToBlock();
                                }
                            );
                        }
                    });
                } else {
                    srlToBlock();
                }
            };

            if ($.isArray(goToTab) && goToTab.length) {
                $(goToTab).each(function() {
                    var elem = this.elem,
                        tab = this.tab,
                        scrollTo = this.scrollTo,
                        focus = this.focus;

                    $(elem).on('click', function(e) {
                        _toTab(tab, scrollTo, focus);

                        e.preventDefault();
                        return false;
                    });
                });
            }

            function _btn_disabled(currentSlide) {
                var btn_last_r = $head_btn.last().get(0).getBoundingClientRect().right,
                    head_r = $head.get(0).getBoundingClientRect().right;

                if (currentSlide === 0) $btn_prev.addClass('disabled');
                else $btn_prev.removeClass('disabled');

                if (btn_last_r <= head_r) $btn_next.addClass('disabled');
                else $btn_next.removeClass('disabled');
            };

            function _slider_init() {
                if ($head_slider.hasClass('slick-initialized')) return;

                $head.addClass('tt-tabs__head--slider');

                $head_slider.slick({
                    infinite: false,
                    slidesToShow: 1,
                    variableWidth: true,
                    draggable: false,
                    dots: false,
                    arrows: false
                });

                $head_slider.find('.slick-track').append($border);

                $btn_prev.addClass('disabled');

                $head_slider.on('afterChange', function(e, slick, currentSlide) {
                    _btn_disabled(currentSlide);
                });

                $btn_prev.on('click', function() {
                    if ($(this).hasClass('disabled')) return;
                    $head_slider.slick('slickPrev');
                });

                $btn_next.on('click', function() {
                    if ($(this).hasClass('disabled')) return;
                    $head_slider.slick('slickNext');
                });
            };

            function _slider_destroy() {
                if (!$head_slider.hasClass('slick-initialized')) return;

                $($head_slider, $btn_prev, $btn_next).off();

                $head.append($border);

                $head_slider.slick('unslick');

                $head.removeClass('tt-tabs__head--slider');
            };

            $(window).on('resize', function() {
                var wind_w = window.innerWidth,
                    desktop = wind_w > breakpoint,
                    head_w = $head.innerWidth(),
                    li_w = 0;

                $head_btn.each(function() {
                    li_w += $(this).innerWidth();
                });

                if (desktop) {
                    var $li_act = $head_btn.filter('.active'),
                        $span_act = $li_act.find('> span');

                    if (!singleOpen && $span_act.length > 1) {
                        var $save_active = $li_act.first();

                        _closeTab('', desktop);
                        _openTab($save_active, desktop);
                    }

                    if (li_w > head_w) {
                        if (tabs_type === 'horizontal') _slider_init();
                        if ($head_slider.hasClass('slick-initialized')) {
                            setTimeout(function() {
                                _btn_disabled($head_btn.index($('.tt-tabs__btn.slick-current')));
                            }, 0);
                        }
                        _replaceBorder($span_act, false);
                    } else {
                        if (tabs_type === 'horizontal') _slider_destroy();
                        _replaceBorder($span_act, false);
                    }
                } else {
                    if (tabs_type === 'horizontal') _slider_destroy();
                    $border.removeAttr('style');
                }
            });

            $head_btn.filter('[data-active="true"]').find('> span').trigger('click', ['trigger']);

            return $tabs;
        };

        $(this).each(function() {
            new ttTabs(this);
        });
    };

    var tabsObj = {
        singleOpen: true,
        anim_tab_duration: 500,
        anim_scroll_duration: 500,
        toggleOnDesktop: true,
        scrollToOpenMobile: true,
        effect: 'slide',
        offsetTop: '.tt-header[data-sticky="true"]'
    };

    $('.tt-product-page__tabs').ttTabs($.extend(tabsObj, {
        goToTab: [{
                elem: '.tt-product-head__review-count',
                tab: 'review',
                scrollTo: '.tt-review__comments'
            },
            {
                elem: '.tt-product-head__review-add, .tt-review__head > a',
                tab: 'review',
                scrollTo: '.tt-review__form',
                focus: '#reviewName'
            },
            {
                elem: '.spr-summary-actions-newreview',
                tab: 'review-shopify',
                scrollTo: '.spr-content',
                focus: '#reviewNameShopify'
            }
        ]
    }));

    $('.tt-my-account__tabs').ttTabs(tabsObj);

    $('.tt-tabs-test').ttTabs(tabsObj);
};



window.Mogo.socialIcons = function() {
    var $iconsAddThis = $('<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-58cfdc36dacf870d"></script>'),
        i = 0;

    $('.tt-product-head').append($iconsAddThis);

    function removeLabels() {
        setTimeout(function() {
            var labels = $('.at-resp-share-element');

            if (labels.length) {
                labels.find('.at-label').remove();
            } else if (i < 50) {
                removeLabels();
            }

            i++;
        }, 10);
    };

    removeLabels();
};




window.Mogo.toggleProductParam = function() {
    var $param_control = $('.tt-summary__products_param-control'),
        param = '.tt-summary__products_param';

    $param_control.on('click', function() {
        var $this = $(this),
            $param = $this.parent().find(param);

        $this.toggleClass('active');

        if ($this.hasClass('active')) {
            $param.velocity('stop').removeAttr('style').velocity('slideDown', 400);
        } else {
            $param.velocity('stop').velocity('slideUp', 400);
        }
    });

    $('.tt-summary__products_param-control--open').trigger('click');
};



window.Mogo.productGLR = function() {
    var zoomSettings = {
        zoomType: "inner",
        cursor: "crosshair",
        easing: true,
        zoomWindowFadeIn: 500,
        zoomWindowFadeOut: 500
    };

    $.widget('ui.productGallery', {
        options: {
            bp: 1024,
            bp_slick: 479,
            fotorama: {
                nav: false,
                arrows: false,
                allowfullscreen: true,
                auto: false,
                shadows: false,
                transition: 'slide',
                clicktransition: 'crossfade'
            },
            slick: {
                vertical: true,
                verticalSwiping: true,
                slidesToShow: 5,
                dots: false,
                arrows: false,
                infinite: false,
                responsive: [{
                        breakpoint: 1400,
                        settings: {
                            vertical: false,
                            verticalSwiping: false,
                            slidesToShow: 4
                        }
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            vertical: false,
                            verticalSwiping: false,
                            slidesToShow: 5
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            vertical: false,
                            verticalSwiping: false,
                            slidesToShow: 4
                        }
                    }
                ]
            },
            //zoomEnable: true,
            zoom: zoomSettings
        },
        _create: function() {
            var _self = this;

            this.$image = this.element;
            this.$main = this.$image.find('.tt-product-head__image-main');
            this.$preview = this.$image.find('.tt-product-head__image-preview');
            this.zoom_src = {};
            this.$main_act_img = null;
            this.slick_state = false;
            this.zoom_activate = true;
            this.zoom_state = false;
            this.id = 'id' + Math.ceil(Math.random() * 10000000);

            this.$main.addClass('ttg-loading');

            this.$main.find('img').each(function() {
                var $this = $(this);

                _self.zoom_src[$this.attr('src')] = $this.attr('data-zoom-image');
            });

            this.fotorama = this.$main.fotorama(this.options.fotorama).data('fotorama');

            this.$btn_full = $('<div>').addClass('fotorama__fullscreen-custom').append($('<i>').addClass('icon-resize-full-alt'));

            this.$main.append(this.$btn_full);

            this.$btn_full.on('click', function() {
                if (_self.$main.hasClass('fotorama--fullscreen')) {
                    _self.fotorama.cancelFullScreen();

                    _self._checkSlick();

                    _self.$main_act_img = _self.$main.find('.fotorama__active img');

                    _self._zoomInit();
                } else {
                    _self._zoomDestroy();

                    _self.fotorama.requestFullScreen();
                }
            });

            this.$btn_zoom_toggle = $('<div>').addClass('fotorama__btn-zoom').append($('<i>').addClass('icon-zoom-in'));

            this.$main.append(this.$btn_zoom_toggle);

            this.$btn_zoom_toggle.on('click', function() {
                if (_self.zoom_state) _self.zoomToggle('off');
                else _self.zoomToggle('on');
            });

            this.$arrow_prev = $('<div>').addClass('fotorama__arrow-custom fotorama__arrow-custom--disabled fotorama__arrow-custom-prev').append($('<i>').addClass('icon-left-open-big'));
            this.$arrow_next = $('<div>').addClass('fotorama__arrow-custom fotorama__arrow-custom--disabled fotorama__arrow-custom-next').append($('<i>').addClass('icon-right-open-big'));

            this.$main.append(this.$arrow_prev, this.$arrow_next);

            this.$arrow_prev.on('click', function() {
                _self._setEffect('crossfade', function() {
                    _self.fotorama.show('<');
                });
            });

            this.$arrow_next.on('click', function() {
                _self._setEffect('crossfade', function() {
                    _self.fotorama.show('>');
                });
            });

            this._slickInit();

            this.$image.addClass('tt-product-head__images--loaded');

            this.$main.one('fotorama:load', function(e, fotorama) {
                _self.$main_act_img = _self.$main.find('.fotorama__active img');

                _self._zoomInit();

                _self._checkBtns(fotorama);

                _self.$main.removeClass('ttg-loading');
            });

            this.$main.on('fotorama:show', function(e, fotorama) {
                _self.$main.unbind('fotorama:showend fotorama:load');

                _self._zoomDestroy();

                _self._checkSlick();

                _self._checkBtns(fotorama);

                _self.$main.one('fotorama:load', function() {
                    _self.$main_act_img = _self.$main.find('.fotorama__active img');

                    _self._zoomInit();
                });

                _self.$main.one('fotorama:showend', function(e, fotorama) {
                    if (_self.$main.find('.fotorama__active img').attr('src')) {
                        _self.$main.trigger('fotorama:load');
                    }
                });
            });

            $(window).on('resize.productgallery' + this.id, function() {
                _self._debounce(function() {
                    _self._slickInit();
                    _self._zoomDestroy();
                    _self._zoomInit();
                });
            });
        },
        _slickInit: function() {
            var _self = this,
                this_state = window.innerWidth > this.options.bp_slick ? true : false;

            if (this_state === this.slick_state) {
                if (this.$preview.hasClass('slick-initialized')) this.$preview.slick('setPosition');
                return;
            }

            if (this.$preview.hasClass('slick-initialized')) this.$preview.slick('destroy');

            this.$preview.on('init', function() {
                setTimeout(function() {
                    _self._checkSlick();
                }, 0);
            });

            if (this_state) this.$preview.slick(this.options.slick);

            this.slick_state = this_state;

            if (!this_state) {
                this.$preview.off();
                return;
            }

            this.$prev_slides = this.$preview.find('.slick-slide');

            this.$preview.on('mousedown', '.slick-slide', function() {
                $(this).one({
                    'mouseup': function(e) {
                        var $this = $(this);

                        if ($this.hasClass('current')) return;

                        var index = _self.$prev_slides.index(this);

                        _self._setEffect('crossfade', function() {
                            _self.fotorama.show(index);
                        });
                    },
                    'mousemove': function() {
                        $(this).unbind('mouseup');
                    }
                });
            });
        },
        _checkSlick: function(fotorama) {
            if (this.$main.hasClass('fotorama--fullscreen')) return;

            var index = this.fotorama.activeFrame.i;

            this.$prev_slides.removeClass('current');
            this.$prev_slides.eq(--index).addClass('current');
            this.$preview.slick('slickGoTo', index);
        },
        _checkBtns: function(fotorama) {
            var index = fotorama.activeFrame.i;

            if (index === 1) {
                this.$arrow_prev.addClass('fotorama__arrow-custom--disabled');
            } else {
                this.$arrow_prev.removeClass('fotorama__arrow-custom--disabled');
            }

            if (index === fotorama.size) {
                this.$arrow_next.addClass('fotorama__arrow-custom--disabled');
            } else {
                this.$arrow_next.removeClass('fotorama__arrow-custom--disabled');
            }
        },
        _zoomDestroy: function() {
            if (this.zoom_state && this.$zoomContainer) {
                $.removeData(this.$main_act_img, 'elevateZoom');

                this.$zoomContainer.remove();
                this.$zoomContainer = null;

                this.$main.removeClass('fotorama--zoom');

                this.zoom_state = false;
            }
        },
        _zoomInit: function() {
            if (this.$main_act_img.length && window.innerWidth > this.options.bp && this.zoom_activate && !this.$main.hasClass('fotorama--fullscreen')) {
                var _self = this,
                    set_zoom_src = this.zoom_src[this.$main_act_img.attr('src')];

                if (!set_zoom_src) return;

                this.$main_act_img.attr('data-zoom-image', set_zoom_src);;

                this.$main_act_img.elevateZoom(this.options.zoom);

                function replaceCont() {
                    setTimeout(function() {
                        _self.$zoomContainer = $('body > .zoomContainer');
                        if (_self.$zoomContainer.length) {
                            _self.$zoomContainer.appendTo(_self.$main);
                        } else {
                            replaceCont();
                        }
                    }, 20);
                };

                replaceCont();

                this.$main.addClass('fotorama--zoom');

                this.zoom_state = true;
            }
        },
        zoomToggle: function(state) {
            var $icon = this.$btn_zoom_toggle.find('i');

            $icon.removeAttr('class');

            if (state === 'on') {
                $icon.addClass('icon-zoom-in');

                this.zoom_activate = true;

                this._zoomInit();
            } else if (state === 'off') {
                $icon.addClass('icon-zoom-out');

                this.zoom_activate = false;

                this._zoomDestroy();
            }
        },
        _setEffect: function(effect, func) {
            var _self = this;

            this.fotorama.setOptions({
                transition: effect
            });

            func();

            this.$main.one('fotorama:showend', function() {
                _self.fotorama.setOptions({
                    transition: 'slide'
                });
            });
        },
        _debounce: function(func) {
            var wind_w = window.innerWidth,
                timeout;

            timeout = setInterval(function() {
                var wind_w_int = window.innerWidth;
                if (wind_w === wind_w_int) {
                    setTimeout(function() {
                        func();
                    }, 200);
                }
                clearTimeout(timeout);
            }, 100);
        },
        _init: function() {

        },
        _setOption: function(key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
        },
        destroy: function() {
            this._zoomDestroy(this.$main_act_img);

            this.$preview.unbind('mousedown');

            this.$preview.slick('destroy');

            $(this.$btn_full, this.$arrow_prev, this.$arrow_next, this.$btn_zoom_toggle).off().remove();

            this.fotorama.destroy();

            $(window).unbind('resize.productgallery' + this.id);

            $.Widget.prototype.destroy.call(this);
        }
    });

    var $images = $('.tt-product-head__images');

    if ($images.find('.tt-product-head__image-main').length) {
        $images.productGallery();
    } else {
        $images.addClass('tt-product-head__images--loaded');


    }
};



$(function() {
    for (var key in window.Mogo) {
        if (typeof window.Mogo[key] === 'function') {
            window.Mogo[key]();
        } else if (window.Mogo[key].init && typeof window.Mogo[key].init === 'function') {
            window.Mogo[key].init();
        }
    }
});




;
(function($) {
    'use strict';


    var DH = {
        init: function() {

            // Tooltip
            $('[data-toggle="popover"]').popover();
            $('[data-toggle="tooltip"]').tooltip();


            var self = this;
            var stickySize = 70;

            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                $(document.documentElement).addClass('dh-ie');
            } else {
                $(document.documentElement).addClass('dh-no-ie');
            }
            $(document.documentElement).addClass(self.enableAnimation() ? 'dh-enable-animation' : 'dh-disable-animation');

            //enable Retina Logo
            /*if (window.devicePixelRatio > 1 && dhL10n.logo_retina != '') {
            	$('.navbar-brand img').each(function(){
            		$(this).attr('src',dhL10n.logo_retina);
            	});
            }*/

            //Navbar collapse
            $('.primary-navbar-collapse').on('hide.bs.collapse', function() {
                $(this).closest('.header-container').find('.navbar-toggle').removeClass('x');
            });
            $('.primary-navbar-collapse').on('show.bs.collapse', function() {
                $(this).closest('.header-container').find('.navbar-toggle').addClass('x');

            });

            //Fixed Main Nav
            if (this.enableAnimation()) {
                var $window = $(window);
                var $body = $('body');

                var adminbarHeight = 0;
                if ($('#wpadminbar').length) {
                    adminbarHeight = parseInt($('#wpadminbar').outerHeight());
                }

                $(window).on('resize', function() {
                    if ($('#wpadminbar').length) {
                        adminbarHeight = parseInt($('#wpadminbar').outerHeight());
                    }
                });

                var navTop = $('.header-container').hasClass('header-fixed') ? ($('.topbar').length ? $('.topbar').height() : 0) : $('.navbar').offset().top;

                var navScrollListener = function($this, isResize) {
                    if (isResize) {
                        if ($body.hasClass('admin-bar')) {
                            adminbarHeight = $('#wpadminbar').height();
                        }
                    }
                    var $navbar = $('.navbar');
                    if ($('.header-container').hasClass('header-absolute') && self.getViewport().width > 900) {
                        $('.header-container').css({
                            'top': adminbarHeight + 'px'
                        });
                    } else {
                        $('.header-container').css({
                            'top': ''
                        });
                    }

                    if (($('.header-container').hasClass('header-fixed') || $navbar.hasClass('navbar-scroll-fixed')) && self.getViewport().width > 900) {

                        var scrollTop = parseInt($this.scrollTop(), 10),
                            navHeight = 0,
                            topbarOffset = 0;

                        if ($('.header-container').hasClass('header-fixed')) {
                            $('.header-container').css({
                                'top': adminbarHeight + 'px'
                            });
                            if ($('.topbar').length) {

                                if (scrollTop > 0) {
                                    if (scrollTop < $('.topbar').height()) {
                                        topbarOffset = -scrollTop;
                                        $('.header-container').css({
                                            'top': topbarOffset + 'px'
                                        });
                                    } else {
                                        $('.header-container').css({
                                            'top': -$('.topbar').height() + 'px'
                                        });
                                    }
                                } else {
                                    $('.header-container').css({
                                        'top': adminbarHeight + 'px'
                                    });
                                }
                            }
                        }
                        var navTopScroll = navTop;
                        if ($('.header-container').hasClass('header-fixed') || $('.header-container').hasClass('header-absolute'))
                            navTopScroll += adminbarHeight;

                        if (($this.scrollTop() + adminbarHeight) > (navTopScroll + 50)) {
                            if (!$('.navbar-default').hasClass('navbar-fixed-top')) {
                                $('.navbar-default').addClass('navbar-fixed-top');
                                //
                                $('.header-container').addClass('header-navbar-fixed');
                                setTimeout(function() {
                                    $('.navbar-default').addClass("fixed-transition")
                                }, 50);
                                $navbar.css({
                                    'top': adminbarHeight + 'px'
                                });
                                $('.minicart').stop(true, true).fadeOut();
                            }

                        } else {
                            if ($('.navbar-default').hasClass('navbar-fixed-top')) {
                                $('.navbar-default').removeClass('navbar-fixed-top');
                                $('.navbar-default').removeClass('fixed-transition');
                                $('.header-container').removeClass('header-navbar-fixed');
                            }
                            $navbar.css({
                                'top': ''
                            });
                            $('.minicart').stop(true, true).fadeOut();
                        }
                    } else {
                        if ($('.navbar-default').hasClass('navbar-fixed-top')) {
                            $('.navbar-default').removeClass('navbar-fixed-top');
                            $('.navbar-default').removeClass('fixed-transition');
                            $('.header-container').removeClass('header-navbar-fixed');
                        }
                        $navbar.css({
                            'top': ''
                        });
                        $('.minicart').stop(true, true).fadeOut();
                    }
                }

                navScrollListener($window);
                $window.resize(function() {
                    navScrollListener($(this), true);
                });
                $window.scroll(function() {
                    var $this = $(this);
                    navScrollListener($this, false);
                });
            }

            //Off Canvas menu
            $('.navbar-toggle').on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                if ($('body').hasClass('open-offcanvas')) {
                    $('body').removeClass('open-offcanvas').addClass('close-offcanvas');
                    $('.navbar-toggle').removeClass('x');
                } else {
                    $('body').removeClass('close-offcanvas').addClass('open-offcanvas');
                    $('.navbar-toggle').addClass('x');
                }

            });
            $('body').on('mousedown', $.proxy(function(e) {
                var element = $(e.target);
                if ($('.offcanvas').length && $('body').hasClass('open-offcanvas')) {
                    if (!element.is('.offcanvas') && element.parents('.offcanvas').length === 0 && !element.is('.navbar-toggle') && element.parents('.navbar-toggle').length === 0) {
                        $('body').removeClass('open-offcanvas');
                        $('.navbar-toggle').removeClass('x');
                    }
                }
            }, this));

            $('.offcanvas-nav .dropdown-hover .caret,.offcanvas-nav .dropdown-submenu > a > .caret,.offcanvas-nav .megamenu-title .caret').off('click').on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                var dropdown = $(this).closest(".dropdown, .dropdown-submenu");
                if (dropdown.hasClass("open")) {
                    dropdown.removeClass("open");
                } else {
                    dropdown.addClass("open");
                }
            });




            //Media element player
            this.mediaelementplayerInit();
            //DH Slider
            this.dhSliderInit();


            //Nav Dropdown
            this.navDropdown();
            $(window).resize(function() {
                self.navDropdown();
            })

            //Heading Parallax
            this.headingInit();

            //PopUp
            this.magnificpopupInit();

            //Carousel
            this.carouselInit();

            //Responsive embed iframe
            this.responsiveEmbedIframe();
            $(window).resize(function() {
                self.responsiveEmbedIframe();
            });

            //Woocommerce
            this.shopInit();

            //isotope
            this.isotopeInit();
            $(window).resize(function() {
                self.isotopeInit();
            });

            //Load more
            //this.loadmoreInit();
            //Infinite Scrolling
            //this.infiniteScrollInit();

            //Ajax Search
            this.ajaxSearchInit();

            //User Login and register account.
            this.userInit();

            //Short code
            this.shortcodeInit();

        },
        shortcodeInit: function() {

        },
        userInit: function() {
            //User Nav



            $(document).on('click', '[data-rel=registerModal]', function(e) {
                e.stopPropagation();
                e.preventDefault();
                if ($('#userloginModal').length) {
                    $('#userloginModal').modal('hide');
                }
                if ($('#userlostpasswordModal').length) {
                    $('#userlostpasswordModal').modal('hide');
                }
                if ($('#userregisterModal').length) {
                    $('#userregisterModal').modal('show');
                }
            });
            $(document).on('click', '[data-rel=loginModal]', function(e) {
                e.stopPropagation();
                e.preventDefault();
                if ($('#userregisterModal').length) {
                    $('#userregisterModal').modal('hide');
                }
                if ($('#userlostpasswordModal').length) {
                    $('#userlostpasswordModal').modal('hide');
                }
                if ($('#userloginModal').length) {
                    $('#userloginModal').modal('show');
                }
            });
            $(document).on('click', '[data-rel=lostpasswordModal]', function(e) {
                e.stopPropagation();
                e.preventDefault();
                if ($('#userregisterModal').length) {
                    $('#userregisterModal').modal('hide');
                }
                if ($('#userloginModal').length) {
                    $('#userloginModal').modal('hide');
                }
                if ($('#userlostpasswordModal').length) {
                    $('#userlostpasswordModal').modal('show');
                }
            });

            $(document).on('click', '[data-rel=quickViewModal]', function(e) {
                e.stopPropagation();
                e.preventDefault();
                if ($('.modal.product-quickview').length) {
                    $('.modal.product-quickview').modal('show');
                }




            });

        },
        ajaxSearchInit: function() {

            $(document).on('click', '.navbar-search-button', function(e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('as');
                if ($('.header-search-overlay').length) {
                    $('.header-search-overlay').stop(true, true).removeClass('hide').css('opacity', 0).animate({
                        'opacity': 1
                    }, 600, 'easeOutExpo', function() {
                        $(this).find('.searchinput').focus();
                    });
                } else if ($('.search-form-wrap').length) {
                    if ($('.search-form-wrap').hasClass('hide')) {
                        $('.search-form-wrap').removeClass('hide').addClass('show');
                        $('.search-form-wrap .searchinput').focus();
                    }
                }

            });

            $(document).on('click', '.header-search-overlay .close', function() {
                $('.header-search-overlay').stop(true, true).animate({
                    'opacity': 0
                }, 600, 'easeOutExpo', function() {
                    $(this).addClass('hide');
                });
            });
        },
        mediaelementplayerInit: function() {
            if ($().mediaelementplayer) {
                $(".video-embed:not(.video-embed-popup),.audio-embed:not(.audio-embed-popup)").dh_mediaelementplayer();
            }
        },
        /*loadmoreInit: function(){
        	var self = this;
        	$('[data-paginate="loadmore"]').each(function(){
        		var $this = $(this);
        		$this.dhLoadmore({
        			navSelector  : $this.find('div.paginate'),            
        	   	    nextSelector : $this.find('div.paginate a.next'),
        	   	    itemSelector : $this.data('itemselector'),
        	   	    finishedMsg: dhL10n.ajax_finishedMsg
        		},function(newElements){
        			self.magnificpopupInit();
        			self.responsiveEmbedIframe();
        			self.carouselInit();
        			$(newElements).find(".video-embed:not(.video-embed-popup),.audio-embed:not(.audio-embed-popup)").dh_mediaelementplayer();
        			
        			if($this.hasClass('masonry')){
        				$this.find('.masonry-wrap').isotope('appended', $(newElements));
        				if($this.find('.masonry-filter').length){
        					var selector = $this.find('.masonry-filter').find('a.selected').data('filter-value');
        					$this.find('.masonry-wrap').isotope({ filter: selector });
        				}
        			}
        			imagesLoaded(newElements,function(){
        				if($this.hasClass('masonry')){
        					$this.find('.masonry-wrap').isotope('layout');
        				}
        			});
        		});
        	});
        },
        infiniteScrollInit: function(){
        	var self = this;
        	//Posts
        	$('[data-paginate="infinite_scroll"]').each(function(){
        		var $this = $(this);
        		$this.find('.infinite-scroll-wrap').infinitescroll({
        			navSelector  : $this.find('div.paginate'),            
        	   	    nextSelector : $this.find('div.paginate a.next'),    
        	   	    itemSelector :  $this.data('itemselector'),
        	        msgText: " ", 
        	        loading: {
        	        	finishedMsg: dhL10n.ajax_finishedMsg,
        				msgText: dhL10n.ajax_msgText,
        				selector: $this,
        				msg: $('<div class="infinite-scroll-loading"><div class="fade-loading"><i></i><i></i><i></i><i></i></div><div class="infinite-scroll-loading-msg">' + dhL10n.ajax_msgText +'</div></div>')
        			},
        			errorCallback: function(){
        				$this.find('.infinite-scroll-loading-msg').html(dhL10n.ajax_finishedMsg).animate({ opacity: 1 }, 2000, function () {
        	                $(this).parent().fadeOut('fast');
        	            });
        			}
        		},function(newElements){
        			self.magnificpopupInit();
        			self.responsiveEmbedIframe();
        			self.carouselInit();
        			$(newElements).find(".video-embed:not(.video-embed-popup),.audio-embed:not(.audio-embed-popup)").dh_mediaelementplayer();
        			
        			if($this.hasClass('masonry')){
        				$this.find('.masonry-wrap').isotope('appended', $(newElements));
        				if($this.find('.masonry-filter').length){
        					var selector = $this.find('.masonry-filter').find('a.selected').data('filter-value');
        					$this.find('.masonry-wrap').isotope({ filter: selector });
        				}
        			}
        			imagesLoaded(newElements,function(){
        				if($this.hasClass('masonry')){
        					$this.find('.masonry-wrap').isotope('layout');
        				}
        			});
        		});
        	});
        	
        },*/
        carouselInit: function() {
            var self = this;
            //related post carousel
            $('.caroufredsel').each(function() {
                var $this = $(this),
                    $visible = 3,
                    $height = 'auto',
                    $circular = false,
                    $auto_play = false,
                    $scroll_fx = 'scroll',
                    $duration = 2000,
                    $items_height = 'variable',
                    $auto_pauseOnHover = 'resume',
                    $items_width = '100%',
                    $infinite = false,
                    $responsive = false,
                    $scroll_item = 1,
                    $easing = 'swing',
                    $scrollDuration = 600,
                    $direction = 'left';
                if ($this.hasClass('product-slider')) {
                    $visible = {
                        min: $(this).data('visible-min'),
                        max: $(this).find('ul.products').data('columns')
                    };
                } else {
                    if ($(this).data('visible-min') && $(this).data('visible-max')) {
                        $visible = {
                            min: $(this).data('visible-min'),
                            max: $(this).data('visible-max')
                        };
                    }
                }
                if ($(this).data('visible')) {
                    $visible = $(this).data('visible');
                }
                if ($(this).data('height')) {
                    $height = $(this).data('height');
                }
                if ($(this).data('direction')) {
                    $scrollDuration
                    $direction = $(this).data('direction');
                }
                if ($(this).data('scrollduration')) {
                    $scrollDuration = $(this).data('scrollduration');
                }
                if ($(this).data("speed")) {
                    $duration = parseInt($(this).data("speed"));
                }
                if ($(this).data("scroll-fx")) {
                    $scroll_fx = $(this).data("scroll-fx");
                }
                if ($(this).data("circular")) {
                    $circular = true;
                }
                if ($(this).data("infinite")) {
                    $infinite = true;
                }
                if ($(this).data("responsive")) {
                    $responsive = true;
                }
                if ($(this).data("autoplay")) {
                    $auto_play = true;
                }
                if ($(this).data('scroll-item')) {
                    $scroll_item = parseInt($(this).data('scroll-item'));
                }
                if ($(this).data('easing')) {
                    $easing = $(this).data('easing');
                }
                var carousel = $(this).children('.caroufredsel-wrap').children('ul.caroufredsel-items').length ? $(this).children('.caroufredsel-wrap').children('ul.caroufredsel-items') : $(this).children('.caroufredsel-wrap').find('ul');
                var carouselOptions = {
                    responsive: $responsive,
                    circular: $circular,
                    infinite: $infinite,
                    width: '100%',
                    height: $height,
                    direction: $direction,
                    auto: {
                        play: $auto_play,
                        pauseOnHover: $auto_pauseOnHover
                    },
                    swipe: {
                        onMouse: true,
                        onTouch: true
                    },
                    scroll: {
                        duration: $scrollDuration,
                        fx: $scroll_fx,
                        timeoutDuration: $duration,
                        easing: $easing,
                        wipe: true

                    },
                    items: {
                        height: $items_height,
                        visible: $visible
                    }
                };
                //console.log($(this).data('synchronise'))
                if ($this.data('synchronise')) {
                    carouselOptions.synchronise = [$this.data('synchronise'), false];
                    var synchronise = $this.data('synchronise');
                    $(synchronise).find('li').each(function(i) {
                        $(this).addClass('synchronise-index-' + i);
                        $(this).on('click', function() {
                            carousel.trigger('slideTo', [i, 0, true]);
                            return false;
                        });
                    });
                    carouselOptions.scroll.onBefore = function() {
                        $(synchronise).find('.selected').removeClass('selected');
                        var pos = $(this).triggerHandler('currentPosition');
                        $(synchronise).find('.synchronise-index-' + pos).addClass('selected');
                    };
                }
                if ($this.children('.caroufredsel-pagination').length) {
                    carouselOptions.pagination = {
                        container: $this.children('.caroufredsel-pagination')
                    };
                }
                if ($(this).children('.caroufredsel-wrap').children('.caroufredsel-prev').length && $(this).children('.caroufredsel-wrap').children('.caroufredsel-next').length) {
                    carouselOptions.prev = $(this).children('.caroufredsel-wrap').children('.caroufredsel-prev');
                    carouselOptions.next = $(this).children('.caroufredsel-wrap').children('.caroufredsel-next');
                }
                carousel.carouFredSel(carouselOptions);
                var $element = $this;
                if ($this.find('img').length == 0) $element = $('body');

                imagesLoaded($element, function() {
                    carousel.trigger('updateSizes').trigger('resize');
                });
                $this.css('opacity', '1');
            });
        },
        responsiveEmbedIframe: function() {

        },
        isotopeInit: function() {
            var self = this;


        },
        shopInit: function() {
            var self = this;
            this.added_to_cart_timeout;


            $('.shop-loop-quickview a').tooltip({
                title: "Quick view",
                html: true,
                container: $('body'),
                placement: 'top'
            });


            var variations_form = function() {
                var variations_form = $('.variations_form');
                variations_form.on('reset_image', function(event) {
                    $(this).closest('.product').find('.product-images-slider').find('ul').trigger('slideTo', 0);
                }).on('found_variation', function(event, variation) {
                    var variation_image = variation.image_src,
                        variation_link = variation.image_link,
                        variation_title = variation.image_title,
                        variation_alt = variation.image_alt;
                    var o_a = $(this).closest('.product').find('.product-thumbnails-slider .thumb a[title="' + variation_title + '"]').get(0);
                    $(o_a).trigger('click');
                });
            };
            variations_form();
            var swatch_variation_init = function(form) {
                //Stores the attribute + values that are currently available
                var variations_current = {},
                    variations_selected = {},
                    recalc = true;

                var set_selected = function(key, value) {
                    recalc = true;
                    variations_selected[key] = value;
                };

                var get_selected = function() {
                    variations_selected;
                }
                var reset_current = function() {

                }
                var update_current = function() {
                    reset_current();
                };

                var get_current = function() {
                    if (recalc) {
                        update_current();
                    }

                    return variations_current;
                };


            }

            //Shop mini cart

        },
        magnificpopupInit: function() {
            if ($().magnificPopup) {
                $("a[data-rel='magnific-popup']").magnificPopup({
                    type: 'image',
                    mainClass: 'dh-mfp-popup',
                    gallery: {
                        enabled: true
                    }
                });
                $("a[data-rel='magnific-popup-verticalfit']").magnificPopup({
                    type: 'image',
                    mainClass: 'dh-mfp-popup',
                    overflowY: 'scroll',
                    fixedContentPos: true,
                    image: {
                        verticalFit: false
                    },
                    gallery: {
                        enabled: true
                    }
                });
                $("a[data-rel='magnific-single-popup']").magnificPopup({
                    type: 'image',
                    mainClass: 'dh-mfp-popup',
                    gallery: {
                        enabled: false
                    }
                });
            }
        },
        navDropdown: function() {
            var _self = this;
            var superfishInit = function() {
                if (_self.getViewport().width > 900) {
                    $('.topbar-nav').superfish({
                        anchorClass: '.dropdown', // selector within menu context to define the submenu element to be revealed
                        hoverClass: 'open', // the class applied to hovered list items
                        pathClass: 'overideThisToUse', // the class you have applied to list items that lead to the current page
                        pathLevels: 1, // the number of levels of submenus that remain open or are restored using pathClass
                        delay: 650, // the delay in milliseconds that the mouse can remain outside a submenu without it closing
                        animation: {
                            opacity: 'show'
                        }, // an object equivalent to first parameter of jQuery’s .animate() method. Used to animate the submenu open
                        animationOut: {
                            opacity: 'hide'
                        }, // an object equivalent to first parameter of jQuery’s .animate() method Used to animate the submenu closed
                        speed: 'fast', // speed of the opening animation. Equivalent to second parameter of jQuery’s .animate() method
                        speedOut: 'fast', // speed of the closing animation. Equivalent to second parameter of jQuery’s .animate() method
                        cssArrows: true, // set to false if you want to remove the CSS-based arrow triangles
                        disableHI: false, // set to true to disable hoverIntent detection
                    });
                    $('.primary-nav').superfish({
                        anchorClass: '.dropdown', // selector within menu context to define the submenu element to be revealed
                        hoverClass: 'open', // the class applied to hovered list items
                        pathClass: 'overideThisToUse', // the class you have applied to list items that lead to the current page
                        pathLevels: 1, // the number of levels of submenus that remain open or are restored using pathClass
                        delay: 650, // the delay in milliseconds that the mouse can remain outside a submenu without it closing
                        animation: {
                            opacity: 'show'
                        }, // an object equivalent to first parameter of jQuery’s .animate() method. Used to animate the submenu open
                        animationOut: {
                            opacity: 'hide'
                        }, // an object equivalent to first parameter of jQuery’s .animate() method Used to animate the submenu closed
                        speed: 'fast', // speed of the opening animation. Equivalent to second parameter of jQuery’s .animate() method
                        speedOut: 'fast', // speed of the closing animation. Equivalent to second parameter of jQuery’s .animate() method
                        cssArrows: true, // set to false if you want to remove the CSS-based arrow triangles
                        disableHI: false, // set to true to disable hoverIntent detection
                    });
                } else {
                    $('.primary-nav').superfish('destroy'); // yup
                }
            }
            superfishInit();
            $(window).on('resize', function() {
                superfishInit();
            });

            $('.primary-nav .dropdown-hover .caret,.primary-nav .dropdown-submenu > a > .caret,.primary-nav .megamenu-title .caret').off('click').on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                var dropdown = $(this).closest(".dropdown, .dropdown-submenu");
                if (dropdown.hasClass("open")) {
                    dropdown.removeClass("open");
                } else {
                    dropdown.addClass("open");
                }
            });


        },
        headingInit: function() {
            if (this.enableAnimation()) {
                if ($('.heading-parallax').length) {
                    $('.heading-parallax').parallax('50%', .5, true, 'translate');
                }
            }
        },
        dhSliderInit: function() {
            var self = this;
            $('.dhslider').each(function() {
                var $this = $(this),
                    isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent),
                    or_height = $this.height(),
                    min_height = 250,
                    startwidth = $this.width(),
                    startheight = $this.data('height');


                var dynamicHeight = function() {
                    var slider_height = startheight,
                        slider_width = startwidth;

                    if (!$this.hasClass('dhslider-fullscreen')) {
                        if ($this.width() > self.getViewport().width) {
                            $this.css('width', '100%');
                        }
                    }

                    if ($this.hasClass('dhslider-fullscreen') && self.getViewport().width > 900) {
                        slider_width = self.getViewport().width;
                        slider_height = self.getViewport().height;
                    } else {
                        var scale_slider = $(window).width() / 1600;
                        //min height
                        if (self.getViewport().width <= 900) {
                            if (startheight * scale_slider <= min_height) {
                                slider_height = min_height;
                            } else {
                                slider_height = Math.round(startheight * scale_slider);
                            }
                        }
                    }

                    var heading_height = 0;

                    if ($('body').find('.header-container').hasClass('header-transparent') && self.getViewport().width > 900) {
                        heading_height = $('body').find('.header-container').height();
                    }
                    $this.css({
                        'height': slider_height + 'px'
                    });
                    //$this.find('.dhslider-wrap').css({'height': slider_height + 'px'});
                    $this.find('.item').css({
                        'height': slider_height + 'px'
                    });

                    var slider_width = $this.width(),
                        slider_height = $this.height(),
                        scale_h = slider_width / 1280,
                        scale_v = (slider_height - $('.header-container').height()) / 720,
                        scale = scale_h > scale_v ? scale_h : scale_v,
                        min_w = 1280 / 720 * (slider_height + 20);

                    if (scale * 1280 < min_w) {
                        scale = min_w / 1280;
                    }
                    $this.find('.video-embed-wrap').css('width', ($this.width() + 2)).css('height', ($this.height() + 2));
                    $this.find('.slider-video').width(Math.ceil(scale * 1280 + 2));
                    $this.find('.slider-video').height(Math.ceil(scale * 720 + 2));

                    var active_cation = $this.find('.active .slider-caption');

                    $this.find('.slider-caption').each(function() {
                        $(this).css('top', (((slider_height + heading_height) / 2) - ($(this).height() / 2)) + 'px');
                    });
                }

                dynamicHeight();
                $(window).resize(function() {
                    dynamicHeight();
                });
                if ($this.data('autorun') == 'yes') {
                    $this.carousel({
                        interval: parseInt($this.data('duration')),
                        pause: false
                    });
                } else {
                    $this.carousel({
                        interval: 0,
                        pause: false
                    });
                }

                $this.on('slide.bs.carousel', function() {
                    $this.find('.active .slider-caption').fadeTo(800, 0);
                });
                $this.on('slid.bs.carousel', function() {
                    $this.find('.active .slider-caption').fadeTo(0, 1);
                });

                imagesLoaded($this, function() {
                    $this.find('.dhslider-loader').fadeOut(500);
                });
                if (self.enableAnimation()) {
                    $this.find('.slider-caption').parallax('50%', .3, true, 'translate', $this);
                }

            });
        },
        getURLParameters: function(url) {
            var result = {};
            var searchIndex = url.indexOf("?");
            if (searchIndex == -1) return result;
            var sPageURL = url.substring(searchIndex + 1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                result[sParameterName[0]] = sParameterName[1];
            }
            return result;
        },
        getViewport: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },
        hex2rgba: function(hex, opacity) {
            hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
            var rgb = {
                r: hex >> 16,
                g: (hex & 0x00FF00) >> 8,
                b: (hex & 0x0000FF)
            };
            if (!rgb) return null;
            if (opacity === undefined) opacity = 1;
            return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + parseFloat(opacity) + ')';
        },
        enableAnimation: function() {
            return this.getViewport().width > 992 && !this.isTouch();
        },
        isTouch: function() {
            return !!('ontouchstart' in window) || (!!('onmsgesturechange' in window) && !!window.navigator.maxTouchPoints);
        }
    };
    $(document).ready(function() {
        DH.init();
    });

})(jQuery);




/* jshint -W071, -W074 */
/* global jQuery:false */

/* Disabled options are:
 * W071: This function has too many statements
 * W074: This function's cyclomatic complexity is too high
 */

/*
 *	jQuery ezPlus 1.1.6
 *	Demo's and documentation:
 *	http://igorlino.github.io/elevatezoom-plus/
 *
 *	licensed under MIT license.
 *	http://en.wikipedia.org/wiki/MIT_License
 *
 */


(function($, window, document, undefined) {
    var EZP = {
        init: function(options, elem) {
            var self = this;
            var $galleries;

            self.elem = elem;
            self.$elem = $(elem);

            self.imageSrc = self.$elem.data('zoom-image') ? self.$elem.data('zoom-image') : self.$elem.attr('src');

            self.options = $.extend({}, $.fn.ezPlus.options, self.responsiveConfig(options || {}));

            if (!self.options.enabled) {
                return;
            }

            //TINT OVERRIDE SETTINGS
            if (self.options.tint) {
                self.options.lensColour = 'none'; //colour of the lens background
                self.options.lensOpacity = '1'; //opacity of the lens
            }
            //INNER OVERRIDE SETTINGS
            if (self.options.zoomType === 'inner') {
                self.options.showLens = false;
            }

            //Remove alt on hover

            self.$elem.parent().removeAttr('title').removeAttr('alt');

            self.zoomImage = self.imageSrc;

            self.refresh(1);

            //Create the image swap from the gallery
            $galleries = $(self.options.gallery ? ('#' + self.options.gallery) : self.options.gallerySelector);

        },
        refresh: function(length) {
            var self = this;

            setTimeout(function() {
                self.fetch(self.imageSrc);

            }, length || self.options.refresh);
        },
        fetch: function(imgsrc) {
            //get the image
            var self = this;
            var newImg = new Image();
            newImg.onload = function() {
                //set the large image dimensions - used to calculte ratio's
                self.largeWidth = newImg.width;
                self.largeHeight = newImg.height;
                //once image is loaded start the calls
                self.startZoom();
                self.currentImage = self.imageSrc;
                //let caller know image has been loaded
                self.options.onZoomedImageLoaded(self.$elem);
            };
            self.setImageSource(newImg, imgsrc); // this must be done AFTER setting onload

            return;
        },
        setImageSource: function(image, src) {
            //sets an image's source.
            image.src = src;
        },
        startZoom: function() {
            var self = this;
            //get dimensions of the non zoomed image
            self.nzWidth = self.$elem.width();
            self.nzHeight = self.$elem.height();

            //activated elements
            self.isWindowActive = false;
            self.isLensActive = false;
            self.isTintActive = false;
            self.overWindow = false;

            //CrossFade Wrapper
            if (self.options.imageCrossfade) {
                self.zoomWrap = self.$elem.wrap('<div style="height:' + self.nzHeight + 'px;width:' + self.nzWidth + 'px;" class="zoomWrapper" />');
                self.$elem.css('position', 'absolute');
            }

            self.zoomLock = 1;
            self.scrollingLock = false;
            self.changeBgSize = false;
            self.currentZoomLevel = self.options.zoomLevel;

            //get offset of the non zoomed image
            self.nzOffset = self.$elem.offset();
            //calculate the width ratio of the large/small image
            self.widthRatio = (self.largeWidth / self.currentZoomLevel) / self.nzWidth;
            self.heightRatio = (self.largeHeight / self.currentZoomLevel) / self.nzHeight;

            function getWindowZoomStyle() {
                return 'overflow: hidden;' +
                    'background-position: 0px 0px;text-align:center;' +
                    'background-color: ' + String(self.options.zoomWindowBgColour) + ';' +
                    'width: ' + String(self.options.zoomWindowWidth) + 'px;' +
                    'height: ' + String(self.options.zoomWindowHeight) + 'px;' +
                    'float: left;' +
                    'background-size: ' + self.largeWidth / self.currentZoomLevel + 'px ' + self.largeHeight / self.currentZoomLevel + 'px;' +
                    'display: none;z-index:100;' +
                    'border: ' + String(self.options.borderSize) + 'px solid ' + self.options.borderColour + ';' +
                    'background-repeat: no-repeat;' +
                    'position: absolute;';
            }

            //if window zoom
            if (self.options.zoomType === 'window') {
                self.zoomWindowStyle = getWindowZoomStyle();
            }

            function getInnerZoomStyle() {
                //has a border been put on the image? Lets cater for this
                var borderWidth = self.$elem.css('border-left-width');

                return 'overflow: hidden;' +
                    'margin-left: ' + String(borderWidth) + ';' +
                    'margin-top: ' + String(borderWidth) + ';' +
                    'background-position: 0px 0px;' +
                    'width: ' + String(self.nzWidth) + 'px;' +
                    'height: ' + String(self.nzHeight) + 'px;' +
                    'float: left;' +
                    'display: none;' +
                    'cursor:' + (self.options.cursor) + ';' +
                    'px solid ' + self.options.borderColour + ';' +
                    'background-repeat: no-repeat;' +
                    'position: absolute;';
            }

            //if inner  zoom
            if (self.options.zoomType === 'inner') {
                self.zoomWindowStyle = getInnerZoomStyle();
            }

            function getWindowLensStyle() {
                var lensHeight, lensWidth;
                // adjust images less than the window height

                if (self.nzHeight < self.options.zoomWindowHeight / self.heightRatio) {
                    lensHeight = self.nzHeight;
                } else {
                    lensHeight = String(self.options.zoomWindowHeight / self.heightRatio);
                }
                if (self.largeWidth < self.options.zoomWindowWidth) {
                    lensWidth = self.nzWidth;
                } else {
                    lensWidth = String(self.options.zoomWindowWidth / self.widthRatio);
                }

                return 'background-position: 0px 0px;width: ' + String((self.options.zoomWindowWidth) / self.widthRatio) + 'px;' +
                    'height: ' + String((self.options.zoomWindowHeight) / self.heightRatio) +
                    'px;float: right;display: none;' +
                    'overflow: hidden;' +
                    'z-index: 999;' +
                    'opacity:' + (self.options.lensOpacity) + ';filter: alpha(opacity = ' + (self.options.lensOpacity * 100) + '); zoom:1;' +
                    'width:' + lensWidth + 'px;' +
                    'height:' + lensHeight + 'px;' +
                    'background-color:' + (self.options.lensColour) + ';' +
                    'cursor:' + (self.options.cursor) + ';' +
                    'border: ' + (self.options.lensBorderSize) + 'px' +
                    ' solid ' + (self.options.lensBorderColour) + ';background-repeat: no-repeat;position: absolute;';
            }

            //lens style for window zoom
            if (self.options.zoomType === 'window') {
                self.lensStyle = getWindowLensStyle();
            }

            //tint style
            self.tintStyle = 'display: block;' +
                'position: absolute;' +
                'background-color: ' + self.options.tintColour + ';' +
                'filter:alpha(opacity=0);' +
                'opacity: 0;' +
                'width: ' + self.nzWidth + 'px;' +
                'height: ' + self.nzHeight + 'px;';

            //lens style for lens zoom with optional round for modern browsers
            self.lensRound = '';

            if (self.options.zoomType === 'lens') {
                self.lensStyle = 'background-position: 0px 0px;' +
                    'float: left;display: none;' +
                    'border: ' + String(self.options.borderSize) + 'px solid ' + self.options.borderColour + ';' +
                    'width:' + String(self.options.lensSize) + 'px;' +
                    'height:' + String(self.options.lensSize) + 'px;' +
                    'background-repeat: no-repeat;position: absolute;';
            }

            //does not round in all browsers
            if (self.options.lensShape === 'round') {
                self.lensRound = 'border-top-left-radius: ' + String(self.options.lensSize / 2 + self.options.borderSize) + 'px;' +
                    'border-top-right-radius: ' + String(self.options.lensSize / 2 + self.options.borderSize) + 'px;' +
                    'border-bottom-left-radius: ' + String(self.options.lensSize / 2 + self.options.borderSize) + 'px;' +
                    'border-bottom-right-radius: ' + String(self.options.lensSize / 2 + self.options.borderSize) + 'px;';
            }

            //create the div's                                                + ""
            //self.zoomContainer = $('<div/>').addClass('zoomContainer').css({"position":"relative", "height":self.nzHeight, "width":self.nzWidth});

            self.zoomContainer =
                $('<div class="zoomContainer" style="' +
                    'position:absolute;' +
                    'left:' + self.nzOffset.left + 'px;' +
                    'top:' + self.nzOffset.top + 'px;' +
                    'height:' + self.nzHeight + 'px;' + '' +
                    'width:' + self.nzWidth + 'px;' +
                    'z-index:' + self.options.zIndex + '"></div>');
            $(self.options.zoomContainerAppendTo).append(self.zoomContainer);

            //this will add overflow hidden and contrain the lens on lens mode
            if (self.options.containLensZoom && self.options.zoomType === 'lens') {
                self.zoomContainer.css('overflow', 'hidden');
            }
            if (self.options.zoomType !== 'inner') {
                self.zoomLens = $('<div class="zoomLens" style="' + self.lensStyle + self.lensRound + '">&nbsp;</div>')
                    .appendTo(self.zoomContainer)
                    .click(function() {
                        self.$elem.trigger('click');
                    });

                if (self.options.tint) {
                    self.tintContainer = $('<div/>').addClass('tintContainer');
                    self.zoomTint = $('<div class="zoomTint" style="' + self.tintStyle + '"></div>');

                    self.zoomLens.wrap(self.tintContainer);

                    self.zoomTintcss = self.zoomLens.after(self.zoomTint);

                    //if tint enabled - set an image to show over the tint

                    self.zoomTintImage = $('<img style="' +
                            'position: absolute; left: 0px; top: 0px; max-width: none; ' +
                            'width: ' + self.nzWidth + 'px; ' +
                            'height: ' + self.nzHeight + 'px;" ' +
                            'src="' + self.imageSrc + '">')
                        .appendTo(self.zoomLens)
                        .click(function() {

                            self.$elem.trigger('click');
                        });
                }
            }

            var targetZoomContainer = isNaN(self.options.zoomWindowPosition) ? 'body' : self.zoomContainer;
            //create zoom window
            self.zoomWindow = $('<div style="z-index:999;' +
                    'left:' + (self.windowOffsetLeft) + 'px;' +
                    'top:' + (self.windowOffsetTop) + 'px;' + self.zoomWindowStyle + '" class="zoomWindow">&nbsp;</div>')
                .appendTo(targetZoomContainer).click(function() {
                    self.$elem.trigger('click');
                });
            self.zoomWindowContainer = $('<div/>').addClass('zoomWindowContainer').css('width', self.options.zoomWindowWidth);
            self.zoomWindow.wrap(self.zoomWindowContainer);

            //  self.captionStyle = "text-align: left;background-color: black;'+
            // 'color: white;font-weight: bold;padding: 10px;font-family: sans-serif;font-size: 11px";
            // self.zoomCaption = $('<div class="ezplus-caption" '+
            // 'style="'+self.captionStyle+'display: block; width: 280px;">INSERT ALT TAG</div>').appendTo(self.zoomWindow.parent());

            if (self.options.zoomType === 'lens') {
                self.zoomLens.css('background-image', 'url("' + self.imageSrc + '")');
            }
            if (self.options.zoomType === 'window') {
                self.zoomWindow.css('background-image', 'url("' + self.imageSrc + '")');
            }
            if (self.options.zoomType === 'inner') {
                self.zoomWindow.css('background-image', 'url("' + self.imageSrc + '")');
            }

            /*-------------------END THE ZOOM WINDOW AND LENS----------------------------------*/
            if (self.options.touchEnabled) {
                //touch events
                self.$elem.bind('touchmove', function(e) {
                    e.preventDefault();
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    self.setPosition(touch);
                });
                self.zoomContainer.bind('touchmove', function(e) {
                    if (self.options.zoomType === 'inner') {
                        self.showHideWindow('show');

                    }
                    e.preventDefault();
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    self.setPosition(touch);

                });
                self.zoomContainer.bind('touchend', function(e) {
                    self.showHideWindow('hide');
                    if (self.options.showLens) {
                        self.showHideLens('hide');
                    }
                    if (self.options.tint && self.options.zoomType !== 'inner') {
                        self.showHideTint('hide');
                    }
                });

                self.$elem.bind('touchend', function(e) {
                    self.showHideWindow('hide');
                    if (self.options.showLens) {
                        self.showHideLens('hide');
                    }
                    if (self.options.tint && self.options.zoomType !== 'inner') {
                        self.showHideTint('hide');
                    }
                });
                if (self.options.showLens) {
                    self.zoomLens.bind('touchmove', function(e) {

                        e.preventDefault();
                        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                        self.setPosition(touch);
                    });

                    self.zoomLens.bind('touchend', function(e) {
                        self.showHideWindow('hide');
                        if (self.options.showLens) {
                            self.showHideLens('hide');
                        }
                        if (self.options.tint && self.options.zoomType !== 'inner') {
                            self.showHideTint('hide');
                        }
                    });
                }
            }
            //Needed to work in IE
            self.$elem.bind('mousemove', function(e) {
                if (self.overWindow === false) {
                    self.setElements('show');
                }
                //make sure on orientation change the setposition is not fired
                if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
                    self.setPosition(e);
                    self.currentLoc = e;
                }
                self.lastX = e.clientX;
                self.lastY = e.clientY;

            });

            self.zoomContainer.bind('click', self.options.onImageClick);

            self.zoomContainer.bind('mousemove', function(e) {
                if (self.overWindow === false) {
                    self.setElements('show');
                }
                mouseMoveZoomHandler(e);
            });

            function mouseMoveZoomHandler(e) {
                //self.overWindow = true;
                //make sure on orientation change the setposition is not fired
                if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
                    self.setPosition(e);
                    self.currentLoc = e;
                }
                self.lastX = e.clientX;
                self.lastY = e.clientY;
            }

            var elementToTrack = null;
            if (self.options.zoomType !== 'inner') {
                elementToTrack = self.zoomLens;
            }
            if (self.options.tint && self.options.zoomType !== 'inner') {
                elementToTrack = self.zoomTint;
            }
            if (self.options.zoomType === 'inner') {
                elementToTrack = self.zoomWindow;
            }

            //register the mouse tracking
            if (elementToTrack) {
                elementToTrack.bind('mousemove', mouseMoveZoomHandler);
            }

            //  lensFadeOut: 500,  zoomTintFadeIn
            self.zoomContainer.add(self.$elem).mouseenter(function() {
                if (self.overWindow === false) {
                    self.setElements('show');
                }
            }).mouseleave(function() {
                if (!self.scrollLock) {
                    self.setElements('hide');
                    self.options.onDestroy(self.$elem);
                }
            });
            //end ove image

            if (self.options.zoomType !== 'inner') {
                self.zoomWindow.mouseenter(function() {
                    self.overWindow = true;
                    self.setElements('hide');
                }).mouseleave(function() {
                    self.overWindow = false;
                });
            }
            //end ove image

            // var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail);

            //      $(this).empty();
            //    return false;

            //fix for initial zoom setting
            //if (self.options.zoomLevel !== 1) {
            //    	self.changeZoomLevel(self.currentZoomLevel);
            //}
            //set the min zoomlevel
            if (self.options.minZoomLevel) {
                self.minZoomLevel = self.options.minZoomLevel;
            } else {
                self.minZoomLevel = self.options.scrollZoomIncrement * 2;
            }

            if (self.options.scrollZoom) {
                self.zoomContainer.add(self.$elem).bind('wheel DOMMouseScroll MozMousePixelScroll', function(e) {
                    // in IE there is issue with firing of mouseleave - So check whether still scrolling
                    // and on mouseleave check if scrolllock
                    self.scrollLock = true;
                    clearTimeout($.data(this, 'timer'));
                    $.data(this, 'timer', setTimeout(function() {
                        self.scrollLock = false;
                        //do something
                    }, 250));

                    var theEvent = e.originalEvent.deltaY || e.originalEvent.detail * -1;

                    //this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                    //   e.preventDefault();

                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();

                    if (theEvent / 120 > 0) {
                        //scrolling up
                        if (self.currentZoomLevel >= self.minZoomLevel) {
                            self.changeZoomLevel(self.currentZoomLevel - self.options.scrollZoomIncrement);
                        }
                    } else {
                        //scrolling down

                        //Check if it has to maintain original zoom window aspect ratio or not
                        if ((!self.fullheight && !self.fullwidth) || !self.options.mantainZoomAspectRatio) {
                            if (self.options.maxZoomLevel) {
                                if (self.currentZoomLevel <= self.options.maxZoomLevel) {
                                    self.changeZoomLevel(parseFloat(self.currentZoomLevel) + self.options.scrollZoomIncrement);
                                }
                            } else {
                                //andy
                                self.changeZoomLevel(parseFloat(self.currentZoomLevel) + self.options.scrollZoomIncrement);
                            }
                        }
                    }
                    return false;
                });
            }
        },
        setElements: function(type) {
            var self = this;
            if (!self.options.zoomEnabled) {
                return false;
            }
            if (type === 'show') {
                if (self.isWindowSet) {
                    if (self.options.zoomType === 'inner') {
                        self.showHideWindow('show');
                    }
                    if (self.options.zoomType === 'window') {
                        self.showHideWindow('show');
                    }
                    if (self.options.showLens) {
                        self.showHideLens('show');
                    }
                    if (self.options.tint && self.options.zoomType !== 'inner') {
                        self.showHideTint('show');
                    }
                }
            }

            if (type === 'hide') {
                if (self.options.zoomType === 'window') {
                    self.showHideWindow('hide');
                }
                if (!self.options.tint) {
                    self.showHideWindow('hide');
                }
                if (self.options.showLens) {
                    self.showHideLens('hide');
                }
                if (self.options.tint) {
                    self.showHideTint('hide');
                }
            }
        },
        setPosition: function(e) {

            var self = this;

            if (!self.options.zoomEnabled) {
                return false;
            }

            //recaclc offset each time in case the image moves
            //this can be caused by other on page elements
            self.nzHeight = self.$elem.height();
            self.nzWidth = self.$elem.width();
            self.nzOffset = self.$elem.offset();

            if (self.options.tint && self.options.zoomType !== 'inner') {
                self.zoomTint.css({
                    top: 0,
                    left: 0
                });
            }
            //set responsive
            //will checking if the image needs changing before running this code work faster?
            if (self.options.responsive && !self.options.scrollZoom) {
                if (self.options.showLens) {
                    var lensHeight, lensWidth;
                    if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
                        lensHeight = self.nzHeight;
                    } else {
                        lensHeight = String((self.options.zoomWindowHeight / self.heightRatio));
                    }
                    if (self.largeWidth < self.options.zoomWindowWidth) {
                        lensWidth = self.nzWidth;
                    } else {
                        lensWidth = (self.options.zoomWindowWidth / self.widthRatio);
                    }
                    self.widthRatio = self.largeWidth / self.nzWidth;
                    self.heightRatio = self.largeHeight / self.nzHeight;
                    if (self.options.zoomType !== 'lens') {
                        //possibly dont need to keep recalcalculating
                        //if the lens is heigher than the image, then set lens size to image size
                        if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
                            lensHeight = self.nzHeight;

                        } else {
                            lensHeight = String((self.options.zoomWindowHeight / self.heightRatio));
                        }

                        if (self.nzWidth < self.options.zoomWindowHeight / self.heightRatio) {
                            lensWidth = self.nzWidth;
                        } else {
                            lensWidth = String((self.options.zoomWindowWidth / self.widthRatio));
                        }

                        self.zoomLens.css({
                            'width': lensWidth,
                            'height': lensHeight
                        });

                        if (self.options.tint) {
                            self.zoomTintImage.css({
                                'width': self.nzWidth,
                                'height': self.nzHeight
                            });
                        }

                    }
                    if (self.options.zoomType === 'lens') {
                        self.zoomLens.css({
                            width: String(self.options.lensSize) + 'px',
                            height: String(self.options.lensSize) + 'px'
                        });
                    }
                    //end responsive image change
                }
            }

            //container fix
            self.zoomContainer.css({
                top: self.nzOffset.top,
                left: self.nzOffset.left
            });
            self.mouseLeft = parseInt(e.pageX - self.nzOffset.left);
            self.mouseTop = parseInt(e.pageY - self.nzOffset.top);
            //calculate the Location of the Lens

            //calculate the bound regions - but only if zoom window
            if (self.options.zoomType === 'window') {
                var zoomLensHeight = self.zoomLens.height() / 2;
                var zoomLensWidth = self.zoomLens.width() / 2;
                self.Etoppos = (self.mouseTop < 0 + zoomLensHeight);
                self.Eboppos = (self.mouseTop > self.nzHeight - zoomLensHeight - (self.options.lensBorderSize * 2));
                self.Eloppos = (self.mouseLeft < 0 + zoomLensWidth);
                self.Eroppos = (self.mouseLeft > (self.nzWidth - zoomLensWidth - (self.options.lensBorderSize * 2)));
            }
            //calculate the bound regions - but only for inner zoom
            if (self.options.zoomType === 'inner') {
                self.Etoppos = (self.mouseTop < ((self.nzHeight / 2) / self.heightRatio));
                self.Eboppos = (self.mouseTop > (self.nzHeight - ((self.nzHeight / 2) / self.heightRatio)));
                self.Eloppos = (self.mouseLeft < 0 + (((self.nzWidth / 2) / self.widthRatio)));
                self.Eroppos = (self.mouseLeft > (self.nzWidth - (self.nzWidth / 2) / self.widthRatio - (self.options.lensBorderSize * 2)));
            }

            // if the mouse position of the slider is one of the outerbounds, then hide  window and lens
            if (self.mouseLeft < 0 || self.mouseTop < 0 || self.mouseLeft > self.nzWidth || self.mouseTop > self.nzHeight) {
                self.setElements('hide');
                return;
            }
            //else continue with operations
            else {
                //lens options
                if (self.options.showLens) {
                    //		self.showHideLens('show');
                    //set background position of lens
                    self.lensLeftPos = String(Math.floor(self.mouseLeft - self.zoomLens.width() / 2));
                    self.lensTopPos = String(Math.floor(self.mouseTop - self.zoomLens.height() / 2));
                }
                //adjust the background position if the mouse is in one of the outer regions

                //Top region
                if (self.Etoppos) {
                    self.lensTopPos = 0;
                }
                //Left Region
                if (self.Eloppos) {
                    self.windowLeftPos = 0;
                    self.lensLeftPos = 0;
                    self.tintpos = 0;
                }
                //Set bottom and right region for window mode
                if (self.options.zoomType === 'window') {
                    if (self.Eboppos) {
                        self.lensTopPos = Math.max((self.nzHeight) - self.zoomLens.height() - (self.options.lensBorderSize * 2), 0);
                    }
                    if (self.Eroppos) {
                        self.lensLeftPos = (self.nzWidth - (self.zoomLens.width()) - (self.options.lensBorderSize * 2));
                    }
                }
                //Set bottom and right region for inner mode
                if (self.options.zoomType === 'inner') {
                    if (self.Eboppos) {
                        self.lensTopPos = Math.max(((self.nzHeight) - (self.options.lensBorderSize * 2)), 0);
                    }
                    if (self.Eroppos) {
                        self.lensLeftPos = (self.nzWidth - (self.nzWidth) - (self.options.lensBorderSize * 2));
                    }
                }
                //if lens zoom
                if (self.options.zoomType === 'lens') {

                    self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomLens.width() / 2) * (-1));
                    self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomLens.height() / 2) * (-1));
                    self.zoomLens.css('background-position', self.windowLeftPos + 'px ' + self.windowTopPos + 'px');

                    if (self.changeBgSize) {
                        if (self.nzHeight > self.nzWidth) {
                            if (self.options.zoomType === 'lens') {
                                self.zoomLens.css('background-size',
                                    self.largeWidth / self.newvalueheight + 'px ' +
                                    self.largeHeight / self.newvalueheight + 'px');
                            }

                            self.zoomWindow.css('background-size',
                                self.largeWidth / self.newvalueheight + 'px ' +
                                self.largeHeight / self.newvalueheight + 'px');
                        } else {
                            if (self.options.zoomType === 'lens') {
                                self.zoomLens.css('background-size',
                                    self.largeWidth / self.newvaluewidth + 'px ' +
                                    self.largeHeight / self.newvaluewidth + 'px');
                            }
                            self.zoomWindow.css('background-size',
                                self.largeWidth / self.newvaluewidth + 'px ' +
                                self.largeHeight / self.newvaluewidth + 'px');
                        }
                        self.changeBgSize = false;
                    }

                    self.setWindowPosition(e);
                }
                //if tint zoom
                if (self.options.tint && self.options.zoomType !== 'inner') {
                    self.setTintPosition(e);
                }
                //set the css background position
                if (self.options.zoomType === 'window') {
                    self.setWindowPosition(e);
                }
                if (self.options.zoomType === 'inner') {
                    self.setWindowPosition(e);
                }
                if (self.options.showLens) {
                    if (self.fullwidth && self.options.zoomType !== 'lens') {
                        self.lensLeftPos = 0;
                    }
                    self.zoomLens.css({
                        left: self.lensLeftPos + 'px',
                        top: self.lensTopPos + 'px'
                    });
                }

            } //end else
        },

        showHideWindow: function(change) {
            var self = this;
            if (change === 'show') {
                if (!self.isWindowActive && self.zoomWindow) {
                    self.options.onShow(self);
                    if (self.options.zoomWindowFadeIn) {
                        self.zoomWindow.stop(true, true, false).fadeIn(self.options.zoomWindowFadeIn);
                    } else {
                        self.zoomWindow.show();
                    }
                    self.isWindowActive = true;
                }
            }
            if (change === 'hide') {
                if (self.isWindowActive) {
                    if (self.options.zoomWindowFadeOut) {
                        self.zoomWindow.stop(true, true).fadeOut(self.options.zoomWindowFadeOut, function() {
                            if (self.loop) {
                                //stop moving the zoom window when zoom window is faded out
                                clearInterval(self.loop);
                                self.loop = false;
                            }
                        });
                    } else {
                        self.zoomWindow.hide();
                    }
                    self.isWindowActive = false;
                }
            }
        },
        showHideLens: function(change) {
            var self = this;
            if (change === 'show') {
                if (!self.isLensActive) {
                    if (self.options.lensFadeIn && self.zoomLens) {
                        self.zoomLens.stop(true, true, false).fadeIn(self.options.lensFadeIn);
                    } else {
                        self.zoomLens.show();
                    }
                    self.isLensActive = true;
                }
            }
            if (change === 'hide') {
                if (self.isLensActive) {
                    if (self.options.lensFadeOut) {
                        self.zoomLens.stop(true, true).fadeOut(self.options.lensFadeOut);
                    } else {
                        self.zoomLens.hide();
                    }
                    self.isLensActive = false;
                }
            }
        },




        setWindowPosition: function(e) {
            //return obj.slice( 0, count );
            var self = this;

            if (!isNaN(self.options.zoomWindowPosition)) {

                switch (self.options.zoomWindowPosition) {
                    case 1: //done
                        self.windowOffsetTop = (self.options.zoomWindowOffsetY); //DONE - 1
                        self.windowOffsetLeft = (+self.nzWidth); //DONE 1, 2, 3, 4, 16
                        break;
                    case 2:
                        if (self.options.zoomWindowHeight > self.nzHeight) { //positive margin

                            self.windowOffsetTop = ((self.options.zoomWindowHeight / 2) - (self.nzHeight / 2)) * (-1);
                            self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                        } else { //negative margin
                            $.noop();
                        }
                        break;
                    case 3: //done
                        self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize * 2)); //DONE 3,9
                        self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                        break;
                    case 4: //done
                        self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
                        self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                        break;
                    case 5: //done
                        self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
                        self.windowOffsetLeft = (self.nzWidth - self.zoomWindow.width() - (self.options.borderSize * 2)); //DONE - 5,15
                        break;
                    case 6:
                        if (self.options.zoomWindowHeight > self.nzHeight) { //positive margin
                            self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8

                            self.windowOffsetLeft = ((self.options.zoomWindowWidth / 2) - (self.nzWidth / 2) + (self.options.borderSize * 2)) * (-1);
                        } else { //negative margin
                            $.noop();
                        }

                        break;
                    case 7: //done
                        self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
                        self.windowOffsetLeft = 0; //DONE 7, 13
                        break;
                    case 8: //done
                        self.windowOffsetTop = (self.nzHeight); //DONE - 4,5,6,7,8
                        self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1); //DONE 8,9,10,11,12
                        break;
                    case 9: //done
                        self.windowOffsetTop = (self.nzHeight - self.zoomWindow.height() - (self.options.borderSize * 2)); //DONE 3,9
                        self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1); //DONE 8,9,10,11,12
                        break;
                    case 10:
                        if (self.options.zoomWindowHeight > self.nzHeight) { //positive margin

                            self.windowOffsetTop = ((self.options.zoomWindowHeight / 2) - (self.nzHeight / 2)) * (-1);
                            self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1); //DONE 8,9,10,11,12
                        } else { //negative margin
                            $.noop();
                        }
                        break;
                    case 11:
                        self.windowOffsetTop = (self.options.zoomWindowOffsetY);
                        self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1); //DONE 8,9,10,11,12
                        break;
                    case 12: //done
                        self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16
                        self.windowOffsetLeft = (self.zoomWindow.width() + (self.options.borderSize * 2)) * (-1); //DONE 8,9,10,11,12
                        break;
                    case 13: //done
                        self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16
                        self.windowOffsetLeft = (0); //DONE 7, 13
                        break;
                    case 14:
                        if (self.options.zoomWindowHeight > self.nzHeight) { //positive margin
                            self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16

                            self.windowOffsetLeft = ((self.options.zoomWindowWidth / 2) - (self.nzWidth / 2) + (self.options.borderSize * 2)) * (-1);
                        } else { //negative margin
                            $.noop();
                        }
                        break;
                    case 15: //done
                        self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16
                        self.windowOffsetLeft = (self.nzWidth - self.zoomWindow.width() - (self.options.borderSize * 2)); //DONE - 5,15
                        break;
                    case 16: //done
                        self.windowOffsetTop = (self.zoomWindow.height() + (self.options.borderSize * 2)) * (-1); //DONE 12,13,14,15,16
                        self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                        break;
                    default: //done
                        self.windowOffsetTop = (self.options.zoomWindowOffsetY); //DONE - 1
                        self.windowOffsetLeft = (self.nzWidth); //DONE 1, 2, 3, 4, 16
                }
            } //end isNAN
            else {
                //WE CAN POSITION IN A CLASS - ASSUME THAT ANY STRING PASSED IS
                self.externalContainer = $('#' + self.options.zoomWindowPosition);
                self.externalContainerWidth = self.externalContainer.width();
                self.externalContainerHeight = self.externalContainer.height();
                self.externalContainerOffset = self.externalContainer.offset();

                self.windowOffsetTop = self.externalContainerOffset.top; //DONE - 1
                self.windowOffsetLeft = self.externalContainerOffset.left; //DONE 1, 2, 3, 4, 16

            }
            self.isWindowSet = true;
            self.windowOffsetTop = self.windowOffsetTop + self.options.zoomWindowOffsetY;
            self.windowOffsetLeft = self.windowOffsetLeft + self.options.zoomWindowOffsetX;

            self.zoomWindow.css({
                top: self.windowOffsetTop,
                left: self.windowOffsetLeft
            });

            if (self.options.zoomType === 'inner') {
                self.zoomWindow.css({
                    top: 0,
                    left: 0
                });

            }

            self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1));
            self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));
            if (self.Etoppos) {
                self.windowTopPos = 0;
            }
            if (self.Eloppos) {
                self.windowLeftPos = 0;
            }
            if (self.Eboppos) {
                self.windowTopPos = (self.largeHeight / self.currentZoomLevel - self.zoomWindow.height()) * (-1);
            }
            if (self.Eroppos) {
                self.windowLeftPos = ((self.largeWidth / self.currentZoomLevel - self.zoomWindow.width()) * (-1));
            }

            //stops micro movements
            if (self.fullheight) {
                self.windowTopPos = 0;
            }
            if (self.fullwidth) {
                self.windowLeftPos = 0;
            }

            //set the css background position
            if (self.options.zoomType === 'window' || self.options.zoomType === 'inner') {

                if (self.zoomLock === 1) {
                    //overrides for images not zoomable
                    if (self.widthRatio <= 1) {
                        self.windowLeftPos = 0;
                    }
                    if (self.heightRatio <= 1) {
                        self.windowTopPos = 0;
                    }
                }
                // adjust images less than the window height

                if (self.options.zoomType === 'window') {
                    if (self.largeHeight < self.options.zoomWindowHeight) {
                        self.windowTopPos = 0;
                    }
                    if (self.largeWidth < self.options.zoomWindowWidth) {
                        self.windowLeftPos = 0;
                    }
                }
                //set the zoomwindow background position
                if (self.options.easing) {

                    //     if(self.changeZoom){
                    //           clearInterval(self.loop);
                    //           self.changeZoom = false;
                    //           self.loop = false;

                    //            }
                    //set the pos to 0 if not set
                    if (!self.xp) {
                        self.xp = 0;
                    }
                    if (!self.yp) {
                        self.yp = 0;
                    }
                    //if loop not already started, then run it
                    if (!self.loop) {
                        self.loop = setInterval(function() {
                            //using zeno's paradox

                            self.xp += (self.windowLeftPos - self.xp) / self.options.easingAmount;
                            self.yp += (self.windowTopPos - self.yp) / self.options.easingAmount;
                            if (self.scrollingLock) {

                                clearInterval(self.loop);
                                self.xp = self.windowLeftPos;
                                self.yp = self.windowTopPos;

                                self.xp = ((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * (-1);
                                self.yp = (((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * (-1));

                                if (self.changeBgSize) {
                                    if (self.nzHeight > self.nzWidth) {
                                        if (self.options.zoomType === 'lens') {
                                            self.zoomLens.css('background-size',
                                                self.largeWidth / self.newvalueheight + 'px ' +
                                                self.largeHeight / self.newvalueheight + 'px');
                                        }
                                        self.zoomWindow.css('background-size',
                                            self.largeWidth / self.newvalueheight + 'px ' +
                                            self.largeHeight / self.newvalueheight + 'px');
                                    } else {
                                        if (self.options.zoomType !== 'lens') {
                                            self.zoomLens.css('background-size',
                                                self.largeWidth / self.newvaluewidth + 'px ' +
                                                self.largeHeight / self.newvalueheight + 'px');
                                        }
                                        self.zoomWindow.css('background-size',
                                            self.largeWidth / self.newvaluewidth + 'px ' +
                                            self.largeHeight / self.newvaluewidth + 'px');
                                    }

                                    /*
                                     if(!self.bgxp){self.bgxp = self.largeWidth/self.newvalue;}
                                     if(!self.bgyp){self.bgyp = self.largeHeight/self.newvalue ;}
                                     if (!self.bgloop){
                                     self.bgloop = setInterval(function(){

                                     self.bgxp += (self.largeWidth/self.newvalue  - self.bgxp) / self.options.easingAmount;
                                     self.bgyp += (self.largeHeight/self.newvalue  - self.bgyp) / self.options.easingAmount;

                                     self.zoomWindow.css('background-size', self.bgxp + 'px ' + self.bgyp + 'px' );


                                     }, 16);

                                     }
                                     */
                                    self.changeBgSize = false;
                                }

                                self.zoomWindow.css('background-position', self.windowLeftPos + 'px ' + self.windowTopPos + 'px');
                                self.scrollingLock = false;
                                self.loop = false;

                            } else if (Math.round(Math.abs(self.xp - self.windowLeftPos) + Math.abs(self.yp - self.windowTopPos)) < 1) {
                                //stops micro movements
                                clearInterval(self.loop);
                                self.zoomWindow.css('background-position', self.windowLeftPos + 'px ' + self.windowTopPos + 'px');
                                self.loop = false;
                            } else {
                                if (self.changeBgSize) {
                                    if (self.nzHeight > self.nzWidth) {
                                        if (self.options.zoomType === 'lens') {
                                            self.zoomLens.css('background-size',
                                                self.largeWidth / self.newvalueheight + 'px ' +
                                                self.largeHeight / self.newvalueheight + 'px');
                                        }
                                        self.zoomWindow.css('background-size',
                                            self.largeWidth / self.newvalueheight + 'px ' +
                                            self.largeHeight / self.newvalueheight + 'px');
                                    } else {
                                        if (self.options.zoomType !== 'lens') {
                                            self.zoomLens.css('background-size',
                                                self.largeWidth / self.newvaluewidth + 'px ' +
                                                self.largeHeight / self.newvaluewidth + 'px');
                                        }
                                        self.zoomWindow.css('background-size',
                                            self.largeWidth / self.newvaluewidth + 'px ' +
                                            self.largeHeight / self.newvaluewidth + 'px');
                                    }
                                    self.changeBgSize = false;
                                }

                                self.zoomWindow.css('background-position', self.xp + 'px ' + self.yp + 'px');
                            }
                        }, 16);
                    }
                } else {
                    if (self.changeBgSize) {
                        if (self.nzHeight > self.nzWidth) {
                            if (self.options.zoomType === 'lens') {
                                self.zoomLens.css('background-size',
                                    self.largeWidth / self.newvalueheight + 'px ' +
                                    self.largeHeight / self.newvalueheight + 'px');
                            }

                            self.zoomWindow.css('background-size',
                                self.largeWidth / self.newvalueheight + 'px ' +
                                self.largeHeight / self.newvalueheight + 'px');
                        } else {
                            if (self.options.zoomType === 'lens') {
                                self.zoomLens.css('background-size',
                                    self.largeWidth / self.newvaluewidth + 'px ' +
                                    self.largeHeight / self.newvaluewidth + 'px');
                            }
                            if ((self.largeHeight / self.newvaluewidth) < self.options.zoomWindowHeight) {

                                self.zoomWindow.css('background-size',
                                    self.largeWidth / self.newvaluewidth + 'px ' +
                                    self.largeHeight / self.newvaluewidth + 'px');
                            } else {

                                self.zoomWindow.css('background-size',
                                    self.largeWidth / self.newvalueheight + 'px ' +
                                    self.largeHeight / self.newvalueheight + 'px');
                            }

                        }
                        self.changeBgSize = false;
                    }

                    self.zoomWindow.css('background-position',
                        self.windowLeftPos + 'px ' +
                        self.windowTopPos + 'px');
                }
            }
        },




        changeZoomLevel: function(value) {
            var self = this;

            //flag a zoom, so can adjust the easing during setPosition
            self.scrollingLock = true;

            //round to two decimal places
            self.newvalue = parseFloat(value).toFixed(2);
            var newvalue = self.newvalue;

            //maxwidth & Maxheight of the image
            var maxheightnewvalue = self.largeHeight / ((self.options.zoomWindowHeight / self.nzHeight) * self.nzHeight);
            var maxwidthtnewvalue = self.largeWidth / ((self.options.zoomWindowWidth / self.nzWidth) * self.nzWidth);

            //calculate new heightratio
            if (self.options.zoomType !== 'inner') {
                if (maxheightnewvalue <= newvalue) {
                    self.heightRatio = (self.largeHeight / maxheightnewvalue) / self.nzHeight;
                    self.newvalueheight = maxheightnewvalue;
                    self.fullheight = true;
                } else {
                    self.heightRatio = (self.largeHeight / newvalue) / self.nzHeight;
                    self.newvalueheight = newvalue;
                    self.fullheight = false;
                }

                // calculate new width ratio

                if (maxwidthtnewvalue <= newvalue) {
                    self.widthRatio = (self.largeWidth / maxwidthtnewvalue) / self.nzWidth;
                    self.newvaluewidth = maxwidthtnewvalue;
                    self.fullwidth = true;
                } else {
                    self.widthRatio = (self.largeWidth / newvalue) / self.nzWidth;
                    self.newvaluewidth = newvalue;
                    self.fullwidth = false;
                }
                if (self.options.zoomType === 'lens') {
                    if (maxheightnewvalue <= newvalue) {
                        self.fullwidth = true;
                        self.newvaluewidth = maxheightnewvalue;
                    } else {
                        self.widthRatio = (self.largeWidth / newvalue) / self.nzWidth;
                        self.newvaluewidth = newvalue;

                        self.fullwidth = false;
                    }
                }
            }

            if (self.options.zoomType === 'inner') {
                maxheightnewvalue = parseFloat(self.largeHeight / self.nzHeight).toFixed(2);
                maxwidthtnewvalue = parseFloat(self.largeWidth / self.nzWidth).toFixed(2);
                if (newvalue > maxheightnewvalue) {
                    newvalue = maxheightnewvalue;
                }
                if (newvalue > maxwidthtnewvalue) {
                    newvalue = maxwidthtnewvalue;
                }

                if (maxheightnewvalue <= newvalue) {
                    self.heightRatio = (self.largeHeight / newvalue) / self.nzHeight;
                    if (newvalue > maxheightnewvalue) {
                        self.newvalueheight = maxheightnewvalue;
                    } else {
                        self.newvalueheight = newvalue;
                    }
                    self.fullheight = true;
                } else {
                    self.heightRatio = (self.largeHeight / newvalue) / self.nzHeight;

                    if (newvalue > maxheightnewvalue) {

                        self.newvalueheight = maxheightnewvalue;
                    } else {
                        self.newvalueheight = newvalue;
                    }
                    self.fullheight = false;
                }

                if (maxwidthtnewvalue <= newvalue) {

                    self.widthRatio = (self.largeWidth / newvalue) / self.nzWidth;
                    if (newvalue > maxwidthtnewvalue) {

                        self.newvaluewidth = maxwidthtnewvalue;
                    } else {
                        self.newvaluewidth = newvalue;
                    }

                    self.fullwidth = true;
                } else {
                    self.widthRatio = (self.largeWidth / newvalue) / self.nzWidth;
                    self.newvaluewidth = newvalue;
                    self.fullwidth = false;
                }
            } //end inner
            var scrcontinue = false;

            if (self.options.zoomType === 'inner') {
                if (self.nzWidth >= self.nzHeight) {
                    if (self.newvaluewidth <= maxwidthtnewvalue) {
                        scrcontinue = true;
                    } else {
                        scrcontinue = false;
                        self.fullheight = true;
                        self.fullwidth = true;
                    }
                }
                if (self.nzHeight > self.nzWidth) {
                    if (self.newvaluewidth <= maxwidthtnewvalue) {
                        scrcontinue = true;
                    } else {
                        scrcontinue = false;
                        self.fullheight = true;
                        self.fullwidth = true;
                    }
                }
            }

            if (self.options.zoomType !== 'inner') {
                scrcontinue = true;
            }

            if (scrcontinue) {
                self.zoomLock = 0;
                self.changeZoom = true;

                //if lens height is less than image height
                if (((self.options.zoomWindowHeight) / self.heightRatio) <= self.nzHeight) {
                    self.currentZoomLevel = self.newvalueheight;
                    if (self.options.zoomType !== 'lens' && self.options.zoomType !== 'inner') {
                        self.changeBgSize = true;
                        self.zoomLens.css('height', String(self.options.zoomWindowHeight / self.heightRatio) + 'px');
                    }
                    if (self.options.zoomType === 'lens' || self.options.zoomType === 'inner') {
                        self.changeBgSize = true;
                    }
                }

                if ((self.options.zoomWindowWidth / self.widthRatio) <= self.nzWidth) {
                    if (self.options.zoomType !== 'inner') {
                        if (self.newvaluewidth > self.newvalueheight) {
                            self.currentZoomLevel = self.newvaluewidth;
                        }
                    }

                    if (self.options.zoomType !== 'lens' && self.options.zoomType !== 'inner') {
                        self.changeBgSize = true;

                        self.zoomLens.css('width', String(self.options.zoomWindowWidth / self.widthRatio) + 'px');
                    }
                    if (self.options.zoomType === 'lens' || self.options.zoomType === 'inner') {
                        self.changeBgSize = true;
                    }

                }
                if (self.options.zoomType === 'inner') {
                    self.changeBgSize = true;

                    if (self.nzWidth > self.nzHeight) {
                        self.currentZoomLevel = self.newvaluewidth;
                    }
                    if (self.nzHeight > self.nzWidth) {
                        self.currentZoomLevel = self.newvaluewidth;
                    }
                }
            } //under

            //sets the boundry change, called in setWindowPos
            self.setPosition(self.currentLoc);
            //
        },




        responsiveConfig: function(options) {
            if (options.respond && options.respond.length > 0) {
                return $.extend({}, options, this.configByScreenWidth(options));
            }
            return options;
        },


    };

    $.fn.ezPlus = function(options) {
        return this.each(function() {
            var elevate = Object.create(EZP);

            elevate.init(options, this);

            $.data(this, 'ezPlus', elevate);

        });
    };

    $.fn.ezPlus.options = {
        borderColour: '#888',
        borderSize: 4,
        constrainSize: false, //in pixels the dimensions you want to constrain on
        constrainType: false, //width or height
        containLensZoom: false,
        cursor: 'inherit', // user should set to what they want the cursor as, if they have set a click function
        debug: false,
        easing: false,
        easingAmount: 12,
        enabled: true,

        gallery: false,
        galleryActiveClass: 'zoomGalleryActive',
        gallerySelector: false,
        galleryItem: 'a',

        imageCrossfade: false,

        lensBorderColour: '#000',
        lensBorderSize: 1,
        lensColour: 'white', //colour of the lens background
        lensFadeIn: false,
        lensFadeOut: false,
        lensOpacity: 0.4, //opacity of the lens
        lensShape: 'square', //can be 'round'
        lensSize: 200,
        lenszoom: false,

        loadingIcon: false, //http://www.example.com/spinner.gif

        // This change will allow to decide if you want to decrease
        // zoom of one of the dimensions once the other reached it's top value,
        // or keep the aspect ratio, default behaviour still being as always,
        // allow to continue zooming out, so it keeps retrocompatibility.
        mantainZoomAspectRatio: false,
        maxZoomLevel: false,
        minZoomLevel: false,

        onComplete: $.noop,
        onDestroy: $.noop,
        onImageClick: $.noop,
        onImageSwap: $.noop,
        onImageSwapComplete: $.noop,
        onShow: $.noop,
        onZoomedImageLoaded: $.noop,

        preloading: 1, //by default, load all the images, if 0, then only load images after activated (PLACEHOLDER FOR NEXT VERSION)
        respond: [],
        responsive: true,
        scrollZoom: false, //allow zoom on mousewheel, true to activate
        scrollZoomIncrement: 0.1, //steps of the scrollzoom
        showLens: true,
        tint: false, //enable the tinting
        tintColour: '#333', //default tint color, can be anything, red, #ccc, rgb(0,0,0)
        tintOpacity: 0.4, //opacity of the tint
        touchEnabled: true,

        zoomActivation: 'hover', // Can also be click (PLACEHOLDER FOR NEXT VERSION)
        zoomContainerAppendTo: 'body', //zoom container parent selector
        zoomLevel: 1, //default zoom level of image
        zoomTintFadeIn: false,
        zoomTintFadeOut: false,
        zoomType: 'window', //window is default,  also 'lens' available -
        zoomWindowAlwaysShow: false,
        zoomWindowBgColour: '#fff',
        zoomWindowFadeIn: false,
        zoomWindowFadeOut: false,
        zoomWindowHeight: 400,
        zoomWindowOffsetX: 0,
        zoomWindowOffsetY: 0,
        zoomWindowPosition: 1,
        zoomWindowWidth: 400,
        zoomEnabled: true, //false disables zoomwindow from showing
        zIndex: 999
    };

})(jQuery, window, document);




//owl
var baner2 = $('.baner-2');

function centerBanerBlock() {
    var baner2 = $('.baner-2'),
        docWidth = window.innerWidth,
        banerBlock = $(baner2).find('.baner-block'),
        i = 0;

    $(banerBlock).css({
        maxHeight: 'inherit'
    });

    if (docWidth > 414) {
        for (; i < banerBlock.length; i++) {
            var block = $(banerBlock).eq(i);

            $(block).removeClass('full-height full-width');
            $(block).css({
                marginTop: '0px'
            });
        }
        return;
    }


};



function addCarouselBaner3() {
    var baner3 = $('.baner-3'),
        docWidth = window.innerWidth,
        baner3carousel = $(baner3).find('.baner-3-carousel'),
        owl;


};




$('.blog-posts .owl-item').css({
    width: $(window).innerWidth() / 3 + 'px'
});




var carouselReady = function() {

    centerBanerBlock();
    addCarouselBaner3();
};



//zoom


function syncPosition(el) {
    var current = this.currentItem;
    $(".product-block .image-block .preview-block")
        .find(".owl-item")
        .removeClass("synced")
        .eq(current)
        .addClass("synced");
    if ($(".product-block .image-block .preview-block").data("owlCarousel") !== undefined) {
        center(current)
    }
}

$(".product-block .image-block .preview-block").on('click', '.owl-item', function(e) {
    e.preventDefault();

    if ($(e.target).hasClass('fancybox-media') || $(e.target).parent().hasClass('fancybox-media'))
        return;

    var number = $(this).data("owlItem");
    sync1.trigger("owl.goTo", number);
});

function center(number) {
    var sync2visible = sync2.data("owlCarousel").owl.visibleItems;
    var num = number;
    var found = false;
    for (var i in sync2visible) {
        if (num === sync2visible[i]) {
            var found = true;
        }
    }


}

var productImg = $('.product-block .image-block .main-block .owl-wrapper .owl-item img'),
    zoomConfig = {
        zoomWindowFadeIn: 500,
        zoomWindowFadeOut: 500,
        lensFadeIn: 500,
        lensFadeOut: 500,
        scrollZoom: true,
        zoomWindowWidth: 473,
        zoomWindowHeight: 336,
        borderSize: 1,
        //easing : true,
        zoomLevel: 0.6,
        zoomWindowPosition: 1,
        cursor: 'crosshair',
        //tint: true,
        //tintColour: '#282530',
        enabled: true
    };

$(productImg).eq(0).ezPlus(zoomConfig);

function changeZoomContainer(currentItem) {
    $('.zoomContainer').remove();
    setTimeout(function() {
        $(productImg).eq(currentItem).ezPlus(zoomConfig);
    }, 1000);
}


//isotope

var isotopeLoad = function() {
    (function productIsotope() {
        var $productWrapp = $('.products-wrapper'),
            $productIsotope = $productWrapp.find('.isotope'),
            $prodNav = $('.product-navigation');


    })();
    $('.product-navigation ul:last-child li .is-checked').parent().trigger('click');

    (function galleryIsotope() {
        var $gelleryWrapp = $('.gallery'),
            $galleryNav = $('.gallery-navigation');


    })();
    $('.gallery-navigation ul:last-child li .is-checked').parent().trigger('click');
};

//fancybox
var productItems = $('.product-block').find('.image-block .main-block .item'),
    src,
    i = 0;

$(productItems).attr('rel', 'fancy-product');

for (; i < productItems.length; i++) {
    src = $(productItems).eq(i).find('img').attr('data-fancybox');
    $(productItems).eq(i).attr('href', src);
}

if ($("a[rel='fancy-product']").length > 0) {
    $("a[rel='fancy-product']").fancybox({
        showCloseButton: true,
        showNavArrows: true,
        margin: 140,
        openEffect: 'none',
        closeEffect: 'none'
    });
}

if ($('.fancybox-media').length > 0) {
    $('.fancybox-media').fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        width: 1280,
        height: 720,
        maxWidth: '100%',
        maxHeight: '100%',
        padding: 0,
        margin: 0,
        helpers: {
            media: {
                youtube: {
                    params: {
                        theme: 'light',
                        vq: 'hd720',
                        css: {
                            'body': 'color: #fff'
                        }
                    }
                }
            }
        }
    });
}

//rangeSlider
var range = $('.range');



//Common js
var MYAPP = {

    initialize: function() {
        this.topbar.setUpListeners();
        this.main.setUpListeners();
        this.footer.setUpListeners();
    },

    topbar: {
        setUpListeners: function() {
            var topbar = $('.topbar'),
                topbarMobile = $('.topbar-mobile'),
                mobileMenu = $('.mobile-menu'),
                closeMobileMenu = $('.close-mobile-menu'),
                btnToogleMenu = $(topbarMobile).find('.toogle-menu'),
                phoneMenu = $('.phone-menu'),
                navBlock = $(topbar).find('.topbar-menu .navigation-block'),
                megaMenu = $(topbar).find('.megamenu'),
                simpleMenu = $(topbar).find('.simplemenu'),
                megaMenuItems = $(navBlock).find('.megamenu-item'),
                simpleMenuItems = $(navBlock).find('.simplemenu-item'),
                sidebar = $(topbar).find('.topbar-sidebar'),
                basketBlock = $('.basket'),
                moreOptBlock = $(sidebar).find('.sidebar-more-opt-bl'),
                siteNav = $(moreOptBlock).find('.site-navigation'),
                btnShowMoreOpt = $(sidebar).find('.show-more-opt-btn'),
                btnHideMoreOpt = $(moreOptBlock).find('.option-block-3 .hide-more-opt-btn'),
                btnShowBasket = $(sidebar).find('.show-basket-btn'),
                btnHideBasket = $(basketBlock).find('.close-basket'),
                square1 = $(sidebar).find('.square-1'),
                square2 = $(sidebar).find('.square-2'),
                square3 = $(sidebar).find('.square-3'),
                searchBlock = $(sidebar).find('.search-block '),
                searchInput = $(searchBlock).find('input'),
                topbarMobile = $('.topbar-mobile'),
                mobileSearch = $(topbarMobile).find('.search'),
                optionsMobileBtn = $('.options-mobile-head .open-block'),
                optionsMenu = $('.options-menu'),
                closeOptMobileBtn = $(optionsMenu).find('.close-options-menu'),
                slideTime = 240;

            $("[rel='tooltip']").tooltip();



            //SHOW/HIDE MORE OPT    


            //ОТМЕНА ВЫДЕЛЕНИЯ ТЕСТА
            $(topbar).on('mousedown', function(e) {
                if (e.target.tagName !== 'INPUT') {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });

            //МЕГА МЕНЮ




        },

        sideBarFadeTime: 140,

        resizeTopSpacer: function() {
            var topSpacer = $('.top-spacer'),
                windWidth = window.innerWidth,
                topHeight = (windWidth > 1024) ? $('.topbar').height() :
                $('header').height();

            $(topSpacer).css({
                height: topHeight + 'px'
            });
        },



        hideMegaMenu: function() {
            var topbar = $('.topbar'),
                megaMenu = $(topbar).find('.megamenu');

            $(megaMenu).hide();
        },

        hideSimpleMenu: function() {
            var topbar = $('.topbar'),
                simpleMenu = $(topbar).find('.simplemenu');

            $(simpleMenu).hide();
        },




    },

    main: {
        setUpListeners: function() {
            var product = $('.product'),
                previewImage = $(product).find('.preview-images-wrapp li img'),
                baner2 = $('.baner-2'),
                productWrapp = $('.products-wrapper'),
                tabs = $('.tabs'),
                count = $('.count-product'),
                listing = $('.listing'),
                listingAccordion = $(listing).find('.listing-sidebar .listing-accordion'),
                listToggle = $('.list-toggle'),
                btnListView = $(listing).find('.control .btn-list-block a'),
                checkoutBasket = $('.checkout .checkout-basket'),
                productMenuNav = $('.tt-menu-type1');

            $(product).on('mouseenter mouseup', function(e) {
                var that = this,
                    windWidth = window.innerWidth;

                if (windWidth < 1025) return;

                if (e.type === 'mouseup') {
                    setTimeout(function() {
                        MYAPP.main.product.hover.call(that);
                    }, 0);
                } else if (e.type === 'mouseenter') {
                    MYAPP.main.product.hover.call(that);
                }
            });




            //count




            $('.count input[name="qty"]').keyup().parents('.count').mouseleave();
            //end count



            $(listingAccordion).find('> ul > li.open a').click();


            $(listToggle).find('> li.open a').click();




            $(checkoutBasket).find('.content').slideDown(600);



            $('.modal').on('show.bs.modal', function() {
                var windHeight = $(window).innerHeight();
                $(this).find('.modal-dialog').css({
                    marginTop: windHeight / 100 * 14 + 'px'
                });
            });

            $('.modal').on('shown.bs.modal', function() {
                MYAPP.main.modalPositionCorrect(this);
            });




        },

        modalPositionCorrect: function(modal) {
            if ($(modal).length === 0) return;
            var scrollWidth = $(modal).get(0).offsetWidth - $(modal).get(0).clientWidth;

            $(modal).eq(0).css({
                marginRight: '-' + scrollWidth + 'px'
            });
        },

        baners: {
            resizeBlock: function() {
                var baner = $('.baner-2'),
                    windWidth = window.innerWidth,
                    sizeDef = 10,
                    banerBtnTransition = 300;

                if (windWidth > 414) {
                    var banerWidth = $(baner).width(),
                        CONST_WIDTH = 1170,
                        quotient = banerWidth / CONST_WIDTH;

                    $(baner).find('.baner-block').css({
                        fontSize: 'inherit'
                    });
                    $(baner).css({
                        fontSize: sizeDef * quotient + 'px'
                    });
                } else {
                    setTimeout(function() {
                        var banerBlock = $(baner).find('.baner-block'),
                            CONST_WIDTH_BLOCKS = [470, 270, 370, 370, 370, 370],
                            i = 0;

                        for (; i < banerBlock.length; i++) {
                            var block = $(banerBlock).eq(i),
                                blockWidth = $(block).width(),
                                CONST_WIDTH_THIS = CONST_WIDTH_BLOCKS[i],
                                quotient = blockWidth / CONST_WIDTH_THIS;

                            $(block).css({
                                fontSize: sizeDef * quotient + 'px'
                            });
                        }
                    }, 100);
                }

            },

            addLabels: function() {
                var product = $('.baner-3 .product'),
                    i = 0;

                for (; i < product.length; i++) {
                    if (i === 0) {
                        var label = $('<div>').addClass('label'),
                            span = $('<span>').addClass('icon icon-chevron-right');

                        $(label).append(span);

                    } else if (i < product.length - 1) {
                        var label = $('<div>').addClass('label'),
                            span = $('<span>').addClass('icon icon-add');

                        $(label).append(span);
                    }

                    if (i < product.length - 1) {
                        $(product).find('.product-image-block').eq(i).append(label);
                    }
                }
            }
        },

        product: {
            hover: function() {
                var windWidth = window.innerWidth,
                    substrate = $(this).find('.substrate'),
                    mainInside = $(this).find('.product-main-inside'),
                    previewWrapp = $(this).find('.product-hidden-block-2'),
                    previewWrappWidth = ($(previewWrapp).length > 0) ? $(previewWrapp).innerWidth() : 10,
                    hiddenInfo = $(this).find('.product-hidden-block-1'),
                    hiddenInfoHeight = ($(hiddenInfo).length > 0) ? $(hiddenInfo).innerHeight() : 0,
                    substrateWidth = $(mainInside).innerWidth() + previewWrappWidth,
                    substrateHeight = $(mainInside).innerHeight() + hiddenInfoHeight,
                    left,
                    right;

                if ($(this).hasClass('right-hover') && windWidth < 1363 || $(this).hasClass('right-hover-always')) {
                    left = '-10px';
                    right = 'auto';
                } else {
                    left = 'auto';
                    right = '-10px';
                }

                $(substrate).css({
                    width: substrateWidth + 10 + 'px',
                    height: substrateHeight + 20 + 'px',
                    left: left,
                    right: right
                });
            },


            resizeText: function(productWrapp) {
                var productWrapp = productWrapp || $('.products-wrapper').get(0),
                    product = $(productWrapp).find('.product'),
                    CONST_WIDTH = 270.5,
                    sizeDef = 7.4,
                    i = 0;

                for (; i < product.length; i++) {
                    var productThis = $(product).eq(i),
                        thisWidth = $(productThis).width(),
                        quotient = thisWidth / CONST_WIDTH;

                    var curtains = $(productThis).find('.product-image-block .curtain');

                    curtains.css({
                        fontSize: sizeDef * quotient + 'px'
                    });
                }
            },

            changeTimer: function(product) {
                setInterval(function() {
                    var i = 0;

                    for (; i < product.length; i++) {
                        var curtain = $(product).eq(i).find('.curtain-2');

                        if (curtain.length === 0) continue;

                        var day = $(curtain).find('.day .number'),
                            hrs = $(curtain).find('.hrs .number'),
                            min = $(curtain).find('.min .number'),
                            sec = $(curtain).find('.sec .number'),
                            numbDay = +$(day).html(),
                            numbHrs = +$(hrs).html(),
                            numbMin = +$(min).html(),
                            numbSec = +$(sec).html();

                        if (numbSec === 0 && numbMin === 0 && numbHrs === 0 && numbDay === 0) return;

                        numbSec--;
                        if (numbSec < 0) {
                            numbSec = 59;
                            numbMin--;
                        }

                        if (numbMin < 0) {
                            numbMin = 59;
                            numbHrs--;
                        }

                        if (numbHrs < 0) {
                            numbHrs = 23;
                            numbDay--;
                        }

                        if (numbDay < 0) {
                            numbSec = 0;
                            numbMin = 0;
                            numbHrs = 0;
                            numbDay = 0;
                        }

                        var addZero = function(number) {
                            if (+number < 10) number = '0' + number;
                            return number;
                        };

                        numbSec = addZero(numbSec);
                        numbMin = addZero(numbMin);
                        numbHrs = addZero(numbHrs);
                        numbDay = addZero(numbDay);

                        $(sec).html(numbSec);
                        $(min).html(numbMin);
                        $(hrs).html(numbHrs);
                        $(day).html(numbDay);
                    }

                }, 1000);
            },


        },

        tabs: {
            changeTab: function(use) {
                var use = use || 'program',
                    windWidth = window.innerWidth,
                    dataTab = $(this).attr('data-tab'),
                    tabsWrapp = $(this).parents('.tabs'),
                    tabs = $(tabsWrapp).find('.content > div'),
                    hasActive = $(this).hasClass('active'),
                    tabsDel = $(this).parent().find('li .tab'),
                    i = 0;

                $(this).parent().find('> li').removeClass('active');

                $(this).parent().find('> li').stop();
                $(this).parent().find('> li > a').stop();

                $(this).parent().find('> li').animate({
                    height: '42px'
                }, {
                    complete: function() {
                        $(tabsDel).remove();
                    }
                });
                $(this).parent().find('> li > a').animate({
                    paddingTop: '8px'
                });

                if (use === 'user')
                    if (hasActive) return;

                $(this).addClass('active');

                if (windWidth > 768) {
                    $(tabs).hide();

                    for (; i < tabs.length; i++) {
                        if ($(tabs).eq(i).hasClass(dataTab)) {
                            $(tabs).eq(i).show();
                            break;
                        }
                    }

                    MYAPP.main.tabs.moveBorder('slide');

                } else {

                    for (; i < tabs.length; i++) {
                        if ($(tabs).eq(i).hasClass(dataTab)) {
                            var innerTab = $(tabs).eq(i).clone();

                            $(this).append(innerTab);
                            $(innerTab).show();


                            var tabHeight = $(this).find('.tab').innerHeight(),
                                thisHeight = 42,
                                paddingTop = 30,
                                setHeight = thisHeight + paddingTop + tabHeight;

                            $(this).stop();
                            $(this).find('> a').stop();

                            $(this).animate({
                                height: setHeight + 'px'
                            });
                            $(this).find('> a').animate({
                                paddingTop: paddingTop + 'px'
                            });
                            break;
                        }
                    }
                }
            },

            moveBorder: function(transition) {
                var border = $('.tabs .navigation .border');

                if (border.length === 0) return;

                var borderWidth = $(border).width(),
                    li = ($('.tabs .navigation ul li.active').length > 0) ?
                    $('.tabs .navigation ul li.active') :
                    $('.tabs .navigation ul li:first-child'),
                    liPos = $(li).position().left,
                    liWidth = $(li).width();

                if (transition === 'slide') {
                    $(border).animate({
                        marginLeft: liPos - 15 - (borderWidth - liWidth) / 2 + 'px'
                    }, 300);
                } else if (transition === 'no-slide') {
                    $(border).css({
                        marginLeft: liPos - 15 - (borderWidth - liWidth) / 2 + 'px'
                    });
                }
            }
        },


    },

    footer: {
        setUpListeners: function() {
            var toTop = $('.footer .to-top'),
                popups = $('.footer .popups-btn .tt-btn');




        }
    }
};

MYAPP.initialize();



$(function() {
    var productWrapp = $('.products-wrapper'),
        product = $('.product'),
        swiperSlideText = $('.swiper-container .swiper-slide span'),
        listing = $('.listing'),
        btnListView = $(listing).find('.control .btn-list-block a'),
        modalsActive = $('.modal.active'),
        baner2 = $('.baner-2'),
        tabs = $('.tabs');

    carouselReady();

    MYAPP.topbar.resizeTopSpacer();
    MYAPP.main.product.resizeText();
    $(productWrapp).find('.product .curtain').show();
    MYAPP.main.product.changeTimer(product);
    MYAPP.main.baners.addLabels();
    $(swiperSlideText).fadeIn(200);

    $(btnListView).parent().find('.active').click();
    $(modalsActive).modal();
    MYAPP.main.baners.resizeBlock();
    $(baner2).css({
        visibility: 'visible'
    });
    MYAPP.main.tabs.changeTab.call($(tabs).find('.navigation ul li.active'));
});

$(window).on('load', function() {
    isotopeLoad();
});



$(window).on('scroll', function() {

    MYAPP.topbar.hideMegaMenu();
    MYAPP.topbar.hideSimpleMenu();
});



$('#cartao1').hide();
$('#cartao2').hide();
$('#ccv').hide();
$('#endereco').hide();
$('#dados_pessoais').hide();

$('#cartao').click(function(){
    $('#cartao1').fadeToggle();
	$('#cartao2').fadeToggle();
	$('#dados_pessoais').hide();
})

$('#endereco_bt').click(function(){
    $('#endereco').fadeToggle();
})

$('#save_1').click(function(){
    $('#ccv').show();
})
$('#save_2').click(function(){
    $('#ccv').show();
})
$('#boleto').click(function(){
    $('#cartao1').hide();
	$('#cartao2').hide();
	$('#ccv').hide();
	$('#dados_pessoais').show();
})
$('#paypal').click(function(){
    $('#cartao1').hide();
	$('#cartao2').hide();
	$('#ccv').hide();
	$('#dados_pessoais').show();
})

$('input[type="checkbox"]').on('change', function() {
    $('input[name="' + this.name + '"]').not(this).prop('checked', false);
});

$('#pedido_3').hide();
$('#info_3').click(function(){
    $('#pedido_3').fadeToggle();
})

$('#pedido_2').hide();
$('#info_2').click(function(){
    $('#pedido_2').fadeToggle();
})

$('#pedido_1').hide();
$('#info_1').click(function(){
    $('#pedido_1').fadeToggle();
})