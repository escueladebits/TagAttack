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

var Flickr = (function() {
  // Based in flickr API method: flickr.people.getPhotos
  // https://www.flickr.com/services/api/explore/flickr.people.getPublicPhotos
  var local = false;

  var jsonResponse = null;

  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        jsonResponse = JSON.parse(httpRequest.responseText);
      }
    }
  };
  httpRequest.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=588ed2f326df81d5a7382e1bf64da098&user_id=12403504%40N02&safe_search=1&per_page=1024&page=212&format=json&nojsoncallback=1', true);
  httpRequest.send(null);

  FlickrFeeder = {
    available : function() {
    return jsonResponse !== null;
    },
    getTagged: function() {
      if (local) {
        return new FlickrPhoto('11283386124,https://flickr.com/photos/britishlibrary/11283386124,portrait,https://farm8.staticflickr.com/7362/11283386124_dfe1b160a5_q.jpg,https://farm8.staticflickr.com/7362/11283386124_dfe1b160a5_m.jpg,https://farm8.staticflickr.com/7362/11283386124_dfe1b160a5.jpg,https://farm8.staticflickr.com/7362/11283386124_dfe1b160a5_b.jpg');
      } else {
        if (jsonResponse !== null && jsonResponse.photos.photo.length > 0) {
          return new FlickrPhoto2(jsonResponse.photos.photo.shift());
        }
      }
    },
    getUntagged: function() {
      if (local) {
        return new FlickrPhoto('11252771705,https://flickr.com/photos/britishlibrary/11252771705,UNTAGGED,https://farm4.staticflickr.com/3718/11252771705_65d8525c1d_q.jpg,https://farm4.staticflickr.com/3718/11252771705_65d8525c1d_m.jpg,https://farm4.staticflickr.com/3718/11252771705_65d8525c1d.jpg,https://farm4.staticflickr.com/3718/11252771705_65d8525c1d_b.jpg');
      } else {
        if (jsonResponse !== null && jsonResponse.photos.photo.length > 0) {
          return new FlickrPhoto2(jsonResponse.photos.photo.shift());
        }
      }
    },
    push: function(photo) {

    },
  };

  function FlickrPhoto2 (json) {
    this.farm = json.farm;
    this.id = json.id;
    this.isfamily = json.isfamily;
    this.ispublic = json.ispublic;
    this.owner = json.owner;
    this.secret = json.secret;
    this.server = json.server;
    this.title = json.title;
  }
  FlickrPhoto2.prototype.path = function() {
    var url = 'https://farm' + this.farm + '.staticflickr.com/' + this.server;
    url += '/' + this.id + '_' + this.secret + '_m.jpg';
    return url;
  };

  function FlickrPhoto (csv) {
    var data = csv.split(',');

    this.flickrid = data[0];
    this.url = data[1];
    this.tag = data[2];
    this.largeSquare = data[3];
    this.small = data[4];
    this.medium = data[5];
    this.large = data[6];

    this.ready = false;
    this.image = null;
    this.downloading = false;
  };

  FlickrPhoto.prototype.path = function() {
    var p = local ? "data/repo_all/" + this.flickrid + ".jpg" : this.small;
    return p;
  };

  return {
    Feeder: FlickrFeeder,
  }
})();
