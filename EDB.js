/*
  Copyright 2015 Antonio Jesús Sánchez Padial

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var EDB = {

  loadImageHTML : function(path, success, fail) {
    function ImageHTML(width, height) {
      this.img = null;

      this.draw = function(ctx, x, y, w, h) {
        if (this.img != null) {
          ctx.drawImage(this.img, x, y, w, h);
        }
      };
    };

    var img = new Image();
    var edbImage = new ImageHTML();
    edbImage.img = img;

    img.onload = function(i) {
      if (typeof success == 'function') {
        success(i);
      }
    };

    img.onerror = function(e) {
      console.log('error downloading: ' + path);
      if (typeof fail == 'function') {
        fail(e);
      }
    };

    img.src = path;

    return edbImage;
  },
};
