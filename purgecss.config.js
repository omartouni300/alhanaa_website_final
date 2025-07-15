module.exports = {
  content: ['templates/**/*.html'],
  css: ['static/css/style.css'],
  output: 'static/css/style.purged.css',
  safelist: {
    standard: [
      /active$/,
      /show$/,
      /nav-scrolled$/,
      /animated-text$/,
      /animated-slogan$/,
      /fadeSlideIn$/,
      /visible$/,
      /carousel-caption$/,
      /comment$/,
      /btn__top$/,
      /navbar-toggler$/,
      /btn__menu__open$/,
      /btn__menu__close$/,
      /carousel-item$/,
      /active$/,
      /fade-in$/,
      /fade-in-left$/,
      /delay-/
    ],
    deep: [
      /carousel-inner$/,
      /carousel-item$/,
      /active$/,
      /comment$/,
      /animated-text$/,
      /animated-slogan$/,
      /fadeSlideIn$/,
      /visible$/,
      /btn__top$/,
      /navbar-toggler$/,
      /btn__menu__open$/,
      /btn__menu__close$/,
      /fade-in$/,
      /fade-in-left$/,
      /delay-/
    ]
  }
};

