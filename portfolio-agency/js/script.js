$(window).on("load", function () {

    "use strict";

    /* ===================================
            Loading Timeout
     ====================================== */
    $('.side-menu').removeClass('hidden');

    setTimeout(function(){
        $('.preloader').fadeOut();
    }, 1000);


});


jQuery(function ($) {

    "use strict";
    /* ===================================
       Navbar smooth Scroll
   ====================================== */
    // $(".scroll").on("click", function (event) {
    //     event.preventDefault();
    //     $("html,body").animate({
    //         scrollTop: $(this.hash).offset().top - 50}, 1200);
    // });
    /* ===================================
        Side Menu
    ====================================== */
    if ($("#sidemenu_toggle").length) {
        $("#sidemenu_toggle").on("click", function () {
            $(".side-menu").removeClass("side-menu-opacity");
            $(".pushwrap").toggleClass("active");
            $(".side-menu").addClass("side-menu-active"), $("#close_side_menu").fadeIn(700)
        }), $("#close_side_menu").on("click", function () {
            $(".side-menu").removeClass("side-menu-active"), $(this).fadeOut(200), $(".pushwrap").removeClass("active");
            setTimeout(function(){
                $(".side-menu").addClass("side-menu-opacity");
            }, 500);
        }), $(".side-menu .navbar-nav .nav-link").on("click", function () {
            $(".side-menu").removeClass("side-menu-active"), $("#close_side_menu").fadeOut(200), $(".pushwrap").removeClass("active");
            setTimeout(function(){
                $(".side-menu").addClass("side-menu-opacity");
            }, 500);
        }), $("#btn_sideNavClose").on("click", function () {
            $(".side-menu").removeClass("side-menu-active"), $("#close_side_menu").fadeOut(200), $(".pushwrap").removeClass("active");
            setTimeout(function(){
                $(".side-menu").addClass("side-menu-opacity");
            }, 500);
        });
    }
    // ===========================
    //    bottom nav appear
    // ===========================
    $(function () {
        var $win = $(window);

        jQuery(function($) {
            $(window).scroll(function() {
                if($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
                    // alert("near bottom!");
                    $('.sidenav-bottom').css('opacity','1');
                    $('.sidenav-bottom').addClass('sidenav-bottom-fixed');
                }
                if($(window).scrollTop() + $(window).height() < $(document).height() - 300 && $(window).scrollTop() + $(window).height() > $(document).height() - 400 )  {
                    $('.sidenav-bottom').css('opacity','0');
                    $('.sidenav-bottom').removeClass('sidenav-bottom-fixed');
                }
            });
        });
    });
        // ===========================
        //    header appear
        // ===========================
        $(window).on('scroll', function () {

            if ($(this).scrollTop() > 260) { // Set position from top to add class
                $('.sidenav-bottom').css('opacity','0');
                $('header .inner-header').addClass('header-appear');
            }
            if($(this).scrollTop() < 260) {
                $('.sidenav-bottom').css('opacity','1');
                $('header .inner-header').removeClass('header-appear');
            }
        });


        // ===========================
        //     portfolio carousel
        // ===========================
        var owlCommon = {
            loop: true,
            margin: 10,
            slideSpeed: 5000,
            slideTransition: 'linear',
            nav: false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplaySpeed: 800,
            autoplayHoverPause: true,
            responsive: { 0: { items: 1 }, 600: { items: 1 }, 1000: { items: 1 } }
        };
        $('.apartment-gallery .portfolio-carousel').owlCarousel($.extend({}, owlCommon, {
            autoHeight: true,
            autoHeightClass: 'owl-height'
        }));
        $('.location-block .portfolio-carousel').owlCarousel($.extend({}, owlCommon, {
            autoHeight: true,
            autoHeightClass: 'owl-height'
        }));

        $('.portfolio-right-arr').click(function() {
            var container = $(this).closest('.position-relative');
            var owl = container.find('.portfolio-carousel');
            owl.owlCarousel();
            owl.trigger('next.owl.carousel');
        });
        $('.portfolio-left-arr').click(function() {
            var container = $(this).closest('.position-relative');
            var owl = container.find('.portfolio-carousel');
            owl.owlCarousel();
            owl.trigger('prev.owl.carousel');
        });

        // ===========================
        //     Apartment gallery lightbox (Vidi galeriju)
        // ===========================
        (function() {
            var $lightbox = $('#gallery-lightbox');
            var $backdrop = $('#gallery-lightbox-backdrop');
            var $close = $('#gallery-lightbox-close');
            var $prev = $('#gallery-lightbox-prev');
            var $next = $('#gallery-lightbox-next');
            var $img = $('#gallery-lightbox-img');
            var $counter = $('#gallery-lightbox-counter');
            var images = [];
            var currentIndex = 0;

            function showImage(index) {
                if (index < 0) index = images.length - 1;
                if (index >= images.length) index = 0;
                currentIndex = index;
                var item = images[currentIndex];
                if (item) {
                    $img.attr('src', item.src).attr('alt', item.alt);
                    $counter.text((currentIndex + 1) + ' / ' + images.length);
                }
                $prev.toggle(images.length > 1);
                $next.toggle(images.length > 1);
                $counter.toggle(images.length > 1);
            }

            function openLightbox(items, startIndex) {
                images = items || [];
                currentIndex = Math.max(0, Math.min(startIndex || 0, images.length - 1));
                $lightbox.removeAttr('hidden');
                requestAnimationFrame(function() { $lightbox.addClass('is-open'); });
                document.body.style.overflow = 'hidden';
                showImage(currentIndex);

                var touchStartX = 0;
                function onTouchStart(e) { touchStartX = e.originalEvent.touches[0].clientX; }
                function onTouchEnd(e) {
                    var touchEndX = e.originalEvent.changedTouches[0].clientX;
                    var delta = touchStartX - touchEndX;
                    if (delta > 50) { currentIndex++; showImage(currentIndex); }
                    else if (delta < -50) { currentIndex--; showImage(currentIndex); }
                }
                $lightbox.off('touchstart touchmove touchend').on('touchstart', onTouchStart).on('touchend', onTouchEnd);
            }

            function closeLightbox() {
                $lightbox.removeClass('is-open');
                document.body.style.overflow = '';
                setTimeout(function() { $lightbox.attr('hidden', true); }, 280);
            }

            $('.btn-gallery-open').on('click', function() {
                var $gallery = $(this).closest('.apartment-gallery, .location-gallery');
                var $imgs = $gallery.find('.apartment-gallery-images img');
                var items = [];
                $imgs.each(function() {
                    items.push({ src: $(this).attr('src'), alt: $(this).attr('alt') || '' });
                });
                if (items.length) openLightbox(items, 0);
            });

            $backdrop.on('click', closeLightbox);
            $close.on('click', closeLightbox);
            $prev.on('click', function(e) { e.stopPropagation(); currentIndex--; showImage(currentIndex); });
            $next.on('click', function(e) { e.stopPropagation(); currentIndex++; showImage(currentIndex); });
            $lightbox.find('.gallery-lightbox-content').on('click', function(e) { e.stopPropagation(); });

            $(document).on('keydown', function(e) {
                if (!$lightbox.hasClass('is-open')) return;
                if (e.key === 'Escape') { closeLightbox(); return; }
                if (e.key === 'ArrowLeft') { currentIndex--; showImage(currentIndex); return; }
                if (e.key === 'ArrowRight') { currentIndex++; showImage(currentIndex); return; }
            });
        })();

        // ===========================
        //     Testimonial carousel
        // ===========================
        $('.review-carousel').owlCarousel({

            loop:true,
            margin:10,
            slideSpeed: 5000,
            slideTransition:'linear',
            nav:false,
            dots:false,
            autoplay:false,
            autoplayTimeout:8000,
            autoplayHoverPause:true,
            responsive:{
                0:{

                    items:1
                },
                600:{
                    items:1
                },
                1000:{
                    items:1
                },
            }

        });


    // ===========================
    //     Set current year
    // ===========================
    (function setCurrentYear(){
        try {
            var year = new Date().getFullYear();
            $('.current-year').text(year);
        } catch(e) { /* no-op */ }
    })();

    /* ===================================
             Wow Effects
   ======================================*/
    var wow = new WOW(
        {
            boxClass:'wow',      // default
            animateClass:'animated', // default
            offset:0,          // default
            mobile:false,       // default
            live:true        // default
        }
    );
    wow.init();



});