$(document).ready(function(){
  $('.product-carousel').owlCarousel({
    loop: true,
    margin: 25,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 1,     // يمشي على طول
    smartSpeed: 2500,       // يخليه يمشي ببطء وسلاسة
    autoplayHoverPause: false,
    touchDrag: true,
    mouseDrag: true,
    responsive: {
      0: { items: 2 },
      576: { items: 2 },
      768: { items: 3 },
      992: { items: 4 }
    }
  });
});

// لما المستخدم يضغط على كارت المنتج في الموبايل، بدّل الصور يدويًا
$('.product-item').on('touchstart', function () {
  const imgDefault = $(this).find('.default-img');
  const imgHover = $(this).find('.hover-img');

  imgDefault.css('opacity', '0');
  imgHover.css('opacity', '1');
});

// ولما يسيب (release) يرجّع الصورة الأصلية
$('.product-item').on('touchend', function () {
  const imgDefault = $(this).find('.default-img');
  const imgHover = $(this).find('.hover-img');

  imgDefault.css('opacity', '1');
  imgHover.css('opacity', '0');
});
