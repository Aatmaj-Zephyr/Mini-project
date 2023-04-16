
window.addEventListener('load', () => {
    var i = 0;
    move(i);


});

/**
 * The function creates a progress bar that fills up to 100% and then redirects the user to a different
 * webpage.
 */
function move(i) {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("innerProgressBar");
        var width = 1;
        var id = setInterval(frame, 60);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
                //wait 1 seonds before redirect
                setTimeout(() => {
                    window.location.href = "./index.html";
                }, 1000);
            } else {
                width++;
                elem.style.width = width + "%";
            }
        }
    }



}
