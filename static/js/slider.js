$(document).ready(function () {
  const owl = $('.product-carousel');

  owl.owlCarousel({
    loop: true,
    margin: 25,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 1,      // يتحرك على طول
    smartSpeed: 2500,        // يخليه يمشي ببطء وسلاسة
    autoplayHoverPause: false, // إحنا هنتحكم يدوي
    touchDrag: true,
    mouseDrag: true,
    responsive: {
      0: { items: 2 },
      576: { items: 2 },
      768: { items: 3 },
      992: { items: 4 }
    }
  });

  // إيقاف التمرير التلقائي عند hover بالماوس
  $('.product-item').on('mouseenter', function () {
    owl.trigger('stop.owl.autoplay');
  });

  // استئناف التمرير التلقائي عند الخروج بالماوس
  $('.product-item').on('mouseleave', function () {
    owl.trigger('play.owl.autoplay', [1000]);
  });

  // تبديل الصور يدويًا في الموبايل عند اللمس
  $('.product-item').on('touchstart', function () {
    const imgDefault = $(this).find('.default-img');
    const imgHover = $(this).find('.hover-img');

    imgDefault.css('opacity', '0');
    imgHover.css('opacity', '1');

    // وقف autoplay عند اللمس
    owl.trigger('stop.owl.autoplay');
  });

  // رجوع الصور الأصلية عند نهاية اللمس
  $('.product-item').on('touchend', function () {
    const imgDefault = $(this).find('.default-img');
    const imgHover = $(this).find('.hover-img');

    imgDefault.css('opacity', '1');
    imgHover.css('opacity', '0');

    // تشغيل autoplay تاني بعد اللمس
    owl.trigger('play.owl.autoplay', [1000]);
  });
});
