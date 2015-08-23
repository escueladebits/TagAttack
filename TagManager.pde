/*
  Copyright 2015 Antonio Jesús Sánchez Padial
  
  See License info at the end of the file.
*/

static class TagManager {

  private static TagManager singleton = null;
  
  private static String[] tags = {
    "heraldry",
    "portrait",
    "diagram",
    "cycling",
    "people",  
    "archit",
    "music",
    "fauna",
    "flora",
    "map",
  };

  private TagManager() {
  }

  static TagManager access() {
    if (singleton == null) {
      singleton = new TagManager();
    }
    return singleton;
  }

  String[] getNRandomTags(int n) {
    String[] collection = new String[n];
    int[] indexes = new int[n];
    for (int i = 0; i < n; i++) {
      int candidate;
      do {
        candidate = int(tags.length * (float)Math.random());
      } while (contains(indexes, candidate));
      indexes[i] = candidate;
    }
    indexes = sort(indexes);
    for (int i = 0; i < n; i++) {
      collection[i] = tags[indexes[i]];
    }
    return collection;
  }

  private boolean contains(int[] heystack, int needle) {
    for (int i = 0; i < heystack.length; i++) {
      if (heystack[i] == needle) {
        return true;
      }
    }
    return false;
  }
}

/*
  This file is part of Tag Attack.
  
  Tag Attack is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Tag Attack is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/