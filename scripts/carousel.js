
<script type="text/javascript">
    $(function () {
        var initCarousel = function (data) {
            var C = $("#" + data.id + " .carousel");
            var T = $("#" + data.id + " .tabs");
            var images = [];
            var selected = 0;
            var total = data.d.length;
            if(!total)
                return false;
            var width = C.width();
            var height = C.height();
            var maxHeight = 280;
            var maxWidth = 550;
          
            var maxAngle = Math.PI * 2;
            var angleStep = maxAngle / total;
            var angle = 0;
            var setRotate = function(i)
            {
                return function()
                {
                    rotateTo(i);
                }
            };
            
            var per = 100 / total;
            for(var i = 0; i < total ; i++)
            {
                var d = data.d[i];
                var el = $("<li><a href='" + d.link + "' title='"+ d.title +"'><img src='/Test/ImageFilter.aspx?url=" + d.imgSrc + "' width='100%' /></a></li>");
                images.push({ el: el, angle: angle });
                C.append(el);
                var tab = $("<li><h3>" + d.title + "</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p></li>");
                tab.css("width", per + "%");
                tab.click(setRotate(i));
                T.append(tab);
                angle += angleStep;
            }
            
            $("#" + data.id + " .next").click(function(){nextImage()});
            $("#" + data.id + " .prev").click(function(){prevImage()});
            angle = 0;
            var rotateStep = 10;
            var rotateInterval = 100;
            if(data.rotateStep)
                rotateStep = data.rotateStep;
            if(data.rotateInterval)
                rotateInterval = data.rotateInterval;
            var interval = null;
            var render = function () {
                var z = [];
                for (var i = 0; i < total; i++) {
                    var image = images[i];
                    var a = image.angle - angle;
                    var el = image.el;
                    var x = Math.round(Math.sin(a) * 1000000) / 1000000;
                    var y = Math.round(Math.cos(a) * 1000000) / 1000000;
                    var scale = .2 + (y + 1) * .4;
                    var w = scale * maxWidth;
                    var h = scale * maxHeight;
                    z.push({el: el, y: y });
                    el.css("left", x * (width / 4) + (width / 2) - (w / 2));
                    el.css("top", y * 150 + (height / 2) - h);
                    el.css("height", h);
                    el.css("width", w);
                }
                z.sort(function (a, b) { if(a.y > b.y)return 1;if(a.y < b.y) return -1;return 0; });
                
                for (var i = 0; i < total; i++) {
                    z[i].el.css("zIndex", 500 + i * 10);
                }
            }
            var normAngle = function (a) {
                while (a >= maxAngle)
                    a -= maxAngle;
                while (a < 0)
                    a += maxAngle;
                return a;
            }
            var rotateAnim = function (angleInt, goalAngle) {
                var transition = Math.max(.01,  Math.abs(getShortAngle(angle, goalAngle)) / 5);
                angle += angleInt * transition;
                if ((angleInt > 0 && (angle > goalAngle)) || ((angleInt < 0) && (angle < goalAngle)) || angleInt == 0) {
                    angle = normAngle(goalAngle);
                    clearInterval(interval);                   
                    if(data.rotate)
                        interval = setTimeout(nextImage, data.rotate);
                }
                render();
            }
            function getShortAngle(a1, a2) {
                var a = normAngle(a1 - a2);
                if (a > Math.PI)
                    a -= maxAngle;
                if (a < -Math.PI)
                    a += maxAngle;
                return a;
            }
            var rotateTo = function (index, dir) {
                $("li", T).removeClass("active");
                selected = index;
                angle = normAngle(angle);
                $("li:eq(" + selected + ")", T).addClass("active");
                clearInterval(interval);
                interval = null;
                
                var a = images[index].angle;
                if (a != angle) {
                    var angleInt = 1;
                    var short = getShortAngle(a, angle);
                    if(short > 0 && angle > a)
                        a += maxAngle;
                    if(short < 0)
                    {
                        angleInt = -1;
                        if(angle < a)
                            a -= maxAngle;
                    }
                    interval = setInterval(function () { rotateAnim(angleInt, a) }, rotateInterval);
                }
            }
            var nextImage = function () {
                var index = selected + 1;
                rotateTo(normSelection(index));
            }
            var prevImage = function () {
                var index = selected - 1;
                rotateTo(normSelection(index));
            }
            var normSelection = function(index)
            {
                while (index >= total)
                    index -= total;
                while (index < 0)
                    index += total;
                return index;
            }
            render();
            rotateTo(0);
            if(data.rotate)
                interval = setTimeout(nextImage, data.rotate);
        }
        //Carousel data here
        var Carousel_Data = [];
        initCarousel({id: "Carousel", d: Carousel_Data, rotate: 5000, rotateStep: 15, rotateInterval: 50});
    });
</script>
