$(document).ready(function(){
	'use strict';

	$('.slider').not('.slick-initialized').slick({
		autoplay: true,
		autoplaySpeed: 5000,
		speed: 600,
		mobileFirst: true,
		infinite: true,
		dots: true,
		arrows: false
	});

	$('#products .box').click(function(){
		location.href = $(this).data('href');
	});

	$('#products-details .product-item').on('mouseover', function(){
		var index = $(this).data('index');

		$('.product-item.active').removeClass('active');
		$(this).addClass('active');
		
		$('.details-item.active').fadeOut(function(){
			$('.details-item.active').removeClass('active');

			$('.details-item[data-index=' + index + ']').fadeIn(function(){
				$('.details-item[data-index=' + index + ']').addClass('active');
			});
		});
	});

	$('header .open-menu-mobile').on('click', function(e){
		$(this).toggleClass('opened');
		$('header .menu').slideToggle();
	});
});