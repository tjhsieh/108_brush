	var grad_id = {main: 0, last: 0};
	
	function refreshDefault(){
		scaleRatio = baseScale;
	}

	function customGradient(prefix, gid){
		var index = 0;
        $.each($(gid + " stop"), function(index, value) {
        	$stop = $(gid + " stop:nth-child("+ (index+1) +")");
        	var offset = ( $('input[name="'+ prefix +'_dif_'+ (index+1) +'"]').val() ) + "%";
            $stop.attr('offset',  offset);
            var r = $('input[name="'+ prefix +'_r_'+ (index+1) +'"]').val();
            var g = $('input[name="'+ prefix +'_g_'+ (index+1) +'"]').val();
            var b = $('input[name="'+ prefix +'_b_'+ (index+1) +'"]').val();
            var rgb = 'rgb('+ r +','+ g +','+ b +')';
            $stop.css('stop-color', rgb);
            var opacity = $('input[name="'+ prefix +'_opac_'+ (index+1) +'"]').val();
            $stop.css('stop-opacity', opacity);
        }); 

        var newGradient = '<radialGradient id="user_custom_'+ prefix +'_gradient_'+ grad_id[prefix] +'" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"> \n\r<stop offset="0%" style="stop-color:rgb(0,0,0); stop-opacity:1" /> \n\r<stop offset="50%" style="stop-color:rgb(0,0,0); stop-opacity:1" /> \n\r<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" /> \n\r</radialGradient>';

        $("#mainboard defs").append(newGradient);
        // console.log(newGradient);
        $('input[name="'+ prefix +'_color"][value="custom"]').attr('rel', '#user_custom_'+ prefix +'_gradient_'+ grad_id[prefix]++);
        $("#mainboard defs").html($("#mainboard defs").html());
     	
	}

	function submitForm(){
		var $main = $('input[name*=main_color]:checked');
		var $last = $('input[name*=last_color]:checked');

		if ($main.val()!="custom"){
			mainFill = $main.val();
		}else{
			mainFill = "url(" + $main.attr('rel') + ")";
			customGradient("main", $main.attr('rel'));
		}

		if ($last.val()!="custom"){
			lastFill = $last.val();
		}else{
			lastFill = "url(" + $last.attr('rel') + ")";
			customGradient("last", $last.attr('rel'));
		}

		// $main.val()

		baseScale = Number( $('input[name="width"]').val() )/10;
		defaultAngle = Number( $('input[name="def_angle"]').val() );
		scaleDecCond = Number( $('input[name="scale_dec_cond"]').val()) ;
		scaleDecRate = Number( $('input[name="scale_dec_rate"]').val() );
		scaleIncRate = Number( $('input[name="scale_inc_rate"]').val() );
		distToFill = Number( $('input[name="distToFill"]').val() );
		t_increment_ratio = Number( $('input[name="t_increment"]').val() );

		refreshDefault();
	}

	$(".slider_gp").change(function(){
		var val = $(this).val();
		var rel = $(this).attr('rel');
		$(".slider_gp[rel="+rel+"]").val(val);
	});

	$('input[name*="main_color"]').change(function(){
		$('input[name*="main_color"]:checked').val() == "custom" ? $("#main_color_table").css('display', 'inline-block') : $("#main_color_table").hide();
	});

	$('input[name*="last_color"]').change(function(){
		$('input[name*="last_color"]:checked').val() == "custom" ? $("#last_color_table").css('display', 'inline-block') : $("#last_color_table").hide();
	});
