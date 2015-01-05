$(function() {
    var set_w = null,
        set_h = null,
        set_l = null,
        set_t = null,
        o_w = 640,
        o_h = 330,
        orin_videoratio = 16/9,
        setratio = null,
        getReadyState2 = null,
        getReadyState1 = null,
        c_s = null,
        click_s = null,
        console_open = false,
        videofirstload = false,
        welcomeFinish = false,
        t_v = document.getElementById("pagevideo"),
        get_h = null,
        get_w = null,
        isLandscape = null,
        isPortrait = null;

    /*
        get：获取电脑端的宽高
        set：设置
    */

    /*获取页面高度与宽度*/
    function getBasic() {
        get_h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        get_w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    /*根据设备调整视频*/
    function vwIosP(){
        getBasic();
        set_w = (get_h/o_h)*o_w;
        set_l = -((Math.abs(set_w-get_w))/2+100)+'px';
        $('#pagevideo').css({'height':get_h,'width':set_w,'-webkit-transform':'translateX('+set_l+')','transform':'translateX('+set_l+')'});
    }
    function vwAndoridP(){
        getBasic();
        set_w = (get_h/o_h)*o_w;
        set_l = -((Math.abs(set_w-get_w))/2+100)+'px';
        $('#pagevideo').css({'height':get_h,'width':set_w,'margin-left':set_l});
    }

    function vwIosL(){
        getBasic();
        set_h = (get_w/o_w)*o_h;
        $('#pagevideo').css({'width':get_w,'height':set_h,'-webkit-transform':'translateX(0)','transform':'translateX(0)'});
    }

    function vwPc(){
        getBasic();
        if(get_w <= o_w){
            if(get_h <= o_h){
                set_l = -((o_w-get_w)/2);
                set_t = -((o_h-get_h)/2);
                $('.wwfmedia').css({'width':o_w,'height':o_h,'left':set_l,'top':set_t});
            }
            else{
                set_w=(get_h/o_h)*o_w;
                set_l=-((set_w-get_w)/2);
                $('.wwfmedia').css({'width':set_w,'min-height':'100%','left':set_l,'top':'0'});
            }
        }else{
            if(get_h<=o_h){
                set_t=-((o_h-get_h)/2);
                $('.wwfmedia').css({'width':'100%','height':o_h,'top':set_t,'left':'0'});
            }
            else{
                setratio=get_w/get_h;
                if(orin_videoratio>setratio){
                    set_w=(get_h/o_h)*o_w;
                    set_l=-((set_w-get_w)/2);
                    $('.wwfmedia').css({'width':set_w,'height':get_h,'top':'0','left':set_l});
                }else{
                    $('.wwfmedia').css({'width':get_w,'height':'auto','top':'0','left':'0'});
                }
            }
        }
    }


    function videoModify(){
        /*ios*/
        if(device.ios()){
            vwIosP();
        } else if(device.android()){
            /*android*/
            vwAndoridP();
        } else{
            /*PC*/
            $('#pagevideo').attr('width','100%');
            vwPc();
            $(window).resize(function() {
                vwPc();
            });
        }
    }


    /*屏幕旋转对象*/
    var evt = "onorientationchange" in window ? "orientationchange":false;
    window.addEventListener(evt, function(){
        isLandscape=device.landscape();
        isPortrait = device.portrait();
        if(isLandscape){
            vwIosL();
        } else if(isPortrait){
            vwIosP();
        }
    },false);

    /////////////////////////////////////////////////////////////////////////
    // 初始化
    var $menuArea = $('.menu-area'),
        $episodesArea = $('.episodes-area'),
        $episode = $('.episode'),
        $loading = $('.loading'),
        tv = document.getElementById("pagevideo"),
        menuIsDisplay = false,
        currentIndex = 1,
        mySwiper = $('.swiper-container').swiper({
            mode: 'horizontal',
            loop: true,
            initialSlide: 4,
            onSlideChangeEnd: function() {
                currentIndex = (mySwiper.activeIndex % 4) || 4;
                // 对应的 episode-control 高亮
                $('.swiper-switch').removeClass('current');
                $('.swiper-switch').eq(currentIndex - 1).addClass('current');
            }
        }),
        playVideo = function(index) {
            $loading.show().css('display', 'table');
            // 初始化video
            var videoUrl = 'http://115.28.10.1/media/' + index + '.mp4';
            $('#pagevideo').attr('src', videoUrl);
            $('#pagevideo')[0].addEventListener('play', function() {
                $loading.hide();
            });
            videoModify();
            t_v.play();
        };
    $('#arrow-left').on('click', function() {
        mySwiper.swipePrev();
    });
    $('#arrow-right').on('click', function() {
        mySwiper.swipeNext();
    });

    $menuArea.on('click', function() {
        $episodesArea.stop();
        if (!menuIsDisplay) {
            $episodesArea.show().animate({'top': '0px'}, 400, 'easeInOutQuad', function() {
                menuIsDisplay = true;
            });
        } else {
            $episodesArea.animate({'top': '200px'}, 750, 'easeInOutQuad', function() {
                menuIsDisplay = false;
                $episodesArea.hide();
            });
        }
    });
    $('.episode').on('click', function() {
        $loading.show().css('display', 'table');
        $('.episodes-area').animate({'top': '200px'}, 750, 'easeInOutQuad', function() {
            menuIsDisplay = false;
            $episodesArea.hide();
        });
        playVideo(currentIndex);
    });

    // init for play the first
    playVideo(currentIndex);
});