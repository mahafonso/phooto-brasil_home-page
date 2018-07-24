$(document).ready(function(){
	'use strict';

	// $('.highlight .slider').not('.slick-initialized').slick({
	// 	// autoplay: true,
	// 	// autoplaySpeed: 6000,
	// 	// mobileFirst: true,
	// 	dots: true,
	// 	arrows: false
	// 	// responsive: [{
	// 	// 	breakpoint: 568,
	// 	// 	settings: {
	// 	// 		arrows: true,
	// 	// 	}
	// 	// }]
	// });

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
});