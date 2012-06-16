/*!
 *    jQuery Pulse
 *
 *    ©2012 James Thoburn http://jthoburn.com
 *
 *    distributed under the MIT license.
 *
 *---------------------------------------------------------
 *    
 *    An abstract function for producing 'pulse' effects on an element.
 *    This function currently only supports color and dimension animation, and does not support css shorthand
 *     e.g. use 'background-color' not background
 *
 *    the 'properties' parameter expects an object with css attributes as properties and an array with a minimum of 2 values
 *    to toggle between on the pulse.  Giving more than two values causes intermediate values to behave like 'color stops'
 *
 *
 *
 *
 * the 'period' parameter sets the total number of milliseconds for the function to run once: e.g. from purple to blue and back to purple again.    
 */

(function() {
    function fixHexLength(s) {
        while (s.length < 2) {
            s='0'+s;
        }
        return s;
    }

    function Color() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 1;
        this.format = 'rgba';
        this.string = function(t) {
            if (!t) {
                t = this.format;
            }
            switch (t) {
            case 'rgb':
                return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
            case 'rgba':
                return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
            case 'argb':
                return '#' + fixHexLength(this.a.toString(16)) + fixHexLength(this.r.toString(16)) + fixHexLength(this.g.toString(16)) + fixHexLength(this.b.toString(16));
            default:
                return '#' + fixHexLength(this.r.toString(16)) + fixHexLength(this.g.toString(16)) + fixHexLength(this.b.toString(16));
            }
        };
    }

    function colorFromString(color) {

        var colors = new Color();

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(color);
        if (result === null) {
            if (color.indexOf('rgba') != -1) {
                result = /.*?rgb\((\d+),\s?(\d+),\s?(\d+),\s?(\d+)\)/i.exec(color);
                colors.format = 'rgba';
            }
            else {
                if (color.indexOf('rgb') != -1) {
                    result = /.*?rgb\((\d+),\s?(\d+),\s?(\d+)\)/i.exec(color);
                    colors.format = 'rgb';
                }
                else {
                    return colors;
                }
            }
        }
        else {
            colors.format = 'hex';
        }
        colors.r = parseInt(result[1], 16);
        colors.g = parseInt(result[2], 16);
        colors.b = parseInt(result[3], 16);

        if (result[4] !== undefined) {
            colors.a = colors.r;
            colors.r = colors.g;
            colors.g = colors.b;
            colors.b = parseInt(result[4], 16);
            colors.format = 'argb';
        }
        return colors;
    }

    function pulseType(prop, value) {
        if (prop.indexOf('color') != -1) {
            return 'color';
        }
        if (!value) { return 'px'; }
        if (value.toString().indexOf('px') != -1) {
            return 'px';
        }
        if (value.toString().indexOf('%') != -1) {
            return '%';
        }
        if (value.toString().indexOf('em') != -1) {
            return 'em';
        }
    }

    $.fn.pulse = function(properties, period) {
        this.addClass('jQuery-pulse');

        var css = this.get(0).style,
            original = {},
            that = this;

        if (!period) { period = 1000; }


        //internal recursive function

        function pulsate(property, values, pType, curr, next, ms) {
            if (that.hasClass('jQuery-pulse')) {
                switch (pType) {
                case 'px':
                case '%':
                case 'em':
                        
                case 'gradient':
                case 'color':
            

                    

                        
                    //    10/ms*(width-w)
                   if(curr.r != values[next].r)   
                    curr.r += Math.round( 10 / ms * (values[next].r - curr.r) );
                    
                   if(curr.g != values[next].g)          
                    curr.g += Math.round( 10 / ms * (values[next].g - curr.g));
                       
                   if(curr.b != values[next].b)       
                    curr.b += Math.round( 10 / ms * (values[next].b - curr.b));
                     
                   if(curr.a != values[next].a)       
                    curr.a += Math.round( 10 / ms * (values[next].a - curr.a));

                    if (curr.r == values[next].r && curr.g == values[next].g && curr.b == values[next].b && curr.a == values[next].a) {
                        next++;
                        if (next == values.length) {
                            var a = new Date().getTime();
                            console.log(a - start);
                            start = a;
                            values = values.reverse();
                            next = 1;
                        }
                      ms = period / 2 / (values.length-1);
                    }   
                    css[property] = curr.string();




                    break;
                
                default:
                    break;
                }
                //async recurse
                setTimeout((function() {
                    pulsate(property, values, pType, curr, next, ms-10);
                }), 10);
            }
            else {
                //re-add original properties
                for (var p in original) {
                    if (original.hasOwnProperty(p)) {
                        css[p] = original[p];
                    }
                }
            }
        }

        for (var prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                original[prop] = css[prop];
                var pT = pulseType(prop, css[prop]);

                //convert colors to usable colors
                if (pT == 'color') {
                    for (var color in properties[prop]) {
                        if (properties[prop].hasOwnProperty(color)) {
                            properties[prop][color] = colorFromString(properties[prop][color]);
                        }
                    }
                }
                var start = new Date().getTime();

                pulsate(prop, properties[prop], pT, colorFromString(properties[prop][0].string()), 1, period/2);
            }
        }
    };



    $.fn.endPulse = function(properties) {
        this.removeClass('jQuery-pulse');
    };

})(jQuery);