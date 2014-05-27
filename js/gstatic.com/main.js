scramblers['333'].initialize(null, Math);

window.addEventListener('message', function (e) {
    var data = e.data;
    if ((e.origin.match(/^https?:\/\/www\.google\.com/) && data.addbutton) ||
        (e.origin === 'https://gstatic.com' && data.controls)) {
        var button = window.document.createElement('button');
        button.innerText = 'solve';
        button.style.position = 'absolute';
        button.style.top = 0;
        button.addEventListener('click', function (e) {
            // get state from 'data-posit', and calculate solution
            var posit = document.body.getAttribute('data-posit');
            var solution = scramblers['333'].solution(posit);
            console.log(solution);
            var twist = '';
            solution.trim().split(/\s+/).reverse().forEach(function (e) {
                if (e.length === 2) {
                    if (e[1] === '2') {
                        twist += e[0] + e[0];
                    } else {
                        twist += e[0];
                    }
                } else {
                    twist += e[0].toLowerCase();
                }
            });
            window.postMessage({ solution: twist }, 'https://gstatic.com');
        });
        window.document.body.appendChild(button);
    }
});

// http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script
(function () {
    var code = function () {
        // update 'data-posit' when twisted
        cube.addEventListener('onTwistComplete', function (e) {
            var posit = '';
            var colormap = {};
            colormap[cube.up.cubelets[4].up.color.initial]       = 'U';
            colormap[cube.left.cubelets[4].left.color.initial]   = 'L';
            colormap[cube.front.cubelets[4].front.color.initial] = 'F';
            colormap[cube.right.cubelets[4].right.color.initial] = 'R';
            colormap[cube.back.cubelets[4].back.color.initial]   = 'B';
            colormap[cube.down.cubelets[4].down.color.initial]   = 'D';
            [8, 7, 6, 5, 4, 3, 2, 1, 0].forEach(function (i) {
                posit += colormap[cube.up.cubelets[i].up.color.initial];
            });
            [8, 7, 6, 5, 4, 3, 2, 1, 0].forEach(function (i) {
                posit += colormap[cube.right.cubelets[i].right.color.initial];
            });
            [8, 7, 6, 5, 4, 3, 2, 1, 0].forEach(function (i) {
                posit += colormap[cube.front.cubelets[i].front.color.initial];
            });
            [2, 5, 8, 1, 4, 7, 0, 3, 6].forEach(function (i) {
                posit += colormap[cube.down.cubelets[i].down.color.initial];
            });
            [6, 3, 0, 7, 4, 1, 8, 5, 2].forEach(function (i) {
                posit += colormap[cube.left.cubelets[i].left.color.initial];
            });
            [6, 3, 0, 7, 4, 1, 8, 5, 2].forEach(function (i) {
                posit += colormap[cube.back.cubelets[i].back.color.initial];
            });
            window.document.body.setAttribute('data-posit', posit);
        });
        // execute solution
        window.addEventListener('message', function (e) {
            var data = e.data;
            if (e.origin === 'https://gstatic.com' && data.solution) {
                cube.twistDuration = 250;
                cube.twist(data.solution);
            }
        });
    };
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ code.toString() +'());'));
    document.body.appendChild(script);
}());
