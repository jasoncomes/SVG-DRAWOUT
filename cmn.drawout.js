// svgController.initSVG( id, speed, delay, offset, toComplete, effect );

      // id - Parent ID of containing svg elements
      // speed - SVG Element build speed, (per element ) : 0 = No Effect 
      // delay - Time before SVG Grouping starts to build
      // offset - Overlap between the svg elements ex `-.8` or `.3`
      // toComplete - Overwrites speed, if needs to be built in a specifit time frame
      // effect - Draw or fadeIn

// To overwrite & controll specific speeds for indiviudal svg element, add ` data-speed="#" ` attribute to element.

var svgController = {

      // Default Settings
      shapes: 'line, circle, path, rect, polygon, polyline',
      excludeClass: 'exclude',
      toComplete: false,
      effect: 'draw', // draw, fadeIn
      delay: 0,
      offset: '-0.8',
      speed: .5,
      visible: false,



      /**
      *
      * Used to overwrite defaults from svg inline data attributes
      *
      * @param el is the parent svg
      */
      setDefaultsInline: function( el ) {

            var $this = el;

            if( $this.data('speed') ) this.speed = $this.data( 'speed' );
            if( $this.data('offset') ) this.offset = $this.data( 'offset' );
            if( $this.data('delay') ) this.delay = $this.data( 'delay' );
            if( $this.data('effect') ) this.effect = $this.data( 'effect' );
            if( $this.data('toComplete') ) this.toComplete = $this.data( 'toComplete' );

      },

      /**
      *
      * Used to calculate square footage
      *
      * @param a x1
      * @param b y1
      * @param c x2
      * @param d y2
      */
      calculateSqrt: function (a, b, c, d) {
        return c = parseFloat(c) - parseFloat(a), d = parseFloat(d) - parseFloat(b), Math.sqrt(c * c + d * d)
      },


      /**
      *
      * Used to get function name
      *
      * @param string is the tagname of element
      * @return the function name
      */
      getFunctionName: function( string ) {
            var capitalizeTag = string.charAt(0).toUpperCase() + string.slice(1);
            return 'get' + capitalizeTag + 'Length';
      },


      /**
      *
      * Used to get fade in the svg image
      *
      * @param el is the parent svg
      */
      visibleToggle: function( el ) {
            if ( ! this.visible ) {
                  this.visible = true;
                  TweenLite.to( el, 2, { opacity:1 } );
            } 
      },


      /**
      *
      * Used to get the length of a rect
      *
      * @param el is the rect element ex $('.rect')
      * @return the length of the rect in px
      */
      getRectLength: function( el ) {
            return 2 * (el.width + el.height);
      },


      /**
      *
      * Used to get the length of a polygon
      *
      * @param el is the Polygon element ex $('.polygon')
      * @return the length of the polygon in px
      */
      getPolygonLength: function( el ) {
            var c = 'polygon';
            for ( f = el.attr("points").split(" "), d = 0, i = f[0].split(","), "polygon" === c && (f.push(f[0]), -1 === f[0].indexOf(",") && f.push(f[1])), j = 1; j < f.length; j++) {
                  h = f[j].split(",");
                  1 === h.length && ( h[1] = f[j++] )
                  2 === h.length && (d += this.calculateSqrt( i[0], i[1], h[0], h[1] ) || 0, i = h);
            }
            return d;
      },


      /**
      *
      * Used to get the length of a line
      *
      * @param el is the line element ex $('.line')
      * @return the length of the line in px
      */
      getLineLength: function( el ) {
            return this.calculateSqrt( el.attr('x1'), el.attr('y1'), el.attr('x2'), el.attr('y2') );
      },


      /**
      *
      * Used to get the length of a circle
      *
      * @param el is the circle element
      * @return the length of the circle in px
      */
      getCircleLength: function( el ) {
            return 2 * Math.PI * parseFloat( el.attr('r') );
      },


      /**
      *
      * Used to get the length of the path
      *
      * @param el is the path element
      * @return the length of the path in px
      */
      getPathLength: function( el ) {
            return el.get(0).getTotalLength();
      },


      /**
      *
      * Used to get the length of the polyline
      *
      * @param el is the path element
      * @return the length of the polyline in px
      */
      getPolylineLength: function( el ) {
            for ( f = el.attr("points").split(" "), d = 0, i = f[0].split(","), j = 1; j < f.length; j++) {
                  h = f[j].split(",");
                  1 === h.length && ( h[1] = f[j++] )
                  2 === h.length && (d += this.calculateSqrt( i[0], i[1], h[0], h[1] ) || 0, i = h);
            }
            return d;
      },


      /**
      *
      * Used to get the tagname and call the correct function for length
      *
      * @param el is a svg element
      * @return the function to get the length of svg element
      */
      getSVGElementLength: function( el ) {

            var call = this.getFunctionName( el.prop( "tagName" ) );
            return this[ call ]( el );

      },


      /**
      *
      * Used to get the tagname and call the correct function for length
      *
      * @param el is a svg element
      * @return the function to get the length of svg element
      */
      setOffset: function( string ) {

            if( string < 0 ) {
                  string = Math.abs(string);
                  return ' -= ' + string; 
            } else {
                  string = Math.abs(string);
                  return ' += ' + string
            }

      },


      /**
      *
      * Used to draw in svg element
      *
      * @param id is the number of svg element
      * @param el is the element
      * @param options are the animation options
      * @param animation is the GreenSock aniamtion clip
      * @return the animation clip of the fade in effect
      */
      drawShape: function(id, el, options, animation) {

            var $this = el, length = this.getSVGElementLength( $this ), buildSpeed = options.speed, offset = options.offset;
            
            if( $this.data('speed') ) buildSpeed = $this.data( 'speed' );
            if( $this.data('offset') ) offset = $this.data( 'offset' );

            offset = this.setOffset( offset );

            if( isNaN(length) ) { // TEMP FIX A FIREFOX BUG
                  length = 200
            }
            
            $this.get(0).style.strokeDasharray = length + ' ' + length;
            $this.get(0).style.strokeDashoffset = length;

            animation.add( TweenMax.to( $this.get(0).style , buildSpeed, { strokeDashoffset: 0 }, ( id > 0 ) ? offset : '' ) );
            return animation;

      },


      /**
      *
      * Used to fade in svg element
      *
      * @param id is the number of svg element
      * @param el is the element
      * @param options are the animation options
      * @param animation is the GreenSock aniamtion clip
      * @return the animation clip of the fade in effect
      */
      fadeInShape: function(id, el, options, animation) {

            var $this = el, buildSpeed = options.speed, offset = options.offset;

            if( $this.data('speed') ) buildSpeed = $this.data( 'speed' );
            if( $this.data('offset') ) offset = $this.data( 'offset' );

            offset = this.setOffset( offset );

            $this.get(0).style.opacity = 0;

            animation.add( TweenMax.to( $this.get(0).style , buildSpeed, { opacity: 1 }, ( id > 0 ) ? offset : '' ) );
            return animation;

      },

      
      /**
      *
      * Used to get find if the element has data inline
      *
      * @param el is the svg element
      * @return the object with properties: speed, offset, toComplete, effect
      */
      dataOverwrite: function( el, current, parents ) { /// NEEEDS WORK

            var options = {}, dataObject = el.data();

            if( typeof( parents ) != 'undefined' ) { current = parents; }
            if( ! $.isEmptyObject( dataObject ) ) {   
                  options.speed = ( dataObject['speed'] ? dataObject['speed'] : current.speed );
                  options.offset = ( dataObject['offset'] ? dataObject['offset'] : current.offset );
                  options.toComplete = ( dataObject['toComplete'] ? dataObject['toComplete'] : current.toComplete );
                  options.effect = ( dataObject['effect'] ? dataObject['effect'] : current.effect );
            } else {
                  options = current;
            }
            return options;

      },


      /**
      *
      * Initialize SVG
      *
      * @param id is the element containing the svg shapes ex $('svg') or $('g')
      * @param speed is the speed in which element animates in secs
      * @param delay the amount of time before the animation starts
      * @param toComplete overwrites the speed and takes the number of svg elements and divides it by secs
      * @param effect is either draw out or fade in effect
      */
      initSVG: function( id, speed, delay, offset, toComplete, effect ) {

            this.visibleToggle( $( '#' + id ).parents('svg') );
            this.setDefaultsInline( $( '#' + id ).parents('svg') );

            var options = {}, og_options = {}, shapes = $( this.shapes, '#' + id ).not( '.' + this.excludeClass );

            if ( typeof( speed ) === 'undefined' || speed == null ) { og_options.speed = this.speed; } else { og_options.speed = speed; }
            if ( typeof( delay ) === 'undefined' || delay == null  ) { og_options.delay = this.delay; } else { og_options.delay = delay; }
            if ( typeof( offset ) === 'undefined' || offset == null  ) { og_options.offset = this.offset; } else { og_options.offset = offset; }
            if ( typeof( toComplete ) === 'undefined' || toComplete == null  ) { og_options.toComplete = this.toComplete; } else { og_options.toComplete = toComplete; }
            if ( toComplete ) og_options.speed = (toComplete / shapes.length) ;
            if ( typeof( effect ) === 'undefined' || effect == null  ) { og_options.effect = this.effect; } else { og_options.effect = effect; }

            options = this.dataOverwrite ( $( '#' + id ), og_options );

            var animation = new TimelineMax( { delay: delay } );
            animation.pause();
            $( shapes ).each(function( i, e ) {
                  var shape_options, shape_parents = $( this ).parents('g') ;
                  $( shape_parents.get().reverse() ).each(function( i, e ) {
                        shape_options = svgController.dataOverwrite ( $(this), options, shape_options);  
                  })
                  if( shape_options.effect === 'draw' ) svgController.drawShape( i, $( this ), shape_options, animation );
                  if( shape_options.effect === 'fadeIn' ) svgController.fadeInShape( i, $( this ), shape_options, animation );
            });
            animation.play();

      }
}