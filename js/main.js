var dq = (function($, window, undefined) {
    
    "use strict";
    
    var refs = {
        $window: $(window),
        $document: $(document),
        $body: $('body'),
        $dragfood: undefined,
        // $plates: $('#plates'),
        $plates: $('#plates .plate-mask'),
        $chart: $('#chart'),
        $intro: $('.intro-container'),
        // $newGameButton: $('#newGameButton'),
        $newGameButton: $('.start-new-game'),
        $plate: undefined,
        $fork: $('.fork'),
        $spoon: $('.spoon'),
        $forkBub: $('.fork .bubble'),
        $spoonBub: $('.spoon .bubble'),
        $menu: $('.menu-wrapper'),
        $foodCont: $('.food-container'),
        $foodContMask: $('.foodmenu-mask'),
        $mealCheck: $('.meal-check'),
        $infopage: $('#infopage'),
        $gallery: $('#gallery .gal-wrapper'),
        $infobtn: $('.info'),
        $gallerybtn: $('.gallery'),
        $audiocontainer: $('#audiocontainer'),
        $videocontainer: $('#videocontainer'),
        $confettis: $('#confettis'),
        $storm: $('#storm'),
        $bolt: $('.bolt'),
        $bolts: $('.bolt2'),
        $continueButton: $('#continueButton'),
        $scenario: $('.scenario'),
        // $foodstack: $('#foodstack'),
        $piechart: $('#piechart'),
        $barchart: $('#barchart'),
        $hud: $('.hud'),
        'change-tab': $('.snd.change-tab')[0],
        'dropped-food': $('.snd.dropped-food')[0],
        'restock-food': $('.snd.restock-food')[0],
        'select-dish': $('.snd.select-dish')[0],
        'success': $('.snd.success')[0],
        'failed': $('.snd.failed')[0],
        'new-game': $('.snd.new-game')[0],
        'recycle-food': $('.snd.recycle-food')[0],
        'show-bubble': $('.snd.show-bubble')[0],
        'show-bubble-fork': $('.snd.show-bubble-fork')[0],
        'show-bubble-spoon': $('.snd.show-bubble-spoon')[0],
        'gameover-won': $('.snd.gameover-won')[0],
        'gameover-lost': $('.snd.gameover-lost')[0],
        'snoring': $('.snd.snoring')[0],
        'first-intro': $('.snd.first-intro')[0],
        'standard-click': $('.snd.standard-click')[0],
        'playbtn-click': $('.snd.playbtn-click')[0],
        'menubtn-click': $('.snd.menubtn-click')[0]
    },
    configs = {
        isTouch: 'ontouchstart' in window,
        clickEvent: ('ontouchstart' in window) ? 'touchstart' : 'mousedown',
        clickEventEnd: ('ontouchstart' in window) ? 'touchend' : 'mouseup',
        stats: undefined,
        menuAtTop: false
    },
    buttons = {
        START_TRIAL: 'start-trial',
        SKIP_TRIAL: 'skip-trial',
        START_NEW_GAME: 'start-new-game',
        FB_SHARE: 'fb-share'
    },
    game = {
        contentPageVisible: false,
        skipMeal: false,
        visitorid: NaN,
        mealindex: 0, // used in barchart.render
        firstvisit: false,
        co2_max: NaN,
        kcal_min: NaN,
        inactive_restart: NaN,
        inactive_fallasleep: NaN,
        inactivityCounter: 0,
        trialmode: false,
        started: false,
        running: false,
        lost: true,
        sleeping: false,
        lastSound: undefined,
        worstFoodsAry: [],
        bestFoodsAry: [],
        constants: {
            FOODITEMS_VERTOFF: {veggies: 0, sides: -105, animals: -210, fruit: -315, fastfood: -420},
            // FOODITEMS_VERTOFF_BIG: {veggies: 0, sides: NaN, animals: NaN},
            FOOD_CATS: ['veggies', 'sides', 'animals', 'fruit', 'fastfood'],
            FOOD_BGVERT_OFF: {veggies: 0, sides: 1, animals: 2},
            DEFAULT_TAB: 'animals', 
            FOOD_BIG_DIMS: 450,
            CUTLERY_HOROFF: 120,
            RADIUS_INNER: 0,
            PIECOLOR: '#f2282e', // f2282e, 43b1d8
            FPS: 30,
            SNORE_EXP: "L04,G12",
            WAKEUP_EXP: "L01,G01",
            FADEIN_SPEED: 500,
            FADEOUT_SPEED: 500,
            SHOWBUBBLE_DELAY: 250,
            HIDE_FOODINFO: 3000, // match with json: hidebubble_delay
            GREEN: '#95D944',
            RED: '#ED705A'
        },
        currentFoodCat: undefined,
        currentMeal: [],
        meals: [],
        mealMix: {},
        freezeTab: {},
        activeTabID: NaN,
        $activeTab: undefined,
        platesCounter: -1,
        foodCounter: NaN,
        $activePage: undefined,
        currentTemplate: undefined,
        BUBBLES_NEWGAME: 'new-game',
        BUBBLES_SHOWCHART: 'show-chart',
        BUBBLES_TRASHFOOD: 'trash-food',
        BUBBLES_TRASHONSTAGE: 'trash-onstage',
        BUBBLES_DROPPED_FOOD: 'food-dropped',
        BUBBLES_SCENARIO_FORK: 'scenario-fork',
        BUBBLES_SCENARIO_SPOON: 'scenario-spoon',
        BUBBLES_CLICKED_CHART: 'clicked-chart',
        BUBBLES_FAILED: 'failed',
        BUBBLES_SUCCESS: 'success',
        BUBBLES_FREEZE_VEGGIES: 'freeze-veggies',
        BUBBLES_FREEZE_SIDES: 'freeze-sides',
        BUBBLES_POSITIVE: 'positive',
        BUBBLES_NEGATIVE: 'negative',
        BUBBLES_TRIAL_START: 'trial-start',
        BUBBLES_TRIAL_WON: 'trial-won',
        BUBBLES_TRIAL_LOST: 'trial-lost'
    },
    intro = {},
    hud = {},
    app = {},
    svg = {},
    gallery = {},
    piechart = {},
    barchart = {},
    scenario = {},
    dragfood = {},
    debug = {},
    cutlery = {},
    storm = {},
    confettis = {},
    constants = {
        DEV: true,
        STATS: false,
        CHECK_INACTIVITY: false,
        RELOAD_ON_INACTIVE: false,
        SOUNDS: true,
        SKIP_INTRO: false,
        SKIP_TRIAL: false,
        SKIP_VIDEO: false,
        URL_HOME: '',
        JSON_PATH: './json/data.json',
        JSON_PATH_GALLERY: './json/getGallery.php', // meals.json, 
        FADE_IN: 200, FADE_OUT: 400, FADE_DELAY: 50,
        FOOD_HOR: NaN, FOOD_VERT: NaN,
        PLATE_RAD: 270, PLATE_DISTANCE: 40000// 200*200
    },
    bubbleDelay = {
        START_GAME: 750
    },
    templates = ['INTRO', 'TRIAL','VIDEO','GAME','SCENARIO'],
    defaultTemplate = templates[0], 
    sounds = {
        DROPPED_FOOD: 'dropped-food',
        RESTOCK_FOOD: 'restock-food',
        SELECT_DISH: 'select-dish',
        NEW_GAME: 'new-game',
        CHANGE_TAB: 'change-tab',
        FAILED: "failed",
        CLICK_FORK: "G_on_click",
        CLICK_SPOON: "L_on_click",
        LEAVE_TAB: "leave_tab",
        SNORING: "snoring",
        SUCCESS: "success",
        SCENARIO: "scenario",
        FIRST_INTRO: "first-intro",
        STANDARD_CLICK: "standard-click",
        PLAYBTN_CLICK: "playbtn-click",
        MENUBTN_CLICK: "menubtn-click",
        RECYCLE_FOOD: "recycle-food",
        SHOW_BUBBLE: "show-bubble",
        SHOW_BUBBLE_FORK: "show-bubble-fork",
        SHOW_BUBBLE_SPOON: "show-bubble-spoon",
        GAMEOVER_LOST: "gameover-lost",
        GAMEOVER_WON: "gameover-won"
    };
    
    game.sounds = [
        {selector: '.navi-container > div', whichSound: sounds.CHANGE_TAB}, 
        {selector: '.standard', whichSound: sounds.STANDARD_CLICK},
        {selector: '.playbtn-sound', whichSound: sounds.PLAYBTN_CLICK},
        {selector: '.menubtn-sound', whichSound: sounds.MENUBTN_CLICK}
    ];
    
    $(function() {

        helper.initMisc();

        configs.menuAtTop = (location.hash.indexOf('at-top') >= 0)
        
        $.getJSON(constants.JSON_PATH, function(data) {
            app.json = data;
            
             //  set balancing-vars from json
            game.co2_max = app.json.rules.co2_max;
            game.kcal_min = app.json.rules.kcal_min;
            game.inactive_fallasleep = app.json.rules.inactive_fallasleep;
            game.inactive_restart = app.json.rules.inactive_restart;
            cutlery.showDelay = app.json.rules.showbubble_delay;
            cutlery.hideDelay = app.json.rules.hidebubble_delay;
            cutlery.hideDelayScenario = app.json.rules.hidebubble_delay_scenario;
            
            app.setFoodArys();
            
            if (constants.STATS) {
                configs.stats = new Stats();
                configs.stats.setMode(0);
                document.body.appendChild(configs.stats.domElement);
                window.setInterval(function() { configs.stats.update(); }, 1000 / constants.FPS);
            }
            
            //  check for repeating visitors
            if (!docCookies.getItem("dq-visitorid")) {
                docCookies.setItem("dq-visitorid", Date.now(), new Date(2016, 1, 31));
                game.firstvisit = true;
            }

            // game.firstvisit = true;
            game.visitorid = docCookies.getItem("dq-visitorid");

            setTimeout(app.init, 1500);

            $.ajax({
                type: 'POST',
                dataType : 'text',
                async: true,
                url: constants.JSON_PATH_GALLERY,
                data: {visitorid: game.visitorid, mode: 'getGallery'},
                // data: {mode: 'getMeal', timestamp: '1421240744933'},
                success: function (data) {
                    game.meals = jQuery.parseJSON(data);
                }
            });

            // $.get(constants.JSON_PATH_GALLERY + '?mode=getGallery&rid=' + Math.random(), function(data) {
            //     game.meals = jQuery.parseJSON(data);
            // });
        });
    });
    
    app = {
        
        clicklistener: function(e) {
            log('clicklistener');
            log(e.originalEvent.srcElement);
        },

        renderTemplate: function(template) {
            log('renderTemplate: ' + template);

            game.currentTemplate = template;

            switch(game.currentTemplate) {
                case 'INTRO': 
                    constants.SKIP_INTRO ? intro.hide() : setTimeout(intro.init, 500);
                    break;

                case 'TRIAL':
                    game.trialmode = true;
                    intro.hide();
                    break;

                case 'GAME':
                    intro.remove();
                    app.showGameButtons();
                    app.startGame();

                    // scenario.render();
                    // setTimeout(scenario.render, 4000);
                    break;

                default:

                    break;
            }
        },

        init: function() {
            log('app.init');

            if (constants.CHECK_INACTIVITY) setInterval(app.checkInactivity, 1000);
            
            // game.constants.FOODITEMS_VERTOFF_BIG.sides = -game.constants.FOOD_BIG_DIMS;
            // game.constants.FOODITEMS_VERTOFF_BIG.animals = -2 * game.constants.FOOD_BIG_DIMS;
            constants.FOOD_HOR = constants.FOOD_VERT = game.constants.FOOD_BIG_DIMS / 2;

            //  set FB Link
            helper.setFbLink($('.' + buttons.FB_SHARE), window.location.href);
            helper.setFbLink($('.js-fbshare'), window.location.href);
            
            if (constants.DEV) {
                // refs.$window.on({keydown: this.keyDownListener});
            }
            
            $('.navi-container > div').on(configs.clickEvent, function(e) {

                if (game.freezeTab[$(this).data('foodcat')]) return;
                
                game.currentFoodCat = game.constants.FOOD_CATS[$(this).data('foodcat')];
                
                $('.navi-container > div.active').removeClass('active');
                $(this).addClass('active');
                app.renderFoodMenu();
                game.activeTabID = $(this).data('foodcat');
                game.$activeTab = $(this);
            });
            
            refs.$window.on(configs.clickEvent, app.resetInactCounter);
            
            $('.logo').on(configs.clickEvent, app.reload);
            // $('.trash').on({click: game.addTrash});
           
            refs.$newGameButton.on(configs.clickEvent, function() {
                // game.startNewGame();
                setTimeout(game.startNewGame, 650);
            });
            $('.myplates').on(configs.clickEvent, function() {
                $('.gallery.icon').trigger(configs.clickEvent);
                configs.freezeGalleryIcon = true;
                window.setTimeout(function() { configs.freezeGalleryIcon = false; }, 1500);
            });

            $('.' + buttons.START_TRIAL + ', .' + buttons.SKIP_TRIAL).on({click: function() {

                app.playSound(sounds.PLAYBTN_CLICK);
                game.trialmode = !$(this).hasClass(buttons.SKIP_TRIAL);
                intro.hide();

                // game in trial mode || or finsih video > start actual game
                var delay = 1000;
                game.trialmode ? setTimeout(app.startGame, delay) : setTimeout(app.finishVideo, delay);
            }});
            
            $('.info.icon, .gallery.icon').on(configs.clickEvent, function() {

                if (configs.freezeGalleryIcon) return;


                var pagetype = $(this).data('pagetype');

                if (storm.stormOn) return;
                $(this).toggleClass('close');

                if (!!game.$activePage && $(this).hasClass('close')) {
                    $('body').find('[data-pagetype="' + game.$activePage.attr('id') + '"]').removeClass('close');
                    app.hideContentPage(game.$activePage.attr('id'));
                }

                $('#' + pagetype).hasClass('visible') ? app.hideContentPage(pagetype) : app.showContentPage(pagetype);
            });

            $('.sound').on(configs.clickEvent, function () {
                $(this).toggleClass('off', constants.SOUNDS);
                constants.SOUNDS = !constants.SOUNDS;
            });
            
            refs.$continueButton.on({click: function() {
                refs.$infobtn.toggleClass('close');
                app.hideContentPage("infopage");
            }});

            // $('.hud .toggle').on({click: barchart.toggle});
            $('.hud .toggle').on(configs.clickEvent, barchart.toggle);
            $('.menu-btn').on(configs.clickEvent, app.scrollFoodMenu);

            //  init sounds
            for (var i = 0; i < game.sounds.length; i++) {
                $(game.sounds[i].selector).data('whichSound', game.sounds[i].whichSound).on(configs.clickEvent, function(e, mode) {
                    if (mode !== 'no-sound' && !$(this).hasClass('no-sound')) app.playSound($(this).data('whichSound'));
                });
            }

            app.renderTemplate(defaultTemplate);
        },

        scrollFoodMenu: function(arg) {
            log('scrollFoodMenu');

            var prev = $(this).hasClass('prev'),
                marginLeft = NaN,
                itemWidth = configs.isTouch ? 102 : 120,
                lastID = NaN,
                prevActive = false,
                nextActive = false;

            lastID = app.foodMenuObj.howMany - Math.floor(refs.$foodContMask.width()/itemWidth);
            if (lastID < 0) lastID = 0;

            if (arg !== 'no-change') {
                prev ? app.foodMenuObj.currentID-- : app.foodMenuObj.currentID++;
            }

            if (app.foodMenuObj.currentID < 0) app.foodMenuObj.currentID = 0;
            if (app.foodMenuObj.currentID > lastID) app.foodMenuObj.currentID = lastID;
            
            marginLeft = -app.foodMenuObj.currentID * itemWidth;
            refs.$foodCont.css({marginLeft: marginLeft});

            nextActive = (app.foodMenuObj.currentID < lastID);
            prevActive = (app.foodMenuObj.currentID > 0);

            log('lastID: ' + lastID);
            log('app.foodMenuObj.currentID: ' + app.foodMenuObj.currentID);


            $('.menu-btn.prev').toggleClass('active', prevActive).toggleClass('no-sound', !prevActive);
            $('.menu-btn.next').toggleClass('active', nextActive).toggleClass('no-sound', !nextActive);
        },
        
        setFoodArys: function() {
            var tmpAry = app.json.expressions.positive[0];
            
            for (var i = 0; i < tmpAry.length; i++) {
                game.bestFoodsAry.push(tmpAry[i]['triggered-by']);
            }
            
            tmpAry = app.json.expressions.negative[0];
            for (i = 0; i < tmpAry.length; i++) {
                game.worstFoodsAry.push(tmpAry[i]['triggered-by']);
            }
        },
        
        initVideo: function() {

            log('initVideo');
            
            refs.$videocontainer.on(configs.clickEvent, app.finishVideo);

            $('#intro-video').on({ended: app.finishVideo});
            $('#intro-video')[0].play();

            setTimeout(function() { 
                refs.$videocontainer.removeClass('transparent').addClass('playing');
            }, 1000);

            $('.js-skipvideo').on(configs.clickEvent, function() { 
                log('js-skipvideo');
                refs.$videocontainer.trigger(configs.clickEvent);
            });
        },

        showGameButtons: function() {
            $('.logo, .info, .gallery, .sound, .transparent').removeClass('transparent');
        },
        
        finishVideo: function() {

            log('finishVideo');

            app.showGameButtons();
            
            $('#intro-video')[0].pause();
            refs.$videocontainer.addClass('hidden').removeClass('playing');

            clearTimeout(app.startGameTO);
            app.startGameTO = setTimeout(app.startGame, 1000);
        },
        
        checkInactivity: function() {
            if (game.started) game.inactivityCounter++;
            switch(game.inactivityCounter) {
                
                case game.inactive_fallasleep:
                    if (game.running) app.startSleeping();
                    break;
                
                case game.inactive_restart:
                    if (constants.RELOAD_ON_INACTIVE) app.reload();
                    break;
            }
            
            //log('ia counter: ' + game.inactivityCounter);
            //log('game.running: ' + game.running);
        },
        
        startSleeping: function() {
            game.sleeping = true;
            cutlery.setExpression({exp: game.constants.SNORE_EXP});
            app.playSound(sounds.SNORING, true);
        },
        
        stopSleeping: function() {
            game.sleeping = false;
            cutlery.setExpression({exp: game.constants.WAKEUP_EXP});
            app.stopSound('stopSleeping');
        },
        
        resetInactCounter: function() {
            game.inactivityCounter = 0;
            
            if (game.sleeping) app.stopSleeping();
        },
        
        startGame: function() {
            game.started = true;
            game.startNewGame();

            refs.$plates.fadeIn();
            refs.$fork.show();
            refs.$spoon.show();

            $('body').addClass('table-cloth');
            refs.$menu.removeClass('down');


            $('.logo').removeClass('transparent');
            // $('.trash').removeClass('transparent');
            
            // setTimeout(app.clearSounds, 900);
        },

        stopTrialMode: function() {
            log('stopTrialMode');

            if (!game.trialmode) return;

            game.trialmode = false;

            refs.$menu.addClass('down');
            refs.$fork.hide();
            refs.$spoon.hide();
            refs.$plates.fadeOut();

            setTimeout(app.initVideo, 1000);
        },
        
        isLabelAlreadyInCurrentFood: function (label) {
            var exists = false;
                for(var j = 0; j < game.currentMeal.length; j++) {
                    if(game.currentMeal[j] != undefined && game.currentMeal[j].label == label) {
                        exists = true;
                        break;
                    }
                }
            return exists;
        },
        
        freezeFoodMenu: function() {
            refs.$foodCont.addClass('inactive');
            game.freezeTab[game.activeTabID] = true;
            game.$activeTab.addClass('freeze');
        },
        
        renderFoodMenu: function() {

            app.foodMenuObj = {howMany: 0, currentID: 0};

            var foodClass = configs.isTouch ? 'm-item touch' : 'm-item no-touch',
                foodHtml = '<div class="' + foodClass + '"></div>',
                html = '',
                foodCat = game.currentFoodCat,
                vertOff = game.constants.FOODITEMS_VERTOFF[foodCat],
                specs = {};
                
            for (var i = 0; i < app.json.avFood[foodCat].length; i++) {
                html += foodHtml;
            }

            app.foodMenuObj.howMany = i;
            
            refs.$foodCont.empty().append(html).removeClass('inactive').css({marginLeft: 0});
                    
            $('.m-item').each(function(i, el) {
                specs = app.json.avFood[foodCat][i];
                specs.foodCat = game.currentFoodCat;
                specs.bgHorPos = i;
                
                // if (!app.isLabelAlreadyInCurrentFood(specs.label)) {
                if (true) {
                    $(el).css({backgroundPosition: -i * $(el).width() + 'px ' + vertOff + 'px'}).
                    data('specs', specs).addClass('visible');

                    specs.label = specs.label.replace('class=__small__', 'class="small"');


                    if (specs.label.indexOf('<font class="small">') > 0) {
                        $(el).append('<p class="byline">' + specs.label.substr(specs.label.indexOf('<font class="small">')) + '</p>');
                        $(el).append('<p>' + specs.label.substr(0, specs.label.indexOf('<font class="small">')) + '</p>');
                    } else {
                        $(el).append('<p>' + specs.label + '</p>');
                    }
                    
                    $(el).draggable({
                        helper: 'clone',
                        cursorAt: {left: constants.FOOD_HOR, top: constants.FOOD_VERT},
                        start: function(e, ui) {
                            refs.$dragfood = ui.helper;
                            refs.$dragfood.addClass('dragged');
                            
                            dragfood.setBackground(refs.$dragfood, $(this).data('specs'));
                            refs.$body.addClass('hidesvg');

                            app.playSound(sounds.SELECT_DISH);
                        },
                        stop: dragfood.stopDragging,
                        drag: $.throttle(300, dragfood.calcDistance)
                    });
                } else {
                    $(el).css("visibility", "hidden");
                }

                if (app.isLabelAlreadyInCurrentFood(specs.label)) {
                    $(el).addClass('inactive');
                }

            });

            app.scrollFoodMenu('no-change');
        },
        
        switchTab: function(foodCat) {
            $('.navi-container .' + foodCat).trigger(configs.clickEvent, 'test');
        },
        
        showContentPage: function(pagetype) {
            log('showContentPage');
            game.contentPageVisible = true;

            $('html').addClass('overflow');

            if (pagetype === 'gallery') dq.gallery.render();

            game.$activePage = $('#' + pagetype);
            

            game.$activePage.addClass('visible');
            game.$activePage.removeClass('hidden');
            
            refs.$plates.hide();
            refs.$barchart.hide();
            refs.$fork.hide();
            refs.$spoon.hide();
            refs.$menu.hide();
            refs.$hud.addClass('hidden');

            refs.$scenario.hide();

            $('.logo, #newGameButton, .meal-check, .trash').hide();
        },
        
        hideContentPage: function(pagetype) {
            log('hideContentPage: ' + pagetype);
            game.contentPageVisible = false;

            $('html').removeClass('overflow');
            // $('#' + pagetype).removeClass('visible');
            game.$activePage.removeClass('visible');
            game.$activePage.addClass('hidden');
            game.$activePage = undefined;

            refs.$plates.show();
            refs.$barchart.show();
            refs.$fork.show();
            refs.$spoon.show();
            refs.$scenario.show();

            $('.hud .toggle').removeClass('freeze');
            game.skipMeal = false;

            if (game.running) {
                refs.$menu.show();
                
            } else {
                refs.$hud.removeClass('hidden');
            }

            $('.logo, #newGameButton, .meal-check').show();
        },
        
        convertGrammToKG: function (gramm) {
              return gramm / 1000;
        },
        
        generateChart: function($target) {
            var html = '',
                specs = {},
                tmpAry = [],
                showSpecific = !!$target,
                addChart = false;

            log('generateChart / showSpecific: ' + showSpecific);
            if (!showSpecific) app.resetChart();
            
            refs.$plate.find('.food').each(function(i, el) {
               
                if (showSpecific) {
                    addChart = $(el).attr('id') === $target.attr('id');
                } else {
                    addChart = true;
                }

                if (addChart) {

                    specs = $(el).data('specs');
                    specs.label = specs.label.replace('<br>',' ');

                    // log(specs);

                    // q&d
                    if (specs.label.indexOf('small') > 0) specs.bigbg = true;

                    
                    html = '<div class="_CLASSES_"><h3>_LABEL_</h3><p>_SERVING_ g, _CO2_ KG CO<sub>2</sub</p></div>';
                    html = html.replace('_CLASSES_', specs.bigbg ? "big-chart chart" : "normal-chart chart");
                    html = html.replace('_SERVING_', specs.serving);
                    html = html.replace('_LABEL_', specs.label);
                    html = html.replace('_CO2_', app.convertGrammToKG(specs.c02));
                   
                    $(el).append(html);
                   
                    if (specs.chart.length > 0) {
                        tmpAry = $(el).data('specs').chart.split(',');
                        $(el).children().css({left: tmpAry[0] + 'px', top: tmpAry[1] + 'px'});
                   }
               }
            });

            if (showSpecific) {
                refs.$plate.find('.food .chart').delay(game.constants.HIDE_FOODINFO).fadeOut(500, function() { log('remove .food .chart'); $(this).remove(); });
            }
            
            //  catch mouse down
            refs.$plate.find('.food .chart').on(configs.clickEvent, function(e) {
                e.stopImmediatePropagation();
                log('label: down');
            });

            refs.$plate.find('.food .chart').on(configs.clickEventEnd, function(e) {
                e.stopImmediatePropagation();
                log('clicked label: up');
                if (game.running) game.removeFood($(this).parent());
            });

            // refs.$chart.show();
            // refs.$menu.fadeOut();
            // refs.$mealCheck.addClass('visible');
        },
        
        resetChart: function() {
            log('resetChart');

            if (refs.$plate) refs.$plate.find('.food .chart').remove();
            // refs.$chart.hide();
        },
        
        reload: function() {
            docCookies.removeItem("dq-visitorid");
            location.reload();
        },
        
        keyDownListener: function(e) {
            
            log(e.keyCode);
            
            switch(e.keyCode) {
                case 67: // c
                    debug.printObject(game.calcMealVals(game.currentMeal));
                    break;
                
                case 78:
                    game.startNewGame();
                    break;

                case 80: // p
                    cutlery.trigger(game.BUBBLES_TRIAL_LOST);
                    break;

                //  r
                case 82:
                    location.reload();
                    break;
            }
        },
        
        playSound: function(whichSound, delay) {

            log('playSound / whichSound: ' + whichSound);
            log('playSound / delay: ' + delay);

            var delay = delay || 0;
            
            if (!constants.SOUNDS) return;

            if (game.lastSound === 'snoring') app.stopSound('playSound');
            
            //if (whichSound === 'new-game') return;
            //log('playSound / whichSound: ' + whichSound);
            
            if (refs[whichSound]) {
                refs[whichSound].pause();

                // log('---time-----');
                // log(refs[whichSound].currentTime);

                if (refs[whichSound].currentTime) refs[whichSound].currentTime = 0;
            }

            clearTimeout(app.playSoundTO);
            app.playSoundTO = setTimeout(function() { refs[whichSound].play(); }, delay);

            game.lastSound = whichSound;
        },
        
        stopSound: function(trigger) {
            
            // log('stopSound / trigger: ' + trigger);
            
            if (game.lastSound) {
                refs[game.lastSound].pause();
                //log('dur: ' + refs[game.lastSound].duration);
                refs[game.lastSound].currentTime = 0;
                //log('pause');
            }
        },
       
        _playSound: function(whichSound, loop) {
            
            //if (!constants.SOUNDS) return;
            
                        
            //if (whichSound !== ('failed' || 'success')) return;
            if (whichSound !== 'failed' && whichSound !== 'change-tab') return;
            
            log('whichSound: ' + whichSound);
            
             
            
            var sndpath = app.json.sounds[whichSound],
                html = '',
                id = 'active-sound',
                $snd = undefined;
                
            
            
            if (Modernizr.audio) {
                html = '<audio id="' + id + '" ';
                if (loop) html += 'loop';
                html += ' class="btn-audio"><source src="./media/sound/' + sndpath + '.mp3" type="audio/mpeg" /></audio>';
                
                refs.$audiocontainer.empty().append(html);
                
                log(html);
                
                $snd = document.getElementById(id);
                $snd.volume = 0.3;
                $snd.play();
            }
        },
        
        clearSounds: function() {
            log('clearSounds');
            refs.$audiocontainer.empty();
        }
    }

    /******* SVG *******/

    svg = {

        xmlserializer: new XMLSerializer(),
        xmlString: '',

        $foodOnPlate: undefined,

        loadSVG: function($newFoodRef, specs) {
            var svgPath = './img/svg/onplate/' + specs.foodCat + '/' + specs.bgHorPos + '.svg';

            svg.$foodOnPlate = $newFoodRef;

            $.get(svgPath, function(data) {
                svg.xmlString = svg.xmlserializer.serializeToString(data);
                svg.$foodOnPlate.append(svg.xmlString);
            });
        }
    }

    scenario = {

        SHOW_DELAY: 2000, // 1500
        HIDE_DELAY: 11000,
        SPOON_DELAY: 7000, // 2000
        FORK_DELAY: 4000, // 5000
        visible: false,

        // SHOW_DELAY: 1,
        // HIDE_DELAY: 2000,
        // SPOON_DELAY: 3,
        // FORK_DELAY: 8,

        render: function() {
            log('scenario.render');
            scenario.visible = true;

            var scenarioNr = 0,
                scenarioMood = game.lost ? 'negative' : 'positive';


            log('game.lost: ' + game.lost);

            scenarioNr = helper.getRandomNumber(app.json.scenarios.length);

            // scenarioNr = 4;
            // scenarioMood = 'positive';

            log('scenarioNr: ' + scenarioNr);
            
            var dataObj = app.json.scenarios[scenarioNr][scenarioMood];
            scenario.dataObj = dataObj;

            log(dataObj);

            $('.scenario img').attr('src', './img/scenario/' + dataObj.img);
            $('.scenario p').html(dataObj.txt);

            scenario.initSound(dataObj.sound);
            app.playSound(sounds.SCENARIO, 500);

            refs.$scenario.removeClass('hidden').delay(500).queue(function(){ 
                $(this).addClass('show').dequeue();
            });

            //  trigger bubbles
            setTimeout(cutlery.trigger, scenario.SPOON_DELAY, game.BUBBLES_SCENARIO_SPOON);
            setTimeout(cutlery.trigger, scenario.FORK_DELAY, game.BUBBLES_SCENARIO_FORK);
            
            setTimeout(scenario.hide, scenario.HIDE_DELAY);
        },

        initSound: function(sound) {
            
            if ($('.snd.scenario').length === 0) {
                log('add scenario sound');
                var html = '<audio class="btn-audio snd scenario" preload="auto"><source id="mp3Source" type="audio/mpeg" /></audio>';
                // $('.snd.scenario').remove();
                refs.$audiocontainer.append(html);
            } else {
                log('reset scenario sound');
            }

            $('#mp3Source').attr('src','./media/sound-final/scenarios/'+ sound);
            refs['scenario'] = $('.snd.scenario')[0];
            refs['scenario'].pause();
            refs['scenario'].load();

            // if ($("#js-videoplayer").length >= 1) { // unload video
            // $("#js-videoplayer").first().attr('src','')
            // }
            
            // log(html);
            
            // $snd = document.getElementById(id);
            // $snd.volume = 0.3;
            // $snd.play();
        },

        hide: function() {

            log('scenario hide');
            scenario.visible = false;

            refs.$scenario.removeClass('show').delay(500).queue(function(){ 
                $(this).addClass('hidden').dequeue();
            });
            
            setTimeout(function() {
                barchart.activate();
                // app.generateChart();
                barchart.showHud();

                if (!game.skipMeal) {
                    window.setTimeout(function() { $('.hud .toggle').trigger(configs.clickEvent, {show: 'chart'}); }, 30); // 300
                } 
            }, 40); //150
        }
    }

    barchart = {

        active: false,
        $el: $('.barchart-container'),
        $mask: $('#barchart .mask'),
        triggerBubble: true,

        calcBarHeight: function(val) {
            var height, normHeight = 352, maxHeight = 500, minHeight = 30,
            height = Math.round((val / 700) * normHeight);

            // if (height > maxHeight) height = maxHeight;
            if (height < minHeight) height = minHeight;


            // height = normHeight;

            return height;
        },

        render: function() {

            log('-----barchart render-----');

            //  only once
            if (barchart.triggerBubble) {
                barchart.triggerBubble = false;
                cutlery.resetChat();
                setTimeout(cutlery.trigger, 600, game.BUBBLES_SHOWCHART);
            }

            var that = barchart,
                html = '', result = '',
                hSnippet = '<div class="item"><div class="extrabar"></div><div class="bar"></div><p></p></div>',
                bottomOff = 0, $target, text = '',
                co2 = 0,
                data = game.meals[game.mealindex].ingredients;

            // log(data);

            data = data.sort(function(obj1,obj2) { return obj1.c02 - obj2.c02; });
            // data = data.sort(function(obj1,obj2) { return obj2.c02 - obj1.c02; });

            for (var i = 0; i < data.length; i++) {
                html += hSnippet;
            }
            that.$el.empty().append(html);

            var zIndexCounter = 1000,
                futureHeight = 0,
                barHeight = 0,
                maxFutureHeight = 485;

            $('.barchart-container .item').each(function(i, $el) {

                $target = $($el);
                $target.data('data', data[i]);

                // log(data[i]);

                co2 += data[i].c02;

                //  row
                $target.css({zIndex: zIndexCounter - i, bottom: bottomOff});

                data[i].color = game.constants.GREEN;
                if (co2 >= game.co2_max) {
                    data[i].color = game.constants.RED;
                    $target.find('.extrabar').css({height: Math.round(352 - bottomOff)});
                }

                //  bar
                barHeight = that.calcBarHeight(data[i].c02);
                futureHeight = bottomOff + barHeight;
                //  cap height
                if (futureHeight > maxFutureHeight) barHeight = maxFutureHeight - bottomOff;



                $target.find('.bar').css({background: data[i].color, height: barHeight});

                //  q&d
                data[i].label = data[i].label.replace('<br>',' ');

                //  label
                text = data[i].serving + ' g ' + data[i].label + '<br><font class="small">' + helper.convertToKG(data[i].c02) + ' kg CO<sub>2</sub></font>';
                $target.find('p').html(text);

                bottomOff += $($el).find('.bar').height();

                if (i%2 === 1) {
                    $target.find('p').addClass('left');
                }
            });

            $('.barchart-container .item').on({click: function() {
                log('clicked');
                setTimeout(cutlery.trigger, 10, game.BUBBLES_CLICKED_CHART, $(this).data('data')['msg-chart']);
            }});

            //  result
            result = '<p><font class="big">' + helper.convertToKG(co2) + '</font> kg CO<sub>2</sub></p>';
            // result = '<p><font class="big">1.4</font> kg CO<sub>2</sub></p>';
            $('#barchart .result').html(result);

            $('#barchart .result').toggleClass('lost', (co2 >= game.co2_max));

            refs.$barchart.addClass('show').removeClass('_hidden');
            that.$mask.addClass('expand');

            // remove border-top
            $('.barchart-container .item .bar:last').css('border', 'none');
        },

        hide: function() {
            refs.$barchart.removeClass('show').addClass('_hidden');
            barchart.$mask.removeClass('expand');
        },

        activate: function() {
            refs.$barchart.removeClass('hidden');
        },

        deactivate: function() {
            refs.$barchart.addClass('hidden');
        },

        toggle: function(target, dataObj) {
            log('---barchart toggle---');
            log(dataObj);
            log('game.skipMeal:' + game.skipMeal);

            if (game.skipMeal) return;

            //  toggle click triggered in scenario.hide()
            if (!!dataObj) {
                log('force barchart');
                $(this).find('p').data('label', 'ESSENSANSICHT').text('DIAGRAMM');
                barchart.active = false;
            }

            var $p = $(this).find('p'),
                label = $p.data('label');

            log('label: ' + label);

            $p.data('label', $p.text()).text(label).removeClass('show-food');

            if (barchart.active) {
                refs.$plate.find('.food').show();
                barchart.hide();

                //  only once would be enough actually
                app.generateChart();

            } else {
                refs.$plate.find('.food').hide();
                barchart.render();
                $p.addClass('show-food');
            }

            barchart.active = !barchart.active;
        },

        showHud: function() {
            // refs.$plates.addClass('collapse border-bottom');

            if (!game.contentPageVisible) {
                refs.$hud.removeClass('hidden');
            }

            setTimeout(function() { refs.$hud.removeClass('transparent'); }, 500);
        },

        hideHud: function() {
            // refs.$plates.removeClass('collapse');
            refs.$hud.addClass('transparent');
            setTimeout(function() { refs.$hud.addClass('transparent'); }, 600);
            // setTimeout(function() { refs.$plates.removeClass('border-bottom'); }, 300);
        },

        reset: function() {
            barchart.hide();
            barchart.hideHud();
        }
    }

    /******* piechart *******/

    piechart = {

        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        arcTween: function(a) {
            var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                return piechart.arc(i(t));
            };
        },

        renderChart: function() {
            var width = 960, height = 500, radius = Math.min(width, height) / 2,
                color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
            
            var arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(0);
            var pie = d3.layout.pie().sort(null).value(function(d) { return d.population; });

            dq.refs.$piechart.empty();

            piechart.arc = arc;

            var svg = d3.select("#piechart").append("svg").attr({width: width, height: height})
                .append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            d3.csv("./json/data.csv", function(error, data) {
                data.forEach(function(d) {
                    d.population = +d.population;
                });

                var g = svg.selectAll(".arc")
                    .data(pie(data))
                    .enter().append("g")
                    .attr("class", "arc");

                g.append("path")
                    .attr("d", arc)
                    .style("fill", function(d) { return color(d.data.age); });

                g.append("text")
                    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .style("text-anchor", "middle")
                    .text(function(d) { return d.data.age; });
            });
        },

        drawBarChart: function() {

            var width = 960, height = 500,
                data = [4, 8, 15, 16, 23, 42],
                y = d3.scale.linear().range([height, 0]),
                chart = d3.select(".d3chart").attr({width: width, height: height});
        },

        learnSomething: function() {
            var alphabet = "abcdefghijklmnopqrstuvwxyz".split(""),
                width = 960, height = 500,
                svg = undefined;

            svg = d3.select('#piechart').append('svg').attr({width: width, height: height})
                    .append('g').attr('transform' , 'translate(0,' + height / 4 + ')');


            // piechart.update(alphabet);

            // piechart.update(piechart.shuffle(alphabet).slice(0, Math.floor(Math.random() * 26)).sort());

            
            // window.setInterval(function() {
            //   piechart.update(piechart.shuffle(alphabet)
            //       .slice(0, Math.floor(Math.random() * 26)).sort());
            // }, 3000);
        },

        shuffle: function(array) {
            var m = array.length, t, i;

            while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }
            return array;
        },

        update: function(data) {

            log('--function update--');
            // DATA JOIN
            // Join new data with old elements, if any.
            var text = d3.select('#piechart g').selectAll("text").data(data, function(d) { return d; });

            // UPDATE
            // Update old elements as needed.
            text.attr("class", "update")
            .transition().duration(750)
            .attr({x: function(d, i) { log('update'); return i * 20; }});

            // ENTER
            // Create new elements as needed.
            text.enter().append("text").attr({class: 'enter', dy: '.35em'})
                .text(function(d) { return d; })
                .attr({x: function(d, i) { log('enter'); return i * 20; }});          

            // ENTER + UPDATE
            // Appending to the enter selection expands the update selection to include
            // entering elements; so, operations on the update selection after appending to
            // the enter selection will apply to both entering and updating nodes.
            
            // text.attr({x: function(d, i) { return i * 20; }})

            // EXIT
            // Remove old elements as needed.
            text.exit().remove();
        },

        traceRawData: function() {
            var meal = game.currentMeal,
                mealVals = game.calcMealVals(game.currentMeal),
                html = '',
                data = [];

            log('traceRawData');
            // log(mealVals);

            for (var i = 0; i < meal.length; i++) {
                
                // log(meal[i]);
                // log('label: ' + meal[i].label);                
                // log('co2: ' + meal[i].c02);
                // log('percentage: ' + (meal[i].c02 / mealVals.co2) * 100);
                // log('--<br>');

                html += 'label: ' + meal[i].label;
                html += '<br>percentage: ' + (meal[i].c02 / mealVals.co2) * 100;
                html += '<br>----------';

                data.push({serving: meal[i].serving, 
                    c02: meal[i].c02,
                    kcal: meal[i].kcal,
                    color: meal[i].color, 
                    label: meal[i].label, value: (meal[i].c02 / mealVals.co2) * 100});
            }           

            refs.$piechart.empty();

            var width = 540, height = 540, radius = height / 2;

            // return;
            
            // data = [{"label":"Category A", "value": 10, test: 'test a'}, 
            //         {"label":"Category B", "value": 20, test: 'test b'}, 
            //         {"label":"Category C", "value": 30, test: 'test c'},
            //         {"label":"Category D", "value": 40, test: 'test d'}];

            // data = [{"label":"Category B", "value": 70}];

            var vis = d3.select('#piechart').append("svg:svg").attr("class", "big").data([data]).attr({width: width, height: height})
                    .append("svg:g").attr("transform", "translate(" + radius + "," + radius + ")");

            var pie = d3.layout.pie().value(function(d) {
                log(d.value);
                return d.value;
            });           

            // declare an arc generator function
            var arc = d3.svg.arc().outerRadius(radius).innerRadius(0);

            piechart.arc = arc;

            // select paths, use arc generator to draw
            var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");

            // log(arcs);
            
            arcs.append("svg:path")
                .attr("fill", function(d, i) {
                    log('fill');
                    log(d.data);
                    // return color(i);
                    return d.data.color;
                })
                // .attr("d", function(d,i) { log('---');log(d); log(i); return arc({startAngle: 0, endAngle: 3.143185307179587});})
                // .each(function(d) { this._current = d; })
                .attr("opacity", 0)
                .transition()
                .duration(750)
                .attr("d", arc)
                .attr("opacity", 1)
                // .attrTween("d", piechart.arcTween);

                // .attr("d", function (d) {
                //     // log the result of the arc generator to show how cool it is :)
                //     log('--');
                //     log(d);
                //     log(arc(d));
                //     return arc(d);
                // });

            
            // add the text
            arcs.append("svg:text").attr("transform", function(d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").html( function(d, i) {
                    log('hola');
                    var txt = '<tspan x="0">' + data[i].serving + ' g ' + data[i].label + '</tspan>';
                        txt += '<tspan x="0" dy="15">' + data[i].c02 + ' kg CO2' + '</tspan>';
                return txt;
                       
                });
            

            piechart.littlePie(); 


            $('#piechart').append('<svg class="txt" width="540" height="540"><g transform="translate(250,250)">');
            $('svg.txt g').append($('svg.big text'));

                      
        },

        littlePie: function() {
            var width = 100, height = 100, radius = height / 2,
                data = [{"label":"CO2", "value": 90, color: game.constants.PIECOLOR}, 
                        {"label":"", "value": 10, color: '#e8e8e8'}],
                vals = game.calcMealVals(game.currentMeal);

            var vis = d3.select('#piechart').append("svg:svg").data([data]).attr("class", "little").attr({width: 2.5*width, height: height})
                    .append("svg:g").attr("transform", "translate(" + radius + "," + radius + ")");
                    

            //  second miniplate
            d3.select('svg.little').append("svg:g").attr("class", "little2").attr("transform", "translate(" + Math.round(3.1*radius) + "," + radius + ")");

            var percentage = vals.co2 / game.co2_max,
                percentage2 = NaN;

             if (percentage > 1) {
                percentage2 = percentage - 1;
                percentage = 1;
             }
            
            data[0].value = percentage;
            data[1].value = 1 - percentage;

            log('---- percentage ------');
            log(percentage);

            var pie = d3.layout.pie().sort(null).value(function(d) {
                // log(d.value);
                return d.value;
            });           

            // declare an arc generator function
            var arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * game.constants.RADIUS_INNER);

            piechart.arc = arc;

            // select paths, use arc generator to draw
            var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");

            // log(arcs);
            
            arcs.append("svg:path")
                .attr("fill", function(d, i) {
                    log('fill');
                    log(d.data);
                    // return color(i);
                    return d.data.color;
                })
                // .attr("d", function(d,i) { log('---');log(d); log(i); return arc({startAngle: 0, endAngle: 3.143185307179587});})
                // .each(function(d) { this._current = d; })
                .attr("opacity", 0)
                .transition()
                .duration(750)
                .attr("d", arc)
                .attr("opacity", function(d,i) { var opacity = i == 0 ? 1 : .6; return opacity; });
            // add the text
            arcs.append("svg:text").attr("transform", function(d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
                    // data[i].value
                return data[i].label;
                       
                }
                );

            if (!isNaN(percentage2)) {
                piechart.little2(radius, percentage2);
            }
        },

        little2: function(radius, percentage) {
            log('little2');
            var data = [{"label":"CO2", "value": 10, color: game.constants.PIECOLOR},{"label":"", "value": 90, color: '#e8e8e8'}],
                vis = d3.select('#piechart g.little2').data([data]);          

            var pie = d3.layout.pie().sort(null).value(function(d) { return d.value; }); 


            if (percentage > 1) percentage = 1;
            
            data[0].value = percentage;
            data[1].value = 1 - percentage;          

            // declare an arc generator function
            var arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * game.constants.RADIUS_INNER);

            // select paths, use arc generator to draw
            var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");

            arcs.append("svg:path")
            .attr("fill", function(d, i) {
                log('fill little2');
                log(d.data);
                // return color(i);
                return d.data.color;
            })
            // .attr("d", function(d,i) { log('---');log(d); log(i); return arc({startAngle: 0, endAngle: 3.143185307179587});})
            // .each(function(d) { this._current = d; })
            .attr("opacity", 0)
            .transition()
            .duration(750)
            .attr("d", arc)
            .attr("opacity", function(d,i) { var opacity = i == 0 ? 1 : .6; return opacity; });

            // add the text
            arcs.append("svg:text").attr("transform", function(d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
                    // data[i].value
                return data[i].label;
                       
                }
                );

        }
    };

    hud = {
        showButton: function(selector) {
            $('.hud-new .' + selector).removeClass('hidden').fadeTo(constants.FADEIN_SPEED, 1);
        },

        hideButton: function(selector) {
            $('.hud-new .' + selector).fadeTo(constants.FADEOUT_SPEED, 0, function() { $(this).addClass('hidden'); });
        }
    }

    intro = {

        clearplate: false,

        init: function() {
            var delays = [2500, 200, 200, 200, 200, 200, 200],
                buttonDelay = 1000,
                delay = 0,
                html = '';

            for (var i = 0; i < delays.length; i++) {
                html += '<div></div>';
            }

            refs.$intro.empty().html(html);
            game.addPlate();
            intro.clearplate = true;

            $('.intro-container > div').each(function(i, el) {
                delay += delays[i];
                // $(el).delay(delay).fadeTo(constants.FADEIN_SPEED, 1);
                $(el).delay(delay).queue(function() { $(this).addClass('display'); });
            });

            delay += buttonDelay;


            if (game.firstvisit) {
                setTimeout(hud.showButton, delay, buttons.START_TRIAL);
            }
            else {
                setTimeout(hud.showButton, delay, buttons.SKIP_TRIAL);
                $('.' + buttons.SKIP_TRIAL).removeClass('button2').addClass('button1');
                //  25.05.2015: only one button
                // $('.' + buttons.START_TRIAL + ' p').text('kennenlernen');
            }

            app.playSound(sounds.FIRST_INTRO, delays[0] + 80);
        },

        hide: function() {
            intro.remove();
            hud.hideButton(buttons.START_TRIAL);
            hud.hideButton(buttons.SKIP_TRIAL);
        },

        remove: function() {
            refs.$intro.fadeTo(constants.FADEOUT_SPEED, 0, function() { $(this).remove(); });
        }
    }

    /********** Game **********/
    
    game.startNewGame = function() {

        log('startNewGame');
        
        storm.stop();
        confettis.stop();
        app.stopSound('startNewGame');
        
        clearTimeout(game.showFeedbackInt);
        
        game.running = true;
        game.lost = true;
        game.currentFoodCat = game.constants.DEFAULT_TAB;

        if (!game.trialmode) game.platesCounter++;
            
        //  resets after first game
        if (game.currentMeal.length > 0 || true) {
            refs.$menu.fadeIn();
            refs.$mealCheck.removeClass('visible');
            setTimeout(function() { refs.$mealCheck.removeClass('failed'); }, 2000);

            app.resetChart();
        }

        setTimeout(cutlery.trigger, bubbleDelay.START_GAME, game.trialmode ? game.BUBBLES_TRIAL_START : game.BUBBLES_NEWGAME);
        
        //  resets
        game.currentMeal = [];
        game.foodCounter = 0;
        game.mealindex = 0;
        game.mealMix = {veggies: 0, sides: 0, animals: 0};
        game.freezeTab = {0: false, 1: false, 2: false};
        game.activeTabID = NaN;
        game.$activeTab = undefined;
        game.lastSound = undefined;
        refs.$piechart.empty();
        barchart.deactivate();
        game.skipMeal = false;

        barchart.triggerBubble = true;

        // refs.$foodstack.empty();
        debug.printObject({});
        
        $('.navi-container > div.freeze').removeClass('freeze');
        $('.hud .toggle').removeClass('freeze');

        game.addPlate();
        
        app.playSound(sounds.NEW_GAME);
        $('.navi-container .' + game.constants.DEFAULT_TAB).trigger(configs.clickEvent, 'no-sound');

        barchart.reset();

        $('.trash').removeClass('onstage');

        /* removed trash 22.05.2015
        if (!game.trialmode) {
            if (game.platesCounter > 0 && (game.platesCounter % 4) === 0 || true ) {
                log('game.platesCounter: ' + game.platesCounter);
                setTimeout(function() { 
                    if (game.running) {
                        $('.trash').addClass('onstage'); 
                        setTimeout(cutlery.trigger, 1650, game.BUBBLES_TRASHONSTAGE);
                    }
                }, 7000 + Math.round(Math.random() * 5000)); 
            }
        }
        */
        
        //  temp
        // barchart.showHud();
    },

    game.addPlate = function() {

        if (intro.clearplate) {
            intro.clearplate = false;
            return;
        }

        var html = '<div class="plate"></div>';

        // log('HOLA: ' + $('.plate').children().length);

        refs.$plates.empty().append(html);
        // refs.$plate =  $(dq.refs.$plates.children()[dq.refs.$plates.children().length - 1]);
        refs.$plate = $('.plate');
        if (!configs.isTouch) refs.$plate.addClass('desktop');
        
        refs.$plate.fadeIn();
    },
    
    game.clearPlate = function() {
        refs.$plates.html('<div class="plate visible"></div>');
        refs.$plate = $('.plate');
    },

    game.addFood = function(specs, $target) {
        specs.$target = $target;
        game.currentMeal.push(specs);
    }

    game.removeFood = function($target) {

        log('game.removeFood / $target');
        log($target);

        var label = $target.data('specs').label;

        for (var i = 0; i < game.currentMeal.length; i++) {

            if (game.currentMeal[i].label === label) {
                game.currentMeal.splice(i, 1);
            }
        }

        //  restock in food menu
        $(dq.refs.$foodCont.children()[$target.data('specs').bgHorPos]).removeClass('inactive');
        app.playSound(sounds.RESTOCK_FOOD);

        $target.fadeOut(constants.FADE_OUT, function() { log('removed'); log($(this)); $(this).remove(); });
    },
    
    game.calcMealVals = function(meal) {
        var cals = 0, co2 = 0;
        
        for (var i = 0; i < meal.length; i++) {
            cals += meal[i].kcal;
            co2 += meal[i].c02;
        }
        
        return {cals: cals, co2: co2};
    }
    
    game.getFeedback = function(meal) {
        //var cals = 0, co2 = 0;
        
        var worstFood = '', bestFood = '',
            maxCO2 = 0, minCO2 = 10000000;
            
        // add check: worstFood in json, bestFood in json
        
        for (var i = 0; i < meal.length; i++) {
            
            if (meal[i].c02 > maxCO2 && helper.isInArray(meal[i].label, game.worstFoodsAry)) {
                maxCO2 = meal[i].c02;
                worstFood = meal[i].label;
            }
            
            if (meal[i].c02 < minCO2 && helper.isInArray(meal[i].label, game.bestFoodsAry)) {
                minCO2 = meal[i].c02;
                bestFood = meal[i].label;
            }
        }
        
        return {worstFood: worstFood, bestFood: bestFood};
    }
    
    game.isVegan = function(meal) {
        var isVegan = true;
        
        for (var i = 0; i < meal.length; i++) {
            if (meal[i].foodCat === 'animals') isVegan = false;
        }
        
        return isVegan;
    }
    
    game.checkMealVals = function($target) {
        var vals = game.calcMealVals(game.currentMeal),
            tooMuchC02 = (vals.co2 >= game.co2_max),
            enoughCalories = (vals.cals >= game.kcal_min),
            gameOver = tooMuchC02 || enoughCalories,
            startAniDelay = 500,
            showChartDelay = 5000;

        log('checkMealVals / $target: ' + $target);
        
        if (gameOver) {

            if (game.trialmode) {
                clearTimeout(app.finishTrialModeTO);
                app.finishTrialModeTO = setTimeout(cutlery.trigger, 20, tooMuchC02 ? game.BUBBLES_TRIAL_LOST : game.BUBBLES_TRIAL_WON);

            } else {
                
                game.finishGame();

                //  app.generateChart(); //  after scenario
                game.addMealToGallery(vals, tooMuchC02, vals.co2 / game.co2_max);
                
                //app.freezeFoodMenu();
                
                if (tooMuchC02) {
                    // lost
                    log('---------- lost ----------');
                    // cutlery.trigger(game.BUBBLES_FAILED);
                    setTimeout(cutlery.trigger, game.constants.SHOWBUBBLE_DELAY, game.BUBBLES_FAILED);
                    refs.$mealCheck.addClass('failed');
                    
                    // setTimeout(storm.start, startAniDelay);
                    
                    // tmp: 22012015
                    // game.showFeedbackInt = setTimeout(cutlery.trigger, showChartDelay, game.BUBBLES_NEGATIVE);
                } else {
                    // won
                    log('---------- won ----------');
                    game.lost = false;
                    // cutlery.trigger(game.BUBBLES_SUCCESS);
                    setTimeout(cutlery.trigger, game.constants.SHOWBUBBLE_DELAY, game.BUBBLES_SUCCESS);
                    // setTimeout(confettis.init, startAniDelay);

                    // tmp: 22012015
                    // game.showFeedbackInt = setTimeout(cutlery.trigger, showChartDelay, game.BUBBLES_POSITIVE);


                    refs.$plates.append('<div class="ring"></div>');
                }

                setTimeout(app.playSound, 1200, tooMuchC02 ? sounds.GAMEOVER_LOST : sounds.GAMEOVER_WON);

                $target = undefined;

            }
        }

        // show single food label
        else {
            app.generateChart($target);
        }
    }

    game.addTrash = function() {
        log('addTrash');

        var foodCatsAry = ['veggies','sides','animals','fruit','fastfood'],
            foodCat = foodCatsAry[helper.getRandomNumber(foodCatsAry.length)],
            foodID = helper.getRandomNumber(app.json.avFood[foodCat].length),
            html = '', obj = {},
            $newFood;

        log('foodCat: ' + foodCat);
        log('foodID: ' + foodID);
        // log(app.json.avFood[foodCat][foodID]);

        app.playSound(sounds.RECYCLE_FOOD);

        game.skipMeal = true;
        obj = app.json.avFood[foodCat][foodID];
        obj.foodCat = foodCat;
        obj.bgHorPos = foodID;
        obj.c02 = 0;

        log(obj);

        obj.x = '40px';
        obj.y = '40px';

        html += '<div class="trash food" style="left: ' + obj.x + '; top: ' + obj.y + '; background-position: 0 0; background-image: url(./img/svg/onplate/' + obj.foodCat + '/' + obj.bgHorPos + '.svg);"></div>';

        refs.$plate.append(html);

        //  trigger bubble

        $('.hud .toggle').addClass('freeze');

        $newFood = $('.trash.food');
        $newFood.data('specs', obj);

        game.addFood(obj, undefined);
        game.mealMix[foodCat]++;
        game.checkFoodMix();
        game.checkMealVals($newFood);

        $('.trash').removeClass('onstage');

        // setTimeout(cutlery.trigger, 10, game.BUBBLES_TRASHFOOD);
        setTimeout(cutlery.trigger, game.constants.SHOWBUBBLE_DELAY, game.BUBBLES_DROPPED_FOOD, obj['msg-dropped']);
    }

    game.finishGame = function(mode) {
        log('finishGame');
        game.running = false;
        refs.$menu.fadeOut();
        $('.trash').removeClass('onstage');

        if (mode === 'skip-scenario') {
            scenario.hide();
        } else {
            setTimeout(scenario.render, scenario.SHOW_DELAY);
        }
    }

    game.addMealToGallery = function(vals, lost, ratio) {
        log('addMealToGallery');

        //  used trash, dont add to gallery!
        if (game.skipMeal) {
            return;
        }

        for (var i = 0; i < game.currentMeal.length; i++) {
            game.currentMeal[i].x = game.currentMeal[i].$target.css('left');
            game.currentMeal[i].y = game.currentMeal[i].$target.css('top');

            game.currentMeal[i].label = game.currentMeal[i].label.replace('class="small"', 'class=__small__');

            delete game.currentMeal[i].$target;
        }

        var dish = {stats: {kcal: vals.cals, co2: vals.co2, lost: lost, ratio: ratio, date: Date.now()}};
            
        
        dish.ingredients = game.currentMeal;
        
        // log(JSON.stringify(dish));

        game.meals.unshift(dish);

        $.ajax({
            type: 'POST',
            dataType : 'text',
            async: true,
            url: constants.JSON_PATH_GALLERY,
            // url: './json/write-json.php',
            // data: {mode: 'addMeal', data: JSON.stringify(game.meals)},
            data: {visitorid: game.visitorid, mode: 'addMeal', meal: JSON.stringify(dish), timestamp: dish.stats.date},
            success: function (data) {
                log('WROTE INTO DB');
                log(data);
                // String: SUCCESS || TRUE
            }
        });
    },
    
    game.checkFoodMix = function() {
        
        // tmp deactivated
        return;

        if (game.mealMix[game.currentFoodCat] === app.json.rules.switch_tab[game.currentFoodCat]) {
            
            if (game.currentFoodCat === 'veggies') cutlery.trigger(game.BUBBLES_FREEZE_VEGGIES);
            else if (game.currentFoodCat === 'sides') cutlery.trigger(game.BUBBLES_FREEZE_SIDES);
            
            app.freezeFoodMenu();
        }
    }

    /*
    game.addToFoodstack = function(specs, $foodOnPlate) {
        var id = 'foodstack-' + game.currentMeal.length, 
            foodHTML = '<div class="food-ref" id="' + id + '">' + specs.label + ', ' + specs.kcal + ' kcal<span>x</span></div>',
            $foodRef = undefined;
        refs.$foodstack.prepend(foodHTML);
        $foodRef = $('#' + id);
        $foodRef.data('$foodOnPlate', $foodOnPlate);
        $foodRef.data('label', specs.label);
        $foodRef.on(configs.clickEvent, function() {             
            $(this).data('$foodOnPlate').trigger(configs.clickEvent, 'clicked-on-stackbutton');
            $(this).fadeOut(constants.FADE_OUT, function() { $(this).remove(); });
            game.removeFood($(this).data('label')); 
        });
    }
    */

    game.renderMeal = function(mealdata, mealindex) {

        log('renderMeal');
        // log(mealdata);

        var html = '', obj = {};

        refs.$body.scrollTop(0);
        game.mealindex = mealindex;

        for (var i = 0; i < mealdata.ingredients.length; i++) {
            obj = mealdata.ingredients[i];
            html += '<div class="food" style="left: ' + obj.x + '; top: ' + obj.y + '; background-image: url(./img/svg/onplate/' + obj.foodCat + '/' + obj.bgHorPos + '.svg);"></div>';
        }

        game.clearPlate();
        refs.$plate.append(html);

        //   add food specs
        refs.$plate.find('.food').each(function(i, el) {
            $(el).data('specs', mealdata.ingredients[i]);
        });

        game.finishGame('skip-scenario');
        
        // if (barchart.active) $('.hud .toggle').trigger('click');
        // window.setTimeout(function() { $('.hud .toggle').trigger('click', {show: 'chart'}); }, 1);

        if (!mealdata.stats.lost) refs.$plates.append('<div class="ring"></div>');
    }
    
    /********** Dragfood **********/
    
    dragfood = {
        
        droppClassAdded: false,

        removeFromPlate: function($ref, extraparam) {

            log('removeFromPlate');
            log('$ref');
            log($ref);

            var onPlate = false,
                $foodref = extraparam === 'clicked' ? $ref : $(this);

                // foodStackID = $foodref.data('foodStackID');
            
            refs.$body.removeClass('hidesvg');

            refs.$dragfood = $foodref;
            onPlate = dragfood.calcDistance(true);

            // log('removeFromPlate');
            // log('extraparam: ' + extraparam)
            // log($foodref);
            // log($foodref.data('specs'));
            // log('onPlate: ' + onPlate);

            if (onPlate) {
                log('onPlate > $plate.append');
                dragfood.setOffPlateVals($foodref,$foodref.css('left'), $foodref.css('top'));

                dragfood.setOnPlateVals($foodref);
                refs.$plate.append($foodref);

                dragfood.setDroppableStatus(false);

            } else {
                // game.removeFood($(this));
                game.removeFood($foodref);
            }
        },

        setOffPlateVals: function($target, left, top) {
            $target.data('offplate-left', left);
            $target.data('offplate-top', top);
        },

        setOnPlateVals: function($target) {

            log('setOnPlateVals');
            log('target-offleft: ' + $target.offset().left);
            log('plate-offleft: ' + refs.$plate.offset().left);
            log('target-offtop: ' + $target.offset().top);
            log('plate-offtop: ' + refs.$plate.offset().top);

            $target.css({left: $target.offset().left - dq.refs.$plate.offset().left, top: $target.offset().top - dq.refs.$plate.offset().top});
            log('target-css-left: ' + $target.css('left'));
            log('target-css-top: ' + $target.css('top'));
        },
        
        stopDragging: function() {
            log('------------stopDragging----------');

            var onPlate = dragfood.calcDistance(true),
                foodID = 'food-' + game.meals.length + '-' + game.foodCounter,
                foodHTML = '<div class="food" id="' + foodID + '"></div>',
                left = dq.refs.$dragfood.offset().left,
                top = dq.refs.$dragfood.offset().top,
                specs = $(this).data('specs'),
                $newFood = undefined;
                
            refs.$plate.append(foodHTML);
            $newFood = $('#' + foodID);

            window.setTimeout(svg.loadSVG, 1000, $newFood, specs);
            
            // game.foodCounter++;
            $newFood.css({left: left - dq.refs.$plate.offset().left, top: top - dq.refs.$plate.offset().top});
            dragfood.setBackground($newFood, specs);
        
            if (onPlate) {
                log('onPlate');
                $newFood.data('specs', specs);
                dragfood.setOffPlateVals($newFood,dq.refs.$dragfood.css('left'), dq.refs.$dragfood.css('top'));
                // $newFood.data('foodStackID', game.currentMeal.length);
                
                if (app.json.rules.food_only_once) {
                    // $(this).addClass('inactive').draggable('disable');
                    $(this).addClass('inactive');
                }
                
                game.addFood(specs, $newFood);
                game.mealMix[specs.foodCat]++;
                game.checkFoodMix();
                game.checkMealVals($newFood);

                if (game.running) {
                    //  cutlery
                    // cutlery.setExpression(specs);

                    //  bubble
                    if (!game.trialmode) {
                        setTimeout(cutlery.trigger, game.constants.SHOWBUBBLE_DELAY, game.BUBBLES_DROPPED_FOOD, specs['msg-dropped']);
                    }
                }
                
                // debug.printObject(specs);
                // debug.printObject(game.calcMealVals(game.currentMeal), true);

                log('configs.clickEvent: ' + configs.clickEvent);
                log('configs.clickEventEnd: ' + configs.clickEventEnd);

                $newFood.on(configs.clickEvent, function(e) {
                    log('-----start: move-food-on-plate > $foodCont.append------');
                    refs.$foodCont.append($(this));
                    log('offplate-left: ' + $(this).data('offplate-left'));
                    log('offplate-top: ' + $(this).data('offplate-top'));
                    $(this).css({left: $(this).data('offplate-left'), top: $(this).data('offplate-top')});
                });

                $newFood.on(configs.clickEventEnd, function(e) { 
                    log('----END: move-food-on-plate > $foodCont.append------');
                    dragfood.removeFromPlate($(this), 'clicked');
                });

                // $newFood.draggable();
                $newFood.draggable({
                    _start: function(e, ui) {
                        log('-----drag-start-----');
                        refs.$dragfood = ui.helper;
                        refs.$dragfood.addClass('dragged');
                        // $(this).addClass('hidesvg');
                        refs.$body.addClass('hidesvg');
                    },
                    _stop: function() {
                        log('-----drag-stop-----');
                        dragfood.removeFromPlate();
                    }
                    // stop: dragfood.removeFromPlate
                    // drag: $.throttle(300, dragfood.calcDistance)
                });
                
                // app.generateChart($newFood);
                
            } else {
                $newFood.fadeOut(constants.FADE_OUT, function() { $(this).remove(); });
            }
            
            dragfood.setDroppableStatus(false);  
            refs.$body.removeClass('hidesvg');
            
            app.playSound(sounds.DROPPED_FOOD);
            game.foodCounter++;
        },
        
        setDroppableStatus: function(droppable) {
            
            if (droppable) {
                if (!dragfood.droppClassAdded) {
                    dragfood.droppClassAdded = true;
                    dq.refs.$plate.addClass('drop');
                }
            } else {
                if (dragfood.droppClassAdded) {
                    dragfood.droppClassAdded = false;
                    dq.refs.$plate.removeClass('drop');
                }
            }
        },
        
        calcDistance: function(dropped) {
            
            if (typeof dropped === 'object') dropped = false;
            
            //log('calcDistance / dropped: ' + dropped);
            
            var food_x = dq.refs.$dragfood.offset().left + constants.FOOD_HOR,
                food_y = dq.refs.$dragfood.offset().top + constants.FOOD_VERT,
                plate_x = dq.refs.$plate.offset().left + constants.PLATE_RAD,
                plate_y = dq.refs.$plate.offset().top + constants.PLATE_RAD,
                x = plate_x - food_x,
                y = plate_y - food_y,
                //dist = Math.round(Math.sqrt(x*x + y*y)),
                dist = Math.round(x*x + y*y),
                onPlate = (dist < constants.PLATE_DISTANCE);
            
            dragfood.setDroppableStatus(onPlate);

            // log('------');
            // log('calcDistance');
            // log('dist:' + dist);
            
            if (dropped) return onPlate;
            else return true;
        },
        
        setBackground: function($el, specs) {
            var backgroundImage = 'url(./img/svg/onplate/' + specs.foodCat + '/' + specs.bgHorPos + '.svg)';
            $el.css({backgroundImage: backgroundImage});
        }
    }
    
    /********** Confettis **********/
    
    confettis = {
        FPS: 30,
        HOW_MANY: 200, // ipad: 200
        
        init: function() {
            
            var confHtml = '<div class="conf"></div>',
                html = '', transition = '',
                top = 330, left = 512,
                speed = NaN,
                delay = NaN,
                translate = 'translate(0px,0px)',
                speedAry = [1.3,1.8,2.4],
                colorsAry = ['orange', 'purple', 'green', 'yellow', 'blue'],
                rid = NaN;
                
            for (var i = 0; i < confettis.HOW_MANY; i++) {
                html += confHtml;
            }
            
            refs.$confettis.empty().append(html).addClass('active');
            
            $('.conf').each(function(i) {
                rid = Math.floor(Math.random() * speedAry.length);
                speed = speedAry[rid] * 0.8;
                delay = helper.roundNumber(0.3 + Math.random() * 2.2, 10);
                
                if (Math.random() <= 0.5) {
                    $(this).addClass('small');
                }
                
                transition = '-webkit-transform ' + speed + 's linear ' + delay + 's';
                translate = 'translate(' + left + 'px,' + top + 'px)';
                $(this).css({'transform': translate}).data('transition', transition).addClass(colorsAry[helper.getRandomNumber(colorsAry.length)]);
                
            });
            
            confettis.setTransition();
            setTimeout(confettis.start, 200);
        },
        
        setTransition: function() {
            $('.conf').each(function(i) {
                $(this).css({'transition': $(this).data('transition')})
            });
        },
        
        start: function() {
            
            app.playSound(sounds.SUCCESS);
            
            var left = 0,
                top = 0,
                translate = 'translate(' + left + 'px,' + top + 'px)',
                range =  2 * Math.PI,
                alpha = NaN,
                scale = 1.85;
            
            $('.conf').each(function(i) {
                alpha = Math.random() * range;
                left =  $(this).position().left +  Math.cos(alpha) * $(this).offset().left * scale;
                top =  $(this).position().top +  Math.sin(alpha) * $(this).offset().top * scale;
                
                translate = 'translate(' + left + 'px,' + top + 'px)';
                $(this).css({'transform': translate});
            });
        },
        
        stop: function() {
            refs.$confettis.removeClass('active');
        }
    }
    
    /********** Storm **********/
    
    storm = {
        
        ANI_LENGTH: 8000,
        $storm: $('#anitest'),
        boltInt: NaN,
        moveBackInt: NaN,
        killSoundInt: NaN,
        stopStormInt: NaN,
        stormOn: false,
        
        start: function() {
            
            storm.stormOn = true;
            
            storm.$storm.addClass('rotate').css({left: refs.$window.width()});
            storm.$storm.removeClass('transparent');
            storm.moveBackInt = setTimeout(function() { storm.$storm.removeClass('rotate').removeAttr('style'); }, 4500);
            //storm.killSoundInt = setTimeout(app.stopSound, storm.ANI_LENGTH, 'killSoundInt');
            storm.stopStormInt = setTimeout(storm.stop, storm.ANI_LENGTH);
            
            storm.boltInt = setInterval(function() {
                if (Math.random() > 0.5) {
                    refs.$actBolt = $(refs.$bolts[helper.getRandomNumber(refs.$bolts.length)]);
                    refs.$actBolt.removeClass('hidden');
                    setTimeout(function() { refs.$actBolt.addClass('hidden'); }, 150);
                }
            }, 300);
            
            
            app.playSound(sounds.FAILED, false);
        },
        
        stop: function() {
            
            if (!storm.stormOn) return;
            
            log('--- stop storm ----');
            storm.stormOn = false;
            storm.$storm.removeClass('rotate').addClass('transparent').removeAttr('style');
            clearInterval(storm.boltInt);
            clearTimeout(storm.killSoundInt);
            clearTimeout(storm.moveBackInt);
            clearTimeout(storm.stopStormInt);
        }
    }
    
    /********** Cutlery **********/
    
    cutlery = {
        
        showBubbleTO: NaN,
        hideBubbleTO: NaN,
        triggerNextTO: NaN,
        showDelay: NaN,
        hideDelay: NaN,
        hideDelayScenario: NaN,
        bubblemode: undefined,
        bubbleData: {},
        chatid: 0,
        chatid_trialover: 0,
        SHOW_BUBBLETXT: true,
        
        trigger: function(bubblemode, msg) {
            
            log('trigger / bubblemode: ' + bubblemode);
            // log('trigger / msg: ' + msg);
            
            var arrayID = NaN, rid = NaN, bubbleData = {}, worstFood = '', bestFood = '',
                exprAry = [], bgIDsAry = [], bgid = NaN,
                hideBubble = false;
            
            switch(bubblemode) {
                case game.BUBBLES_DROPPED_FOOD:
                case game.BUBBLES_CLICKED_CHART:
                    var cutexprVal = msg.substr(1,msg.indexOf(';') - 1),
                        cutexpr = 'M' + cutexprVal + ',G' + cutexprVal;

                    bubbleData = {standard: "standard", exp: cutexpr, txt: msg, bgid: 0};
                    break;

                case game.BUBBLES_SCENARIO_SPOON:
                case game.BUBBLES_SCENARIO_FORK:
                    // log(scenario.dataObj);

                    msg = bubblemode === game.BUBBLES_SCENARIO_SPOON ? scenario.dataObj['txt-spoon'] : scenario.dataObj['txt-fork'];

                    cutexpr = scenario.dataObj['txt-spoon'].split(';')[0] + ',' + scenario.dataObj['txt-fork'][0];

                    bubbleData = {standard: "standard", exp: cutexpr, txt: msg, bgid: 0, nosound: true};
                    break;

                case game.BUBBLES_NEWGAME:
                    arrayID = (game.platesCounter < 3) ? game.platesCounter : 2;
                    rid = helper.getRandomNumber(app.json.expressions[bubblemode][arrayID].length);
                    bubbleData = app.json.expressions[bubblemode][arrayID][rid];
                    break;
                
                case game.BUBBLES_FAILED:
                    if (game.platesCounter < 2) arrayID = game.platesCounter;
                    else if (game.platesCounter === 2) arrayID = 1;
                    else arrayID = 2;
                    
                    rid = helper.getRandomNumber(app.json.expressions[bubblemode][arrayID].length);
                    bubbleData = app.json.expressions[bubblemode][arrayID][rid];
                    break;
                
                case game.BUBBLES_SUCCESS:
                case game.BUBBLES_FREEZE_SIDES:
                case game.BUBBLES_FREEZE_VEGGIES:
                    rid = helper.getRandomNumber(app.json.expressions[bubblemode][0].length);
                    bubbleData = app.json.expressions[bubblemode][0][rid];

                    // used meal out of trash
                    if (game.skipMeal) {
                        rid = helper.getRandomNumber(app.json.expressions[bubblemode][1].length);
                        bubbleData = app.json.expressions[bubblemode][1][rid];
                    }
                    break;
                
                case game.BUBBLES_POSITIVE:
                    //  new logic needed: triggerd by potatoes, tofu, no-animals, or nothing
                    //rid = helper.getRandomNumber(app.json.expressions[bubblemode][0].length);
                    //bubbleData = app.json.expressions[bubblemode][0][rid];
                    
                    log('game.BUBBLES_POSITIVE');
                    
                    bestFood = game.getFeedback(game.currentMeal).bestFood;
                    
                    //  check for vegan menu, overrules specific stuff
                    if (game.isVegan(game.currentMeal)) bestFood = 'no-animals';
                    
                    log('bestFood: ' + bestFood);
                    
                    var exprAry = app.json.expressions.positive[0], bgIDsAry = [], bgid = NaN;
                    
                    for (var i = 0; i < exprAry.length; i++) {
                        if (exprAry[i]['triggered-by'] === bestFood) {
                            bgIDsAry.push(exprAry[i]['bgid']);
                        }
                    }
                    
                    log(bgIDsAry);
                    log(bgIDsAry.length);

                    //  no food specific message found
                    if (bgIDsAry.length === 0) return;
                    
                    rid = helper.getRandomNumber(bgIDsAry.length);
                    bgid = bgIDsAry[rid];
                    
                    bgid -= 5;
                    
                    bubbleData = app.json.expressions[bubblemode][0][bgid];
                    
                    break;
                
                case game.BUBBLES_NEGATIVE:
                    log('game.BUBBLES_NEGATIVE');
                    
                    worstFood = game.getFeedback(game.currentMeal).worstFood;
                    
                    var exprAry = app.json.expressions.negative[0], bgIDsAry = [], bgid = NaN;
                    
                    for (var i = 0; i < exprAry.length; i++) {
                        if (exprAry[i]['triggered-by'] === worstFood) {
                            bgIDsAry.push(exprAry[i]['bgid']);
                        }
                    }
                    
                    log('worstFood: ' + worstFood);
                    
                    log(bgIDsAry);
                    log(bgIDsAry.length);

                    //  no food specific message found
                    if (bgIDsAry.length === 0) return;
                    
                    //rid = helper.getRandomNumber(app.json.expressions[bubblemode][0].length);
                    
                    rid = helper.getRandomNumber(bgIDsAry.length);
                    bgid = bgIDsAry[rid];
                    
                    //bubbleData = app.json.expressions[bubblemode][0][rid];
                    bubbleData = app.json.expressions[bubblemode][0][bgid];
                    //bubbleData = app.json.expressions[bubblemode][0][7];
                    break;

                case game.BUBBLES_TRIAL_START:
                case game.BUBBLES_SHOWCHART:
                case game.BUBBLES_TRASHFOOD:
                case game.BUBBLES_TRASHONSTAGE:
                    
                    if (cutlery.chatid === app.json.expressions[bubblemode][0].length) {
                        cutlery.resetChat();
                        hideBubble = true;
                        break;
                    }
                    
                    bubbleData = app.json.expressions[bubblemode][0][cutlery.chatid];
                    cutlery.chatid++;

                    if (bubbleData) {
                        if (bubbleData.showNext > 0) {
                            cutlery.triggerNextBubble(bubbleData.showNext, bubblemode);
                        }
                    }
                    break;


                case game.BUBBLES_TRIAL_WON:
                case game.BUBBLES_TRIAL_LOST:

                    if (cutlery.chatid_trialover === app.json.expressions[bubblemode][0].length) {
                        cutlery.resetChatTrialOver();
                        hideBubble = true;
                        app.stopTrialMode();
                        break;
                    }
                    
                    bubbleData = app.json.expressions[bubblemode][0][cutlery.chatid_trialover];
                    cutlery.chatid_trialover++;

                    if (bubbleData) {
                        if (bubbleData.showNext > 0) {
                            cutlery.triggerNextBubble(bubbleData.showNext, bubblemode);
                        }
                    }

                    break;

            }
            
            cutlery.bubbleData = bubbleData;
            cutlery.bubblemode = bubblemode;

            // log('------bubbleData-------');
            // log(bubbleData);
            // log('------bubblemode-------');
            // log(bubblemode);

            if (!!bubbleData.standard) {
                cutlery.bubblemode = bubbleData.standard;
            }

            if (hideBubble) cutlery.hideBubble();
            else cutlery.setExpression(bubbleData, bubblemode);
        },

        resetChat: function() {
            cutlery.chatid = 0;
        },

        resetChatTrialOver: function() {
            cutlery.chatid_trialover = 0;
        },
        
        setExpression: function(bubbleData, bubblemode) {
            
            log('setExpression / bubblemode: ' + bubblemode);
            
            var spoonID = parseInt(bubbleData.exp.split(',')[0].substr(1)),
                forkID = parseInt(bubbleData.exp.split(',')[1].substr(1)),
                backgroundPosition = -game.constants.CUTLERY_HOROFF * (forkID - 1) + 'px 0';
            
            refs.$fork.css({backgroundPosition: backgroundPosition});
            
            backgroundPosition = -game.constants.CUTLERY_HOROFF * (spoonID - 1) + 'px 0';
            refs.$spoon.css({backgroundPosition: backgroundPosition});
            
            cutlery.hideBubble();
            clearTimeout(cutlery.showBubbleTO);
            
            if (bubblemode) {
                // cutlery.showBubbleTO = setTimeout(cutlery.showBubble, cutlery.showDelay);
                cutlery.showBubbleTO = setTimeout(cutlery.showBubble, cutlery.showDelay);
            }
        },

        triggerNextBubble: function(delay, mode) {
            clearTimeout(cutlery.triggerNextTO);
            cutlery.triggerNextTO = setTimeout(cutlery.trigger, delay, mode);
        },
        
        showBubble: function() {

            log('showBubble');
            // log('bubbleData');
            // log(cutlery.bubbleData);
            
            var vertOffset = (!!cutlery.bubbleData.standard) ? 300 : 150;
            
            var data = cutlery.bubbleData,
                backgroundPosition = '0px ' + -vertOffset * data.bgid + 'px',
                $ref = (data.txt.split(';')[0].indexOf('G') >= 0) ? refs.$forkBub: refs.$spoonBub,
                soundstrg = (data.txt.split(';')[0].indexOf('G') >= 0) ? sounds.SHOW_BUBBLE_FORK : sounds.SHOW_BUBBLE_SPOON,
                hideBubbleDelay = scenario.visible ? cutlery.hideDelayScenario : cutlery.hideDelay,
                bubbleTxt = data.txt.substr(data.txt.indexOf(';') + 1);

                // bubbleTxt = 'Eine Tomate aus dem beheizten Gewächshaus hat den gleichen CO2 Fußabdruck wie 16 Freilandtomaten.';


            // app.playSound(sounds.SHOW_BUBBLE);
            if (!cutlery.bubbleData.nosound) app.playSound(soundstrg);

            if (cutlery.bubbleData.standard) {

                vertOffset = 0;

                if (bubbleTxt.length > 60) vertOffset = -300;
                if (bubbleTxt.length > 80) vertOffset = -600;

                backgroundPosition = '0 ' + vertOffset +'px';
                // if (data.txt.split(';')[0].indexOf('M') >= 0) backgroundPosition = '0 -300px';
                if (data.txt.split(';')[0].indexOf('M') >= 0) backgroundPosition = '-500px ' + vertOffset +'px';
                // log('backgroundPosition: ' + backgroundPosition);
            }

            //  debug
            if (cutlery.SHOW_BUBBLETXT) {
                $ref.html('<p>' + bubbleTxt + '</p>');
            }
            
            $ref.css({backgroundPosition: backgroundPosition});
            
            $ref.removeClass().addClass('bubble visible');
            $ref.addClass(cutlery.bubblemode);

            if (bubbleTxt.length > 60 && bubbleTxt.length <= 80) $ref.addClass('midsize');
            if (bubbleTxt.length > 80) $ref.addClass('bigsize');
            
            clearTimeout(cutlery.hideBubbleTO);

            if (!game.trialmode) {
                cutlery.hideBubbleTO = setTimeout(cutlery.hideBubble, hideBubbleDelay);
            }
        },
        
        hideBubble: function() {
            log('hideBubble'); 
            // return;
            refs.$spoonBub.removeClass('visible');
            refs.$forkBub.removeClass('visible');
        },
        
        clearTimeouts: function() {
            
        }
    }
    
    /********** Debug **********/
    
    debug = {
        printObject: function(data, noClear) {
            var html = noClear ? $('[role="debug"] p').html() : '';
            
            for (var key in data) {
                html += key + ': ' + data[key] + '<br>'
            }
            
            $('[role="debug"] p').html(html);
        }
    }

     return {
        refs: refs,
        constants: constants,
        app: app,
        gallery: gallery,
        game: game,
        configs: configs,
        barchart: barchart,
        piechart: piechart,
        cutlery: cutlery,
        confettis: confettis,
        storm: storm,
        scenario: scenario
    };

}(jQuery, window));

