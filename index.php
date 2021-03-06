<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Dinner Quest</title>
        <meta name="description" content="">
            
        <!-- <meta name="apple-touch-fullscreen" content="YES" /> -->
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        <meta http-equiv="x-rim-auto-match" content="none" />
            
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">

        <meta property="og:title" content="Dinnerquest">
        <meta property="og:description" content="Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.">
        <meta property="og:image" content="http://havefunwashing.net/dq/v3/fb-share.jpg"/>

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">

        <script>
            if (location.hash.indexOf('#dev') >= 0) document.write('<link rel="stylesheet" href="css/main-v2.css">');
        </script>

        <?php
            if (isset($_GET["fb"])) {
                echo "<script>var dqfbts = '" . $_GET["fb"] . "'; </script>";
            }
        ?>

        <link href="css/ui-lightness/jquery-ui-1.10.4.css" rel="stylesheet">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>

<!--         <div id="anitest">
            <div class="bolt2 one hidden"></div>
            <div class="bolt2 two hidden"></div>
            <div class="bolt2 three hidden"></div>
        </div> -->
        
        <div id="performance-boost"><p></p></div>
        
        <div role="debug" hidden><p></p></div>

        <div class="content-pages">
            <div id="gallery">
                <div class="gal-header"></div>
                <div class="gal-wrapper"></div>
            </div>
            <div id="infopage"><div id="continueButton"></div></div>
        </div>        
        
        <div id="overlays">
            <div id="stage">
                <div class="meal-check"></div>
                <div class="scenario hidden">
                    <div class="img-wrapper">
                        <img src="" />
                    </div>
                    <p></p>
                </div>
                <div id="barchart" class="hidden">
                    <div class="mask">
                        <div class="co2-limit"><p>0,7 kg CO<sub>2</sub></p></div>
                        <div class="barchart-container"></div>
                    </div>
                    <div class="result"><p><font class="big">0.24</font> kg CO<sub>2</sub></p></div>
                </div>
                <div id="piechart hidden">
                    <div id="d3"></div>
                    <svg class="d3chart"></svg>
                </div>
                <div id="foodstack"></div>
                <div id="confettis"></div>
                <div class="fork">
                    <div class="bubble"></div>
                </div>
                <div class="spoon">
                    <div class="bubble"></div>
                </div>
                <div class="hud-new">
                    <div class="button1 start-trial hidden"></div>
                    <div class="button2 skip-trial hidden"></div>
                    <div class="button show-chart hidden"><p>diagramm</p></div>
                </div>

                <div class="hud hidden transparent">
                    <div class="btn-wrapper">
                        <a target="_blank" href="" class="fb-share icon hidden" data-pagetype="fb-share"></a>
                        <div class="toggle btnn small diagramm icon menubtn-sound"><p data-label="ESSENSANSICHT">DIAGRAMM</p></div>
                        <div class="start-new-game continue icon playbtn-sound" data-pagetype="continue"></div>
                        <div class="myplates icon btnn menubtn-sound"><p>MEINE TELLER</p></div>
                    </div>
                </div>
                <div id="plates">
                    <div class="intro-container"></div>
                    <div class="plate-mask"></div>
                </div>

                <div id="chart">
                    <!-- <div id="newGameButton"></div> -->
                </div>
            </div>
        </div>


        <div class="misc-icons-wrapper">
            <div class="logo icon transparent"></div>
            <a target="_blank" href="" class="fbshare icon transparent standard js-fbshare hidden" title="Share on Facebook">f</a>
            <div class="gallery icon transparent standard" data-pagetype="gallery"></div>
            <div class="info icon transparent standard" data-pagetype="infopage"></div>
            <div class="sound icon transparent standard" data-pagetype="sound"></div>
        </div>

        <!-- <div class="trash icon transparent hidden"></div> -->
        
        <!-- .menu-wrapper -->
        <div class="menu-mask">
            <div class="menu-wrapper down">
                <div class="menu-container">
                    <div class="navi-container">
                        <div data-foodcat="2" class="animals"></div>
                        <div data-foodcat="0" class="veggies"></div>
                        <div data-foodcat="1" class="sides"></div>
                        
                        <div data-foodcat="3" class="fruit"></div>
                        <div data-foodcat="4" class="fastfood"></div>
                    </div>
                    <div class="foodmenu-mask">
                        <div class="food-container"></div>
                    </div>
                    <div class="menu-btn prev standard"></div>
                    <div class="menu-btn next standard"></div>
                </div>
            </div><!-- /.menu-wrapper -->
        </div>
        
        <div id="audiocontainer">
            <audio class="btn-audio snd first-intro" preload="auto"><source src="./media/sound-final/intro/Dinnerquest-Intro.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd standard-click" preload="auto"><source src="./media/sound-final/clicks-highlights/ClickGeneral.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd playbtn-click" preload="auto"><source src="./media/sound-final/clicks-highlights/PlayButton.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd menubtn-click" preload="auto"><source src="./media/sound-final/clicks-highlights/MenuClick.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd change-tab" preload="auto"><source src="./media/sound-final/gameplay/Schild2.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd dropped-food" preload="auto"><source src="./media/sound-final/gameplay/FoodOnThePlate1.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd restock-food" preload="auto"><source src="./media/sound-final/gameplay/FoodBackToMenu.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd select-dish" preload="auto"><source src="./media/sound-final/gameplay/SelectDish.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd show-bubble-fork" preload="auto"><source src="./media/sound-final/gameplay/fork.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd show-bubble-spoon" preload="auto"><source src="./media/sound-final/gameplay/spoon.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd gameover-won" preload="auto"><source src="./media/sound-final/gameplay/success.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd gameover-lost" preload="auto"><source src="./media/sound-final/gameplay/fail.mp3" type="audio/mpeg" /></audio>
            <audio class="btn-audio snd new-game" preload="auto"><source src="./media/sound-final/new_game.mp3" type="audio/mpeg" /></audio>
        </div>
        <div id="videocontainer" class="transparent">
            <div class="videohud">
                <div class="btn-wrapper">
                    <div class="skipvideo js-skipvideo icon btnn menubtn-sound"><p>WEITER</p></div>
                </div>
            </div>

            <video id="intro-video" width="100%" height="100%" _autoplay _controls poster="./img/png/videobg.png">
                <source src="./media/video/intro-final.mp4" type="video/mp4">
                <source src="./media/video/intro-final.webm" type="video/webm">
            </video>
        </div>

        
        <script src="js/vendor/jquery-2.1.4.min.js"></script>



        <!-- <script src="js/vendor/jquery-ui-1.10.4.min.js"></script> -->
        <script src="js/vendor/jquery-ui-latest.min.js"></script>
        <script src="js/vendor/jquery.ui.touch-punch.min.js"></script>
        <script src="js/vendor/throttle-1.1.js"></script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>
        <script src="js/gallery.js"></script>
        <!-- <script src="js/vendor/stats.js"></script> -->

    </body>
</html>
